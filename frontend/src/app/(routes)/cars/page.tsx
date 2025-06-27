'use client';

import React, { useState, ReactNode } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { 
  Search, 
  SlidersHorizontal,
  ChevronDown,
  X, 
  Check, 
  ArrowUpDown,
  Grid,
  List,
  FilterX
} from 'lucide-react';

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
  mileage: number;
  location: string;
  transmission: string;
  fuel: string;
  bodyType: string;
  imageUrl: string;
  featured: boolean;
}

const carMakes: CarMake[] = [
  { id: 'toyota', name: 'Toyota', count: 76 },
  { id: 'honda', name: 'Honda', count: 54 },
  { id: 'bmw', name: 'BMW', count: 42 },
  { id: 'mercedes', name: 'Mercedes-Benz', count: 38 },
  { id: 'audi', name: 'Audi', count: 29 },
  { id: 'lexus', name: 'Lexus', count: 25 },
];

const bodyTypes: BodyType[] = [
  { id: 'sedan', name: 'Sedan', count: 87 },
  { id: 'suv', name: 'SUV', count: 65 },
  { id: 'coupe', name: 'Coupe', count: 34 },
  { id: 'truck', name: 'Truck', count: 28 },
  { id: 'hatchback', name: 'Hatchback', count: 22 },
  { id: 'convertible', name: 'Convertible', count: 15 },
];

const yearRanges: YearRange[] = [
  { id: 'new', name: '2021 - 2024', count: 45 },
  { id: 'recent', name: '2016 - 2020', count: 78 },
  { id: 'older', name: '2010 - 2015', count: 56 },
  { id: 'classic', name: 'Before 2010', count: 32 },
];

const mockCars: Car[] = [
  {
    id: '1',
    title: '2023 Toyota Camry XSE',
    make: 'Toyota',
    model: 'Camry',
    year: 2023,
    price: 32500,
    mileage: 12500,
    location: 'New York',
    transmission: 'Automatic',
    fuel: 'Petrol',
    bodyType: 'Sedan',
    imageUrl: 'https://placehold.co/600x400/png?text=Toyota+Camry',
    featured: true
  },
  {
    id: '2',
    title: '2022 BMW X5 xDrive40i',
    make: 'BMW',
    model: 'X5',
    year: 2022,
    price: 65999,
    mileage: 15800,
    location: 'Los Angeles',
    transmission: 'Automatic',
    fuel: 'Petrol',
    bodyType: 'SUV',
    imageUrl: 'https://placehold.co/600x400/png?text=BMW+X5',
    featured: true
  },
  {
    id: '3',
    title: '2021 Mercedes-Benz C300',
    make: 'Mercedes-Benz',
    model: 'C-Class',
    year: 2021,
    price: 45750,
    mileage: 22000,
    location: 'Chicago',
    transmission: 'Automatic',
    fuel: 'Petrol',
    bodyType: 'Sedan',
    imageUrl: 'https://placehold.co/600x400/png?text=Mercedes+C300',
    featured: false
  },
  {
    id: '4',
    title: '2020 Audi Q7 Premium',
    make: 'Audi',
    model: 'Q7',
    year: 2020,
    price: 54250,
    mileage: 28500,
    location: 'Miami',
    transmission: 'Automatic',
    fuel: 'Petrol',
    bodyType: 'SUV',
    imageUrl: 'https://placehold.co/600x400/png?text=Audi+Q7',
    featured: false
  },
  {
    id: '5',
    title: '2019 Lexus RX 350',
    make: 'Lexus',
    model: 'RX',
    year: 2019,
    price: 39995,
    mileage: 35000,
    location: 'Dallas',
    transmission: 'Automatic',
    fuel: 'Petrol',
    bodyType: 'SUV',
    imageUrl: 'https://placehold.co/600x400/png?text=Lexus+RX',
    featured: false
  },
  {
    id: '6',
    title: '2021 Honda Accord Sport',
    make: 'Honda',
    model: 'Accord',
    year: 2021,
    price: 28750,
    mileage: 18900,
    location: 'Seattle',
    transmission: 'Automatic',
    fuel: 'Petrol',
    bodyType: 'Sedan',
    imageUrl: 'https://placehold.co/600x400/png?text=Honda+Accord',
    featured: false
  },
];

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
    <div className="flex items-center justify-between py-2">
      <label htmlFor={id} className="flex items-center cursor-pointer flex-1">
        <div className={`w-5 h-5 rounded border flex items-center justify-center mr-3 transition-colors ${checked ? 'bg-primary border-primary' : 'border-gray-300'}`}>
          {checked && <Check className="h-3 w-3 text-white" />}
        </div>
        <span>{label}</span>
      </label>
      <span className="text-gray-500 text-sm">{count}</span>
      <input 
        type="checkbox" 
        id={id} 
        className="sr-only"
        checked={checked}
        onChange={onChange}
      />
    </div>
  );
};

interface CarCardProps {
  car: Car;
}

const CarCard = ({ car }: CarCardProps) => {
  // Use a default image if none is provided
  const displayImage = car.imageUrl || `https://placehold.co/600x400/e0e0e0/8A0000?text=${car.make}+${car.model}`;

  return (
    <div className="h-full flex flex-col overflow-hidden bg-[#F4E7E1] rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
      <div className="relative">
        <div className="h-40 bg-gray-200 overflow-hidden">
          <Image 
            src={displayImage}
            alt={car.title}
            width={600}
            height={400}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
            priority
          />
        </div>
        {car.featured && (
          <div className="absolute top-2 left-2 bg-primary text-white text-xs font-bold px-2 py-0.5 rounded">
            Featured
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
          <div className="text-white font-bold text-sm">${car.price.toLocaleString()}</div>
        </div>
      </div>
      <div className="p-3 flex-1 flex flex-col">
        <h3 className="font-semibold text-sm mb-1 hover:text-primary transition-colors line-clamp-1">
          <a href={`/cars/${car.id}`}>{car.title}</a>
        </h3>
        <div className="flex items-center text-xs text-gray-500 mb-2">
          <span>{car.location}</span>
          <span className="mx-1">•</span>
          <span>{car.mileage.toLocaleString()} mi</span>
        </div>
        <div className="flex flex-wrap gap-1 text-xs mt-auto">
          <span className="bg-gray-100 rounded-full px-2 py-0.5">{car.year}</span>
          <span className="bg-gray-100 rounded-full px-2 py-0.5">{car.transmission}</span>
          <span className="bg-gray-100 rounded-full px-2 py-0.5">{car.fuel}</span>
          <span className="bg-gray-100 rounded-full px-2 py-0.5">{car.bodyType}</span>
        </div>
      </div>
    </div>
  );
};

export default function CarsPage() {
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
  
  // Filter and sort cars
  const filteredCars = mockCars.filter(car => {
    // Apply search filter
    if (searchTerm && !car.title.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    // Apply make filter
    if (make && car.make.toLowerCase() !== make.toLowerCase()) {
      return false;
    }
    
    // Apply body type filter
    if (selectedBodyTypes.length > 0 && !selectedBodyTypes.includes(car.bodyType.toLowerCase())) {
      return false;
    }
    
    // Apply year filters
    if (minYear && car.year < parseInt(minYear)) return false;
    if (maxYear && car.year > parseInt(maxYear)) return false;
    
    // Apply price filters
    if (minPrice && car.price < parseInt(minPrice)) return false;
    if (maxPrice && car.price > parseInt(maxPrice)) return false;
    
    // Apply mileage filters
    if (minMileage && car.mileage < parseInt(minMileage)) return false;
    if (maxMileage && car.mileage > parseInt(maxMileage)) return false;
    
    // Apply transmission filter
    if (transmission && car.transmission.toLowerCase() !== transmission.toLowerCase()) return false;
    
    // Apply fuel type filter
    if (fuelType && car.fuel.toLowerCase() !== fuelType.toLowerCase()) return false;
    
    return true;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return b.year - a.year;
      case 'oldest':
        return a.year - b.year;
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      default:
        return 0;
    }
  });

  const toggleFeature = (feature: string) => {
    setSelectedFeatures(prev => 
      prev.includes(feature)
        ? prev.filter(f => f !== feature)
        : [...prev, feature]
    );
  };
  
  const clearAllFilters = () => {
    setSelectedMakes([]);
    setSelectedBodyTypes([]);
    setSelectedYearRanges([]);
    setSearchTerm('');
    setMake("");
    setModel("");
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
  
  const hasActiveFilters = make || model || selectedBodyTypes.length > 0 || 
    minPrice || maxPrice || minYear || maxYear || minMileage || maxMileage || 
    transmission || fuelType || status || selectedFeatures.length > 0 || searchTerm;

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
  
  return (
    <div className="bg-[#F3F4F6] min-h-screen mb-20">
      {/* Top Filter Bar */}
      <div className="bg-[#F3F4F6] shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button 
                className={`p-2 ${viewMode === 'grid' ? 'bg-gray-100' : 'bg-[#F4E7E1]'} border border-gray-300 rounded-l-md hover:bg-gray-100`}
                onClick={() => setViewMode('grid')}
                aria-label="Grid view"
              >
                <Grid size={18} />
              </button>
              <button 
                className={`p-2 ${viewMode === 'list' ? 'bg-gray-100' : 'bg-[#F4E7E1]'} border border-gray-300 rounded-r-md hover:bg-gray-100`}
                aria-label="List view"
                onClick={() => setViewMode('list')}
              >
                <List size={18} />
              </button>
              
              <div className="relative ml-2">
                <span className="text-sm font-medium text-gray-700 mr-2">Sort by:</span>
                <select 
                  className="appearance-none border rounded pl-3 pr-8 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button 
                className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded"
                onClick={() => setFilterPanelOpen(!filterPanelOpen)}
              >
                <SlidersHorizontal size={18} />
                <span>Filters {filterPanelOpen ? '(Hide)' : ''}</span>
              </button>
              
              <p className="text-sm text-gray-600">
                Showing <span className="font-semibold">{filteredCars.length}</span> of <span className="font-semibold">{mockCars.length}</span> vehicles
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Filter Panel */}
      {filterPanelOpen && (
        <div className="bg-[#F3F4F6] border-b border-gray-200 shadow-sm">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <SlidersHorizontal size={18} />
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
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Make</label>
                <select
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  value={make}
                  onChange={(e) => setMake(e.target.value)}
                >
                  <option value="">All Makes</option>
                  {carMakes.map(make => (
                    <option key={make.id} value={make.id}>{make.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Model</label>
                <select
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                >
                  <option value="">All Models</option>
                  <option value="camry">Camry</option>
                  <option value="corolla">Corolla</option>
                  <option value="civic">Civic</option>
                  <option value="accord">Accord</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reference ID</label>
                <input 
                  type="text"
                  placeholder="Search by stock #, VIN, or title"
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Body Type</label>
                <select
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  value={selectedBodyTypes[0] || ""}
                  onChange={(e) => {
                    if (e.target.value) {
                      setSelectedBodyTypes([e.target.value]);
                    } else {
                      setSelectedBodyTypes([]);
                    }
                  }}
                >
                  <option value="">All Types</option>
                  {bodyTypes.map(type => (
                    <option key={type.id} value={type.id}>{type.name}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Min Price</label>
                <select
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                >
                  <option value="">No Min</option>
                  <option value="10000">$10,000</option>
                  <option value="20000">$20,000</option>
                  <option value="30000">$30,000</option>
                  <option value="40000">$40,000</option>
                  <option value="50000">$50,000</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Max Price</label>
                <select
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                >
                  <option value="">No Max</option>
                  <option value="20000">$20,000</option>
                  <option value="30000">$30,000</option>
                  <option value="40000">$40,000</option>
                  <option value="50000">$50,000</option>
                  <option value="75000">$75,000</option>
                  <option value="100000">$100,000</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Min Year</label>
                <select
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  value={minYear}
                  onChange={(e) => setMinYear(e.target.value)}
                >
                  <option value="">Any</option>
                  <option value="2015">2015</option>
                  <option value="2016">2016</option>
                  <option value="2017">2017</option>
                  <option value="2018">2018</option>
                  <option value="2019">2019</option>
                  <option value="2020">2020</option>
                  <option value="2021">2021</option>
                  <option value="2022">2022</option>
                  <option value="2023">2023</option>
                  <option value="2024">2024</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Max Year</label>
                <select
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  value={maxYear}
                  onChange={(e) => setMaxYear(e.target.value)}
                >
                  <option value="">Any</option>
                  <option value="2015">2015</option>
                  <option value="2016">2016</option>
                  <option value="2017">2017</option>
                  <option value="2018">2018</option>
                  <option value="2019">2019</option>
                  <option value="2020">2020</option>
                  <option value="2021">2021</option>
                  <option value="2022">2022</option>
                  <option value="2023">2023</option>
                  <option value="2024">2024</option>
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fuel Type</label>
                <select
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  value={fuelType}
                  onChange={(e) => setFuelType(e.target.value)}
                >
                  <option value="">Any</option>
                  <option value="petrol">Petrol</option>
                  <option value="diesel">Diesel</option>
                  <option value="hybrid">Hybrid</option>
                  <option value="electric">Electric</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Transmission</label>
                <select
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  value={transmission}
                  onChange={(e) => setTransmission(e.target.value)}
                >
                  <option value="">All Transmissions</option>
                  <option value="automatic">Automatic</option>
                  <option value="manual">Manual</option>
                  <option value="cvt">CVT</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Min Mileage</label>
                <select
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  value={minMileage}
                  onChange={(e) => setMinMileage(e.target.value)}
                >
                  <option value="">Any</option>
                  <option value="5000">5,000 miles</option>
                  <option value="10000">10,000 miles</option>
                  <option value="25000">25,000 miles</option>
                  <option value="50000">50,000 miles</option>
                  <option value="75000">75,000 miles</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Max Mileage</label>
                <select
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  value={maxMileage}
                  onChange={(e) => setMaxMileage(e.target.value)}
                >
                  <option value="">Any</option>
                  <option value="10000">10,000 miles</option>
                  <option value="25000">25,000 miles</option>
                  <option value="50000">50,000 miles</option>
                  <option value="75000">75,000 miles</option>
                  <option value="100000">100,000 miles</option>
                </select>
              </div>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">Status</label>
              <select
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="">All Status</option>
                <option value="available">Available</option>
                <option value="pending">Pending</option>
                <option value="sold">Sold</option>
              </select>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">Features</label>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {features.map(feature => (
                  <div key={feature.id} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`feature-${feature.id}`}
                      className="h-4 w-4 text-primary border-gray-300 rounded"
                      checked={selectedFeatures.includes(feature.id)}
                      onChange={() => toggleFeature(feature.id)}
                    />
                    <label htmlFor={`feature-${feature.id}`} className="ml-2 text-sm text-gray-700">
                      {feature.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex justify-center gap-4">
              <button
                className="bg-primary hover:bg-primary-hover text-white px-8 py-3 rounded font-medium"
                onClick={() => {
                  // Apply filters logic
                  setFilterPanelOpen(false);
                }}
              >
                SEARCH & CLOSE FILTERS
              </button>
              <button
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-8 py-3 rounded font-medium"
                onClick={() => {
                  // Apply filters without closing
                }}
              >
                SEARCH ONLY
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
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
            {/* Car Grid */}
            {filteredCars.length > 0 ? (
              <div className={viewMode === 'grid' ? 
                "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4" : 
                "flex flex-col gap-4"
              }>
                {filteredCars.map((car) => (
                  viewMode === 'grid' ? (
                    <div key={car.id} className="overflow-hidden rounded-lg border border-gray-100 shadow-sm" style={{ maxHeight: '320px' }}>
                      <CarCard car={car} />
                    </div>
                  ) : (
                    <div key={car.id} className="bg-[#F4E7E1] rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="flex flex-col sm:flex-row">
                        <div className="sm:w-1/3 h-40">
                          <Image 
                            src={car.imageUrl || `https://placehold.co/600x400/e0e0e0/8A0000?text=${car.make}+${car.model}`}
                            alt={car.title}
                            width={300}
                            height={200}
                            className="w-full h-full object-cover"
                            priority
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
                            <span>{car.mileage.toLocaleString()} mi</span>
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
            ) : (
              <div className="bg-[#F4E7E1] rounded-lg shadow p-8 text-center">
                <div className="text-gray-500 mb-4">No cars found matching your criteria.</div>
                <button 
                  className="text-primary hover:text-primary-hover font-medium"
                  onClick={clearAllFilters}
                >
                  Clear all filters
                </button>
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
    </div>
  );
} 