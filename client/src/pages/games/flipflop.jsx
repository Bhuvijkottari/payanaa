// src/pages/FlipFlop.jsx
import { useEffect, useState } from "react";
import tamilLetters from "../../assets/tamil_letters.txt";
import { db, auth } from "../../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useTranslation } from "react-i18next";

export default function FlipFlop() {
  const { t } = useTranslation();
  const userId = auth.currentUser.uid;

  const [letters, setLetters] = useState([]);
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [points, setPoints] = useState(0); // Page points
  const [totalRewards, setTotalRewards] = useState(0); // Firebase total rewards

  // Fetch current rewards from Firebase
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

  // Load Tamil letters
  useEffect(() => {
    fetch(tamilLetters)
      .then((res) => res.text())
      .then((data) => {
        let arr = data.split("\n").filter((l) => l.trim() !== "");
        arr = arr.slice(0, 13); // Take 13 letters
        const deck = [...arr, ...arr.slice(0, 12)]
          .map((letter, i) => ({ id: i, letter, flipped: false }))
          .sort(() => Math.random() - 0.5);
        setLetters(arr);
        setCards(deck);
      });
  }, []);

  const handleCorrectMatch = async (earnedPoints) => {
    setPoints((prev) => prev + earnedPoints);

    const newTotal = totalRewards + earnedPoints;
    setTotalRewards(newTotal);
    await setDoc(
      doc(db, "users", userId),
      { rewards: newTotal },
      { merge: true }
    );
  };

  const handleFlip = (id) => {
    if (flipped.length === 2 || matched.includes(id)) return;

    const newFlipped = [...flipped, id];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      const [first, second] = newFlipped;
      if (cards[first].letter === cards[second].letter) {
        setMatched((prev) => [...prev, first, second]);
        handleCorrectMatch(10);
      }
      setTimeout(() => setFlipped([]), 1000);
    }
  };

  const resetBoard = () => {
    const reset = [...letters, ...letters.slice(0, 12)]
      .map((letter, i) => ({ id: i, letter, flipped: false }))
      .sort(() => Math.random() - 0.5);
    setCards(reset);
    setFlipped([]);
    setMatched([]);
    setPoints(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 to-black flex flex-col items-center justify-center p-6">
      <h1 className="text-4xl font-extrabold text-pink-400 drop-shadow-lg mb-6 animate-bounce">
        🕹️ {t("flip_game_title")}
      </h1>

      <div className="grid grid-cols-5 gap-4">
        {cards.map((card, index) => {
          const isFlipped = flipped.includes(index) || matched.includes(index);
          return (
            <div
              key={card.id}
              onClick={() => handleFlip(index)}
              className={`w-16 h-20 flex items-center justify-center rounded-2xl cursor-pointer transform transition duration-500 text-2xl ${
                isFlipped
                  ? "bg-pink-600 text-white rotate-y-180"
                  : "bg-gray-800 text-transparent"
              }`}
            >
              {isFlipped ? card.letter : "?"}
            </div>
          );
        })}
      </div>

      <div className="mt-6 flex flex-col items-center gap-4">
        <p className="text-green-400 text-lg font-semibold">
          {t("points_this_round")}: {points}
        </p>
        <button
          onClick={resetBoard}
          className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg shadow-lg transition-transform transform hover:scale-110"
        >
          🔄 {t("reset_board")}
        </button>
      </div>
    </div>
  );
}
