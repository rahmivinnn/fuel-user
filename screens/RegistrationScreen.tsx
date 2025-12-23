import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, Eye, EyeOff, Mail, MessageSquare } from 'lucide-react';
import { useAppContext } from '../App';
import { apiRegister, apiLogin } from '../services/api';
import Logo from '../components/Logo';
import AnimatedPage from '../components/AnimatedPage';
import VerificationSuccess from '../components/VerificationSuccess';
import { verificationService } from '../services/verificationService';

const Stepper = ({ currentStep }: { currentStep: number }) => {
    const steps = [1, 2, 3];
    return (
        <div className="flex items-center justify-center w-full my-6">
            {steps.map((step, index) => (
                <React.Fragment key={index}>
                    <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center font-semibold ${
                        index + 1 === currentStep 
                            ? 'bg-green-500 border-green-500 text-white' 
                            : index + 1 < currentStep
                            ? 'bg-green-500 border-green-500 text-white'
                            : 'bg-white border-gray-300 text-gray-400'
                    }`}>
                        {step}
                    </div>
                    {index < steps.length - 1 && (
                        <div className={`flex-1 h-0.5 mx-4 ${
                            index + 1 < currentStep ? 'bg-green-500' : 'bg-gray-300'
                        }`} style={{ minWidth: '60px' }}></div>
                    )}
                </React.Fragment>
            ))}
        </div>
    );
};

const RegistrationScreen = () => {
    const navigate = useNavigate();
    const { login, updateUser } = useAppContext();
    const [step, setStep] = useState(1);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        password: '',
        vehicleBrand: '',
        vehicleColor: '',
        licenseNumber: '',
        fuelType: 'Petrol',
    });
    const [loading, setLoading] = useState(false);
    const [verificationMethod, setVerificationMethod] = useState<'sms' | 'email' | null>(null);

    const handleNext = () => setStep(s => s + 1);
    const handleBack = () => {
        if (step > 1) {
            setStep(s => s - 1);
        } else {
            navigate(-1);
        }
    };
    
    const createAccount = async () => {
        setLoading(true);
        setError('');
        try {
            // Transform data to match backend API expectations
            const apiData = {
                fullName: formData.fullName,
                email: formData.email,
                phoneNumber: formData.phone, // Backend expects phoneNumber, not phone
                password: formData.password,
                vehicleBrand: formData.vehicleBrand,
                vehicleColor: formData.vehicleColor,
                licenseNumber: formData.licenseNumber,
                fuelType: formData.fuelType
            };
            
            await apiRegister(apiData);
            setStep(4);
        } catch (error) {
            console.error("Registration failed:", error);
            
            // Extract error message from API response
            let errorMessage = "Registration failed. Please try again.";
            if (error.response?.data?.error) {
                errorMessage = error.response.data.error;
            } else if (error.message) {
                errorMessage = error.message;
            }
            
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const renderStep = () => {
        switch (step) {
            case 1:
                return <Step1 next={handleNext} formData={formData} handleChange={handleChange} />;
            case 2:
                return <Step2 next={handleNext} back={handleBack} formData={formData} handleChange={handleChange} />;
            case 3:
                return <Step3 createAccount={createAccount} editDetails={() => setStep(1)} formData={formData} loading={loading} error={error} />;
            case 4:
                return <EmailVerificationStep 
                    formData={formData} 
                    onBack={handleBack}
                    onNext={() => setStep(5)}
                    onTryAnotherWay={() => setStep(6)}
                />;
            case 5:
                return <EmailOTPVerification 
                    formData={formData} 
                    onBack={() => setStep(4)}
                    onComplete={() => setStep(8)}
                />;
            case 6:
                return <WhatsAppVerificationStep 
                    formData={formData} 
                    onBack={() => setStep(4)}
                    onNext={() => setStep(7)}
                />;
            case 7:
                return <WhatsAppOTPVerification 
                    formData={formData} 
                    onBack={() => setStep(6)}
                    onComplete={() => setStep(9)}
                />;
            case 8:
                return <VerificationSuccess type="email" formData={formData} />;
            case 9:
                return <VerificationSuccess type="whatsapp" formData={formData} />;
            default:
                return <Step1 next={handleNext} formData={formData} handleChange={handleChange} />;
        }
    };

    return (
        <AnimatedPage>
            <div className="min-h-screen flex flex-col p-4 bg-white dark:bg-dark-bg text-light-text dark:text-dark-text">
                <header className="flex items-center mb-0">
                    <button 
                        onClick={handleBack} 
                        className="p-2 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center"
                    >
                        <ArrowLeft size={20} />
                    </button>
                </header>
                
                <div className="flex flex-col items-center mb-4">
                    <div className="w-32 h-32 mb-4">
                        <Logo />
                    </div>
                </div>

                <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Registration</h2>
                </div>

                {step < 4 && (
                    <>
                        <Stepper currentStep={step} />
                        {step === 1 && (
                            <div className="flex justify-center mb-4">
                                <img 
                                    src="/car.png" 
                                    alt="Car icon" 
                                    className="w-12 h-8"
                                    onError={(e) => {
                                        e.currentTarget.style.display = 'none';
                                    }}
                                />
                            </div>
                        )}
                        {step === 2 && (
                            <div className="flex justify-center mb-4">
                                <img 
                                    src="/car.png" 
                                    alt="Car icon" 
                                    className="w-12 h-8"
                                    onError={(e) => {
                                        e.currentTarget.style.display = 'none';
                                    }}
                                />
                            </div>
                        )}
                        {step === 3 && (
                            <div className="flex justify-center mb-4">
                                <img 
                                    src="/car.png" 
                                    alt="Car icon" 
                                    className="w-12 h-8"
                                    onError={(e) => {
                                        e.currentTarget.style.display = 'none';
                                    }}
                                />
                            </div>
                        )}
                    </>
                )}

                <div className="flex-grow mt-0">
                    {renderStep()}
                </div>
            </div>
        </AnimatedPage>
    );
};

interface StepProps {
    next: () => void;
    back?: () => void;
    formData: any;
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    loading?: boolean;
}

const Step1 = ({ next, formData, handleChange }: StepProps) => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }
        next();
    }
    
    return (
        <div className="space-y-4">
            <form onSubmit={handleFormSubmit} className="space-y-4">
                <input 
                    name="fullName" 
                    type="text" 
                    placeholder="Full Name"
                    value={formData.fullName} 
                    onChange={handleChange} 
                    className="w-full px-6 py-4 rounded-full border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-green-500 text-base placeholder-gray-400" 
                    required 
                />
                
                <input 
                    name="email" 
                    type="email" 
                    placeholder="Email address"
                    value={formData.email} 
                    onChange={handleChange} 
                    className="w-full px-6 py-4 rounded-full border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-green-500 text-base placeholder-gray-400" 
                    required 
                />
                
                <input 
                    name="phone" 
                    type="tel" 
                    placeholder="Phone Number"
                    value={formData.phone} 
                    onChange={handleChange} 
                    className="w-full px-6 py-4 rounded-full border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-green-500 text-base placeholder-gray-400" 
                    required 
                />
                
                <div className="relative">
                    <input 
                        name="password" 
                        type={showPassword ? "text" : "password"} 
                        placeholder="Password"
                        value={formData.password} 
                        onChange={handleChange} 
                        className="w-full px-6 py-4 rounded-full border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-green-500 text-base placeholder-gray-400" 
                        required 
                    />
                    <button 
                        type="button" 
                        onClick={() => setShowPassword(!showPassword)} 
                        className="absolute inset-y-0 right-0 px-6 flex items-center text-gray-400"
                    >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                </div>
                
                <div className="relative">
                    <input 
                        type={showConfirmPassword ? "text" : "password"} 
                        placeholder="Confirm Password"
                        value={confirmPassword} 
                        onChange={(e) => setConfirmPassword(e.target.value)} 
                        className="w-full px-6 py-4 rounded-full border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-green-500 text-base placeholder-gray-400" 
                        required 
                    />
                    <button 
                        type="button" 
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)} 
                        className="absolute inset-y-0 right-0 px-6 flex items-center text-gray-400"
                    >
                        {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                </div>
                
                <button 
                    type="submit" 
                    className="w-full bg-green-500 text-white py-4 rounded-full text-base font-semibold shadow-lg transition-all active:scale-95 hover:shadow-xl mt-6"
                >
                    Next
                </button>
            </form>
            
            <div className="text-center text-gray-500 text-base mt-6">
                Or
            </div>
            
            <button 
                type="button"
                className="w-full flex items-center justify-center bg-white border-2 border-green-500 text-gray-700 py-4 rounded-full text-base font-medium transition-all active:scale-95 hover:shadow-md"
            >
                <img src="https://www.google.com/favicon.ico" alt="Google icon" className="w-5 h-5 mr-3" />
                Continue with Google
            </button>
        </div>
    );
};

const Step2 = ({ next, back, formData, handleChange }: StepProps) => (
    <div className="space-y-4">
        <form onSubmit={(e) => { e.preventDefault(); next(); }} className="space-y-4">
            <input 
                name="vehicleBrand" 
                type="text" 
                placeholder="Vehicle Brand"
                value={formData.vehicleBrand} 
                onChange={handleChange} 
                className="w-full px-6 py-4 rounded-full border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-green-500 text-base placeholder-gray-400" 
                required 
            />
            
            <input 
                name="vehicleColor" 
                type="text" 
                placeholder="Vehicle Color"
                value={formData.vehicleColor} 
                onChange={handleChange} 
                className="w-full px-6 py-4 rounded-full border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-green-500 text-base placeholder-gray-400" 
                required 
            />
            
            <input 
                name="licenseNumber" 
                type="text" 
                placeholder="License Number"
                value={formData.licenseNumber} 
                onChange={handleChange} 
                className="w-full px-6 py-4 rounded-full border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-green-500 text-base placeholder-gray-400" 
                required 
            />
            
            <div className="relative">
                <select 
                    name="fuelType" 
                    value={formData.fuelType} 
                    onChange={handleChange} 
                    className="w-full px-6 py-4 rounded-full border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-green-500 text-base appearance-none"
                >
                    <option value="" disabled>Fuel type</option>
                    <option value="Petrol">Petrol</option>
                    <option value="Diesel">Diesel</option>
                    <option value="Electric">Electric</option>
                    <option value="Hybrid">Hybrid</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-6 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </div>
            
            <button 
                type="button"
                className="w-full flex items-center justify-center px-6 py-4 rounded-full border border-gray-300 bg-white text-green-500 text-base font-medium transition-all active:scale-95 hover:shadow-md"
            >
                <span className="text-2xl mr-3">+</span>
                Add Vehicle
            </button>
            
            <button 
                type="submit" 
                className="w-full bg-green-500 text-white py-4 rounded-full text-base font-semibold shadow-lg transition-all active:scale-95 hover:shadow-xl mt-6"
            >
                Next
            </button>
        </form>
    </div>
);

const Step3 = ({ createAccount, editDetails, formData, loading, error }: { createAccount: () => void; editDetails: () => void; formData: any; loading: boolean; error?: string }) => (
    <div className="space-y-6">
        {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                <p className="text-red-600 dark:text-red-400 text-sm text-center">{error}</p>
            </div>
        )}
        
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <div className="space-y-4">
                <div className="flex justify-between items-center pb-2 border-b border-dotted border-gray-300">
                    <span className="text-gray-600 font-medium">Name</span>
                    <span className="text-gray-800 font-medium">{formData.fullName}</span>
                </div>
                
                <div className="flex justify-between items-center pb-2 border-b border-dotted border-gray-300">
                    <span className="text-gray-600 font-medium">Emai Address</span>
                    <span className="text-gray-800 font-medium">{formData.email}</span>
                </div>
                
                <div className="flex justify-between items-center pb-2 border-b border-dotted border-gray-300">
                    <span className="text-gray-600 font-medium">Phone No.</span>
                    <span className="text-gray-800 font-medium">{formData.phone}</span>
                </div>
                
                <div className="flex justify-between items-center pb-2 border-b border-dotted border-gray-300">
                    <span className="text-gray-600 font-medium">Password</span>
                    <span className="text-gray-800 font-medium">••••••••</span>
                </div>
                
                <div className="flex justify-between items-center pb-2 border-b border-dotted border-gray-300">
                    <span className="text-gray-600 font-medium">Vehicle Brand</span>
                    <span className="text-gray-800 font-medium">{formData.vehicleBrand}</span>
                </div>
                
                <div className="flex justify-between items-center pb-2 border-b border-dotted border-gray-300">
                    <span className="text-gray-600 font-medium">Vehicle color</span>
                    <span className="text-gray-800 font-medium">{formData.vehicleColor}</span>
                </div>
                
                <div className="flex justify-between items-center pb-2 border-b border-dotted border-gray-300">
                    <span className="text-gray-600 font-medium">License Number</span>
                    <span className="text-gray-800 font-medium">{formData.licenseNumber}</span>
                </div>
                
                <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-medium">Fuel Type</span>
                    <span className="text-gray-800 font-medium">{formData.fuelType}</span>
                </div>
            </div>
        </div>
        
        <button 
            onClick={createAccount} 
            disabled={loading}
            className="w-full bg-green-500 text-white py-4 rounded-full text-base font-semibold shadow-lg transition-all active:scale-95 hover:shadow-xl disabled:bg-green-500/70"
        >
            {loading ? 'Creating Account...' : 'Create Account'}
        </button>
        
        <div className="text-center">
            <button 
                onClick={editDetails} 
                className="text-green-500 font-semibold text-base underline hover:no-underline"
            >
                Edit Details
            </button>
        </div>
    </div>
);

const EmailVerificationStep = ({ formData, onBack, onNext, onTryAnotherWay }: { 
    formData: any; 
    onBack: () => void;
    onNext: () => void;
    onTryAnotherWay: () => void;
}) => {
    const [email, setEmail] = useState(formData.email);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSendCode = async () => {
        setLoading(true);
        setError('');
        
        try {
            const response = await fetch(`https://apidecor.kelolahrd.life/api/otp/email/send`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email })
            });
            
            const data = await response.json();
            
            if (data.success) {
                onNext();
            } else {
                setError(data.error || 'Failed to send email OTP');
            }
        } catch (err) {
            setError('Failed to send email OTP');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            {/* Email Icon */}
            <div className="flex justify-center">
                <div className="w-32 h-32 bg-green-100 rounded-full flex items-center justify-center">
                    <Mail size={48} className="text-green-500" />
                </div>
            </div>

            {/* Title */}
            <h2 className="text-2xl font-bold text-gray-800 text-center">
                Email Verification
            </h2>

            {/* Description */}
            <p className="text-base text-gray-600 text-center">
                Enter your email address to receive verification code
            </p>

            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <p className="text-red-600 text-sm text-center">{error}</p>
                </div>
            )}

            {/* Email Input */}
            <input 
                type="email" 
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-6 py-4 rounded-full border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-green-500 text-base placeholder-gray-400" 
            />

            {/* Send Code Button */}
            <button 
                onClick={handleSendCode}
                disabled={loading || !email}
                className="w-full bg-green-500 text-white py-4 rounded-full text-base font-semibold shadow-lg transition-all active:scale-95 hover:shadow-xl disabled:bg-green-500/70"
            >
                {loading ? 'Sending...' : 'Send Code'}
            </button>

            {/* Try Another Way */}
            <div className="text-center">
                <button 
                    onClick={onTryAnotherWay}
                    className="text-gray-600 text-base hover:underline"
                >
                    Try another way
                </button>
            </div>
        </div>
    );
};

const EmailOTPVerification = ({ formData, onBack, onComplete }: { 
    formData: any;
    onBack: () => void;
    onComplete: () => void;
}) => {
    const { updateUser } = useAppContext();
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [timer, setTimer] = useState(60);
    const [canResend, setCanResend] = useState(false);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    useEffect(() => {
        if (timer > 0) {
            const interval = setInterval(() => {
                setTimer(t => t - 1);
            }, 1000);
            return () => clearInterval(interval);
        } else {
            setCanResend(true);
        }
    }, [timer]);

    const handleOtpChange = (index: number, value: string) => {
        if (value.length > 1) return;
        
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto focus next input
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleVerify = async () => {
        setLoading(true);
        setError('');
        
        try {
            const otpCode = otp.join('');
            const response = await fetch(`https://apidecor.kelolahrd.life/api/otp/verify`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                    identifier: formData.email, 
                    otp: otpCode 
                })
            });
            
            const data = await response.json();
            
            if (data.success) {
                const userData = {
                    id: `user-${Date.now()}`,
                    fullName: formData.fullName,
                    email: formData.email,
                    phone: formData.phone,
                    city: '',
                    avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.fullName)}&background=random`,
                    vehicles: [{
                        id: `v-${Date.now()}`,
                        brand: formData.vehicleBrand,
                        color: formData.vehicleColor,
                        licenseNumber: formData.licenseNumber,
                        fuelType: formData.fuelType
                    }]
                };
                updateUser(userData);
                onComplete();
            } else {
                setError(data.error || 'Invalid verification code');
            }
        } catch (err) {
            setError('Verification failed');
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        setTimer(60);
        setCanResend(false);
        setError('');
        
        try {
            const response = await fetch(`https://apidecor.kelolahrd.life/api/otp/email/send`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email: formData.email })
            });
        } catch (err) {
            // Handle error silently
        }
    };

    return (
        <div className="space-y-8">
            {/* Email Icon */}
            <div className="flex justify-center">
                <div className="w-32 h-32 bg-green-100 rounded-full flex items-center justify-center">
                    <Mail size={48} className="text-green-500" />
                </div>
            </div>

            {/* Title */}
            <h2 className="text-2xl font-bold text-gray-800 text-center">
                Verify code
            </h2>

            {/* Description */}
            <p className="text-base text-gray-600 text-center">
                Enter four-digits verification code sent to {formData.email}
            </p>

            {/* OTP Input Boxes */}
            <div className="flex justify-center space-x-3">
                {otp.map((digit, index) => (
                    <input
                        key={index}
                        ref={(el) => (inputRefs.current[index] = el)}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value.replace(/\D/g, ''))}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        className="w-16 h-16 text-center text-xl font-semibold border-2 border-green-300 rounded-2xl focus:outline-none focus:border-green-500 bg-white"
                    />
                ))}
            </div>
            
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-2">
                    <p className="text-red-600 text-sm text-center">{error}</p>
                </div>
            )}
            
            <button
                onClick={handleVerify}
                disabled={loading || otp.some(digit => !digit)}
                className="w-full bg-green-500 text-white py-4 rounded-full text-base font-semibold shadow-lg transition-all active:scale-95 hover:shadow-xl disabled:bg-green-500/70"
            >
                {loading ? 'Verifying...' : 'Verify'}
            </button>

            {/* Resend Section */}
            <div className="text-center space-y-2">
                <p className="text-gray-600">
                    Haven't received the verification code?
                </p>
                <button
                    onClick={handleResend}
                    disabled={!canResend || loading}
                    className="text-green-500 font-semibold hover:underline disabled:text-gray-400 disabled:cursor-not-allowed"
                >
                    {canResend ? 'Resend' : 'Resend'}
                </button>
                {!canResend && (
                    <p className="text-gray-500 text-sm">{timer}s</p>
                )}
            </div>
        </div>
    );
};

const WhatsAppVerificationStep = ({ formData, onBack, onNext }: { 
    formData: any; 
    onBack: () => void;
    onNext: () => void;
}) => {
    const [phone, setPhone] = useState(formData.phone);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSendCode = async () => {
        setLoading(true);
        setError('');
        
        try {
            const response = await fetch(`https://apidecor.kelolahrd.life/api/otp/whatsapp/send`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ phoneNumber: phone })
            });
            
            const data = await response.json();
            
            if (data.success) {
                onNext();
            } else {
                setError(data.error || 'Failed to send WhatsApp OTP');
            }
        } catch (err) {
            setError('Failed to send WhatsApp OTP');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            {/* WhatsApp Icon */}
            <div className="flex justify-center">
                <div className="w-32 h-32 bg-green-100 rounded-full flex items-center justify-center">
                    <MessageSquare size={48} className="text-green-500" />
                </div>
            </div>

            {/* Title */}
            <h2 className="text-2xl font-bold text-gray-800 text-center">
                WhatsApp Verification
            </h2>

            {/* Description */}
            <p className="text-base text-gray-600 text-center">
                Enter your phone number to receive verification code via WhatsApp
            </p>

            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <p className="text-red-600 text-sm text-center">{error}</p>
                </div>
            )}

            {/* Phone Input */}
            <input 
                type="tel" 
                placeholder="Phone Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-6 py-4 rounded-full border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-green-500 text-base placeholder-gray-400" 
            />

            {/* Send Code Button */}
            <button 
                onClick={handleSendCode}
                disabled={loading || !phone}
                className="w-full bg-green-500 text-white py-4 rounded-full text-base font-semibold shadow-lg transition-all active:scale-95 hover:shadow-xl disabled:bg-green-500/70"
            >
                {loading ? 'Sending...' : 'Send Code'}
            </button>

            {/* Back to Email */}
            <div className="text-center">
                <button 
                    onClick={onBack}
                    className="text-gray-600 text-base hover:underline"
                >
                    Back to Email
                </button>
            </div>
        </div>
    );
};

const WhatsAppOTPVerification = ({ formData, onBack, onComplete }: { 
    formData: any;
    onBack: () => void;
    onComplete: () => void;
}) => {
    const { updateUser } = useAppContext();
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [timer, setTimer] = useState(60);
    const [canResend, setCanResend] = useState(false);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    useEffect(() => {
        if (timer > 0) {
            const interval = setInterval(() => {
                setTimer(t => t - 1);
            }, 1000);
            return () => clearInterval(interval);
        } else {
            setCanResend(true);
        }
    }, [timer]);

    const handleOtpChange = (index: number, value: string) => {
        if (value.length > 1) return;
        
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto focus next input
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleVerify = async () => {
        setLoading(true);
        setError('');
        
        try {
            const otpCode = otp.join('');
            const response = await fetch(`https://apidecor.kelolahrd.life/api/otp/verify`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                    identifier: formData.phone, 
                    otp: otpCode 
                })
            });
            
            const data = await response.json();
            
            if (data.success) {
                const userData = {
                    id: `user-${Date.now()}`,
                    fullName: formData.fullName,
                    email: formData.email,
                    phone: formData.phone,
                    city: '',
                    avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.fullName)}&background=random`,
                    vehicles: [{
                        id: `v-${Date.now()}`,
                        brand: formData.vehicleBrand,
                        color: formData.vehicleColor,
                        licenseNumber: formData.licenseNumber,
                        fuelType: formData.fuelType
                    }]
                };
                updateUser(userData);
                onComplete();
            } else {
                setError(data.error || 'Invalid verification code');
            }
        } catch (err) {
            setError('Verification failed');
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        setTimer(60);
        setCanResend(false);
        setError('');
        
        try {
            const response = await fetch(`https://apidecor.kelolahrd.life/api/otp/whatsapp/send`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ phoneNumber: formData.phone })
            });
        } catch (err) {
            // Handle error silently
        }
    };

    return (
        <div className="space-y-8">
            {/* WhatsApp Icon */}
            <div className="flex justify-center">
                <div className="w-32 h-32 bg-green-100 rounded-full flex items-center justify-center">
                    <MessageSquare size={48} className="text-green-500" />
                </div>
            </div>

            {/* Title */}
            <h2 className="text-2xl font-bold text-gray-800 text-center">
                Verify code
            </h2>

            {/* Description */}
            <p className="text-base text-gray-600 text-center">
                Enter four-digits verification code sent to {formData.phone}
            </p>

            {/* OTP Input Boxes */}
            <div className="flex justify-center space-x-3">
                {otp.map((digit, index) => (
                    <input
                        key={index}
                        ref={(el) => (inputRefs.current[index] = el)}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value.replace(/\D/g, ''))}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        className="w-16 h-16 text-center text-xl font-semibold border-2 border-green-300 rounded-2xl focus:outline-none focus:border-green-500 bg-white"
                    />
                ))}
            </div>
            
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-2">
                    <p className="text-red-600 text-sm text-center">{error}</p>
                </div>
            )}
            
            <button
                onClick={handleVerify}
                disabled={loading || otp.some(digit => !digit)}
                className="w-full bg-green-500 text-white py-4 rounded-full text-base font-semibold shadow-lg transition-all active:scale-95 hover:shadow-xl disabled:bg-green-500/70"
            >
                {loading ? 'Verifying...' : 'Verify'}
            </button>

            {/* Resend Section */}
            <div className="text-center space-y-2">
                <p className="text-gray-600">
                    Haven't received the verification code?
                </p>
                <button
                    onClick={handleResend}
                    disabled={!canResend || loading}
                    className="text-green-500 font-semibold hover:underline disabled:text-gray-400 disabled:cursor-not-allowed"
                >
                    {canResend ? 'Resend' : 'Resend'}
                </button>
                {!canResend && (
                    <p className="text-gray-500 text-sm">{timer}s</p>
                )}
            </div>
        </div>
    );
};

export default RegistrationScreen;