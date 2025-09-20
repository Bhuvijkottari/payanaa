// src/pages/WordNinja.jsx
import React, { useState, useEffect } from "react";
import { db, auth } from "../../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

const questionsData = [
  {
    sentence: "ராமன் ____ செல்கிறான்.",
    options: ["பள்ளி", "மரம்", "நதி", "வீடு"],
    answer: "பள்ளி",
  },
  {
    sentence: "அவள் ____ சாப்பிடுகிறாள்.",
    options: ["பால்", "மரம்", "நீர்", "வானம்"],
    answer: "பால்",
  },
  {
    sentence: "பூனை ____ மேல் அமர்ந்தது.",
    options: ["மரம்", "நாய்", "மேஜை", "வீடு"],
    answer: "மேஜை",
  },
  // 👉 Add more questions here
];

export default function WordNinja() {
  const userId = auth.currentUser.uid;
  const [level, setLevel] = useState(1);
  const [qIndex, setQIndex] = useState(0);
  const [score, setScore] = useState(0); // Session points
  const [totalRewards, setTotalRewards] = useState(0); // Firebase cumulative points
  const [selected, setSelected] = useState(null);

  const currentQuestion = questionsData[qIndex];

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

  const handleAnswer = async (option) => {
    setSelected(option);

    if (option === currentQuestion.answer) {
      setScore((prev) => prev + 1);

      // Update Firebase total rewards
      const newTotal = totalRewards + 1;
      setTotalRewards(newTotal);
      await setDoc(
        doc(db, "users", userId),
        { rewards: newTotal },
        { merge: true }
      );
    }

    setTimeout(() => {
      if (qIndex < questionsData.length - 1) {
        setQIndex(qIndex + 1);
      } else {
        if (level < 10) {
          setLevel(level + 1);
          setQIndex(0);
        } else {
          alert(`🎉 Game Over! Final Score: ${score}/100`);
          setLevel(1);
          setQIndex(0);
          setScore(0); // Reset session points
        }
      }
      setSelected(null);
    }, 1000);
  };

  return (
    <div
      style={{
        fontFamily: "sans-serif",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "30px",
        minHeight: "100vh",
        background: "linear-gradient(135deg, #1f2937, #111827)",
        color: "#fff",
      }}
    >
      <h1 style={{ fontSize: "32px", marginBottom: "10px", color: "#FBBF24" }}>
        ⚔️ Word Ninja - Level {level}
      </h1>
      <h2 style={{ fontSize: "24px", marginBottom: "20px" }}>
        {currentQuestion.sentence}
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "20px",
          width: "100%",
          maxWidth: "600px",
        }}
      >
        {currentQuestion.options.map((option, idx) => (
          <button
            key={idx}
            onClick={() => handleAnswer(option)}
            style={{
              padding: "20px",
              borderRadius: "12px",
              border: "none",
              fontSize: "20px",
              fontWeight: "bold",
              background:
                selected === option
                  ? option === currentQuestion.answer
                    ? "#10B981"
                    : "#EF4444"
                  : "#3B82F6",
              color: "#fff",
              cursor: "pointer",
              transition: "transform 0.2s ease, background 0.2s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            {option}
          </button>
        ))}
      </div>

      <p style={{ marginTop: "20px", fontSize: "18px" }}>
        ⭐ Session Score: {score} | ❓ Question {qIndex + 1}/{questionsData.length}
      </p>
      <p style={{ marginTop: "5px", fontSize: "18px", color: "#FBBF24", fontWeight: "bold" }}>
        
      </p>
    </div>
  );
}
