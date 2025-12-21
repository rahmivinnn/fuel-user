import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronDown, X, Zap, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import AnimatedPage from '../components/AnimatedPage';

const CheckoutScreen = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [showDeliveryModal, setShowDeliveryModal] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(16);
  const [selectedTime, setSelectedTime] = useState('12:45 am');
  const [currentMonth, setCurrentMonth] = useState('February');
  const [formData, setFormData] = useState({
    address: 'Loreum ipsum',
    phoneNumber: '923556688',
    vehicleColor: 'Vehicle Color',
    vehicleBrand: 'Toyota',
    numberPlate: 'Abc 123',
    fuelType: 'Petrol',
    quantity: '10 liters',
    deliveryTime: 'Instant',
    orderType: 'instant'
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleOrderTypeSelect = (type: string) => {
    if (type === 'scheduled') {
      setShowDatePicker(true);
      setShowDeliveryModal(false);
    } else {
      setFormData(prev => ({
        ...prev,
        orderType: type,
        deliveryTime: 'Instant order'
      }));
      setShowDeliveryModal(false);
    }
  };

  const handleScheduleConfirm = () => {
    setFormData(prev => ({
      ...prev,
      orderType: 'scheduled',
      deliveryTime: `${currentMonth} ${selectedDate}, ${selectedTime}`
    }));
    setShowDatePicker(false);
  };

  const handleSaveAndContinue = () => {
    // Pass form data to order summary
    navigate('/order-summary', { state: { formData } });
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
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </button>
          <h1 className="text-lg font-semibold text-gray-900">Checkout</h1>
          <div className="w-10"></div>
        </div>

        {/* Step Indicator */}
        <div className="px-4 py-6">
          <div className="flex items-center justify-between mb-8">
            {/* Step 1 */}
            <div className="flex flex-col items-center">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 ${
                currentStep >= 1 ? 'bg-green-500 border-green-500 text-white' : 'border-gray-300 text-gray-400'
              }`}>
                <span className="font-semibold">1</span>
              </div>
              <span className="text-sm text-gray-600 mt-2">Order</span>
            </div>

            {/* Connector 1-2 */}
            <div className={`flex-1 h-0.5 mx-2 ${
              currentStep >= 2 ? 'bg-green-500' : 'bg-gray-300'
            } relative`}>
              <div className="absolute inset-0 bg-gray-300"></div>
              <div className={`h-full ${currentStep >= 2 ? 'bg-green-500' : 'bg-gray-300'} transition-all duration-300`} 
                   style={{ width: currentStep >= 2 ? '100%' : '0%' }}></div>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 ${
                currentStep >= 2 ? 'bg-green-500 border-green-500 text-white' : 'border-gray-300 text-gray-400'
              }`}>
                <span className="font-semibold">2</span>
              </div>
              <span className="text-sm text-gray-600 mt-2">Order summary</span>
            </div>

            {/* Connector 2-3 */}
            <div className={`flex-1 h-0.5 mx-2 ${
              currentStep >= 3 ? 'bg-green-500' : 'bg-gray-300'
            } relative`}>
              <div className="absolute inset-0 bg-gray-300"></div>
              <div className={`h-full ${currentStep >= 3 ? 'bg-green-500' : 'bg-gray-300'} transition-all duration-300`} 
                   style={{ width: currentStep >= 3 ? '100%' : '0%' }}></div>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 ${
                currentStep >= 3 ? 'bg-green-500 border-green-500 text-white' : 'border-gray-300 text-gray-400'
              }`}>
                <span className="font-semibold">3</span>
              </div>
              <span className="text-sm text-gray-600 mt-2">Payment</span>
            </div>
          </div>
        </div>

        {/* Form Fields */}
        <div className="px-4 space-y-6">
          {/* Address */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">Address</label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Enter your address"
            />
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">Phone Number</label>
            <input
              type="tel"
              value={formData.phoneNumber}
              onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Enter phone number"
            />
          </div>

          {/* Vehicle Color and Brand */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-medium mb-2">Vehicle Color</label>
              <input
                type="text"
                value={formData.vehicleColor}
                onChange={(e) => handleInputChange('vehicleColor', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Vehicle Color"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">Vehicle Brand</label>
              <input
                type="text"
                value={formData.vehicleBrand}
                onChange={(e) => handleInputChange('vehicleBrand', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Vehicle Brand"
              />
            </div>
          </div>

          {/* Number Plate and Fuel Type */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-medium mb-2">Number Plate</label>
              <input
                type="text"
                value={formData.numberPlate}
                onChange={(e) => handleInputChange('numberPlate', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Number Plate"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">Fuel Type</label>
              <div className="relative">
                <select
                  value={formData.fuelType}
                  onChange={(e) => handleInputChange('fuelType', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none bg-white"
                >
                  <option value="Petrol">Petrol</option>
                  <option value="Diesel">Diesel</option>
                  <option value="Premium">Premium</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Quantity and Delivery Time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-medium mb-2">Quantity</label>
              <input
                type="text"
                value={formData.quantity}
                onChange={(e) => handleInputChange('quantity', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Quantity"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">Delivery Time</label>
              <button
                onClick={() => setShowDeliveryModal(true)}
                className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none bg-white text-left flex items-center justify-between"
              >
                <span className={formData.deliveryTime === 'Select time' ? 'text-gray-400' : 'text-gray-900'}>
                  {formData.deliveryTime}
                </span>
                <ChevronDown className="w-5 h-5 text-gray-400" />
              </button>
            </div>
          </div>
        </div>

        {/* Save & Continue Button */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200">
          <button 
            onClick={handleSaveAndContinue}
            className="w-full bg-green-500 text-white py-4 rounded-full text-lg font-semibold"
          >
            Save & Continue
          </button>
        </div>

        {/* Delivery Time Modal */}
        {showDeliveryModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Select order type</h2>
                <button
                  onClick={() => setShowDeliveryModal(false)}
                  className="p-1 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-3">
                <button
                  onClick={() => handleOrderTypeSelect('instant')}
                  className={`w-full p-4 rounded-full border-2 flex items-center justify-center space-x-2 transition-colors ${
                    formData.orderType === 'instant'
                      ? 'bg-green-500 border-green-500 text-white'
                      : 'border-gray-300 text-gray-700 hover:border-green-300'
                  }`}
                >
                  <Zap className="w-5 h-5" />
                  <span className="font-medium">Instant order</span>
                </button>
                
                <button
                  onClick={() => handleOrderTypeSelect('scheduled')}
                  className={`w-full p-4 rounded-full border-2 flex items-center justify-center space-x-2 transition-colors ${
                    formData.orderType === 'scheduled'
                      ? 'bg-green-500 border-green-500 text-white'
                      : 'border-gray-300 text-gray-700 hover:border-green-300'
                  }`}
                >
                  <Clock className="w-5 h-5" />
                  <span className="font-medium">Schedule Order</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Date Picker Modal */}
        {showDatePicker && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
              {/* Calendar Header */}
              <div className="flex items-center justify-between mb-6">
                <button className="p-2 text-green-500">
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <h2 className="text-lg font-semibold text-gray-900">{currentMonth}</h2>
                <button className="p-2 text-green-500">
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              {/* Calendar Grid */}
              <div className="mb-6">
                {/* Days of week */}
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
                    <div key={index} className="text-center text-sm font-medium text-gray-500 py-2">
                      {day}
                    </div>
                  ))}
                </div>
                
                {/* Calendar dates */}
                <div className="grid grid-cols-7 gap-1">
                  {/* First row */}
                  {[null, null, null, null, null, 1, 2].map((date, index) => (
                    <button
                      key={index}
                      className={`h-10 text-sm rounded-full ${
                        date ? 'hover:bg-gray-100 text-gray-700' : ''
                      }`}
                      disabled={!date}
                    >
                      {date}
                    </button>
                  ))}
                  
                  {/* Second row */}
                  {[3, 4, 5, 6, 7, 8, 9].map((date) => (
                    <button
                      key={date}
                      className="h-10 text-sm rounded-full hover:bg-gray-100 text-gray-700"
                    >
                      {date}
                    </button>
                  ))}
                  
                  {/* Third row */}
                  {[10, 11, 12, 13, 14, 15, 16].map((date) => (
                    <button
                      key={date}
                      onClick={() => setSelectedDate(date)}
                      className={`h-10 text-sm rounded-full ${
                        selectedDate === date
                          ? 'bg-green-500 text-white'
                          : 'hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      {date}
                    </button>
                  ))}
                  
                  {/* Fourth row */}
                  {[17, 18, 19, 20, 21, 22, 23].map((date) => (
                    <button
                      key={date}
                      onClick={() => setSelectedDate(date)}
                      className={`h-10 text-sm rounded-full ${
                        selectedDate === date
                          ? 'bg-green-500 text-white'
                          : 'hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      {date}
                    </button>
                  ))}
                </div>
              </div>

              {/* Time Display */}
              <div className="bg-green-500 text-white p-4 rounded-lg mb-4">
                <div className="text-center">
                  <div className="text-2xl font-bold mb-2">07 : 55</div>
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div className="bg-green-400 rounded px-2 py-1">08</div>
                    <div className="text-center">:</div>
                    <div className="bg-green-400 rounded px-2 py-1">00</div>
                    <div className="bg-green-400 rounded px-2 py-1">AM</div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-sm mt-1">
                    <div className="bg-green-400 rounded px-2 py-1">09</div>
                    <div className="text-center"></div>
                    <div className="bg-green-400 rounded px-2 py-1">05</div>
                    <div className="bg-green-400 rounded px-2 py-1">PM</div>
                  </div>
                </div>
              </div>

              {/* Time Selector and Schedule Button */}
              <div className="flex gap-3">
                <div className="flex-1 relative">
                  <select
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 appearance-none bg-white"
                  >
                    <option value="12:45 am">12:45 am</option>
                    <option value="1:00 am">1:00 am</option>
                    <option value="2:00 am">2:00 am</option>
                    <option value="8:00 am">8:00 am</option>
                    <option value="9:00 am">9:00 am</option>
                    <option value="10:00 am">10:00 am</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
                <button
                  onClick={handleScheduleConfirm}
                  className="bg-green-500 text-white px-6 py-3 rounded-full font-medium"
                >
                  Schedule
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AnimatedPage>
  );
};

export default CheckoutScreen;