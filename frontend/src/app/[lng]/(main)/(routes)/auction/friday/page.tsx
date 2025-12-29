'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Clock, MapPin, Car, Calendar, Info } from 'lucide-react';

export default function FridayAuctionsPage() {
  // Friday auction houses data (sample of the most important ones)
  const auctionHouses = [
    {
      name: 'USS Nagoya',
      location: 'Nagoya',
      startTime: '9:30 AM JST',
      vehicleTypes: 'Passenger cars, SUVs, Commercial vehicles',
      description: 'USS Nagoya is one of the largest auction houses in central Japan, offering thousands of vehicles weekly with comprehensive inspection reports.',
      isPopular: true,
    },
    {
      name: 'USS Osaka',
      location: 'Osaka',
      startTime: '9:00 AM JST',
      vehicleTypes: 'Passenger cars, Luxury vehicles, Commercial vehicles',
      description: 'USS Osaka provides access to a wide range of vehicles from western Japan, with strong representation from dealerships and fleet sales.',
      isPopular: false,
    },
    {
      name: 'USS Saitama',
      location: 'Saitama',
      startTime: '10:00 AM JST',
      vehicleTypes: 'Passenger cars, SUVs, Commercial vehicles',
      description: 'USS Saitama offers a diverse selection of vehicles from the greater Tokyo area, with detailed inspection reports and history checks.',
      isPopular: false,
    },
    {
      name: 'ARAI Bayside',
      location: 'Tokyo',
      startTime: '9:00 AM JST',
      vehicleTypes: 'Passenger cars, Imports, Luxury vehicles',
      description: 'ARAI Bayside specializes in premium and imported vehicles, with a focus on high-end models and rare finds.',
      isPopular: false,
    },
    {
      name: 'NAA Tokyo',
      location: 'Tokyo',
      startTime: '10:30 AM JST',
      vehicleTypes: 'Passenger cars, SUVs',
      description: 'NAA Tokyo offers quality vehicles from the Tokyo metropolitan area, with comprehensive inspection reports and history checks.',
      isPopular: false,
    },
    {
      name: 'TAA Chubu',
      location: 'Nagoya',
      startTime: '10:00 AM JST',
      vehicleTypes: 'Passenger cars, Commercial vehicles',
      description: 'TAA Chubu provides access to a wide range of vehicles from central Japan, with strong representation from local dealerships.',
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
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Friday Auction Houses</h1>
          <p className="text-xl text-gray-300 max-w-3xl">
            Browse our selection of Friday auction houses in Japan, featuring premium vehicles from USS Nagoya, USS Osaka, and more.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">About Friday Auctions</h2>
          <p className="text-gray-700 mb-4">
            Friday auctions in Japan feature 18 major auction houses, with a strong presence from the USS network. 
            These auctions offer an excellent opportunity to find quality vehicles before the weekend, 
            with many dealerships and private buyers participating to refresh their inventory.
          </p>
          <div className="flex flex-wrap gap-4 mt-6">
            <div className="flex items-center text-sm text-gray-600">
              <Clock className="h-4 w-4 mr-2 text-red-600" />
              <span>Most auctions start between 9:00 AM - 10:30 AM JST</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Calendar className="h-4 w-4 mr-2 text-red-600" />
              <span>Held weekly</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Car className="h-4 w-4 mr-2 text-red-600" />
              <span>Approximately 10,000+ vehicles available</span>
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold mb-6">Featured Auction Houses</h2>
        <p className="text-gray-600 mb-6">
          Below are some of our featured Friday auction houses. For the complete list of all 18 auction houses, 
          please contact our team or refer to the full auction schedule.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {auctionHouses.map((house, index) => (
            <div 
              key={index}
              className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-all"
            >
              <div className={`p-4 ${house.isPopular ? 'bg-red-50' : 'bg-gray-50'} border-b border-gray-200`}>
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-lg">{house.name}</h3>
                  {house.isPopular && (
                    <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">Popular</span>
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
              View All 18 Friday Auction Houses
            </Link>
          </Button>
        </div>

        <div className="bg-red-50 border border-red-100 rounded-lg p-6 mt-12">
          <div className="flex items-start">
            <Info className="h-5 w-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-red-800 mb-2">Important Information</h3>
              <p className="text-sm text-gray-700 mb-2">
                Friday auctions often feature vehicles that dealerships want to sell before the weekend, 
                sometimes resulting in competitive pricing. This makes Friday an excellent day to find 
                good deals on quality vehicles.
              </p>
              <p className="text-sm text-gray-700">
                Our team has extensive experience with all Friday auction houses and can help you navigate 
                the competitive bidding environment to secure your desired vehicle at the best possible price.
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