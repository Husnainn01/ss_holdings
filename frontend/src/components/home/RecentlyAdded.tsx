'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import CarCard from '@/components/car/CarCard';
import { ArrowRight, Clock, RefreshCw } from 'lucide-react';
import { motion, Variants } from 'framer-motion';
import { Button } from '@/components/ui/button';

interface Car {
  id: string;
  title: string;
  make: string;
  model: string;
  year: number;
  price: number;
  stockNumber?: string;
  transmission: string;
  fuel: string;
  mileage?: number | string;
  mileageUnit?: 'km' | 'miles';
  imageUrl?: string;
  status?: 'in-stock' | 'sold';
  location?: string;
  bodyType?: string;
  featured?: boolean;
}

interface RecentlyAddedProps {
  cars: Car[];
  title?: string;
  showViewMore?: boolean;
}

export default function RecentlyAdded({ 
  cars = [], 
  title = "Recently Added", 
  showViewMore = true 
}: RecentlyAddedProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  // Animation variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  console.log('RecentlyAdded component received cars:', cars);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="bg-gradient-to-r from-[#1a3d50] to-[#2c5878] px-5 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 rounded-full p-2">
            <Clock className="h-4 w-4 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">{title} ({cars.length})</h2>
            <p className="text-xs text-white/70">Discover our latest inventory additions</p>
          </div>
        </div>
        
        {showViewMore && (
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              asChild
              variant="secondary"
              size="sm"
              className="bg-white/10 hover:bg-white/20 text-white border-0 backdrop-blur-sm"
            >
              <Link href="/cars" className="flex items-center gap-1 text-xs font-medium">
                View All Inventory
                <ArrowRight className="h-3 w-3" />
              </Link>
            </Button>
          </motion.div>
        )}
      </div>
      
      <div className="p-4">
        {cars && cars.length > 0 ? (
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {cars.map((car) => (
              <motion.div 
                key={car.id} 
                variants={itemVariants} 
                className="overflow-hidden rounded-lg border border-gray-100 shadow-sm"
                style={{ maxHeight: '320px' }}
              >
                <CarCard car={car} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="py-8 text-center text-gray-500">
            <p>No vehicles found. Check back soon for new inventory!</p>
          </div>
        )}
        
        {cars && cars.length > 0 && cars.length > 4 && (
          <motion.div 
            className="mt-6 flex justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Button 
              variant="outline" 
              size="sm" 
              className="text-[#1a3d50] border-[#1a3d50] hover:bg-[#1a3d50] hover:text-white"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <RefreshCw className={`h-3.5 w-3.5 mr-2 ${isHovered ? 'animate-spin' : ''}`} />
              Load More Vehicles
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
} 