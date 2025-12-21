import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, SlidersHorizontal, MapPin, Star, Fuel, Mic, Plus, Minus } from 'lucide-react';
import { Station } from '../types';
import { apiGetStations } from '../services/api';
import { useAppContext } from '../App';
import MapboxMap from '../components/MapboxMap';
import AnimatedPage from '../components/AnimatedPage';

// Status Bar Component
const StatusBar = () => (
  <div className="flex justify-between items-center px-4 py-2 bg-white">
    <span className="text-black font-semibold text-base tracking-tight">8:45</span>
    <div className="flex items-center gap-1">
      <div className="w-[18px] h-3 bg-black rounded-sm"></div>
      <div className="w-[17px] h-3 bg-black rounded-sm"></div>
      <div className="flex items-center">
        <div className="w-6 h-3 border-2 border-black rounded bg-white"></div>
        <div className="w-[1.4px] h-1 bg-black rounded-r"></div>
        <span className="absolute text-white text-[10px] font-bold ml-1">100%</span>
      </div>
    </div>
  </div>
);

// Station Card Component
const StationCard = ({ station, index }: { station: any; index: number }) => {
  const navigate = useNavigate();
  const imageUrl = index === 0 ? '/image-card-1.png' : '/image-card-2.png';
  
  return (
    <div className="bg-white rounded-2xl shadow-lg p-0 flex">
      <div className="w-[118px] h-[183px] p-2">
        <img 
          src={imageUrl} 
          alt={station.name} 
          className="w-[102px] h-[164px] object-cover rounded-lg"
          onError={(e) => {
            e.currentTarget.src = `https://source.unsplash.com/300x300/?gas-station,${station.name}`;
          }}
        />
      </div>
      <div className="flex-1 p-2">
        <div className="p-2">
          <h3 className="text-base font-semibold text-[#3F4249] mb-2">{station.name}</h3>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Fuel size={20} className="text-[#3AC36C]" />
                <span className="text-sm text-[#3F4249]">Fuel Price</span>
              </div>
              <span className="text-base font-semibold text-[#3F4249]">$36.67</span>
            </div>
            
            <div className="flex items-center gap-2">
              <MapPin size={20} className="text-[#FF5630]" />
              <span className="text-sm text-[#3F4249] flex-1">{station.address || 'Nearby'}</span>
              <span className="text-sm text-[#3F4249]">{station.distance}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Star size={20} className="text-[#FFC107] fill-current" />
              <span className="text-sm text-[#3F4249] flex-1">Reviews</span>
              <span className="text-sm text-[#3F4249]">4.6</span>
              <span className="text-xs text-[#3F4249]">(24 Reviews)</span>
            </div>
          </div>
          
          <button 
            onClick={() => navigate(`/station/${station.id}`)}
            className="w-full bg-[#3AC36C] text-white py-2 px-4 rounded-full text-sm font-bold mt-4 hover:bg-[#2ea85a] transition-colors"
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
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [userLocation, setUserLocation] = useState<{ lat: number, lon: number } | null>(null);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

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
      <div className="min-h-screen bg-white flex flex-col">
        {/* Status Bar */}
        <StatusBar />
        
        {/* Header */}
        <div className="flex justify-between items-center px-4 py-3">
          <div className="flex items-center gap-3">
            <img 
              src="/avatar.png" 
              alt="Avatar" 
              className="w-7 h-7 rounded-full"
              onError={(e) => {
                e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='28' viewBox='0 0 28 28'%3E%3Ccircle cx='14' cy='14' r='14' fill='%23e5e7eb'/%3E%3C/svg%3E";
              }}
            />
            <img 
              src="/tulisan.png" 
              alt="FuelFriendly" 
              className="h-6"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
          <img 
            src="/ring.png" 
            alt="Notifications" 
            className="w-7 h-7"
            onError={(e) => {
              e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='28' viewBox='0 0 24 24' fill='none' stroke='%233F4249' stroke-width='2'%3E%3Cpath d='M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9'/%3E%3Cpath d='M10.3 21a1.94 1.94 0 0 0 3.4 0'/%3E%3C/svg%3E";
            }}
          />
        </div>

        {/* Search Bar */}
        <div className="px-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="flex-1 flex items-center bg-white border border-gray-400 rounded-full px-4 py-3">
              <Search size={20} className="text-[#3F4249] mr-2" />
              <input
                type="text"
                placeholder="Search for fuel and groceries"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 outline-none text-base text-gray-500 font-['Poppins']"
              />
              <Mic size={20} className="text-[#3F4249] ml-2" />
            </div>
            <button className="w-12 h-12 bg-[#E3FFEE] border border-gray-400 rounded-full flex items-center justify-center">
              <SlidersHorizontal size={24} className="text-[#3F4249] rotate-180" />
            </button>
          </div>
        </div>

        {/* Map */}
        <div className="mx-4 mb-4 relative">
          <div className="h-[420px] rounded-2xl overflow-hidden border-2 border-[#3F4249]">
            <MapboxMap
              stations={stations}
              userLocation={userLocation}
              onStationSelect={(station) => navigate(`/station/${station.id}`)}
            />
          </div>
          
          {/* Map Controls */}
          <div className="absolute right-4 bottom-16 flex flex-col gap-4">
            <button className="w-7 h-7 bg-[#3AC36C] rounded-sm shadow-lg flex items-center justify-center">
              <Plus size={16} className="text-white" />
            </button>
            <button className="w-7 h-7 bg-[#3AC36C] rounded-sm shadow-lg flex items-center justify-center">
              <Minus size={16} className="text-white" />
            </button>
          </div>
        </div>

        {/* Fuel Stations List */}
        <div className="px-4 flex-1">
          <h2 className="text-xl font-semibold text-[#3F4249] font-['Poppins'] mb-4">Fuel Station nearby</h2>
          
          <div className="space-y-4 pb-24">
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="w-8 h-8 border-4 border-[#3AC36C] border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : error ? (
              <div className="text-center text-red-500 py-8">
                <p>{error}</p>
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