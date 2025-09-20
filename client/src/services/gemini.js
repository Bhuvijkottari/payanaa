// src/services/gemini.js

// Get API key from Vite .env file
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

/**
 * Send a query to Gemini API and return the response
 * @param {string} prompt - User's input query
 * @returns {Promise<string>} - Gemini's response text
 */
export async function askGemini(prompt) {
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.statusText}`);
    }

    const data = await response.json();

    return (
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "⚠️ No response from Gemini"
    );
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "❌ Could not connect to Gemini API.";
  }
}
