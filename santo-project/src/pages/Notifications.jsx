import React, { useState, useEffect } from 'react';

import { useSelector } from 'react-redux';

const Notifications = () => {
    const [user, setUser] = useState(null);
    const theme = useSelector((state) => state.theme.theme);

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            setUser(JSON.parse(userData));
        }
    }, []);

    return (

        <div className={`rounded-xl p-6 shadow-lg ${theme === "dark" ? "bg-gray-700" : "bg-white border border-gray-200"
            }`}>
            <h2 className={`text-2xl font-bold mb-4 ${theme === "dark" ? "text-white" : "text-gray-900"
                }`}>Notifications</h2>
            <p className={theme === "dark" ? "text-gray-300" : "text-gray-700"}>
                No new notifications.
            </p>
        </div>

    );
};

export default Notifications;
