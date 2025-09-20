import { useState, useEffect } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db, auth } from "../../firebase";
import questions from "../../data/rapidfire.json";

export default function RapidFire() {
  const userId = auth.currentUser.uid;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [timer, setTimer] = useState(15);
  const [score, setScore] = useState(0); // Session score
  const [selected, setSelected] = useState("");
  const [showAnswer, setShowAnswer] = useState(false);
  const [quizOver, setQuizOver] = useState(false);
  const [totalRewards, setTotalRewards] = useState(0); // Firebase cumulative rewards

  useEffect(() => {
    fetchRewards();
  }, []);

  useEffect(() => {
    if (quizOver) return;

    if (timer > 0 && !showAnswer) {
      const countdown = setTimeout(() => setTimer(timer - 1), 1000);
      return () => clearTimeout(countdown);
    }

    if (timer === 0 && !showAnswer) {
      setShowAnswer(true);
      setTimeout(() => handleNext(), 2000);
    }
  }, [timer, showAnswer, quizOver]);

  const fetchRewards = async () => {
    const docRef = doc(db, "users", userId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) setTotalRewards(docSnap.data().rewards || 0);
  };

  const handleAnswer = async (option) => {
    setSelected(option);
    let correct = false;
    if (option === questions[currentIndex].answer) {
      setScore((prev) => prev + 1);
      correct = true;

      // Update Firebase rewards
      const docRef = doc(db, "users", userId);
      const docSnap = await getDoc(docRef);
      const currentRewards = docSnap.exists() ? docSnap.data().rewards || 0 : 0;
      const newTotal = currentRewards + 1;
      setTotalRewards(newTotal);

      await setDoc(docRef, { rewards: newTotal }, { merge: true });
    }

    setShowAnswer(true);
    setTimeout(() => handleNext(), 2000);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setTimer(15);
      setSelected("");
      setShowAnswer(false);
    } else {
      setQuizOver(true);
    }
  };

  const handleSkip = () => handleNext();
  const handleSubmit = () => setQuizOver(true);

  if (quizOver) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
        <h1 className="text-3xl font-bold mb-6">🎉 Rapid Fire Quiz Over!</h1>
        <p className="text-2xl mb-2">உங்கள் மதிப்பெண்: {score} / {questions.length}</p>
        <p className="text-xl">💰 Total Rewards: {totalRewards}</p>
      </div>
    );
  }

  const currentQ = questions[currentIndex];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold mb-4">⚡ Rapid Fire Quiz ⚡</h1>
      <div className="mb-4 text-xl">
        கேள்வி {currentIndex + 1} / {questions.length}
      </div>
      <div className="mb-4 text-lg">⏳ நேரம்: {timer} விநாடிகள்</div>

      <div className="bg-gray-800 p-6 rounded-xl shadow-lg mb-6 w-full max-w-xl text-center">
        <h2 className="text-2xl font-semibold mb-4">{currentQ.question}</h2>
        <div className="grid grid-cols-2 gap-4">
          {currentQ.options.map((opt, i) => (
            <button
              key={i}
              onClick={() => handleAnswer(opt)}
              disabled={showAnswer}
              className={`px-4 py-2 rounded-lg text-lg font-medium 
                ${showAnswer && opt === currentQ.answer ? "bg-green-500" : ""}
                ${showAnswer && opt === selected && opt !== currentQ.answer ? "bg-red-500" : ""}
                ${!showAnswer ? "bg-blue-500 hover:bg-blue-600" : "bg-gray-600"}
              `}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-4">
        <button
          onClick={handleSkip}
          className="px-4 py-2 bg-yellow-500 rounded-lg hover:bg-yellow-600"
        >
          Skip
        </button>
        <button
          onClick={handleSubmit}
          className="px-4 py-2 bg-red-500 rounded-lg hover:bg-red-600"
        >
          Submit Test
        </button>
      </div>

      <p className="mt-6 text-xl">⭐ Session Score: {score} </p>
    </div>
  );
}
