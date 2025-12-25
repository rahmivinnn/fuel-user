import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// Set Mapbox access token from environment variable
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN || 'pk.eyJ1IjoidmluYTk4IiwiYSI6ImNtN3I3eDF6ZTB2OW0yam9kdzFxdndhdTkifQ.HNqbNgBUAoBPYmoAMISdaw';

interface MapboxMapProps {
  stations: any[];
  userLocation: { lat: number; lon: number } | null;
  onStationSelect: (station: any) => void;
}

const MapboxMap: React.FC<MapboxMapProps> = ({ stations, userLocation, onStationSelect }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);

  useEffect(() => {
    if (!mapContainer.current || !userLocation) return;

    // Initialize map
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [userLocation.lon, userLocation.lat],
      zoom: 12,
      attributionControl: false
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, [userLocation]);

  useEffect(() => {
    if (!map.current || !userLocation) return;

    // Clear existing markers
    markers.current.forEach(marker => marker.remove());
    markers.current = [];

    // Add user location marker (Me)
    const userMarkerEl = document.createElement('div');
    userMarkerEl.className = 'user-marker';
    userMarkerEl.innerHTML = `
      <div style="
        width: 30px;
        height: 34px;
        background: #10B981;
        border: 1px solid #FFFEFE;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
      ">
        <div style="
          width: 6px;
          height: 6px;
          background: #3AC36C;
          border-radius: 50%;
          transform: rotate(45deg);
        "></div>
      </div>
      <div style="
        position: absolute;
        top: 40px;
        left: 50%;
        transform: translateX(-50%);
        background: white;
        padding: 2px 8px;
        border-radius: 4px;
        font-size: 12px;
        font-weight: 600;
        color: #3F4249;
        white-space: nowrap;
        box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
      ">Me</div>
    `;

    const userMarker = new mapboxgl.Marker(userMarkerEl)
      .setLngLat([userLocation.lon, userLocation.lat])
      .addTo(map.current);
    
    markers.current.push(userMarker);

    // Add station markers
    stations.forEach((station) => {
      const stationLat = station.lat || userLocation.lat + (Math.random() - 0.5) * 0.02;
      const stationLon = station.lon || userLocation.lon + (Math.random() - 0.5) * 0.02;

      const markerEl = document.createElement('div');
      markerEl.className = 'station-marker';
      markerEl.innerHTML = `
        <div style="
          width: 30px;
          height: 34px;
          background: #EF4444;
          border: 1px solid #FFFFFF;
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        ">
          <div style="
            width: 12px;
            height: 12px;
            background: #FFFFFF;
            border-radius: 2px;
            transform: rotate(45deg);
          "></div>
        </div>
        <div style="
          position: absolute;
          top: 40px;
          left: 50%;
          transform: translateX(-50%);
          background: white;
          padding: 2px 8px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 500;
          color: #606268;
          white-space: nowrap;
          box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
        ">Fuel station</div>
      `;

      markerEl.addEventListener('click', () => {
        onStationSelect(station);
      });

      const marker = new mapboxgl.Marker(markerEl)
        .setLngLat([stationLon, stationLat])
        .addTo(map.current!);
      
      markers.current.push(marker);
    });

  }, [stations, userLocation, onStationSelect]);

  return (
    <div 
      ref={mapContainer} 
      className="w-full h-full"
      style={{ minHeight: '420px' }}
    />
  );
};

export default MapboxMap;