import React, { useEffect, useState } from 'react';
import api from '../services/apiReusable';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useUser } from '../contexts/UserContext';

const Dashboard = () => {
    const { user } = useUser();
    const [profile, setProfile] = useState(null);
    const [stats, setStats] = useState(null);
    const [recentActivity, setRecentActivity] = useState([]);
    const [projects, setProjects] = useState([]);
    const [weather, setWeather] = useState(null);
    const [cryptoPrices, setCryptoPrices] = useState([]);
    const navigate = useNavigate();
    const theme = useSelector((state) => state.theme.theme);

    const fetchProfile = async () => {
        try {
            const res = await api.get('api/profile/me/');
            setProfile(res.data);
        } catch (err) {
            console.log('No profile found or error fetching profile');
        }
    };

    const fetchDashboardStats = async () => {
        try {
            const res = await api.get('api/dashboard/stats/');
            setStats(res.data);
        } catch (err) {
            console.log('Error fetching dashboard stats');
        }
    };

    const fetchRecentActivity = async () => {
        try {
            const res = await api.get('api/activity/recent/');
            setRecentActivity(res.data);
        } catch (err) {
            console.log('Error fetching recent activity');
        }
    };

    const fetchProjects = async () => {
        try {
            const res = await api.get('api/projects/');
            setProjects(res.data.slice(0, 3));
        } catch (err) {
            console.log('Error fetching projects');
        }
    };

    const fetchWeather = async () => {
        try {
            // Using OpenWeatherMap API - you'll need to sign up for a free API key
            const response = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?q=London,UK&units=metric&appid=YOUR_API_KEY`
            );
            const data = await response.json();
            setWeather(data);
        } catch (err) {
            console.log('Error fetching weather data');
        }
    };

    const fetchCryptoPrices = async () => {
        try {
            // Using CoinGecko API
            const response = await fetch(
                'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana&vs_currencies=usd&include_24hr_change=true'
            );
            const data = await response.json();
            setCryptoPrices([
                { name: 'Bitcoin', symbol: 'BTC', price: data.bitcoin.usd, change: data.bitcoin.usd_24h_change },
                { name: 'Ethereum', symbol: 'ETH', price: data.ethereum.usd, change: data.ethereum.usd_24h_change },
                { name: 'Solana', symbol: 'SOL', price: data.solana.usd, change: data.solana.usd_24h_change },
            ]);
        } catch (err) {
            console.log('Error fetching crypto prices');
        }
    };

    useEffect(() => {
        if (user && user.id) {
            fetchProfile();
            fetchDashboardStats();
            fetchRecentActivity();
            fetchProjects();
            fetchWeather();
            fetchCryptoPrices();
        }
    }, [user]);

    const defaultStats = [
        { label: 'Active Projects', value: '12', icon: '📁', change: '+2' },
        { label: 'Completed Tasks', value: '47', icon: '✅', change: '+8' },
        { label: 'Team Members', value: '8', icon: '👥', change: '+1' },
        { label: 'Revenue', value: '$12.4K', icon: '💰', change: '+12%' },
    ];

    const quickActions = [
        { label: 'New Project', icon: '➕', action: () => navigate('/projects/new') },
        { label: 'Analytics', icon: '📊', action: () => navigate('/analytics') },
        { label: 'Settings', icon: '⚙️', action: () => navigate('/settings') },
        { label: 'Help', icon: '❓', action: () => navigate('/help') },
    ];

    return (
        <>
            <div className="mb-8">
                <h2 className={`text-3xl font-bold mb-2 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                    Welcome back, {user ? user.username : 'User'}! 👋
                </h2>
                <p className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>
                    {new Date().toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                    })}
                </p>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {quickActions.map((action, index) => (
                    <button
                        key={index}
                        onClick={action.action}
                        className={`rounded-xl p-4 transition-all duration-300 transform hover:scale-105 shadow-lg ${
                            theme === "dark"
                                ? "bg-gray-700 text-white hover:bg-gray-600"
                                : "bg-white text-gray-900 hover:bg-gray-50 border border-gray-200"
                        }`}
                    >
                        <div className="text-2xl mb-2">{action.icon}</div>
                        <p className="text-sm font-medium">{action.label}</p>
                    </button>
                ))}
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {(stats || defaultStats).map((stat, index) => (
                    <div 
                        key={index} 
                        className={`rounded-xl p-6 transition-all duration-300 transform hover:scale-105 shadow-lg ${
                            theme === "dark"
                                ? "bg-gray-700 text-white hover:bg-gray-600"
                                : "bg-white text-gray-900 hover:bg-gray-50 border border-gray-200"
                        }`}
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className="text-2xl">{stat.icon}</div>
                            <span className={`text-sm font-medium ${
                                stat.change?.startsWith('+') ? 'text-green-500' : 'text-red-500'
                            }`}>
                                {stat.change}
                            </span>
                        </div>
                        <p className={`text-sm mb-2 ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
                            {stat.label}
                        </p>
                        <p className="text-3xl font-bold">{stat.value}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* User Profile Card */}
                <div className={`rounded-xl p-6 shadow-lg ${
                    theme === "dark" ? "bg-gray-700" : "bg-white border border-gray-200"
                }`}>
                    <h3 className={`text-lg font-semibold mb-6 ${
                        theme === "dark" ? "text-white" : "text-gray-900"
                    }`}>My Profile</h3>
                    <div className="flex items-center space-x-4 mb-6">
                        {profile && profile.file ? (
                            <img
                                src={`http://localhost:8000${profile.file}`}
                                alt="Profile"
                                className="w-20 h-20 rounded-full object-cover border-4 border-blue-600"
                            />
                        ) : (
                            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-2xl text-white font-bold">
                                {user ? user.username[0].toUpperCase() : 'U'}
                            </div>
                        )}
                        <div>
                            <p className={`text-xl font-bold ${
                                theme === "dark" ? "text-white" : "text-gray-900"
                            }`}>{user ? user.username : 'Loading...'}</p>
                            <p className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>
                                {user ? user.email : ''}
                            </p>
                        </div>
                    </div>
                    <div className={`space-y-4 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                        <div className={`flex justify-between pb-2 border-b ${
                            theme === "dark" ? "border-gray-600" : "border-gray-200"
                        }`}>
                            <span>User ID</span>
                            <span className="font-mono">{user ? user.id : '-'}</span>
                        </div>
                        <div className={`flex justify-between pb-2 border-b ${
                            theme === "dark" ? "border-gray-600" : "border-gray-200"
                        }`}>
                            <span>Role</span>
                            <span>Developer</span>
                        </div>
                        <div className={`flex justify-between pb-2 border-b ${
                            theme === "dark" ? "border-gray-600" : "border-gray-200"
                        }`}>
                            <span>Status</span>
                            <span className="text-green-500">Active</span>
                        </div>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className={`rounded-xl p-6 shadow-lg ${
                    theme === "dark" ? "bg-gray-700" : "bg-white border border-gray-200"
                }`}>
                    <h3 className={`text-lg font-semibold mb-6 ${
                        theme === "dark" ? "text-white" : "text-gray-900"
                    }`}>Recent Activity</h3>
                    <div className="space-y-4">
                        {(recentActivity.length > 0 ? recentActivity : [
                            { action: 'Created new project', time: '2 hours ago', icon: '🚀' },
                            { action: 'Completed task #42', time: '5 hours ago', icon: '✅' },
                            { action: 'Updated profile', time: '1 day ago', icon: '👤' },
                            { action: 'Joined team meeting', time: '2 days ago', icon: '👥' },
                        ]).map((activity, index) => (
                            <div key={index} className="flex items-center space-x-3">
                                <div className="text-xl">{activity.icon}</div>
                                <div className="flex-1">
                                    <p className={theme === "dark" ? "text-white" : "text-gray-900"}>
                                        {activity.action}
                                    </p>
                                    <p className={`text-sm ${
                                        theme === "dark" ? "text-gray-400" : "text-gray-600"
                                    }`}>
                                        {activity.time}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Crypto & Weather */}
                <div className="space-y-6">
                    {/* Weather Widget */}
                    {weather && (
                        <div className={`rounded-xl p-6 shadow-lg ${
                            theme === "dark" ? "bg-gray-700" : "bg-white border border-gray-200"
                        }`}>
                            <h3 className={`text-lg font-semibold mb-4 ${
                                theme === "dark" ? "text-white" : "text-gray-900"
                            }`}>Weather</h3>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className={`text-3xl font-bold ${
                                        theme === "dark" ? "text-white" : "text-gray-900"
                                    }`}>
                                        {Math.round(weather.main?.temp)}°C
                                    </p>
                                    <p className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>
                                        {weather[0]?.description}
                                    </p>
                                </div>
                                <div className="text-4xl">
                                    {weather[0]?.main.includes('Cloud') ? '☁️' : 
                                     weather[0]?.main.includes('Rain') ? '🌧️' : '☀️'}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Crypto Prices */}
                    {cryptoPrices.length > 0 && (
                        <div className={`rounded-xl p-6 shadow-lg ${
                            theme === "dark" ? "bg-gray-700" : "bg-white border border-gray-200"
                        }`}>
                            <h3 className={`text-lg font-semibold mb-4 ${
                                theme === "dark" ? "text-white" : "text-gray-900"
                            }`}>Crypto Prices</h3>
                            <div className="space-y-3">
                                {cryptoPrices.map((crypto, index) => (
                                    <div key={index} className="flex justify-between items-center">
                                        <div className="flex items-center space-x-2">
                                            <span className="text-lg">{
                                                crypto.symbol === 'BTC' ? '₿' :
                                                crypto.symbol === 'ETH' ? 'Ξ' : '◎'
                                            }</span>
                                            <span className={theme === "dark" ? "text-white" : "text-gray-900"}>
                                                {crypto.symbol}
                                            </span>
                                        </div>
                                        <div className="text-right">
                                            <p className={theme === "dark" ? "text-white" : "text-gray-900"}>
                                                ${crypto.price.toLocaleString()}
                                            </p>
                                            <p className={`text-sm ${
                                                crypto.change > 0 ? 'text-green-500' : 'text-red-500'
                                            }`}>
                                                {crypto.change > 0 ? '+' : ''}{crypto.change.toFixed(2)}%
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Projects Section */}
            <div className="mt-8">
                <div className={`rounded-xl p-6 shadow-lg ${
                    theme === "dark" ? "bg-gray-700" : "bg-white border border-gray-200"
                }`}>
                    <div className="flex justify-between items-center mb-6">
                        <h3 className={`text-lg font-semibold ${
                            theme === "dark" ? "text-white" : "text-gray-900"
                        }`}>My Projects</h3>
                        <button 
                            onClick={() => navigate('/projects')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                theme === "dark" 
                                    ? "bg-blue-600 hover:bg-blue-700 text-white" 
                                    : "bg-blue-500 hover:bg-blue-600 text-white"
                            }`}
                        >
                            View All
                        </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {(projects.length > 0 ? projects : [
                            { name: 'Website Redesign', progress: 75, status: 'In Progress', color: 'blue' },
                            { name: 'Mobile App', progress: 30, status: 'In Progress', color: 'green' },
                            { name: 'API Integration', progress: 100, status: 'Completed', color: 'purple' },
                        ]).map((project, index) => (
                            <div 
                                key={index} 
                                className={`rounded-lg p-4 transition-all duration-300 ${
                                    theme === "dark" ? "bg-gray-600 hover:bg-gray-500" : "bg-gray-50 hover:bg-gray-100"
                                }`}
                            >
                                <h4 className={`font-medium mb-2 ${
                                    theme === "dark" ? "text-white" : "text-gray-900"
                                }`}>
                                    {project.name}
                                </h4>
                                <div className="flex justify-between text-sm mb-2">
                                    <span className={theme === "dark" ? "text-gray-300" : "text-gray-600"}>
                                        Progress
                                    </span>
                                    <span className={theme === "dark" ? "text-gray-300" : "text-gray-600"}>
                                        {project.progress}%
                                    </span>
                                </div>
                                <div className={`w-full rounded-full h-2 ${
                                    theme === "dark" ? "bg-gray-500" : "bg-gray-200"
                                }`}>
                                    <div
                                        className={`h-2 rounded-full transition-all duration-1000 ${
                                            project.color === 'blue' ? 'bg-blue-500' :
                                            project.color === 'green' ? 'bg-green-500' : 'bg-purple-500'
                                        }`}
                                        style={{ width: `${project.progress}%` }}
                                    ></div>
                                </div>
                                <div className="flex justify-between items-center mt-2">
                                    <span className={`text-xs ${
                                        theme === "dark" ? "text-gray-400" : "text-gray-500"
                                    }`}>
                                        {project.status}
                                    </span>
                                    <span className={`text-xs px-2 py-1 rounded ${
                                        project.status === 'Completed' 
                                            ? 'bg-green-500 text-white'
                                            : theme === "dark" 
                                                ? 'bg-gray-500 text-white' 
                                                : 'bg-gray-200 text-gray-700'
                                    }`}>
                                        {project.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Dashboard;