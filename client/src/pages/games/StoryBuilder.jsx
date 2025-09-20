import React, { useState, useEffect } from "react";
import stories from "../../data/stories.json";
import { db, auth } from "../../firebase";
import { doc, updateDoc, increment } from "firebase/firestore";

export default function StoryBuilder() {
  const [current, setCurrent] = useState(0);
  const [shuffledSentences, setShuffledSentences] = useState([]);
  const [userOrder, setUserOrder] = useState([]);
  const [message, setMessage] = useState("");
  const [showMoral, setShowMoral] = useState(false);

  useEffect(() => {
    loadStory();
  }, [current]);

  const shuffleArray = (arr) => [...arr].sort(() => Math.random() - 0.5);

  const loadStory = () => {
    const story = stories[current];
    setShuffledSentences(shuffleArray(story.sentences));
    setUserOrder([]);
    setMessage("");
    setShowMoral(false);
  };

  const handleSelect = (sentence) => {
    if (!userOrder.includes(sentence)) {
      setUserOrder([...userOrder, sentence]);
    }
  };

  const awardReward = async (points = 10) => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      const rewardRef = doc(db, "rewards", user.uid);
      await updateDoc(rewardRef, {
        points: increment(points),
      });
      console.log(`🏆 ${points} points awarded!`);
    } catch (error) {
      console.error("Error awarding points:", error);
    }
  };

  const checkAnswer = async () => {
    if (JSON.stringify(userOrder) === JSON.stringify(stories[current].correctOrder)) {
      setMessage("✅ சரியான கதை உருவாக்கப்பட்டது!");
      setShowMoral(true);
      await awardReward(15); // Reward for completing a story correctly
    } else {
      setMessage("❌ தவறு! மீண்டும் முயற்சிக்கவும்.");
    }
  };

  const nextStory = () => {
    if (current < stories.length - 1) {
      setCurrent(current + 1);
    } else {
      setMessage("🎉 எல்லா கதைகளும் முடிந்துவிட்டது!");
    }
  };

  return (
    <div style={{ maxWidth: "700px", margin: "30px auto", padding: "20px", border: "2px solid #4A148C", borderRadius: "12px" }}>
      <h2 style={{ color: "#4A148C" }}>📚 கதை அமைப்பு {current + 1} / {stories.length}</h2>

      <h3>வாக்கியங்களை சரியான வரிசையில் அமைக்கவும்:</h3>

      {/* Shuffled sentences to select */}
      <div style={{ margin: "20px 0" }}>
        {shuffledSentences.map((s, idx) => (
          <button
            key={idx}
            onClick={() => handleSelect(s)}
            disabled={userOrder.includes(s)}
            style={{
              display: "block",
              width: "100%",
              margin: "8px 0",
              padding: "12px",
              background: "#000",
              color: "#fff",
              border: "2px solid #E1BEE7",
              borderRadius: "10px",
              fontSize: "16px",
              cursor: userOrder.includes(s) ? "not-allowed" : "pointer"
            }}
          >
            {s}
          </button>
        ))}
      </div>

      {/* User’s arranged story */}
      <h3>📝 நீங்கள் அமைத்த கதை:</h3>
      <div style={{ background: "#000", padding: "15px", borderRadius: "8px", minHeight: "80px" }}>
        {userOrder.map((s, idx) => (
          <p key={idx}>{idx + 1}. {s}</p>
        ))}
      </div>

      {/* Buttons */}
      <div style={{ marginTop: "15px" }}>
        <button onClick={checkAnswer} style={{ marginRight: "10px", padding: "10px 20px", fontSize: "16px", background: "#4A148C", color: "#fff", borderRadius: "8px", cursor: "pointer" }}>✅ Submit</button>
        {showMoral && (
          <button onClick={nextStory} style={{ padding: "10px 20px", fontSize: "16px", background: "#388E3C", color: "#fff", borderRadius: "8px", cursor: "pointer" }}>➡️ Next</button>
        )}
      </div>

      {/* Result message */}
      <p style={{ marginTop: "15px", fontSize: "18px" }}>{message}</p>

      {/* Moral */}
      {showMoral && (
        <div style={{ marginTop: "15px", padding: "10px", background: "#E8F5E9", borderRadius: "8px" }}>
          <strong>📖 கதைப்பொருள்:</strong> {stories[current].moral}
        </div>
      )}
    </div>
  );
}
