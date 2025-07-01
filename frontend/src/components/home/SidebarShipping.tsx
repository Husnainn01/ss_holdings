'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Ship, Globe, ArrowRight, Loader2 } from 'lucide-react';
import { vehicleAPI } from '@/services/api';

interface LocationData {
  name: string;
  count: number;
}

// Common country flags mapping
const countryFlags: Record<string, string> = {
  'Australia': '🇦🇺',
  'Bahamas': '🇧🇸',
  'Canada': '🇨🇦',
  'Chile': '🇨🇱',
  'Cyprus': '🇨🇾',
  'DR Congo': '🇨🇩',
  'Fiji': '🇫🇯',
  'Guyana': '🇬🇾',
  'Ireland': '🇮🇪',
  'Jamaica': '🇯🇲',
  'Kenya': '🇰🇪',
  'Mauritius': '🇲🇺',
  'Pakistan': '🇵🇰',
  'Russia': '🇷🇺',
  'Rwanda': '🇷🇼',
  'South Africa': '🇿🇦',
  'Sri Lanka': '🇱🇰',
  'Tanzania': '🇹🇿',
  'Uganda': '🇺🇬',
  'UK': '🇬🇧',
  'USA': '🇺🇸',
  'United States': '🇺🇸',
  'United Kingdom': '🇬🇧',
  'Japan': '🇯🇵',
  'Germany': '🇩🇪',
  'France': '🇫🇷',
  'Italy': '🇮🇹',
  'Spain': '🇪🇸',
  'China': '🇨🇳',
  'India': '🇮🇳',
  'Brazil': '🇧🇷',
  'Mexico': '🇲🇽',
  'UAE': '🇦🇪',
  'United Arab Emirates': '🇦🇪',
  'Saudi Arabia': '🇸🇦',
  'New Zealand': '🇳🇿'
};

// Fallback flag for countries not in our mapping
const DEFAULT_FLAG = '🏳️';

export default function SidebarShipping() {
  const [locations, setLocations] = useState<LocationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        setLoading(true);
        const response = await vehicleAPI.getVehicleLocations();
        setLocations(response.data);
      } catch (err) {
        console.error('Error fetching vehicle locations:', err);
        setError('Failed to load locations');
      } finally {
        setLoading(false);
      }
    };

    fetchLocations();
  }, []);

  // Get flag emoji for a location
  const getFlag = (locationName: string): string => {
    // Try direct match first
    if (countryFlags[locationName]) {
      return countryFlags[locationName];
    }
    
    // Try to find a partial match (for cases like "USA - California")
    for (const [country, flag] of Object.entries(countryFlags)) {
      if (locationName.includes(country)) {
        return flag;
      }
    }
    
    return DEFAULT_FLAG;
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Shipping Schedule Section */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-4">
          <div className="flex items-center gap-2 text-blue-600 font-bold text-xl mb-4">
            <Ship className="h-6 w-6" />
            <h2>Shipping Schedule</h2>
          </div>
          
          <Link 
            href="/shipping-schedule" 
            className="text-blue-600 hover:text-blue-800 flex items-center font-medium"
          >
            View full schedule <ArrowRight className="h-4 w-4 ml-1" />
          </Link>
        </div>
      </div>
      
      {/* Countries We Serve Section */}
      <div className="bg-[#212121] rounded-lg shadow-md overflow-hidden">
        <div className="p-4 text-white">
          <div className="flex items-center gap-2 font-bold text-xl mb-4">
            <Globe className="h-6 w-6" />
            <h2>Available Locations</h2>
          </div>
        </div>
        
        <div className="bg-white p-4">
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
          ) : error ? (
            <div className="text-center text-red-500 py-4">{error}</div>
          ) : locations.length > 0 ? (
            <div className="grid grid-cols-2 gap-y-4">
              {locations.map((location) => (
                <Link 
                  key={location.name}
                  href={`/cars?location=${encodeURIComponent(location.name)}`}
                  className="flex items-center text-gray-700 hover:text-primary transition-colors"
                >
                  <span className="mr-2 text-xl">{getFlag(location.name)}</span>
                  <span className="text-sm">{location.name}</span>
                  {location.count > 0 && (
                    <span className="ml-1 text-xs text-gray-500">({location.count})</span>
                  )}
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-4">No locations available</div>
          )}
          
          <div className="mt-6 border-t border-gray-100 pt-4 text-center">
            <Link 
              href="/cars" 
              className="text-gray-500 hover:text-primary text-sm font-medium"
            >
              View All Vehicles
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 