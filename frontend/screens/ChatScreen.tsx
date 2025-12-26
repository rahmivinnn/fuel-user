import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Mic, Send } from 'lucide-react';
import AnimatedPage from '../components/AnimatedPage';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const ChatScreen = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [messages] = useState<Message[]>([
    {
      id: '1',
      text: 'Ut enim ad minim veniam,',
      isUser: true,
      timestamp: new Date()
    },
    {
      id: '2',
      text: 'I think the idea that things are chaning isnt good',
      isUser: false,
      timestamp: new Date()
    },
    {
      id: '3',
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      isUser: true,
      timestamp: new Date()
    },
    {
      id: '4',
      text: 'Sed do eiusmod tempor incididunt ut labore et.',
      isUser: false,
      timestamp: new Date()
    },
    {
      id: '5',
      text: 'Ut enim ad minim veniam,',
      isUser: true,
      timestamp: new Date()
    },
    {
      id: '6',
      text: 'I think the idea that things are chaning isnt good',
      isUser: false,
      timestamp: new Date()
    },
    {
      id: '7',
      text: 'Duis aute irure a',
      isUser: true,
      timestamp: new Date()
    },
    {
      id: '8',
      text: 'I think the idea that things are chaning isnt good',
      isUser: false,
      timestamp: new Date()
    }
  ]);

  return (
    <AnimatedPage>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* Header */}
        <header className="bg-white p-4 flex items-center border-b border-gray-100">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h2 className="text-lg font-semibold text-center flex-grow -ml-10 text-gray-900">Message</h2>
        </header>

        {/* Messages */}
        <div className="flex-1 p-4 space-y-4 overflow-y-auto">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs px-4 py-3 rounded-2xl ${
                msg.isUser 
                  ? 'bg-[#3AC36C] text-white' 
                  : 'bg-white text-gray-800 border border-gray-200'
              }`}>
                <p className="text-sm">{msg.text}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="bg-white p-4 border-t border-gray-100">
          <div className="flex items-center bg-gray-100 rounded-full px-4 py-3">
            <button className="p-1 mr-3">
              <Mic className="w-5 h-5 text-gray-500" />
            </button>
            <input
              type="text"
              placeholder="Type a message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-500"
            />
            <button className="p-1 ml-3">
              <Send className="w-5 h-5 text-[#3AC36C]" />
            </button>
          </div>
        </div>
      </div>
    </AnimatedPage>
  );
};

export default ChatScreen;