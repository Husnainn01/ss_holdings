'use client';

import React from 'react';
import Link from 'next/link';
import { Ship, Globe, ArrowRight } from 'lucide-react';

interface CountryProps {
  name: string;
  flag: string;
}

const countries: CountryProps[] = [
  { name: 'Australia', flag: '🇦🇺' },
  { name: 'Bahamas', flag: '🇧🇸' },
  { name: 'Canada', flag: '🇨🇦' },
  { name: 'Chile', flag: '🇨🇱' },
  { name: 'Cyprus', flag: '🇨🇾' },
  { name: 'DR Congo', flag: '🇨🇩' },
  { name: 'Fiji', flag: '🇫🇯' },
  { name: 'Guyana', flag: '🇬🇾' },
  { name: 'Ireland', flag: '🇮🇪' },
  { name: 'Jamaica', flag: '🇯🇲' },
  { name: 'Kenya', flag: '🇰🇪' },
  { name: 'Mauritius', flag: '🇲🇺' },
  { name: 'Pakistan', flag: '🇵🇰' },
  { name: 'Russia', flag: '🇷🇺' },
  { name: 'Rwanda', flag: '🇷🇼' },
  { name: 'South Africa', flag: '🇿🇦' },
  { name: 'Sri Lanka', flag: '🇱🇰' },
  { name: 'Tanzania', flag: '🇹🇿' },
  { name: 'Uganda', flag: '🇺🇬' },
  { name: 'UK', flag: '🇬🇧' },
  { name: 'USA', flag: '🇺🇸' }
];

export default function SidebarShipping() {
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
            <h2>Countries We Serve</h2>
          </div>
        </div>
        
        <div className="bg-white p-4">
          <div className="grid grid-cols-2 gap-y-4">
            {countries.map((country) => (
              <Link 
                key={country.name}
                href={`/destinations/${country.name.toLowerCase().replace(/\s+/g, '-')}`}
                className="flex items-center text-gray-700 hover:text-primary transition-colors"
              >
                <span className="mr-2 text-xl">{country.flag}</span>
                <span className="text-sm">{country.name}</span>
              </Link>
            ))}
          </div>
          
          <div className="mt-6 border-t border-gray-100 pt-4 text-center">
            <Link 
              href="/destinations" 
              className="text-gray-500 hover:text-primary text-sm font-medium"
            >
              View All Destinations
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 