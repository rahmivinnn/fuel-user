import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, MessageSquare } from 'lucide-react';
import Logo from '../components/Logo';
import MobileOTPForm from '../components/MobileOTPForm';
import { useAppContext } from '../App';
import AnimatedPage from '../components/AnimatedPage';
import { verificationService } from '../services/verificationService';

type AuthMethod = 'email-password' | 'email-otp' | 'whatsapp-otp';

const LoginScreen = () => {
  const navigate = useNavigate();
  const { login, loginWithGoogle, updateUser } = useAppContext();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Auth method selection
  const [authMethod, setAuthMethod] = useState<AuthMethod>('email-password');
  const [showMobileOTP, setShowMobileOTP] = useState(false);

  // OTP States
  const [emailForOtp, setEmailForOtp] = useState('');
  const [phoneForOtp, setPhoneForOtp] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [canResend, setCanResend] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  // Start resend timer
  const startResendTimer = () => {
    setCanResend(false);
    setResendTimer(60);
    const interval = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Handle mobile OTP success
  const handleMobileOTPSuccess = (userData: any) => {
    setSuccess('OTP verified successfully!');
    updateUser(userData);
    
    setTimeout(() => {
      navigate('/home');
    }, 1500);
  };

  // Handle mobile OTP error
  const handleMobileOTPError = (message: string) => {
    if (message.includes('successfully')) {
      setSuccess(message);
      setError('');
    } else {
      setError(message);
      setSuccess('');
    }
  };

  const handleSendResendEmailOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      const result = await verificationService.sendVerificationCode(
        emailForOtp,
        '', // No phone for email OTP
        emailForOtp.split('@')[0]
      );

      if (result.success) {
        setOtpSent(true);
        setSuccess(result.message);
        startResendTimer();
      } else {
        setError(result.message);
      }
    } catch (err: any) {
      console.error('Resend Email OTP error:', err);
      setError(err.message || 'Failed to send Email OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      const result = verificationService.verifyCode(emailForOtp, otpCode);

      if (result.success) {
        setSuccess('OTP verified successfully!');

        // Create user data for OTP login
        const userData = {
          id: `user-${Date.now()}`,
          fullName: emailForOtp.split('@')[0],
          email: emailForOtp,
          phone: '',
          city: '',
          avatarUrl: `https://ui-avatars.com/api/?name=${emailForOtp.split('@')[0]}&background=random`,
          vehicles: []
        };

        updateUser(userData);

        setTimeout(() => {
          navigate('/home');
        }, 1500);
      } else {
        setError(result.message);
      }
    } catch (err: any) {
      console.error('Verify OTP error:', err);
      setError(err.message || 'Failed to verify OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      const result = await verificationService.sendVerificationCode(
        emailForOtp,
        '', // No phone for email OTP
        emailForOtp.split('@')[0]
      );

      if (result.success) {
        setSuccess(result.message);
      } else {
        setError(result.message);
      }

      startResendTimer();
    } catch (err: any) {
      console.error('Resend OTP error:', err);
      setError(err.message || 'Failed to resend OTP');
    } finally {
      setIsLoading(false);
    }
  };

  // Regular Email/Password Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      await login(email, password);
      // Navigate to home screen after successful login
      navigate('/home');
    } catch (err: any) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  // Reset OTP state when changing method
  const resetOTPState = () => {
    setOtpSent(false);
    setOtpCode('');
    setEmailForOtp('');
    setPhoneForOtp('');
    setError('');
    setSuccess('');
    setCanResend(false);
    setResendTimer(0);
  };

  const handleSendWhatsAppOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      const API_BASE_URL = 'https://apidecor.kelolahrd.life';
      const response = await fetch(`${API_BASE_URL}/api/otp/whatsapp/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ phoneNumber: phoneForOtp })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setOtpSent(true);
        setSuccess('OTP sent via WhatsApp!');
        startResendTimer();
      } else {
        setError(data.error || 'Failed to send WhatsApp OTP');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to send WhatsApp OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyWhatsAppOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      const API_BASE_URL = 'https://apidecor.kelolahrd.life';
      const response = await fetch(`${API_BASE_URL}/api/otp/whatsapp/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          phoneNumber: phoneForOtp, 
          otp: otpCode 
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setSuccess('OTP verified successfully!');
        const userData = {
          id: `user-${Date.now()}`,
          fullName: phoneForOtp,
          email: '',
          phone: phoneForOtp,
          city: '',
          avatarUrl: `https://ui-avatars.com/api/?name=${phoneForOtp}&background=random`,
          vehicles: []
        };
        updateUser(userData);
        setTimeout(() => navigate('/home'), 1500);
      } else {
        setError(data.error || 'Invalid OTP code');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to verify OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const renderWhatsAppOTPForm = () => (
    <form onSubmit={otpSent ? handleVerifyWhatsAppOTP : handleSendWhatsAppOTP} className="w-full max-w-sm space-y-3">
      {otpSent ? (
        <>
          <div className="text-center space-y-1">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Enter the 6-digit code sent to
            </p>
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              {phoneForOtp}
            </p>
          </div>
          <div className="relative">
            <MessageSquare className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Enter 6-digit OTP"
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              className="w-full pl-10 pr-3 py-2 rounded-full border border-gray-300 dark:border-gray-600 bg-transparent focus:outline-none focus:ring-2 focus:ring-primary text-sm mobile-text-sm text-center tracking-widest text-lg font-semibold"
              maxLength={6}
              required
            />
          </div>
          <button
            type="submit"
            disabled={isLoading || otpCode.length !== 6}
            className="w-full bg-primary text-white py-2.5 rounded-full text-base font-semibold shadow-lg transition-all active:scale-95 hover:shadow-xl flex items-center justify-center disabled:bg-primary/70 mobile-btn-md ripple"
          >
            {isLoading ? 'Verifying...' : 'Verify OTP'}
          </button>
          <div className="flex justify-between items-center">
            <button
              type="button"
              onClick={resetOTPState}
              className="text-primary text-sm font-semibold hover:underline"
            >
              Change Phone
            </button>
            <button
              type="button"
              onClick={handleSendWhatsAppOTP}
              disabled={!canResend || isLoading}
              className="text-primary text-sm font-semibold hover:underline disabled:text-gray-400 disabled:cursor-not-allowed"
            >
              {canResend ? 'Resend OTP' : `Resend in ${resendTimer}s`}
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Enter your phone number for WhatsApp OTP
            </p>
          </div>
          <div className="relative">
            <MessageSquare className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="tel"
              placeholder="628123456789"
              value={phoneForOtp}
              onChange={(e) => setPhoneForOtp(e.target.value.replace(/\D/g, ''))}
              className="w-full pl-10 pr-3 py-2 rounded-full border border-gray-300 dark:border-gray-600 bg-transparent focus:outline-none focus:ring-2 focus:ring-primary text-sm mobile-text-sm"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-green-600 text-white py-2.5 rounded-full text-base font-semibold shadow-lg transition-all active:scale-95 hover:shadow-xl flex items-center justify-center disabled:bg-green-600/70 mobile-btn-md ripple"
          >
            {isLoading ? 'Sending...' : 'Send WhatsApp OTP'}
          </button>
        </>
      )}
    </form>
  );

  const renderAuthMethodSelector = () => (
    <div className="w-full max-w-sm space-y-2">
      <p className="text-sm text-gray-600 dark:text-gray-400 text-center">Choose login method:</p>
      <div className="grid grid-cols-3 gap-1">
        <button
          type="button"
          onClick={() => {
            setAuthMethod('email-password');
            resetOTPState();
            setShowMobileOTP(false);
          }}
          className={`py-2 px-2 rounded-full text-xs font-medium transition-all ${authMethod === 'email-password'
              ? 'bg-primary text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
            }`}
        >
          Email/Pass
        </button>
        <button
          type="button"
          onClick={() => {
            setAuthMethod('email-otp');
            resetOTPState();
            setShowMobileOTP(true);
          }}
          className={`py-2 px-2 rounded-full text-xs font-medium transition-all ${authMethod === 'email-otp'
              ? 'bg-primary text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
            }`}
        >
          Email OTP
        </button>
        <button
          type="button"
          onClick={() => {
            setAuthMethod('whatsapp-otp');
            resetOTPState();
            setShowMobileOTP(false);
          }}
          className={`py-2 px-2 rounded-full text-xs font-medium transition-all ${authMethod === 'whatsapp-otp'
              ? 'bg-primary text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
            }`}
        >
          WhatsApp
        </button>
      </div>
    </div>
  );

  const renderEmailPasswordForm = () => (
    <form onSubmit={handleLogin} className="w-full max-w-sm space-y-3">
      <div className="w-full px-3 py-2 rounded-full border border-gray-300 dark:border-gray-600 bg-transparent text-center text-sm mobile-text-base">
        Customer
      </div>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full px-3 py-2 rounded-full border border-gray-300 dark:border-gray-600 bg-transparent focus:outline-none focus:ring-2 focus:ring-primary text-sm mobile-text-sm"
        required
      />
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-3 py-2 rounded-full border border-gray-300 dark:border-gray-600 bg-transparent focus:outline-none focus:ring-2 focus:ring-primary text-sm mobile-text-sm"
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
      <div className="text-right">
        <a href="#" className="text-sm text-red-500 hover:underline mobile-text-sm">Forgotten Password</a>
      </div>
      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-primary text-white py-2.5 rounded-full text-base font-semibold shadow-lg transition-all active:scale-95 hover:shadow-xl flex items-center justify-center disabled:bg-primary/70 mobile-btn-md ripple"
      >
        {isLoading ? 'Logging in...' : 'Log In'}
      </button>
    </form>
  );

  const renderResendEmailOTPForm = () => (
    <form onSubmit={otpSent ? handleVerifyOTP : handleSendResendEmailOTP} className="w-full max-w-sm space-y-3">
      {otpSent ? (
        <>
          <div className="text-center space-y-1">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Enter the 6-digit code sent to
            </p>
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              {emailForOtp}
            </p>
          </div>
          <div className="relative">
            <MessageSquare className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Enter 6-digit OTP"
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              className="w-full pl-10 pr-3 py-2 rounded-full border border-gray-300 dark:border-gray-600 bg-transparent focus:outline-none focus:ring-2 focus:ring-primary text-sm mobile-text-sm text-center tracking-widest text-lg font-semibold"
              maxLength={6}
              required
            />
          </div>
          <button
            type="submit"
            disabled={isLoading || otpCode.length !== 6}
            className="w-full bg-primary text-white py-2.5 rounded-full text-base font-semibold shadow-lg transition-all active:scale-95 hover:shadow-xl flex items-center justify-center disabled:bg-primary/70 mobile-btn-md ripple"
          >
            {isLoading ? 'Verifying...' : 'Verify OTP'}
          </button>
          <div className="flex justify-between items-center">
            <button
              type="button"
              onClick={resetOTPState}
              className="text-primary text-sm font-semibold hover:underline"
            >
              Change Email
            </button>
            <button
              type="button"
              onClick={handleResendOTP}
              disabled={!canResend || isLoading}
              className="text-primary text-sm font-semibold hover:underline disabled:text-gray-400 disabled:cursor-not-allowed"
            >
              {canResend ? 'Resend OTP' : `Resend in ${resendTimer}s`}
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Enter your email to receive OTP via Resend
            </p>
          </div>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="email"
              placeholder="your.email@example.com"
              value={emailForOtp}
              onChange={(e) => setEmailForOtp(e.target.value)}
              className="w-full pl-10 pr-3 py-2 rounded-full border border-gray-300 dark:border-gray-600 bg-transparent focus:outline-none focus:ring-2 focus:ring-primary text-sm mobile-text-sm"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary text-white py-2.5 rounded-full text-base font-semibold shadow-lg transition-all active:scale-95 hover:shadow-xl flex items-center justify-center disabled:bg-primary/70 mobile-btn-md ripple"
          >
            {isLoading ? 'Sending...' : 'Send OTP via Email'}
          </button>
        </>
      )}
    </form>
  );

  return (
    <AnimatedPage>
      <div className="w-full bg-white relative overflow-hidden fixed inset-0" style={{ height: '100dvh', maxHeight: '100dvh', touchAction: 'none' }}>
        {/* Top Rectangle - curve points bottom right */}
        <img 
          src="/Rectangle 3365.png" 
          alt="" 
          className="absolute top-0 left-0 w-full h-auto z-0 pointer-events-none"
          style={{ maxHeight: '20vh', transform: 'rotate(180deg)' }}
        />
        
        {/* Bottom Rectangle - curve points top left */}
        <img 
          src="/Rectangle 3365.png" 
          alt="" 
          className="absolute bottom-0 left-0 w-full h-auto z-0 pointer-events-none"
          style={{ maxHeight: '35vh', transform: 'rotate(360deg)' }}
        />
        
        {/* Hexagon pattern at bottom */}
        <img 
          src="/hexagon.png" 
          alt="" 
          className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-48 sm:w-64 h-auto z-10 pointer-events-none opacity-60"
        />
        
        {/* Content optimized for all devices */}
        <div className="relative z-20 flex flex-col items-center justify-center w-full px-4 max-w-sm mx-auto h-full">
          {/* Logo and Brand */}
          <div className="flex flex-col items-center mb-4">
            <div className="w-60 h-48 rounded-full border-3 border-green-500 flex items-center justify-center mb-3">
              <img 
                src="/logo-green.png" 
                alt="FuelFriendly Logo" 
                className="w-52 h-40"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="w-full space-y-2 mb-3">
            <button
              type="button"
              onClick={() => navigate('/login-form')}
              className="w-full bg-green-500 text-white py-2 rounded-full text-xs font-semibold shadow-lg transition-all active:scale-95"
            >
              Log In
            </button>
            
            <button
              type="button"
              onClick={() => navigate('/register')}
              className="w-full bg-white border-2 border-green-500 text-green-500 py-2 rounded-full text-xs font-semibold transition-all active:scale-95"
            >
              Sign up
            </button>
          </div>

          <div className="w-full space-y-2 mb-3">
            <div className="flex items-center justify-center space-x-4">
              <hr className="flex-1 border-gray-300 dark:border-gray-600" />
              <span className="text-gray-500 dark:text-gray-400 text-xs">Or</span>
              <hr className="flex-1 border-gray-300 dark:border-gray-600" />
            </div>

            <button
              type="button"
              onClick={async () => {
                try {
                  setError('');
                  setSuccess('');
                  setIsLoading(true);
                  await loginWithGoogle();
                } catch (e: any) {
                  console.error('Google login error:', e);
                  setError(e?.message || 'Google login failed.');
                } finally {
                  setIsLoading(false);
                }
              }}
              disabled={isLoading}
              className="w-full flex items-center justify-center bg-white border-2 border-green-500 text-gray-700 dark:text-dark-text py-2 rounded-full text-xs font-medium transition-all active:scale-95 hover:shadow-md disabled:opacity-50"
            >
              {isLoading ? (
                'Connecting...'
              ) : (
                <>
                  <img src="https://www.google.com/favicon.ico" alt="Google icon" className="w-3 h-3 mr-2" />
                  Continue with Google
                </>
              )}
            </button>
          </div>

          <p className="text-center text-gray-500 dark:text-gray-400 text-xs">
            Don't have an account? <span onClick={() => navigate('/register')} className="text-green-500 font-semibold cursor-pointer">Sign up</span>
          </p>
        </div>
      </div>
    </AnimatedPage>
  );
};

export default LoginScreen;