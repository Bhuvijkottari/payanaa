// src/components/LevelSelect.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function LevelSelect({ themeColors }) {
  const navigate = useNavigate();
  const { t } = useTranslation(); // ✅ i18n hook

  const levels = [
    { id: 1, nameKey: "level1_letters", path: "/level1" },
    { id: 2, nameKey: "level2_words", path: "/level2" },
    { id: 3, nameKey: "level3_sentences", path: "/level3" },
    { id: 4, nameKey: "level4_paragraphs", path: "/level4" },
    { id: 5, nameKey: "final_test", path: "/final-test" },
  ];

  const cozySymbol = ""; // cozy decorative symbol

  return (
    <div className="flex flex-col items-center gap-10 mt-10 w-full">
      {/* First Row (3 Levels) */}
      <div className="flex gap-8 justify-center flex-wrap">
        {levels.slice(0, 3).map((level, index) => (
          <button
            key={level.id}
            onClick={() => navigate(level.path)}
            style={{
              background: themeColors?.[index] || "#7C3AED",
              border: "none",
              borderRadius: "20px",
              width: "300px",
              height: "180px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              color: "#fff",
              fontWeight: "bold",
              fontSize: "24px",
              boxShadow: "0 10px 25px rgba(0,0,0,0.3)",
              transition: "transform 0.25s ease, box-shadow 0.25s ease",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-12px)";
              e.currentTarget.style.boxShadow = "0 15px 30px rgba(0,0,0,0.4)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 10px 25px rgba(0,0,0,0.3)";
            }}
          >
            {t(level.nameKey)} {cozySymbol}
          </button>
        ))}
      </div>

      {/* Second Row (2 Levels) */}
      <div className="flex gap-8 justify-center flex-wrap">
        {levels.slice(3, 5).map((level, index) => (
          <button
            key={level.id}
            onClick={() => navigate(level.path)}
            style={{
              background: themeColors?.[index + 3] || "#7C3AED",
              border: "none",
              borderRadius: "20px",
              width: "300px",
              height: "180px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              color: "#fff",
              fontWeight: "bold",
              fontSize: "24px",
              boxShadow: "0 10px 25px rgba(0,0,0,0.3)",
              transition: "transform 0.25s ease, box-shadow 0.25s ease",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-12px)";
              e.currentTarget.style.boxShadow = "0 15px 30px rgba(0,0,0,0.4)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 10px 25px rgba(0,0,0,0.3)";
            }}
          >
            {t(level.nameKey)} {cozySymbol}
          </button>
        ))}
      </div>
    </div>
  );
}
