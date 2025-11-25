import React from 'react';
import { Sun, Moon, X } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { toggleTheme } from '../../redux/themeSlice';
import { MoveLeft } from 'lucide-react';

const Navbar = ({ isSidebarOpen, setIsSidebarOpen, user, profile }) => {
    const theme = useSelector((state) => state.theme.theme);
    const dispatch = useDispatch();

    const handleToggleTheme = () => {
        dispatch(toggleTheme());
    };

    return (
        <div className={`flex items-center justify-between mb-8 p-4  shadow-lg  ${theme === "dark"
            ? "bg-gray-800 border-gray-700"
            : "bg-gradient-to-r from-pink-600 to-purple-800 border-pink-400"
            }`}>
            <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className={`p-2 rounded-lg transition-colors cursor-pointer ${theme === "dark"
                    ? "bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white"
                    : "bg-white/20 text-white hover:bg-white/30"
                    }`}
            >
                {isSidebarOpen ? <MoveLeft size={20} className='' /> : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                )}
            </button>

            <div className="flex items-center space-x-4">
                <div className="relative hidden md:block">
                    <input
                        type="text"
                        placeholder="Search..."
                        className={`pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 border ${theme === "dark"
                            ? "bg-gray-700 text-white placeholder-gray-400 border-gray-600 focus:ring-blue-500"
                            : "bg-white/20 text-white placeholder-white/70 border-white/30 focus:ring-white"
                            }`}
                    />
                    <svg className={`w-5 h-5 absolute left-3 top-2.5 ${theme === "dark" ? "text-gray-400" : "text-white/70"
                        }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>

                {/* Theme Toggle Button */}
                <button
                    onClick={handleToggleTheme}
                    className={`p-2 rounded-lg transition-colors cursor-pointer ${theme === "dark"
                        ? "bg-gray-700 text-yellow-400 hover:bg-gray-600"
                        : "bg-white/20 text-yellow-200 hover:bg-white/30"
                        }`}
                    title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
                >
                    {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                </button>

                <div className="flex items-center space-x-3">
                    <span className={`text-sm font-medium hidden sm:block ${theme === "dark" ? "text-white" : "text-white"
                        }`}>
                        {user ? user.username : 'Guest'}
                    </span>
                    {profile && profile.file ? (
                        <img
                            src={`http://localhost:8000${profile.file}`}
                            alt="Profile"
                            className="w-8 h-8 rounded-full object-cover border-2 border-blue-600"
                        />
                    ) : (
                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                            <span className="text-white text-sm font-semibold">
                                {user && user.username ? user.username[0].toUpperCase() : 'G'}
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Navbar;
