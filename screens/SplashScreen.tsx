import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SplashScreen = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Navigate to login after 2 seconds
    const timer = setTimeout(() => {
      navigate('/login');
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-green-500 relative overflow-hidden">
      {/* Top Hexagons */}
      <div className="absolute -top-10 left-0 w-full flex justify-center">
        <img 
          src="/hexagon.png" 
          alt="" 
          className="w-80 h-auto opacity-40"
          style={{ transform: 'scaleY(-1)' }}
        />
      </div>
      
      {/* Center Logo */}
      <div className="relative z-20 flex flex-col items-center">
        <img 
          src="/logo.png" 
          alt="FuelFriendly Logo" 
          className="w-32 h-32 relative z-30"
          style={{ filter: 'drop-shadow(0 0 10px rgba(0,0,0,0.5))', transform: 'rotate(360deg)' }}
        />
      </div>
      
      {/* Bottom Hexagons */}
      <div className="absolute -bottom-10 left-0 w-full flex justify-center">
        <img 
          src="/hexagon.png" 
          alt="" 
          className="w-80 h-auto opacity-40"
        />
      </div>
    </div>
  );
};

export default SplashScreen;