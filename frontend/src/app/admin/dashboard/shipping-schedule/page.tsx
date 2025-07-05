'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Ship, 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye,
  Calendar,
  Clock,
  Anchor,
  Navigation,
  MoreHorizontal,
  Check,
  X,
  AlertTriangle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';

interface ShippingSchedule {
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
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy?: {
    name: string;
    email: string;
  };
  updatedBy?: {
    name: string;
    email: string;
  };
}

interface PaginationData {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export default function ShippingScheduleManagementPage() {
  const [schedules, setSchedules] = useState<ShippingSchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSchedules, setSelectedSchedules] = useState<string[]>([]);
  const [pagination, setPagination] = useState<PaginationData>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
    hasNextPage: false,
    hasPrevPage: false
  });

  // Filter states
  const [filters, setFilters] = useState({
    search: '',
    fromPort: 'all',
    toCountry: 'all',
    status: 'all',
    page: 1,
    limit: 10,
    sortBy: 'nextDeparture',
    sortOrder: 'asc' as 'asc' | 'desc'
  });

  // Available filter options
  const [filterOptions, setFilterOptions] = useState({
    fromPorts: [] as string[],
    toCountries: [] as string[]
  });

  // Fetch schedules
  const fetchSchedules = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminAuth');
      
      const queryParams = new URLSearchParams({
        page: filters.page.toString(),
        limit: filters.limit.toString(),
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
        ...(filters.search && { search: filters.search }),
        ...(filters.fromPort !== 'all' && { fromPort: filters.fromPort }),
        ...(filters.toCountry !== 'all' && { toCountry: filters.toCountry }),
        ...(filters.status !== 'all' && { status: filters.status })
      });

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api'}/shipping-schedule?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch shipping schedules');
      }

      const data = await response.json();
      if (data.success) {
        setSchedules(data.data.schedules);
        setPagination(data.data.pagination);
      } else {
        throw new Error(data.message || 'Failed to fetch schedules');
      }
    } catch (err) {
      console.error('Error fetching schedules:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch schedules');
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

  // Delete schedule
  const deleteSchedule = async (id: string) => {
    if (!confirm('Are you sure you want to delete this shipping schedule?')) {
      return;
    }

    try {
      const token = localStorage.getItem('adminAuth');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api'}/shipping-schedule/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete schedule');
      }

      const data = await response.json();
      if (data.success) {
        setSchedules(prev => prev.filter(schedule => schedule._id !== id));
        alert('Schedule deleted successfully');
      } else {
        throw new Error(data.message || 'Failed to delete schedule');
      }
    } catch (err) {
      console.error('Error deleting schedule:', err);
      alert(err instanceof Error ? err.message : 'Failed to delete schedule');
    }
  };

  // Bulk update status
  const bulkUpdateStatus = async (status: 'active' | 'delayed' | 'cancelled') => {
    if (selectedSchedules.length === 0) {
      alert('Please select schedules to update');
      return;
    }

    if (!confirm(`Are you sure you want to update ${selectedSchedules.length} schedule(s) to ${status}?`)) {
      return;
    }

    try {
      const token = localStorage.getItem('adminAuth');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api'}/shipping-schedule/bulk-status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          scheduleIds: selectedSchedules,
          status
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update schedules');
      }

      const data = await response.json();
      if (data.success) {
        await fetchSchedules();
        setSelectedSchedules([]);
        alert(`${data.data.modifiedCount} schedule(s) updated successfully`);
      } else {
        throw new Error(data.message || 'Failed to update schedules');
      }
    } catch (err) {
      console.error('Error updating schedules:', err);
      alert(err instanceof Error ? err.message : 'Failed to update schedules');
    }
  };

  // Handle filter changes
  const handleFilterChange = (key: string, value: string | number) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: key !== 'page' ? 1 : (value as number) // Reset to first page when changing filters
    }));
  };

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    handleFilterChange('page', 1);
  };

  // Toggle schedule selection
  const toggleScheduleSelection = (scheduleId: string) => {
    setSelectedSchedules(prev => 
      prev.includes(scheduleId) 
        ? prev.filter(id => id !== scheduleId)
        : [...prev, scheduleId]
    );
  };

  // Select all schedules
  const toggleSelectAll = () => {
    if (selectedSchedules.length === schedules.length) {
      setSelectedSchedules([]);
    } else {
      setSelectedSchedules(schedules.map(schedule => schedule._id));
    }
  };

  // Get status badge variant
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case 'delayed':
        return <Badge className="bg-yellow-100 text-yellow-800">Delayed</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-800">Cancelled</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>;
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

  // Effects
  useEffect(() => {
    fetchSchedules();
  }, [filters]);

  useEffect(() => {
    fetchFilterOptions();
  }, []);

  if (loading && schedules.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading shipping schedules...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <Ship className="h-6 w-6 mr-2" />
            Shipping Schedules
          </h1>
          <p className="text-gray-600 mt-1">
            Manage shipping routes and schedules
          </p>
        </div>
        <Link href="/admin/dashboard/shipping-schedule/new">
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add New Schedule
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="h-4 w-4 text-gray-500" />
          <h2 className="font-medium text-gray-900">Filters</h2>
        </div>
        
        <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          {/* Search */}
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search ports, carriers..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* From Port */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">From Port</label>
            <select
              value={filters.fromPort}
              onChange={(e) => handleFilterChange('fromPort', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Ports</option>
              {filterOptions.fromPorts.map(port => (
                <option key={port} value={port}>{port}</option>
              ))}
            </select>
          </div>

          {/* To Country */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">To Country</label>
            <select
              value={filters.toCountry}
              onChange={(e) => handleFilterChange('toCountry', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Countries</option>
              {filterOptions.toCountries.map(country => (
                <option key={country} value={country}>{country}</option>
              ))}
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="delayed">Delayed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {/* Per Page */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Per Page</label>
            <select
              value={filters.limit}
              onChange={(e) => handleFilterChange('limit', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div>
        </form>
      </div>

      {/* Bulk Actions */}
      {selectedSchedules.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-blue-700">
              {selectedSchedules.length} schedule(s) selected
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => bulkUpdateStatus('active')}
                className="text-green-600 border-green-300 hover:bg-green-50"
              >
                <Check className="h-4 w-4 mr-1" />
                Mark Active
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => bulkUpdateStatus('delayed')}
                className="text-yellow-600 border-yellow-300 hover:bg-yellow-50"
              >
                <Clock className="h-4 w-4 mr-1" />
                Mark Delayed
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => bulkUpdateStatus('cancelled')}
                className="text-red-600 border-red-300 hover:bg-red-50"
              >
                <X className="h-4 w-4 mr-1" />
                Mark Cancelled
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-red-400 mr-2" />
            <span className="text-red-700">{error}</span>
          </div>
        </div>
      )}

      {/* Schedules Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">
              Shipping Schedules ({pagination.totalItems})
            </h3>
            {schedules.length > 0 && (
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={selectedSchedules.length === schedules.length}
                  onChange={toggleSelectAll}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Select All</span>
              </label>
            )}
          </div>
        </div>

        {schedules.length === 0 ? (
          <div className="p-12 text-center">
            <Ship className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No schedules found</h3>
            <p className="text-gray-500 mb-6">
              {filters.search || filters.fromPort !== 'all' || filters.toCountry !== 'all' || filters.status !== 'all'
                ? 'Try adjusting your filters to see more results.'
                : 'Get started by creating your first shipping schedule.'
              }
            </p>
            <Link href="/admin/dashboard/shipping-schedule/new">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add New Schedule
              </Button>
            </Link>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Select
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Route
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Carrier
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Schedule
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Updated
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {schedules.map((schedule) => (
                    <tr key={schedule._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedSchedules.includes(schedule._id)}
                          onChange={() => toggleScheduleSelection(schedule._id)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex items-center text-sm font-medium text-gray-900">
                            <span className="mr-1">{schedule.fromFlag}</span>
                            <span>{schedule.fromPort}</span>
                            <span className="mx-2 text-gray-400">→</span>
                            <span className="mr-1">{schedule.toFlag}</span>
                            <span>{schedule.toPort}</span>
                          </div>
                        </div>
                        <div className="text-sm text-gray-500">
                          {schedule.fromCountry} to {schedule.toCountry}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{schedule.carrier}</div>
                        <div className="text-sm text-gray-500">{schedule.transitTime}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                            {formatDate(schedule.nextDeparture)}
                          </div>
                          <div className="flex items-center text-gray-500 mt-1">
                            <Navigation className="h-4 w-4 text-gray-400 mr-1" />
                            {schedule.frequency}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(schedule.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div>{formatDate(schedule.updatedAt)}</div>
                        {schedule.updatedBy && (
                          <div className="text-xs">by {schedule.updatedBy.name}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link href={`/admin/dashboard/shipping-schedule/edit/${schedule._id}`}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => deleteSchedule(schedule._id)}
                              className="text-red-600"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="px-6 py-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                    Showing {((pagination.currentPage - 1) * pagination.itemsPerPage) + 1} to{' '}
                    {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)} of{' '}
                    {pagination.totalItems} results
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleFilterChange('page', pagination.currentPage - 1)}
                      disabled={!pagination.hasPrevPage}
                    >
                      Previous
                    </Button>
                    
                    <div className="flex items-center space-x-1">
                      {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                        let pageNum;
                        if (pagination.totalPages <= 5) {
                          pageNum = i + 1;
                        } else {
                          const start = Math.max(1, pagination.currentPage - 2);
                          const end = Math.min(pagination.totalPages, start + 4);
                          pageNum = start + i;
                          if (pageNum > end) return null;
                        }
                        
                        return (
                          <Button
                            key={pageNum}
                            variant={pagination.currentPage === pageNum ? "default" : "outline"}
                            size="sm"
                            onClick={() => handleFilterChange('page', pageNum)}
                          >
                            {pageNum}
                          </Button>
                        );
                      })}
                    </div>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleFilterChange('page', pagination.currentPage + 1)}
                      disabled={!pagination.hasNextPage}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
} 