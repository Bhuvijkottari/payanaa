import React, { useState } from "react";
import { doc, updateDoc, increment } from "firebase/firestore";
import { auth, db } from "../../firebase"; // ✅ Make sure this points to your firebase config
import wordData from "../../data/word_search.json";

export default function WordSearch() {
  const [roundIndex, setRoundIndex] = useState(0);
  const [selectedLetters, setSelectedLetters] = useState("");
  const [foundWords, setFoundWords] = useState([]);
  const [message, setMessage] = useState("");
  const [points, setPoints] = useState(0);

  const currentRound = wordData[roundIndex];
  const { grid, words } = currentRound;

  // ✅ Function to save rewards to Firestore
  const updateRewardPoints = async (earnedPoints) => {
    try {
      const user = auth.currentUser;
      if (!user) return; // If not logged in, skip saving

      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        rewards: increment(earnedPoints), // Adds points to existing rewards field
      });
      console.log(`✅ Added ${earnedPoints} points to Firestore`);
    } catch (error) {
      console.error("❌ Error updating rewards:", error);
    }
  };

  const handleLetterClick = (letter) => {
    setSelectedLetters((prev) => prev + letter);
  };

  const handleCheck = () => {
    const found = words.find(
      (w) => w.tamil === selectedLetters && !foundWords.includes(w.tamil)
    );
    if (found) {
      setFoundWords((prev) => [...prev, found.tamil]);
      setMessage(`✅ Word Found: ${found.tamil} - ${found.english}`);

      // ✅ Add points locally and in Firestore
      const earnedPoints = 5; // Each correct word gives 5 points (adjust if needed)
      setPoints((prev) => prev + earnedPoints);
      updateRewardPoints(earnedPoints);
    } else {
      setMessage("❌ Not a word. Try again!");
    }
    setSelectedLetters("");
  };

  const handleNextRound = () => {
    setRoundIndex((prev) => (prev + 1) % wordData.length);
    setFoundWords([]);
    setSelectedLetters("");
    setMessage("");
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h2>🔤 Tamil Word Search</h2>
      <h3>Round {currentRound.round}</h3>

      {/* Points Display */}
      <div style={{ margin: "10px", fontSize: "20px", fontWeight: "bold", color: "#4A148C" }}>
        🎁 Points: {points}
      </div>

      {/* Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 60px)",
          gridGap: "10px",
          justifyContent: "center",
          marginTop: "20px",
        }}
      >
        {grid.flat().map((letter, i) => (
          <button
            key={i}
            onClick={() => handleLetterClick(letter)}
            style={{
              padding: "15px",
              fontSize: "24px",
              fontWeight: "bold",
              cursor: "pointer",
              border: "2px solid #4A148C",
              borderRadius: "8px",
              background: "#000",
            }}
          >
            {letter}
          </button>
        ))}
      </div>

      {/* Selected Letters */}
      <div style={{ marginTop: "20px", fontSize: "22px" }}>
        Selected: <b>{selectedLetters}</b>
      </div>

      {/* Buttons */}
      <div style={{ marginTop: "15px" }}>
        <button
          onClick={handleCheck}
          style={{
            padding: "10px 20px",
            fontSize: "18px",
            marginRight: "10px",
            background: "#4A148C",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          Check
        </button>
        {foundWords.length === words.length && (
          <button
            onClick={handleNextRound}
            style={{
              padding: "10px 20px",
              fontSize: "18px",
              background: "#2E7D32",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            Next Round
          </button>
        )}
      </div>

      {/* Messages */}
      <div style={{ marginTop: "15px", fontSize: "18px", color: "#4A148C" }}>
        {message}
      </div>

      {/* Found Words */}
      <div style={{ marginTop: "15px", fontSize: "18px" }}>
        Found Words: {foundWords.join(", ")}
      </div>
    </div>
  );
}
