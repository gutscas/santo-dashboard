import React from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import Auth from '../pages/Auth';
import ForgotPassword from '../pages/ForgotPassword';
import Dashboard from '../pages/Dashboard';
import Profile from '../pages/Profile';
import Settings from '../pages/Settings';
import Analytics from '../pages/Analytics';
import Users from '../pages/Users';
import Messages from '../pages/Messages';
import Notifications from '../pages/Notifications';
import Reports from '../pages/Reports';
import Help from '../pages/Help';
import ProtectedRoute from '../components/layout/ProtectedRoute';
import PublicRoute from '../components/layout/PublicRoute';
import Layout from '../components/layout/Layout';

const AppRoutes = () => {
    return (
        <Routes>
            <Route element={<PublicRoute />}>
                <Route path="/" element={<Auth />} />
                <Route path="/login" element={<Auth />} />
                <Route path="/register" element={<Auth />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
            </Route>
            <Route element={<ProtectedRoute />}>
                <Route element={<Layout><Outlet /></Layout>}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/analytics" element={<Analytics />} />
                    <Route path="/users" element={<Users />} />
                    <Route path="/messages" element={<Messages />} />
                    <Route path="/notifications" element={<Notifications />} />
                    <Route path="/reports" element={<Reports />} />
                    <Route path="/help" element={<Help />} />
                </Route>
            </Route>
        </Routes>
    );
};

export default AppRoutes;
