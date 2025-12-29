import React from 'react';
import Link from 'next/link';

export default function SitemapPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl md:text-4xl font-bold mb-8">Site Map</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Main Pages */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-bold mb-4 text-gray-800 border-b pb-2">Main Pages</h2>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-blue-600 hover:underline">Home</Link>
              </li>
              <li>
                <Link href="/about" className="text-blue-600 hover:underline">About Us</Link>
              </li>
              <li>
                <Link href="/cars" className="text-blue-600 hover:underline">Cars</Link>
              </li>
              <li>
                <Link href="/contact" className="text-blue-600 hover:underline">Contact Us</Link>
              </li>
              <li>
                <Link href="/faq" className="text-blue-600 hover:underline">FAQ</Link>
              </li>
              <li>
                <Link href="/banking" className="text-blue-600 hover:underline">Banking Information</Link>
              </li>
            </ul>
          </div>
          
          {/* Auction Pages */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-bold mb-4 text-gray-800 border-b pb-2">Auction Pages</h2>
            <ul className="space-y-2">
              <li>
                <Link href="/auction" className="text-blue-600 hover:underline">Auction Overview</Link>
              </li>
              <li>
                <Link href="/auction/schedule" className="text-blue-600 hover:underline">Auction Schedule</Link>
              </li>
              <li>
                <Link href="/auction/monday" className="text-blue-600 hover:underline">Monday Auctions</Link>
              </li>
              <li>
                <Link href="/auction/tuesday" className="text-blue-600 hover:underline">Tuesday Auctions</Link>
              </li>
              <li>
                <Link href="/auction/wednesday" className="text-blue-600 hover:underline">Wednesday Auctions</Link>
              </li>
              <li>
                <Link href="/auction/thursday" className="text-blue-600 hover:underline">Thursday Auctions</Link>
              </li>
              <li>
                <Link href="/auction/friday" className="text-blue-600 hover:underline">Friday Auctions</Link>
              </li>
              <li>
                <Link href="/auction/saturday" className="text-blue-600 hover:underline">Saturday Auctions</Link>
              </li>
              <li>
                <Link href="/auction/oneprice" className="text-blue-600 hover:underline">One Price & Stock Auctions</Link>
              </li>
            </ul>
          </div>
          
          {/* User Account Pages */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-bold mb-4 text-gray-800 border-b pb-2">User Account</h2>
            <ul className="space-y-2">
              <li>
                <Link href="/login" className="text-blue-600 hover:underline">Login</Link>
              </li>
              <li>
                <Link href="/register" className="text-blue-600 hover:underline">Register</Link>
              </li>
              <li>
                <Link href="/account" className="text-blue-600 hover:underline">My Account</Link>
              </li>
              <li>
                <Link href="/account/orders" className="text-blue-600 hover:underline">My Orders</Link>
              </li>
              <li>
                <Link href="/account/favorites" className="text-blue-600 hover:underline">Saved Vehicles</Link>
              </li>
            </ul>
          </div>
          
          {/* Legal Pages */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-bold mb-4 text-gray-800 border-b pb-2">Legal Information</h2>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy-policy" className="text-blue-600 hover:underline">Privacy Policy</Link>
              </li>
              <li>
                <Link href="/terms-of-service" className="text-blue-600 hover:underline">Terms of Service</Link>
              </li>
              <li>
                <Link href="/shipping-policy" className="text-blue-600 hover:underline">Shipping Policy</Link>
              </li>
              <li>
                <Link href="/refund-policy" className="text-blue-600 hover:underline">Refund Policy</Link>
              </li>
            </ul>
          </div>
          
          {/* Support Pages */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-bold mb-4 text-gray-800 border-b pb-2">Support</h2>
            <ul className="space-y-2">
              <li>
                <Link href="/contact" className="text-blue-600 hover:underline">Contact Support</Link>
              </li>
              <li>
                <Link href="/faq" className="text-blue-600 hover:underline">Frequently Asked Questions</Link>
              </li>
              <li>
                <Link href="/shipping-information" className="text-blue-600 hover:underline">Shipping Information</Link>
              </li>
              <li>
                <Link href="/payment-methods" className="text-blue-600 hover:underline">Payment Methods</Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 