'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Search, Filter, ChevronRight, Car, Calendar, CreditCard, Gauge, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { vehicleAPI } from '@/services/api';
import { getOptionsByCategory, Option } from '@/services/optionsAPI';
import config from '@/config';
// Removed language-related imports

interface SearchFormProps {
  className?: string;
}

// Simple translation function that returns hardcoded values
const t = (key: string) => {
  const translations: Record<string, string> = {
    'common.loading': 'Loading...',
    'search.title': 'Search Vehicles',
    'search.selectMake': 'Select Make',
    'search.make': 'Make',
    'search.selectModel': 'Select Model',
    'search.model': 'Model',
    'search.selectYear': 'Select Year',
    'search.year': 'Year',
    'search.selectBodyType': 'Select Body Type',
    'search.bodyType': 'Body Type',
    'search.priceRange': 'Price Range',
    'search.searchVehicles': 'Search Vehicles'
  };
  
  return translations[key] || key;
};

export default function SearchForm({ className }: SearchFormProps) {
  const currentLanguage = 'en';
  const router = useRouter();
  const [isAdvancedSearch, setIsAdvancedSearch] = useState(false);
  const [searchParams, setSearchParams] = useState({
    make: '',
    model: '',
    steering: '',
    bodyType: '',
    minPrice: '',
    maxPrice: '',
    yearFrom: '',
    yearTo: '',
    condition: '',
  });

  // State for options data
  const [makes, setMakes] = useState<Option[]>([]);
  const [models, setModels] = useState<{name: string, count: number}[]>([]);
  const [bodyTypes, setBodyTypes] = useState<Option[]>([]);
  const [conditions, setConditions] = useState<Option[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingModels, setIsLoadingModels] = useState(false);
  const [matchingVehicles, setMatchingVehicles] = useState(0);
  const [isCountLoading, setIsCountLoading] = useState(false);

  // Fetch options data
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        console.log('SearchForm: Fetching options data using API URL:', config.apiUrl);
        setIsLoading(true);
        
        const [makesData, bodyTypesData, conditionsData] = await Promise.all([
          getOptionsByCategory('makes'),
          getOptionsByCategory('bodyTypes'),
          getOptionsByCategory('conditionTypes')
        ]);
        
        console.log('SearchForm: Received options data:', {
          makes: makesData.length,
          bodyTypes: bodyTypesData.length,
          conditions: conditionsData.length
        });
        
        setMakes(makesData);
        setBodyTypes(bodyTypesData);
        setConditions(conditionsData);
      } catch (error) {
        console.error("SearchForm: Error fetching options:", error);
      } finally {
        setIsLoading(false);
        console.log('SearchForm: Options loading complete');
      }
    };
    
    fetchOptions();
  }, []);
  
  // Fetch models when make changes
  useEffect(() => {
    const fetchModels = async () => {
      try {
        // Reset models when make is cleared
        if (!searchParams.make) {
          console.log('SearchForm: Make is empty, resetting models');
          setModels([]);
          return;
        }
        
        console.log(`SearchForm: Fetching models for make: ${searchParams.make}`);
        setIsLoadingModels(true);
        
        const response = await vehicleAPI.getModelsByMake(searchParams.make);
        console.log(`SearchForm: Received ${response.data?.length || 0} models for ${searchParams.make}`);
        
        setModels(response.data);
      } catch (error) {
        console.error("SearchForm: Error fetching models:", error);
        setModels([]);
      } finally {
        setIsLoadingModels(false);
      }
    };
    
    fetchModels();
  }, [searchParams.make]);

  // Update matching vehicles count when search params change
  useEffect(() => {
    const fetchMatchingVehicles = async () => {
      try {
        setIsCountLoading(true);
        
        // Create query params object with only non-empty values
        const queryParams: Record<string, string> = {};
        if (searchParams.make) queryParams.make = searchParams.make;
        if (searchParams.model) queryParams.model = searchParams.model;
        if (searchParams.bodyType) queryParams.bodyType = searchParams.bodyType;
        if (searchParams.condition) queryParams.condition = searchParams.condition;
        if (searchParams.yearFrom) queryParams.yearFrom = searchParams.yearFrom;
        if (searchParams.yearTo) queryParams.yearTo = searchParams.yearTo;
        if (searchParams.minPrice) queryParams.minPrice = searchParams.minPrice;
        if (searchParams.maxPrice) queryParams.maxPrice = searchParams.maxPrice;
        
        // Only fetch if at least one filter is applied
        if (Object.keys(queryParams).length > 0) {
          console.log('SearchForm: Fetching matching vehicles count with params:', queryParams);
          const response = await vehicleAPI.getVehicles(queryParams);
          console.log(`SearchForm: Found ${response.data.total} matching vehicles`);
          setMatchingVehicles(response.data.total);
        } else {
          // If no filters, set to 0 to hide the count
          console.log('SearchForm: No filters applied, hiding count');
          setMatchingVehicles(0);
        }
      } catch (error) {
        console.error("SearchForm: Error fetching matching vehicles:", error);
      } finally {
        setIsCountLoading(false);
      }
    };
    
    // Use debounce to avoid too many API calls
    console.log('SearchForm: Debouncing vehicle count fetch');
    const debounceTimeout = setTimeout(() => {
      fetchMatchingVehicles();
    }, 500);
    
    return () => clearTimeout(debounceTimeout);
  }, [searchParams]);

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

  if (isLoading) {
    return (
      <div className={`bg-gradient-to-r from-[#1a3d50] to-[#2c5878] rounded-lg shadow-lg overflow-hidden ${className} p-8 flex justify-center items-center`}>
        <Loader2 className="h-8 w-8 animate-spin text-white" />
        <span className="ml-2 text-white">Loading...</span>
      </div>
    );
  }

  return (
    <div className={`bg-gradient-to-r from-[#1a3d50] to-[#2c5878] rounded-lg shadow-lg overflow-hidden ${className}`}>
      <div className="bg-[#162e3d] px-5 py-3 flex items-center justify-between">
        <div className="flex items-center text-white">
          <Search className="mr-2 h-5 w-5 text-blue-300" />
          <h2 className="text-lg font-medium">{t('search.title')}</h2>
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
                <option value="">{t('search.selectMake')}</option>
                {makes.map(make => (
                  <option key={make._id} value={make.name}>{make.name}</option>
                ))}
              </select>
              <label htmlFor="make" className="absolute -top-2 left-2 text-xs font-medium bg-white px-1 text-gray-600">
                {t('search.make')}
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
                disabled={!searchParams.make || isLoadingModels}
              >
                <option value="">{t('search.selectModel')}</option>
                {isLoadingModels ? (
                  <option value="" disabled>{t('common.loading')}</option>
                ) : (
                  models.map(model => (
                    <option key={model.name} value={model.name}>
                      {model.name} ({model.count})
                    </option>
                  ))
                )}
              </select>
              <label htmlFor="model" className="absolute -top-2 left-2 text-xs font-medium bg-white px-1 text-gray-600">
                {t('search.model')}
              </label>
              {isLoadingModels && (
                <div className="absolute right-8 top-1/2 -translate-y-1/2">
                  <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                </div>
              )}
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
                <option value="">{t('search.selectYear')}</option>
                {Array.from({ length: 24 }, (_, i) => 2000 + i).map(year => (
                  <option key={year} value={year.toString()}>
                    {year}
                  </option>
                ))}
              </select>
              <label htmlFor="yearFrom" className="absolute -top-2 left-2 text-xs font-medium bg-white px-1 text-gray-600">
                {t('search.year')}
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
                  <Car className="h-4 w-4" />
                </div>
                <select
                  id="bodyType"
                  name="bodyType"
                  value={searchParams.bodyType}
                  onChange={handleChange}
                  className="w-full rounded-md border border-gray-200 py-2.5 pl-10 pr-8 text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option value="">{t('search.selectBodyType')}</option>
                  {bodyTypes.map(type => (
                    <option key={type._id} value={type.name}>{type.name}</option>
                  ))}
                </select>
                <label htmlFor="bodyType" className="absolute -top-2 left-2 text-xs font-medium bg-white px-1 text-gray-600">
                  {t('search.bodyType')}
                </label>
              </div>
              
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <Car className="h-4 w-4" />
                </div>
                <select
                  id="condition"
                  name="condition"
                  value={searchParams.condition}
                  onChange={handleChange}
                  className="w-full rounded-md border border-gray-200 py-2.5 pl-10 pr-8 text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option value="">Any Condition</option>
                  {conditions.map(condition => (
                    <option key={condition._id} value={condition.name}>{condition.name}</option>
                  ))}
                </select>
                <label htmlFor="condition" className="absolute -top-2 left-2 text-xs font-medium bg-white px-1 text-gray-600">
                  Condition
                </label>
              </div>
              
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <CreditCard className="h-4 w-4" />
                </div>
                <select
                  id="minPrice"
                  name="minPrice"
                  value={searchParams.minPrice}
                  onChange={handleChange}
                  className="w-full rounded-md border border-gray-200 py-2.5 pl-10 pr-8 text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option value="">{t('search.priceRange')}</option>
                  <option value="5000">$5,000</option>
                  <option value="10000">$10,000</option>
                  <option value="15000">$15,000</option>
                  <option value="20000">$20,000</option>
                  <option value="25000">$25,000</option>
                  <option value="30000">$30,000</option>
                </select>
                <label htmlFor="minPrice" className="absolute -top-2 left-2 text-xs font-medium bg-white px-1 text-gray-600">
                  {t('search.priceRange')}
                </label>
              </div>
            </motion.div>
          )}
          
          <div className="flex justify-between items-center">
            {(matchingVehicles > 0 || isCountLoading) && (
              <div className="text-white text-xs bg-blue-500/20 px-3 py-1 rounded-full flex items-center">
                {isCountLoading ? (
                  <>
                    <Loader2 className="h-3 w-3 animate-spin mr-1" />
                    <span>Searching...</span>
                  </>
                ) : (
                  <>
                    <span className="font-semibold">{matchingVehicles}</span>
                    <span className="ml-1">cars match your criteria</span>
                  </>
                )}
              </div>
            )}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="ml-auto">
              <Button 
                type="submit" 
                className="bg-red-600 hover:bg-red-700 text-white text-sm py-2 px-6 rounded-md flex items-center"
              >
                {t('search.searchVehicles')}
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </motion.div>
          </div>
        </motion.form>
      </div>
    </div>
  );
} 