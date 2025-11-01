'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin, 
  MapPin, 
  Phone, 
  Mail, 
  ArrowUp,
  Send,
  Youtube
} from 'lucide-react';
import { useTranslation } from '@/app/i18n/client';
import { useLanguage } from '@/components/providers/LanguageProvider';

export default function Footer() {
  const { currentLanguage } = useLanguage();
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [email, setEmail] = useState('');

  // Handle newsletter subscription
  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      console.log(`Subscribed with email: ${email}`);
      setEmail('');
    }
  };

  // Scroll to top functionality
  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;
    
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };

    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    if (typeof window === 'undefined') return;
    
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <footer className="relative bg-[#0f172a] text-white">
      {/* Wave Top Border - Adjusted positioning */}
      <div className="relative w-full h-20 overflow-hidden">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" preserveAspectRatio="none" className="absolute bottom-0 w-full h-20 fill-[#0f172a]">
          <path d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1200,120,1040,120C880,120,720,120,560,120C400,120,240,120,160,120L80,120L0,120Z"></path>
        </svg>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-12">
          {/* Logo and Company Info */}
          <div className="md:col-span-4">
            <div className="flex items-start mb-6">
              <div className="bg-red-600 text-white rounded-md w-8 h-8 flex items-center justify-center mr-3">
                <span className="font-bold">SS</span>
              </div>
              <div>
                <h3 className="font-bold text-xl mb-1">Holdings</h3>
                <p className="text-sm text-gray-400">Global Auto Exports</p>
              </div>
            </div>
            
            <p className="text-gray-400 text-sm mb-6">
              SS Holdings is a leading global auto exporter, providing high-quality vehicles to customers worldwide with reliable shipping and excellent customer service.
            </p>
            
            <div className="flex items-center mb-6">
              <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
              <p className="text-xs text-gray-400">Available 24/7 for customer support</p>
            </div>
            
            <div className="flex space-x-3">
              <a href="#" className="bg-gray-800 hover:bg-gray-700 w-9 h-9 rounded-full flex items-center justify-center transition-colors">
                <Facebook size={18} />
              </a>
              <a href="#" className="bg-gray-800 hover:bg-gray-700 w-9 h-9 rounded-full flex items-center justify-center transition-colors">
                <Twitter size={18} />
              </a>
              <a href="#" className="bg-gray-800 hover:bg-gray-700 w-9 h-9 rounded-full flex items-center justify-center transition-colors">
                <Instagram size={18} />
              </a>
              <a href="#" className="bg-gray-800 hover:bg-gray-700 w-9 h-9 rounded-full flex items-center justify-center transition-colors">
                <Linkedin size={18} />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div className="md:col-span-2">
            <h3 className="font-bold mb-6 flex items-center">
              <span className="w-5 h-0.5 bg-red-600 mr-2"></span>
              Quick Links
            </h3>
            <ul className="space-y-3">
              <li><Link href="/" className="text-gray-400 hover:text-white transition-colors">Home</Link></li>
              <li><Link href="/cars" className="text-gray-400 hover:text-white transition-colors">Cars</Link></li>
              <li><Link href="/auction" className="text-gray-400 hover:text-white transition-colors">Auction</Link></li>
              <li><Link href="/about" className="text-gray-400 hover:text-white transition-colors">About</Link></li>
              <li><Link href="/banking" className="text-gray-400 hover:text-white transition-colors">Banking</Link></li>
              <li><Link href="/faq" className="text-gray-400 hover:text-white transition-colors">FAQ</Link></li>
              <li><Link href="/contact" className="text-gray-400 hover:text-white transition-colors">Contact</Link></li>
              <li><Link href="/sitemap" className="text-gray-400 hover:text-white transition-colors">Site Map</Link></li>
            </ul>
          </div>
          
          {/* Car Categories */}
          <div className="md:col-span-2">
            <h3 className="font-bold mb-6 flex items-center">
              <span className="w-5 h-0.5 bg-red-600 mr-2"></span>
              Car Categories
            </h3>
            <ul className="space-y-3">
              <li><Link href="/cars?type=sedan" className="text-gray-400 hover:text-white transition-colors">Sedans</Link></li>
              <li><Link href="/cars?type=suv" className="text-gray-400 hover:text-white transition-colors">SUVs</Link></li>
              <li><Link href="/cars?type=luxury" className="text-gray-400 hover:text-white transition-colors">Luxury Cars</Link></li>
              <li><Link href="/cars?type=hybrid" className="text-gray-400 hover:text-white transition-colors">Hybrid & Electric</Link></li>
              <li><Link href="/cars?type=commercial" className="text-gray-400 hover:text-white transition-colors">Commercial Vehicles</Link></li>
            </ul>
          </div>
          
          {/* Newsletter */}
          <div className="md:col-span-4">
            <h3 className="font-bold mb-6 flex items-center">
              <span className="w-5 h-0.5 bg-red-600 mr-2"></span>
              Newsletter
            </h3>
            <p className="text-gray-400 text-sm mb-4">
              Subscribe to our newsletter to receive the latest updates on new inventory and exclusive offers.
            </p>
            
            <form onSubmit={handleSubscribe} className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                className="w-full bg-gray-800 text-white px-4 py-3 rounded-md focus:outline-none focus:ring-1 focus:ring-red-600 pr-12"
                required
              />
              <button 
                type="submit" 
                className="absolute right-1 top-1/2 -translate-y-1/2 bg-red-600 text-white p-2 rounded-md hover:bg-red-700 transition-colors"
              >
                <Send size={16} />
              </button>
            </form>
          </div>
        </div>
        
        {/* Contact Info Line */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border-t border-b border-gray-800 py-6 mb-6">
          <div className="flex items-center">
            <MapPin size={20} className="text-red-600 mr-3" />
            <div>
              <p className="font-medium">Our Location</p>
              <p className="text-gray-400 text-sm">123 Export Street, Tokyo</p>
            </div>
          </div>
          
          <div className="flex items-center">
            <Phone size={20} className="text-red-600 mr-3" />
            <div>
              <p className="font-medium">Call Us 24/7</p>
              <p className="text-gray-400 text-sm">+81 3-1234-5678</p>
            </div>
          </div>
          
          <div className="flex items-center">
            <Mail size={20} className="text-red-600 mr-3" />
            <div>
              <p className="font-medium">Email Us</p>
              <p className="text-gray-400 text-sm">info@ssholdings.com</p>
            </div>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-gray-400 text-sm">© {currentYear} SS Holdings. All rights reserved.</p>
          </div>
          
          <div className="flex space-x-6">
            <Link href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Privacy Policy</Link>
            <Link href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Terms of Service</Link>
            <Link href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Shipping Policy</Link>
            <Link href="/sitemap" className="text-gray-400 hover:text-white text-sm transition-colors">Site Map</Link>
          </div>
        </div>
        
        {/* Company Description */}
        <p className="text-gray-500 text-xs text-center mt-8">
          SS Holdings is a leading global auto exporter, providing high-quality vehicles to customers worldwide with reliable shipping and excellent customer service.
        </p>
      </div>
      
      {/* Scroll to Top Button */}
      <motion.button
        className={`fixed bottom-4 right-4 p-3 bg-red-600 text-white rounded-full shadow-lg z-50 ${
          showScrollTop ? 'flex' : 'hidden'
        } items-center justify-center hover:bg-red-700 transition-colors`}
        onClick={scrollToTop}
        animate={{ opacity: showScrollTop ? 1 : 0, scale: showScrollTop ? 1 : 0.8 }}
        transition={{ duration: 0.2 }}
        aria-label="Scroll to top"
      >
        <ArrowUp size={18} />
      </motion.button>
    </footer>
  );
} 