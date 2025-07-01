'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Clock, MapPin, Car, Calendar, Info } from 'lucide-react';

export default function TuesdayAuctionsPage() {
  // Tuesday auction houses data (sample of the most important ones)
  const auctionHouses = [
    {
      name: 'TAA Kinki',
      location: 'Osaka',
      startTime: '9:30 AM JST',
      vehicleTypes: 'Passenger cars, SUVs, Commercial vehicles',
      description: 'TAA Kinki is one of the largest auction houses in the Kansai region, offering a wide selection of quality vehicles.',
      isPopular: true,
    },
    {
      name: 'USS Yokohama',
      location: 'Yokohama',
      startTime: '9:00 AM JST',
      vehicleTypes: 'Passenger cars, Luxury vehicles, Commercial vehicles',
      description: 'USS Yokohama is part of the USS network, Japan\'s largest auto auction group, known for its extensive inventory and reliable inspection standards.',
      isPopular: false,
    },
    {
      name: 'ZIP Tokyo',
      location: 'Tokyo',
      startTime: '10:00 AM JST',
      vehicleTypes: 'Passenger cars, Specialty vehicles',
      description: 'ZIP Tokyo offers a diverse range of vehicles with a focus on metropolitan Tokyo area inventory.',
      isPopular: false,
    },
    {
      name: 'CAA Gifu',
      location: 'Gifu',
      startTime: '10:30 AM JST',
      vehicleTypes: 'Passenger cars, SUVs',
      description: 'CAA Gifu provides access to quality vehicles from central Japan, with thorough inspection reports.',
      isPopular: false,
    },
    {
      name: 'CAA Touhoku',
      location: 'Sendai',
      startTime: '10:00 AM JST',
      vehicleTypes: 'Passenger cars, SUVs, 4WD vehicles',
      description: 'CAA Touhoku specializes in vehicles from northern Japan, including many well-maintained 4WD and winter-ready vehicles.',
      isPopular: false,
    },
    {
      name: 'ARAI Sendai',
      location: 'Sendai',
      startTime: '9:30 AM JST',
      vehicleTypes: 'Passenger cars, Commercial vehicles',
      description: 'ARAI Sendai offers a selection of vehicles from the Tohoku region with detailed condition reports.',
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
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Tuesday Auction Houses</h1>
          <p className="text-xl text-gray-300 max-w-3xl">
            Browse our selection of Tuesday auction houses in Japan, featuring premium vehicles from TAA Kinki, USS Yokohama, and more.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">About Tuesday Auctions</h2>
          <p className="text-gray-700 mb-4">
            Tuesday is one of the busiest auction days in Japan, with 24 major auction houses operating across the country. 
            These auctions offer an extensive selection of vehicles, including many from the USS and TAA networks, 
            which are known for their strict inspection standards and reliable vehicle condition reports.
          </p>
          <div className="flex flex-wrap gap-4 mt-6">
            <div className="flex items-center text-sm text-gray-600">
              <Clock className="h-4 w-4 mr-2 text-green-600" />
              <span>Most auctions start between 9:00 AM - 10:30 AM JST</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Calendar className="h-4 w-4 mr-2 text-green-600" />
              <span>Held weekly</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Car className="h-4 w-4 mr-2 text-green-600" />
              <span>Approximately 15,000+ vehicles available</span>
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold mb-6">Featured Auction Houses</h2>
        <p className="text-gray-600 mb-6">
          Below are some of our featured Tuesday auction houses. For the complete list of all 24 auction houses, 
          please contact our team or refer to the full auction schedule.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {auctionHouses.map((house, index) => (
            <div 
              key={index}
              className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-all"
            >
              <div className={`p-4 ${house.isPopular ? 'bg-green-50' : 'bg-gray-50'} border-b border-gray-200`}>
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-lg">{house.name}</h3>
                  {house.isPopular && (
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Popular</span>
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

        <div className="text-center mt-10">
          <Button asChild variant="outline" size="lg">
            <Link href="/auction/schedule">
              View All 24 Tuesday Auction Houses
            </Link>
          </Button>
        </div>

        <div className="bg-green-50 border border-green-100 rounded-lg p-6 mt-12">
          <div className="flex items-start">
            <Info className="h-5 w-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-green-800 mb-2">Important Information</h3>
              <p className="text-sm text-gray-700 mb-2">
                Tuesday auctions typically have the largest inventory of the week, with over 15,000 vehicles 
                available across all auction houses. This makes it an excellent day to find rare or specific models.
              </p>
              <p className="text-sm text-gray-700">
                Our team actively participates in all major Tuesday auctions, providing you with real-time 
                bidding and comprehensive inspection services to ensure you get the best vehicle at the best price.
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