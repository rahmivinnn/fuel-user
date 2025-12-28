import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Check, Plus, X } from 'lucide-react';
import AnimatedPage from '../components/AnimatedPage';
import { apiCreateOrder, apiHealthCheck } from '../services/api';
import { useAppContext } from '../App';

const PaymentScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAppContext();
  const [selectedPayment, setSelectedPayment] = useState('card');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [trackingId, setTrackingId] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const { 
    formData, 
    station, 
    cartItems = [], 
    selectedFuelFriend 
  } = location.state || {};

  // Calculate totals from real data
  const fuelCost = station ? parseFloat(station.regularPrice) * parseFloat(formData?.quantity?.replace(' liters', '') || '10') : 0;
  const groceriesCost = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const deliveryFee = selectedFuelFriend ? parseFloat(selectedFuelFriend.deliveryFee) : 10;
  const totalAmount = fuelCost + groceriesCost + deliveryFee;

  // Check API health on component mount
  useEffect(() => {
    const checkAPI = async () => {
      try {
        await apiHealthCheck();
        console.log('API connection successful');
      } catch (error) {
        console.log('API connection failed:', error);
      }
    };
    checkAPI();
  }, []);

  const handlePlaceOrder = async () => {
    if (!user) {
      alert('Please login to place order');
      navigate('/login');
      return;
    }

    if (!station?.id) {
      alert('Station information missing. Please go back and select a station.');
      navigate('/home');
      return;
    }

    setIsProcessing(true);
    try {
      const orderData = {
        customerId: user.id.toString(),
        stationId: station.id.toString(),
        deliveryAddress: formData?.address || user.address || 'Sample Address',
        deliveryPhone: formData?.phoneNumber || user.phoneNumber || '1234567890',
        fuelType: formData?.fuelType || 'Premium',
        fuelQuantity: (formData?.quantity?.replace(' liters', '') || '10').toString(),
        fuelCost: fuelCost.toFixed(2),
        deliveryFee: deliveryFee.toFixed(2),
        groceriesCost: groceriesCost.toFixed(2),
        totalAmount: totalAmount.toFixed(2),
        orderType: formData?.orderType || 'instant',
        paymentMethod: selectedPayment === 'card' ? 'credit_card' : selectedPayment,
        cartItems: cartItems.map(item => ({
          id: item.id,
          name: item.name,
          price: parseFloat(item.price),
          quantity: parseInt(item.quantity)
        }))
      };

      // Add optional fields only if they have values
      if (selectedFuelFriend?.id) {
        orderData.fuelFriendId = selectedFuelFriend.id.toString();
      }
      if (user?.vehicles && user.vehicles.length > 0) {
        const primaryVehicle = user.vehicles.find(v => v.isPrimary) || user.vehicles[0];
        if (primaryVehicle?.id) {
          orderData.vehicleId = primaryVehicle.id.toString();
        }
      }

      const result = await apiCreateOrder(orderData);
      
      if (result) {
        setTrackingId(result.trackingNumber || '#12345');
        setShowSuccessModal(true);
      } else {
        throw new Error('Failed to create order');
      }
    } catch (error) {
      console.error('Order creation failed:', error);
      alert('Failed to create order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <AnimatedPage>
      <div className="bg-white min-h-screen pb-24">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200">
          <button
            onClick={() => navigate("/home")}
            className="p-2 -ml-2"
          >
            <img src="/Back.png" alt="Back" className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-semibold text-gray-900">Payment</h1>
          <div className="w-10"></div>
        </div>

        {/* Step Indicator */}
        <div className="px-4 py-6">
          <div className="flex items-center justify-between mb-8">
            {/* Step 1 - Completed */}
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full flex items-center justify-center bg-green-500 border-2 border-green-500 text-white">
                <Check className="w-6 h-6" />
              </div>
              <span className="text-sm text-gray-600 mt-2">Order</span>
            </div>

            {/* Connector 1-2 */}
            <div className="flex-1 h-0.5 mx-2 bg-green-500"></div>

            {/* Step 2 - Completed */}
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full flex items-center justify-center bg-green-500 border-2 border-green-500 text-white">
                <Check className="w-6 h-6" />
              </div>
              <span className="text-sm text-gray-600 mt-2">Order summary</span>
            </div>

            {/* Connector 2-3 */}
            <div className="flex-1 h-0.5 mx-2 bg-green-500"></div>

            {/* Step 3 - Current */}
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full flex items-center justify-center bg-green-500 border-2 border-green-500 text-white">
                <span className="font-semibold">3</span>
              </div>
              <span className="text-sm text-gray-600 mt-2">Payment</span>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="px-4 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Payment Method</h2>
          
          {/* Credit Card Option */}
          <div className="mb-4">
            <button
              onClick={() => setSelectedPayment('card')}
              className={`w-full p-4 border-2 rounded-2xl transition-colors ${
                selectedPayment === 'card'
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-200 bg-white'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    selectedPayment === 'card'
                      ? 'border-green-500 bg-green-500'
                      : 'border-gray-300'
                  }`}>
                    {selectedPayment === 'card' && (
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    )}
                  </div>
                  <span className="text-gray-900 font-medium">Credit/Debit Card</span>
                </div>
              </div>
              
              {/* Payment Card Image */}
              {selectedPayment === 'card' && (
                <div className="mt-4">
                  <img 
                    src="/payment-card.png" 
                    alt="Payment Card" 
                    className="w-full max-w-sm mx-auto object-contain"
                  />
                </div>
              )}
            </button>
          </div>

          {/* PayPal Option */}
          <div className="mb-4">
            <button
              onClick={() => setSelectedPayment('paypal')}
              className={`w-full p-4 border-2 rounded-2xl transition-colors ${
                selectedPayment === 'paypal'
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-200 bg-white'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  selectedPayment === 'paypal'
                    ? 'border-green-500 bg-green-500'
                    : 'border-gray-300'
                }`}>
                  {selectedPayment === 'paypal' && (
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  )}
                </div>
                <span className="text-gray-900 font-medium">PayPal</span>
              </div>
            </button>
          </div>

          {/* Apple Pay Option */}
          <div className="mb-4">
            <button
              onClick={() => setSelectedPayment('apple')}
              className={`w-full p-4 border-2 rounded-2xl transition-colors ${
                selectedPayment === 'apple'
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-200 bg-white'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  selectedPayment === 'apple'
                    ? 'border-green-500 bg-green-500'
                    : 'border-gray-300'
                }`}>
                  {selectedPayment === 'apple' && (
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  )}
                </div>
                <span className="text-gray-900 font-medium">Apple Pay</span>
              </div>
            </button>
          </div>

          {/* Add New Payment Method */}
          <button className="w-full p-4 border-2 border-dashed border-gray-300 rounded-2xl text-gray-600 hover:border-green-300 hover:text-green-600 transition-colors">
            <div className="flex items-center justify-center space-x-2">
              <Plus className="w-5 h-5" />
              <span className="font-medium">Add New Payment Method</span>
            </div>
          </button>
        </div>

        {/* Order Summary */}
        <div className="mx-4 mb-6">
          <div className="bg-gray-50 rounded-2xl p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Order Summary</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Fuel Cost</span>
                <span className="text-gray-900">${fuelCost.toFixed(2)}</span>
              </div>
              {groceriesCost > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Groceries</span>
                  <span className="text-gray-900">${groceriesCost.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">Delivery Fee</span>
                <span className="text-gray-900">${deliveryFee.toFixed(2)}</span>
              </div>
              <div className="border-t border-gray-200 pt-2 mt-2">
                <div className="flex justify-between">
                  <span className="text-lg font-semibold text-gray-900">Total</span>
                  <span className="text-lg font-semibold text-gray-900">${totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Place Order Button */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200">
          <button 
            onClick={handlePlaceOrder}
            disabled={isProcessing}
            className="w-full bg-green-500 text-white py-4 rounded-full text-lg font-semibold disabled:opacity-50"
          >
            {isProcessing ? 'Processing...' : `Place Order - $${totalAmount.toFixed(2)}`}
          </button>
        </div>

        {/* Success Modal */}
        {showSuccessModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-8 w-full max-w-sm text-center">
              <button
                onClick={() => setShowSuccessModal(false)}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
              
              {/* Success Icon */}
              <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="w-10 h-10 text-white" />
              </div>
              
              {/* Success Message */}
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Your payment has Been made Successfully
              </h2>
              
              {/* Tracking ID */}
              <p className="text-gray-600 mb-8">
                Tracking ID No: {trackingId || '#12345'}
              </p>
              
              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={() => {
                    setShowSuccessModal(false);
                    navigate('/track');
                  }}
                  className="w-full bg-green-500 text-white py-4 rounded-full text-lg font-semibold"
                >
                  Track Order
                </button>
                
                <button
                  onClick={() => {
                    setShowSuccessModal(false);
                    navigate('/home');
                  }}
                  className="w-full text-green-500 text-lg font-medium underline"
                >
                  Back To Home
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AnimatedPage>
  );
};

export default PaymentScreen;