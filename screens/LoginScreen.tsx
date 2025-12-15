import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, MessageSquare } from 'lucide-react';
import Logo from '../components/Logo';
import MobileOTPForm from '../components/MobileOTPForm';
import { useAppContext } from '../App';
import AnimatedPage from '../components/AnimatedPage';

type AuthMethod = 'email-password' | 'email-otp';

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

  // Send Email OTP (Resend)
  const handleSendResendEmailOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      const base = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';
      const response = await fetch(`${base}/api/otp/email/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailForOtp })
      });

      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        const text = await response.text();
        throw new Error(`Server error: ${text || 'Invalid response from server'}`);
      }

      // Check response status and data
      if (!response.ok) {
        const errorMsg = data?.error || data?.message || `HTTP error! status: ${response.status}`;
        console.error('Server returned error:', response.status, errorMsg);
        setError(errorMsg);
        return;
      }

      if (data.success) {
        setOtpSent(true);
        // Show the OTP code in development mode when simulating
        if (data.simulated && data.otp) {
          setSuccess(`OTP sent to your email! For testing purposes, the OTP code is: ${data.otp}`);
        } else {
          setSuccess('OTP sent to your email!');
        }
        startResendTimer();
      } else {
        const errorMsg = data?.error || 'Failed to send Email OTP';
        console.error('Email send failed:', errorMsg);
        
        // Provide a more helpful error message for domain verification issues
        if (errorMsg.includes('only send testing emails to your own email address') || 
            errorMsg.includes('domain is not verified')) {
          setError('For demo purposes, OTP can only be sent to the developer\'s email address. In a production environment, this limitation would be removed by verifying a domain with the email service provider.');
        } else {
          setError(errorMsg);
        }
      }
    } catch (err: any) {
      console.error('Resend Email OTP error:', err);
      setError(err.message || 'Failed to send Email OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Verify OTP
  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      let verified = false;
      let userData = null;

      // Use Resend API verification
      const base = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';
      const response = await fetch(`${base}/api/otp/email/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailForOtp, otp: otpCode })
      });

      // Check if response is OK before trying to parse JSON
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        throw new Error('Invalid response from server');
      }

      verified = data.success;
      userData = {
        id: `user-${Date.now()}`,
        fullName: emailForOtp.split('@')[0],
        email: emailForOtp,
        phone: '',
        city: '',
        avatarUrl: `https://ui-avatars.com/api/?name=${emailForOtp.split('@')[0]}&background=random`,
        vehicles: []
      };

      if (verified) {
        setSuccess('OTP verified successfully!');

        // Use returned user data or create mock user for OTP login
        const user = userData || {
          id: `user-${Date.now()}`,
          fullName: emailForOtp.split('@')[0],
          email: emailForOtp,
          phone: '',
          city: '',
          avatarUrl: `https://ui-avatars.com/api/?name=${emailForOtp}&background=random`,
          vehicles: []
        };

        updateUser(user);

        setTimeout(() => {
          navigate('/home');
        }, 1500);
      } else {
        setError('Invalid OTP code');
      }
    } catch (err: any) {
      console.error('Verify OTP error:', err);
      setError(err.message || 'Failed to verify OTP');
    } finally {
      setIsLoading(false);
    }
  };

  // Resend OTP
  const handleResendOTP = async () => {
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      // Resend via Resend API
      const base = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';
      const response = await fetch(`${base}/api/otp/email/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailForOtp })
      });

      // Check if response is OK before trying to parse JSON
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        throw new Error('Invalid response from server');
      }

      if (data.success) {
        // Show the OTP code in development mode when simulating
        if (data.simulated && data.otp) {
          setSuccess(`OTP resent to your email! For testing purposes, the OTP code is: ${data.otp}`);
        } else {
          setSuccess('OTP resent to your email!');
        }
      } else {
        // Provide a more helpful error message for domain verification issues
        if (data.error.includes('only send testing emails to your own email address') || 
            data.error.includes('domain is not verified')) {
          setError('For demo purposes, OTP can only be sent to the developer\'s email address. In a production environment, this limitation would be removed by verifying a domain with the email service provider.');
        } else {
          setError(data.error || 'Failed to resend Email OTP');
        }
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
    setError('');
    setSuccess('');
    setCanResend(false);
    setResendTimer(0);
  };

  const renderAuthMethodSelector = () => (
    <div className="w-full max-w-sm space-y-2">
      <p className="text-sm text-gray-600 dark:text-gray-400 text-center">Choose login method:</p>
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => {
            setAuthMethod('email-password');
            resetOTPState();
            setShowMobileOTP(false);
          }}
          className={`py-2 px-3 rounded-full text-xs font-medium transition-all ${authMethod === 'email-password'
              ? 'bg-primary text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
            }`}
        >
          Email/Password
        </button>
        <button
          type="button"
          onClick={() => {
            setAuthMethod('email-otp');
            resetOTPState();
            setShowMobileOTP(true);
          }}
          className={`py-2 px-3 rounded-full text-xs font-medium transition-all ${authMethod === 'email-otp'
              ? 'bg-primary text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
            }`}
        >
          Email OTP
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
      <div className="min-h-screen flex flex-col items-center justify-start p-4 pt-6 bg-white dark:bg-dark-bg text-light-text dark:text-dark-text space-y-4">
        <Logo />

        <h2 className="text-4xl md:text-5xl font-bold text-gray-700 dark:text-gray-200 text-center">Sign In</h2>

        {renderAuthMethodSelector()}

        {error && (
          <div className="w-full max-w-sm bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
            <p className="text-red-600 dark:text-red-400 text-sm text-center">{error}</p>
          </div>
        )}

        {success && (
          <div className="w-full max-w-sm bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
            <p className="text-green-600 dark:text-green-400 text-sm text-center">{success}</p>
          </div>
        )}

        {authMethod === 'email-password' && renderEmailPasswordForm()}
        {authMethod === 'email-otp' && showMobileOTP ? (
          <MobileOTPForm 
            onBack={() => {
              setShowMobileOTP(false);
              setAuthMethod('email-password');
            }}
            onSuccess={handleMobileOTPSuccess}
            onError={handleMobileOTPError}
          />
        ) : (
          authMethod === 'email-otp' && renderResendEmailOTPForm()
        )}

        <div className="w-full max-w-sm space-y-3">
          <div className="flex items-center justify-center space-x-2">
            <hr className="w-1/4 border-gray-300 dark:border-gray-600" />
            <span className="text-gray-500 dark:text-gray-400 text-sm mobile-text-sm">Or</span>
            <hr className="w-1/4 border-gray-300 dark:border-gray-600" />
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
            className="w-full flex items-center justify-center bg-transparent border-2 border-primary text-light-text dark:text-dark-text py-2.5 rounded-full text-base font-semibold transition-all active:scale-95 hover:shadow-md mobile-btn-md disabled:opacity-50 ripple"
          >
            {isLoading && authMethod === 'email-password' ? (
              'Connecting...'
            ) : (
              <>
                <img src="https://www.google.com/favicon.ico" alt="Google icon" className="w-4 h-4 mr-2" />
                Continue with Google
              </>
            )}
          </button>
        </div>

        <p className="text-center text-gray-500 dark:text-gray-400 text-sm mobile-text-sm">
          Don't have an account? <span onClick={() => navigate('/register')} className="text-primary font-semibold cursor-pointer mobile-text-sm">Sign up</span>
        </p>
      </div>
    </AnimatedPage>
  );
};

export default LoginScreen;