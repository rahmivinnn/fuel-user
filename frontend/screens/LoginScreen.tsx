import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../App';

const LoginScreen = () => {
  const navigate = useNavigate();
  const { loginWithGoogle } = useAppContext();
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  useEffect(() => {
    document.body.classList.add('login-screen');
    return () => {
      document.body.classList.remove('login-screen');
    };
  }, []);

  const handleGoogleSignIn = async () => {
    try {
      setIsGoogleLoading(true);
      await loginWithGoogle();
      navigate('/home');
    } catch (e: any) {
      console.error('Google login error:', e);
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center relative">
      {/* Content */}
      <div className="w-full max-w-md mx-auto px-4 py-6 relative z-10">
        <div className="w-full space-y-6">
          <div className="flex flex-col items-center text-center space-y-2">
            <img 
              src="/logo-green.png" 
              alt="Logo" 
              className="mobile-logo-size object-contain"
            />
          </div>

          <div className="space-y-4">
            <button 
              onClick={() => navigate('/login-form')}
              className="w-full mobile-form-button bg-green-500 hover:bg-green-600 text-white rounded-lg font-normal transition-all duration-300"
            >
              Log In
            </button>

            <button 
              onClick={() => navigate('/register')}
              className="w-full mobile-form-button bg-white border border-gray-300 text-gray-900 hover:bg-gray-50 rounded-lg font-normal transition-all duration-300"
            >
              Sign up
            </button>

            <div className="relative my-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">Or</span>
              </div>
            </div>

            <button 
              onClick={handleGoogleSignIn}
              disabled={isGoogleLoading}
              className="w-full mobile-form-button bg-white border border-gray-300 text-gray-900 hover:bg-gray-50 rounded-lg font-normal flex items-center justify-center gap-2 transition-all duration-300 disabled:opacity-50"
            >
              <img src="https://www.google.com/favicon.ico" alt="Google icon" className="w-5 h-5" />
              {isGoogleLoading ? "Connecting..." : "Continue with Google"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;