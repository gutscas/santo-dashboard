import React, { useState, useEffect } from "react";
import api from "../services/apiReusable";
import { useNavigate, useLocation } from "react-router-dom";
import { Eye, EyeClosed } from 'lucide-react';
import { useUser } from '../contexts/UserContext';

export default function Auth() {
    const location = useLocation();
    const navigate = useNavigate();
    const { updateUser } = useUser();
    const [isLogin, setIsLogin] = useState(location.pathname !== '/register');
    const [loginForm, setLoginForm] = useState({ email: "", password: "" });
    const [registerForm, setRegisterForm] = useState({ username: "", email: "", password: "" });
    const [msg, setMsg] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

    useEffect(() => {
        setIsLogin(location.pathname !== '/register');
        setMsg("");
    }, [location.pathname]);

    const handleLoginChange = (e) => {
        setLoginForm({ ...loginForm, [e.target.name]: e.target.value });
    };

    const handleRegisterChange = (e) => {
        setRegisterForm({ ...registerForm, [e.target.name]: e.target.value });
    };

    const handleLogin = async () => {
        setIsLoading(true);
        setMsg("");
        try {
            const res = await api.post("api/login/", loginForm);
            localStorage.setItem("access", res.data.access);
            localStorage.setItem("refresh", res.data.refresh);
            localStorage.setItem("user", JSON.stringify(res.data.user));

            // Update context immediately so dashboard can load data
            updateUser(res.data.user);

            setMsg("🎉 Login Successful!");
            setTimeout(() => navigate("/dashboard"), 1500);
        } catch (err) {
            setMsg("❌ " + (err.response?.data?.error || err.response?.data?.non_field_errors || "Invalid credentials"));
        } finally {
            setIsLoading(false);
        }
    };

    const handleRegister = async () => {
        setIsLoading(true);
        setMsg("");
        try {
            const res = await api.post("api/register/", registerForm);
            setMsg("🎉 " + res.data.message);
        } catch (err) {
            setMsg("❌ " + (err.response?.data?.error || err.response?.data?.email || "Something went wrong"));
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            isLogin ? handleLogin() : handleRegister();
        }
    };

    const switchMode = () => {
        navigate(isLogin ? '/register' : '/login');
        setMsg("");
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4 overflow-hidden">
            <div className="relative w-full max-w-6xl h-[600px] bg-white rounded-2xl shadow-2xl overflow-hidden">
                <div className="relative w-full h-full">

                    {/* Login Form */}
                    <div
                        className={`absolute w-full md:w-1/2 h-full p-8 md:p-12 flex items-center transition-all duration-700 ease-in-out ${isLogin
                            ? 'left-0 opacity-100 pointer-events-auto'
                            : 'left-full md:left-1/2 opacity-0 pointer-events-none'
                            }`}
                        style={{ zIndex: isLogin ? 10 : 1 }}
                    >
                        <div className="w-full max-w-md mx-auto">
                            <div className="text-center mb-8">
                                <h2 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back!</h2>
                                <p className="text-gray-600">Sign in to your account</p>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                                    <input
                                        name="email"
                                        type="email"
                                        placeholder="Your email"
                                        value={loginForm.email}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                        onChange={handleLoginChange}
                                        onKeyPress={handleKeyPress}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                                    <div className="relative">
                                        <input
                                            name="password"
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Enter your password"
                                            value={loginForm.password}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 pr-12 transition-all"
                                            onChange={handleLoginChange}
                                            onKeyPress={handleKeyPress}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-600 transition-colors cursor-pointer"
                                        >
                                            {!showPassword ? <Eye size={20} /> : <EyeClosed size={20} />}
                                        </button>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between">
                                    <label className="flex items-center space-x-2 cursor-pointer group">
                                        <input
                                            type="checkbox"
                                            checked={rememberMe}
                                            onChange={(e) => setRememberMe(e.target.checked)}
                                            className="custom-checkbox"
                                        />
                                        <span className="text-sm text-gray-700 group-hover:text-gray-900">Remember me</span>
                                    </label>
                                    <button
                                        onClick={() => navigate('/forgot-password')}
                                        className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors cursor-pointer"
                                    >
                                        Forgot Password?
                                    </button>
                                </div>

                                <button
                                    onClick={handleLogin}
                                    disabled={isLoading}
                                    className="w-full cursor-pointer bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 rounded-xl font-semibold shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-50"
                                >
                                    {isLoading ? "Signing In..." : "Sign In"}
                                </button>

                                {msg && (
                                    <div className={`p-3 rounded-xl text-center font-medium ${msg.includes("Successful") || msg.includes("🎉")
                                        ? "bg-green-100 text-green-700"
                                        : "bg-red-100 text-red-700"
                                        }`}>
                                        {msg}
                                    </div>
                                )}

                                <div className="text-center pt-4 border-t border-gray-200">
                                    <p className="text-gray-600">
                                        Don't have an account?{" "}
                                        <button onClick={switchMode} className="text-blue-600 hover:text-blue-800 font-semibold cursor-pointer">
                                            Sign Up
                                        </button>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Register Form */}
                    <div
                        className={`absolute w-full md:w-1/2 h-full p-8 md:p-12 flex items-center overflow-y-auto transition-all duration-700 ease-in-out ${!isLogin
                            ? 'left-0 md:left-1/2 opacity-100 pointer-events-auto'
                            : 'left-full opacity-0 pointer-events-none'
                            }`}
                        style={{ zIndex: !isLogin ? 10 : 1 }}
                    >
                        <div className="w-full max-w-md mx-auto">
                            <div className="text-center mb-8">
                                <h2 className="text-3xl font-bold text-gray-800 mb-2">Create Account</h2>
                                <p className="text-gray-600">Sign up to get started</p>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Username <span className="text-gray-400 text-xs">(Optional - duplicates allowed)</span>
                                    </label>
                                    <input
                                        name="username"
                                        type="text"
                                        placeholder="Choose a username"
                                        value={registerForm.username}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-green-500 transition-all"
                                        onChange={handleRegisterChange}
                                        onKeyPress={handleKeyPress}
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        Multiple users can have the same username. Leave blank to auto-generate from email.
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                                    <input
                                        name="email"
                                        type="email"
                                        placeholder="Enter your email"
                                        value={registerForm.email}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-green-500 transition-all"
                                        onChange={handleRegisterChange}
                                        onKeyPress={handleKeyPress}
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        Email must be unique and will be used for login.
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                                    <div className="relative">
                                        <input
                                            name="password"
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Create a strong password"
                                            value={registerForm.password}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-green-500 pr-12 transition-all"
                                            onChange={handleRegisterChange}
                                            onKeyPress={handleKeyPress}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-green-600 transition-colors cursor-pointer"
                                        >
                                            {showPassword ? <Eye size={20} /> : <EyeClosed size={20} />}
                                        </button>
                                    </div>
                                </div>

                                <button
                                    onClick={handleRegister}
                                    disabled={isLoading}
                                    className="w-full cursor-pointer bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white py-3 rounded-xl font-semibold shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-50"
                                >
                                    {isLoading ? "Creating Account..." : "Sign Up"}
                                </button>

                                {msg && (
                                    <div className={`p-3 rounded-xl text-center font-medium ${msg.includes("🎉")
                                        ? "bg-green-100 text-green-700"
                                        : "bg-red-100 text-red-700"
                                        }`}>
                                        {msg}
                                    </div>
                                )}

                                <div className="text-center pt-4 border-t border-gray-200">
                                    <p className="text-gray-600">
                                        Already have an account?{" "}
                                        <button onClick={switchMode} className="text-green-600 hover:text-green-800 font-semibold cursor-pointer">
                                            Sign In
                                        </button>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sliding Content Panel */}
                    <div
                        className={`absolute w-full md:w-1/2 h-full p-12 hidden md:flex items-center justify-center transition-all duration-700 ease-in-out ${isLogin
                            ? 'left-full md:left-1/2 bg-gradient-to-br from-blue-600 to-purple-700'
                            : 'left-0 bg-gradient-to-br from-green-600 to-blue-700'
                            }`}
                        style={{ zIndex: 20 }}
                    >
                        <div className="text-white text-center">
                            <h1 className="text-4xl font-bold mb-6">
                                {isLogin ? "Hello, Friend!" : "Welcome Back!"}
                            </h1>
                            <p className="text-lg mb-8">
                                {isLogin
                                    ? "Enter your personal details and start your journey with us"
                                    : "To keep connected with us please login with your personal info"
                                }
                            </p>
                            <button
                                onClick={switchMode}
                                className="cursor-pointer px-8 py-3 border-2 border-white rounded-xl font-semibold hover:bg-white hover:text-blue-600 transition-all duration-300"
                            >
                                {isLogin ? "Sign Up" : "Sign In"}
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
