'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import OptionsManager from '@/components/admin/OptionsManager';
import { OptionCategory } from '@/services/optionsAPI';

// Define the option categories with their display names and descriptions
const optionCategories: Record<string, { title: string; description: string }> = {
  makes: {
    title: 'Car Makes',
    description: 'Manage car manufacturers like Toyota, Honda, BMW, etc.'
  },
  bodyTypes: {
    title: 'Body Types',
    description: 'Manage vehicle body types like Sedan, SUV, Truck, etc.'
  },
  fuelTypes: {
    title: 'Fuel Types',
    description: 'Manage fuel types like Petrol, Diesel, Electric, etc.'
  },
  transmissionTypes: {
    title: 'Transmission Types',
    description: 'Manage transmission types like Automatic, Manual, etc.'
  },
  driveTypes: {
    title: 'Drive Types',
    description: 'Manage drive types like FWD, RWD, AWD, etc.'
  },
  conditionTypes: {
    title: 'Condition Types',
    description: 'Manage vehicle conditions like New, Used, Certified Pre-Owned, etc.'
  },
  features: {
    title: 'Features',
    description: 'Manage vehicle features like Bluetooth, Sunroof, etc.'
  },
  safetyFeatures: {
    title: 'Safety Features',
    description: 'Manage safety features like Airbags, ABS, etc.'
  },
  months: {
    title: 'Months',
    description: 'Manage month options for date selections'
  },
  offerTypes: {
    title: 'Offer Types',
    description: 'Manage types of offers like Sale, Discount, etc.'
  }
};

export default function CategoryOptionsPage() {
  const params = useParams();
  const router = useRouter();
  const category = params.category as string;
  
  // Check if the category is valid
  const isValidCategory = Object.keys(optionCategories).includes(category);
  
  if (!isValidCategory) {
    return (
      <div className="p-6">
        <div className="mb-6">
          <Button variant="outline" onClick={() => router.push('/admin/dashboard/options')}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Options
          </Button>
        </div>
        <div className="bg-red-50 p-4 rounded-md">
          <h1 className="text-xl font-bold text-red-600">Invalid Category</h1>
          <p className="text-red-500">The requested category does not exist.</p>
          <Button 
            className="mt-4" 
            onClick={() => router.push('/admin/dashboard/options')}
          >
            Return to Options Management
          </Button>
        </div>
      </div>
    );
  }
  
  const categoryInfo = optionCategories[category];
  
  return (
    <div className="space-y-6">
      <div className="mb-6">
        <Button variant="outline" onClick={() => router.push('/admin/dashboard/options')}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Options
        </Button>
      </div>
      
      <OptionsManager 
        category={category as OptionCategory}
        title={categoryInfo.title}
        description={categoryInfo.description}
      />
    </div>
  );
} 