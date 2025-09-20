import React, { useState } from "react";
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import logoBot from "../assets/logoBot.png";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      // 1️⃣ Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        form.email,
        form.password
      );
      await updateProfile(userCredential.user, { displayName: form.name });

      // 2️⃣ Save extra data to Firestore
      await setDoc(doc(db, "users", userCredential.user.uid), {
        name: form.name,
        email: form.email,
        createdAt: new Date(),
      });

      // 3️⃣ Show success message
      setSuccess("Registered successfully! Please login to continue.");
      setForm({ name: "", email: "", password: "" });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[#150B2E] via-[#2A0944] to-[#3B185F] p-6">
      <div className="bg-gradient-to-br from-[#2E1046] to-[#43146E] backdrop-blur-xl rounded-3xl shadow-[0_0_50px_rgba(255,105,180,0.3)] p-10 w-full max-w-md border border-[#6D3A94]/40 text-center">
        <img
          src={logoBot}
          alt="Payana Logo"
          className="h-40 w-40 mx-auto mb-4 drop-shadow-[0_0_35px_rgba(255,105,180,0.8)]"
        />

        <h2 className="text-3xl font-bold text-pink-300 mb-4 tracking-wide">
          Create Account
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <input
            name="name"
            type="text"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            className="p-3 rounded-xl bg-[#3D1A57]/70 border border-[#6D3A94] text-white placeholder-pink-200 focus:ring-2 focus:ring-pink-400"
            required
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="p-3 rounded-xl bg-[#3D1A57]/70 border border-[#6D3A94] text-white placeholder-pink-200 focus:ring-2 focus:ring-pink-400"
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="p-3 rounded-xl bg-[#3D1A57]/70 border border-[#6D3A94] text-white placeholder-pink-200 focus:ring-2 focus:ring-pink-400"
            required
          />

          {error && <p className="text-red-400 text-sm">{error}</p>}
          {success && <p className="text-green-400 text-sm">{success}</p>}

          <button
            type="submit"
            disabled={loading}
            className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 transition text-white font-bold py-3 rounded-xl shadow-lg disabled:opacity-50"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="text-gray-400 mt-5 text-sm">
          Already have an account?{" "}
          <button
            className="ml-2 text-pink-300 hover:text-pink-400 underline decoration-pink-400"
            onClick={() => navigate("/login")}
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
}
