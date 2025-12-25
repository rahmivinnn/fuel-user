import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, ChevronDown } from 'lucide-react';
import { useAppContext } from '../App';
import AnimatedPage from '../components/AnimatedPage';

const AccountDeletionScreen = () => {
    const navigate = useNavigate();
    const { logout } = useAppContext();
    const [selectedReason, setSelectedReason] = useState('');
    const [showReasonDropdown, setShowReasonDropdown] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const deletionReasons = [
        'No longer need the service',
        'Facing technical issues',
        'Privacy concern',
        'App Technical Problem',
        'Found a better alternative',
        'Other'
    ];

    const handleReasonSelect = (reason: string) => {
        setSelectedReason(reason);
        setShowReasonDropdown(false);
    };

    const handleDropdownBlur = () => {
        setTimeout(() => setShowReasonDropdown(false), 150);
    };

    const handleDeleteAccount = async () => {
        if (window.confirm('Are you absolutely sure? This action cannot be undone.')) {
            setIsDeleting(true);
            
            // Simulate API call for account deletion
            setTimeout(() => {
                setIsDeleting(false);
                logout();
                navigate('/account-deleted');
            }, 3000);
        }
    };

    const handleCancel = () => {
        navigate('/settings');
    };

    return (
        <AnimatedPage>
            <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
                <div className="max-w-sm w-full text-center">
                    {/* Warning Icon */}
                    <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <AlertTriangle className="w-8 h-8 text-red-500" />
                    </div>

                    {/* Title */}
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                        Are you sure you want to delete your account?
                    </h2>
                    
                    {/* Warning Message */}
                    <p className="text-gray-600 text-sm mb-6">
                        This Action is permanent and cannot be undone.
                    </p>

                    {/* Deletion Details */}
                    <div className="text-left mb-6">
                        <p className="text-gray-900 font-medium text-sm mb-3">
                            Deleting your FuelFriendly account will:
                        </p>
                        <ul className="text-gray-600 text-sm space-y-2">
                            <li className="flex items-start">
                                <span className="text-red-500 mr-2">•</span>
                                Remove all your personal data and saved information.
                            </li>
                            <li className="flex items-start">
                                <span className="text-red-500 mr-2">•</span>
                                Cancel any active subscriptions or ongoing orders.
                            </li>
                            <li className="flex items-start">
                                <span className="text-red-500 mr-2">•</span>
                                Erase your payment methods and transaction history.
                            </li>
                            <li className="flex items-start">
                                <span className="text-red-500 mr-2">•</span>
                                Disable access to the FuelFriend app and services.
                            </li>
                        </ul>
                    </div>

                    {/* Reason Dropdown */}
                    <div className="mb-6">
                        <label className="text-gray-900 font-medium text-sm mb-3 block text-left">
                            Tell us why you are leaving (Optional)
                        </label>
                        <div className="relative">
                            <button
                                onClick={() => setShowReasonDropdown(!showReasonDropdown)}
                                onBlur={handleDropdownBlur}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-left flex items-center justify-between focus:outline-none focus:border-red-500"
                            >
                                <span className={selectedReason ? 'text-gray-900' : 'text-gray-500'}>
                                    {selectedReason || 'Select...'}
                                </span>
                                <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${
                                    showReasonDropdown ? 'rotate-180' : ''
                                }`} />
                            </button>
                            
                            {showReasonDropdown && (
                                <div className="absolute bottom-full left-0 right-0 mb-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
                                    {deletionReasons.map((reason, index) => (
                                        <button
                                            key={reason}
                                            onClick={() => handleReasonSelect(reason)}
                                            className={`w-full px-4 py-3 text-left hover:bg-gray-50 text-gray-900 text-sm ${
                                                selectedReason === reason ? 'bg-[#3AC36C] text-white hover:bg-[#2ea85a]' : ''
                                            } ${
                                                index === 0 ? 'rounded-t-lg' : ''
                                            } ${
                                                index === deletionReasons.length - 1 ? 'rounded-b-lg' : ''
                                            }`}
                                        >
                                            {reason}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-3">
                        <button
                            onClick={handleDeleteAccount}
                            disabled={isDeleting}
                            className="w-full py-4 bg-red-500 text-white rounded-full font-semibold hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isDeleting ? 'Deleting Account...' : 'Delete Account'}
                        </button>
                        
                        <button
                            onClick={handleCancel}
                            disabled={isDeleting}
                            className="w-full py-4 border border-gray-300 text-gray-700 rounded-full font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </AnimatedPage>
    );
};

export default AccountDeletionScreen;