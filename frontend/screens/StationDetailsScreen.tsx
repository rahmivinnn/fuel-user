import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, MapPin, Clock, Star, Plus, Minus, Trash2 } from 'lucide-react';
import { Station } from '../types';
import { apiGetStationDetails } from '../services/api';
import AnimatedPage from '../components/AnimatedPage';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface FuelFriend {
  id: string;
  name: string;
  price: number;
  location: string;
  rating: number;
  reviews: number;
  avatar: string;
}

const StationDetailsScreen = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [station, setStation] = useState<Station | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedFuelFriend, setSelectedFuelFriend] = useState<FuelFriend | null>(null);

  // Check if fuel friend was selected from FuelFriendDetailsScreen
  useEffect(() => {
    if (location.state?.selectedFuelFriend) {
      setSelectedFuelFriend(location.state.selectedFuelFriend);
    }
    // Restore cart from location state if available
    if (location.state?.cartItems) {
      setCart(location.state.cartItems);
    }
  }, [location.state]);

  // ✅ Use groceries and fuel friends from API response
  const groceries = station?.groceries || [];
  const fuelFriends = station?.fuelFriends || [];

  useEffect(() => {
    const fetchStationDetails = async () => {
      if (!id) return;
      
      setIsLoading(true);
      try {
        const data = await apiGetStationDetails(id);
        setStation(data);
      } catch (err: any) {
        setError(err.message);
        // Mock data with station type variations
        const stationTypes = [
          { name: 'TurboFuel Express', tag: '24/7', description: 'EcoFuel Express is committed to providing high-quality fuel at competitive prices. Conveniently located at 1234 Energy Drive, Houston, TX 77002, we ensure a seamless refueling experience with our state-of-the-art pumps and quick service.' },
          { name: 'EcoFuel Station', tag: 'ECO', description: 'Premium eco-friendly fuel station dedicated to sustainable energy solutions. Our green technology ensures cleaner fuel delivery with minimal environmental impact.' },
          { name: 'QuickStop Fuel', tag: 'FAST', description: 'Fast and efficient fuel service designed for busy customers. Get quality fuel quickly with our express service lanes and automated systems.' },
          { name: 'Premium Fuel Hub', tag: 'VIP', description: 'Luxury fuel experience with premium services. Enjoy VIP treatment with our concierge fuel delivery and premium grade fuels.' }
        ];
        
        const stationIndex = parseInt(id?.replace(/\D/g, '') || '0') % stationTypes.length;
        const stationType = stationTypes[stationIndex];
        
        setStation({
          id: id,
          name: stationType.name,
          address: 'Abcd Tennessee',
          distance: '2.7 miles away',
          deliveryTime: '30 minutes',
          rating: 4.7,
          reviews: 146,
          image: '/brand1.png',
          description: stationType.description,
          fuelPrices: {
            regular: 1.23,
            premium: 1.75,
            diesel: 2.14
          },
          groceries: [],
          fuelFriends: []
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchStationDetails();
  }, [id]);

  const updateCartQuantity = (itemId: string, change: number) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === itemId);
      
      if (existingItem) {
        if (existingItem.quantity + change <= 0) {
          return prevCart.filter(item => item.id !== itemId);
        }
        return prevCart.map(item => 
          item.id === itemId 
            ? { ...item, quantity: item.quantity + change }
            : item
        );
      } else if (change > 0) {
        const grocery = groceries.find(g => g.id === itemId);
        if (grocery) {
          return [...prevCart, {
            id: itemId,
            name: grocery.name,
            price: grocery.price,
            quantity: 1,
            image: grocery.image
          }];
        }
      }
      
      return prevCart;
    });
  };

  const getItemQuantity = (itemId: string) => {
    const item = cart.find(item => item.id === itemId);
    return item ? item.quantity : 0;
  };

  const removeFromCart = (itemId: string) => {
    setCart(prevCart => prevCart.filter(item => item.id !== itemId));
  };

  if (isLoading) {
    return (
      <AnimatedPage>
        <div className="flex justify-center items-center min-h-screen">
          <div className="w-8 h-8 border-4 border-[#3AC36C] border-t-transparent rounded-full animate-spin"></div>
        </div>
      </AnimatedPage>
    );
  }

  if (error && !station) {
    return (
      <AnimatedPage>
        <div className="flex justify-center items-center min-h-screen">
          <p className="text-red-500">{error}</p>
        </div>
      </AnimatedPage>
    );
  }

  return (
    <AnimatedPage>
      <div className="bg-white min-h-screen pb-24">
        {/* Header */}
        <div className="relative">
          <div className="h-48 bg-gradient-to-r from-orange-400 to-pink-400 relative overflow-hidden">
            <img 
              src="/image-card-1.png" 
              alt="Station" 
              className="w-full h-full object-cover"
            />
            <button
              onClick={() => navigate('/home')}
              className="absolute top-4 left-4 p-2 bg-white/80 rounded-full"
            >
              <img src="/Back.png" alt="Back" className="w-5 h-5" />
            </button>
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
              <h1 className="text-lg font-semibold text-white">Station Details</h1>
            </div>
          </div>
          
          {/* Station Logo */}
          <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
            <div className="w-16 h-16 bg-white rounded-full p-2 shadow-lg">
              <img 
                src={station?.image || '/brand1.png'} 
                alt={station?.name} 
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.currentTarget.src = '/brand1.png';
                }}
              />
            </div>
          </div>
        </div>

        {/* Station Info */}
        <div className="px-4 pt-12 pb-6 text-center">
          <h1 className="text-xl font-semibold text-gray-900 mb-2">{station?.name}</h1>
          <div className="flex items-center justify-center text-gray-600 mb-4">
            <MapPin className="w-4 h-4 mr-1 text-red-500" />
            <span className="text-sm">{station?.address}</span>
          </div>
          
          {/* About Section */}
          {station?.description && (
            <div className="mt-6 text-left">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">About</h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                {station.description}
              </p>
            </div>
          )}
        </div>

        {/* Fuel Prices */}
        <div className="mx-4 mb-6">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 text-center">Fuel Prices</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-700">Regular</span>
                <span className="font-semibold">${station?.fuelPrices?.regular} per liter</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-700">Premium</span>
                <span className="font-semibold">${station?.fuelPrices?.premium} per liter</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-700">Diesel</span>
                <span className="font-semibold">${station?.fuelPrices?.diesel} per liter</span>
              </div>
            </div>
          </div>
        </div>

        {/* Station Stats */}
        <div className="px-4 mb-6 space-y-2">
          <div className="flex items-center text-gray-600">
            <MapPin className="w-4 h-4 mr-2 text-red-500" />
            <span className="text-sm">Distance: {station?.distance}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <Clock className="w-4 h-4 mr-2 text-gray-500" />
            <span className="text-sm">Average Delivery time: {station?.deliveryTime}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center text-gray-600">
              <Star className="w-4 h-4 mr-2 text-yellow-500 fill-current" />
              <span className="text-sm">{station?.rating} Rating </span>
              <span className="text-sm text-green-600">({station?.reviews} reviews)</span>
            </div>
            <button 
              onClick={() => navigate(`/station/${id}/reviews`)}
              className="text-green-600 text-sm font-medium hover:underline"
            >
              See all reviews
            </button>
          </div>
        </div>

        {/* Groceries */}
        <div className="px-4 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Groceries</h2>
            <button className="text-green-600 text-sm font-medium">See all</button>
          </div>
          {isLoading ? (
            /* Groceries Skeleton */
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg animate-pulse">
                  <div className="w-12 h-12 bg-gray-300 rounded-lg"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                  </div>
                  <div className="w-16 h-8 bg-gray-300 rounded-full"></div>
                </div>
              ))}
            </div>
          ) : groceries.length > 0 ? (
            <div className="space-y-3">
              {groceries.map((item) => {
                const quantity = getItemQuantity(item.id);
                return (
                  <div key={item.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <img 
                      src={item.image || '/image-card-1.png'} 
                      alt={item.name} 
                      className="w-12 h-12 object-cover rounded-lg"
                      onError={(e) => {
                        e.currentTarget.src = '/image-card-1.png';
                      }}
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{item.name}</h3>
                      <p className="text-sm text-gray-600">${item.price}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {quantity > 0 ? (
                        <>
                          <button
                            onClick={() => updateCartQuantity(item.id, -1)}
                            className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-8 text-center font-medium">{quantity}</span>
                          <button
                            onClick={() => updateCartQuantity(item.id, 1)}
                            className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center ml-2"
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => updateCartQuantity(item.id, 1)}
                          className="bg-green-500 text-white px-4 py-2 rounded-full text-sm font-medium"
                        >
                          Add
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No groceries available at this station</p>
            </div>
          )}
        </div>

        {/* Fuel Friends */}
        <div className="px-4 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Select Fuel friend</h2>
            <button className="text-green-600 text-sm font-medium">See all</button>
          </div>
          
          {selectedFuelFriend ? (
            /* Selected Fuel Friend Display */
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <img 
                      src={selectedFuelFriend.profilePhoto || '/avatar.png'} 
                      alt={selectedFuelFriend.fullName} 
                      className="w-12 h-12 rounded-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = '/avatar.png';
                      }}
                    />
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{selectedFuelFriend.fullName}</h3>
                    <p className="text-sm text-gray-600">${selectedFuelFriend.deliveryFee}</p>
                    <div className="flex items-center space-x-1">
                      <Star className="w-3 h-3 text-yellow-500 fill-current" />
                      <span className="text-xs text-gray-600">{selectedFuelFriend.rating}</span>
                      <span className="text-xs text-green-600 font-medium">Selected</span>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedFuelFriend(null)}
                  className="text-red-500 text-sm font-medium"
                >
                  Remove
                </button>
              </div>
            </div>
          ) : isLoading ? (
            /* Fuel Friends Skeleton */
            <div className="grid grid-cols-2 gap-3 mb-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-gray-50 rounded-lg p-3 animate-pulse">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                    <div className="flex-1">
                      <div className="h-3 bg-gray-300 rounded w-3/4 mb-1"></div>
                      <div className="h-2 bg-gray-300 rounded w-1/2"></div>
                    </div>
                  </div>
                  <div className="h-2 bg-gray-300 rounded w-2/3 mb-2"></div>
                  <div className="h-2 bg-gray-300 rounded w-1/2 mb-3"></div>
                  <div className="h-8 bg-gray-300 rounded-full"></div>
                </div>
              ))}
            </div>
          ) : (
            /* Fuel Friends Grid */
            <div className="grid grid-cols-2 gap-3 mb-4">
              {fuelFriends.length > 0 ? (
                fuelFriends.slice(0, 4).map((friend) => (
                  <div key={friend.id} className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center space-x-2 mb-2">
                      <img 
                        src={friend.profilePhoto || '/avatar.png'} 
                        alt={friend.fullName} 
                        className="w-8 h-8 rounded-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = '/avatar.png';
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <button
                        onClick={() => navigate(`/fuel-friend/${friend.id}`, {
                          state: { 
                            cartItems: cart,
                            stationId: id 
                          }
                        })}
                        className="text-sm font-medium text-gray-900 truncate hover:text-green-600 transition-colors text-left"
                      >
                        {friend.fullName}
                      </button>
                        <p className="text-xs text-gray-600">${friend.deliveryFee}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1 mb-2">
                      <MapPin className="w-3 h-3 text-red-500" />
                      <span className="text-xs text-gray-600">{friend.location}</span>
                    </div>
                    <div className="flex items-center space-x-1 mb-3">
                      <Star className="w-3 h-3 text-yellow-500 fill-current" />
                      <span className="text-xs text-gray-600">{friend.rating || 'N/A'}</span>
                      <span className="text-xs text-green-600">({friend.totalReviews || 0} reviews)</span>
                    </div>
                    <button 
                      onClick={() => setSelectedFuelFriend(friend)}
                      className="w-full bg-green-500 text-white py-2 rounded-full text-sm font-medium hover:bg-green-600 transition-colors"
                    >
                      Select
                    </button>
                  </div>
                ))
              ) : (
                <div className="col-span-2 text-center py-8 text-gray-500">
                  <p>No fuel friends available at this station</p>
                </div>
              )}
            </div>
          )}
          
          {!selectedFuelFriend && fuelFriends.length > 0 ? (
            <button className="w-full text-green-600 text-sm font-medium py-2">
              View More ({fuelFriends.length} total)
            </button>
          ) : null}
        </div>

        {/* Order Now Button */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200">
          <button 
            onClick={() => navigate('/checkout', { 
              state: { 
                station: station,
                cartItems: cart,
                selectedFuelFriend: selectedFuelFriend,
                totalItems: cart.length + (selectedFuelFriend ? 1 : 0)
              } 
            })}
            className="w-full bg-green-500 text-white py-4 rounded-full text-lg font-semibold"
          >
            Order Now {cart.length > 0 || selectedFuelFriend ? `(${cart.length + (selectedFuelFriend ? 1 : 0)} items)` : ''}
          </button>
        </div>
      </div>
    </AnimatedPage>
  );
};

export default StationDetailsScreen;