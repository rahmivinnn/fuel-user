import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, Phone, User, Truck, CheckCircle } from 'lucide-react';
import AnimatedPage from '../components/AnimatedPage';
import MapboxMap from '../components/MapboxMap';
import CallModal from '../components/CallModal';

const TrackOrderScreen = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showCallModal, setShowCallModal] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem('user');
    setIsLoggedIn(!!user);
  }, []);

  if (!isLoggedIn) {
    return (
      <AnimatedPage>
        <div className="min-h-screen flex flex-col bg-white">
          <div className="flex-1 flex flex-col items-center justify-center px-4">
            <div className="text-center">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-gray-400" />
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

  const orderData = {
    driver: {
      name: 'Cristopert Dastin',
      location: 'Tennessee',
      avatar: '/avatar.png'
    },
    deliveryTime: '8:30 - 9:15 PM',
    items: [
      { name: '2 Liters Fuel', price: 283 },
      { name: '2x Chocolate cookies', price: 20 }
    ],
    userLocation: { lat: 35.1495, lon: -90.0490 }
  };

  return (
    <AnimatedPage>
      <div className="bg-white min-h-screen">
        {/* Header */}
        <div className="flex items-center px-4 py-4 bg-white">
          <button onClick={() => navigate("/home")} className="p-2 -ml-2">
            <img src="/Back.png" alt="Back" className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-bold text-gray-900 flex-1 text-center -ml-10">Track Your Order</h1>
        </div>

        {/* Map */}
        <div className="h-80 mx-4 rounded-2xl overflow-hidden mb-4">
          <MapboxMap
            stations={[]}
            userLocation={orderData.userLocation}
            onStationSelect={() => {}}
          />
        </div>

        {/* Bottom Card */}
        <div className="mx-4 bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          {/* Handle */}
          <div className="flex justify-center py-3">
            <div className="w-12 h-1 bg-gray-300 rounded-full"></div>
          </div>

          <div className="px-6 pb-6">
            {/* Driver Info */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <img 
                  src={orderData.driver.avatar} 
                  alt={orderData.driver.name}
                  className="w-12 h-12 rounded-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 48 48'%3E%3Ccircle cx='24' cy='24' r='24' fill='%23e5e7eb'/%3E%3Cpath d='M24 12c3.3 0 6 2.7 6 6s-2.7 6-6 6-6-2.7-6-6 2.7-6 6-6zm0 28c-6.6 0-12-5.4-12-12 0-1.3.2-2.5.6-3.6 2.4 1.8 5.4 2.9 8.6 2.9h5.6c3.2 0 6.2-1.1 8.6-2.9.4 1.1.6 2.3.6 3.6 0 6.6-5.4 12-12 12z' fill='%23999'/%3E%3C/svg%3E";
                  }}
                />
                <div>
                  <h3 className="font-semibold text-gray-900">{orderData.driver.name}</h3>
                  <p className="text-sm text-gray-500">{orderData.driver.location}</p>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <button 
                  onClick={() => navigate('/chat')}
                  className="w-10 h-10 bg-[#3AC36C] rounded-full flex items-center justify-center"
                >
                  <MessageCircle className="w-5 h-5 text-white" />
                </button>
                <button 
                  onClick={() => setShowCallModal(true)}
                  className="w-10 h-10 bg-[#3AC36C] rounded-full flex items-center justify-center"
                >
                  <Phone className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>

            {/* Delivery Time */}
            <div className="mb-6">
              <h4 className="font-semibold text-gray-900 mb-1">Your Delivery Time</h4>
              <p className="text-gray-600">Estimated {orderData.deliveryTime}</p>
            </div>

            {/* Progress */}
            <div className="flex items-center justify-between mb-6 px-4">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 bg-[#3AC36C] rounded-full flex items-center justify-center mb-1">
                  <User className="w-4 h-4 text-white" />
                </div>
              </div>
              
              <div className="flex-1 h-0.5 bg-[#3AC36C] mx-2"></div>
              
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 bg-[#3AC36C] rounded-full flex items-center justify-center mb-1">
                  <Truck className="w-4 h-4 text-white" />
                </div>
              </div>
              
              <div className="flex-1 h-0.5 bg-gray-200 mx-2"></div>
              
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mb-1">
                  <CheckCircle className="w-4 h-4 text-gray-400" />
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Order</h4>
              <div className="space-y-2">
                {orderData.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-gray-600">{item.name}</span>
                    <span className="font-semibold text-gray-900">${item.price}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="h-24"></div>

        {/* Call Modal */}
        <CallModal
          isOpen={showCallModal}
          onClose={() => setShowCallModal(false)}
          driverName={orderData.driver.name}
          driverAvatar={orderData.driver.avatar}
        />
      </div>
    </AnimatedPage>
  );
};

export default TrackOrderScreen;