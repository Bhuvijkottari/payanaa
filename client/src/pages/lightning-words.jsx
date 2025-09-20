
import React, { useState, useEffect } from "react";
import quizData from "../data/lightning_words.json"; // JSON file with sentences and options

export default function LightningWords() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showSentence, setShowSentence] = useState(true);
  const [selectedWords, setSelectedWords] = useState([]);
  const [message, setMessage] = useState("");
  const [score, setScore] = useState(0);

  useEffect(() => {
    // Show sentence for 10 seconds, then hide and show options
    const timer = setTimeout(() => setShowSentence(false), 10000);
    return () => clearTimeout(timer);
  }, [currentQuestion]);

  const handleWordClick = (word) => {
    setSelectedWords((prev) => [...prev, word]);
  };

  const handleCheck = () => {
    const correctSentence = quizData[currentQuestion].sentence;
    const userSentence = selectedWords.join(" ");

    if (userSentence.trim() === correctSentence.trim()) {
      setMessage("🎉 Correct! Well done!");
      setScore((prev) => prev + 1);
    } else {
      setMessage("⚠ Almost there! Try again.");
    }
  };

  const handleNext = () => {
    setCurrentQuestion((prev) =>
      prev + 1 < quizData.length ? prev + 1 : 0
    );
    setSelectedWords([]);
    setMessage("");
    setShowSentence(true);
  };

  const currentData = quizData[currentQuestion];

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h2>⚡ Lightning Words Quiz</h2>
      {showSentence ? (
        <h3 style={{ fontSize: "24px", marginTop: "30px" }}>
          {currentData.sentence}
        </h3>
      ) : (
        <>
          <h3>Assemble the sentence:</h3>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              marginTop: "20px",
              gap: "10px",
            }}
          >
            {currentData.options.map((word, i) => (
              <button
                key={i}
                onClick={() => handleWordClick(word)}
                style={{
                  padding: "10px 15px",
                  fontSize: "18px",
                  cursor: "pointer",
                  borderRadius: "6px",
                  background: "#E1BEE7",
                  border: "1px solid #4A148C",
                }}
              >
                {word}
              </button>
            ))}
          </div>

          <div style={{ marginTop: "20px", fontSize: "20px" }}>
            Your sentence: <b>{selectedWords.join(" ")}</b>
          </div>

          <button
            onClick={handleCheck}
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
            Check
          </button>
          <div style={{ marginTop: "15px", fontSize: "18px", color: "#4A148C" }}>
            {message}
          </div>

          <button
            onClick={handleNext}
            style={{
              marginTop: "20px",
              padding: "10px 20px",
              fontSize: "18px",
              background: "#2E7D32",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            Next Question
          </button>
        </>
      )}

      <div style={{ marginTop: "30px", fontSize: "20px" }}>
        Score: {score} / {quizData.length}
      </div>
    </div>
  );
}