import React, { useState } from "react";
import data from "../data/paragraphs.json";
import { db, auth } from "../firebase";
import { doc, updateDoc, increment } from "firebase/firestore";

export default function ParagraphQuiz() {
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  // Function to award points in Firebase
  const awardReward = async (points = 5) => {
    try {
      const user = auth.currentUser;
      if (!user) return; // No logged-in user, skip
      const rewardRef = doc(db, "rewards", user.uid);
      await updateDoc(rewardRef, { points: increment(points) });
      console.log(`🏆 ${points} points awarded for paragraph quiz!`);
    } catch (error) {
      console.error("Error awarding points:", error);
    }
  };

  const handleAnswer = async (option) => {
    if (option === data[current].answer) {
      setScore(score + 1);
      alert("✅ சரியான பதில்!");
      await awardReward(5); // Award 5 points per correct answer
    } else {
      alert(`❌ தவறு! சரியான பதில்: ${data[current].answer}`);
    }

    const next = current + 1;
    if (next < data.length) {
      setCurrent(next);
    } else {
      setShowResult(true);
    }
  };

  if (showResult) {
    return (
      <div style={{ textAlign: "center", marginTop: "30px" }}>
        <h2>🎉 தேர்வு முடிந்தது!</h2>
        <p style={{ fontSize: "20px" }}>🏆 உங்கள் மதிப்பெண்: {score} / {data.length}</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "700px", margin: "30px auto", padding: "20px", border: "2px solid #4A148C", borderRadius: "12px" }}>
      <h2 style={{ color: "#4A148C" }}>📖 வாசிப்பு புரிதல் வினா {current + 1} / {data.length}</h2>
      <p style={{ fontSize: "18px", margin: "20px 0", lineHeight: "1.6" }}>
        {data[current].paragraph}
      </p>
      <h3>{data[current].question}</h3>
      <div style={{ marginTop: "15px" }}>
        {data[current].options.map((option, idx) => (
          <button
            key={idx}
            onClick={() => handleAnswer(option)}
            style={{
              display: "block",
              width: "100%",
              margin: "8px 0",
              padding: "12px",
              background: "#000",
              color: "#fff",
              border: "2px solid #E1BEE7",
              borderRadius: "10px",
              fontSize: "18px",
              cursor: "pointer"
            }}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}
