import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// FIX: Added Bell icon to imports.
import { Search, SlidersHorizontal, MapPin, Star, Fuel, Bell, LogOut } from 'lucide-react';
import { Station } from '../types';
import { apiGetStations } from '../services/api';
import { useAppContext } from '../App';
import LottieAnimation from '../components/LottieAnimation';
import FuelMap from '../components/FuelMap';
import loadingAnimation from '../assets/animations/loading.json';
import tulisanPng from '../tulisan.png';
import AnimatedPage from '../components/AnimatedPage';

// FIX: Changed Station prop type to match what apiGetStations returns.
const StationCard = ({ station }: { station: any }) => {
  const navigate = useNavigate();
  return (
    <div className="bg-light-card dark:bg-dark-card rounded-2xl shadow-lg p-4 md:p-5 flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
      <img src={station.imageUrl} alt={station.name} className="w-full sm:w-24 h-32 sm:h-24 md:w-28 md:h-28 object-cover rounded-xl" />
      <div className="flex-grow flex flex-col justify-between">
        <h3 className="text-lg md:text-xl font-bold">{station.name}</h3>
        <div className="text-sm md:text-base space-y-1 text-gray-500 dark:text-gray-400">
          <div className="flex items-center"><Fuel size={16} className="mr-2 text-primary" /> Fuel Price: <span className="font-semibold text-light-text dark:text-dark-text ml-auto">{Number.isNaN(station.fuelPrices.regular) ? 'N/A' : `$${station.fuelPrices.regular.toFixed(2)}`}</span></div>
          <div className="flex items-center"><MapPin size={16} className="mr-2 text-primary" /> Distance: <span className="font-semibold text-light-text dark:text-dark-text ml-auto">{station.distance}</span></div>
          <div className="flex items-center"><Star size={16} className="mr-2 text-yellow-400" /> Reviews: <span className="font-semibold text-light-text dark:text-dark-text ml-auto">{station.rating > 0 ? `${station.rating} (${station.reviewCount} reviews)` : 'N/A'}</span></div>
        </div>
        <button onClick={() => navigate(`/station/${station.id}`)} className="mt-2 w-full bg-primary text-white py-2.5 md:py-3 rounded-full text-sm md:text-base font-semibold hover:bg-primary-dark transition-all active:scale-95 shadow hover:shadow-lg ripple">
          Select Station
        </button>
      </div>
    </div>
  );
};

const HomeScreen = () => {
  const { user, logout } = useAppContext();
  // FIX: Changed stations state to hold the partial station type returned by the api.
  const [stations, setStations] = useState<Omit<Station, 'groceries' | 'fuelFriends'>[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [userLocation, setUserLocation] = useState<{ lat: number, lon: number } | null>(null);

  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  // Function to get user's IP-based location
  const getUserLocationByIP = async () => {
    try {
      const response = await fetch('https://api.iplocation.net/?ip=');
      const data = await response.json();
      
      if (data.latitude && data.longitude) {
        return {
          lat: parseFloat(data.latitude),
          lon: parseFloat(data.longitude)
        };
      }
    } catch (err) {
      console.error('Failed to get location by IP:', err);
    }
    return null;
  };

  useEffect(() => {
    const fetchStations = async () => {
      if (!userLocation) {
        return;
      }

      setIsLoading(true);
      setError('');

      try {
        const data = await apiGetStations(userLocation.lat, userLocation.lon);
        setStations(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStations();
  }, [userLocation]); // This will re-run when userLocation changes

  useEffect(() => {
    const initializeLocation = async () => {
      // First try to get location from browser geolocation
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = { lat: position.coords.latitude, lon: position.coords.longitude };
          setUserLocation(location);
        },
        async (error) => {
          console.log('Geolocation error:', error);
          // If geolocation fails, try IP-based location
          const ipLocation = await getUserLocationByIP();
          if (ipLocation) {
            setUserLocation(ipLocation);
          } else {
            // Fallback to Jakarta coordinates
            const defaultLocation = { lat: -6.200000, lon: 106.816666 };
            setError('Using default location (Jakarta)');
            setUserLocation(defaultLocation);
          }
        },
        { enableHighAccuracy: true, maximumAge: 10000, timeout: 10000 }
      );
    };

    initializeLocation();
  }, []);

  const handleStationSelect = (station: Omit<Station, 'groceries' | 'fuelFriends'>) => {
    navigate(`/station/${station.id}`);
  };

  return (
    <AnimatedPage>
      <div className="h-full w-full flex flex-col bg-gray-50 dark:bg-gray-900 overflow-hidden">
        {/* Branding - Hidden on small mobile to save space, visible on slightly larger screens */}
        <div className="hidden sm:flex justify-center p-2 md:p-6 pt-6">
          <img src={tulisanPng} alt="FuelFriendly" className="h-8 md:h-12 object-contain max-w-full" />
        </div>

        <header className="p-3 md:p-6 space-y-3 bg-light-bg dark:bg-dark-bg sticky top-0 z-10 shadow-sm">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2 md:space-x-3">
              <img src={user?.avatarUrl} alt="User Avatar" className="w-8 h-8 md:w-12 md:h-12 rounded-full" />
              <div className="flex flex-col">
                <span className="text-xs text-gray-500 font-medium">Welcome back,</span>
                <span className="text-sm font-bold text-gray-800 dark:text-white leading-tight">{user?.fullName?.split(' ')[0] || 'User'}</span>
              </div>
            </div>
            <button onClick={logout} className="p-2 md:p-3 rounded-full hover:bg-gray-100 dark:hover:bg-dark-card mr-2" title="Sign Out">
              <LogOut size={20} className="md:w-6 md:h-6 text-gray-500" />
            </button>
            <button className="p-2 md:p-3 rounded-full hover:bg-gray-100 dark:hover:bg-dark-card relative">
              <Bell size={20} className="md:w-6 md:h-6" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 md:top-2.5 md:right-2.5 md:w-2.5 md:h-2.5 bg-red-500 rounded-full"></span>
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              {isLoading && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
              <input
                type="text"
                placeholder="Search city..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={async (e) => {
                  if (e.key === 'Enter' && query.trim()) {
                    try {
                      setIsLoading(true);
                      setError('');
                      const base = (import.meta as any).env?.VITE_API_BASE_URL;
                      const url = base ? `${base}/api/geocode?q=${encodeURIComponent(query.trim())}` : `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(query.trim())}`;
                      const res = await fetch(url, { headers: base ? {} : { 'User-Agent': 'fuelfriendly' } });
                      if (!res.ok) throw new Error('Failed to geocode');
                      const data = base ? await res.json() : await res.json();
                      let lat: number, lon: number;
                      if (base) {
                        lat = data.lat; lon = data.lon;
                      } else {
                        const item = Array.isArray(data) && data.length ? data[0] : null;
                        if (!item) throw new Error('Place not found');
                        lat = parseFloat(item.lat); lon = parseFloat(item.lon);
                      }
                      setUserLocation({ lat, lon });
                    } catch (err: any) {
                      setError(err.message || 'Search failed');
                    } finally {
                      setIsLoading(false);
                    }
                  }
                }}
                className="w-full pl-9 pr-9 py-2 md:py-4 rounded-full border border-gray-300 dark:border-gray-600 bg-transparent focus:outline-none focus:ring-2 focus:ring-primary transition-all text-sm"
              />
            </div>
            <button className="p-2 md:p-4 bg-light-card dark:bg-dark-card rounded-full shadow transition-transform active:scale-95 hover:shadow-lg ripple">
              <SlidersHorizontal size={18} className="md:w-6 md:h-6" />
            </button>
          </div>
        </header>

        {/* Map Area - Fixed height relative to viewport height */}
        <div className="w-full flex-shrink-0 relative overflow-hidden h-[35vh] md:h-[45vh]">
          <div className="h-full w-full bg-gray-300 dark:bg-gray-700 shadow-inner">
            {isLoading ? (
              <div className="flex justify-center items-center h-full">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : error ? (
              <div className="flex justify-center items-center h-full">
                <p className="text-center text-red-500 text-sm md:text-base px-4 md:px-6">{error}</p>
              </div>
            ) : (
              <FuelMap
                stations={stations}
                userLocation={userLocation}
                onStationSelect={handleStationSelect}
              />
            )}
          </div>
        </div>

        {/* List Area - Fills remaining space */}
        <div className="flex-grow overflow-y-auto bg-gray-50 dark:bg-gray-900 px-4 md:px-6 py-2">
          <div className="sticky top-0 bg-gray-50 dark:bg-gray-900 py-2 z-10 mb-2">
            <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-2 md:hidden"></div>
            <h2 className="text-lg md:text-2xl font-bold">Fuel Stations Nearby</h2>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : error ? (
            <div className="text-center text-red-500 p-4">
              <p className="text-sm">{error}</p>
              <button
                onClick={() => {
                  setIsLoading(true);
                  setError('');
                  if (userLocation) {
                    apiGetStations(userLocation.lat, userLocation.lon)
                      .then(data => {
                        setStations(data);
                        setIsLoading(false);
                      })
                      .catch(err => {
                        setError(err.message);
                        setIsLoading(false);
                      });
                  }
                }}
                className="mt-2 px-4 py-1.5 bg-primary text-white rounded-full text-xs font-semibold ripple"
              >
                Retry
              </button>
            </div>
          ) : (
            <div className="space-y-3 pb-20">
              {stations.length === 0 ? (
                <div className="flex flex-col items-center mt-4">
                  <p className="text-center text-gray-500 text-sm">No nearby stations found</p>
                </div>
              ) : (
                stations.map((station) => (
                  <div key={station.id}>
                    <StationCard station={station} />
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </AnimatedPage>
  );
};

export default HomeScreen;