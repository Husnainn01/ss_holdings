'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Clock, MapPin, Car, ShoppingCart, Info, CheckCircle, X } from 'lucide-react';

export default function OnePriceAuctionsPage() {
  // One Price auction houses data
  const auctionHouses = [
    {
      name: 'BAYAUC Oneprice',
      location: 'Tokyo',
      vehicleTypes: 'Passenger cars, SUVs, Commercial vehicles',
      description: 'BAYAUC Oneprice offers a wide selection of fixed-price vehicles with immediate purchase options, eliminating the need for competitive bidding.',
      isPopular: true,
      inventory: '1,500+ vehicles',
    },
    {
      name: 'USS Stock',
      location: 'Nationwide',
      vehicleTypes: 'Passenger cars, Luxury vehicles, Commercial vehicles',
      description: 'USS Stock is Japan\'s largest stock vehicle program, with thousands of vehicles available for immediate purchase from multiple locations.',
      isPopular: false,
      inventory: '5,000+ vehicles',
    },
    {
      name: 'GAO Stock',
      location: 'Tokyo',
      vehicleTypes: 'Passenger cars, Specialty vehicles',
      description: 'GAO Stock offers a curated selection of high-quality vehicles at fixed prices, with detailed inspection reports and history checks.',
      isPopular: false,
      inventory: '800+ vehicles',
    },
    {
      name: 'CAA Chubu Oneprice',
      location: 'Nagoya',
      vehicleTypes: 'Passenger cars, SUVs',
      description: 'CAA Chubu Oneprice provides access to central Japan\'s inventory of fixed-price vehicles with transparent condition reports.',
      isPopular: false,
      inventory: '600+ vehicles',
    },
    {
      name: 'Hero Oneprice',
      location: 'Yokohama',
      vehicleTypes: 'Passenger cars, Sports cars',
      description: 'Hero Oneprice specializes in performance and sports vehicles available for immediate purchase without auction participation.',
      isPopular: false,
      inventory: '400+ vehicles',
    },
    {
      name: 'AS Members',
      location: 'Tokyo',
      vehicleTypes: 'Luxury vehicles, Premium imports',
      description: 'AS Members offers exclusive access to premium and luxury vehicles at fixed prices, with a focus on high-end Japanese and European models.',
      isPopular: false,
      inventory: '300+ vehicles',
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
          <h1 className="text-3xl md:text-4xl font-bold mb-4">One Price & Stock Auctions</h1>
          <p className="text-xl text-gray-300 max-w-3xl">
            Explore our fixed-price vehicle options available 24/7 without competitive bidding. Purchase immediately from Japan's top auction houses.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">About One Price & Stock Auctions</h2>
          <p className="text-gray-700 mb-4">
            One Price and Stock auctions offer an alternative to traditional bidding auctions. These platforms 
            feature vehicles with fixed prices that are available for immediate purchase 24/7. This option is 
            ideal for buyers who want to avoid the competitive bidding process or need vehicles quickly.
          </p>
          
          <h3 className="font-semibold mt-6 mb-3">Key Benefits</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start">
              <CheckCircle className="h-5 w-5 text-teal-600 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <p className="font-medium">Immediate Purchase</p>
                <p className="text-sm text-gray-600">No waiting for auction days or bidding processes</p>
              </div>
            </div>
            <div className="flex items-start">
              <CheckCircle className="h-5 w-5 text-teal-600 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <p className="font-medium">Fixed Pricing</p>
                <p className="text-sm text-gray-600">Transparent pricing with no surprises</p>
              </div>
            </div>
            <div className="flex items-start">
              <CheckCircle className="h-5 w-5 text-teal-600 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <p className="font-medium">24/7 Availability</p>
                <p className="text-sm text-gray-600">Browse and purchase vehicles any time</p>
              </div>
            </div>
            <div className="flex items-start">
              <CheckCircle className="h-5 w-5 text-teal-600 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <p className="font-medium">Large Inventory</p>
                <p className="text-sm text-gray-600">Access to thousands of vehicles across multiple platforms</p>
              </div>
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold mb-6">Featured One Price & Stock Platforms</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {auctionHouses.map((house, index) => (
            <div 
              key={index}
              className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-all"
            >
              <div className={`p-4 ${house.isPopular ? 'bg-teal-50' : 'bg-gray-50'} border-b border-gray-200`}>
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-lg">{house.name}</h3>
                  {house.isPopular && (
                    <span className="bg-teal-100 text-teal-800 text-xs px-2 py-1 rounded-full">Popular</span>
                  )}
                </div>
                <div className="flex items-center mt-1 text-sm text-gray-600">
                  <MapPin className="h-3 w-3 mr-1" />
                  {house.location}
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center mb-3 text-sm">
                  <ShoppingCart className="h-4 w-4 mr-2 text-gray-500" />
                  <span>Inventory: {house.inventory}</span>
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
                    Browse Inventory
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-teal-50 border border-teal-100 rounded-lg p-6 mt-12">
          <div className="flex items-start">
            <Info className="h-5 w-5 text-teal-600 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-teal-800 mb-2">How One Price & Stock Works</h3>
              <p className="text-sm text-gray-700 mb-4">
                Unlike traditional auctions where vehicles are sold to the highest bidder, One Price and Stock 
                vehicles are available for immediate purchase at a fixed price. This eliminates the uncertainty 
                of competitive bidding and allows for quicker transactions.
              </p>
              <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700 ml-4">
                <li>Browse available vehicles on our platform</li>
                <li>Review vehicle details, inspection reports, and fixed prices</li>
                <li>Select your desired vehicle and confirm purchase</li>
                <li>Complete payment and shipping arrangements</li>
                <li>Receive your vehicle within the standard shipping timeframe</li>
              </ol>
            </div>
          </div>
        </div>
        
        <div className="mt-12 bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold">One Price vs. Traditional Auctions</h2>
            <p className="text-gray-600 mt-2">
              Understanding the differences between fixed-price options and traditional bidding auctions
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Feature</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">One Price/Stock</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Traditional Auctions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">Availability</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">24/7</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">Specific auction days only</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">Purchase Process</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">Immediate fixed price</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">Competitive bidding</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">Price Certainty</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      Fixed price known upfront
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    <div className="flex items-center">
                      <X className="h-4 w-4 text-red-500 mr-2" />
                      Final price depends on bidding
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">Speed of Acquisition</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">Faster</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">Depends on auction schedule</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">Inventory Size</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">Moderate (8,000+ vehicles)</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">Large (120,000+ weekly)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-white border-t border-gray-200 py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to Browse Available Vehicles?</h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Register now to access our extensive inventory of fixed-price vehicles available for immediate purchase.
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