import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, SlidersHorizontal, MapPin, Star, Fuel, Mic, Plus, Minus } from 'lucide-react';
import { Station } from '../types';
import { apiGetStations } from '../services/api';
import { useAppContext } from '../App';
import MapboxMap from '../components/MapboxMap';
import AnimatedPage from '../components/AnimatedPage';

// Station Card Component
const StationCard = ({ station, index }: { station: any; index: number }) => {
  const navigate = useNavigate();
  const imageUrl = index % 2 === 0 ? '/image-card-1.png' : '/image-card-2.png';
  
  // Station types with different characteristics
  const stationTypes = [
    { name: 'TurboFuel Express', tag: '24/7', color: 'bg-blue-600' },
    { name: 'EcoFuel Station', tag: 'ECO', color: 'bg-green-600' },
    { name: 'QuickStop Fuel', tag: 'FAST', color: 'bg-orange-600' },
    { name: 'Premium Fuel Hub', tag: 'VIP', color: 'bg-purple-600' }
  ];
  
  const stationType = stationTypes[index % stationTypes.length];
  
  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-0 flex flex-col sm:flex-row hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
      <div className="w-full sm:w-[118px] h-[200px] sm:h-[183px] p-2 relative">
        <img 
          src={station.image || imageUrl} 
          alt={station.name} 
          className="w-full sm:w-[102px] h-full sm:h-[164px] object-cover rounded-lg shadow-md"
          onError={(e) => {
            e.currentTarget.src = imageUrl;
          }}
        />
        {/* Station Type Tag */}
        <div className={`absolute top-3 right-3 ${stationType.color} text-white px-2 py-1 rounded-full text-xs font-bold`}>
          {stationType.tag}
        </div>
      </div>
      <div className="flex-1 p-2">
        <div className="p-2">
          <h3 className="text-base font-bold text-[#3F4249] mb-3">{stationType.name}</h3>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Fuel size={20} className="text-[#3AC36C]" />
                <span className="text-sm font-medium text-[#3F4249]">Fuel Price</span>
              </div>
              <span className="text-sm sm:text-base font-bold text-[#3F4249]">
                ${station.regularPrice || '36.67'}
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <MapPin size={20} className="text-[#FF5630]" />
              <span className="text-sm font-medium text-[#3F4249] flex-1 truncate">
                Distance: {station.distance || '2.7 miles away'}
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-yellow-100 flex items-center justify-center">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              </div>
              <span className="text-sm font-medium text-[#3F4249] flex-1">
                Average Delivery time: 30 minutes
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <Star size={20} className="text-[#FFC107] fill-current" />
              <span className="text-sm font-bold text-[#3F4249]">{station.rating || '4.7'} Rating</span>
              <span className="text-xs text-[#3AC36C]">({station.totalReviews || 146} reviews)</span>
            </div>
          </div>
          
          <button 
            onClick={() => navigate(`/station/${station.id}`)}
            className="w-full bg-[#3AC36C] text-white py-3 px-4 rounded-full text-sm font-bold mt-4 hover:bg-[#2ea85a] transition-all duration-200 active:scale-95 shadow-lg hover:shadow-xl"
          >
            Select Station
          </button>
        </div>
      </div>
    </div>
  );
};

const HomeScreen = () => {
  const { user, logout } = useAppContext();
  const [stations, setStations] = useState<Omit<Station, 'groceries' | 'fuelFriends'>[]>([]);
  const [allStations, setAllStations] = useState<Omit<Station, 'groceries' | 'fuelFriends'>[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [userLocation, setUserLocation] = useState<{ lat: number, lon: number } | null>(null);
  const [query, setQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    fuelType: '',
    priceRange: '',
    distance: '',
    rating: ''
  });
  const navigate = useNavigate();

  // Voice search functionality
  const startVoiceSearch = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Voice search not supported in this browser');
      return;
    }

    const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    setIsListening(true);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setQuery(transcript);
      setIsListening(false);
    };

    recognition.onerror = () => {
      setIsListening(false);
      alert('Voice search failed. Please try again.');
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  // Filter stations based on search query and filters
  const filterStations = (searchQuery: string, currentFilters = filters) => {
    let filtered = [...allStations];

    // Text search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(station => 
        station.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (station.address && station.address.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Fuel type filter
    if (currentFilters.fuelType) {
      filtered = filtered.filter(station => {
        // Assuming station has fuel types available
        return true; // Placeholder - adjust based on your data structure
      });
    }

    // Price range filter
    if (currentFilters.priceRange) {
      filtered = filtered.filter(station => {
        const price = station.regularPrice || 0;
        switch (currentFilters.priceRange) {
          case 'low': return price < 30;
          case 'medium': return price >= 30 && price < 40;
          case 'high': return price >= 40;
          default: return true;
        }
      });
    }

    // Distance filter (assuming you have distance calculation)
    if (currentFilters.distance) {
      filtered = filtered.filter(station => {
        // Placeholder - implement distance calculation
        return true;
      });
    }

    // Rating filter
    if (currentFilters.rating) {
      const minRating = parseFloat(currentFilters.rating);
      filtered = filtered.filter(station => 
        (station.rating || 0) >= minRating
      );
    }

    setStations(filtered);
  };

  // Handle filter changes
  const handleFilterChange = (filterType: string, value: string) => {
    const newFilters = { ...filters, [filterType]: value };
    setFilters(newFilters);
    filterStations(query, newFilters);
  };

  // Clear all filters
  const clearFilters = () => {
    const emptyFilters = { fuelType: '', priceRange: '', distance: '', rating: '' };
    setFilters(emptyFilters);
    filterStations(query, emptyFilters);
  };

  // Handle search input change
  const handleSearchChange = (value: string) => {
    setQuery(value);
    filterStations(value, filters);
  };

  // Get user location
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({ lat: position.coords.latitude, lon: position.coords.longitude });
      },
      () => {
        // Fallback to Jakarta
        setUserLocation({ lat: -6.200000, lon: 106.816666 });
      }
    );
  }, []);

  // Fetch stations
  useEffect(() => {
    const fetchStations = async () => {
      if (!userLocation) return;
      
      setIsLoading(true);
      try {
        const data = await apiGetStations(userLocation.lat, userLocation.lon);
        setAllStations(data);
        setStations(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStations();
  }, [userLocation]);

  return (
    <AnimatedPage>
      <div className="bg-white overflow-y-auto min-h-screen overflow-x-hidden" style={{ width: '100vw', maxWidth: '100vw' }}>
        {/* Header & Search Bar */}
        <div className="sticky top-0 bg-white z-10 shadow-sm">
          {/* Status Bar Spacer - blank */}
          <div className="h-[38px] bg-white"></div>
          
          {/* Header - sesuai Figma */}
          <div className="flex justify-between items-center px-4 py-3">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => navigate('/profile')}
                className="w-7 h-7 rounded-full bg-gray-200 overflow-hidden hover:ring-2 hover:ring-[#3AC36C] transition-all duration-200"
              >
                <img 
                  src="/avatar.png" 
                  alt="Avatar" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='28' viewBox='0 0 28 28'%3E%3Ccircle cx='14' cy='14' r='14' fill='%23e5e7eb'/%3E%3Cpath d='M14 7a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM9 20a5 5 0 0 1 10 0H9z' fill='%23999'/%3E%3C/svg%3E";
                  }}
                />
              </button>
              <img 
                src="/tulisan.svg" 
                alt="FuelFriendly" 
                className="h-6"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  // Show text fallback
                  const textElement = e.currentTarget.nextElementSibling;
                  if (textElement) textElement.style.display = 'block';
                }}
              />
              <span className="text-lg font-bold text-[#3AC36C] hidden">FuelFriendly</span>
            </div>
            <button 
              onClick={() => navigate('/notifications')}
              className="w-7 h-7 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors relative"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3F4249" strokeWidth="2">
                <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/>
                <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>
              </svg>
              {/* Notification dot */}
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></div>
            </button>
          </div>
          
          {/* Search Bar */}
          <div className="px-4 pb-3">
            <div className="flex items-center gap-3">
              <div className="flex-1 flex items-center bg-white border border-gray-400 rounded-full px-4 py-3 shadow-sm">
                <Search size={20} className="text-[#3F4249] mr-3 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Search for fuel and groceries"
                  value={query}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="flex-1 outline-none text-base text-gray-600 placeholder-gray-500"
                />
                <button 
                  onClick={startVoiceSearch}
                  className={`ml-3 p-1 hover:bg-gray-100 rounded-full transition-colors ${
                    isListening ? 'bg-red-100 text-red-600' : ''
                  }`}
                  disabled={isListening}
                >
                  <Mic size={20} className={isListening ? 'text-red-600 animate-pulse' : 'text-[#3F4249]'} />
                </button>
              </div>
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className={`w-12 h-12 border border-gray-400 rounded-full flex items-center justify-center transition-colors shadow-sm ${
                  showFilters || Object.values(filters).some(f => f) 
                    ? 'bg-[#3AC36C] text-white' 
                    : 'bg-[#E3FFEE] hover:bg-[#d1f7dd] text-[#3F4249]'
                }`}
              >
                <SlidersHorizontal size={24} className="rotate-180" />
              </button>
            </div>
          </div>
          
          {/* Filter Panel */}
          {showFilters && (
            <div className="px-4 pb-3">
              <div className="bg-gray-50 rounded-2xl p-4 space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-[#3F4249]">Filters</h3>
                  <button 
                    onClick={clearFilters}
                    className="text-sm text-[#3AC36C] hover:underline"
                  >
                    Clear All
                  </button>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#3F4249] mb-2">Price Range</label>
                    <select 
                      value={filters.priceRange}
                      onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                    >
                      <option value="">All Prices</option>
                      <option value="low">Under $30</option>
                      <option value="medium">$30 - $40</option>
                      <option value="high">Above $40</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-[#3F4249] mb-2">Min Rating</label>
                    <select 
                      value={filters.rating}
                      onChange={(e) => handleFilterChange('rating', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                    >
                      <option value="">Any Rating</option>
                      <option value="4">4+ Stars</option>
                      <option value="4.5">4.5+ Stars</option>
                      <option value="5">5 Stars</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Map - sesuai Figma positioning */}
        <div className="px-4 mb-4 relative">
          <div className="h-[420px] rounded-2xl overflow-hidden border-2 border-[#3F4249] relative">
            <MapboxMap
              stations={stations}
              userLocation={userLocation}
              onStationSelect={(station) => navigate(`/station/${station.id}`)}
            />
            
            {/* Map Controls - sesuai Figma */}
            <div className="absolute right-4 bottom-4 flex flex-col gap-2">
              <button className="w-8 h-8 bg-[#3AC36C] rounded-lg shadow-lg flex items-center justify-center hover:bg-[#2ea85a] transition-all duration-200 active:scale-95">
                <Plus size={18} className="text-white" />
              </button>
              <button className="w-8 h-8 bg-[#3AC36C] rounded-lg shadow-lg flex items-center justify-center hover:bg-[#2ea85a] transition-all duration-200 active:scale-95">
                <Minus size={18} className="text-white" />
              </button>
            </div>
            
            {/* Location Controls - sesuai Figma */}
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex flex-col gap-2">
              <button className="w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center border-2 border-gray-200 hover:border-[#3AC36C] transition-all duration-200 active:scale-95">
                <div className="w-3 h-3 bg-[#3AC36C] rounded-sm"></div>
              </button>
              <button className="w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center border-2 border-gray-200 hover:border-[#3AC36C] transition-all duration-200 active:scale-95">
                <MapPin size={16} className="text-[#3AC36C]" />
              </button>
            </div>
          </div>
        </div>

        {/* Fuel Stations List - sesuai Figma */}
        <div className="px-4 pb-28">
          <h2 className="text-xl font-semibold text-[#3F4249] mb-4 sticky top-0 bg-white py-2 z-10">Fuel Station nearby</h2>
          
          <div className="space-y-4 mb-8 max-h-[400px] overflow-y-auto">
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="w-8 h-8 border-4 border-[#3AC36C] border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : error ? (
              <div className="text-center text-red-500 py-8">
                <p>{error}</p>
              </div>
            ) : stations.length === 0 && query ? (
              <div className="text-center text-gray-500 py-8">
                <p>No stations found for "{query}"</p>
                <button 
                  onClick={() => handleSearchChange('')}
                  className="text-[#3AC36C] underline mt-2"
                >
                  Clear search
                </button>
              </div>
            ) : stations.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <p>No stations found</p>
              </div>
            ) : (
              stations.slice(0, 4).map((station, index) => (
                <StationCard key={station.id} station={station} index={index} />
              ))
            )}
          </div>
        </div>
      </div>
    </AnimatedPage>
  );
};

export default HomeScreen;