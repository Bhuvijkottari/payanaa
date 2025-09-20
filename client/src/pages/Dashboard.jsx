// src/pages/Dashboard.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { db } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import LevelSelect from "../components/LevelSelect";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { Bar } from "react-chartjs-2";
import { useNavigate } from "react-router-dom";
import Lottie from "lottie-react";
import backgroundAnimation from "../assets/background.json";
import { useTranslation } from "react-i18next";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function Dashboard() {
  const { t, i18n } = useTranslation();
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const [currentLevel, setCurrentLevel] = useState(null);
  const [unlockedLevels, setUnlockedLevels] = useState([1]);
  const [dailyProgress, setDailyProgress] = useState({});
  const [streak, setStreak] = useState(0);
  const [rewards, setRewards] = useState(0); 
  const themePurple = "#8B5CF6";
  const topBarGray = "#1F1F1F";
  const cardBg = "rgba(31, 18, 56, 0.85)";
  const accuracy = 82;
  const userId = currentUser?.uid;

  // Fetch user data from Firestore
  useEffect(() => {
    if (!userId) return;
    const fetchUserData = async () => {
      const userRef = doc(db, "users", userId);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const data = userSnap.data();
        setDailyProgress(data.dailyProgress || {});
        setStreak(data.streak || 0);
        setUnlockedLevels(data.unlockedLevels || [1]);
        setRewards(data.rewards || 0);
      }
    };
    fetchUserData();
  }, [userId]);

  // Complete a level
  const completeLevel = async (level) => {
    const today = new Date().toISOString().split("T")[0];
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);

    let newDailyProgress = {};
    let newStreak = streak;
    let newUnlocked = [...unlockedLevels];

    if (userSnap.exists()) {
      const data = userSnap.data();
      newDailyProgress = data.dailyProgress || {};
      newStreak = data.streak || 0;
      newUnlocked = data.unlockedLevels || [1];
    }

    if (!newUnlocked.includes(level + 1)) newUnlocked.push(level + 1);

    const percent = Math.min((newUnlocked.length / 5) * 100, 100);
    newDailyProgress[today] = percent;

    const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
    newStreak = newDailyProgress[yesterday] ? newStreak + 1 : 1;

    await setDoc(
      userRef,
      { dailyProgress: newDailyProgress, streak: newStreak, unlockedLevels: newUnlocked },
      { merge: true }
    );

    setDailyProgress(newDailyProgress);
    setStreak(newStreak);
    setUnlockedLevels(newUnlocked);
    setCurrentLevel(null);
  };

  const barData = {
    labels: Object.keys(dailyProgress),
    datasets: [
      {
        label: t("progress_overview"),
        data: Object.values(dailyProgress),
        backgroundColor: themePurple,
        borderRadius: 6,
      },
    ],
  };

  const changeLanguage = (lng) => i18n.changeLanguage(lng);

  return (
    <div style={{ display: "flex", minHeight: "100vh", position: "relative" }}>
      {/* Background animation */}
      <Lottie
        animationData={backgroundAnimation}
        loop
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100vh",
          zIndex: 0,
        }}
      />

      {/* Language Selector */}
<div className="absolute top-28 right-16 z-20">
  <select
    onChange={(e) => changeLanguage(e.target.value)}
    value={i18n.language}
    className="px-4 py-2 rounded-lg bg-purple-600 text-white font-semibold shadow-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-pink-400 cursor-pointer"
  >
    <option value="en">English</option>
    <option value="es">Español</option>
    <option value="hi">Hindi</option>
    <option value="kn">Kannada</option>
    <option value="ml">Malayalam</option>
    {/* Add more languages here */}
  </select>
</div>


      {/* Sidebar */}
      <aside style={sidebarStyle}>
        <h2 style={{ ...sidebarTitleStyle, color: themePurple }}>Payana</h2>
        <nav style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          <button style={sidebarButtonStyle}>{t("dashboard")}</button>
          <button onClick={() => navigate("/parent")} style={sidebarButtonStyle}>{t("parent")}</button>
          <button onClick={() => navigate("/elearning")} style={sidebarButtonStyle}>{t("elearning")}</button>
          <button onClick={() => navigate("/Materials")} style={sidebarButtonStyle}>{t("materials")}</button>
          <button onClick={() => navigate("/history-tamil-computing")} style={sidebarButtonStyle}>{t("history")}</button>
          <button onClick={() => navigate("/contact")} style={sidebarButtonStyle}>{t("contact")}</button>
          <button onClick={logout} style={{ ...sidebarButtonStyle, background: "#b91c1c", marginTop: "auto" }}>{t("logout")}</button>
        </nav>
      </aside>

      {/* Main Content */}
      <div style={{ flex: 1, position: "relative", zIndex: 1, padding: "30px" }}>
        {/* Top Bar */}
        <div style={topBarStyle}>
          <h1 style={{ color: "pink", fontSize: "28px", fontWeight: "bold" }}>{t("welcome")}</h1>
          <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
            <input type="text" placeholder={t("search")} style={searchInputStyle} />
            <button onClick={() => navigate("/premium")} style={premiumButtonStyle}>{t("premium")}</button>
            <span style={{ fontWeight: "bold", color: "#fff" }}>{currentUser?.displayName || currentUser?.email}</span>
          </div>
        </div>

        {/* Levels Section */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "20px", marginBottom: "30px" }}>
          {!currentLevel ? (
            <LevelSelect
              unlockedLevels={unlockedLevels}
              setCurrentLevel={setCurrentLevel}
              themeColors={[themePurple, themePurple, themePurple, themePurple, themePurple]}
            />
          ) : (
            <div style={{ ...statCardStyle, textAlign: "center", background: cardBg }}>
              <h2>{t("level_running", { level: currentLevel })}</h2>
              <button onClick={() => completeLevel(currentLevel)} style={completeLevelButtonStyle}>{t("complete_level")}</button>
            </div>
          )}
        </div>

        {/* Progress Chart */}
        <div style={{ marginBottom: "30px" }}>
          <div style={{ ...statCardStyle, background: cardBg, height: "320px" }}>
            📊 <h2>{t("progress_overview")}</h2>
            <Bar data={barData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
          </div>
        </div>

        {/* Bottom Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px" }}>
          <div style={{ ...statCardStyle, background: cardBg }}>
            🔥 <h2>{t("streak_days", { streak })}</h2>
            <p>{t("keep_it_going")}</p>
          </div>

          <div style={{ ...statCardStyle, background: cardBg }}>
            🎯 <h2>{t("accuracy")}</h2>
            <CircularProgressbar value={accuracy} text={`${accuracy}%`} styles={buildStyles({ textColor: "#fff", pathColor: themePurple, trailColor: "#333" })} />
          </div>

          <div style={{ ...statCardStyle, background: cardBg }}>
            🏆 <h2>{t("achievements")}</h2>
            <p>{t("total_rewards", { rewards })}</p>
            <p>{t("collect_badges")}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

const statCardStyle = {
  borderRadius: "16px",
  padding: "20px",
  color: "#fff",
  boxShadow: "0 8px 20px rgba(0,0,0,0.3)",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  gap: "10px",
};

const sidebarStyle = {
  width: "250px",
  minHeight: "100vh",
  background: "linear-gradient(to bottom, #150B2E, #2A0944)",
  color: "#fff",
  padding: "30px 20px",
  display: "flex",
  flexDirection: "column",
  gap: "25px",
  boxShadow: "2px 0 20px rgba(0,0,0,0.7)",
  zIndex: 1,
};

const sidebarTitleStyle = {
  fontSize: "28px",
  fontWeight: "bold",
  textAlign: "center",
};

const sidebarButtonStyle = {
  padding: "12px 20px",
  background: "#6B21A8",
  color: "#fff",
  border: "none",
  borderRadius: "10px",
  fontWeight: "bold",
  fontSize: "16px",
  cursor: "pointer",
};

const topBarStyle = {
  height: "60px",
  background: "#1F1F1F",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "0 20px",
  borderRadius: "12px",
  marginBottom: "25px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
};

const searchInputStyle = {
  padding: "8px 15px",
  borderRadius: "20px",
  border: "1px solid #333",
  width: "220px",
  background: "rgba(18,18,18,0.85)",
  color: "#fff",
};

const premiumButtonStyle = {
  padding: "8px 18px",
  borderRadius: "20px",
  border: "none",
  background: "linear-gradient(45deg, #FFD700, #FFA500)",
  color: "#000",
  fontWeight: "bold",
  cursor: "pointer",
  boxShadow: "0 4px 10px rgba(255, 215, 0, 0.5)",
};

const completeLevelButtonStyle = {
  marginTop: "20px",
  padding: "10px 20px",
  background: "#8B5CF6",
  color: "#fff",
  border: "none",
  borderRadius: "10px",
  cursor: "pointer",
};
