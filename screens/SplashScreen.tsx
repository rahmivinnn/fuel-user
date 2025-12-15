import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import whiteLogoPng from './logo putih.png';
import topElementPng from './atas (2).png';
import bottomElementPng from './bawah (2).png';

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
      {/* Top element */}
      <img 
        src={topElementPng} 
        alt="Top decoration" 
        className="absolute top-0 left-0 w-full h-24 md:h-32 object-cover z-20"
      />
      
      {/* Bottom element */}
      <img 
        src={bottomElementPng} 
        alt="Bottom decoration" 
        className="absolute bottom-0 left-0 w-full h-24 md:h-32 object-cover z-20"
      />
      
      {/* Logo centered and flipped horizontally */}
      <div className="relative z-10 flex flex-col items-center">
        <img 
          src={whiteLogoPng} 
          alt="FuelFriendly Logo" 
          className="w-32 h-32 md:w-40 md:h-40 object-contain scale-x-[-1]" 
        />
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