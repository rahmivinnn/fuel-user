import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Check } from 'lucide-react';
import AnimatedPage from '../components/AnimatedPage';

const OrderSummaryScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { 
    formData, 
    station, 
    cartItems = [], 
    selectedFuelFriend, 
    user 
  } = location.state || {};

  // Calculate totals
  const fuelCost = station ? parseFloat(station.regularPrice) * parseFloat(formData?.quantity?.replace(' liters', '') || '10') : 0;
  const groceriesCost = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const deliveryFee = selectedFuelFriend ? parseFloat(selectedFuelFriend.deliveryFee) : 10;
  const totalAmount = fuelCost + groceriesCost + deliveryFee;

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
          <h1 className="text-lg font-semibold text-gray-900">Order summary</h1>
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

            {/* Step 2 - Current */}
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full flex items-center justify-center bg-green-500 border-2 border-green-500 text-white">
                <span className="font-semibold">2</span>
              </div>
              <span className="text-sm text-gray-600 mt-2">Order summary</span>
            </div>

            {/* Connector 2-3 */}
            <div className="flex-1 h-0.5 mx-2 bg-gray-300"></div>

            {/* Step 3 */}
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full flex items-center justify-center border-2 border-gray-300 text-gray-400">
                <span className="font-semibold">3</span>
              </div>
              <span className="text-sm text-gray-600 mt-2">Payment</span>
            </div>
          </div>
        </div>

        {/* Order Details Card */}
        <div className="mx-4 mb-6">
          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-gray-900 text-center mb-6">Fuel order details</h2>
            
            <div className="space-y-4">
              {/* Station Name */}
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-700">Station Name</span>
                <span className="text-gray-900 font-medium">{station?.name || 'N/A'}</span>
              </div>

              {/* Fuel Type */}
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-700">Fuel Type</span>
                <span className="text-gray-900 font-medium">{formData?.fuelType || 'N/A'}</span>
              </div>

              {/* Quantity */}
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-700">Quantity</span>
                <span className="text-gray-900 font-medium">{formData?.quantity || 'N/A'}</span>
              </div>

              {/* Groceries */}
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-700">{item.name} (x{item.quantity})</span>
                  <span className="text-gray-900 font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}

              {/* Fuel Friend */}
              {selectedFuelFriend && (
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-700">Fuel Friend</span>
                  <span className="text-gray-900 font-medium">{selectedFuelFriend.fullName}</span>
                </div>
              )}

              {/* Delivery Time */}
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-700">Delivery Time</span>
                <span className="text-gray-900 font-medium">{formData?.deliveryTime || 'N/A'}</span>
              </div>

              {/* Vehicle Details */}
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-700">Vehicle</span>
                <span className="text-gray-900 font-medium">{formData?.vehicleBrand} ({formData?.vehicleColor})</span>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-700">License Number</span>
                <span className="text-gray-900 font-medium">{formData?.numberPlate || 'N/A'}</span>
              </div>

              {/* Costs */}
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-700">Fuel Cost</span>
                <span className="text-gray-900 font-medium">${fuelCost.toFixed(2)}</span>
              </div>

              {groceriesCost > 0 && (
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-700">Groceries Cost</span>
                  <span className="text-gray-900 font-medium">${groceriesCost.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-700">Delivery Fee</span>
                <span className="text-gray-900 font-medium">${deliveryFee.toFixed(2)}</span>
              </div>

              {/* Total Amount */}
              <div className="flex justify-between items-center py-3 pt-4">
                <span className="text-gray-900 font-semibold text-lg">Total Amount</span>
                <span className="text-gray-900 font-semibold text-lg">${totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Confirm Payment Button */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200">
          <button 
            onClick={() => navigate('/payment', {
              state: {
                formData,
                station,
                cartItems,
                selectedFuelFriend,
                user
              }
            })}
            className="w-full bg-green-500 text-white py-4 rounded-full text-lg font-semibold mb-4"
          >
            Confirm Payment & Address
          </button>
          
          {/* Edit Details Link */}
          <button 
            onClick={() => navigate("/home")}
            className="w-full text-green-500 text-lg font-medium"
          >
            Edit Details
          </button>
        </div>
      </div>
    </AnimatedPage>
  );
};

export default OrderSummaryScreen;