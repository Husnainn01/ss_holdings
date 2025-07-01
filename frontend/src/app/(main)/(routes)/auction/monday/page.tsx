'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Clock, MapPin, Car, Calendar, Info } from 'lucide-react';

export default function MondayAuctionsPage() {
  // Monday auction houses data
  const auctionHouses = [
    {
      name: 'AUCNET',
      location: 'Tokyo',
      startTime: '10:00 AM JST',
      vehicleTypes: 'Passenger cars, SUVs, Commercial vehicles',
      description: 'AUCNET is one of Japan\'s largest online auction platforms, offering a wide range of vehicles from across the country.',
      isPopular: false,
    },
    {
      name: 'GNN OSAKA',
      location: 'Osaka',
      startTime: '10:30 AM JST',
      vehicleTypes: 'Passenger cars, Luxury vehicles',
      description: 'GNN OSAKA specializes in high-quality vehicles from the Kansai region, with a focus on well-maintained used cars.',
      isPopular: false,
    },
    {
      name: 'GAO',
      location: 'Tokyo',
      startTime: '9:30 AM JST',
      vehicleTypes: 'Passenger cars, Specialty vehicles',
      description: 'GAO offers a diverse selection of vehicles with comprehensive inspection reports and detailed vehicle histories.',
      isPopular: false,
    },
    {
      name: 'Honda Fukuoka',
      location: 'Fukuoka',
      startTime: '11:00 AM JST',
      vehicleTypes: 'Honda vehicles',
      description: 'Honda Fukuoka auction specializes in certified pre-owned Honda vehicles from the Kyushu region.',
      isPopular: false,
    },
    {
      name: 'Honda Hokkaido',
      location: 'Sapporo',
      startTime: '10:00 AM JST',
      vehicleTypes: 'Honda vehicles',
      description: 'Honda Hokkaido offers well-maintained Honda vehicles from northern Japan, known for their quality and condition.',
      isPopular: false,
    },
    {
      name: 'Honda Kansai',
      location: 'Osaka',
      startTime: '10:30 AM JST',
      vehicleTypes: 'Honda vehicles',
      description: 'Honda Kansai features a wide selection of Honda vehicles from the Kansai region, including rare and popular models.',
      isPopular: false,
    },
    {
      name: 'Honda Nagoya',
      location: 'Nagoya',
      startTime: '10:00 AM JST',
      vehicleTypes: 'Honda vehicles',
      description: 'Honda Nagoya auction offers quality Honda vehicles from central Japan, with thorough inspection reports.',
      isPopular: false,
    },
    {
      name: 'Honda Sendai',
      location: 'Sendai',
      startTime: '10:30 AM JST',
      vehicleTypes: 'Honda vehicles',
      description: 'Honda Sendai provides access to well-maintained Honda vehicles from the Tohoku region of Japan.',
      isPopular: false,
    },
    {
      name: 'Honda Tokyo',
      location: 'Tokyo',
      startTime: '9:00 AM JST',
      vehicleTypes: 'Honda vehicles',
      description: 'Honda Tokyo is one of the premier Honda-specific auctions in Japan, offering a vast selection of models with detailed history reports.',
      isPopular: true,
    },
    {
      name: 'JU Tokyo',
      location: 'Tokyo',
      startTime: '10:00 AM JST',
      vehicleTypes: 'Passenger cars, Commercial vehicles',
      description: 'JU Tokyo is part of the Japan Used Car Dealers Association network, offering a wide variety of vehicles with standardized inspections.',
      isPopular: false,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-[#0f172a] text-white">
        <div className="container mx-auto px-4 py-16">
          <Link href="/auction/schedule" className="inline-flex items-center text-gray-300 hover:text-white mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Auction Schedule
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Monday Auction Houses</h1>
          <p className="text-xl text-gray-300 max-w-3xl">
            Browse our selection of Monday auction houses in Japan, featuring premium vehicles from AUCNET, Honda Tokyo, and more.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">About Monday Auctions</h2>
          <p className="text-gray-700 mb-4">
            Monday auctions in Japan typically feature a strong selection of Honda vehicles, as several Honda-specific 
            auction houses operate on this day. These auctions are an excellent opportunity to find quality Japanese 
            domestic market (JDM) vehicles at competitive prices.
          </p>
          <div className="flex flex-wrap gap-4 mt-6">
            <div className="flex items-center text-sm text-gray-600">
              <Clock className="h-4 w-4 mr-2 text-blue-600" />
              <span>Most auctions start between 9:00 AM - 11:00 AM JST</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Calendar className="h-4 w-4 mr-2 text-blue-600" />
              <span>Held weekly</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Car className="h-4 w-4 mr-2 text-blue-600" />
              <span>Approximately 5,000+ vehicles available</span>
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold mb-6">Available Auction Houses</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {auctionHouses.map((house, index) => (
            <div 
              key={index}
              className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-all"
            >
              <div className={`p-4 ${house.isPopular ? 'bg-blue-50' : 'bg-gray-50'} border-b border-gray-200`}>
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-lg">{house.name}</h3>
                  {house.isPopular && (
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">Popular</span>
                  )}
                </div>
                <div className="flex items-center mt-1 text-sm text-gray-600">
                  <MapPin className="h-3 w-3 mr-1" />
                  {house.location}
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center mb-3 text-sm">
                  <Clock className="h-4 w-4 mr-2 text-gray-500" />
                  <span>Starts at {house.startTime}</span>
                </div>
                <div className="flex items-center mb-3 text-sm">
                  <Car className="h-4 w-4 mr-2 text-gray-500" />
                  <span>{house.vehicleTypes}</span>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  {house.description}
                </p>
                <div className="mt-auto pt-3 border-t border-gray-100">
                  <Button variant="outline" size="sm" className="w-full">
                    View Details
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-blue-50 border border-blue-100 rounded-lg p-6 mt-12">
          <div className="flex items-start">
            <Info className="h-5 w-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-blue-800 mb-2">Important Information</h3>
              <p className="text-sm text-gray-700 mb-2">
                To participate in these auctions, you need to be a registered member with SS Holdings. 
                Our team will handle the bidding process on your behalf and manage all logistics related 
                to vehicle inspection, purchase, and shipping.
              </p>
              <p className="text-sm text-gray-700">
                Please note that auction inventory changes daily, and vehicle availability cannot be guaranteed 
                until the auction date. Contact us for the most up-to-date information on available vehicles.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-white border-t border-gray-200 py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to Start Bidding?</h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Register now to access our exclusive auctions and find your perfect vehicle from Japan's top auction houses.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="bg-red-600 hover:bg-red-700">
              <Link href="/register">Create an Account</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/auction">Back to Auction Overview</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 