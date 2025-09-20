// src/pages/LetterDragDrop.jsx
import React, { useState, useEffect } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db, auth } from "../../firebase";
import { useTranslation } from "react-i18next";

const letters = [
  { letter: "அ", name: "a" },
  { letter: "ஆ", name: "aa" },
  { letter: "இ", name: "i" },
  { letter: "ஈ", name: "ii" },
  { letter: "உ", name: "u" },
  { letter: "ஊ", name: "uu" },
  { letter: "எ", name: "e" },
  { letter: "ஏ", name: "ee" },
  { letter: "ஐ", name: "ai" },
  { letter: "ஒ", name: "o" },
  { letter: "ஓ", name: "oo" },
  { letter: "ஔ", name: "au" },
  { letter: "க", name: "ka" },
  { letter: "ங", name: "nga" },
  { letter: "ச", name: "cha" },
  { letter: "ஞ", name: "nya" },
  { letter: "ட", name: "ta" },
  { letter: "ண", name: "na" },
  { letter: "த", name: "tha" },
  { letter: "ந", name: "na" },
  { letter: "ப", name: "pa" },
  { letter: "ம", name: "ma" },
  { letter: "ய", name: "ya" },
  { letter: "ர", name: "ra" },
  { letter: "ல", name: "la" },
  { letter: "வ", name: "va" },
  { letter: "ழ", name: "zha" },
  { letter: "ள", name: "la" },
  { letter: "ற", name: "ra" },
  { letter: "ன", name: "na" },
];

export default function LetterDragDrop() {
  const { t } = useTranslation();
  const userId = auth.currentUser.uid;
  const [target, setTarget] = useState({});
  const [message, setMessage] = useState("");
  const [pagePoints, setPagePoints] = useState(0);
  const [totalRewards, setTotalRewards] = useState(0);

  // Fetch rewards and pick initial letter
  useEffect(() => {
    const fetchRewards = async () => {
      const docRef = doc(db, "users", userId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setTotalRewards(docSnap.data().rewards || 0);
      }
    };
    fetchRewards();
    pickRandomLetter();
  }, [userId]);

  const pickRandomLetter = () => {
    const random = letters[Math.floor(Math.random() * letters.length)];
    setTarget(random);
    setMessage("");
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    const draggedLetter = e.dataTransfer.getData("text/plain");
    if (draggedLetter === target.letter) {
      setMessage(`✅ ${t("correct_points_earned", { points: 10 })}`);
      setPagePoints((prev) => prev + 10);

      const newTotal = totalRewards + 10;
      setTotalRewards(newTotal);

      await setDoc(
        doc(db, "users", userId),
        { rewards: newTotal },
        { merge: true }
      );

      setTimeout(() => pickRandomLetter(), 1000);
    } else {
      setMessage(`❌ ${t("wrong_try_again")}`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-gray-900 text-white p-6 gap-6">
      <h2 className="text-4xl font-extrabold text-purple-400">{t("drag_drop_quiz_title")} 🎯</h2>
      <h3 className="text-2xl">{t("find_letter_for")}: <span className="font-bold">{target.name}</span></h3>

      {/* Drop Area */}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        className="mt-4 w-56 h-28 border-4 border-dashed border-purple-600 rounded-xl flex items-center justify-center text-xl font-bold bg-gray-800 hover:bg-gray-700 transition-colors"
      >
        {t("drop_here")}
      </div>

      {/* Letters Grid */}
      <div className="grid grid-cols-6 sm:grid-cols-8 gap-3 mt-6 max-w-xl">
        {letters.map((l, i) => (
          <div
            key={i}
            draggable
            onDragStart={(e) => e.dataTransfer.setData("text/plain", l.letter)}
            className="bg-gray-800 border-2 border-purple-300 rounded-xl p-4 text-2xl font-bold text-center cursor-grab hover:scale-105 transform transition"
          >
            {l.letter}
          </div>
        ))}
      </div>

      <p className="text-lg mt-4">{message}</p>
      <p className="text-lg font-semibold">🏆 {t("points_this_round")}: {pagePoints}</p>
      <p className="text-lg font-semibold text-yellow-400">💰 {t("total_rewards")}: {totalRewards}</p>
    </div>
  );
}
