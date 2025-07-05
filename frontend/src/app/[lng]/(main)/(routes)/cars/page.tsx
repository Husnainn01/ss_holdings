'use client';

import React, { useState, ReactNode, useEffect, Suspense } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import { 
  Search, 
  SlidersHorizontal,
  ChevronDown,
  X, 
  Check, 
  ArrowUpDown,
  Grid,
  List,
  FilterX,
  Loader2,
  ArrowRight,
  ChevronRight,
  Car,
  Calendar,
  Gauge,
  Settings,
  Fuel
} from 'lucide-react';
import { vehicleAPI } from '@/services/api';
import Link from 'next/link';

interface CarMake {
  id: string;
  name: string;
  count: number;
}

interface BodyType {
  id: string;
  name: string;
  count: number;
}

interface YearRange {
  id: string;
  name: string;
  count: number;
}

interface Car {
  id: string;
  title: string;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number | string;
  location: string;
  transmission: string;
  fuel: string;
  bodyType: string;
  imageUrl: string;
  featured: boolean;
}

// Empty arrays for filters - these will be populated from API data later
const carMakes: CarMake[] = [];
const bodyTypes: BodyType[] = [];
const yearRanges: YearRange[] = [];

interface FilterSectionProps {
  title: string;
  children: ReactNode;
}

const FilterSection = ({ title, children }: FilterSectionProps) => {
  const [isOpen, setIsOpen] = useState(true);
  
  return (
    <div className="border-b border-gray-200 py-4">
      <button 
        className="flex justify-between items-center w-full text-left"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h3 className="font-medium text-lg">{title}</h3>
        <ChevronDown 
          className={`h-5 w-5 text-gray-500 transition-transform ${isOpen ? 'transform rotate-180' : ''}`} 
        />
      </button>
      {isOpen && (
        <div className="mt-3">
          {children}
        </div>
      )}
    </div>
  );
};

interface FilterCheckboxProps {
  id: string;
  label: string;
  count: number;
  checked: boolean;
  onChange: () => void;
}

const FilterCheckbox = ({ id, label, count, checked, onChange }: FilterCheckboxProps) => {
  return (
    <div className="flex items-center mb-2">
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
      />
      <label htmlFor={id} className="ml-2 text-sm text-gray-700 flex-grow">
        {label}
      </label>
      <span className="text-xs text-gray-500">({count})</span>
    </div>
  );
};

// Create a separate component that uses useSearchParams
function CarsPageContent() {
  // State for filters
  const [selectedMakes, setSelectedMakes] = useState<string[]>([]);
  const [selectedBodyTypes, setSelectedBodyTypes] = useState<string[]>([]);
  const [selectedYearRanges, setSelectedYearRanges] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>('newest');
  const [filterPanelOpen, setFilterPanelOpen] = useState<boolean>(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [minYear, setMinYear] = useState<string>("");
  const [maxYear, setMaxYear] = useState<string>("");
  const [minMileage, setMinMileage] = useState<string>("");
  const [maxMileage, setMaxMileage] = useState<string>("");
  const [transmission, setTransmission] = useState<string>("");
  const [fuelType, setFuelType] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [model, setModel] = useState<string>("");
  const [make, setMake] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  
  // State for API data
  const [apiCars, setApiCars] = useState<Car[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCars, setTotalCars] = useState<number>(0);
  const [models, setModels] = useState<{name: string, count: number}[]>([]);
  const [isLoadingModels, setIsLoadingModels] = useState<boolean>(false);
  
  // Parse URL search params on initial load and when URL changes
  const searchParams = useSearchParams();
  
  useEffect(() => {
    if (searchParams) {
      // Set filter states based on URL params
      const makeParam = searchParams.get('make');
      if (makeParam) setMake(makeParam);
      
      const modelParam = searchParams.get('model');
      if (modelParam) setModel(modelParam);
      
      const locationParam = searchParams.get('location');
      if (locationParam) setLocation(locationParam);
      
      const bodyTypeParam = searchParams.get('bodyType');
      if (bodyTypeParam) {
        setSelectedBodyTypes([bodyTypeParam]);
      }
      
      const yearFromParam = searchParams.get('yearFrom');
      if (yearFromParam) setMinYear(yearFromParam);
      
      const yearToParam = searchParams.get('yearTo');
      if (yearToParam) setMaxYear(yearToParam);
      
      const minPriceParam = searchParams.get('minPrice');
      if (minPriceParam) setMinPrice(minPriceParam);
      
      const maxPriceParam = searchParams.get('maxPrice');
      if (maxPriceParam) setMaxPrice(maxPriceParam);
      
      const conditionParam = searchParams.get('condition');
      if (conditionParam) setStatus(conditionParam);
      
      // Show filter panel if any filter is applied or if filter parameter is present
      const filterParam = searchParams.get('filter');
      if (makeParam || modelParam || locationParam || bodyTypeParam || filterParam) {
        setFilterPanelOpen(true);
      }

      // Log the parameters for debugging
      console.log("URL Parameters:", {
        make: makeParam,
        model: modelParam,
        location: locationParam,
        bodyType: bodyTypeParam,
        filter: filterParam
      });
    }
  }, [searchParams]);
  
  // Fetch cars from API with filters
  useEffect(() => {
    const fetchCars = async () => {
      try {
        setIsLoading(true);
        
        // Build query params
        const params: Record<string, string> = {};
        
        if (make) params.make = make;
        if (model) params.model = model;
        if (location) params.location = location;
        if (minYear) params.yearFrom = minYear;
        if (maxYear) params.yearTo = maxYear;
        if (minPrice) params.minPrice = minPrice;
        if (maxPrice) params.maxPrice = maxPrice;
        if (minMileage) params.minMileage = minMileage;
        if (maxMileage) params.maxMileage = maxMileage;
        if (transmission) params.vehicleTransmission = transmission;
        if (fuelType) params.fuelType = fuelType;
        if (status) params.condition = status;
        
        if (selectedBodyTypes.length === 1) {
          params.bodyType = selectedBodyTypes[0];
        }
        
        // Add sorting
        switch (sortBy) {
          case 'newest':
            params.sort = '-year';
            break;
          case 'oldest':
            params.sort = 'year';
            break;
          case 'price-low':
            params.sort = 'price';
            break;
          case 'price-high':
            params.sort = '-price';
            break;
          default:
            params.sort = '-createdAt';
        }
        
        const response = await vehicleAPI.getVehicles(params);
        
        if (response.data && response.data.vehicles) {
          // Map API data to our component format
          const mappedCars = response.data.vehicles.map((vehicle: any) => ({
            id: vehicle._id,
            title: `${vehicle.year} ${vehicle.make} ${vehicle.model}`,
            make: vehicle.make,
            model: vehicle.model,
            year: vehicle.year,
            price: vehicle.price,
            mileage: vehicle.mileage || "0",
            location: vehicle.location || "N/A",
            transmission: vehicle.vehicleTransmission || "N/A",
            fuel: vehicle.fuelType || "N/A",
            bodyType: vehicle.bodyType || "N/A",
            imageUrl: vehicle.images && vehicle.images.length > 0 ? 
              vehicle.images.find((img: any) => img.isMain)?.url || vehicle.images[0].url : 
              `https://placehold.co/600x400/png?text=${vehicle.make}+${vehicle.model}`,
            featured: vehicle.isFeatured || false
          }));
          
          setApiCars(mappedCars);
          setTotalCars(response.data.total);
          console.log("Fetched vehicles:", mappedCars.length, "Total:", response.data.total);
        }
      } catch (err) {
        console.error("Error fetching vehicles:", err);
        setError("Failed to load vehicles. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCars();
  }, [make, model, location, minYear, maxYear, minPrice, maxPrice, minMileage, maxMileage, 
      transmission, fuelType, status, selectedBodyTypes, sortBy]);
  
  // Fetch models when make changes
  useEffect(() => {
    const fetchModels = async () => {
      try {
        // Clear model selection when make changes
        if (model) {
          setModel('');
        }
        
        // Reset models when make is cleared
        if (!make) {
          setModels([]);
          return;
        }
        
        setIsLoadingModels(true);
        const response = await vehicleAPI.getModelsByMake(make);
        setModels(response.data);
      } catch (error) {
        console.error("Error fetching models:", error);
        setModels([]);
      } finally {
        setIsLoadingModels(false);
      }
    };
    
    fetchModels();
  }, [make]);
  
  // Use only API data
  const allCars = apiCars;
  
  // No need for client-side filtering since we're using the API
  const filteredCars = allCars;

  // Feature toggles
  const toggleFeature = (feature: string) => {
    setSelectedFeatures(prev => 
      prev.includes(feature)
        ? prev.filter(f => f !== feature)
        : [...prev, feature]
    );
  };
  
  // Clear all filters
  const clearAllFilters = () => {
    setSelectedMakes([]);
    setSelectedBodyTypes([]);
    setSelectedYearRanges([]);
    setSearchTerm('');
    setMake("");
    setModel("");
    setLocation("");
    setMinPrice("");
    setMaxPrice("");
    setMinYear("");
    setMaxYear("");
    setMinMileage("");
    setMaxMileage("");
    setTransmission("");
    setFuelType("");
    setStatus("");
    setSelectedFeatures([]);
  };
  
  // Check if any filters are active
  const hasActiveFilters = make || model || location || selectedBodyTypes.length > 0 || 
    minPrice || maxPrice || minYear || maxYear || minMileage || maxMileage || 
    transmission || fuelType || status || selectedFeatures.length > 0 || searchTerm;

  // Features list for filter
  const features = [
    { id: 'ac', name: 'A/C' },
    { id: 'power_steering', name: 'Power Steering' },
    { id: 'power_windows', name: 'Power Windows' },
    { id: 'sunroof', name: 'Sunroof' },
    { id: 'leather_seats', name: 'Leather Seats' },
    { id: 'alloy_wheels', name: 'Alloy Wheels' },
    { id: 'navigation', name: 'Navigation' },
    { id: 'bluetooth', name: 'Bluetooth' },
    { id: 'backup_camera', name: 'Backup Camera' },
    { id: 'parking_sensors', name: 'Parking Sensors' },
    { id: 'cruise_control', name: 'Cruise Control' },
    { id: 'heated_seats', name: 'Heated Seats' },
  ];

  // Add search functionality
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Trigger refetch with search term
    // For now, we'll just use the make field as a simple search
    // In a more complete implementation, we would add a search endpoint to the API
    if (searchTerm) {
      setMake(searchTerm);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-[#F4E7E1] border-b border-[#E8D5CB]">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 mb-1">Find Your Perfect Car</h1>
              <p className="text-gray-600">Browse our selection of quality vehicles</p>
            </div>
            
            <div className="w-full md:w-auto">
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  placeholder="Search by make, model..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full md:w-64 pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-blue-500 hover:text-blue-600"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </form>
            </div>
            
            <div className="flex items-center gap-3">
              <button 
                className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded"
                onClick={() => setFilterPanelOpen(!filterPanelOpen)}
              >
                <SlidersHorizontal size={18} />
                <span>Filters {filterPanelOpen ? '(Hide)' : ''}</span>
              </button>
              
              <div className="flex items-center text-sm text-gray-500">
                Showing <span className="font-semibold">{filteredCars.length}</span> of <span className="font-semibold">{totalCars}</span> vehicles
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Filter Panel */}
      {filterPanelOpen && (
        <div className="fixed inset-0 z-40 md:relative md:z-auto">
          {/* Backdrop overlay for mobile */}
          <div 
            className="fixed inset-0 bg-black/50 md:hidden" 
            onClick={() => setFilterPanelOpen(false)}
          />
          
          <div className="fixed inset-0 md:static overflow-y-auto md:overflow-visible bg-white md:border-b md:border-gray-200 md:shadow-sm">
            <div className="container mx-auto px-4 py-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal size={18} className="text-primary" />
                  <h2 className="font-medium text-lg">Filter Vehicles</h2>
                </div>
                <div className="flex items-center gap-3">
                  {hasActiveFilters && (
                    <button 
                      className="flex items-center gap-1 text-primary hover:text-primary-hover"
                      onClick={clearAllFilters}
                    >
                      <FilterX size={16} />
                      <span>Reset Filters</span>
                    </button>
                  )}
                  <button 
                    className="text-gray-500 hover:text-gray-700"
                    onClick={() => setFilterPanelOpen(false)}
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {/* Make Filter */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Make</label>
                  <select
                    value={make}
                    onChange={(e) => setMake(e.target.value)}
                    className="w-full rounded-md border border-gray-300 py-2 pl-3 pr-10 text-base focus:border-primary focus:outline-none focus:ring-primary"
                  >
                    <option value="">Any Make</option>
                    <option value="Toyota">Toyota</option>
                    <option value="Honda">Honda</option>
                    <option value="Nissan">Nissan</option>
                    <option value="BMW">BMW</option>
                    <option value="Mercedes">Mercedes</option>
                  </select>
                </div>

                {/* Model Filter */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Model</label>
                  <select
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    className="w-full rounded-md border border-gray-300 py-2 pl-3 pr-10 text-base focus:border-primary focus:outline-none focus:ring-primary"
                    disabled={!make || isLoadingModels}
                  >
                    <option value="">Any Model</option>
                    {isLoadingModels ? (
                      <option value="" disabled>Loading models...</option>
                    ) : (
                      models.map(model => (
                        <option key={model.name} value={model.name}>
                          {model.name} ({model.count})
                        </option>
                      ))
                    )}
                  </select>
                  {isLoadingModels && (
                    <div className="absolute right-8 top-1/2 -translate-y-1/2">
                      <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                    </div>
                  )}
                </div>

                {/* Location Filter */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Location</label>
                  <select
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full rounded-md border border-gray-300 py-2 pl-3 pr-10 text-base focus:border-primary focus:outline-none focus:ring-primary"
                  >
                    <option value="">Any Location</option>
                    <option value="Japan">Japan</option>
                    <option value="USA">USA</option>
                    <option value="UK">UK</option>
                    <option value="Germany">Germany</option>
                    <option value="Australia">Australia</option>
                  </select>
                </div>

                {/* Body Type Filter */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Body Type</label>
                  <select
                    value={selectedBodyTypes[0] || ""}
                    onChange={(e) => setSelectedBodyTypes(e.target.value ? [e.target.value] : [])}
                    className="w-full rounded-md border border-gray-300 py-2 pl-3 pr-10 text-base focus:border-primary focus:outline-none focus:ring-primary"
                  >
                    <option value="">Any Body Type</option>
                    <option value="sedan">Sedan</option>
                    <option value="suv">SUV</option>
                    <option value="truck">Truck</option>
                    <option value="coupe">Coupe</option>
                    <option value="convertible">Convertible</option>
                  </select>
                </div>

                {/* Condition Filter */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Condition</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full rounded-md border border-gray-300 py-2 pl-3 pr-10 text-base focus:border-primary focus:outline-none focus:ring-primary"
                  >
                    <option value="">Any Condition</option>
                    <option value="New">New</option>
                    <option value="Used">Used</option>
                    <option value="Certified">Certified Pre-Owned</option>
                  </select>
                </div>

                {/* Year Range */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Year (From)</label>
                  <select
                    value={minYear}
                    onChange={(e) => setMinYear(e.target.value)}
                    className="w-full rounded-md border border-gray-300 py-2 pl-3 pr-10 text-base focus:border-primary focus:outline-none focus:ring-primary"
                  >
                    <option value="">Any Year</option>
                    {Array.from({ length: 24 }, (_, i) => 2000 + i).map(year => (
                      <option key={year} value={year.toString()}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Year (To)</label>
                  <select
                    value={maxYear}
                    onChange={(e) => setMaxYear(e.target.value)}
                    className="w-full rounded-md border border-gray-300 py-2 pl-3 pr-10 text-base focus:border-primary focus:outline-none focus:ring-primary"
                  >
                    <option value="">Any Year</option>
                    {Array.from({ length: 24 }, (_, i) => 2000 + i).reverse().map(year => (
                      <option key={year} value={year.toString()}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price Range */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Min Price</label>
                  <select
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="w-full rounded-md border border-gray-300 py-2 pl-3 pr-10 text-base focus:border-primary focus:outline-none focus:ring-primary"
                  >
                    <option value="">No Min</option>
                    <option value="5000">$5,000</option>
                    <option value="10000">$10,000</option>
                    <option value="15000">$15,000</option>
                    <option value="20000">$20,000</option>
                    <option value="25000">$25,000</option>
                    <option value="30000">$30,000</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Max Price</label>
                  <select
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="w-full rounded-md border border-gray-300 py-2 pl-3 pr-10 text-base focus:border-primary focus:outline-none focus:ring-primary"
                  >
                    <option value="">No Max</option>
                    <option value="10000">$10,000</option>
                    <option value="15000">$15,000</option>
                    <option value="20000">$20,000</option>
                    <option value="30000">$30,000</option>
                    <option value="40000">$40,000</option>
                    <option value="50000">$50,000</option>
                  </select>
                </div>

                {/* Transmission */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Transmission</label>
                  <select
                    value={transmission}
                    onChange={(e) => setTransmission(e.target.value)}
                    className="w-full rounded-md border border-gray-300 py-2 pl-3 pr-10 text-base focus:border-primary focus:outline-none focus:ring-primary"
                  >
                    <option value="">Any Transmission</option>
                    <option value="Automatic">Automatic</option>
                    <option value="Manual">Manual</option>
                    <option value="CVT">CVT</option>
                  </select>
                </div>

                {/* Fuel Type */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Fuel Type</label>
                  <select
                    value={fuelType}
                    onChange={(e) => setFuelType(e.target.value)}
                    className="w-full rounded-md border border-gray-300 py-2 pl-3 pr-10 text-base focus:border-primary focus:outline-none focus:ring-primary"
                  >
                    <option value="">Any Fuel Type</option>
                    <option value="Gasoline">Gasoline</option>
                    <option value="Diesel">Diesel</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="Electric">Electric</option>
                  </select>
                </div>
              </div>
              
              <div className="flex justify-center gap-4 mt-8 pb-8 md:pb-0">
                <button
                  className="bg-primary hover:bg-primary-hover text-white px-8 py-3 rounded-md font-medium"
                  onClick={() => {
                    setFilterPanelOpen(false);
                  }}
                >
                  SEARCH & CLOSE FILTERS
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* View Mode and Sort Controls */}
      <div className="bg-[#F3F4F6] border-b border-gray-200 py-3">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <button 
                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white shadow text-primary' : 'text-gray-500 hover:text-primary'}`}
                onClick={() => setViewMode('grid')}
                aria-label="Grid view"
              >
                <Grid size={18} />
              </button>
              <button 
                className={`p-2 rounded ${viewMode === 'list' ? 'bg-white shadow text-primary' : 'text-gray-500 hover:text-primary'}`}
                onClick={() => setViewMode('list')}
                aria-label="List view"
              >
                <List size={18} />
              </button>
            </div>
            
            <div className="flex items-center">
              <span className="text-sm text-gray-500 mr-2">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-sm border-gray-300 rounded-md focus:border-primary focus:ring-primary"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Mobile Filter Toggle */}
        <div className="md:hidden mb-4">
          <button 
            className="w-full flex items-center justify-center gap-2 bg-[#F4E7E1] py-3 px-4 rounded-lg shadow border border-gray-200"
            onClick={() => setFilterPanelOpen(!filterPanelOpen)}
          >
            <SlidersHorizontal className="h-5 w-5" />
            <span>{filterPanelOpen ? 'Hide Filters' : 'Show Filters'}</span>
          </button>
        </div>
        
        {/* Car Listings */}
        <div className="flex-1">
          {/* Loading State */}
          {isLoading && (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
              <span>Loading vehicles...</span>
            </div>
          )}
          
          {/* Error State */}
          {error && !isLoading && (
            <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-4">
              <p>{error}</p>
            </div>
          )}
          
          {/* Empty State */}
          {!isLoading && filteredCars.length === 0 && (
            <div className="text-center py-16">
              <div className="mx-auto w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <Car className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No vehicles found</h3>
              <p className="text-gray-500 max-w-md mx-auto mb-6">
                We couldn't find any vehicles matching your search criteria. Try adjusting your filters or search terms.
              </p>
              <button 
                onClick={clearAllFilters}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-hover"
              >
                Clear All Filters
              </button>
            </div>
          )}

          {/* Car Grid */}
          {!isLoading && filteredCars.length > 0 && (
            <div className={viewMode === 'grid' ? 
              "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4" : 
              "flex flex-col gap-4"
            }>
              {filteredCars.map((car) => (
                viewMode === 'grid' ? (
                  <div key={car.id} className="overflow-hidden rounded-lg border border-gray-100 shadow-sm" style={{ maxHeight: '320px' }}>
                    <div className="h-full flex flex-col overflow-hidden">
                      <Link href={`/cars/${car.id}`} className="flex flex-col h-full">
                        <div className="relative w-full" style={{ height: "150px" }}>
                          <div className="relative h-full w-full bg-gray-200">
                            <img
                              src={car.imageUrl || `https://placehold.co/600x400/e0e0e0/8A0000?text=${car.make}+${car.model}`}
                              alt={`${car.make} ${car.model}`}
                              className="object-cover w-full h-full"
                              onError={(e) => {
                                console.error(`Image failed to load: ${car.imageUrl}`);
                                e.currentTarget.src = `https://placehold.co/600x400/e0e0e0/8A0000?text=${car.make}+${car.model}`;
                              }}
                            />
                          </div>
                          
                          {car.featured && (
                            <div className="absolute top-2 right-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded">
                              Featured
                            </div>
                          )}
                          
                          <div className="absolute top-0 left-0 p-2">
                            <div className="bg-black/50 hover:bg-black/60 text-white border-0 backdrop-blur-sm text-xs px-2 py-1 rounded-md">
                              {car.make} {car.model}
                            </div>
                          </div>
                          
                          <div className="absolute bottom-0 left-0 right-0 p-2 transform translate-y-0 group-hover:translate-y-0 transition-transform duration-300">
                            <h3 className="font-medium text-xs text-white leading-tight line-clamp-1 drop-shadow-md">{car.title || `${car.year} ${car.make} ${car.model}`}</h3>
                          </div>
                        </div>
                        
                        <div className="p-2 flex-1 flex flex-col bg-white">
                          <div className="flex justify-between items-center mb-1">
                            <div className="flex items-center">
                              <p className="text-xs text-gray-500 font-medium">
                                {car.location}
                              </p>
                            </div>
                            <div className="font-bold text-sm text-[#1a3d50]">
                              ${car.price.toLocaleString()}
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-xs mb-2 bg-gray-50 rounded-lg p-1.5">
                            <div className="flex items-center">
                              <span className="font-medium">{car.year}</span>
                            </div>
                            
                            <div className="flex items-center">
                              <span className="font-medium">{typeof car.mileage === 'string' ? parseInt(car.mileage).toLocaleString() : car.mileage.toLocaleString()}</span>
                            </div>
                            
                            <div className="flex items-center">
                              <span className="font-medium">{car.transmission}</span>
                            </div>
                            
                            <div className="flex items-center">
                              <span className="font-medium">{car.fuel}</span>
                            </div>
                          </div>
                          
                          <div className="mt-auto pt-1 border-t border-gray-100">
                            <div className="flex justify-between items-center">
                              <div className="text-xs px-1.5 py-0.5 bg-[#1a3d50]/5 text-[#1a3d50] border-[#1a3d50]/20 hover:bg-[#1a3d50]/10 rounded-md">
                                {car.bodyType}
                              </div>
                              
                              <span className="text-xs text-[#1a3d50] font-medium group-hover:underline flex items-center">
                                View
                                <ArrowRight className="h-3 w-3 ml-0.5 transition-transform duration-300 group-hover:translate-x-1" />
                              </span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div key={car.id} className="bg-[#F4E7E1] rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="flex flex-col sm:flex-row">
                      <div className="sm:w-1/3 h-40">
                        <img 
                          src={car.imageUrl || `https://placehold.co/600x400/e0e0e0/8A0000?text=${car.make}+${car.model}`}
                          alt={car.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            console.error(`Image failed to load: ${car.imageUrl}`);
                            e.currentTarget.src = `https://placehold.co/600x400/e0e0e0/8A0000?text=${car.make}+${car.model}`;
                          }}
                        />
                      </div>
                      <div className="sm:w-2/3 p-3">
                        <div className="flex justify-between items-start">
                          <h3 className="font-semibold text-sm mb-1 hover:text-primary transition-colors">
                            <a href={`/cars/${car.id}`}>{car.title}</a>
                          </h3>
                          <div className="text-base font-bold text-primary">${car.price.toLocaleString()}</div>
                        </div>
                        <div className="flex items-center text-xs text-gray-500 mb-2">
                          <span>{car.location}</span>
                          <span className="mx-1">•</span>
                          <span>{typeof car.mileage === 'string' ? parseInt(car.mileage).toLocaleString() : car.mileage.toLocaleString()} mi</span>
                        </div>
                        <p className="text-xs text-gray-600 mb-2">
                          {car.transmission} • {car.fuel} • {car.bodyType}
                        </p>
                        <div className="flex flex-wrap gap-1 text-xs">
                          <span className="bg-gray-100 rounded-full px-2 py-0.5">{car.year}</span>
                          <span className="bg-gray-100 rounded-full px-2 py-0.5">{car.transmission}</span>
                          <span className="bg-gray-100 rounded-full px-2 py-0.5">{car.fuel}</span>
                          <span className="bg-gray-100 rounded-full px-2 py-0.5">{car.bodyType}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              ))}
            </div>
          )}
          
          {/* Pagination */}
          {filteredCars.length > 0 && (
            <div className="mt-8 flex justify-center">
              <nav className="flex items-center gap-1">
                <button className="px-3 py-2 border rounded-md hover:bg-gray-50 text-gray-500">
                  Previous
                </button>
                <button className="px-4 py-2 border rounded-md bg-primary text-white">
                  1
                </button>
                <button className="px-4 py-2 border rounded-md hover:bg-gray-50">
                  2
                </button>
                <button className="px-4 py-2 border rounded-md hover:bg-gray-50">
                  3
                </button>
                <button className="px-3 py-2 border rounded-md hover:bg-gray-50">
                  Next
                </button>
              </nav>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CarsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CarsPageContent />
    </Suspense>
  );
} 