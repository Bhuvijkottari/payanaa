import React, { useState } from "react";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import logoBot from "../assets/logoBot.png";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, form.email, form.password);
      navigate("/dashboard"); // ✅ go to dashboard after login
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
          Login
        </h2>

        <form onSubmit={handleLogin} className="flex flex-col gap-5">
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

          <button
            type="submit"
            disabled={loading}
            className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 transition text-white font-bold py-3 rounded-xl shadow-lg disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-gray-400 mt-5 text-sm">
          Don't have an account?{" "}
          <button
            className="ml-2 text-pink-300 hover:text-pink-400 underline decoration-pink-400"
            onClick={() => navigate("/register")}
          >
            Register
          </button>
        </p>
      </div>
    </div>
  );
}
