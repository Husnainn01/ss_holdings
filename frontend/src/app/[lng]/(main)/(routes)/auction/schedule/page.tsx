'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Calendar, ArrowLeft, Download, Printer, Search, Filter, ChevronDown } from 'lucide-react';

type DayKey = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'oneprice';
type TabKey = 'all' | DayKey;

export default function AuctionSchedulePage() {
  const [activeTab, setActiveTab] = useState<TabKey>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Define auction schedule data
  const auctionSchedule: Record<DayKey, string[]> = {
    monday: [
      'AUCNET',
      'GNN OSAKA',
      'GAO',
      'Honda Fukuoka',
      'Honda Hokkaido',
      'Honda Kansai',
      'Honda Nagoya',
      'Honda Sendai',
      'Honda Tokyo',
      'JU Tokyo',
    ],
    tuesday: [
      'ARAI Sendai',
      'Isuzu Kobe',
      'CAA Gifu',
      'CAA Touhoku',
      'GE Tokyo',
      'JU Mie',
      'JU Nagano',
      'JU Saitama',
      'JU Shizuoka',
      'JU Yamaguchi',
      'NPS Osaka',
      'NPS Tokio',
      'ORIX Kobe',
      'ORIX Sendai',
      'SAA Sapporo',
      'TAA Hiroshima',
      'TAA Kinki',
      'TAA Kyushu',
      'TAA kyushu',
      'TAA Minamikyu',
      'TAA Shikoku',
      'USS Yokohama',
      'ZIP Tokyo',
      'USS R NAGOYA',
    ],
    wednesday: [
      'BAYAUC',
      'CAA Chubu',
      'BCN',
      'FAA Shizuoka',
      'GE Tokyo',
      'JU Mie',
      'HERO',
      'IAA Osaka',
      'Isuzu Makuhari',
      'JAA',
      'JU Ibaraki',
      'JU Ishikawa',
      'KAA',
      'KCAA Ebino',
      'LAA Shikoku',
      'ORIX Atsugi',
      'USS Fujioka',
      'USS Fukuoka',
      'USS Kobe',
      'USS Sapporo',
      'USS Tohoku',
    ],
    thursday: [
      'ARAI Oyama',
      'GE Kobe',
      'GAO! TENDER Gulliver',
      'HAA Osaka (Hanaten)',
      'GE Tokyo',
      'JU Aichi',
      'JU Fukushima',
      'JU Gunma',
      'JU Hiroshima',
      'JU Kanagawa',
      'JU Sapporo',
      'JU Toyama',
      'KCAA Fukuoka',
      'LAA Kansai',
      'NAA Nagoya',
      'NAA Osaka',
      'ORIX Fukuoka',
      'ORIX Nagoya',
      'SAA Hamamatsu',
      'USS Niigata',
      'TAA Hokkaido',
      'TAA Kantou',
      'USS R Tokyo',
      'USS Tokyo',
      'ZIP Osaka',
    ],
    friday: [
      'ARAI Bayside',
      'JAA Tsukuba',
      'Isuzu Kobe',
      'JU Chiba',
      'GE Tokyo',
      'JU Miyagi',
      'JU Niigata',
      'JU Okayama LAA',
      'JU Okinawa',
      'JU Tochigi',
      'KCAA Yamaguchi',
      'KUA Katayamazu',
      'NAA Tokyo',
      'USS Hokuriku',
      'USS Nagoya',
      'USS Osaka',
      'USS Saitama',
      'White Wing',
      'TAA Chubu',
    ],
    saturday: [
      'ARAI Oyama',
      'JU Gifu',
      'HAA Kobe',
      'JU Nara',
      'NAA Nagoya Nyu',
      'NA Osaka',
      'NAA Tokyo Nyuusatsu',
      'TAA Yokohama',
      'USS Gunma',
      'USS Kyushu',
      'USS Okayama',
      'USS Ryuutsu',
      'USS Shizuoka',
    ],
    oneprice: [
      'One Price',
      'AS Members',
      'Apple Stock',
      'AS Oneprice',
      'BAYAUC Oneprice',
      'CAA Chubu Oneprice',
      'CAA Tohoku Oneprice',
      'CAA ZIP Tokyo One Price',
      'GAO Stock',
      'HAA Kobe One Price',
      'Hero Oneprice',
      'Ippatsu Stock',
      'JAA Kasai Oneprice',
      'JAA Tsukuba Oneprice',
      'Korea Oneprice One',
      'Kyouyuu Stock',
      'Syoudan Stock',
      'USS Stock',
    ],
  };

  // Get all auction houses for filtering
  const allAuctionHouses = Object.values(auctionSchedule).flat();
  const uniqueAuctionHouses = [...new Set(allAuctionHouses)].sort();

  // Filter auction houses based on search query
  const filteredAuctionHouses = searchQuery 
    ? uniqueAuctionHouses.filter(house => 
        house.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  // Function to render auction houses for a specific day
  const renderAuctionHouses = (day: DayKey) => {
    const houses = auctionSchedule[day] || [];
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {houses.map((house: string, index: number) => (
          <div 
            key={`${day}-${index}`} 
            className="p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all"
          >
            {house}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-[#0f172a] text-white">
        <div className="container mx-auto px-4 py-16">
          <Link href="/auction" className="inline-flex items-center text-gray-300 hover:text-white mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Auction Overview
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Complete Auction Schedule</h1>
          <p className="text-xl text-gray-300 max-w-3xl">
            Browse our comprehensive list of auction houses organized by day of the week.
          </p>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search auction houses..."
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && filteredAuctionHouses.length > 0 && (
                <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-md shadow-lg mt-1 max-h-64 overflow-y-auto z-20">
                  {filteredAuctionHouses.map((house, index) => (
                    <div 
                      key={index} 
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => setSearchQuery(house)}
                    >
                      {house}
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filter
                <ChevronDown className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Export
              </Button>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Printer className="h-4 w-4" />
                Print
              </Button>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Calendar View
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex overflow-x-auto scrollbar-hide">
            <button 
              className={`px-4 py-3 font-medium text-sm border-b-2 whitespace-nowrap ${activeTab === 'all' ? 'border-red-600 text-red-600' : 'border-transparent text-gray-600 hover:text-gray-800'}`}
              onClick={() => setActiveTab('all')}
            >
              All Days
            </button>
            <button 
              className={`px-4 py-3 font-medium text-sm border-b-2 whitespace-nowrap ${activeTab === 'monday' ? 'border-red-600 text-red-600' : 'border-transparent text-gray-600 hover:text-gray-800'}`}
              onClick={() => setActiveTab('monday')}
            >
              Monday
            </button>
            <button 
              className={`px-4 py-3 font-medium text-sm border-b-2 whitespace-nowrap ${activeTab === 'tuesday' ? 'border-red-600 text-red-600' : 'border-transparent text-gray-600 hover:text-gray-800'}`}
              onClick={() => setActiveTab('tuesday')}
            >
              Tuesday
            </button>
            <button 
              className={`px-4 py-3 font-medium text-sm border-b-2 whitespace-nowrap ${activeTab === 'wednesday' ? 'border-red-600 text-red-600' : 'border-transparent text-gray-600 hover:text-gray-800'}`}
              onClick={() => setActiveTab('wednesday')}
            >
              Wednesday
            </button>
            <button 
              className={`px-4 py-3 font-medium text-sm border-b-2 whitespace-nowrap ${activeTab === 'thursday' ? 'border-red-600 text-red-600' : 'border-transparent text-gray-600 hover:text-gray-800'}`}
              onClick={() => setActiveTab('thursday')}
            >
              Thursday
            </button>
            <button 
              className={`px-4 py-3 font-medium text-sm border-b-2 whitespace-nowrap ${activeTab === 'friday' ? 'border-red-600 text-red-600' : 'border-transparent text-gray-600 hover:text-gray-800'}`}
              onClick={() => setActiveTab('friday')}
            >
              Friday
            </button>
            <button 
              className={`px-4 py-3 font-medium text-sm border-b-2 whitespace-nowrap ${activeTab === 'saturday' ? 'border-red-600 text-red-600' : 'border-transparent text-gray-600 hover:text-gray-800'}`}
              onClick={() => setActiveTab('saturday')}
            >
              Saturday
            </button>
            <button 
              className={`px-4 py-3 font-medium text-sm border-b-2 whitespace-nowrap ${activeTab === 'oneprice' ? 'border-red-600 text-red-600' : 'border-transparent text-gray-600 hover:text-gray-800'}`}
              onClick={() => setActiveTab('oneprice')}
            >
              One Price / Stock
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {activeTab === 'all' ? (
          <div className="space-y-10">
            <div>
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <span className="w-2 h-8 bg-blue-600 rounded-full mr-3"></span>
                Monday Auctions
                <span className="ml-3 text-sm font-normal text-gray-500">({auctionSchedule.monday.length} auction houses)</span>
              </h2>
              {renderAuctionHouses('monday')}
            </div>
            
            <div>
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <span className="w-2 h-8 bg-green-600 rounded-full mr-3"></span>
                Tuesday Auctions
                <span className="ml-3 text-sm font-normal text-gray-500">({auctionSchedule.tuesday.length} auction houses)</span>
              </h2>
              {renderAuctionHouses('tuesday')}
            </div>
            
            <div>
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <span className="w-2 h-8 bg-purple-600 rounded-full mr-3"></span>
                Wednesday Auctions
                <span className="ml-3 text-sm font-normal text-gray-500">({auctionSchedule.wednesday.length} auction houses)</span>
              </h2>
              {renderAuctionHouses('wednesday')}
            </div>
            
            <div>
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <span className="w-2 h-8 bg-amber-600 rounded-full mr-3"></span>
                Thursday Auctions
                <span className="ml-3 text-sm font-normal text-gray-500">({auctionSchedule.thursday.length} auction houses)</span>
              </h2>
              {renderAuctionHouses('thursday')}
            </div>
            
            <div>
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <span className="w-2 h-8 bg-red-600 rounded-full mr-3"></span>
                Friday Auctions
                <span className="ml-3 text-sm font-normal text-gray-500">({auctionSchedule.friday.length} auction houses)</span>
              </h2>
              {renderAuctionHouses('friday')}
            </div>
            
            <div>
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <span className="w-2 h-8 bg-indigo-600 rounded-full mr-3"></span>
                Saturday Auctions
                <span className="ml-3 text-sm font-normal text-gray-500">({auctionSchedule.saturday.length} auction houses)</span>
              </h2>
              {renderAuctionHouses('saturday')}
            </div>
            
            <div>
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <span className="w-2 h-8 bg-teal-600 rounded-full mr-3"></span>
                One Price / Stock
                <span className="ml-3 text-sm font-normal text-gray-500">({auctionSchedule.oneprice.length} auction houses)</span>
              </h2>
              {renderAuctionHouses('oneprice')}
            </div>
          </div>
        ) : (
          <div>
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <span className={`w-2 h-8 rounded-full mr-3 ${
                activeTab === 'monday' ? 'bg-blue-600' :
                activeTab === 'tuesday' ? 'bg-green-600' :
                activeTab === 'wednesday' ? 'bg-purple-600' :
                activeTab === 'thursday' ? 'bg-amber-600' :
                activeTab === 'friday' ? 'bg-red-600' :
                activeTab === 'saturday' ? 'bg-indigo-600' :
                'bg-teal-600'
              }`}></span>
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Auctions
              <span className="ml-3 text-sm font-normal text-gray-500">({auctionSchedule[activeTab].length} auction houses)</span>
            </h2>
            {renderAuctionHouses(activeTab)}
          </div>
        )}
      </div>

      {/* CTA Section */}
      <div className="bg-white border-t border-gray-200 py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to Start Bidding?</h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Register now to access our exclusive auctions and find your perfect vehicle from Japan, Singapore, Dubai, and more.
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