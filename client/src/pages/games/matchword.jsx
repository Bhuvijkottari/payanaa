import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";

export default function MatchWord({ unlockNextLevel }) {
  // Tamil lessons for Level 2
  const lessons = [
    {
      name: "Animals",
      items: [
        { emoji: "🐶", name: "நாய்" },
        { emoji: "🐱", name: "பூனை" },
        { emoji: "🐰", name: "முயல்" },
        { emoji: "🦜", name: "கிளி" },
        { emoji: "🐢", name: "ஆமை" },
        { emoji: "🐴", name: "குதிரை" },
        { emoji: "🐮", name: "பசு" },
        { emoji: "🦁", name: "சிங்கம்" },
        { emoji: "🐷", name: "பன்றி" },
        { emoji: "🐑", name: "செம்மறியாடு" }
      ],
    },
    
    {
      name: "Fruits",
      items: [
        { emoji: "🍎", name: "ஆப்பிள்" },
        { emoji: "🍌", name: "வாழைப்பழம்" },
        { emoji: "🥭", name: "மாம்பழம்" },
        { emoji: "🍇", name: "திராட்சை" },
        { emoji: "🍉", name: "தர்பூசணி" },
        { emoji: "🍓", name: "ஸ்ட்ராபெர்ரி" },
        { emoji: "🍍", name: "அன்னாசி" },
        { emoji: "🥝", name: "கிவி" },
        { emoji: "🍒", name: "செர்ரி" },
        { emoji: "🍑", name: "பீச்" }
      ],
    },
  ];

  const [selectedLesson, setSelectedLesson] = useState(null);
  const [currentItems, setCurrentItems] = useState([]);
  const [currentTarget, setCurrentTarget] = useState(null);
  const [completed, setCompleted] = useState(false);
  const [feedback, setFeedback] = useState("");

  const speak = (text) => {
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = "ta-IN";
    utter.rate = 0.9;
    utter.pitch = 1;
    window.speechSynthesis.speak(utter);
  };

  useEffect(() => {
    if (selectedLesson && !completed && currentTarget?.name) {
      speak(`எங்கே ${currentTarget.name}? அதை இங்கே கொண்டு வா!`);
      setFeedback("");
    }
  }, [currentTarget, completed, selectedLesson]);

  const handleDrop = (item) => {
    if (item.name === currentTarget.name) {
      setFeedback(`🎉 அருமை! நீங்கள் கண்டுபிடித்தீர்கள்: ${item.name}!`);
      const remaining = currentItems.filter((i) => i.name !== item.name);
      if (remaining.length > 0) {
        setTimeout(() => {
          setCurrentItems(remaining);
          setCurrentTarget(remaining[0]);
        }, 1200);
      } else {
        setCompleted(true);
        speak(`வாழ்த்துக்கள்! நீங்கள் முடித்துவிட்டீர்கள் ${selectedLesson.name} பாடம்!`);
        toast.success("⭐ 1 Star added to your rewards!");
      }
    } else {
      setFeedback("❌ மீண்டும் முயற்சி செய்!");
    }
  };

  const startLesson = (lesson) => {
    setSelectedLesson(lesson);
    setCurrentItems([...lesson.items]);
    setCurrentTarget(lesson.items[0]);
    setCompleted(false);
    setFeedback("");
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-purple-900 via-pink-600 to-yellow-500 flex flex-col items-center justify-center p-6 relative text-white">
      {!selectedLesson && (
        <div className="text-center animate-fadeIn">
          <h2 className="text-3xl font-extrabold text-yellow-300 mb-6 drop-shadow-lg">
            🎯 பாடத்தை தேர்ந்தெடுக்கவும்
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-lg mx-auto">
            {lessons.map((lesson) => (
              <button
                key={lesson.name}
                onClick={() => startLesson(lesson)}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:scale-110 transform transition px-5 py-3 rounded-2xl shadow-lg font-bold"
              >
                {lesson.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {selectedLesson && (
        <>
          {!completed && (
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-yellow-300 drop-shadow-md">
                📘 பாடம்: {selectedLesson.name}
              </h2>
              <p className="text-lg text-white mt-2">
                கண்டுபிடிக்க: <b className="text-yellow-200">{currentTarget?.name}</b>
              </p>
            </div>
          )}

          {/* Game Playground */}
          <div className="relative w-[500px] h-[500px] md:w-[650px] md:h-[650px] flex items-center justify-center bg-purple-800/40 rounded-full shadow-2xl border-4 border-yellow-300">
            {currentItems.map((item, index) => {
              const angle = (index / currentItems.length) * 2 * Math.PI;
              const radius = 200;
              const x = radius * Math.cos(angle);
              const y = radius * Math.sin(angle);
              return (
                <div
                  key={item.name}
                  draggable={!completed}
                  onDragStart={(e) => e.dataTransfer.setData("text/plain", item.name)}
                  className="absolute text-5xl cursor-grab hover:scale-125 transition-transform"
                  style={{ left: `calc(50% + ${x}px)`, top: `calc(50% + ${y}px)` }}
                >
                  {item.emoji}
                </div>
              );
            })}

            {/* Drop Zone */}
            {!completed && (
              <div
                className="absolute w-48 h-48 border-4 border-dashed border-yellow-400 rounded-full flex items-center justify-center text-center bg-purple-900/30 hover:bg-purple-900/50 transition-all shadow-xl"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  const name = e.dataTransfer.getData("text/plain");
                  const found = currentItems.find((i) => i.name === name);
                  if (found) handleDrop(found);
                }}
              >
                <p className="text-yellow-200 font-bold text-lg">இங்கே விட்டு விடவும்!</p>
              </div>
            )}
          </div>

          {/* Feedback */}
          {feedback && <p className="mt-6 text-xl font-semibold">{feedback}</p>}

          {/* Completed */}
          {completed && (
            <div className="mt-10 text-center animate-bounce">
              <h2 className="text-3xl font-bold text-yellow-300">🎉 பாடம் முடிந்தது!</h2>
              <button
                onClick={() => setSelectedLesson(null)}
                className="mt-6 bg-gradient-to-r from-pink-500 to-purple-600 hover:scale-110 px-6 py-3 rounded-full font-bold text-white shadow-lg transition"
              >
                🔁 மற்றொரு பாடம்
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
