import React from "react";

export default function Contact() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#121212",
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px",
      }}
    >
      <h1 style={{ fontSize: "36px", marginBottom: "20px", color: "#10B981" }}>
        📩 Contact Us
      </h1>
      <p style={{ fontSize: "18px", marginBottom: "30px" }}>
        Have questions or feedback? We'd love to hear from you!
      </p>
      <form
        action="https://formspree.io/f/mrbanadd"
        method="POST"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "15px",
          width: "100%",
          maxWidth: "400px",
        }}
      >
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          required
          style={{
            padding: "12px",
            borderRadius: "8px",
            border: "1px solid #333",
            background: "#1F1F1F",
            color: "#fff",
          }}
        />
        <input
          type="email"
          name="email"
          placeholder="Your Email"
          required
          style={{
            padding: "12px",
            borderRadius: "8px",
            border: "1px solid #333",
            background: "#1F1F1F",
            color: "#fff",
          }}
        />
        <textarea
          name="message"
          placeholder="Your Message"
          rows="5"
          required
          style={{
            padding: "12px",
            borderRadius: "8px",
            border: "1px solid #333",
            background: "#1F1F1F",
            color: "#fff",
          }}
        ></textarea>
        <button
          type="submit"
          style={{
            padding: "12px",
            borderRadius: "8px",
            border: "none",
            background: "#10B981",
            color: "#fff",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          Send Message
        </button>
      </form>
    </div>
  );
}
