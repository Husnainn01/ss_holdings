'use client';

import React, { useState, useEffect } from 'react';
import { getItem } from '@/lib/localStorage';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Ship, 
  Save, 
  X, 
  Calendar, 
  Clock, 
  Anchor, 
  Navigation,
  Globe,
  AlertTriangle
} from 'lucide-react';

interface ShippingScheduleFormData {
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

interface ShippingScheduleFormProps {
  scheduleId?: string;
  isEditMode?: boolean;
  onSuccess?: () => void;
}

// Common country flags mapping
const countryFlags: Record<string, string> = {
  'Japan': '🇯🇵',
  'USA': '🇺🇸',
  'United States': '🇺🇸',
  'Germany': '🇩🇪',
  'Australia': '🇦🇺',
  'UAE': '🇦🇪',
  'Singapore': '🇸🇬',
  'UK': '🇬🇧',
  'United Kingdom': '🇬🇧',
  'Canada': '🇨🇦',
  'New Zealand': '🇳🇿',
  'Netherlands': '🇳🇱',
  'India': '🇮🇳',
  'South Korea': '🇰🇷',
  'China': '🇨🇳',
  'France': '🇫🇷',
  'Italy': '🇮🇹',
  'Spain': '🇪🇸',
  'Brazil': '🇧🇷',
  'Mexico': '🇲🇽'
};

const defaultFormData: ShippingScheduleFormData = {
  fromPort: '',
  fromCountry: 'Japan',
  fromFlag: '🇯🇵',
  toPort: '',
  toCountry: '',
  toFlag: '',
  carrier: '',
  transitTime: '',
  frequency: 'Weekly',
  nextDeparture: '',
  estimatedArrival: '',
  cutOffTime: '',
  status: 'active'
};

export default function ShippingScheduleForm({ 
  scheduleId, 
  isEditMode = false, 
  onSuccess 
}: ShippingScheduleFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<ShippingScheduleFormData>(defaultFormData);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Fetch existing schedule data for edit mode
  useEffect(() => {
    if (isEditMode && scheduleId) {
      fetchScheduleData();
    }
  }, [isEditMode, scheduleId]);

  const fetchScheduleData = async () => {
    try {
      setLoading(true);
      const token = getItem('adminAuth');
      
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api'}/shipping-schedule/${scheduleId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch schedule data');
      }

      const data = await response.json();
      if (data.success) {
        const schedule = data.data;
        setFormData({
          fromPort: schedule.fromPort,
          fromCountry: schedule.fromCountry,
          fromFlag: schedule.fromFlag,
          toPort: schedule.toPort,
          toCountry: schedule.toCountry,
          toFlag: schedule.toFlag,
          carrier: schedule.carrier,
          transitTime: schedule.transitTime,
          frequency: schedule.frequency,
          nextDeparture: new Date(schedule.nextDeparture).toISOString().slice(0, 16),
          estimatedArrival: new Date(schedule.estimatedArrival).toISOString().slice(0, 16),
          cutOffTime: new Date(schedule.cutOffTime).toISOString().slice(0, 16),
          status: schedule.status
        });
      } else {
        throw new Error(data.message || 'Failed to fetch schedule');
      }
    } catch (err) {
      console.error('Error fetching schedule:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch schedule');
    } finally {
      setLoading(false);
    }
  };

  // Handle form field changes
  const handleChange = (field: keyof ShippingScheduleFormData, value: string) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      
      // Auto-update flag when country changes
      if (field === 'fromCountry' || field === 'toCountry') {
        const flagField = field === 'fromCountry' ? 'fromFlag' : 'toFlag';
        updated[flagField] = countryFlags[value] || '🏳️';
      }
      
      return updated;
    });
    
    // Clear field-specific error
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Required fields
    const requiredFields: (keyof ShippingScheduleFormData)[] = [
      'fromPort', 'fromCountry', 'toPort', 'toCountry', 
      'carrier', 'transitTime', 'nextDeparture', 
      'estimatedArrival', 'cutOffTime'
    ];

    requiredFields.forEach(field => {
      if (!formData[field].trim()) {
        newErrors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
      }
    });

    // Date validations
    if (formData.nextDeparture && formData.cutOffTime) {
      const nextDeparture = new Date(formData.nextDeparture);
      const cutOffTime = new Date(formData.cutOffTime);
      
      if (cutOffTime >= nextDeparture) {
        newErrors.cutOffTime = 'Cut-off time must be before departure time';
      }
    }

    if (formData.nextDeparture && formData.estimatedArrival) {
      const nextDeparture = new Date(formData.nextDeparture);
      const estimatedArrival = new Date(formData.estimatedArrival);
      
      if (nextDeparture >= estimatedArrival) {
        newErrors.estimatedArrival = 'Estimated arrival must be after departure time';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setSaving(true);
      setError(null);
      
      const token = getItem('adminAuth');
      const url = isEditMode 
        ? `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api'}/shipping-schedule/${scheduleId}`
        : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api'}/shipping-schedule`;
      
      const method = isEditMode ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          nextDeparture: new Date(formData.nextDeparture).toISOString(),
          estimatedArrival: new Date(formData.estimatedArrival).toISOString(),
          cutOffTime: new Date(formData.cutOffTime).toISOString()
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to ${isEditMode ? 'update' : 'create'} schedule`);
      }

      const data = await response.json();
      if (data.success) {
        if (onSuccess) {
          onSuccess();
        } else {
          router.push('/admin/dashboard/shipping-schedule');
        }
      } else {
        throw new Error(data.message || `Failed to ${isEditMode ? 'update' : 'create'} schedule`);
      }
    } catch (err) {
      console.error('Error saving schedule:', err);
      setError(err instanceof Error ? err.message : 'Failed to save schedule');
    } finally {
      setSaving(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    router.back();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading schedule data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <Ship className="h-6 w-6 mr-2" />
            {isEditMode ? 'Edit' : 'Create'} Shipping Schedule
          </h1>
          <p className="text-gray-600 mt-1">
            {isEditMode ? 'Update shipping schedule details' : 'Add a new shipping route and schedule'}
          </p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-red-400 mr-2" />
            <span className="text-red-700">{error}</span>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Route Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Navigation className="h-5 w-5 mr-2" />
              Route Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* From Location */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  From Port *
                </label>
                <input
                  type="text"
                  value={formData.fromPort}
                  onChange={(e) => handleChange('fromPort', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.fromPort ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="e.g., Tokyo"
                />
                {errors.fromPort && (
                  <p className="mt-1 text-sm text-red-600">{errors.fromPort}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  From Country *
                </label>
                <select
                  value={formData.fromCountry}
                  onChange={(e) => handleChange('fromCountry', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.fromCountry ? 'border-red-300' : 'border-gray-300'
                  }`}
                >
                  {Object.keys(countryFlags).map(country => (
                    <option key={country} value={country}>
                      {countryFlags[country]} {country}
                    </option>
                  ))}
                </select>
                {errors.fromCountry && (
                  <p className="mt-1 text-sm text-red-600">{errors.fromCountry}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  From Flag
                </label>
                <input
                  type="text"
                  value={formData.fromFlag}
                  onChange={(e) => handleChange('fromFlag', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="🇯🇵"
                  maxLength={10}
                />
              </div>
            </div>

            {/* To Location */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  To Port *
                </label>
                <input
                  type="text"
                  value={formData.toPort}
                  onChange={(e) => handleChange('toPort', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.toPort ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="e.g., Los Angeles"
                />
                {errors.toPort && (
                  <p className="mt-1 text-sm text-red-600">{errors.toPort}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  To Country *
                </label>
                <select
                  value={formData.toCountry}
                  onChange={(e) => handleChange('toCountry', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.toCountry ? 'border-red-300' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select Country</option>
                  {Object.keys(countryFlags).map(country => (
                    <option key={country} value={country}>
                      {countryFlags[country]} {country}
                    </option>
                  ))}
                </select>
                {errors.toCountry && (
                  <p className="mt-1 text-sm text-red-600">{errors.toCountry}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  To Flag
                </label>
                <input
                  type="text"
                  value={formData.toFlag}
                  onChange={(e) => handleChange('toFlag', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="🇺🇸"
                  maxLength={10}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Shipping Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Anchor className="h-5 w-5 mr-2" />
              Shipping Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Carrier *
                </label>
                <input
                  type="text"
                  value={formData.carrier}
                  onChange={(e) => handleChange('carrier', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.carrier ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="e.g., NYK Line"
                />
                {errors.carrier && (
                  <p className="mt-1 text-sm text-red-600">{errors.carrier}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Transit Time *
                </label>
                <input
                  type="text"
                  value={formData.transitTime}
                  onChange={(e) => handleChange('transitTime', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.transitTime ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="e.g., 10-12 days"
                />
                {errors.transitTime && (
                  <p className="mt-1 text-sm text-red-600">{errors.transitTime}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Frequency *
                </label>
                <select
                  value={formData.frequency}
                  onChange={(e) => handleChange('frequency', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Daily">Daily</option>
                  <option value="Weekly">Weekly</option>
                  <option value="Bi-weekly">Bi-weekly</option>
                  <option value="Monthly">Monthly</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status *
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => handleChange('status', e.target.value as 'active' | 'delayed' | 'cancelled')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="active">Active</option>
                  <option value="delayed">Delayed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Schedule Dates */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Schedule Dates
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cut-off Time *
                </label>
                <input
                  type="datetime-local"
                  value={formData.cutOffTime}
                  onChange={(e) => handleChange('cutOffTime', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.cutOffTime ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.cutOffTime && (
                  <p className="mt-1 text-sm text-red-600">{errors.cutOffTime}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Next Departure *
                </label>
                <input
                  type="datetime-local"
                  value={formData.nextDeparture}
                  onChange={(e) => handleChange('nextDeparture', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.nextDeparture ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.nextDeparture && (
                  <p className="mt-1 text-sm text-red-600">{errors.nextDeparture}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estimated Arrival *
                </label>
                <input
                  type="datetime-local"
                  value={formData.estimatedArrival}
                  onChange={(e) => handleChange('estimatedArrival', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.estimatedArrival ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.estimatedArrival && (
                  <p className="mt-1 text-sm text-red-600">{errors.estimatedArrival}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex items-center justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={saving}
          >
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={saving}
            className="min-w-[120px]"
          >
            {saving ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Saving...
              </div>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                {isEditMode ? 'Update' : 'Create'} Schedule
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
} 