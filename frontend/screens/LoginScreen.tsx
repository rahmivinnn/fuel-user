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
    <div className="min-h-screen bg-white flex flex-col items-center justify-center relative overflow-hidden">
      {/* Top Rectangle */}
      <img 
        src="/Rectangle 3364.svg" 
        alt="" 
        className="absolute top-0 left-0 w-full h-auto object-cover"
      />
      
      {/* Bottom Rectangle */}
      <img 
        src="/Rectangle 3365.png" 
        alt="" 
        className="absolute bottom-0 right-0 w-full h-auto object-cover"
      />
      
      {/* Hexagon */}
      <img 
        src="/hexagon.png" 
        alt="" 
        className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-80 h-56 z-20"
      />
      {/* Content */}
      <div className="w-full max-w-md mx-auto px-4 py-6 relative z-10 -mt-16">
        <div className="w-full space-y-6">
          <div className="flex flex-col items-center text-center space-y-2">
            <img 
              src="/logo-green.png" 
              alt="Logo" 
              className="w-64 h-64 object-contain"
            />
          </div>

          <div className="space-y-4">
            <button 
              onClick={() => navigate('/login-form')}
              className="w-full py-4 bg-[#3AC36C] hover:bg-[#2ea85a] text-white rounded-full font-semibold text-base shadow-lg transition-all duration-300 active:scale-95"
            >
              Log In
            </button>

            <button 
              onClick={() => navigate('/register')}
              className="w-full py-4 bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-50 rounded-full font-semibold text-base shadow-md transition-all duration-300 active:scale-95"
            >
              Sign up
            </button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500 font-medium">Or</span>
              </div>
            </div>

            <button 
              onClick={handleGoogleSignIn}
              disabled={isGoogleLoading}
              className="w-full py-4 bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-50 rounded-full font-semibold text-base flex items-center justify-center gap-3 shadow-md transition-all duration-300 disabled:opacity-50 active:scale-95"
            >
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              {isGoogleLoading ? "Connecting..." : "Continue with Google"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;