// src/pages/MatchLetter.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db, auth } from "../../firebase";
import Confetti from "react-confetti";
import { useTranslation } from "react-i18next";

export default function MatchLetter({ unlockNextLevel }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const userId = auth.currentUser.uid;

  const letters = [
    { letter: "அ", name: "a", audio: "/audio/a.mp3" },
    { letter: "ஆ", name: "aa", audio: "/audio/aa.mp3" },
    { letter: "இ", name: "i", audio: "/audio/i.mp3" },
    { letter: "ஈ", name: "ii", audio: "/audio/ii.mp3" },
    { letter: "உ", name: "u", audio: "/audio/u.mp3" },
    { letter: "ஊ", name: "uu", audio: "/audio/uu.mp3" },
    { letter: "எ", name: "e", audio: "/audio/e.mp3" },
    { letter: "ஏ", name: "ee", audio: "/audio/ee.mp3" },
  ];

  const [shuffledNames, setShuffledNames] = useState([]);
  const [matches, setMatches] = useState({});
  const [message, setMessage] = useState("");
  const [showConfetti, setShowConfetti] = useState(false);
  const [score, setScore] = useState(0); // Session score
  const [totalRewards, setTotalRewards] = useState(0); // Firebase cumulative rewards

  useEffect(() => {
    setShuffledNames(shuffleArray(letters.map((l) => l.name)));
    fetchProgress();
    fetchRewards();
  }, []);

  const fetchProgress = async () => {
    const docRef = doc(db, "users", userId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const completed = docSnap.data().level1?.matchesCompleted || [];
      const updatedMatches = {};
      completed.forEach((letter) => (updatedMatches[letter] = true));
      setMatches(updatedMatches);
    }
  };

  const fetchRewards = async () => {
    const docRef = doc(db, "users", userId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) setTotalRewards(docSnap.data().rewards || 0);
  };

  const shuffleArray = (arr) => arr.sort(() => Math.random() - 0.5);

  const playLetterAudio = (letterObj) => {
    if (!letterObj.audio) return;
    new Audio(letterObj.audio).play().catch(() => console.log("Audio missing for", letterObj.letter));
  };

  const handleDrop = async (e, name) => {
    const letter = e.dataTransfer.getData("letter");
    const letterObj = letters.find((l) => l.letter === letter);
    if (!letterObj) return;

    if (letterObj.name === name) {
      setMatches((prev) => ({ ...prev, [letter]: true }));
      setScore((prev) => prev + 1);
      setShowConfetti(true);
      setMessage(t("correct"));
      setTimeout(() => setShowConfetti(false), 2000);

      // Update Firebase
      const docRef = doc(db, "users", userId);
      const docSnap = await getDoc(docRef);
      let completed = [];
      if (docSnap.exists()) completed = docSnap.data().level1?.matchesCompleted || [];
      if (!completed.includes(letter)) completed.push(letter);

      const currentRewards = docSnap.exists() ? docSnap.data().rewards || 0 : 0;
      const newTotal = currentRewards + 1;
      setTotalRewards(newTotal);

      await setDoc(
        docRef,
        { level1: { matchesCompleted: completed }, rewards: newTotal },
        { merge: true }
      );

      if (completed.length === letters.length) {
        setMessage(t("level_completed"));
        unlockNextLevel(1);
        setTimeout(() => navigate("/level2"), 2000);
      }
    } else {
      setMessage(t("try_again"));
    }
  };

  const handleDragStart = (e, letterObj) => {
    e.dataTransfer.setData("letter", letterObj.letter);
    playLetterAudio(letterObj);
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-gray-900 text-white gap-6 p-6">
      {showConfetti && <Confetti numberOfPieces={200} recycle={false} />}
      <h2 className="text-4xl font-extrabold text-purple-400 text-center mt-4">
        🎯 {t("match_letters_title")}
      </h2>
      {message && <p className="text-lg text-gray-300 animate-pulse">{message}</p>}

      {/* Letter Cards */}
      <div className="flex flex-wrap justify-center gap-6 mt-6 relative">
        {letters.map((l) => (
          <div
            key={l.letter}
            draggable={!matches[l.letter]}
            onDragStart={(e) => handleDragStart(e, l)}
            className={`w-24 h-24 flex items-center justify-center text-3xl font-bold rounded-2xl shadow-xl cursor-move
                        ${matches[l.letter] ? "bg-green-600 cursor-default" : "bg-gradient-to-r from-purple-600 to-purple-800 hover:scale-105 transition-transform"}`}
          >
            {l.letter}
            {!matches[l.letter] && (
              <button
                onClick={() => playLetterAudio(l)}
                className="absolute mt-16 text-xl text-yellow-300 hover:text-yellow-400"
              >
                🔊
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Drop Targets */}
      <h3 className="mt-8 text-2xl font-semibold text-purple-400">{t("drop_instruction")}</h3>
      <div className="flex flex-wrap justify-center gap-6 mt-4">
        {shuffledNames.map((name) => (
          <div
            key={name}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => handleDrop(e, name)}
            className="w-32 h-16 flex items-center justify-center bg-gray-700 rounded-xl shadow-lg text-xl hover:bg-gray-600 transition-colors"
          >
            {name}
          </div>
        ))}
      </div>

      <p className="mt-6 text-xl">
        ⭐ {t("session_score")}: {score}
      </p>
    </div>
  );
}
