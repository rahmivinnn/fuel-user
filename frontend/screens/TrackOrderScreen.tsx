import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MessageCircle, Phone, User, Truck, MapPin, Clock } from 'lucide-react';
import AnimatedPage from '../components/AnimatedPage';
import MapboxMap from '../components/MapboxMap';

const TrackOrderScreen = () => {
  const navigate = useNavigate();
  const [orderStatus, setOrderStatus] = useState('in_progress');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const user = localStorage.getItem('user');
    if (!user) {
      setIsLoggedIn(false);
      return;
    }
    setIsLoggedIn(true);
  }, []);

  // Show login prompt if not logged in
  if (!isLoggedIn) {
    return (
      <AnimatedPage>
        <div className="min-h-screen flex flex-col bg-white">
          <header className="p-4 flex items-center sticky top-0 bg-white z-10 shadow-sm">
            <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
              <img src="/Back.png" alt="Back" className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-bold text-center flex-grow -ml-10 text-[#3F4249]">Track Order</h2>
          </header>
          
          <div className="flex-1 flex flex-col items-center justify-center px-4">
            <div className="text-center">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Login Required</h3>
              <p className="text-gray-600 mb-8 max-w-sm">
                Please login to track your orders and view delivery status.
              </p>
              <button 
                onClick={() => navigate('/login')}
                className="bg-[#3AC36C] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#2ea85a] transition-colors"
              >
                Login Now
              </button>
            </div>
          </div>
        </div>
      </AnimatedPage>
    );
  }

  // Mock order data
  const orderData = {
    id: 'TRK-12345',
    driver: {
      name: 'Cristopert Dastin',
      location: 'Tennessee',
      avatar: '/avatar.png',
      phone: '+1234567890'
    },
    deliveryTime: {
      estimated: '8:30 - 9:15 PM'
    },
    items: [
      { name: '2 Liters Fuel', price: 283 },
      { name: '2x Chocolate cookies', price: 20 }
    ],
    userLocation: { lat: 35.1495, lon: -90.0490 }, // Memphis coordinates
    driverLocation: { lat: 35.1495, lon: -90.0490 }
  };

  return (
    <AnimatedPage>
      <div className="bg-white min-h-screen pb-24">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200 shadow-sm bg-white">
          <button
            onClick={() => navigate('/home')}
            className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <img src="/Back.png" alt="Back" className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-bold text-[#3F4249]">Track Your Order</h1>
          <div className="w-10"></div>
        </div>

        {/* Map */}
        <div className="h-80 relative">
          <MapboxMap
            stations={[]}
            userLocation={orderData.userLocation}
            onStationSelect={() => {}}
          />
        </div>

        {/* Driver Info Card */}
        <div className="mx-4 mt-4 bg-white rounded-2xl shadow-xl border border-gray-100 p-5">
          {/* Driver Header */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center space-x-4">
              <img 
                src={orderData.driver.avatar} 
                alt={orderData.driver.name}
                className="w-14 h-14 rounded-full object-cover border-2 border-gray-200 shadow-md"
                onError={(e) => {
                  e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='56' viewBox='0 0 56 56'%3E%3Ccircle cx='28' cy='28' r='28' fill='%23e5e7eb'/%3E%3Cpath d='M28 14c3.9 0 7 3.1 7 7s-3.1 7-7 7-7-3.1-7-7 3.1-7 7-7zm0 32c-7.7 0-14-6.3-14-14 0-1.5.2-2.9.7-4.2 2.8 2.1 6.3 3.4 10.1 3.4h6.4c3.8 0 7.3-1.3 10.1-3.4.5 1.3.7 2.7.7 4.2 0 7.7-6.3 14-14 14z' fill='%23999'/%3E%3C/svg%3E";
                }}
              />
              <div>
                <h3 className="font-bold text-[#3F4249] text-lg">{orderData.driver.name}</h3>
                <p className="text-sm text-gray-600 flex items-center mt-1">
                  <MapPin size={14} className="mr-1 text-[#FF5630]" />
                  {orderData.driver.location}
                </p>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex space-x-3">
              <button className="w-12 h-12 bg-[#3AC36C] rounded-full flex items-center justify-center shadow-lg hover:bg-[#2ea85a] transition-all duration-200 active:scale-95">
                <MessageCircle className="w-6 h-6 text-white" />
              </button>
              <button className="w-12 h-12 bg-[#3AC36C] rounded-full flex items-center justify-center shadow-lg hover:bg-[#2ea85a] transition-all duration-200 active:scale-95">
                <Phone className="w-6 h-6 text-white" />
              </button>
            </div>
          </div>

          {/* Delivery Time */}
          <div className="mb-6 bg-[#E3FFEE] rounded-xl p-4">
            <h4 className="font-bold text-[#3F4249] mb-2">Your Delivery Time</h4>
            <p className="text-[#3AC36C] font-semibold text-lg">Estimated {orderData.deliveryTime.estimated}</p>
          </div>

          {/* Progress Indicator */}
          <div className="flex items-center justify-between mb-6 px-2">
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 bg-[#3AC36C] rounded-full flex items-center justify-center mb-2 shadow-md">
                <User className="w-5 h-5 text-white" />
              </div>
              <div className="w-3 h-3 bg-[#3AC36C] rounded-full shadow-sm"></div>
              <span className="text-xs text-[#3AC36C] font-medium mt-1">Order</span>
            </div>
            
            <div className="flex-1 h-1 bg-gray-200 mx-3 relative rounded-full">
              <div className="h-full bg-[#3AC36C] w-1/3 rounded-full shadow-sm"></div>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 bg-[#3AC36C] rounded-full flex items-center justify-center mb-2 shadow-md">
                <Truck className="w-5 h-5 text-white" />
              </div>
              <div className="w-3 h-3 bg-[#3AC36C] rounded-full shadow-sm"></div>
              <span className="text-xs text-[#3AC36C] font-medium mt-1">Pickup</span>
            </div>
            
            <div className="flex-1 h-1 bg-gray-200 mx-3 rounded-full"></div>
            
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mb-2">
                <MapPin className="w-5 h-5 text-gray-400" />
              </div>
              <div className="w-3 h-3 bg-gray-200 rounded-full"></div>
              <span className="text-xs text-gray-400 font-medium mt-1">Transit</span>
            </div>
            
            <div className="flex-1 h-1 bg-gray-200 mx-3 rounded-full"></div>
            
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mb-2">
                <Clock className="w-5 h-5 text-gray-400" />
              </div>
              <div className="w-3 h-3 bg-gray-200 rounded-full"></div>
              <span className="text-xs text-gray-400 font-medium mt-1">Delivered</span>
            </div>
          </div>

          {/* Order Details */}
          <div className="bg-gray-50 rounded-xl p-4">
            <h4 className="font-bold text-[#3F4249] mb-4">Order Details</h4>
            <div className="space-y-3">
              {orderData.items.map((item, index) => (
                <div key={index} className="flex justify-between items-center py-2">
                  <span className="text-gray-700 font-medium">{item.name}</span>
                  <span className="font-bold text-[#3F4249]">${item.price}</span>
                </div>
              ))}
              <div className="border-t border-gray-200 pt-3 mt-3">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-[#3F4249]">Total</span>
                  <span className="font-bold text-[#3AC36C] text-lg">${orderData.items.reduce((sum, item) => sum + item.price, 0)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Navigation Placeholder */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2">
          <div className="flex justify-around items-center">
            <button 
              onClick={() => navigate('/home')}
              className="flex flex-col items-center py-2"
            >
              <div className="w-6 h-6 mb-1">
                <svg viewBox="0 0 24 24" fill="currentColor" className="text-gray-400">
                  <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
                </svg>
              </div>
              <span className="text-xs text-gray-400">Home</span>
            </button>
            
            <button 
              onClick={() => navigate('/orders')}
              className="flex flex-col items-center py-2"
            >
              <div className="w-6 h-6 mb-1">
                <svg viewBox="0 0 24 24" fill="currentColor" className="text-gray-400">
                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
                </svg>
              </div>
              <span className="text-xs text-gray-400">My Orders</span>
            </button>
            
            <button className="flex flex-col items-center py-2">
              <div className="w-6 h-6 mb-1">
                <svg viewBox="0 0 24 24" fill="currentColor" className="text-green-500">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>
              <span className="text-xs text-green-500">Track Order</span>
            </button>
            
            <button 
              onClick={() => navigate('/settings')}
              className="flex flex-col items-center py-2"
            >
              <div className="w-6 h-6 mb-1">
                <svg viewBox="0 0 24 24" fill="currentColor" className="text-gray-400">
                  <path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.82,11.69,4.82,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z"/>
                </svg>
              </div>
              <span className="text-xs text-gray-400">Settings</span>
            </button>
          </div>
        </div>
      </div>
    </AnimatedPage>
  );
};

export default TrackOrderScreen;