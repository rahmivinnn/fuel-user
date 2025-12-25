import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SplashScreen = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Navigate to login after 3 seconds
    const timer = setTimeout(() => {
      navigate('/login');
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#3AC36C] relative overflow-hidden">
      {/* Top Hexagon */}
      <img 
        src="/hexagon.png" 
        alt="" 
        className="absolute top-0 left-1/2 transform -translate-x-1/2 w-80 h-56 z-20"
        style={{ filter: 'brightness(0) invert(1)', transform: 'translateX(-50%) scaleY(-1)' }}
      />
      
      {/* Hexagon */}
      <img 
        src="/hexagon.png" 
        alt="" 
        className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-80 h-56 z-20"
        style={{ filter: 'brightness(0) invert(1)' }}
      />
      
      {/* Center Logo */}
      <div className="relative z-30 flex flex-col items-center">
        <img 
          src="/logo-white.png" 
          alt="FuelFriendly Logo" 
          className="w-48 h-32"
        />
      </div>
    </div>
  );
};

export default SplashScreen;