import React, { useState } from "react";
import api from "../services/apiReusable";
import { useNavigate } from "react-router-dom";
import { Eye, EyeClosed } from 'lucide-react';
import ForgotPassword from "./ForgotPassword";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [msg, setMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    setIsLoading(true);
    setMsg("");
    try {
      const res = await api.post("api/login/", form);
      localStorage.setItem("access", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      setMsg("🎉 Login Successful!");
      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (err) {
      setMsg("❌ " + (err.response?.data?.error || "Invalid credentials"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col lg:flex-row">
      {/* Left Side - Brand Section */}
      <div className="lg:w-1/2 w-full bg-gradient-to-br from-blue-600 to-purple-700 p-8 lg:p-12 flex flex-col justify-center items-center lg:items-start text-white">
        <div className="max-w-md w-full">
          <h1 className="text-4xl lg:text-5xl font-bold mb-6 text-center lg:text-left">WELCOME</h1>
          <h2 className="text-2xl lg:text-3xl font-semibold mb-8 text-center lg:text-left">Sign in</h2>
          <p className="text-blue-100 text-lg leading-relaxed mb-8 text-center lg:text-left">
            Learn your offer of care, connection and agency on your journey to recovery with users of resources. Better store your operations and address customer satisfaction from trade.
          </p>
          {/* Feature Cards */}
          <div className="space-y-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <h3 className="font-semibold text-xl mb-2">EMAIL LOGIN</h3>
              <p className="text-blue-100">Use your email to access your account securely.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login / Forgot Password Form */}
      <div className="lg:w-1/2 w-full flex items-center justify-center p-8 lg:p-12">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 lg:p-10">
          {showForgot ? (
            <ForgotPassword />
          ) : (
            <>
              {/* Header */}
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">Sign in</h2>
                <p className="text-gray-600">Access your account</p>
              </div>

              {/* Form */}
              <div className="space-y-6">
                {/* Email Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">EMAIL</label>
                  <div className="relative">
                    <input
                      name="email"
                      type="email"
                      placeholder="Your Email"
                      className="w-full px-4 py-2 border border-gray-300 rounded-xl outline-none focus:ring-1 focus:ring-purple-500 focus:border-blue-500 transition-all duration-300 bg-gray-50"
                      onChange={handleChange}
                      onKeyPress={handleKeyPress}
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                  <div className="relative">
                    <input
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      className="w-full px-4 py-2 border border-gray-300 outline-none rounded-xl focus:ring-1 focus:ring-purple-500 focus:border-blue-500 transition-all duration-300 bg-gray-50 pr-12"
                      onChange={handleChange}
                      onKeyPress={handleKeyPress}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-purple-600 transition-colors cursor-pointer"
                    >
                      {!showPassword ? <Eye /> : <EyeClosed />}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Better store your operations and address customer satisfaction from trade.</p>
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-purple-500"
                    />
                    <span className="text-sm text-gray-700">Remember me</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowForgot(true)}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                </div>

                {/* Login Button */}
                <button
                  onClick={handleLogin}
                  disabled={isLoading}
                  className="w-full cursor-pointer bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-4 rounded-xl font-semibold text-lg shadow-lg transform transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Signing In...
                    </div>
                  ) : (
                    "Sign in"
                  )}
                </button>

                {/* Message */}
                {msg && (
                  <div className={`p-4 rounded-xl text-center font-medium transition-all duration-30 ${msg.includes("Successful") ? "bg-green-100 text-green-700 border border-green-200" : "bg-red-100 text-red-700 border border-red-200"}`}>
                    {msg}
                  </div>
                )}

                {/* Sign Up Link */}
                <div className="text-center pt-4 border-t border-gray-200">
                  <p className="text-gray-600">
                    Don't have an account? <a href="/register" className="text-blue-600 hover:text-blue-800 font-semibold transition-colors">Sign Up</a>
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
