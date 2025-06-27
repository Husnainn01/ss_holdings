'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight } from 'lucide-react';

interface BrandWithCount {
  name: string;
  logo: string;
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
  brands: BrandWithCount[];
}

export default function BrandsSidebar({ brands }: BrandsSidebarProps) {
  const carMakes = brands.map(brand => ({
    name: brand.name,
    href: `/cars?make=${encodeURIComponent(brand.name.toLowerCase())}`,
    count: brand.count
  }));
  
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
      
      <div className="divide-y divide-gray-200">
        {brands.slice(0, 10).map((brand) => (
          <Link 
            key={brand.name} 
            href={`/cars?make=${encodeURIComponent(brand.name.toLowerCase())}`}
            className="flex items-center py-2 px-4 hover:bg-gray-50 transition-colors"
          >
            <div className="w-8 h-8 flex-shrink-0 mr-3 flex items-center justify-center">
              <Image 
                src={brand.logo} 
                alt={brand.name} 
                width={20} 
                height={20} 
                className="object-contain"
              />
            </div>
            <div className="flex-grow text-sm">
              {brand.name}
            </div>
            <div className="text-gray-500 text-xs">
              ({brand.count.toLocaleString()})
            </div>
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
      
      <Category 
        title="Shop By Type" 
        items={vehicleTypes}
      />
    </div>
  );
} 