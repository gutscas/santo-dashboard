import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/apiReusable';
import { Mail, Lock, ArrowLeft, Check } from 'lucide-react';

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSendOTP = async () => {
        if (!email) {
            setMessage('❌ Please enter your email');
            return;
        }

        setIsLoading(true);
        setMessage('');

        try {
            const res = await api.post('/api/forgot-password/', { email });
            setMessage('✅ ' + res.data.message);
            setStep(2);
        } catch (err) {
            setMessage('❌ ' + (err.response?.data?.error || 'Failed to send OTP'));
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyOTP = async () => {
        if (!otp) {
            setMessage('❌ Please enter the OTP');
            return;
        }

        setIsLoading(true);
        setMessage('');

        try {
            const res = await api.post('api/verify-otp/', { email, otp });
            setMessage('✅ ' + res.data.message);
            setStep(3);
        } catch (err) {
            setMessage('❌ ' + (err.response?.data?.error || 'Invalid OTP'));
        } finally {
            setIsLoading(false);
        }
    };

    const handleResetPassword = async () => {
        if (!newPassword || !confirmPassword) {
            setMessage('❌ Please fill all fields');
            return;
        }

        if (newPassword !== confirmPassword) {
            setMessage('❌ Passwords do not match');
            return;
        }

        setIsLoading(true);
        setMessage('');

        try {
            const res = await api.post('api/reset-password/', {
                email,
                otp,
                new_password: newPassword
            });
            setMessage('✅ ' + res.data.message);
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            setMessage('❌ ' + (err.response?.data?.error || 'Failed to reset password'));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">
                {/* Header */}
                <div className="text-center mb-8">
                    <button
                        onClick={() => step === 1 ? navigate('/login') : setStep(step - 1)}
                        className="absolute top-8 left-8 text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"
                    >
                        <ArrowLeft size={24} />
                    </button>
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">
                        {step === 1 && 'Forgot Password?'}
                        {step === 2 && 'Verify OTP'}
                        {step === 3 && 'Reset Password'}
                    </h2>
                    <p className="text-gray-600">
                        {step === 1 && 'Enter your email to receive OTP'}
                        {step === 2 && 'Enter the 6-digit code sent to your email'}
                        {step === 3 && 'Create a new password'}
                    </p>
                </div>

                {/* Progress Steps */}
                <div className="flex justify-center space-x-4 mb-8">
                    {[1, 2, 3].map((num) => (
                        <div
                            key={num}
                            className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${step >= num
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-200 text-gray-500'
                                }`}
                        >
                            {step > num ? <Check size={20} /> : num}
                        </div>
                    ))}
                </div>

                {/* Step 1: Email */}
                {step === 1 && (
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="your@email.com"
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                    onKeyPress={(e) => e.key === 'Enter' && handleSendOTP()}
                                />
                            </div>
                        </div>
                        <button
                            onClick={handleSendOTP}
                            disabled={isLoading}
                            className="w-full cursor-pointer bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 rounded-xl font-semibold shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-50"
                        >
                            {isLoading ? 'Sending...' : 'Send OTP'}
                        </button>
                    </div>
                )}

                {/* Step 2: OTP Verification */}
                {step === 2 && (
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Enter OTP</label>
                            <input
                                type="text"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                placeholder="000000"
                                maxLength={6}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-center text-2xl tracking-widest font-mono transition-all"
                                onKeyPress={(e) => e.key === 'Enter' && handleVerifyOTP()}
                            />
                        </div>
                        <button
                            onClick={handleVerifyOTP}
                            disabled={isLoading}
                            className="w-full cursor-pointer bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 rounded-xl font-semibold shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-50"
                        >
                            {isLoading ? 'Verifying...' : 'Verify OTP'}
                        </button>
                        <button
                            onClick={handleSendOTP}
                            className="w-full text-blue-600 hover:text-blue-800 font-medium text-sm cursor-pointer"
                        >
                            Resend OTP
                        </button>
                    </div>
                )}

                {/* Step 3: New Password */}
                {step === 3 && (
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="Enter new password"
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Confirm new password"
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                    onKeyPress={(e) => e.key === 'Enter' && handleResetPassword()}
                                />
                            </div>
                        </div>
                        <button
                            onClick={handleResetPassword}
                            disabled={isLoading}
                            className="w-full cursor-pointer bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white py-3 rounded-xl font-semibold shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-50"
                        >
                            {isLoading ? 'Resetting...' : 'Reset Password'}
                        </button>
                    </div>
                )}

                {/* Message */}
                {message && (
                    <div className={`mt-6 p-3 rounded-xl text-center font-medium ${message.includes('✅')
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}>
                        {message}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ForgotPassword;
