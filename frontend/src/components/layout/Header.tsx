"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Phone, Menu, X, ChevronDown, Globe, MapPin } from 'lucide-react';
import Image from 'next/image';
import { LanguageSwitcher } from '@/components/ui/language-switcher';
import { useTranslation } from '@/app/i18n/client';
import { useLanguage } from '@/components/providers/LanguageProvider';

interface MenuItem {
  name: string;
  href: string;
}

interface MegaMenuItem {
  name: string;
  href: string;
  icon: string;
  imageUrl?: string;
}

interface MegaMenuSection {
  title: string;
  items: MegaMenuItem[];
  viewAll?: {
    name: string;
    href: string;
  };
}

interface NavItem {
  name: string;
  href: string;
  megaMenu?: boolean;
  sections?: MegaMenuSection[];
}

const MegaMenu = ({ sections }: { sections: MegaMenuSection[] }) => {
  return (
    <div className="absolute left-1/2 -translate-x-1/2 top-full mt-1 w-screen max-w-5xl bg-white rounded-lg shadow-lg overflow-hidden z-50">
      <div className="grid grid-cols-3 gap-2 p-4">
        {sections.map((section, index) => (
          <div key={index} className="p-2">
            <h3 className="text-lg font-semibold mb-3 text-gray-800">{section.title}</h3>
            <ul className="space-y-2">
              {section.items.map((item, idx) => (
                <li key={idx}>
                  <Link href={item.href} className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-md transition-colors">
                    {item.imageUrl ? (
                      <Image 
                        src={item.imageUrl}
                        width={20}
                        height={20}
                        alt={item.name}
                        className="w-5 h-5 object-contain"
                        onError={(e) => {
                          // Fallback to emoji if image fails to load
                          e.currentTarget.style.display = 'none';
                          const parent = e.currentTarget.parentElement;
                          if (parent) {
                            const span = document.createElement('span');
                            span.textContent = item.icon;
                            span.className = 'w-5 h-5 flex items-center justify-center';
                            parent.insertBefore(span, parent.firstChild);
                          }
                        }}
                      />
                    ) : (
                      <span className="w-5 h-5 flex items-center justify-center">{item.icon}</span>
                    )}
                    <span>{item.name}</span>
                  </Link>
                </li>
              ))}
              {section.viewAll && (
                <li className="mt-4">
                  <Link 
                    href={section.viewAll.href} 
                    className="flex items-center justify-center w-full p-2 text-sm text-blue-600 hover:bg-blue-50 rounded-md transition-colors border border-blue-200"
                  >
                    {section.viewAll.name}
                  </Link>
                </li>
              )}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function Header() {
  const { currentLanguage } = useLanguage();
  const { t } = useTranslation(currentLanguage);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  
  // State for dynamic data
  const [makes, setMakes] = useState<MegaMenuItem[]>([]);
  const [vehicleTypes, setVehicleTypes] = useState<MegaMenuItem[]>([]);
  const [locations, setLocations] = useState<MegaMenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Add scroll event listener
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
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
        setIsLoading(true);
        
        // Fetch makes
        const makesResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api'}/options/category/makes`);
        const makesData = await makesResponse.json();
        
        // Fetch body types
        const typesResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api'}/options/category/bodyTypes`);
        const typesData = await typesResponse.json();
        
        // Fetch locations
        const locationsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api'}/vehicles/locations/list`);
        const locationsData = await locationsResponse.json();
        
        // Map makes data to menu items with images - limit to 8
        const mappedMakes = makesData.data.map((make: any) => {
          // Use SVG if available, otherwise use image or fallback
          const imageUrl = make.svgUrl || make.imageUrl || `/brands/${make.name.toLowerCase()}.svg`;
          
                      return {
              name: make.name,
              href: `/${currentLanguage}/cars?make=${encodeURIComponent(make.name)}`,
              icon: '🚗', // Default icon as fallback
              imageUrl: imageUrl // Add image URL for brand logo
            };
        }).slice(0, 8);
        
        // Map types data to menu items - limit to 8
        const mappedTypes = typesData.data.map((type: any) => {
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
            href: `/${currentLanguage}/cars?bodyType=${encodeURIComponent(type.name)}`,
            icon
          };
        }).slice(0, 8);
        
        // Map locations data to menu items with flags - limit to 8
        const mappedLocations = locationsData.map((location: any) => {
          // Map common countries to flag emojis
          let flag = '🏳️';
          if (location.name.includes('Japan')) flag = '🇯🇵';
          else if (location.name.includes('Singapore')) flag = '🇸🇬';
          else if (location.name.includes('Dubai') || location.name.includes('UAE')) flag = '🇦🇪';
          else if (location.name.includes('Thailand')) flag = '🇹🇭';
          else if (location.name.includes('Korea')) flag = '🇰🇷';
          else if (location.name.includes('Australia')) flag = '🇦🇺';
          else if (location.name.includes('New Zealand')) flag = '🇳🇿';
          else if (location.name.includes('Canada')) flag = '🇨🇦';
          else if (location.name.includes('United States') || location.name.includes('USA')) flag = '🇺🇸';
          else if (location.name.includes('United Kingdom') || location.name.includes('UK')) flag = '🇬🇧';
          
          return {
            name: location.name,
            href: `/${currentLanguage}/cars?location=${encodeURIComponent(location.name)}`,
            icon: flag
          };
        }).slice(0, 8);
        
        setMakes(mappedMakes);
        setVehicleTypes(mappedTypes);
        setLocations(mappedLocations);
      } catch (error) {
        console.error('Error fetching menu data:', error);
        // Fallback to static data if API fails
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMenuData();
  }, [currentLanguage]);

  // Create dynamic nav items with fetched data
  const navItems: NavItem[] = [
    { name: t('navigation.home'), href: `/${currentLanguage}` },
    { 
      name: t('navigation.cars'), 
      href: `/${currentLanguage}/cars`,
      megaMenu: true,
      sections: [
        {
          title: t('brands.title'),
          items: isLoading ? [
            { name: 'Toyota', href: `/${currentLanguage}/cars?make=Toyota`, icon: '🚗', imageUrl: '/brands/toyota.svg' },
            { name: 'Honda', href: `/${currentLanguage}/cars?make=Honda`, icon: '🚗', imageUrl: '/brands/honda.svg' },
            { name: 'Nissan', href: `/${currentLanguage}/cars?make=Nissan`, icon: '🚗', imageUrl: '/brands/nissan.svg' },
          ] : makes.map(make => ({
            ...make,
            href: `/${currentLanguage}/cars?make=${encodeURIComponent(make.name.replace(`/${currentLanguage}/cars?make=`, ''))}`
          })),
          viewAll: { name: t('brands.viewAll'), href: `/${currentLanguage}/cars?filter=makes` }
        },
        {
          title: t('search.bodyType'),
          items: isLoading ? [
            { name: 'Sedan', href: `/${currentLanguage}/cars?bodyType=Sedan`, icon: '🚘' },
            { name: 'SUV', href: `/${currentLanguage}/cars?bodyType=SUV`, icon: '🚙' },
            { name: 'Truck', href: `/${currentLanguage}/cars?bodyType=Truck`, icon: '🚚' },
          ] : vehicleTypes.map(type => ({
            ...type,
            href: `/${currentLanguage}/cars?bodyType=${encodeURIComponent(type.name.replace(`/${currentLanguage}/cars?bodyType=`, ''))}`
          })),
          viewAll: { name: t('search.allBodyTypes'), href: `/${currentLanguage}/cars?filter=types` }
        },
        {
          title: t('shipping.fromPort'),
          items: isLoading ? [
            { name: 'Japan', href: `/${currentLanguage}/cars?location=Japan`, icon: '🇯🇵' },
            { name: 'Singapore', href: `/${currentLanguage}/cars?location=Singapore`, icon: '🇸🇬' },
            { name: 'Dubai', href: `/${currentLanguage}/cars?location=Dubai`, icon: '🇦🇪' },
          ] : locations.map(location => ({
            ...location,
            href: `/${currentLanguage}/cars?location=${encodeURIComponent(location.name.replace(`/${currentLanguage}/cars?location=`, ''))}`
          })),
          viewAll: { name: t('shipping.viewSchedule'), href: `/${currentLanguage}/cars?filter=countries` }
        }
      ]
    },
    { name: t('navigation.auction'), href: `/${currentLanguage}/auction` },
    { name: t('navigation.about'), href: `/${currentLanguage}/about` },
    { name: t('navigation.banking'), href: `/${currentLanguage}/banking` },
    { name: t('navigation.contact'), href: `/${currentLanguage}/contact` },
    { name: t('navigation.faq'), href: `/${currentLanguage}/faq` },
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
                <span>{t('footer.address')}</span>
              </div>
              <div className="flex items-center">
                <Phone size={14} className="mr-1.5" />
                <span>{t('footer.phone')}</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <LanguageSwitcher />
              
              <div className="h-4 w-px bg-white/30"></div>
              
              <Link href={`/${currentLanguage}/login`} className="text-sm hover:text-gray-200 transition-colors">
                {t('navigation.login')}
              </Link>
              <Link href={`/${currentLanguage}/register`} className="text-sm hover:text-gray-200 transition-colors">
                {t('navigation.register')}
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
            <Link href={`/${currentLanguage}`} className="flex items-center">
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
                                  {section.items.map((subItem, subIndex) => (
                                    <Link 
                                      key={subItem.name} 
                                      href={subItem.href}
                                      className="flex items-center py-1.5 hover:text-red-600 transition-colors"
                                      onClick={() => setActiveDropdown(null)}
                                    >
                                      {section.title === t('brands.title') && subItem.imageUrl ? (
                                        <div className="w-6 h-6 mr-2 flex items-center justify-center">
                                          <img 
                                            src={subItem.imageUrl}
                                            alt={subItem.name}
                                            className="max-w-full max-h-full object-contain"
                                            onError={(e) => {
                                              e.currentTarget.style.display = 'none';
                                              const nextElement = e.currentTarget.nextSibling as HTMLElement;
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
                <Link href={`/${currentLanguage}/contact`} className="flex items-center">
                  {t('navigation.getQuote')}
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
                                          {section.items.map((subItem, subIndex) => (
                                            <Link 
                                              key={subItem.name} 
                                              href={subItem.href}
                                              className="flex items-center py-1.5 text-base text-gray-600 hover:text-red-600"
                                              onClick={() => setIsMobileMenuOpen(false)}
                                            >
                                              {section.title === t('brands.title') && subItem.imageUrl ? (
                                                <div className="w-6 h-6 mr-2 flex items-center justify-center">
                                                  <img 
                                                    src={subItem.imageUrl}
                                                    alt={subItem.name}
                                                    className="max-w-full max-h-full object-contain"
                                                    onError={(e) => {
                                                      e.currentTarget.style.display = 'none';
                                                      const nextElement = e.currentTarget.nextSibling as HTMLElement;
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
                      <Link href={`/${currentLanguage}/contact`} onClick={() => setIsMobileMenuOpen(false)}>
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