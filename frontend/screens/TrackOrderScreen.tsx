import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { MessageCircle, Phone, User, Truck, CheckCircle } from 'lucide-react';
import { useAppContext } from '../App';
import { apiGetOrders, apiGetOrderDetail } from '../services/api';
import AnimatedPage from '../components/AnimatedPage';
import MapboxMap from '../components/MapboxMap';
import CallModal from '../components/CallModal';

const TrackOrderScreen = () => {
  const navigate = useNavigate();
  const { orderId } = useParams();
  const location = useLocation();
  const { user, token } = useAppContext();
  const [showCallModal, setShowCallModal] = useState(false);
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sheetHeight, setSheetHeight] = useState(60);
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [startHeight, setStartHeight] = useState(60);
  const sheetRef = useRef(null);

  // Get selected order from navigation state
  const selectedOrder = location.state?.selectedOrder;

  const handleTouchStart = (e) => {
    setIsDragging(true);
    setStartY(e.touches[0].clientY);
    setStartHeight(sheetHeight);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    
    const currentY = e.touches[0].clientY;
    const deltaY = startY - currentY;
    const screenHeight = window.innerHeight;
    const deltaPercent = (deltaY / screenHeight) * 100;
    
    let newHeight = startHeight + deltaPercent;
    newHeight = Math.max(20, Math.min(85, newHeight));
    
    setSheetHeight(newHeight);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    
    if (sheetHeight < 35) {
      setSheetHeight(20);
    } else if (sheetHeight > 70) {
      setSheetHeight(85);
    } else {
      setSheetHeight(60);
    }
  };

  useEffect(() => {
    if (!token || !user) {
      setIsLoading(false);
      return;
    }

    const fetchOrderData = async () => {
      try {
        // If order is passed from MyOrdersScreen, use it directly
        if (selectedOrder) {
          setOrder(selectedOrder);
          setIsLoading(false);
          return;
        }
        
        if (orderId) {
          const orderData = await apiGetOrderDetail(orderId);
          setOrder(orderData);
        } else {
          const orders = await apiGetOrders();
          const ongoingOrder = orders.find(o => o.status === 'confirmed' || o.status === 'ongoing') || orders[0];
          setOrder(ongoingOrder);
        }
      } catch (error) {
        console.error('Failed to fetch order data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchOrderData();
  }, [orderId, token, user, selectedOrder]);

  if (!token || !user) {
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

  // Get the order data
  if (!order) {
    return (
      <AnimatedPage>
        <div className="min-h-screen flex flex-col bg-white">
          <div className="flex items-center px-4 py-4 bg-white">
            <button onClick={() => navigate("/orders")} className="p-2 -ml-2">
              <img src="/Back.png" alt="Back" className="w-5 h-5" />
            </button>
            <h1 className="text-lg font-bold text-gray-900 flex-1 text-center -ml-10">Track Your Order</h1>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center px-4">
            <div className="text-center">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Order Found</h3>
              <p className="text-gray-600 mb-8 max-w-sm">
                {orderId ? 'Order not found or you don\'t have access to it.' : 'You don\'t have any active orders to track at the moment.'}
              </p>
              <button 
                onClick={() => navigate('/home')}
                className="bg-[#3AC36C] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#2ea85a] transition-colors"
              >
                Browse Stations
              </button>
            </div>
          </div>
        </div>
      </AnimatedPage>
    );
  }

  const orderData = {
    driver: {
      name: order?.fuelFriendName || order?.fuelFriend?.name || 'Fuel Friend',
      location: order?.fuelFriendLocation || order?.fuelFriend?.location || order?.deliveryAddress || 'Location',
      avatar: order?.fuelFriendPhoto || order?.fuelFriend?.avatarUrl || '/avatar.png'
    },
    deliveryTime: order?.estimatedDeliveryTime || '8:30 - 9:15 PM',
    items: [
      { name: `${order?.fuelQuantity || '0'} Liters ${order?.fuelType || 'Fuel'}`, price: parseFloat(order?.fuelCost || '0') },
      ...(parseFloat(order?.groceriesCost || '0') > 0 ? [{ name: 'Groceries', price: parseFloat(order?.groceriesCost || '0') }] : []),
      ...(order?.items || []).map(item => ({ name: item?.productName || item?.name, price: parseFloat(item?.price || '0') }))
    ],
    userLocation: { lat: 35.1495, lon: -90.0490 },
    trackingNumber: order?.trackingNumber || order?.trackingNo || 'N/A'
  };

  return (
    <AnimatedPage>
      <div className="bg-white min-h-screen">
        {/* Header */}
        <div className="flex items-center px-4 py-4 bg-white">
          <button onClick={() => navigate("/orders")} className="p-2 -ml-2">
            <img src="/Back.png" alt="Back" className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-bold text-gray-900 flex-1 text-center -ml-10">Track Your Order</h1>
        </div>

        {/* Map - Dynamic height */}
        <div 
          className="mx-4 rounded-2xl overflow-hidden mb-4 transition-all duration-300"
          style={{ height: `${100 - sheetHeight - 15}vh` }}
        >
          <MapboxMap
            stations={[]}
            userLocation={orderData.userLocation}
            onStationSelect={() => {}}
          />
        </div>

        {/* Draggable Bottom Sheet */}
        <div 
          ref={sheetRef}
          className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-lg border border-gray-100 transition-all duration-300"
          style={{ height: `${sheetHeight}vh` }}
        >
          {/* Drag Handle */}
          <div 
            className="flex justify-center py-3 cursor-grab active:cursor-grabbing"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div className="w-12 h-1 bg-gray-300 rounded-full"></div>
          </div>

          <div className="px-6 pb-6 overflow-y-auto" style={{ height: 'calc(100% - 60px)' }}>
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