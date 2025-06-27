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

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

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

  const navItems = [
    { name: 'Home', href: '/' },
    { 
      name: 'Cars', 
      href: '/cars',
      dropdown: [
        { name: 'All Cars', href: '/cars' },
        { name: 'JDM Cars', href: '/cars?category=jdm' },
        { name: 'Luxury Cars', href: '/cars?category=luxury' },
        { name: 'SUVs', href: '/cars?category=suv' },
      ]
    },
    { name: 'About Us', href: '/about' },
    { name: 'Contact', href: '/contact' },
    { name: 'FAQ', href: '/faq' },
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
                <span>123 Export Ave, New York, NY 10001</span>
              </div>
              <div className="flex items-center">
                <Phone size={14} className="mr-1.5" />
                <span>+1 (555) 123-4567</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="link" size="sm" className="text-white p-0 flex items-center">
                    <Globe size={14} className="mr-1.5" />
                    <span>English</span>
                    <ChevronDown size={14} className="ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>English</DropdownMenuItem>
                  <DropdownMenuItem>Japanese</DropdownMenuItem>
                  <DropdownMenuItem>Arabic</DropdownMenuItem>
                  <DropdownMenuItem>Spanish</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
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
                <span className="font-bold">S</span>
              </div>
              <div>
                <span className="font-bold text-xl md:text-2xl">SS Holdings</span>
                <span className="hidden md:inline-block text-xs text-gray-500 ml-2">Global Auto Exports</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => (
                item.dropdown ? (
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
                          className="absolute left-0 top-full mt-1 bg-white shadow-lg rounded-md overflow-hidden w-48 border border-gray-100"
                        >
                          <div className="py-1">
                            {item.dropdown.map((subItem) => (
                              <Link 
                                key={subItem.name} 
                                href={subItem.href}
                                className="block px-4 py-2 text-sm hover:bg-gray-50 hover:text-red-600"
                              >
                                {subItem.name}
                              </Link>
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
              <Button variant="outline" size="sm" className="rounded-full w-10 h-10 p-0">
                <Search size={18} />
              </Button>
              
              <Button 
                asChild
                className="bg-red-600 hover:bg-red-700 text-white rounded-md"
              >
                <Link href="/contact" className="flex items-center">
                  Get a Quote
                </Link>
              </Button>
            </div>

            {/* Mobile Menu Button */}
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
                      {navItems.map((item) => (
                        <div key={item.name}>
                          {item.dropdown ? (
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
                                    <div className="pl-4 py-2 border-l-2 border-gray-100 ml-2 space-y-2">
                                      {item.dropdown.map((subItem) => (
                                        <Link 
                                          key={subItem.name} 
                                          href={subItem.href}
                                          className="block py-1.5 text-base text-gray-600 hover:text-red-600"
                                          onClick={() => setIsMobileMenuOpen(false)}
                                        >
                                          {subItem.name}
                                        </Link>
                                      ))}
                                    </div>
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
                      <p className="text-sm text-gray-500 mb-2 px-2">Language</p>
                      <div className="flex flex-wrap gap-2 px-2">
                        <Button variant="outline" size="sm">English</Button>
                        <Button variant="outline" size="sm">Japanese</Button>
                        <Button variant="outline" size="sm">Arabic</Button>
                        <Button variant="outline" size="sm">Spanish</Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 border-t border-gray-100">
                    <Button asChild className="w-full bg-red-600 hover:bg-red-700">
                      <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)}>Get a Quote</Link>
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