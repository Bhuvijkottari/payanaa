// src/pages/Level3.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { doc, getDoc } from "firebase/firestore";
import { db, auth } from "../firebase";

export default function Level3({ unlockNextLevel }) {
  const navigate = useNavigate();
  const userId = auth.currentUser.uid;

  const [totalRewards, setTotalRewards] = useState(0);
  const [completedGames, setCompletedGames] = useState([]);

  const games = [
    { name: "✍️ Word Ninja", path: "/word-ninja", color: "#F59E0B", desc: "Fill in the blanks quickly!" },
    { name: "🔀 Sentence Shuffler", path: "/sentence-shuffler", color: "#8B5CF6", desc: "Rearrange sentences correctly!" },
    { name: "⚡ Lightning Words", path: "/lightning-words", color: "#10B981", desc: "Flash sentences under time pressure!" },
    { name: "🔥 Speed Shots", path: "/speed-shots", color: "#EF4444", desc: "Answer rapid-fire sentence questions!" },
  ];

  // Fetch rewards from Firebase
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

  const handleGameClick = (game) => {
    navigate(game.path);

    if (!completedGames.includes(game.name)) {
      setCompletedGames([...completedGames, game.name]);
      // Optionally, you can increment Firebase rewards here after the user completes a game
    }

    if (completedGames.length + 1 === games.length) {
      unlockNextLevel?.();
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-6 bg-black text-white">
      {/* Title */}
      <h1 className="text-4xl font-extrabold mb-8 text-center text-purple-300">
        🎯 Level 3: Sentences - Choose Your Challenge
      </h1>

      {/* Total Rewards Display */}
      <div className="mb-12 px-6 py-3 rounded-full shadow-md text-lg font-semibold text-purple-900 bg-purple-200">
        💰 Total Rewards: {totalRewards}
      </div>

      {/* Games Grid: 2 cards per row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 w-full max-w-6xl">
        {games.map((game, idx) => {
          const completed = completedGames.includes(game.name);
          return (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative cursor-pointer transition rounded-3xl flex flex-col justify-center items-center font-bold text-3xl h-60"
              style={{
                backgroundColor: game.color,
                boxShadow: "0 12px 30px rgba(0,0,0,0.3)",
              }}
              onClick={() => handleGameClick(game)}
              title={game.desc}
            >
              {completed ? "✅" : "🎮"} {game.name}
            </motion.div>
          );
        })}
      </div>

      {/* Motivation */}
      <p className="mt-16 text-purple-300 text-xl text-center max-w-md">
        Complete all games to unlock the next level 🚀
      </p>
    </div>
  );
}
