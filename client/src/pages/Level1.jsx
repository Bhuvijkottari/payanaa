// src/pages/Level1.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db, auth } from "../firebase";

export default function Level1({ unlockNextLevel }) {
  const navigate = useNavigate();
  const userId = auth.currentUser.uid;

  const [points, setPoints] = useState(0);
  const [completedGames, setCompletedGames] = useState([]);

  const games = [
    { name: "Flash Tag", path: "/flash-tag", color: "#F59E0B", desc: "Quickly identify Tamil letters!" },
    { name: "Match Letter", path: "/match-letter", color: "#EF4444", desc: "Match letters with visuals!" },
    { name: "Drag & Drop", path: "/drag-drop", color: "#10B981", desc: "Drag letters to correct spots!" },
    { name: "Flip Flop", path: "/flipflop", color: "#3B82F6", desc: "Flip cards to reveal matching letters!" },
  ];

  // Fetch user's points from Firebase on mount
  useEffect(() => {
    const fetchPoints = async () => {
      const docRef = doc(db, "users", userId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setPoints(docSnap.data().rewards || 0);
      }
    };
    fetchPoints();
  }, [userId]);

  // Update Firebase points
  const addPoints = async (earned) => {
    const newPoints = points + earned;
    setPoints(newPoints);
    await setDoc(doc(db, "users", userId), { rewards: newPoints }, { merge: true });
  };

  const handleGameClick = async (game) => {
    navigate(game.path);

    if (!completedGames.includes(game.name)) {
      setCompletedGames([...completedGames, game.name]);
      await addPoints(10); // Add 10 points for completing a game
    }

    if (completedGames.length + 1 === games.length) {
      unlockNextLevel?.();
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-6 bg-black text-white">
      {/* Title */}
      <h1 className="text-4xl font-extrabold mb-8 text-center text-purple-300">
        🎯 Level 1: Learn Tamil Letters
      </h1>

      {/* Points Display */}
      <div className="mb-12 px-6 py-3 rounded-full shadow-md text-lg font-semibold text-purple-900 bg-purple-200">
        🏆 Points: {points}
      </div>

      {/* Games Grid */}
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
