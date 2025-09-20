// src/pages/games/SentenceShuffler.jsx
import React, { useState, useEffect } from "react";
import { db, auth } from "../../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

const sentencesData = [
  {
    correct: "ராமன் பள்ளிக்கு செல்கிறான்",
    words: ["செல்கிறான்", "ராமன்", "பள்ளிக்கு"], // shuffled
  },
  {
    correct: "அவள் பால் குடிக்கிறாள்",
    words: ["குடிக்கிறாள்", "அவள்", "பால்"], // shuffled
  },
  {
    correct: "பூனை மேஜை மேல் அமர்ந்தது",
    words: ["மேஜை", "அமர்ந்தது", "பூனை", "மேல்"], // shuffled
  },
  // 👉 Add more shuffled Tamil sentences here
];

export default function SentenceShuffler() {
  const userId = auth.currentUser.uid;
  const [qIndex, setQIndex] = useState(0);
  const [selectedWords, setSelectedWords] = useState([]);
  const [score, setScore] = useState(0); // Session score
  const [totalRewards, setTotalRewards] = useState(0); // Firebase total rewards
  const [message, setMessage] = useState("");

  const currentSentence = sentencesData[qIndex];

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

  const handleWordClick = (word) => {
    if (!selectedWords.includes(word)) {
      setSelectedWords([...selectedWords, word]);
    }
  };

  const handleCheck = async () => {
    const formedSentence = selectedWords.join(" ");
    if (formedSentence === currentSentence.correct) {
      setScore((prev) => prev + 1);
      setMessage("✅ Correct!");

      // Update Firebase total rewards
      const newTotal = totalRewards + 1;
      setTotalRewards(newTotal);
      await setDoc(
        doc(db, "users", userId),
        { rewards: newTotal },
        { merge: true }
      );
    } else {
      setMessage("❌ Try Again!");
    }

    setTimeout(() => {
      if (qIndex < sentencesData.length - 1) {
        setQIndex(qIndex + 1);
        setSelectedWords([]);
        setMessage("");
      } else {
        alert(`🎉 Game Over! Session Score: ${score}/${sentencesData.length}`);
        setQIndex(0);
        setScore(0); // Reset session points
        setSelectedWords([]);
        setMessage("");
      }
    }, 1200);
  };

  const handleReset = () => {
    setSelectedWords([]);
    setMessage("");
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
        background: "linear-gradient(135deg, #0f172a, #1e3a8a)",
        color: "#fff",
      }}
    >
      <h1 style={{ fontSize: "32px", marginBottom: "10px", color: "#FCD34D" }}>
        🔀 Sentence Shuffler
      </h1>
      <h2 style={{ fontSize: "22px", marginBottom: "20px" }}>
        Arrange the words in correct order
      </h2>

      {/* Word Buttons */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "15px",
          marginBottom: "20px",
        }}
      >
        {currentSentence.words.map((word, idx) => (
          <button
            key={idx}
            onClick={() => handleWordClick(word)}
            style={{
              padding: "12px 20px",
              borderRadius: "10px",
              border: "none",
              fontSize: "20px",
              fontWeight: "bold",
              background: selectedWords.includes(word) ? "#6B7280" : "#3B82F6",
              color: "#fff",
              cursor: "pointer",
              transition: "transform 0.2s ease, background 0.2s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            {word}
          </button>
        ))}
      </div>

      {/* Selected Sentence */}
      <div
        style={{
          minHeight: "40px",
          marginBottom: "20px",
          fontSize: "22px",
          fontWeight: "bold",
          color: "#F9FAFB",
        }}
      >
        {selectedWords.join(" ")}
      </div>

      {/* Actions */}
      <div style={{ display: "flex", gap: "15px" }}>
        <button
          onClick={handleCheck}
          style={{
            background: "#10B981",
            padding: "12px 25px",
            borderRadius: "10px",
            border: "none",
            fontSize: "18px",
            cursor: "pointer",
            color: "#fff",
            fontWeight: "bold",
          }}
        >
          ✅ Check
        </button>
        <button
          onClick={handleReset}
          style={{
            background: "#EF4444",
            padding: "12px 25px",
            borderRadius: "10px",
            border: "none",
            fontSize: "18px",
            cursor: "pointer",
            color: "#fff",
            fontWeight: "bold",
          }}
        >
          🔄 Reset
        </button>
      </div>

      {/* Message */}
      {message && (
        <p
          style={{
            marginTop: "20px",
            fontSize: "20px",
            fontWeight: "bold",
            color: message.includes("Correct") ? "#10B981" : "#F87171",
          }}
        >
          {message}
        </p>
      )}

      <p style={{ marginTop: "30px", fontSize: "18px" }}>
        ⭐ Session Score: {score} | ❓ Question {qIndex + 1}/{sentencesData.length}
      </p>
      <p style={{ marginTop: "5px", fontSize: "18px", color: "#FCD34D", fontWeight: "bold" }}>
        
      </p>
    </div>
  );
}
