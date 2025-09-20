// src/pages/Materials.jsx
import React from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

// Example PDF links (replace with actual URLs)
const pdfs = [
  { title: "Tamil Letters", url: "/pdfs/letters.pdf" },
  { title: "Tamil Alphabets", url: "/pdfs/alphabets.pdf" },
  { title: "Tamil Words", url: "/pdfs/words.pdf" },
  { title: "Sample Sentences", url: "/pdfs/sentences.pdf" },
];

// Example YouTube links
const youtubeVideos = [
  { title: "Learn Tamil Letters", url: "https://www.youtube.com/embed/VIDEO_ID1" },
  { title: "Tamil Alphabets Tutorial", url: "https://www.youtube.com/embed/VIDEO_ID2" },
  { title: "Forming Tamil Words", url: "https://www.youtube.com/embed/VIDEO_ID3" },
];

export default function Materials() {
  const themePurple = "#8B5CF6"; // same as dashboard theme
  const cardBg = "rgba(31, 18, 56, 0.85)";

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#150B2E" }}>
      {/* Sidebar placeholder (reuse from Dashboard if needed) */}
      <aside
        style={{
          width: "250px",
          minHeight: "100vh",
          background: "linear-gradient(to bottom, #150B2E, #2A0944)",
          color: "#fff",
          padding: "30px 20px",
          display: "flex",
          flexDirection: "column",
          gap: "25px",
          boxShadow: "2px 0 20px rgba(0,0,0,0.7)",
        }}
      >
        <h2 style={{ fontSize: "28px", fontWeight: "bold", color: themePurple, textAlign: "center" }}>
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
      <div style={{ flex: 1, padding: "30px", color: "#fff" }}>
        <h1 style={{ color: themePurple, marginBottom: "20px" }}>📚 Tamil Learning Materials</h1>

        {/* PDFs Section */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px" }}>
          {pdfs.map((pdf, idx) => (
            <a
              key={idx}
              href={pdf.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                padding: "20px",
                background: cardBg,
                borderRadius: "12px",
                textDecoration: "none",
                color: "#fff",
                boxShadow: "0 4px 15px rgba(0,0,0,0.4)",
                transition: "transform 0.2s",
              }}
              onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
              onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              <span style={{ fontSize: "18px", marginBottom: "10px" }}>📄 {pdf.title}</span>
              <img
                src="/pdf-icon.png"
                alt="PDF icon"
                style={{ width: "50px", height: "50px", filter: "invert(1)" }}
              />
            </a>
          ))}
        </div>

        {/* YouTube Carousel */}
        <div style={{ marginTop: "50px" }}>
          <h2 style={{ color: themePurple, marginBottom: "20px" }}>🎥 Related Video Tutorials</h2>
          <Carousel
            showThumbs={false}
            infiniteLoop
            autoPlay
            interval={4000}
            dynamicHeight={true}
            showStatus={false}
          >
            {youtubeVideos.map((video, idx) => (
              <div key={idx} style={{ borderRadius: "12px", overflow: "hidden" }}>
                <iframe
                  width="100%"
                  height="400px"
                  src={video.url}
                  title={video.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
                <p style={{ color: "#fff", marginTop: "10px" }}>{video.title}</p>
              </div>
            ))}
          </Carousel>
        </div>
      </div>
    </div>
  );
}

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
