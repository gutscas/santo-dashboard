import React, { useState } from "react";
// import api from "../services/apiReusable";
import { Eye } from 'lucide-react';
import { EyeClosed } from 'lucide-react';
export default function Register() {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [msg, setMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
    setIsLoading(true);
    try {
      const res = await api.post("api/register/", form);
      setMsg("🎉 " + res.data.message);
    } catch (err) {
      setMsg("❌ " + (err.response?.data?.error || "Something went wrong"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleRegister();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col lg:flex-row">
      {/* Left Side - Brand Section */}
      <div className="lg:w-1/2 w-full bg-gradient-to-br from-green-600 to-blue-700 p-8 lg:p-12 flex flex-col justify-center items-center lg:items-start text-white">
        <div className="max-w-md w-full">
          <h1 className="text-4xl lg:text-5xl font-bold mb-6 text-center lg:text-left">
            WELCOME
          </h1>
          <h2 className="text-2xl lg:text-3xl font-semibold mb-8 text-center lg:text-left">
            Create Account
          </h2>
          <p className="text-green-100 text-lg leading-relaxed mb-8 text-center lg:text-left">
            Join our community and discover a world of opportunities. Create your account to access exclusive features and connect with like-minded individuals.
          </p>

          {/* Feature Cards */}
          <div className="space-y-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <h3 className="font-semibold text-xl mb-2">Get Started Today</h3>
              <p className="text-green-100">Create your account and unlock all the amazing features we have to offer for your personal and professional growth.</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <h3 className="font-semibold text-xl mb-2">Connect & Grow</h3>
              <p className="text-green-100">Join thousands of users who are already benefiting from our platform's resources and community support.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Register Form */}
      <div className="lg:w-1/2 w-full flex items-center justify-center px-8 lg:px-12">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 lg:p-10">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Sign up</h2>
            <p className="text-gray-600">Create your account</p>
          </div>

          {/* Form */}
          <div className="space-y-6">
            {/* Username Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Username <span className="text-gray-400 font-normal">(Optional)</span>
              </label>
              <div className="relative">
                <input
                  name="username"
                  type="text"
                  placeholder="Choose a username (optional)"
                  className="w-full px-4 py-2 border outline-none border-gray-300 rounded-xl focus:ring-1 focus:ring-green-500 focus:border-green-500 transition-all duration-300 bg-gray-50"
                  onChange={handleChange}
                  onKeyPress={handleKeyPress}
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Leave blank to auto-generate from your email.
              </p>
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <input
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 transition-all duration-300 bg-gray-50"
                  onChange={handleChange}
                  onKeyPress={handleKeyPress}
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">
                We'll never share your email with anyone else.
              </p>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
                  className="w-full outline-none px-4 py-2 border border-gray-300 rounded-xl focus:ring-1 focus:ring-green-500 focus:border-green-500 transition-all duration-300 bg-gray-50 pr-12"
                  onChange={handleChange}
                  onKeyPress={handleKeyPress}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="cursor-pointer absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-green-600 transition-colors text-sm font-medium"
                >
                  {showPassword ? <Eye /> : <EyeClosed />}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Use at least 8 characters with a mix of letters, numbers, and symbols.
              </p>
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-start space-x-2">
              <input
                type="checkbox"
                className="w-4 h-4 text-green-600 rounded focus:ring-green-500 mt-1"
              />
              <span className="text-sm text-gray-700">
                I agree to the{" "}
                <a href="#" className="text-green-600 hover:text-green-800 font-medium">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="text-green-600 hover:text-green-800 font-medium">
                  Privacy Policy
                </a>
              </span>
            </div>

            {/* Register Button */}
            <button
              onClick={handleRegister}
              disabled={isLoading}
              className="w-full cursor-pointer bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white py-4 rounded-xl font-semibold text-lg shadow-lg transform transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Creating Account...
                </div>
              ) : (
                "Create Account"
              )}
            </button>

            {/* Message */}
            {msg && (
              <div className={`p-4 rounded-xl text-center font-medium transition-all duration-300 ${msg.includes("🎉")
                  ? "bg-green-100 text-green-700 border border-green-200"
                  : "bg-red-100 text-red-700 border border-red-200"
                }`}>
                {msg}
              </div>
            )}

            {/* Sign In Link */}
            <div className="text-center pt-4 border-t border-gray-200">
              <p className="text-gray-600">
                Already have an account?{" "}
                <a href="/login" className="text-green-600 hover:text-green-800 font-semibold transition-colors">
                  Sign In
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}