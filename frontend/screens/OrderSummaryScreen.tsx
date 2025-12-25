import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Check } from 'lucide-react';
import AnimatedPage from '../components/AnimatedPage';

const OrderSummaryScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const formData = location.state?.formData || {
    address: 'Loreum ipsum',
    phoneNumber: '923556688',
    vehicleColor: 'Red',
    vehicleBrand: 'Honda',
    numberPlate: 'CAN-1234',
    fuelType: 'Premium Gasoline',
    quantity: '10 liters',
    deliveryTime: 'Today, 12:30 AM'
  };

  return (
    <AnimatedPage>
      <div className="bg-white min-h-screen pb-24">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200">
          <button
            onClick={() => navigate(-1)}
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
                <span className="text-gray-900 font-medium">TurboFuel Express</span>
              </div>

              {/* Fuel Type */}
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-700">Fuel Type</span>
                <span className="text-gray-900 font-medium">Premium Gasoline</span>
              </div>

              {/* Quantity */}
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-700">Quantity</span>
                <span className="text-gray-900 font-medium">10 liters</span>
              </div>

              {/* Chocolate Cookies */}
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-700">Chocolate Cookies</span>
                <span className="text-gray-900 font-medium">$20.00</span>
              </div>

              {/* Delivery Time */}
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-700">Delivery Time</span>
                <span className="text-gray-900 font-medium">{formData.deliveryTime}</span>
              </div>

              {/* Vehicle Brand */}
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-700">Vehicle Brand</span>
                <span className="text-gray-900 font-medium">{formData.vehicleBrand}</span>
              </div>

              {/* Vehicle Color */}
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-700">Vehicle color</span>
                <span className="text-gray-900 font-medium">{formData.vehicleColor}</span>
              </div>

              {/* License Number */}
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-700">License Number</span>
                <span className="text-gray-900 font-medium">{formData.numberPlate}</span>
              </div>

              {/* Fuel Cost */}
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-700">Fuel Cost</span>
                <span className="text-gray-900 font-medium">$90.00</span>
              </div>

              {/* Delivery Fee */}
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-700">Delivery Fee</span>
                <span className="text-gray-900 font-medium">$10.00</span>
              </div>

              {/* Total Amount */}
              <div className="flex justify-between items-center py-3 pt-4">
                <span className="text-gray-900 font-semibold text-lg">Total Amount</span>
                <span className="text-gray-900 font-semibold text-lg">$120.00</span>
              </div>
            </div>
          </div>
        </div>

        {/* Confirm Payment Button */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200">
          <button 
            onClick={() => navigate('/payment')}
            className="w-full bg-green-500 text-white py-4 rounded-full text-lg font-semibold mb-4"
          >
            Confirm Payment & Address
          </button>
          
          {/* Edit Details Link */}
          <button 
            onClick={() => navigate(-1)}
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