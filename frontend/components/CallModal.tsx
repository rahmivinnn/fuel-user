import React, { useState, useEffect } from 'react';
import { Phone, Mic, MicOff, MessageSquare, Volume2, UserPlus, MoreHorizontal } from 'lucide-react';

interface CallModalProps {
  isOpen: boolean;
  onClose: () => void;
  driverName: string;
  driverAvatar: string;
}

const CallModal: React.FC<CallModalProps> = ({ isOpen, onClose, driverName, driverAvatar }) => {
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setCallDuration(0);
      return;
    }

    const interval = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-100 z-50 flex flex-col">
      {/* Driver Info */}
      <div className="flex-1 flex flex-col items-center justify-center px-8">
        <div className="relative mb-8">
          <img
            src={driverAvatar}
            alt={driverName}
            className="w-32 h-32 rounded-full object-cover border-4 border-[#3AC36C] shadow-lg"
            onError={(e) => {
              e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='128' height='128' viewBox='0 0 128 128'%3E%3Ccircle cx='64' cy='64' r='64' fill='%23e5e7eb'/%3E%3Cpath d='M64 32c10.4 0 19 8.6 19 19s-8.6 19-19 19-19-8.6-19-19 8.6-19 19-19zm0 76c-17.6 0-32-14.4-32-32 0-3.5.5-6.9 1.4-10.1 6.3 4.8 14.2 7.7 22.8 7.7h15.6c8.6 0 16.5-2.9 22.8-7.7.9 3.2 1.4 6.6 1.4 10.1 0 17.6-14.4 32-32 32z' fill='%23999'/%3E%3C/svg%3E";
            }}
          />
          <div className="absolute inset-0 rounded-full border-4 border-[#3AC36C] animate-pulse"></div>
        </div>

        <h2 className="text-2xl font-semibold text-gray-900 mb-2">{driverName}</h2>
        <p className="text-lg text-gray-600">{formatTime(callDuration)}</p>
      </div>

      {/* Call Controls */}
      <div className="px-8 pb-8">
        {/* First Row */}
        <div className="flex justify-center space-x-12 mb-8">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className={`w-16 h-16 rounded-full flex items-center justify-center ${
              isMuted ? 'bg-red-500' : 'bg-gray-200'
            } transition-colors`}
          >
            {isMuted ? (
              <MicOff className="w-6 h-6 text-white" />
            ) : (
              <Mic className="w-6 h-6 text-gray-700" />
            )}
          </button>

          <button className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
            <MessageSquare className="w-6 h-6 text-gray-700" />
          </button>

          <button className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
            <Volume2 className="w-6 h-6 text-gray-700" />
          </button>
        </div>

        {/* Second Row */}
        <div className="flex justify-center space-x-12 mb-12">
          <button className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
            <Mic className="w-6 h-6 text-gray-700" />
          </button>

          <button className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
            <UserPlus className="w-6 h-6 text-gray-700" />
          </button>

          <button className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
            <MoreHorizontal className="w-6 h-6 text-gray-700" />
          </button>
        </div>

        {/* End Call Button */}
        <div className="flex justify-center">
          <button
            onClick={onClose}
            className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center shadow-lg hover:bg-red-600 transition-colors"
          >
            <Phone className="w-6 h-6 text-white transform rotate-[135deg]" />
          </button>
        </div>
      </div>

      {/* Labels */}
      <div className="px-8 pb-4">
        <div className="flex justify-center space-x-12 mb-8">
          <span className="text-sm text-gray-600 w-16 text-center">
            {isMuted ? 'Unmute' : 'Mute'}
          </span>
          <span className="text-sm text-gray-600 w-16 text-center">Chat</span>
          <span className="text-sm text-gray-600 w-16 text-center">Speaker</span>
        </div>

        <div className="flex justify-center space-x-12">
          <span className="text-sm text-gray-600 w-16 text-center">Record</span>
          <span className="text-sm text-gray-600 w-16 text-center">Add</span>
          <span className="text-sm text-gray-600 w-16 text-center">More</span>
        </div>
      </div>
    </div>
  );
};

export default CallModal;