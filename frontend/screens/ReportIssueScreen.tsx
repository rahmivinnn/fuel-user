import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronDown, Camera, X } from 'lucide-react';
import AnimatedPage from '../components/AnimatedPage';

const ReportIssueScreen = () => {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
    const [description, setDescription] = useState('');
    const [attachments, setAttachments] = useState<File[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        // Check if user is logged in
        const userData = localStorage.getItem('user');
        if (!userData) {
            setIsLoggedIn(false);
            return;
        }
        setIsLoggedIn(true);
    }, []);

    // Show login prompt if not logged in
    if (!isLoggedIn) {
        return (
            <AnimatedPage>
                <div className="min-h-screen flex flex-col bg-white">
                    <header className="p-4 flex items-center bg-white border-b border-gray-100">
                        <button onClick={() => navigate('/support-help')} className="p-2 -ml-2">
                            <ArrowLeft className="w-5 h-5 text-gray-600" />
                        </button>
                        <h2 className="text-lg font-semibold text-center flex-grow -ml-10 text-gray-900">
                            Report an Issue
                        </h2>
                    </header>
                    
                    <div className="flex-1 flex flex-col items-center justify-center px-4">
                        <div className="text-center">
                            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <AlertTriangle className="w-10 h-10 text-gray-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Login Required</h3>
                            <p className="text-gray-600 mb-8 max-w-sm">
                                Please login to report an issue. This helps us track and respond to your report.
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

    const categories = [
        'Select a Category',
        'Fuel Delivery Problem',
        'Payment Issue',
        'App Technical Problem',
        'Account Access',
        'Other'
    ];

    const handleCategorySelect = (category: string) => {
        if (category !== 'Select a Category') {
            setSelectedCategory(category);
        }
        setShowCategoryDropdown(false);
    };

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files && files.length > 0) {
            const newFiles = Array.from(files).slice(0, 3 - attachments.length);
            setAttachments(prev => [...prev, ...newFiles]);
        }
        // Reset input value to allow selecting the same file again
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const removeAttachment = (index: number) => {
        setAttachments(prev => prev.filter((_, i) => i !== index));
    };

    const handleAddPhoto = () => {
        fileInputRef.current?.click();
    };

    const handleSubmit = async () => {
        if (!selectedCategory || selectedCategory === 'Select a Category' || !description.trim()) {
            alert('Please fill in all required fields');
            return;
        }

        setIsSubmitting(true);
        
        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false);
            navigate('/report-submitted');
        }, 2000);
    };

    const characterCount = description.length;
    const minCharacters = 10;

    // Close dropdown when clicking outside
    const handleDropdownBlur = () => {
        setTimeout(() => setShowCategoryDropdown(false), 150);
    };

    return (
        <AnimatedPage>
            <div className="min-h-screen bg-white">
                <header className="p-4 flex items-center bg-white border-b border-gray-100">
                    <button onClick={() => navigate('/support-help')} className="p-2 -ml-2">
                        <ArrowLeft className="w-5 h-5 text-gray-600" />
                    </button>
                    <h2 className="text-lg font-semibold text-center flex-grow -ml-10 text-gray-900">
                        Report an Issue
                    </h2>
                </header>

                <div className="p-4 space-y-6">
                    <p className="text-gray-600 text-sm">
                        Please provide details about the issue you're experiencing. Our support team will review and respond as soon as possible.
                    </p>

                    {/* Issue Category */}
                    <div>
                        <label className="text-gray-900 font-medium mb-3 block">Issue Category</label>
                        <div className="relative">
                            <button
                                onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                                onBlur={handleDropdownBlur}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-left flex items-center justify-between focus:outline-none focus:border-[#3AC36C]"
                            >
                                <span className={selectedCategory && selectedCategory !== 'Select a Category' ? 'text-gray-900' : 'text-gray-500'}>
                                    {selectedCategory || 'Select a Category'}
                                </span>
                                <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${
                                    showCategoryDropdown ? 'rotate-180' : ''
                                }`} />
                            </button>
                            
                            {showCategoryDropdown && (
                                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
                                    {categories.map((category, index) => (
                                        <button
                                            key={category}
                                            onClick={() => handleCategorySelect(category)}
                                            className={`w-full px-4 py-3 text-left hover:bg-gray-50 text-gray-900 ${
                                                index === 0 ? 'bg-[#3AC36C] text-white hover:bg-[#2ea85a]' : ''
                                            } ${
                                                index === categories.length - 1 ? 'rounded-b-lg' : ''
                                            }`}
                                        >
                                            {category}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="text-gray-900 font-medium mb-3 block">Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Please describe the issue in details..."
                            rows={6}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#3AC36C] resize-none text-sm"
                        />
                        <p className="text-xs text-gray-500 mt-2">
                            {characterCount}/{minCharacters} characters (minimum {minCharacters})
                        </p>
                    </div>

                    {/* Attachments */}
                    <div>
                        <label className="text-gray-900 font-medium mb-3 block">Attachments (Optional)</label>
                        
                        <div className="flex items-start gap-3">
                            {/* Uploaded Images */}
                            {attachments.map((file, index) => (
                                <div key={index} className="relative">
                                    <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden border">
                                        <img
                                            src={URL.createObjectURL(file)}
                                            alt={`Attachment ${index + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <button
                                        onClick={() => removeAttachment(index)}
                                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </div>
                            ))}
                            
                            {/* Add Photo Button */}
                            {attachments.length < 3 && (
                                <button
                                    onClick={handleAddPhoto}
                                    className="flex flex-col items-center justify-center w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-[#3AC36C] transition-colors"
                                >
                                    <Camera className="w-6 h-6 text-gray-400 mb-1" />
                                    <span className="text-xs text-gray-500">Add</span>
                                </button>
                            )}
                        </div>

                        {/* Hidden File Input */}
                        <input
                            ref={fileInputRef}
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleFileUpload}
                            className="hidden"
                        />

                        <p className="text-xs text-gray-500 mt-3">
                            You can add up to 3 photos
                        </p>
                    </div>

                    {/* Submit Button */}
                    <button
                        onClick={handleSubmit}
                        disabled={!selectedCategory || selectedCategory === 'Select a Category' || characterCount < minCharacters || isSubmitting}
                        className="w-full py-4 bg-[#3AC36C] text-white rounded-full font-semibold text-base hover:bg-[#2ea85a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? 'Submitting Report...' : 'Submit Report'}
                    </button>
                </div>
            </div>
        </AnimatedPage>
    );
};

export default ReportIssueScreen;