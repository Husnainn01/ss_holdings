'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { OptionCategory } from '@/services/optionsAPI';

// Define the option categories with their display names and descriptions
const optionCategories: { 
  id: OptionCategory; 
  title: string; 
  description: string;
  icon: string;
}[] = [
  {
    id: 'makes',
    title: 'Car Makes',
    description: 'Manage car manufacturers like Toyota, Honda, BMW, etc.',
    icon: '🚗'
  },
  {
    id: 'bodyTypes',
    title: 'Body Types',
    description: 'Manage vehicle body types like Sedan, SUV, Truck, etc.',
    icon: '🚙'
  },
  {
    id: 'fuelTypes',
    title: 'Fuel Types',
    description: 'Manage fuel types like Petrol, Diesel, Electric, etc.',
    icon: '⛽'
  },
  {
    id: 'transmissionTypes',
    title: 'Transmission Types',
    description: 'Manage transmission types like Automatic, Manual, etc.',
    icon: '⚙️'
  },
  {
    id: 'driveTypes',
    title: 'Drive Types',
    description: 'Manage drive types like FWD, RWD, AWD, etc.',
    icon: '🔄'
  },
  {
    id: 'conditionTypes',
    title: 'Condition Types',
    description: 'Manage vehicle conditions like New, Used, Certified Pre-Owned, etc.',
    icon: '✨'
  },
  {
    id: 'features',
    title: 'Features',
    description: 'Manage vehicle features like Bluetooth, Sunroof, etc.',
    icon: '🔌'
  },
  {
    id: 'safetyFeatures',
    title: 'Safety Features',
    description: 'Manage safety features like Airbags, ABS, etc.',
    icon: '🛡️'
  },
  {
    id: 'months',
    title: 'Months',
    description: 'Manage month options for date selections',
    icon: '📅'
  },
  {
    id: 'offerTypes',
    title: 'Offer Types',
    description: 'Manage types of offers like Sale, Discount, etc.',
    icon: '🏷️'
  }
];

export default function OptionsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Options Management</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {optionCategories.map((category) => (
          <Card key={category.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xl font-bold">{category.title}</CardTitle>
              <div className="text-3xl">{category.icon}</div>
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-4">{category.description}</CardDescription>
              <Link href={`/admin/dashboard/options/${category.id}`}>
                <Button>Manage {category.title}</Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
} 