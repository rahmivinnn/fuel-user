import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, Eye, EyeOff, Mail, MessageSquare } from 'lucide-react';
import { useAppContext } from '../App';
import { apiRegister, apiLogin } from '../services/api';
import Logo from '../components/Logo';
import AnimatedPage from '../components/AnimatedPage';

const Stepper = ({ currentStep }: { currentStep: number }) => {
    const steps = [1, 2, 3];
    return (
        <div className="flex items-center justify-center w-full my-2">
            {steps.map((_, index) => (
                <React.Fragment key={index}>
                    <div className={`w-2 h-2 rounded-full ${index < currentStep ? 'bg-primary' : 'bg-gray-300'}`}></div>
                    {index < steps.length - 1 && (
                        <div className={`flex-1 h-0.5 mx-1 ${index < currentStep - 1 ? 'bg-primary' : 'bg-gray-300'}`}></div>
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
        try {
            // Register the user with the API
            await apiRegister(formData);
            
            // Login the user after registration
            const userData = await apiLogin(formData.email, formData.password);
            updateUser(userData);
            
            // Move to verification step after registration
            setStep(4);
        } catch (error) {
            console.error("Registration failed:", error);
            alert("Registration failed. Please try again.");
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
                return <Step3 createAccount={createAccount} editDetails={() => setStep(1)} formData={formData} loading={loading} />;
            case 4:
                return <VerificationStep 
                    formData={formData} 
                    onSelectMethod={setVerificationMethod} 
                    selectedMethod={verificationMethod}
                    onNext={() => setStep(5)}
                />;
            case 5:
                return <VerificationProcess 
                    method={verificationMethod} 
                    formData={formData} 
                    onComplete={() => navigate('/home')}
                />;
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
                
                <div className="flex flex-col items-center -mt-10 mb-0">
                    <div className="w-20 h-20 mb-2">
                        <Logo />
                    </div>
                </div>

                <div className="text-center mb-3">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Registration</h2>
                </div>

                {step < 4 && <Stepper currentStep={step} />}

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
        <form onSubmit={handleFormSubmit} className="space-y-3">
            <div>
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Full Name</label>
                <input 
                    name="fullName" 
                    type="text" 
                    value={formData.fullName} 
                    onChange={handleChange} 
                    className="w-full px-3 py-2 rounded-full border border-gray-300 dark:border-gray-600 bg-transparent focus:outline-none focus:ring-1 focus:ring-primary text-sm mobile-text-sm" 
                    required 
                />
            </div>
            
            <div>
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Email</label>
                <input 
                    name="email" 
                    type="email" 
                    value={formData.email} 
                    onChange={handleChange} 
                    className="w-full px-3 py-2 rounded-full border border-gray-300 dark:border-gray-600 bg-transparent focus:outline-none focus:ring-1 focus:ring-primary text-sm mobile-text-sm" 
                    required 
                />
            </div>
            
            <div>
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Phone</label>
                <input 
                    name="phone" 
                    type="tel" 
                    value={formData.phone} 
                    onChange={handleChange} 
                    className="w-full px-3 py-2 rounded-full border border-gray-300 dark:border-gray-600 bg-transparent focus:outline-none focus:ring-1 focus:ring-primary text-sm mobile-text-sm" 
                    required 
                />
            </div>
            
            <div>
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Password</label>
                <div className="relative">
                    <input 
                        name="password" 
                        type={showPassword ? "text" : "password"} 
                        value={formData.password} 
                        onChange={handleChange} 
                        className="w-full px-3 py-2 rounded-full border border-gray-300 dark:border-gray-600 bg-transparent focus:outline-none focus:ring-1 focus:ring-primary text-sm mobile-text-sm" 
                        required 
                    />
                    <button 
                        type="button" 
                        onClick={() => setShowPassword(!showPassword)} 
                        className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-400"
                    >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                </div>
            </div>
            
            <div>
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Confirm Password</label>
                <div className="relative">
                    <input 
                        type="password" 
                        value={confirmPassword} 
                        onChange={(e) => setConfirmPassword(e.target.value)} 
                        className="w-full px-3 py-2 rounded-full border border-gray-300 dark:border-gray-600 bg-transparent focus:outline-none focus:ring-1 focus:ring-primary text-sm mobile-text-sm" 
                        required 
                    />
                </div>
            </div>
            
            <button 
                type="submit" 
                className="w-full bg-primary text-white py-2.5 rounded-full text-base font-semibold shadow-lg transition-all active:scale-95 hover:shadow-xl flex items-center justify-center disabled:bg-primary/70 mobile-btn-md ripple"
            >
                Next
            </button>
        </form>
    );
};

const Step2 = ({ next, back, formData, handleChange }: StepProps) => (
    <form onSubmit={(e) => { e.preventDefault(); next(); }} className="space-y-3">
        <div>
            <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Vehicle Brand</label>
            <input 
                name="vehicleBrand" 
                type="text" 
                value={formData.vehicleBrand} 
                onChange={handleChange} 
                className="w-full px-3 py-2 rounded-full border border-gray-300 dark:border-gray-600 bg-transparent focus:outline-none focus:ring-1 focus:ring-primary text-sm mobile-text-sm" 
                required 
            />
        </div>
        
        <div>
            <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Vehicle Color</label>
            <input 
                name="vehicleColor" 
                type="text" 
                value={formData.vehicleColor} 
                onChange={handleChange} 
                className="w-full px-3 py-2 rounded-full border border-gray-300 dark:border-gray-600 bg-transparent focus:outline-none focus:ring-1 focus:ring-primary text-sm mobile-text-sm" 
                required 
            />
        </div>
        
        <div>
            <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">License Number</label>
            <input 
                name="licenseNumber" 
                type="text" 
                value={formData.licenseNumber} 
                onChange={handleChange} 
                className="w-full px-3 py-2 rounded-full border border-gray-300 dark:border-gray-600 bg-transparent focus:outline-none focus:ring-1 focus:ring-primary text-sm mobile-text-sm" 
                required 
            />
        </div>
        
        <div>
            <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Fuel Type</label>
            <select 
                name="fuelType" 
                value={formData.fuelType} 
                onChange={handleChange} 
                className="w-full px-3 py-2 rounded-full border border-gray-300 dark:border-gray-600 bg-transparent focus:outline-none focus:ring-1 focus:ring-primary text-sm mobile-text-sm"
            >
                <option value="Petrol">Petrol</option>
                <option value="Diesel">Diesel</option>
                <option value="Electric">Electric</option>
                <option value="Hybrid">Hybrid</option>
            </select>
        </div>
        
        <div className="flex space-x-2">
            <button 
                type="button" 
                onClick={back} 
                className="flex-1 bg-gray-100 dark:bg-dark-card text-gray-700 dark:text-gray-300 py-2.5 rounded-full text-base font-semibold shadow transition-all active:scale-95 hover:shadow-md mobile-btn-md ripple"
            >
                Back
            </button>
            <button 
                type="submit" 
                className="flex-1 bg-primary text-white py-2.5 rounded-full text-base font-semibold shadow-lg transition-all active:scale-95 hover:shadow-xl flex items-center justify-center disabled:bg-primary/70 mobile-btn-md ripple"
            >
                Next
            </button>
        </div>
    </form>
);

const Step3 = ({ createAccount, editDetails, formData, loading }: { createAccount: () => void; editDetails: () => void; formData: any; loading: boolean }) => (
    <div className="space-y-4">
        <div className="bg-light-card dark:bg-dark-card rounded-2xl p-4">
            <h3 className="font-bold mb-2">Account Details</h3>
            <div className="space-y-1 text-sm">
                <p><span className="text-gray-500">Name:</span> {formData.fullName}</p>
                <p><span className="text-gray-500">Email:</span> {formData.email}</p>
                <p><span className="text-gray-500">Phone:</span> {formData.phone}</p>
            </div>
        </div>
        
        <div className="bg-light-card dark:bg-dark-card rounded-2xl p-4">
            <h3 className="font-bold mb-2">Vehicle Details</h3>
            <div className="space-y-1 text-sm">
                <p><span className="text-gray-500">Brand:</span> {formData.vehicleBrand}</p>
                <p><span className="text-gray-500">Color:</span> {formData.vehicleColor}</p>
                <p><span className="text-gray-500">License:</span> {formData.licenseNumber}</p>
                <p><span className="text-gray-500">Fuel Type:</span> {formData.fuelType}</p>
            </div>
        </div>
        
        <div className="flex space-x-2">
            <button 
                onClick={editDetails} 
                className="flex-1 bg-gray-100 dark:bg-dark-card text-gray-700 dark:text-gray-300 py-2.5 rounded-full text-base font-semibold shadow transition-all active:scale-95 hover:shadow-md mobile-btn-md ripple"
            >
                Edit
            </button>
            <button 
                onClick={createAccount} 
                disabled={loading}
                className="flex-1 bg-primary text-white py-2.5 rounded-full text-base font-semibold shadow-lg transition-all active:scale-95 hover:shadow-xl flex items-center justify-center disabled:bg-primary/70 mobile-btn-md ripple"
            >
                {loading ? 'Creating Account...' : 'Create Account'}
            </button>
        </div>
    </div>
);

const VerificationStep = ({ formData, onSelectMethod, selectedMethod, onNext }: { 
    formData: any; 
    onSelectMethod: (method: 'sms' | 'email') => void; 
    selectedMethod: 'sms' | 'email' | null;
    onNext: () => void;
}) => (
    <div className="space-y-4">
        <p className="text-center text-sm text-gray-600 dark:text-gray-400">
            How would you like to verify your account?
        </p>
        
        <div className="space-y-3">
            <button
                onClick={() => onSelectMethod('sms')}
                className={`w-full flex items-center p-4 rounded-2xl border transition-all ${
                    selectedMethod === 'sms' 
                        ? 'border-primary bg-primary/10' 
                        : 'border-gray-300 dark:border-gray-600 bg-light-card dark:bg-dark-card'
                }`}
            >
                <div className={`w-6 h-6 rounded-full border mr-3 flex items-center justify-center ${
                    selectedMethod === 'sms' ? 'border-primary bg-primary' : 'border-gray-300 dark:border-gray-600'
                }`}>
                    {selectedMethod === 'sms' && <Check size={16} className="text-white" />}
                </div>
                <div className="text-left">
                    <p className="font-semibold">SMS</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Send code to {formData.phone}</p>
                </div>
            </button>
            
            <button
                onClick={() => onSelectMethod('email')}
                className={`w-full flex items-center p-4 rounded-2xl border transition-all ${
                    selectedMethod === 'email' 
                        ? 'border-primary bg-primary/10' 
                        : 'border-gray-300 dark:border-gray-600 bg-light-card dark:bg-dark-card'
                }`}
            >
                <div className={`w-6 h-6 rounded-full border mr-3 flex items-center justify-center ${
                    selectedMethod === 'email' ? 'border-primary bg-primary' : 'border-gray-300 dark:border-gray-600'
                }`}>
                    {selectedMethod === 'email' && <Check size={16} className="text-white" />}
                </div>
                <div className="text-left">
                    <p className="font-semibold">Email</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Send code to {formData.email}</p>
                </div>
            </button>
        </div>
        
        <button
            onClick={onNext}
            disabled={!selectedMethod}
            className="w-full bg-primary text-white py-2.5 rounded-full text-base font-semibold shadow-lg transition-all active:scale-95 hover:shadow-xl disabled:bg-primary/70 mobile-btn-md ripple"
        >
            Continue
        </button>
    </div>
);

const VerificationProcess = ({ method, formData, onComplete }: { 
    method: 'sms' | 'email' | null; 
    formData: any;
    onComplete: () => void;
}) => {
    const [otp, setOtp] = useState('');
    const [timer, setTimer] = useState(60);
    const [canResend, setCanResend] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

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

    const handleVerify = async () => {
        setLoading(true);
        setError('');
        setSuccess('');
        
        try {
            // Simulate verification success
            setSuccess('Account verified successfully!');
            setTimeout(onComplete, 1500);
        } catch (err) {
            setError('Invalid verification code');
        } finally {
            setLoading(false);
        }
    };

    const handleResend = () => {
        setTimer(60);
        setCanResend(false);
        setSuccess('Verification code resent!');
    };

    return (
        <div className="space-y-4">
            <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                Enter the 6-digit code sent to your {method === 'sms' ? 'phone' : 'email'}
            </p>
            
            <div className="relative">
                <MessageSquare className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                    type="text"
                    placeholder="Enter 6-digit code"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    className="w-full pl-10 pr-3 py-2 rounded-full border border-gray-300 dark:border-gray-600 bg-transparent focus:outline-none focus:ring-2 focus:ring-primary text-sm mobile-text-sm text-center tracking-widest text-lg font-semibold"
                    maxLength={6}
                    required
                />
            </div>
            
            {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-2">
                    <p className="text-red-600 dark:text-red-400 text-sm text-center">{error}</p>
                </div>
            )}
            
            {success && (
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-2">
                    <p className="text-green-600 dark:text-green-400 text-sm text-center">{success}</p>
                </div>
            )}
            
            <button
                onClick={handleVerify}
                disabled={loading || otp.length !== 6}
                className="w-full bg-primary text-white py-2.5 rounded-full text-base font-semibold shadow-lg transition-all active:scale-95 hover:shadow-xl disabled:bg-primary/70 mobile-btn-md ripple"
            >
                {loading ? 'Verifying...' : 'Verify'}
            </button>
            
            <div className="flex justify-between items-center">
                <button
                    onClick={handleResend}
                    disabled={!canResend}
                    className="text-primary text-sm font-semibold hover:underline disabled:text-gray-400 disabled:cursor-not-allowed"
                >
                    {canResend ? 'Resend Code' : `Resend in ${timer}s`}
                </button>
            </div>
        </div>
    );
};

export default RegistrationScreen;