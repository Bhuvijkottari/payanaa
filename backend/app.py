from flask import Flask, request, send_file, jsonify
from gtts import gTTS
import os, hashlib
from flask_cors import CORS

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS so your React app can call this API

# --- NEW: Words route ---
CACHE_DIR_WORDS = "generated_words"
os.makedirs(CACHE_DIR_WORDS, exist_ok=True)

def make_word_hash(text: str, lang: str):
    return hashlib.md5(f"word::{text}::{lang}".encode("utf-8")).hexdigest()

@app.route("/speak-word")
def speak_word():
    """
    GET /speak-word?text=<word>&lang=ta
    Generates/returns cached mp3 for words (separate from letters).
    """
    text = request.args.get("text", "")
    lang = request.args.get("lang", "ta")

    if not text:
        return jsonify({"error": "text query param required"}), 400

    key = make_word_hash(text, lang)
    filepath = os.path.join(CACHE_DIR_WORDS, f"{key}.mp3")

    # If cached file exists, return it
    if os.path.exists(filepath):
        return send_file(filepath, mimetype="audio/mpeg")

    try:
        tts = gTTS(text=text, lang=lang)
        tts.save(filepath)
        return send_file(filepath, mimetype="audio/mpeg")
    except Exception as e:
        return jsonify({"error": "Failed to generate word TTS", "details": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
