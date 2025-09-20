// src/pages/TamilComputingHistory.jsx
import React from "react";

export default function TamilComputingHistory() {
  const themePurple = "#8B5CF6";
  const cardBg = "rgba(31, 18, 56, 0.9)";

  const historyPoints = [
    {
      year: "1980s",
      title: "Early Tamil Computing",
      info: "Initial efforts to encode Tamil text on computers, leading to Tamil typewriters, early fonts, and rudimentary text editors.",
      links: [
        { title: "Early Tamil Computing", url: "https://en.wikipedia.org/wiki/Tamil_computing" }
      ],
      image: "https://upload.wikimedia.org/wikipedia/commons/1/18/Tamil_Typewriter.jpg"
    },
    {
      year: "1990s",
      title: "Unicode & Keyboard Layouts",
      info: "Introduction of Unicode standards for Tamil, development of keyboard layouts (Tamil99, Phonetic) and Tamil software for personal computing.",
      links: [
        { title: "Unicode Tamil", url: "https://www.unicode.org/charts/PDF/U0B80.pdf" },
        { title: "Tamil99 Keyboard", url: "https://www.tamilvu.org" }
      ],
      image: "https://upload.wikimedia.org/wikipedia/commons/8/81/Tamil99_keyboard.png"
    },
    {
      year: "2000s",
      title: "Tamil Web & Localization",
      info: "Growth of Tamil websites, input tools, software localization in Windows & Linux, and e-learning platforms in Tamil.",
      links: [
        { title: "Tamil Localization", url: "https://tamil.webs.com/" },
        { title: "Wikipedia Tamil", url: "https://ta.wikipedia.org/" }
      ],
      image: "https://upload.wikimedia.org/wikipedia/commons/0/0d/Wikipedia-logo-v2-ta.svg"
    },
    {
      year: "2010s",
      title: "Mobile Tamil Computing",
      info: "Introduction of mobile keyboards, Tamil OCR, predictive text, and AI-powered Tamil tools for education and communication.",
      links: [
        { title: "Google Indic Keyboard", url: "https://play.google.com/store/apps/details?id=com.google.android.apps.inputmethod.hindi" },
        { title: "Tamil Virtual Academy", url: "http://www.tamilvu.org/" }
      ],
      image: "https://upload.wikimedia.org/wikipedia/commons/0/0d/Google_Indic_Keyboard_icon.png"
    },
    {
      year: "2020s-Present",
      title: "AI & Advanced Computing",
      info: "AI-based Tamil language models, speech-to-text in Tamil, machine translation, and Tamil content creation tools have become widely accessible.",
      links: [
        { title: "AI Tamil Tools", url: "https://github.com/Tamil-Computing" }
      ],
      image: "https://upload.wikimedia.org/wikipedia/commons/f/f1/AI_icon.svg"
    },
  ];

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#100622" }}>
      {/* Sidebar */}
      <aside
        style={{
          width: "280px",
          minHeight: "100vh",
          background: "linear-gradient(to bottom, #150B2E, #2A0944)",
          color: "#fff",
          padding: "30px 20px",
          display: "flex",
          flexDirection: "column",
          gap: "30px",
          boxShadow: "2px 0 25px rgba(0,0,0,0.8)",
        }}
      >
        <h2 style={{ fontSize: "32px", fontWeight: "bold", color: themePurple, textAlign: "center" }}>
          Payana
        </h2>
        <nav style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          <button onClick={() => window.history.back()} style={sidebarButtonStyle}>Back</button>
          <button onClick={() => window.open("http://www.tamilvu.org/", "_blank")} style={sidebarButtonStyle}>
            Tamil Virtual Academy
          </button>
        </nav>
      </aside>

      {/* Main content */}
      <div style={{ flex: 1, padding: "40px 60px", color: "#fff" }}>
        <h1 style={{ color: themePurple, fontSize: "3rem", marginBottom: "50px", textAlign: "center" }}>
          💻 History of Tamil Computing
        </h1>

        <div style={{ display: "flex", flexDirection: "column", gap: "40px" }}>
          {historyPoints.map((item, idx) => (
            <div
              key={idx}
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: "25px",
                background: cardBg,
                padding: "25px",
                borderRadius: "15px",
                boxShadow: "0 10px 25px rgba(0,0,0,0.4)",
                transition: "transform 0.2s",
              }}
              onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
              onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              {item.image && (
                <img
                  src={item.image}
                  alt={item.title}
                  style={{ width: "120px", height: "120px", borderRadius: "15px", objectFit: "cover" }}
                />
              )}
              <div>
                <h2 style={{ color: themePurple, fontSize: "1.8rem", marginBottom: "10px" }}>
                  {item.year} - {item.title}
                </h2>
                <p style={{ fontSize: "18px", lineHeight: 1.6, marginBottom: "10px" }}>{item.info}</p>
                {item.links.map((link, i) => (
                  <p key={i} style={{ marginBottom: "5px" }}>
                    🔗 <a href={link.url} target="_blank" rel="noopener noreferrer" style={{ color: "#FFD700", textDecoration: "underline" }}>
                      {link.title}
                    </a>
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const sidebarButtonStyle = {
  padding: "14px 22px",
  background: "#6B21A8",
  color: "#fff",
  border: "none",
  borderRadius: "12px",
  fontWeight: "bold",
  fontSize: "17px",
  cursor: "pointer",
  transition: "transform 0.2s, background 0.2s",
  textAlign: "center",
};

