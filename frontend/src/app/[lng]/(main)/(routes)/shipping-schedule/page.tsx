'use client';

import React, { useState, useEffect } from 'react';
import { 
  Ship, 
  Calendar, 
  MapPin, 
  Clock, 
  Globe, 
  Filter,
  Search,
  ChevronRight,
  Anchor,
  Navigation,
  Phone,
  ChevronLeft,
  ChevronsLeft,
  ChevronsRight,
  AlertTriangle
} from 'lucide-react';

interface ShippingRoute {
  _id: string;
  fromPort: string;
  fromCountry: string;
  fromFlag: string;
  toPort: string;
  toCountry: string;
  toFlag: string;
  carrier: string;
  transitTime: string;
  frequency: string;
  nextDeparture: string;
  estimatedArrival: string;
  cutOffTime: string;
  status: 'active' | 'delayed' | 'cancelled';
}

interface PaginationData {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

export default function ShippingSchedulePage() {
  const [shippingRoutes, setShippingRoutes] = useState<ShippingRoute[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFromPort, setSelectedFromPort] = useState<string>('all');
  const [selectedToCountry, setSelectedToCountry] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(5);
  const [pagination, setPagination] = useState<PaginationData>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 5
  });

  // Filter options
  const [filterOptions, setFilterOptions] = useState({
    fromPorts: [] as string[],
    toCountries: [] as string[]
  });

  // Fetch shipping schedules from API
  const fetchShippingSchedules = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const queryParams = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
        ...(selectedFromPort !== 'all' && { fromPort: selectedFromPort }),
        ...(selectedToCountry !== 'all' && { toCountry: selectedToCountry }),
        ...(searchTerm && { search: searchTerm })
      });

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api'}/shipping-schedule/public?${queryParams}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch shipping schedules');
      }

      const data = await response.json();
      if (data.success) {
        setShippingRoutes(data.data.schedules);
        setPagination(data.data.pagination);
      } else {
        throw new Error(data.message || 'Failed to fetch schedules');
      }
    } catch (err) {
      console.error('Error fetching shipping schedules:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch shipping schedules');
    } finally {
      setLoading(false);
    }
  };

  // Fetch filter options
  const fetchFilterOptions = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api'}/shipping-schedule/filters`);
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setFilterOptions({
            fromPorts: data.data.fromPorts,
            toCountries: data.data.toCountries
          });
        }
      }
    } catch (err) {
      console.error('Error fetching filter options:', err);
    }
  };

  // Effects
  useEffect(() => {
    fetchShippingSchedules();
  }, [currentPage, itemsPerPage, selectedFromPort, selectedToCountry, searchTerm]);

  useEffect(() => {
    fetchFilterOptions();
  }, []);

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle previous page
  const handlePreviousPage = () => {
    if (pagination.currentPage > 1) {
      handlePageChange(pagination.currentPage - 1);
    }
  };

  // Handle next page
  const handleNextPage = () => {
    if (pagination.currentPage < pagination.totalPages) {
      handlePageChange(pagination.currentPage + 1);
    }
  };

  // Get page numbers for pagination
  const getPageNumbers = () => {
    const pages: number[] = [];
    const maxPages = 5;
    const totalPages = pagination.totalPages;
    const current = pagination.currentPage;
    
    if (totalPages <= maxPages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const start = Math.max(1, current - Math.floor(maxPages / 2));
      const end = Math.min(totalPages, start + maxPages - 1);
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }
    
    return pages;
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'delayed': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchShippingSchedules();
  };

  const handleFilterChange = (field: string, value: string) => {
    setCurrentPage(1);
    if (field === 'fromPort') {
      setSelectedFromPort(value);
    } else if (field === 'toCountry') {
      setSelectedToCountry(value);
    }
  };

  const handleItemsPerPageChange = (value: number) => {
    setItemsPerPage(value);
    setCurrentPage(1);
  };

  if (loading && shippingRoutes.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading shipping schedules...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <Ship className="h-16 w-16 mx-auto mb-4" />
            <h1 className="text-4xl font-bold mb-4">Shipping Schedule</h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              View our comprehensive shipping schedules from Japanese ports to worldwide destinations
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-red-400 mr-2" />
              <span className="text-red-700">{error}</span>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="h-5 w-5 text-gray-500" />
            <h2 className="text-lg font-semibold text-gray-900">Filter Schedules</h2>
          </div>
          
          <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search destinations, carriers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* From Port */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                From Port
              </label>
              <select
                value={selectedFromPort}
                onChange={(e) => handleFilterChange('fromPort', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Ports</option>
                {filterOptions.fromPorts.map(port => (
                  <option key={port} value={port}>{port}</option>
                ))}
              </select>
            </div>

            {/* To Country */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                To Country
              </label>
              <select
                value={selectedToCountry}
                onChange={(e) => handleFilterChange('toCountry', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Countries</option>
                {filterOptions.toCountries.map(country => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </select>
            </div>

            {/* Items per page */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Per Page
              </label>
              <select
                value={itemsPerPage}
                onChange={(e) => handleItemsPerPageChange(parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={15}>15</option>
                <option value={20}>20</option>
              </select>
            </div>
          </form>
        </div>

        {/* Results */}
        <div className="mb-6">
          <div className="text-sm text-gray-600">
            Showing {pagination.totalItems} shipping routes
          </div>
        </div>

        {/* Shipping Routes */}
        {shippingRoutes.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <Ship className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No schedules found</h3>
            <p className="text-gray-500">
              {searchTerm || selectedFromPort !== 'all' || selectedToCountry !== 'all'
                ? 'Try adjusting your search filters.'
                : 'No shipping schedules are currently available.'
              }
            </p>
          </div>
        ) : (
          <div className="grid gap-6">
            {shippingRoutes.map((route) => (
              <div key={route._id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                    {/* Route Info */}
                    <div className="flex-1">
                      <div className="flex items-center text-lg font-semibold text-gray-900 mb-2">
                        <span className="mr-2">{route.fromFlag}</span>
                        <span>{route.fromPort}</span>
                        <ChevronRight className="h-5 w-5 text-gray-400 mx-2" />
                        <span className="mr-2">{route.toFlag}</span>
                        <span>{route.toPort}</span>
                      </div>
                      <div className="text-sm text-gray-600 mb-3">
                        {route.fromCountry} to {route.toCountry}
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div className="flex items-center">
                          <Anchor className="h-4 w-4 text-blue-500 mr-2" />
                          <div>
                            <div className="font-medium">{route.carrier}</div>
                            <div className="text-gray-500">Carrier</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 text-green-500 mr-2" />
                          <div>
                            <div className="font-medium">{route.transitTime}</div>
                            <div className="text-gray-500">Transit Time</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center">
                          <Navigation className="h-4 w-4 text-orange-500 mr-2" />
                          <div>
                            <div className="font-medium">{route.frequency}</div>
                            <div className="text-gray-500">Frequency</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 text-purple-500 mr-2" />
                          <div>
                            <div className="font-medium">{formatDate(route.nextDeparture)}</div>
                            <div className="text-gray-500">Next Departure</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Status */}
                    <div className="mt-4 lg:mt-0 lg:ml-6">
                      <div className="flex items-center justify-between lg:justify-end">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(route.status)}`}>
                          {route.status.charAt(0).toUpperCase() + route.status.slice(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="mt-8 flex items-center justify-center">
            <nav className="flex items-center space-x-2">
              <button
                onClick={() => handlePageChange(1)}
                disabled={pagination.currentPage === 1}
                className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronsLeft className="h-4 w-4" />
              </button>
              
              <button
                onClick={handlePreviousPage}
                disabled={pagination.currentPage === 1}
                className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              
              {getPageNumbers().map(page => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    pagination.currentPage === page
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {page}
                </button>
              ))}
              
              <button
                onClick={handleNextPage}
                disabled={pagination.currentPage === pagination.totalPages}
                className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
              
              <button
                onClick={() => handlePageChange(pagination.totalPages)}
                disabled={pagination.currentPage === pagination.totalPages}
                className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronsRight className="h-4 w-4" />
              </button>
            </nav>
          </div>
        )}

        {/* Contact Section */}
        <div className="mt-16 bg-white rounded-lg shadow-md p-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Need Help with Shipping?</h2>
            <p className="text-gray-600 mb-6">
              Our shipping experts are here to help you find the best route for your vehicle export needs.
            </p>
            <div className="flex items-center justify-center space-x-6">
              <div className="flex items-center text-gray-600">
                <Phone className="h-5 w-5 mr-2" />
                <span>+81-3-1234-5678</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Globe className="h-5 w-5 mr-2" />
                <span>support@ssholdings.com</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 