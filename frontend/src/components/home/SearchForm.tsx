'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Search, Filter, ChevronRight, Car, Calendar, CreditCard, Gauge } from "lucide-react";
import { motion } from "framer-motion";

interface SearchFormProps {
  className?: string;
}

export default function SearchForm({ className }: SearchFormProps) {
  const router = useRouter();
  const [isAdvancedSearch, setIsAdvancedSearch] = useState(false);
  const [searchParams, setSearchParams] = useState({
    make: '',
    model: '',
    steering: '',
    type: '',
    priceRange: '',
    yearFrom: '',
    yearTo: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSearchParams(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Filter out empty values
    const params = new URLSearchParams();
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value) {
        params.append(key, value);
      }
    });
    
    router.push(`/cars?${params.toString()}`);
  };

  const toggleAdvancedSearch = () => {
    setIsAdvancedSearch(!isAdvancedSearch);
  };

  const formVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className={`bg-gradient-to-r from-[#1a3d50] to-[#2c5878] rounded-lg shadow-lg overflow-hidden ${className}`}>
      <div className="bg-[#162e3d] px-5 py-3 flex items-center justify-between">
        <div className="flex items-center text-white">
          <Search className="mr-2 h-5 w-5 text-blue-300" />
          <h2 className="text-lg font-medium">Find Your Perfect Car</h2>
        </div>
        <button 
          onClick={toggleAdvancedSearch}
          className="flex items-center text-xs text-white/80 hover:text-white transition-colors"
        >
          <Filter className="mr-1 h-3.5 w-3.5" />
          {isAdvancedSearch ? 'Simple Search' : 'Advanced Search'}
        </button>
      </div>
      
      <div className="p-5">
        <motion.form 
          onSubmit={handleSubmit}
          variants={formVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-5">
            <motion.div variants={itemVariants} className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Car className="h-4 w-4" />
              </div>
              <select
                id="make"
                name="make"
                value={searchParams.make}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-200 py-2.5 pl-10 pr-8 text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="">Select Make</option>
                <option value="toyota">Toyota</option>
                <option value="honda">Honda</option>
                <option value="nissan">Nissan</option>
                <option value="mazda">Mazda</option>
                <option value="suzuki">Suzuki</option>
                <option value="mitsubishi">Mitsubishi</option>
              </select>
              <label htmlFor="make" className="absolute -top-2 left-2 text-xs font-medium bg-white px-1 text-gray-600">
                Make
              </label>
            </motion.div>
            
            <motion.div variants={itemVariants} className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Car className="h-4 w-4" />
              </div>
              <select
                id="model"
                name="model"
                value={searchParams.model}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-200 py-2.5 pl-10 pr-8 text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="">Select Model</option>
                <option value="camry">Camry</option>
                <option value="corolla">Corolla</option>
                <option value="civic">Civic</option>
                <option value="accord">Accord</option>
              </select>
              <label htmlFor="model" className="absolute -top-2 left-2 text-xs font-medium bg-white px-1 text-gray-600">
                Model
              </label>
            </motion.div>
            
            <motion.div variants={itemVariants} className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Calendar className="h-4 w-4" />
              </div>
              <select
                id="yearFrom"
                name="yearFrom"
                value={searchParams.yearFrom}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-200 py-2.5 pl-10 pr-8 text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="">Any Year</option>
                {Array.from({ length: 24 }, (_, i) => 2000 + i).map(year => (
                  <option key={year} value={year.toString()}>
                    {year}
                  </option>
                ))}
              </select>
              <label htmlFor="yearFrom" className="absolute -top-2 left-2 text-xs font-medium bg-white px-1 text-gray-600">
                Year
              </label>
            </motion.div>
          </div>
          
          {isAdvancedSearch && (
            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <Gauge className="h-4 w-4" />
                </div>
                <select
                  id="steering"
                  name="steering"
                  value={searchParams.steering}
                  onChange={handleChange}
                  className="w-full rounded-md border border-gray-200 py-2.5 pl-10 pr-8 text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option value="">Any Steering</option>
                  <option value="left">Left Hand Drive</option>
                  <option value="right">Right Hand Drive</option>
                </select>
                <label htmlFor="steering" className="absolute -top-2 left-2 text-xs font-medium bg-white px-1 text-gray-600">
                  Steering
                </label>
              </div>
              
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <Car className="h-4 w-4" />
                </div>
                <select
                  id="type"
                  name="type"
                  value={searchParams.type}
                  onChange={handleChange}
                  className="w-full rounded-md border border-gray-200 py-2.5 pl-10 pr-8 text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option value="">Any Type</option>
                  <option value="sedan">Sedan</option>
                  <option value="suv">SUV</option>
                  <option value="truck">Truck</option>
                  <option value="van">Van</option>
                </select>
                <label htmlFor="type" className="absolute -top-2 left-2 text-xs font-medium bg-white px-1 text-gray-600">
                  Type
                </label>
              </div>
              
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <CreditCard className="h-4 w-4" />
                </div>
                <select
                  id="priceRange"
                  name="priceRange"
                  value={searchParams.priceRange}
                  onChange={handleChange}
                  className="w-full rounded-md border border-gray-200 py-2.5 pl-10 pr-8 text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option value="">Any Price</option>
                  <option value="0-5000">$0 - $5,000</option>
                  <option value="5000-10000">$5,000 - $10,000</option>
                  <option value="10000-15000">$10,000 - $15,000</option>
                  <option value="15000+">$15,000+</option>
                </select>
                <label htmlFor="priceRange" className="absolute -top-2 left-2 text-xs font-medium bg-white px-1 text-gray-600">
                  Price Range
                </label>
              </div>
            </motion.div>
          )}
          
          <div className="flex justify-between items-center">
            <div className="text-white text-xs bg-blue-500/20 px-3 py-1 rounded-full">
              <span className="font-semibold">12</span> cars match your criteria
            </div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button 
                type="submit" 
                className="bg-red-600 hover:bg-red-700 text-white text-sm py-2 px-6 rounded-md flex items-center"
              >
                Search Now
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </motion.div>
          </div>
        </motion.form>
      </div>
    </div>
  );
} 