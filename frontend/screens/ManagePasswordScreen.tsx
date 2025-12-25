import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { useAppContext } from '../App';
import { apiChangePassword } from '../services/api';
import AnimatedPage from '../components/AnimatedPage';
import PasswordChangeSuccessModal from '../components/PasswordChangeSuccessModal';

const ManagePasswordScreen = () => {
    const navigate = useNavigate();
    const { user } = useAppContext();
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    
    const [formData, setFormData] = useState({
        email: user?.email || '',
        currentPassword: '',
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    useEffect(() => {
        // Check if user is logged in
        const userData = localStorage.getItem('user');
        if (!userData) {
            setIsLoggedIn(false);
            return;
        }
        setIsLoggedIn(true);
    }, [user]);

    // Show login prompt if not logged in
    if (!isLoggedIn) {
        return (
            <AnimatedPage>
                <div className="min-h-screen flex flex-col bg-white">
                    <header className="p-4 flex items-center bg-white border-b border-gray-100">
                        <button onClick={() => navigate('/settings')} className="p-2 -ml-2">
                            <ArrowLeft className="w-5 h-5 text-gray-600" />
                        </button>
                        <h2 className="text-lg font-semibold text-center flex-grow -ml-10 text-gray-900">Manage Password</h2>
                    </header>
                    
                    <div className="flex-1 flex flex-col items-center justify-center px-4">
                        <div className="text-center">
                            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2">
                                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                                    <circle cx="12" cy="16" r="1"/>
                                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Login Required</h3>
                            <p className="text-gray-600 mb-8 max-w-sm">
                                Please login to manage your password and account security.
                            </p>
                            <button 
                                onClick={() => navigate('/login')}
                                className="bg-[#3AC36C] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#2ea85a] transition-colors"
                            >
                                Login Now
                            </button>
                        </div>
                    </div>
                </div>
            </AnimatedPage>
        );
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePasswordChange = async () => {
        setLoading(true);
        setError('');
        
        // Validation
        if (!formData.currentPassword) {
            setError('Current password is required');
            setLoading(false);
            return;
        }
        
        if (!formData.newPassword) {
            setError('New password is required');
            setLoading(false);
            return;
        }
        
        if (formData.newPassword !== formData.confirmPassword) {
            setError('New passwords do not match');
            setLoading(false);
            return;
        }
        
        if (formData.newPassword.length < 6) {
            setError('New password must be at least 6 characters');
            setLoading(false);
            return;
        }
        
        try {
            await apiChangePassword(
                user?.id || '',
                formData.currentPassword,
                formData.newPassword
            );
            
            setShowSuccessModal(true);
            setFormData({
                ...formData,
                currentPassword: '',
                oldPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
            
        } catch (err: any) {
            setError(err.message || 'Failed to change password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatedPage>
            <div className="min-h-screen bg-white">
                <header className="p-4 flex items-center bg-white border-b border-gray-100">
                    <button onClick={() => navigate('/settings')} className="p-2 -ml-2">
                        <ArrowLeft className="w-5 h-5 text-gray-600" />
                    </button>
                    <h2 className="text-lg font-semibold text-center flex-grow -ml-10 text-gray-900">Manage Password</h2>
                </header>

                <div className="p-4 space-y-6">
                    {/* Error Messages */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                            <p className="text-red-600 text-sm text-center">{error}</p>
                        </div>
                    )}

                    {/* Current Password Section */}
                    <div>
                        <h3 className="text-gray-900 font-medium mb-4">Current Password</h3>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="text-gray-600 text-sm mb-2 block">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-full bg-gray-50 text-gray-600"
                                    readOnly
                                />
                            </div>
                            
                            <div>
                                <label className="text-gray-600 text-sm mb-2 block">Password</label>
                                <div className="relative">
                                    <input
                                        type={showCurrentPassword ? "text" : "password"}
                                        name="currentPassword"
                                        value={formData.currentPassword}
                                        onChange={handleChange}
                                        placeholder="password"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:border-[#3AC36C]"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                        className="absolute right-4 top-1/2 transform -translate-y-1/2"
                                    >
                                        {showCurrentPassword ? <EyeOff size={20} className="text-gray-400" /> : <Eye size={20} className="text-gray-400" />}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Change Current Password Section */}
                    <div>
                        <h3 className="text-gray-900 font-medium mb-4">Change Current Password</h3>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="text-gray-600 text-sm mb-2 block">Enter Old Password</label>
                                <input
                                    type="email"
                                    name="oldPassword"
                                    value={formData.oldPassword}
                                    onChange={handleChange}
                                    placeholder="robinabc35@gmail.com"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:border-[#3AC36C]"
                                />
                            </div>
                            
                            <div>
                                <label className="text-gray-600 text-sm mb-2 block">Write New Password</label>
                                <div className="relative">
                                    <input
                                        type={showNewPassword ? "text" : "password"}
                                        name="newPassword"
                                        value={formData.newPassword}
                                        onChange={handleChange}
                                        placeholder="Password"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:border-[#3AC36C]"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                        className="absolute right-4 top-1/2 transform -translate-y-1/2"
                                    >
                                        {showNewPassword ? <EyeOff size={20} className="text-gray-400" /> : <Eye size={20} className="text-gray-400" />}
                                    </button>
                                </div>
                            </div>
                            
                            <div>
                                <label className="text-gray-600 text-sm mb-2 block">Confirm New Password</label>
                                <div className="relative">
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        placeholder="Password"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:border-[#3AC36C]"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-4 top-1/2 transform -translate-y-1/2"
                                    >
                                        {showConfirmPassword ? <EyeOff size={20} className="text-gray-400" /> : <Eye size={20} className="text-gray-400" />}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Password Change Button */}
                    <button
                        onClick={handlePasswordChange}
                        disabled={loading}
                        className="w-full py-4 bg-[#3AC36C] text-white rounded-full font-semibold text-base hover:bg-[#2ea85a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Changing Password...' : 'Password Change'}
                    </button>
                </div>

                {/* Success Modal */}
                <PasswordChangeSuccessModal 
                    isOpen={showSuccessModal}
                    onClose={() => setShowSuccessModal(false)}
                />
            </div>
        </AnimatedPage>
    );
};

export default ManagePasswordScreen;