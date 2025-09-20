import React, { useState, useEffect } from "react";
import questionsData from "../../data/rapid_fire.json";
import { db, auth } from "../../firebase";
import { doc, updateDoc, increment } from "firebase/firestore";

export default function RapidFire() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [showScore, setShowScore] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");

  const currentQuestion = questionsData[currentIndex];

  // ✅ Award reward points in USERS collection
  const awardReward = async (points = 10) => {
    try {
      const user = auth.currentUser;
      if (!user) return;
      const userRef = doc(db, "users", user.uid); // 👈 users collection instead of rewards
      await updateDoc(userRef, { rewards: increment(points) });
      console.log(`🏆 ${points} points added to user profile in users collection!`);
    } catch (error) {
      console.error("Error awarding reward:", error);
    }
  };

  useEffect(() => {
    if (showScore) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    if (timeLeft <= 0) {
      handleNext();
    }

    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleOptionClick = (option) => {
    setSelectedOption(option);
  };

  const handleNext = async () => {
    if (selectedOption === currentQuestion.answer) {
      setScore((prev) => prev + 1);
    }
    setSelectedOption("");
    setTimeLeft(15);

    if (currentIndex + 1 < questionsData.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setShowScore(true);
      await awardReward(10); // ✅ Give reward after completing all questions
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h2>⏱ Rapid Fire: English → Tamil</h2>

      {!showScore ? (
        <>
          <h3 style={{ margin: "20px 0" }}>
            {currentIndex + 1}. {currentQuestion.question}
          </h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 150px)",
              gap: "15px",
              justifyContent: "center",
              marginTop: "20px",
            }}
          >
            {currentQuestion.options.map((opt, i) => (
              <button
                key={i}
                onClick={() => handleOptionClick(opt)}
                style={{
                  padding: "10px 15px",
                  fontSize: "18px",
                  cursor: "pointer",
                  borderRadius: "6px",
                  border:
                    selectedOption === opt
                      ? "2px solid #4A148C"
                      : "2px solid #ccc",
                  background: selectedOption === opt ? "#E1BEE7" : "#000",
                  color: "#fff",
                }}
              >
                {opt}
              </button>
            ))}
          </div>
          <div style={{ marginTop: "20px", fontSize: "20px" }}>
            Time Left: {timeLeft}s
          </div>
          <button
            onClick={handleNext}
            style={{
              marginTop: "20px",
              padding: "10px 20px",
              fontSize: "18px",
              background: "#4A148C",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            Next
          </button>
        </>
      ) : (
        <div style={{ fontSize: "24px", marginTop: "30px" }}>
          ✅ Test Completed! <br />
          Your Score: {score} / {questionsData.length}
          <p style={{ marginTop: "10px", fontSize: "18px", color: "green" }}>
            🏆 10 points added to your rewards!
          </p>
        </div>
      )}
    </div>
  );
}
