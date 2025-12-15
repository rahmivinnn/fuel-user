import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';

const SplashScreen = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Navigate to WelcomeScreen after 2 seconds
    const timer = setTimeout(() => {
      navigate('/welcome');
    }, 2000);

    // Cleanup timer on unmount
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-primary relative overflow-hidden">
      {/* Green background */}
      <div className="absolute inset-0 bg-primary"></div>
      
      {/* Logo centered */}
      <div className="relative z-10 flex flex-col items-center">
        <Logo />
      </div>
      
      {/* Ensure logo is always visible according to user preference */}
      <style jsx>{`
        @keyframes fadeIn {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        .logo-container {
          animation: fadeIn 0.5s ease-in-out forwards;
        }
      `}</style>
    </div>
  );
};

export default SplashScreen;