'use client';

import React from 'react';
import Link from 'next/link';
import CarCard from '@/components/car/CarCard';
import { ArrowRight } from 'lucide-react';

// Define the car type
interface Car {
  id: string;
  title: string;
  stockNumber?: string;
  price: number;
  year: number;
  make: string;
  model: string;
  mileage?: number | string;
  mileageUnit?: 'km' | 'miles';
  transmission: string;
  fuel: string;
  status?: 'in-stock' | 'sold';
  imageUrl?: string;
  location?: string;
  bodyType?: string;
  featured?: boolean;
}

interface FeaturedCarsProps {
  title?: string;
  subtitle?: string;
  cars: Car[];
}

export default function FeaturedCars({ 
  title = "Featured Vehicles", 
  subtitle = "Explore our selection of premium vehicles available for export worldwide",
  cars = [] 
}: FeaturedCarsProps) {
  // Don't render the component if there are no cars
  if (!cars || cars.length === 0) {
    return null;
  }
  
  return (
    <section className="py-10 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold mb-1">{title}</h2>
            <p className="text-gray-600 text-sm">
              {subtitle}
            </p>
          </div>
          <Link 
            href="/cars" 
            className="text-[#4a89dc] hover:text-blue-700 text-sm font-medium flex items-center"
          >
            View All
            <ArrowRight className="h-4 w-4 ml-1" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {cars.map((car) => (
            <div 
              key={car.id} 
              className="overflow-hidden rounded-lg border border-gray-100 shadow-sm"
              style={{ maxHeight: '320px' }}
            >
              <CarCard key={car.id} car={car} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 