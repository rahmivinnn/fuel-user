import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { useAppContext } from '../App';

const LoginFormScreen = () => {
  const navigate = useNavigate();
  const { login, loginWithGoogle } = useAppContext();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    document.body.classList.add('login-screen');
    return () => {
      document.body.classList.remove('login-screen');
    };
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
      navigate('/home');
    } catch (err: any) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      await loginWithGoogle();
      navigate('/home');
    } catch (e: any) {
      setError(e?.message || 'Google login failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative w-full max-w-[402px] mx-auto min-h-screen bg-white">
      {/* Main Content */}
      <div className="px-4 pt-6 pb-8">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <img src="/logo-green.png" alt="FuelFriendly" className="w-[150px] h-[90px]" />
        </div>

        {/* Title */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-[#3F4249]">Sign In</h1>
        </div>

        {error && (
          <div className="w-full bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
            <p className="text-red-600 text-sm text-center">{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          {/* Customer Label */}
          <div className="w-full h-10 rounded-[30px] border border-black/50 px-4 flex items-center justify-center text-[#3F4249] bg-white text-sm">
            Customer
          </div>

          <input
            type="text"
            placeholder="Email or phone number"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full h-10 rounded-[30px] border border-black/50 px-4 focus:outline-none focus:border-[#3AC36C] placeholder-gray-400 text-sm"
            required
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-10 rounded-[30px] border border-black/50 px-4 pr-10 focus:outline-none focus:border-[#3AC36C] placeholder-gray-400 text-sm"
              required
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#606268]"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          <div className="text-right">
            <button 
              type="button"
              onClick={() => navigate('/forgot-password')}
              className="text-[#FF6B6B] text-sm hover:underline"
            >
              Forgotten Password
            </button>
          </div>

          <button
            type="submit"
            className="w-full h-10 rounded-[30px] bg-[#3AC36C] hover:bg-[#3AC36C]/90 text-white font-semibold mt-6 transition-colors disabled:opacity-50 text-sm"
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Log In"}
          </button>

          <div className="text-center py-4">
            <span className="text-black/50 underline text-sm">Or</span>
          </div>

          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full h-10 rounded-[30px] border border-[#3AC36C] bg-white hover:bg-gray-50 text-[#3F4249] flex items-center justify-center gap-3 transition-colors disabled:opacity-50 text-sm"
          >
            <img src="https://www.google.com/favicon.ico" alt="Google icon" className="w-4 h-4" />
            {isLoading ? "Connecting..." : "Continue with Google"}
          </button>
        </form>
      </div>

      {/* Home Indicator */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-[#101010] rounded-full mb-2"></div>
    </div>
  );
};

export default LoginFormScreen;