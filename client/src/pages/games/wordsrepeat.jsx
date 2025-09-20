// src/pages/RepeatWords.jsx
import React, { useEffect, useState, useRef } from "react";
import wordsData from "../../assets/words.json";
import { motion } from "framer-motion";
import Confetti from "react-confetti";
import { db, auth } from "../../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

export default function RepeatWords() {
  const userId = auth.currentUser.uid;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [xp, setXp] = useState(0); // Page/session points
  const [totalRewards, setTotalRewards] = useState(0); // Firebase cumulative rewards
  const [recording, setRecording] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const recognitionRef = useRef(null);

  const currentWord = wordsData[currentIndex];

  // Fetch total rewards from Firebase
  useEffect(() => {
    const fetchRewards = async () => {
      const docRef = doc(db, "users", userId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setTotalRewards(docSnap.data().rewards || 0);
      }
    };
    fetchRewards();
  }, [userId]);

  const playAudio = async () => {
    try {
      const textToSpeak = `${currentWord.word}. Meaning: ${currentWord.meaning}`;
      const response = await fetch(
        `http://127.0.0.1:5000/speak-word?text=${encodeURIComponent(
          textToSpeak
        )}&lang=ta`
      );

      if (!response.ok) throw new Error("Failed to fetch word audio");

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);

      const audio = new Audio(audioUrl);
      audio.volume = 1.0;
      await audio.play();
    } catch (err) {
      console.error("Error playing audio:", err);
    }
  };

  const speakFeedback = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "ta-IN";
    window.speechSynthesis.speak(utterance);
  };

  const stringSimilarity = (a, b) => {
    a = a.toLowerCase().trim();
    b = b.toLowerCase().trim();
    if (a === b) return 1;
    const longer = a.length > b.length ? a : b;
    const shorter = a.length > b.length ? b : a;
    const longerLength = longer.length;
    if (longerLength === 0) return 1;
    return (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength);
  };

  const editDistance = (s1, s2) => {
    const costs = [];
    for (let i = 0; i <= s1.length; i++) {
      let lastValue = i;
      for (let j = 0; j <= s2.length; j++) {
        if (i === 0) costs[j] = j;
        else {
          if (j > 0) {
            let newValue = costs[j - 1];
            if (s1.charAt(i - 1) !== s2.charAt(j - 1))
              newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
            costs[j - 1] = lastValue;
            lastValue = newValue;
          }
        }
      }
      if (i > 0) costs[s2.length] = lastValue;
    }
    return costs[s2.length];
  };

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      speakFeedback("Your browser does not support Speech Recognition.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "ta-IN";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = async (event) => {
      const transcript = event.results[0][0].transcript.trim();
      const expected = currentWord.word.trim();

      if (stringSimilarity(transcript, expected) > 0.7) {
        // Correct → Add points
        setXp((xp) => xp + 10);
        setShowConfetti(true);

        // Update Firebase total rewards
        const newTotal = totalRewards + 10;
        setTotalRewards(newTotal);
        await setDoc(
          doc(db, "users", userId),
          { rewards: newTotal },
          { merge: true }
        );

        speakFeedback("✅ சரியானது!");
        setTimeout(() => setShowConfetti(false), 2000);
        nextWord();
      } else {
        speakFeedback(
          `❌ தவறு! மீண்டும் முயற்சிக்கவும். வார்ட்: ${currentWord.word}. அதற்கு பொருள்: ${currentWord.meaning}`
        );
      }
      setRecording(false);
    };

    recognition.onerror = (e) => {
      console.log("Recognition error:", e.error);
      setRecording(false);
    };

    recognitionRef.current = recognition;
  }, [currentWord, totalRewards, userId]);

  const startRecording = () => {
    if (!recognitionRef.current) return;
    setRecording(true);
    recognitionRef.current.start();
  };

  const nextWord = () => {
    if (currentIndex + 1 < wordsData.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      speakFeedback("🎉 அனைத்து வார்ட்ஸ் முடிந்துவிட்டன!");
      setCurrentIndex(0);
      setXp(0); // Reset session points
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#150B2E] via-[#2A0944] to-[#3B185F] flex flex-col items-center justify-center p-6 text-white">
      {showConfetti && <Confetti numberOfPieces={150} recycle={false} />}

      <h1 className="text-4xl font-bold mb-6 text-pink-300">🔁 Repeat After Me</h1>

      <motion.div
        key={currentIndex}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        className="bg-[#1F1F1F]/70 rounded-3xl shadow-2xl p-10 flex flex-col items-center gap-6 w-full max-w-md"
      >
        <p className="text-5xl font-extrabold">{currentWord.word}</p>
        <p className="text-xl text-gray-300">Meaning: {currentWord.meaning}</p>

        <div className="flex gap-4">
          <button
            onClick={playAudio}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-xl font-bold shadow-lg transition transform hover:scale-105"
          >
            🔊 Listen
          </button>

          <button
            onClick={startRecording}
            disabled={recording}
            className={`px-6 py-3 rounded-xl font-bold shadow-lg transition transform hover:scale-105 ${
              recording ? "bg-gray-500 cursor-not-allowed" : "bg-pink-500 hover:bg-pink-600"
            }`}
          >
            {recording ? "🎤 Listening..." : "🎙 Repeat"}
          </button>
        </div>
      </motion.div>

      {/* XP Bar */}
      <div className="w-full max-w-md mt-6">
        <div className="bg-gray-700 rounded-full h-6">
          <motion.div
            className="bg-pink-500 h-6 rounded-full text-center font-bold"
            style={{
              width: `${(xp / (wordsData.length * 10)) * 100}%`,
            }}
            initial={{ width: 0 }}
            animate={{ width: `${(xp / (wordsData.length * 10)) * 100}%` }}
            transition={{ duration: 0.5 }}
          >
            XP: {xp}
          </motion.div>
        </div>
        <p className="mt-2 text-center text-gray-300">
          Progress: {currentIndex + 1} / {wordsData.length} words
        </p>
        <p className="mt-2 text-center text-yellow-300 font-bold">
          
        </p>
      </div>
    </div>
  );
}
