import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Send } from 'lucide-react';
import AnimatedPage from '../components/AnimatedPage';

interface ChatMessage {
    id: string;
    text: string;
    isUser: boolean;
    timestamp: string;
}

const LiveChatSupportScreen = () => {
    const navigate = useNavigate();
    const [messages, setMessages] = useState<ChatMessage[]>([
        {
            id: '1',
            text: 'Hello! Welcome to FuelFriendly support. How can I help you today?',
            isUser: false,
            timestamp: '23:20'
        }
    ]);
    const [inputMessage, setInputMessage] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = () => {
        if (inputMessage.trim() === '') return;

        const newMessage: ChatMessage = {
            id: Date.now().toString(),
            text: inputMessage,
            isUser: true,
            timestamp: new Date().toLocaleTimeString('en-US', { 
                hour12: false, 
                hour: '2-digit', 
                minute: '2-digit' 
            })
        };

        setMessages(prev => [...prev, newMessage]);
        setInputMessage('');

        // Simulate support response after 2 seconds
        setTimeout(() => {
            const supportResponse: ChatMessage = {
                id: (Date.now() + 1).toString(),
                text: 'Thank you for your message. Our support team is reviewing your request and will respond shortly.',
                isUser: false,
                timestamp: new Date().toLocaleTimeString('en-US', { 
                    hour12: false, 
                    hour: '2-digit', 
                    minute: '2-digit' 
                })
            };
            setMessages(prev => [...prev, supportResponse]);
        }, 2000);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSendMessage();
        }
    };

    return (
        <AnimatedPage>
            <div className="min-h-screen bg-white flex flex-col">
                <header className="p-4 flex items-center bg-white border-b border-gray-100">
                    <button onClick={() => navigate('/support-help')} className="p-2 -ml-2">
                        <ArrowLeft className="w-5 h-5 text-gray-600" />
                    </button>
                    <h2 className="text-lg font-semibold text-center flex-grow -ml-10 text-gray-900">
                        Live Chat Support
                    </h2>
                </header>

                {/* Chat Messages */}
                <div className="flex-1 p-4 overflow-y-auto">
                    <div className="space-y-4">
                        {messages.map((message) => (
                            <div
                                key={message.id}
                                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                                        message.isUser
                                            ? 'bg-[#3AC36C] text-white'
                                            : 'bg-gray-100 text-gray-900'
                                    }`}
                                >
                                    <p className="text-sm">{message.text}</p>
                                    <p className={`text-xs mt-1 ${
                                        message.isUser ? 'text-green-100' : 'text-gray-500'
                                    }`}>
                                        {message.timestamp}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <div className="p-4 border-t border-gray-100">
                    <div className="flex items-center space-x-3">
                        <div className="flex-1 relative">
                            <input
                                type="text"
                                value={inputMessage}
                                onChange={(e) => setInputMessage(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Type your message here..."
                                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-full focus:outline-none focus:border-[#3AC36C] text-sm"
                            />
                            <button
                                onClick={handleSendMessage}
                                disabled={inputMessage.trim() === ''}
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-[#3AC36C] hover:bg-green-50 rounded-full transition-colors disabled:text-gray-300 disabled:hover:bg-transparent"
                            >
                                <Send className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                    
                    <p className="text-xs text-gray-500 text-center mt-2">
                        Our support team typically responds within 5 minutes
                    </p>
                </div>
            </div>
        </AnimatedPage>
    );
};

export default LiveChatSupportScreen;