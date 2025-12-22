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
      {/* Logo centered */}
      <div className="relative z-10 flex flex-col items-center animate-pulse">
        <div className="w-32 h-32 md:w-40 md:h-40 bg-white rounded-full flex items-center justify-center">
          <span className="text-green-500 text-4xl font-bold">FF</span>
        </div>
        <h1 className="text-white text-2xl font-bold mt-4">FuelFriendly</h1>
      </div>
    </div>
  );
};

export default SplashScreen;