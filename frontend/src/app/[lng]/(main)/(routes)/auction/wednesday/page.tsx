'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Clock, MapPin, Car, Calendar, Info } from 'lucide-react';

export default function WednesdayAuctionsPage() {
  // Wednesday auction houses data (sample of the most important ones)
  const auctionHouses = [
    {
      name: 'USS Fukuoka',
      location: 'Fukuoka',
      startTime: '10:00 AM JST',
      vehicleTypes: 'Passenger cars, SUVs, Commercial vehicles',
      description: 'USS Fukuoka is a major auction house in Kyushu region, offering a wide variety of quality vehicles with detailed inspection reports.',
      isPopular: true,
    },
    {
      name: 'USS Kobe',
      location: 'Kobe',
      startTime: '9:30 AM JST',
      vehicleTypes: 'Passenger cars, Luxury vehicles',
      description: 'USS Kobe provides access to premium vehicles from the Kansai region, with a strong selection of luxury and imported models.',
      isPopular: false,
    },
    {
      name: 'USS Tohoku',
      location: 'Sendai',
      startTime: '10:30 AM JST',
      vehicleTypes: 'Passenger cars, 4WD vehicles',
      description: 'USS Tohoku specializes in vehicles from northern Japan, including many well-maintained 4WD and winter-ready vehicles.',
      isPopular: false,
    },
    {
      name: 'BAYAUC',
      location: 'Yokohama',
      startTime: '9:00 AM JST',
      vehicleTypes: 'Passenger cars, Sports cars, Imports',
      description: 'BAYAUC is known for its diverse inventory and specialized focus on sports cars and imported vehicles.',
      isPopular: false,
    },
    {
      name: 'CAA Chubu',
      location: 'Nagoya',
      startTime: '10:00 AM JST',
      vehicleTypes: 'Passenger cars, SUVs',
      description: 'CAA Chubu offers quality vehicles from central Japan with comprehensive inspection reports and history checks.',
      isPopular: false,
    },
    {
      name: 'USS Fujioka',
      location: 'Gunma',
      startTime: '10:30 AM JST',
      vehicleTypes: 'Passenger cars, Commercial vehicles',
      description: 'USS Fujioka provides access to a wide range of vehicles from the Kanto region, with strong representation from local dealerships.',
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
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Wednesday Auction Houses</h1>
          <p className="text-xl text-gray-300 max-w-3xl">
            Browse our selection of Wednesday auction houses in Japan, featuring premium vehicles from USS Fukuoka, USS Kobe, and more.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">About Wednesday Auctions</h2>
          <p className="text-gray-700 mb-4">
            Wednesday auctions in Japan feature 21 major auction houses, with a strong presence from the USS network. 
            These auctions offer an extensive selection of vehicles from various regions across Japan, 
            making it an excellent day to find specific models or regional specialties.
          </p>
          <div className="flex flex-wrap gap-4 mt-6">
            <div className="flex items-center text-sm text-gray-600">
              <Clock className="h-4 w-4 mr-2 text-purple-600" />
              <span>Most auctions start between 9:00 AM - 10:30 AM JST</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Calendar className="h-4 w-4 mr-2 text-purple-600" />
              <span>Held weekly</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Car className="h-4 w-4 mr-2 text-purple-600" />
              <span>Approximately 12,000+ vehicles available</span>
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold mb-6">Featured Auction Houses</h2>
        <p className="text-gray-600 mb-6">
          Below are some of our featured Wednesday auction houses. For the complete list of all 21 auction houses, 
          please contact our team or refer to the full auction schedule.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {auctionHouses.map((house, index) => (
            <div 
              key={index}
              className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-all"
            >
              <div className={`p-4 ${house.isPopular ? 'bg-purple-50' : 'bg-gray-50'} border-b border-gray-200`}>
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-lg">{house.name}</h3>
                  {house.isPopular && (
                    <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">Popular</span>
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
              View All 21 Wednesday Auction Houses
            </Link>
          </Button>
        </div>

        <div className="bg-purple-50 border border-purple-100 rounded-lg p-6 mt-12">
          <div className="flex items-start">
            <Info className="h-5 w-5 text-purple-600 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-purple-800 mb-2">Important Information</h3>
              <p className="text-sm text-gray-700 mb-2">
                Wednesday auctions feature several USS network locations, which are known for their 
                standardized and reliable inspection reports. This makes Wednesday an excellent day 
                for finding vehicles with consistent quality assessments.
              </p>
              <p className="text-sm text-gray-700">
                Our team has extensive experience with all Wednesday auction houses and can provide 
                valuable insights on the specialties and strengths of each location to help you find 
                your ideal vehicle.
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