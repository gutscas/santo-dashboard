import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useUser } from '../../contexts/UserContext';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import api from '../../services/apiReusable';

const Layout = ({ children }) => {
    const theme = useSelector((state) => state.theme.theme);
    const { user } = useUser();

    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [profile, setProfile] = useState(null);
    const hasLoadedProfile = useRef(false);

    useEffect(() => {
        if (user?.id && !hasLoadedProfile.current) {
            fetchProfile();
            hasLoadedProfile.current = true;
        }
    }, [user?.id]);

    const fetchProfile = async () => {
        try {
            const res = await api.get("api/profile/me/");
            setProfile(res.data);
        } catch (err) {
            console.log("No profile found");
        }
    };

    return (
        <div
            className={`h-screen w-full flex overflow-hidden ${
                theme === "dark"
                    ? "bg-gradient-to-br from-gray-900 to-gray-800"
                    : "bg-gradient-to-br from-gray-50 to-gray-100"
            }`}
        >
            {/* FIXED SIDEBAR */}
            <Sidebar
                isSidebarOpen={isSidebarOpen}
                setIsSidebarOpen={setIsSidebarOpen}
            />

            {/* Right side area */}
            <div className="flex-1 flex flex-col h-full">

                {/* FIXED NAVBAR */}
                <div className="sticky top-0 z-20">
                    <Navbar
                        isSidebarOpen={isSidebarOpen}
                        setIsSidebarOpen={setIsSidebarOpen}
                        user={user}
                        profile={profile}
                    />
                </div>

                {/* SCROLLABLE CONTENT */}
                <div className="flex-1 overflow-y-auto p-6">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Layout;
