"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, Menu, X, ChevronDown, MapPin } from 'lucide-react';
import Image from 'next/image';
import { LanguageSwitcher } from '@/components/ui/language-switcher';
import { useTranslation } from '@/app/i18n/client';
import config from '@/config';
import { vehicleAPI } from '@/services/api';

interface MegaMenuItem {
  name: string;
  href: string;
  icon: string;
  imageUrl?: string;
}

interface ApiMake {
  name: string;
  imageUrl?: string;
  svgUrl?: string;
}

interface ApiVehicleType {
  name: string;
}

interface ApiLocation {
  name: string;
}

export default function Header() {
  const { t } = useTranslation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  
  // State for dynamic data
  const [makes, setMakes] = useState<MegaMenuItem[]>([]);
  const [vehicleTypes, setVehicleTypes] = useState<MegaMenuItem[]>([]);
  const [locations, setLocations] = useState<MegaMenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Handle scroll effects
  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;
    
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Fetch dynamic data for the mega menu
  useEffect(() => {
    const fetchMenuData = async () => {
      try {
        console.log('Header: Starting to fetch menu data using API URL:', config.apiUrl);
        setIsLoading(true);
        
        // Check if we're on the server
        if (typeof window === 'undefined') {
          console.log('Header: Skipping API calls during server-side rendering');
          return;
        }
        
        // Fetch makes using API service
        const makesResponse = await fetch(`${config.apiUrl}/options/category/makes`);
        const makesData: { data: ApiMake[] } = await makesResponse.json();
        
        // Fetch body types using API service
        const typesResponse = await fetch(`${config.apiUrl}/options/category/bodyTypes`);
        const typesData: { data: ApiVehicleType[] } = await typesResponse.json();
        
        // Fetch locations using vehicleAPI service
        const locationsResponse = await vehicleAPI.getVehicleLocations();
        const locationsData: ApiLocation[] = locationsResponse.data ?? [];
        
        // Map makes data to menu items with images - limit to 8
        const mappedMakes = makesData.data.map((make) => {
          // Use SVG if available, otherwise use image or fallback
          const imageUrl = make.svgUrl || make.imageUrl || `/brands/${make.name.toLowerCase()}.svg`;
          
          return {
            name: make.name,
            href: `/cars?make=${encodeURIComponent(make.name)}`,
            icon: '🚗', // Default icon as fallback
            imageUrl
          };
        }).slice(0, 8);
        
        // Map types data to menu items - limit to 8
        const mappedTypes = typesData.data.map((type) => {
          // Map body types to appropriate icons
          let icon = '🚗';
          if (type.name.toLowerCase().includes('suv')) icon = '🚙';
          else if (type.name.toLowerCase().includes('truck')) icon = '🚚';
          else if (type.name.toLowerCase().includes('van')) icon = '🚐';
          else if (type.name.toLowerCase().includes('commercial')) icon = '🚛';
          else if (type.name.toLowerCase().includes('agricultural')) icon = '🚜';
          else if (type.name.toLowerCase().includes('construction')) icon = '🏗️';
          else if (type.name.toLowerCase().includes('machinery')) icon = '⚙️';
          else if (type.name.toLowerCase().includes('motorcycle')) icon = '🏍️';
          
          return {
            name: type.name,
            href: `/cars?bodyType=${encodeURIComponent(type.name)}`,
            icon
          };
        }).slice(0, 8);
        
        // Map locations data to menu items with flags - limit to 8
        const mappedLocations = locationsData.map((location) => {
          // Map common countries to flag emojis
          const name = location.name ?? '';
          let flag = '🏳️';
          if (name.includes('Japan')) flag = '🇯🇵';
          else if (name.includes('Singapore')) flag = '🇸🇬';
          else if (name.includes('Dubai') || name.includes('UAE')) flag = '🇦🇪';
          else if (name.includes('Thailand')) flag = '🇹🇭';
          else if (name.includes('Korea')) flag = '🇰🇷';
          else if (name.includes('Australia')) flag = '🇦🇺';
          else if (name.includes('New Zealand')) flag = '🇳🇿';
          else if (name.includes('Canada')) flag = '🇨🇦';
          else if (name.includes('United States') || name.includes('USA')) flag = '🇺🇸';
          else if (name.includes('United Kingdom') || name.includes('UK')) flag = '🇬🇧';
          
          return {
            name,
            href: `/cars?location=${encodeURIComponent(name)}`,
            icon: flag
          };
        }).slice(0, 8);

        setMakes(mappedMakes);
        setVehicleTypes(mappedTypes);
        setLocations(mappedLocations);
      } catch (error) {
        console.error('Error fetching menu data:', error);
        console.log('Using fallback static data for menu');
      } finally {
        setIsLoading(false);
        console.log('Menu data loading complete. isLoading:', false);
      }
    };
    
    fetchMenuData();
  }, []);

  // Create dynamic nav items with fetched data
  // Navigation items with hardcoded values
  const navItems = [
    { name: 'Home', href: `/` },
    { 
      name: 'Cars', 
      href: `/cars`,
      megaMenu: true,
      sections: [
        {
          title: 'Brands',
          items: isLoading ? [
            { name: 'Toyota', href: `/cars?make=Toyota`, icon: '🚗', imageUrl: '/brands/toyota.png' },
            { name: 'Honda', href: `/cars?make=Honda`, icon: '🚗', imageUrl: '/brands/honda.png' },
            { name: 'Nissan', href: `/cars?make=Nissan`, icon: '🚗', imageUrl: '/brands/nissan.png' },
            { name: 'Mazda', href: `/cars?make=Mazda`, icon: '🚗', imageUrl: '/brands/mazda.png' },
            { name: 'Lexus', href: `/cars?make=Lexus`, icon: '🚗', imageUrl: '/brands/lexus.png' },
            { name: 'Subaru', href: `/cars?make=Subaru`, icon: '🚗', imageUrl: '/brands/subaru.png' },
          ] : makes.map(make => ({
            ...make
            // href is already set correctly in the makes array
          })),
          viewAll: { name: 'View All Brands', href: `/cars?filter=makes` }
        },
        {
          title: 'Body Types',
          items: isLoading ? [
            { name: 'Sedan', href: `/cars?bodyType=Sedan`, icon: '🚘' },
            { name: 'SUV', href: `/cars?bodyType=SUV`, icon: '🚙' },
            { name: 'Truck', href: `/cars?bodyType=Truck`, icon: '🛻' },
            { name: 'Van', href: `/cars?bodyType=Van`, icon: '🚐' },
            { name: 'Coupe', href: `/cars?bodyType=Coupe`, icon: '🏎️' },
            { name: 'Convertible', href: `/cars?bodyType=Convertible`, icon: '🚗' },
          ] : vehicleTypes.map(type => ({
            ...type
            // href is already set correctly in the vehicleTypes array
          })),
          viewAll: { name: 'View All Body Types', href: `/cars?filter=types` }
        },
        {
          title: 'From Ports',
          items: isLoading ? [
            { name: 'Japan', href: `/cars?location=Japan`, icon: '🇯🇵' },
            { name: 'Singapore', href: `/cars?location=Singapore`, icon: '🇸🇬' },
            { name: 'Dubai', href: `/cars?location=Dubai`, icon: '🇦🇪' },
          ] : locations.map(location => ({
            ...location
            // href is already set correctly in the locations array
          })),
          viewAll: { name: 'View Schedule', href: `/cars?filter=countries` }
        }
      ]
    },
    { name: 'Auction', href: `/auction` },
    { name: 'About', href: `/about` },
    { name: 'Banking', href: `/banking` },
    { name: 'Contact', href: `/contact` },
    { name: 'FAQ', href: `/faq` },
  ];

  return (
    <>
      {/* Top Bar */}
      <div className="bg-[#212121] text-white py-2 hidden md:block">
        <div className="max-w-[1400px] mx-auto px-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-6 text-sm">
              <div className="flex items-center">
                <MapPin size={14} className="mr-1.5" />
                <span>123 Export Street, Tokyo</span>
              </div>
              <div className="flex items-center">
                <Phone size={14} className="mr-1.5" />
                <span>+81 3-1234-5678</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <LanguageSwitcher />
              
              <div className="h-4 w-px bg-white/30"></div>
              
              <Link href="/login" className="text-sm hover:text-gray-200 transition-colors">
                Login
              </Link>
              <Link href="/register" className="text-sm hover:text-gray-200 transition-colors">
                Register
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Header */}
      <header 
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          isScrolled ? 'bg-[#F4E7E1] shadow-md py-3' : 'bg-[#F4E7E1] py-4'
        }`}
      >
        <div className="max-w-[1400px] mx-auto px-4">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <div className="bg-red-600 text-white rounded-md w-8 h-8 flex items-center justify-center mr-2">
                <span className="font-bold">SS</span>
              </div>
              <div>
                <span className="font-bold text-xl md:text-2xl">Holdings</span>
                <span className="hidden md:inline-block text-xs text-gray-500 ml-2">Global Auto Exports</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              {navItems.map((item, index) => (
                item.megaMenu ? (
                  <div key={item.name} className="relative" onMouseEnter={() => setActiveDropdown(item.name)} onMouseLeave={() => setActiveDropdown(null)}>
                    <button 
                      className={`px-4 py-2 font-medium hover:text-red-600 transition-colors flex items-center ${
                        activeDropdown === item.name ? 'text-red-600' : ''
                      }`}
                    >
                      {item.name}
                      <ChevronDown size={14} className="ml-1" />
                    </button>
                    <AnimatePresence>
                      {activeDropdown === item.name && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          transition={{ duration: 0.2 }}
                          className="absolute left-1/2 transform -translate-x-1/2 top-full mt-1 bg-white shadow-lg rounded-md overflow-hidden border border-gray-100 w-[800px]"
                        >
                          <div className="grid grid-cols-3 gap-0">
                            {item.sections?.map((section, sectionIndex) => (
                              <div key={section.title} className={`p-4 ${sectionIndex < (item.sections?.length || 0) - 1 ? 'border-r border-gray-100' : ''}`}>
                                <h3 className="font-medium text-lg mb-3">{section.title}</h3>
                                <div className="space-y-2">
                                  {section.items.map((subItem) => (
                                    <Link 
                                      key={subItem.name} 
                                      href={subItem.href}
                                      className="flex items-center py-1.5 hover:text-red-600 transition-colors"
                                      onClick={() => setActiveDropdown(null)}
                                    >
                                      {section.title === 'Brands' && subItem.imageUrl ? (
                                        <div className="w-6 h-6 mr-2 flex items-center justify-center">
                                          <Image 
                                            src={subItem.imageUrl}
                                            alt={subItem.name}
                                            width={24}
                                            height={24}
                                            className="max-w-full max-h-full object-contain"
                                            onError={(event) => {
                                              event.currentTarget.style.display = 'none';
                                              const nextElement = event.currentTarget.nextSibling as HTMLElement;
                                              if (nextElement) nextElement.style.display = 'block';
                                            }}
                                          />
                                          <span className="hidden">{subItem.icon}</span>
                                        </div>
                                      ) : (
                                        <span className="mr-2">{subItem.icon}</span>
                                      )}
                                      <span>{subItem.name}</span>
                                    </Link>
                                  ))}
                                  {section.viewAll && (
                                    <div className="pt-2 mt-2 border-t border-gray-100">
                                      <Link 
                                        href={section.viewAll.href}
                                        className="text-blue-600 hover:text-blue-800 text-sm"
                                        onClick={() => setActiveDropdown(null)}
                                      >
                                        {section.viewAll.name}
                                      </Link>
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <Link 
                    key={item.name} 
                    href={item.href} 
                    className="px-4 py-2 font-medium hover:text-red-600 transition-colors"
                  >
                    {item.name}
                  </Link>
                )
              ))}
            </nav>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center space-x-3">
              <Button 
                asChild
                className="bg-red-600 hover:bg-red-700 text-white rounded-md"
              >
                <Link href="/contact" className="flex items-center">
                  Get Quote
                </Link>
              </Button>
            </div>

            {/* Mobile Menu */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="md:hidden">
                  {isMobileMenuOpen ? (
                    <X size={20} />
                  ) : (
                    <Menu size={20} />
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] p-0">
                <div className="flex flex-col h-full">
                  <div className="p-4 border-b border-gray-100">
                    <div className="flex items-center">
                      <div className="bg-red-600 text-white rounded-md w-8 h-8 flex items-center justify-center mr-2">
                        <span className="font-bold">S</span>
                      </div>
                      <div>
                        <span className="font-bold text-xl">SS Holdings</span>
                        <span className="block text-xs text-gray-500">Global Auto Exports</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex-1 overflow-auto py-6 px-4">
                    <nav className="flex flex-col space-y-1">
                      {navItems.map((item, index) => (
                        <div key={item.name}>
                          {item.megaMenu ? (
                            <div className="py-2">
                              <button 
                                onClick={() => setActiveDropdown(activeDropdown === item.name ? null : item.name)}
                                className="flex items-center justify-between w-full font-medium text-lg px-2 py-2"
                              >
                                {item.name}
                                <ChevronDown 
                                  size={18} 
                                  className={`transition-transform duration-200 ${
                                    activeDropdown === item.name ? 'rotate-180' : ''
                                  }`} 
                                />
                              </button>
                              
                              <AnimatePresence>
                                {activeDropdown === item.name && (
                                  <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="overflow-hidden"
                                  >
                                    {item.sections?.map((section, sectionIndex) => (
                                      <div key={section.title} className="mt-2">
                                        <h4 className="font-medium text-base px-2 py-1 bg-gray-50">{section.title}</h4>
                                        <div className="pl-4 py-2 border-l-2 border-gray-100 ml-2 space-y-2">
                                          {section.items.map((subItem) => (
                                            <Link 
                                              key={subItem.name} 
                                              href={subItem.href}
                                              className="flex items-center py-1.5 text-base text-gray-600 hover:text-red-600"
                                              onClick={() => setIsMobileMenuOpen(false)}
                                            >
                                              {section.title === 'Brands' && subItem.imageUrl ? (
                                                <div className="w-6 h-6 mr-2 flex items-center justify-center">
                                                  <Image 
                                                    src={subItem.imageUrl}
                                                    alt={subItem.name}
                                                    width={24}
                                                    height={24}
                                                    className="max-w-full max-h-full object-contain"
                                                    onError={(event) => {
                                                      event.currentTarget.style.display = 'none';
                                                      const nextElement = event.currentTarget.nextSibling as HTMLElement;
                                                      if (nextElement) nextElement.style.display = 'block';
                                                    }}
                                                  />
                                                  <span className="hidden">{subItem.icon}</span>
                                                </div>
                                              ) : (
                                                <span className="mr-2">{subItem.icon}</span>
                                              )}
                                              <span>{subItem.name}</span>
                                            </Link>
                                          ))}
                                          {section.viewAll && (
                                            <div className="pt-2 mt-2 border-t border-gray-100">
                                              <Link 
                                                href={section.viewAll.href}
                                                className="flex items-center py-1.5 text-blue-600 hover:text-blue-800"
                                                onClick={() => setIsMobileMenuOpen(false)}
                                              >
                                                <span>{section.viewAll.name}</span>
                                              </Link>
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    ))}
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          ) : (
                            <Link 
                              href={item.href} 
                              className="font-medium text-lg px-2 py-3 block hover:text-red-600"
                              onClick={() => setIsMobileMenuOpen(false)}
                            >
                              {item.name}
                            </Link>
                          )}
                        </div>
                      ))}
                    </nav>
                    
                    <div className="mt-8 border-t border-gray-100 pt-6">
                      <LanguageSwitcher variant="mobile" />
                    </div>
                  </div>
                  
                  <div className="p-4 border-t border-gray-100">
                    <Button asChild className="w-full bg-red-600 hover:bg-red-700">
                      <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)}>
                        {t('navigation.getQuote')}
                      </Link>
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
    </>
  );
} 