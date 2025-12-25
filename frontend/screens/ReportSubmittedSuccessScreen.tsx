import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';
import AnimatedPage from '../components/AnimatedPage';

const ReportSubmittedSuccessScreen = () => {
    const navigate = useNavigate();

    const handleSubmitAnother = () => {
        navigate('/report-issue');
    };

    const handleGoHome = () => {
        navigate('/home');
    };

    return (
        <AnimatedPage>
            <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
                <div className="text-center max-w-sm">
                    {/* Success Icon */}
                    <div className="w-20 h-20 bg-[#3AC36C] rounded-full flex items-center justify-center mx-auto mb-8">
                        <Check className="w-10 h-10 text-white stroke-[3]" />
                    </div>

                    {/* Success Message */}
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                        Report Submitted Successfully!
                    </h2>
                    
                    <p className="text-gray-600 text-sm leading-relaxed mb-12">
                        Thank you for reporting the issue. Our team will review your report and get back to you as soon as possible.
                    </p>

                    {/* Action Buttons */}
                    <div className="space-y-4">
                        <button
                            onClick={handleSubmitAnother}
                            className="w-full py-4 border border-gray-300 text-gray-700 rounded-full font-medium hover:bg-gray-50 transition-colors"
                        >
                            Submit another report
                        </button>
                        
                        <button
                            onClick={handleGoHome}
                            className="w-full py-4 bg-transparent text-[#3AC36C] font-medium hover:underline transition-colors"
                        >
                            Go to Home
                        </button>
                    </div>
                </div>
            </div>
        </AnimatedPage>
    );
};

export default ReportSubmittedSuccessScreen;