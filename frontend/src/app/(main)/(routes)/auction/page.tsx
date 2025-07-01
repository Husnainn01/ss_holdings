import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Gavel, Clock, CheckCircle, AlertCircle, ArrowRight, User, UserPlus, Truck, FileText, CreditCard, ShieldCheck } from 'lucide-react';

// Client component for the hero image with error handling
const HeroBackgroundImage = () => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <Image 
        src="/auction-hero.jpg" 
        alt="Car auction" 
        fill
        className="object-cover opacity-20"
        priority
        sizes="100vw"
        // Next.js will handle image errors automatically
      />
    </div>
  );
};

export default function AuctionPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative bg-[#0f172a] text-white">
        {/* Background with overlay */}
        <HeroBackgroundImage />
        
        <div className="relative container mx-auto px-4 py-24 md:py-32">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Exclusive Vehicle Auctions
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8">
              Access premium vehicles from Japan, Singapore, Dubai, and more through our transparent auction process.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="bg-red-600 hover:bg-red-700">
                <Link href="/register" className="flex items-center">
                  <UserPlus className="mr-2 h-5 w-5" />
                  Register for Auctions
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="bg-transparent border-white text-white hover:bg-white/10">
                <Link href="/login" className="flex items-center">
                  <User className="mr-2 h-5 w-5" />
                  Login to Your Account
                </Link>
              </Button>
            </div>
            
            <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="flex items-center">
                <div className="bg-red-600 rounded-full p-2 mr-3">
                  <Gavel className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold">Transparent Bidding</p>
                  <p className="text-sm text-gray-300">Fair and open auction process</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="bg-red-600 rounded-full p-2 mr-3">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold">Weekly Auctions</p>
                  <p className="text-sm text-gray-300">New vehicles every week</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="bg-red-600 rounded-full p-2 mr-3">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold">Verified Vehicles</p>
                  <p className="text-sm text-gray-300">Quality inspection guaranteed</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How Our Auction Process Works</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              We've simplified the auction process to make bidding on international vehicles easy, transparent, and secure.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 relative">
              <div className="absolute -top-5 -left-5 w-10 h-10 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-lg">
                1
              </div>
              <div className="mb-6 text-red-600">
                <UserPlus className="h-10 w-10" />
              </div>
              <h3 className="text-xl font-bold mb-3">Register & Verify</h3>
              <p className="text-gray-600 mb-4">
                Create your account and complete the verification process. We require proper identification to ensure a secure bidding environment.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">Valid ID and proof of address</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">Business registration (for dealers)</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">Payment method verification</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 relative">
              <div className="absolute -top-5 -left-5 w-10 h-10 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-lg">
                2
              </div>
              <div className="mb-6 text-red-600">
                <Gavel className="h-10 w-10" />
              </div>
              <h3 className="text-xl font-bold mb-3">Browse & Bid</h3>
              <p className="text-gray-600 mb-4">
                Explore our upcoming auctions, review detailed vehicle information, and place your bids on vehicles that match your requirements.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">Comprehensive vehicle details</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">High-quality images and inspection reports</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">Real-time bidding updates</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 relative">
              <div className="absolute -top-5 -left-5 w-10 h-10 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-lg">
                3
              </div>
              <div className="mb-6 text-red-600">
                <Truck className="h-10 w-10" />
              </div>
              <h3 className="text-xl font-bold mb-3">Win & Ship</h3>
              <p className="text-gray-600 mb-4">
                If you win the auction, complete the payment and we'll handle all the logistics to deliver the vehicle to your specified location.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">Secure payment processing</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">Export documentation handling</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">Door-to-door shipping options</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Auction Calendar */}
      <div className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Upcoming Auction Schedule</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our auctions are held throughout the week at various Japanese auction houses. Each day offers different opportunities to find your perfect vehicle.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
              <div className="bg-blue-50 p-4 border-b border-gray-200">
                <h3 className="font-bold text-lg text-blue-800">Monday</h3>
                <p className="text-blue-600">7 Auction Houses</p>
              </div>
              <div className="p-4">
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• AUCNET</li>
                  <li>• GNN OSAKA</li>
                  <li>• GAO</li>
                  <li>• Honda Fukuoka</li>
                  <li>• Honda Hokkaido</li>
                  <li className="flex items-center justify-between">
                    <span>• Honda Tokyo</span>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">Popular</span>
                  </li>
                  <li>• JU Tokyo</li>
                </ul>
                <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center">
                  <p className="text-sm text-gray-500">
                    <Clock className="inline-block h-4 w-4 mr-1" />
                    From 10:00 AM JST
                  </p>
                  <Link href="/auction/monday" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                    Details →
                  </Link>
                </div>
              </div>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
              <div className="bg-green-50 p-4 border-b border-gray-200">
                <h3 className="font-bold text-lg text-green-800">Tuesday</h3>
                <p className="text-green-600">24 Auction Houses</p>
              </div>
              <div className="p-4">
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• ARAI Sendai</li>
                  <li>• CAA Gifu</li>
                  <li>• CAA Touhoku</li>
                  <li className="flex items-center justify-between">
                    <span>• TAA Kinki</span>
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">Popular</span>
                  </li>
                  <li>• TAA Kyushu</li>
                  <li>• USS Yokohama</li>
                  <li>• ZIP Tokyo</li>
                </ul>
                <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center">
                  <p className="text-sm text-gray-500">
                    <Clock className="inline-block h-4 w-4 mr-1" />
                    From 9:30 AM JST
                  </p>
                  <Link href="/auction/tuesday" className="text-green-600 hover:text-green-800 text-sm font-medium">
                    Details →
                  </Link>
                </div>
              </div>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
              <div className="bg-purple-50 p-4 border-b border-gray-200">
                <h3 className="font-bold text-lg text-purple-800">Wednesday</h3>
                <p className="text-purple-600">21 Auction Houses</p>
              </div>
              <div className="p-4">
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• BAYAUC</li>
                  <li>• CAA Chubu</li>
                  <li>• BCN</li>
                  <li className="flex items-center justify-between">
                    <span>• USS Fukuoka</span>
                    <span className="text-xs bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full">Popular</span>
                  </li>
                  <li>• USS Kobe</li>
                  <li>• USS Sapporo</li>
                  <li>• USS Tohoku</li>
                </ul>
                <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center">
                  <p className="text-sm text-gray-500">
                    <Clock className="inline-block h-4 w-4 mr-1" />
                    From 10:00 AM JST
                  </p>
                  <Link href="/auction/wednesday" className="text-purple-600 hover:text-purple-800 text-sm font-medium">
                    Details →
                  </Link>
                </div>
              </div>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
              <div className="bg-amber-50 p-4 border-b border-gray-200">
                <h3 className="font-bold text-lg text-amber-800">Thursday</h3>
                <p className="text-amber-600">25 Auction Houses</p>
              </div>
              <div className="p-4">
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• ARAI Oyama</li>
                  <li>• GE Kobe</li>
                  <li className="flex items-center justify-between">
                    <span>• USS Tokyo</span>
                    <span className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">Popular</span>
                  </li>
                  <li>• HAA Osaka</li>
                  <li>• TAA Hokkaido</li>
                  <li>• TAA Kantou</li>
                  <li>• ZIP Osaka</li>
                </ul>
                <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center">
                  <p className="text-sm text-gray-500">
                    <Clock className="inline-block h-4 w-4 mr-1" />
                    From 9:00 AM JST
                  </p>
                  <Link href="/auction/thursday" className="text-amber-600 hover:text-amber-800 text-sm font-medium">
                    Details →
                  </Link>
                </div>
              </div>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
              <div className="bg-red-50 p-4 border-b border-gray-200">
                <h3 className="font-bold text-lg text-red-800">Friday</h3>
                <p className="text-red-600">18 Auction Houses</p>
              </div>
              <div className="p-4">
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• ARAI Bayside</li>
                  <li>• JAA Tsukuba</li>
                  <li>• JU Chiba</li>
                  <li className="flex items-center justify-between">
                    <span>• USS Nagoya</span>
                    <span className="text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded-full">Popular</span>
                  </li>
                  <li>• USS Osaka</li>
                  <li>• USS Saitama</li>
                  <li>• TAA Chubu</li>
                </ul>
                <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center">
                  <p className="text-sm text-gray-500">
                    <Clock className="inline-block h-4 w-4 mr-1" />
                    From 9:30 AM JST
                  </p>
                  <Link href="/auction/friday" className="text-red-600 hover:text-red-800 text-sm font-medium">
                    Details →
                  </Link>
                </div>
              </div>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
              <div className="bg-indigo-50 p-4 border-b border-gray-200">
                <h3 className="font-bold text-lg text-indigo-800">Saturday</h3>
                <p className="text-indigo-600">13 Auction Houses</p>
              </div>
              <div className="p-4">
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• ARAI Oyama</li>
                  <li>• JU Gifu</li>
                  <li>• HAA Kobe</li>
                  <li className="flex items-center justify-between">
                    <span>• USS Kyushu</span>
                    <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full">Popular</span>
                  </li>
                  <li>• USS Okayama</li>
                  <li>• USS Ryuutsu</li>
                  <li>• USS Shizuoka</li>
                </ul>
                <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center">
                  <p className="text-sm text-gray-500">
                    <Clock className="inline-block h-4 w-4 mr-1" />
                    From 10:00 AM JST
                  </p>
                  <Link href="/auction/saturday" className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                    Details →
                  </Link>
                </div>
              </div>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
              <div className="bg-teal-50 p-4 border-b border-gray-200">
                <h3 className="font-bold text-lg text-teal-800">One Price / Stock</h3>
                <p className="text-teal-600">15+ Auction Houses</p>
              </div>
              <div className="p-4">
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• AS Members</li>
                  <li>• Apple Stock</li>
                  <li>• AS Oneprice</li>
                  <li className="flex items-center justify-between">
                    <span>• BAYAUC Oneprice</span>
                    <span className="text-xs bg-teal-100 text-teal-800 px-2 py-0.5 rounded-full">Popular</span>
                  </li>
                  <li>• USS Stock</li>
                  <li>• GAO Stock</li>
                  <li>• Hero Oneprice</li>
                </ul>
                <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center">
                  <p className="text-sm text-gray-500">
                    <Clock className="inline-block h-4 w-4 mr-1" />
                    Available 24/7
                  </p>
                  <Link href="/auction/oneprice" className="text-teal-600 hover:text-teal-800 text-sm font-medium">
                    Details →
                  </Link>
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <Button asChild size="lg" className="bg-red-600 hover:bg-red-700">
              <Link href="/auction/schedule" className="flex items-center">
                View Complete Auction Schedule <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Auction Benefits */}
      <div className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose Our Auctions</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              We provide a secure, transparent platform with access to a global inventory of quality vehicles.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <ShieldCheck className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-bold text-xl mb-2">Verified Vehicles</h3>
              <p className="text-gray-600">
                All vehicles undergo a thorough inspection process. Detailed reports with images are provided for each listing.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <FileText className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-bold text-xl mb-2">Complete Documentation</h3>
              <p className="text-gray-600">
                We handle all export documentation, ensuring a smooth process from purchase to delivery.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mb-4">
                <Truck className="h-6 w-6 text-amber-600" />
              </div>
              <h3 className="font-bold text-xl mb-2">Global Shipping</h3>
              <p className="text-gray-600">
                Door-to-door shipping services available to over 100 countries with real-time tracking.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <CreditCard className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-bold text-xl mb-2">Secure Payments</h3>
              <p className="text-gray-600">
                Multiple secure payment options with escrow services for large transactions.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="font-bold text-xl mb-2">No Hidden Fees</h3>
              <p className="text-gray-600">
                Transparent pricing with all fees clearly listed before you place your bid.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                <User className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="font-bold text-xl mb-2">Dedicated Support</h3>
              <p className="text-gray-600">
                Personal auction agents to assist you throughout the entire process.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Common questions about our auction process and services.
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="font-bold text-xl mb-2">Who can participate in the auctions?</h3>
                <p className="text-gray-600">
                  Our auctions are open to both individual buyers and dealerships. All participants must complete our verification process, which includes providing identification and proof of address.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="font-bold text-xl mb-2">How do I place a bid?</h3>
                <p className="text-gray-600">
                  After registering and logging in, you can place bids on any active auction listing. You can set a maximum bid amount, and our system will automatically bid incrementally on your behalf up to your maximum.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="font-bold text-xl mb-2">What happens if I win an auction?</h3>
                <p className="text-gray-600">
                  If you win, you'll receive a notification immediately. You'll then have 48 hours to complete the payment. Once payment is confirmed, we'll begin processing the shipping and documentation.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="font-bold text-xl mb-2">What payment methods do you accept?</h3>
                <p className="text-gray-600">
                  We accept bank transfers, credit cards, and cryptocurrency for certain transactions. For large purchases, we offer escrow services for added security.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="font-bold text-xl mb-2">How long does shipping take?</h3>
                <p className="text-gray-600">
                  Shipping times vary depending on the origin and destination. Typically, shipping takes 2-4 weeks for sea freight and 3-7 days for air freight. We provide tracking information once your vehicle is dispatched.
                </p>
              </div>
            </div>
            
            <div className="text-center mt-10">
              <Link href="/faq" className="text-red-600 hover:text-red-700 font-medium flex items-center justify-center">
                View All FAQs <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-[#0f172a] text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Start Bidding?</h2>
          <p className="text-xl text-gray-300 mb-10 max-w-3xl mx-auto">
            Join thousands of satisfied customers who have found their perfect vehicles through our auction platform.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button asChild size="lg" className="bg-red-600 hover:bg-red-700">
              <Link href="/register" className="flex items-center">
                <UserPlus className="mr-2 h-5 w-5" />
                Create an Account
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="bg-transparent border-white text-white hover:bg-white/10">
              <Link href="/login" className="flex items-center">
                <User className="mr-2 h-5 w-5" />
                Login to Your Account
              </Link>
            </Button>
          </div>
          
          <p className="mt-8 text-gray-400">
            Need assistance? Contact our support team at <span className="text-white">support@ssholdings.com</span>
          </p>
        </div>
      </div>
    </div>
  );
} 