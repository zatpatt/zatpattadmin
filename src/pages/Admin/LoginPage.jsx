// src/pages/admin/LoginPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, User } from "lucide-react";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    // ✨ TEMP LOGIN CHECK (Replace later with Firebase Auth)
    if (email === "admin@example.com" && password === "admin123") {
      navigate("/admin");
    } else {
      alert("Invalid login credentials");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fff8f2] px-6">
      
      {/* Card */}
      <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-xl border border-orange-200">
        
        {/* Logo + Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-orange-500 to-amber-400 bg-clip-text text-transparent">
            Admin Panel
          </h1>
          <p className="text-gray-500 text-sm mt-1">Login to your dashboard</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Email
            </label>
            <div className="flex items-center gap-3 border border-gray-300 px-4 py-3 rounded-xl bg-gray-50">
              <User size={18} className="text-gray-500" />
              <input
                type="email"
                required
                className="w-full bg-transparent outline-none"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Password
            </label>
            <div className="flex items-center gap-3 border border-gray-300 px-4 py-3 rounded-xl bg-gray-50">
              <Lock size={18} className="text-gray-500" />
              <input
                type="password"
                required
                className="w-full bg-transparent outline-none"
                placeholder="••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-400 text-white font-semibold shadow-md active:scale-95 transition"
          >
            Login
          </button>

        </form>
      </div>
    </div>
  );
}
