'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight } from 'lucide-react';
import { getOptionsByCategory, Option } from '@/services/optionsAPI';
import { updateImageUrl } from '@/lib/utils';

interface BrandWithCount {
  name: string;
  logo: string;
  svgLogo?: string;
  count: number;
}

interface CategoryProps {
  title: string;
  items: {
    name: string;
    href: string;
    icon?: React.ReactNode;
    count?: number;
  }[];
  defaultOpen?: boolean;
}

const Category: React.FC<CategoryProps> = ({ title, items, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  return (
    <div className="border-b border-gray-200">
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="flex items-center justify-between w-full py-3 px-4 text-left font-medium text-gray-800 hover:bg-gray-50"
      >
        <span className="flex items-center gap-2">
          <ChevronRight 
            className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-90' : ''}`} 
          />
          {title}
        </span>
      </button>
      
      {isOpen && (
        <div className="pl-6">
          {items.map((item, index) => (
            <Link 
              key={index} 
              href={item.href}
              className="flex items-center py-2 px-4 hover:bg-gray-50 text-sm text-gray-700"
            >
              {item.icon && (
                <span className="mr-3">{item.icon}</span>
              )}
              <span className="flex-grow">{item.name}</span>
              {item.count !== undefined && (
                <span className="text-gray-500 text-xs">({item.count.toLocaleString()})</span>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

interface BrandsSidebarProps {
  initialBrands?: BrandWithCount[];
}

export default function BrandsSidebar({ initialBrands = [] }: BrandsSidebarProps) {
  const [brands, setBrands] = useState<BrandWithCount[]>(initialBrands);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        setLoading(true);
        const makesData = await getOptionsByCategory('makes');
        
        // Transform the options data into the BrandWithCount format
        const brandsData: BrandWithCount[] = makesData.map(make => ({
          name: make.name,
          // Use the imageUrl from the option if available, otherwise use a fallback
          logo: make.imageUrl || `/brands/${make.name.toLowerCase()}.png`,
          // Use the svgUrl if available
          svgLogo: make.svgUrl || `/brands/${make.name.toLowerCase()}.svg`,
          // For now, we don't have count data, so we'll use 0
          count: 0
        }));
        
        setBrands(brandsData);
      } catch (error) {
        console.error('Error fetching brands:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBrands();
  }, []);
  
  const vehicleTypes = [
    { name: 'Sedan', href: '/cars?type=sedan' },
    { name: 'SUV', href: '/cars?type=suv' },
    { name: 'Truck', href: '/cars?type=truck' },
    { name: 'Van', href: '/cars?type=van' },
    { name: 'Mini Van', href: '/cars?type=mini-van' },
    { name: 'Commercial', href: '/cars?type=commercial' },
    { name: 'Agricultural', href: '/cars?type=agricultural' }
  ];
  
  return (
    <div className="bg-white shadow-md rounded-r-md rounded-l-none overflow-hidden w-full">
      <div className="bg-[#1a3d50] text-white py-3 px-4 font-medium flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
        </svg>
        Shop By Make
      </div>
      
      {loading ? (
        <div className="p-4 text-center">
          <div className="animate-pulse flex space-x-4">
            <div className="flex-1 space-y-4 py-1">
              <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3 mx-auto"></div>
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-2">Loading brands...</p>
        </div>
      ) : brands && brands.length > 0 ? (
        <>
          <div className="divide-y divide-gray-200">
            {brands.slice(0, 10).map((brand) => (
              <Link 
                key={brand.name} 
                href={`/cars?make=${encodeURIComponent(brand.name.toLowerCase())}`}
                className="flex items-center py-2 px-4 hover:bg-gray-50 transition-colors"
              >
                <div className="w-8 h-8 flex-shrink-0 mr-3 flex items-center justify-center">
                  {/* Try to use SVG first, then fallback to regular image */}
                  {brand.svgLogo ? (
                    <img 
                      src={updateImageUrl(brand.svgLogo)}
                      alt={brand.name} 
                      className="w-5 h-5 object-contain"
                      onError={(e) => {
                        // If SVG fails, try the regular logo
                        const target = e.currentTarget;
                        if (brand.logo) {
                          target.src = updateImageUrl(brand.logo);
                        } else {
                          // If both fail, use a fallback car icon
                          target.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWNhciI+PHBhdGggZD0iTTE5IDE3aDJjLjYgMCAxLS40IDEtMXYtM2MwLS42LS40LTEtMS0xaC0yIi8+PHBhdGggZD0iTTUtM2g0bDIuNjkgNS4zOWEyIDIgMCAwIDAgMS43OSAxLjA5aDQuNmEyIDIgMCAwIDEgMiAyLjM0bC0uOCA0QTIgMiAwIDAgMSAxNy41IDE3SDJjLS41LTEuNS0uNS0yIDEtMmgxMiIvPjxwYXRoIGQ9Ik05IDE3SDZhMSAxIDAgMCAxLTEtMXYtMWExIDEgMCAwIDEgMS0xaDMiLz48Y2lyY2xlIGN4PSI1IiBjeT0iMTciIHI9IjIiLz48Y2lyY2xlIGN4PSIxNSIgY3k9IjE3IiByPSIyIi8+PC9zdmc+';
                        }
                      }}
                    />
                  ) : brand.logo ? (
                    <img 
                      src={updateImageUrl(brand.logo)}
                      alt={brand.name} 
                      className="w-5 h-5 object-contain"
                      onError={(e) => {
                        // If the image fails to load, use a fallback
                        e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWNhciI+PHBhdGggZD0iTTE5IDE3aDJjLjYgMCAxLS40IDEtMXYtM2MwLS42LS40LTEtMS0xaC0yIi8+PHBhdGggZD0iTTUtM2g0bDIuNjkgNS4zOWEyIDIgMCAwIDAgMS43OSAxLjA5aDQuNmEyIDIgMCAwIDEgMiAyLjM0bC0uOCA0QTIgMiAwIDAgMSAxNy41IDE3SDJjLS41LTEuNS0uNS0yIDEtMmgxMiIvPjxwYXRoIGQ9Ik05IDE3SDZhMSAxIDAgMCAxLTEtMXYtMWExIDEgMCAwIDEgMS0xaDMiLz48Y2lyY2xlIGN4PSI1IiBjeT0iMTciIHI9IjIiLz48Y2lyY2xlIGN4PSIxNSIgY3k9IjE3IiByPSIyIi8+PC9zdmc+';
                      }}
                    />
                  ) : (
                    // Fallback car icon
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-car">
                      <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.6-.4-1-1-1h-2"/>
                      <path d="M5 17H3c-.6 0-1-.4-1-1v-3c0-.6.4-1 1-1h2"/>
                      <path d="M14 17H9"/>
                      <path d="M21 9l-3-6H7L4 9h17Z"/>
                      <path d="M9 9H4l1 4h14l1-4h-5"/>
                      <circle cx="5" cy="17" r="2"/>
                      <circle cx="19" cy="17" r="2"/>
                    </svg>
                  )}
                </div>
                <div className="flex-grow text-sm">
                  {brand.name}
                </div>
                {brand.count > 0 && (
                  <div className="text-gray-500 text-xs">
                    ({brand.count.toLocaleString()})
                  </div>
                )}
              </Link>
            ))}
          </div>
          
          <div className="p-3 text-center border-t border-gray-200">
            <Link 
              href="/cars" 
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              View All Makes
            </Link>
            <div className="text-xs text-gray-500 mt-1">
              Explore our complete collection
            </div>
          </div>
        </>
      ) : (
        <div className="p-4 text-center text-gray-500">
          <p className="text-sm">No brands available</p>
        </div>
      )}
      
      <Category 
        title="Shop By Type" 
        items={vehicleTypes}
      />
    </div>
  );
} 