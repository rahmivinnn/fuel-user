import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronRight, Lock, CreditCard, Calculator, Sun, Moon, Bell, HelpCircle, FileText, Shield, Trash2, LogOut, User } from 'lucide-react';
import { useAppContext } from '../App';
import { pushNotificationService } from '../services/pushNotification';
import AnimatedPage from '../components/AnimatedPage';

const SettingsItem = ({ icon, text, onClick }: { icon: React.ReactNode, text: string, onClick?: () => void }) => (
    <div onClick={onClick} className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors">
        <div className="flex items-center">
            <div className="mr-4 text-gray-600">{icon}</div>
            <span className="text-gray-800 text-base">{text}</span>
        </div>
        <ChevronRight className="text-gray-400" size={20} />
    </div>
);

const SettingsScreen = () => {
    const navigate = useNavigate();
    const { logout, user } = useAppContext();
    const [notifStatus, setNotifStatus] = useState<string>('');

    const handleLogout = () => {
        if (confirm('Are you sure you want to log out?')) {
            logout();
        }
    };

    const enableNotifications = async () => {
        try {
            const token = await pushNotificationService.initializePushNotifications();
            if (token) {
                setNotifStatus('Notifications enabled');
                console.log('FCM Token:', token);
            } else {
                setNotifStatus('Permission denied or not supported');
            }
        } catch (e: any) {
            setNotifStatus(e?.message || 'Failed to enable notifications');
        }
    };

    const testPush = async () => {
        try {
            const success = await pushNotificationService.sendTestNotification();
            if (success) {
                setNotifStatus('Test notification sent');
            } else {
                setNotifStatus('Failed to send test notification');
            }
        } catch {
            setNotifStatus('Test failed');
        }
    };

    return (
        <AnimatedPage>
        <div className="min-h-screen bg-white">
            <header className="p-4 flex items-center bg-white border-b border-gray-100">
                <button onClick={() => navigate('/home')} className="p-2 -ml-2">
                    <ArrowLeft className="w-5 h-5 text-gray-600" />
                </button>
                <h2 className="text-lg font-semibold text-center flex-grow -ml-10 text-gray-900">Settings</h2>
            </header>

            <div className="p-4 space-y-6">
                <div>
                    <h3 className="text-gray-500 text-sm font-medium mb-3 px-2">Security & Passwords</h3>
                    <div className="bg-white border-t border-b border-gray-200">
                        <SettingsItem icon={<Lock size={20} />} text="Manage Passwords" onClick={() => navigate('/manage-password')} />
                        <div className="border-t border-gray-100"></div>
                        <SettingsItem icon={<CreditCard size={20} />} text="Manage Payment Method" />
                        <div className="border-t border-gray-100"></div>
                        <SettingsItem icon={<Calculator size={20} />} text="Fuel Efficiency Calculator" onClick={() => navigate('/fuel-calculator')} />
                        <div className="border-t border-gray-100"></div>
                        <SettingsItem icon={<Sun size={20} />} text="Themes" onClick={() => navigate('/theme')} />
                        <div className="border-t border-gray-100"></div>
                        <SettingsItem icon={<Bell size={20} />} text="Notification Settings" onClick={() => navigate('/notification-settings')} />
                    </div>
                </div>

                <div>
                    <h3 className="text-gray-500 text-sm font-medium mb-3 px-2">Customer Care</h3>
                    <div className="bg-white border-t border-b border-gray-200">
                        <SettingsItem icon={<HelpCircle size={20} />} text="Help and Support" />
                        <div className="border-t border-gray-100"></div>
                        <SettingsItem icon={<FileText size={20} />} text="Terms and Conditions" />
                        <div className="border-t border-gray-100"></div>
                        <SettingsItem icon={<Shield size={20} />} text="Privacy Policy" />
                        <div className="border-t border-gray-100"></div>
                        <SettingsItem icon={<Trash2 size={20} />} text="Request Account Deletion" />
                    </div>
                </div>
            </div>
        </div>
        </AnimatedPage>
    );
};

export default SettingsScreen;