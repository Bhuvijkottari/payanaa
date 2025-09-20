// src/pages/Level1.jsx
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db, auth } from "../../firebase";
import { useTranslation } from "react-i18next";

export default function Level1({ unlockNextLevel }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const userId = auth.currentUser.uid;

  const letters = [
    { letter: "அ", name: "a" }, { letter: "ஆ", name: "aa" },
    { letter: "இ", name: "i" }, { letter: "ஈ", name: "ii" },
    { letter: "உ", name: "u" }, { letter: "ஊ", name: "uu" },
    { letter: "எ", name: "e" }, { letter: "ஏ", name: "ee" },
    { letter: "ஐ", name: "ai" }, { letter: "ஒ", name: "o" },
    { letter: "ஓ", name: "oo" }, { letter: "ஔ", name: "au" },
    { letter: "க", name: "ka" }, { letter: "ங", name: "nga" },
    { letter: "ச", name: "cha" }, { letter: "ஞ", name: "nya" },
    { letter: "ட", name: "ta" }, { letter: "ண", name: "na1" },
    { letter: "த", name: "tha" }, { letter: "ந", name: "na2" },
    { letter: "ப", name: "pa" }, { letter: "ம", name: "ma" },
    { letter: "ய", name: "ya" }, { letter: "ர", name: "ra1" },
    { letter: "ல", name: "la1" }, { letter: "வ", name: "va" },
    { letter: "ழ", name: "zha" }, { letter: "ள", name: "la2" },
    { letter: "ற", name: "ra2" }, { letter: "ன", name: "na3" },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [message, setMessage] = useState("");
  const [recognizedText, setRecognizedText] = useState("");
  const [drawingMessage, setDrawingMessage] = useState("");
  const [points, setPoints] = useState(0);

  const canvasRef = useRef(null);
  const [drawing, setDrawing] = useState(false);
  const recognitionRef = useRef(null);

  // Fetch current rewards and progress
  useEffect(() => {
    const fetchData = async () => {
      const docRef = doc(db, "users", userId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setPoints(data.rewards || 0);
        if (data.level1?.lettersCompleted) {
          const lastIndex = data.level1.lettersCompleted.length;
          setCurrentIndex(lastIndex < letters.length ? lastIndex : letters.length - 1);
        }
      }
    };
    fetchData();
  }, [userId]);

  const addReward = async (earnedPoints) => {
    const newPoints = points + earnedPoints;
    setPoints(newPoints);
    await setDoc(doc(db, "users", userId), { rewards: newPoints }, { merge: true });
  };

  // --- Speech Recognition ---
  const startSpeechRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return setMessage(t("speech_not_supported"));

    if (recognitionRef.current) recognitionRef.current.abort();

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.start();
    setMessage(t("listening"));

    recognition.onresult = (event) => {
      const speechResult = event.results[0][0].transcript.trim().toLowerCase();
      setRecognizedText(speechResult);
      checkAnswer(speechResult, currentIndex);
    };

    recognition.onerror = (event) => setMessage(t("speech_error") + event.error);
    recognition.onend = () => { recognitionRef.current = null; };
  };

  // --- Speak Letter using Flask TTS ---
  const speakLetter = async (letterObj) => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/speak-word?text=${encodeURIComponent(letterObj.letter)}&lang=ta`);
      if (!response.ok) throw new Error("Audio fetch failed");

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audio.volume = 1.0;
      audio.load();
      await audio.play();
    } catch (err) {
      console.error(err);
      setMessage(t("missing_audio", { letter: letterObj.letter }));
    }
  };

  const getRandomMessage = (type) => {
    const success = [t("well_done"), t("correct_nice"), t("awesome"), t("you_got_it")];
    const fail = [t("try_again"), t("almost_there"), t("not_quite"), t("keep_going")];
    return type === "success" ? success[Math.floor(Math.random() * success.length)]
                              : fail[Math.floor(Math.random() * fail.length)];
  };

  const similarity = (s1, s2) => {
    s1 = s1.toLowerCase(); s2 = s2.toLowerCase();
    let longer = s1.length > s2.length ? s1 : s2;
    let shorter = s1.length > s2.length ? s2 : s1;
    const longerLength = longer.length;
    if (longerLength === 0) return 1.0;
    return (longerLength - editDistance(longer, shorter)) / longerLength;
  };

  const editDistance = (s1, s2) => {
    const costs = [];
    for (let i = 0; i <= s1.length; i++) {
      let lastValue = i;
      for (let j = 0; j <= s2.length; j++) {
        if (i === 0) costs[j] = j;
        else if (j > 0) {
          let newValue = costs[j - 1];
          if (s1.charAt(i - 1) !== s2.charAt(j - 1)) 
            newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
          costs[j - 1] = lastValue;
          lastValue = newValue;
        }
      }
      if (i > 0) costs[s2.length] = lastValue;
    }
    return costs[s2.length];
  };

  const checkAnswer = async (text, index) => {
    const currentLetter = letters[index];
    const sim = similarity(text, currentLetter.name);
    if (sim >= 0.8) {
      setMessage(getRandomMessage("success"));
      addReward(10);

      const docRef = doc(db, "users", userId);
      const docSnap = await getDoc(docRef);
      let lettersCompleted = [];
      if (docSnap.exists()) lettersCompleted = docSnap.data().level1?.lettersCompleted || [];
      if (!lettersCompleted.includes(currentLetter.letter)) lettersCompleted.push(currentLetter.letter);

      await setDoc(docRef, {
        level1: {
          lettersCompleted,
          badge: lettersCompleted.length === letters.length ? t("letter_master_badge") : "",
        },
      }, { merge: true });

      setTimeout(() => {
        if (index < letters.length - 1) {
          setCurrentIndex(index + 1);
          setRecognizedText(""); setMessage(""); setDrawingMessage("");
        } else {
          setMessage(t("all_letters_completed"));
          unlockNextLevel(1);
          setTimeout(() => navigate("/level2"), 1500);
        }
      }, 1200);
    } else {
      setMessage(getRandomMessage("fail"));
    }
  };

  const nextLetter = () => {
    if (currentIndex < letters.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setRecognizedText(""); setMessage(""); setDrawingMessage("");
    }
  };
  const prevLetter = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setRecognizedText(""); setMessage(""); setDrawingMessage("");
    }
  };

  // --- Drawing ---
  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    canvas.getContext("2d").beginPath();
    canvas.getContext("2d").moveTo(e.clientX - rect.left, e.clientY - rect.top);
    setDrawing(true);
  };
  const draw = (e) => {
    if (!drawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.strokeStyle = "#BB86FC"; ctx.lineWidth = 6; ctx.lineCap = "round"; ctx.stroke();
  };
  const stopDrawing = () => {
    setDrawing(false);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const hasDrawn = imageData.data.some((pixel) => pixel !== 0);
    setDrawingMessage(hasDrawn ? t("drawing_great") : t("drawing_try_again"));
  };
  const clearCanvas = () => {
    const canvas = canvasRef.current;
    canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
    setDrawingMessage("");
  };

  const currentLetter = letters[currentIndex];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white gap-6 p-4">
      <h2 className="text-4xl font-extrabold text-purple-400 text-center">{t("level1_title")}</h2>

      {/* Letter Card */}
      <div className="relative w-56 h-56 bg-gray-800 rounded-3xl shadow-2xl flex flex-col items-center justify-center hover:scale-105 transition-transform">
        <span className="text-6xl font-bold">{currentLetter.letter}</span>
        <button className="absolute bottom-3 right-3 text-2xl" onClick={() => speakLetter(currentLetter)}>🔊</button>
      </div>

      {/* Controls */}
      <div className="flex gap-4 flex-wrap justify-center">
        <button onClick={startSpeechRecognition} className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-800 rounded-2xl font-bold shadow-lg hover:scale-105 transition-transform">{t("repeat_after_me")}</button>
        <button onClick={prevLetter} className="px-6 py-3 bg-gray-700 rounded-2xl font-bold shadow-md hover:scale-105 transition-transform">⬅ {t("previous")}</button>
        <button onClick={nextLetter} className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-800 rounded-2xl font-bold shadow-lg hover:scale-105 transition-transform">{t("next")} ➡</button>
      </div>

      {/* Points & Messages */}
      <p className="text-green-400 text-lg font-semibold">{t("current_points", { points })}</p>
      <p className="text-lg text-gray-300">{message}</p>
      {recognizedText && <p className="text-gray-400">{t("your_answer")}: {recognizedText}</p>}

      {/* Drawing */}
      <h3 className="mt-4 text-2xl font-semibold text-purple-400">✍️ {t("practice_drawing")}</h3>
      <canvas
        ref={canvasRef}
        width={220} height={220}
        className="border-2 border-purple-600 rounded-2xl cursor-crosshair bg-gray-800"
        onMouseDown={startDrawing} onMouseMove={draw} onMouseUp={stopDrawing} onMouseLeave={stopDrawing}
      />
      {drawingMessage && <p className="text-green-400">{drawingMessage}</p>}
      <button onClick={clearCanvas} className="mt-2 px-6 py-2 bg-red-600 rounded-2xl font-bold hover:scale-105 transition-transform">{t("clear_canvas")}</button>
    </div>
  );
}
