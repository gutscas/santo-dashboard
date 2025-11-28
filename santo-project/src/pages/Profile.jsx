import React, { useState, useEffect } from 'react';
import api from '../services/apiReusable';
import { Edit2, Save, X, Upload } from 'lucide-react';
import { useSelector } from 'react-redux';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        age: '',
        file: null
    });
    const [previewImage, setPreviewImage] = useState(null);
    const theme = useSelector((state) => state.theme.theme);

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            setUser(JSON.parse(userData));
            fetchProfile();
        }
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await api.get('api/profile/me/');
            setProfile(res.data);
            setFormData({
                name: res.data.name || '',
                age: res.data.age || '',
                file: null
            });
            if (res.data.file) {
                setPreviewImage(`https://project.rayi.in${res.data.file}`);
            }
        } catch (err) {
            console.log('No profile found or error fetching profile');
            setProfile(null);
            setFormData({
                name: '',
                age: '',
                file: null
            });
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({ ...formData, file });
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async () => {
        setIsLoading(true);
        setMessage('');

        try {
            const submitData = new FormData();
            submitData.append('name', formData.name);
            submitData.append('age', formData.age);
            if (formData.file) {
                submitData.append('file', formData.file);
            }

            let res;
            if (profile) {
                // Update existing profile
                res = await api.patch('api/profile/me/', submitData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
                setMessage('✅ Profile updated successfully!');
                //  fetchProfile();
            } else {
                // Create new profile
                res = await api.post('api/profile/me/', submitData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
                setMessage('✅ Profile created successfully!');
            }

            setProfile(res.data);
            // console.log(res.data);
            setTimeout(() => setMessage(''), 2000);
            setIsEditing(false);
            if (res.data.file) {
                setPreviewImage(`https://project.rayi.in${res.data.file}`);
            }
        } catch (err) {
            setMessage('❌ ' + (err.response?.data?.error || 'Failed to save profile'));
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        setFormData({
            name: profile?.name || '',
            age: profile?.age || '',
            file: null
        });
        if (profile?.file) {
            setPreviewImage(`https://project.rayi.in${profile.file}`);
        } else {
            setPreviewImage(null);
        }
        setMessage('');
    };

    return (
        <div className={theme === "dark" ? "text-white" : "text-gray-900"}>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">My Profile</h1>
                {!isEditing && (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="cursor-pointer flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors text-white"
                    >
                        <Edit2 size={18} />
                        Edit Profile
                    </button>
                )}
            </div>

            <div className={`p-6 rounded-xl shadow-lg ${theme === "dark" ? "bg-gray-700" : "bg-white border border-gray-200"
                }`}>
                {/* Profile Image Section */}
                <div className="flex items-center space-x-6 mb-6">
                    <div className="relative">
                        {previewImage ? (
                            <img
                                src={previewImage}
                                alt="Profile"
                                className="w-24 h-24 rounded-full object-cover border-4 border-blue-600"
                            />
                        ) : (
                            <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center text-3xl font-bold text-white">
                                {user ? user.username[0].toUpperCase() : 'U'}
                            </div>
                        )}
                        {isEditing && (
                            <label className="absolute bottom-0 right-0 bg-blue-600 rounded-full p-2 cursor-pointer hover:bg-blue-700 transition-colors">
                                <Upload size={16} className="text-white" />
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="hidden"
                                />
                            </label>
                        )}
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold">{user ? user.username : 'Loading...'}</h2>
                        <p className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>
                            {user ? user.email : ''}
                        </p>
                    </div>
                </div>

                {/* Message */}
                {message && (
                    <div className={`mb-4 p-3 rounded-lg ${message.includes('✅')
                        ? 'bg-green-500/20 text-green-400 border border-green-500'
                        : 'bg-red-500/20 text-red-400 border border-red-500'
                        }`}>
                        {message}
                    </div>
                )}

                <div className={`border-t pt-6 ${theme === "dark" ? "border-gray-600" : "border-gray-200"
                    }`}>
                    <h3 className="text-xl font-semibold mb-4">Account Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Username (Read-only) */}
                        <div>
                            <label className={`block text-sm mb-1 ${theme === "dark" ? "text-gray-400" : "text-gray-600"
                                }`}>Username</label>
                            <p className="text-lg">{user ? user.username : '-'}</p>
                        </div>

                        {/* Email (Read-only) */}
                        <div>
                            <label className={`block text-sm mb-1 ${theme === "dark" ? "text-gray-400" : "text-gray-600"
                                }`}>Email</label>
                            <p className="text-lg">{user ? user.email : '-'}</p>
                        </div>

                        {/* Name (Editable) */}
                        <div>
                            <label className={`block text-sm mb-1 ${theme === "dark" ? "text-gray-400" : "text-gray-600"
                                }`}>Name</label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className={`w-full px-3 py-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 ${theme === "dark"
                                        ? "bg-gray-600 text-white"
                                        : "bg-gray-100 text-gray-900 border border-gray-300"
                                        }`}
                                    placeholder="Enter your name"
                                />
                            ) : (
                                <p className="text-lg">{profile?.name || '-'}</p>
                            )}
                        </div>

                        {/* Age (Editable) */}
                        <div>
                            <label className={`block text-sm mb-1 ${theme === "dark" ? "text-gray-400" : "text-gray-600"
                                }`}>Age</label>
                            {isEditing ? (
                                <input
                                    type="number"
                                    name="age"
                                    value={formData.age}
                                    onChange={handleInputChange}
                                    className={`w-full px-3 py-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 ${theme === "dark"
                                        ? "bg-gray-600 text-white"
                                        : "bg-gray-100 text-gray-900 border border-gray-300"
                                        }`}
                                    placeholder="Enter your age"
                                />
                            ) : (
                                <p className="text-lg">{profile?.age || '-'}</p>
                            )}
                        </div>
                    </div>

                    {/* Edit Mode Buttons */}
                    {isEditing && (
                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={handleSave}
                                disabled={isLoading}
                                className="cursor-pointer flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2 rounded-lg transition-colors text-white"
                            >
                                <Save size={18} />
                                {isLoading ? 'Saving...' : 'Save Changes'}
                            </button>
                            <button
                                onClick={handleCancel}
                                disabled={isLoading}
                                className={`cursor-pointer flex items-center gap-2 disabled:opacity-50 px-4 py-2 rounded-lg transition-colors ${theme === "dark"
                                    ? "bg-gray-600 hover:bg-gray-500 text-white"
                                    : "bg-gray-200 hover:bg-gray-300 text-gray-900"
                                    }`}
                            >
                                <X size={18} />
                                Cancel
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;
