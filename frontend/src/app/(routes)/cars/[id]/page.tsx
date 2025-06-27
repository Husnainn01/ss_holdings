'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { notFound } from 'next/navigation';
import { 
  ArrowLeft, 
  Calendar, 
  Car, 
  Gauge, 
  MapPin, 
  Fuel, 
  Settings, 
  Share2, 
  Heart, 
  Phone, 
  Mail,
  Check,
  ArrowRight
} from 'lucide-react';

// This would come from your database in a real app
const getCar = (id: string) => {
  // Mock data for a car
  const car = {
    id,
    title: '2023 Toyota Camry XSE',
    stockNumber: 'T12345',
    price: 32500,
    year: 2023,
    month: 5, // May
    make: 'Toyota',
    model: 'Camry',
    mileage: 5000,
    mileageUnit: 'km',
    vin: 'JT2BF22K1W0123456',
    color: 'Pearl White',
    interiorColor: 'Black',
    bodyType: 'Sedan',
    transmission: 'Automatic',
    fuel: 'Petrol',
    driveType: 'FWD',
    engineType: '2.5L Inline-4',
    engineCapacity: 2.5,
    seatingCapacity: 5,
    doors: 4,
    condition: 'Used',
    location: 'Tokyo, Japan',
    status: 'in-stock',
    description: 'This 2023 Toyota Camry XSE is in excellent condition with low mileage. It features a powerful yet fuel-efficient 2.5L engine, automatic transmission, and front-wheel drive. The exterior is a beautiful Pearl White color with a sleek Black interior. This model comes with a variety of modern features and is ready for export worldwide.',
    features: [
      'Leather Seats',
      'Navigation System',
      'Backup Camera',
      'Bluetooth',
      'Keyless Entry',
      'Sunroof',
      'Alloy Wheels',
      'Heated Seats',
      'Apple CarPlay',
      'Android Auto',
      'Lane Departure Warning',
      'Automatic Emergency Braking'
    ],
    images: [
      'https://placehold.co/800x600/png?text=Toyota+Camry+1',
      'https://placehold.co/800x600/png?text=Toyota+Camry+2',
      'https://placehold.co/800x600/png?text=Toyota+Camry+3',
      'https://placehold.co/800x600/png?text=Toyota+Camry+4',
      'https://placehold.co/800x600/png?text=Toyota+Camry+5'
    ],
    similarCars: [
      {
        id: '2',
        title: '2022 Honda Accord EX',
        price: 29800,
        mileage: 8500,
        image: 'https://placehold.co/400x300/png?text=Honda+Accord'
      },
      {
        id: '3',
        title: '2023 Nissan Altima SL',
        price: 31200,
        mileage: 3200,
        image: 'https://placehold.co/400x300/png?text=Nissan+Altima'
      },
      {
        id: '4',
        title: '2022 Mazda 6 Grand Touring',
        price: 30500,
        mileage: 7800,
        image: 'https://placehold.co/400x300/png?text=Mazda+6'
      }
    ]
  };

  return car;
};

interface CarDetailPageProps {
  params: {
    id: string;
  }
}

export default function CarDetailPage({ params }: CarDetailPageProps) {
  const car = getCar(params.id);
  const [activeTab, setActiveTab] = useState('specifications');
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  if (!car) {
    notFound();
  }

  const tabs = [
    { id: 'specifications', label: 'Specifications' },
    { id: 'features', label: 'Features' },
    { id: 'description', label: 'Description' },
    { id: 'inquire', label: 'Inquire' },
  ];

  const handlePrevImage = () => {
    setActiveImageIndex((prev) => 
      prev === 0 ? car.images.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setActiveImageIndex((prev) => 
      prev === car.images.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <div className="bg-[#F3F4F6] min-h-screen">
      {/* Back Navigation */}
      <div className="container mx-auto px-4 py-4">
        <Link href="/cars" className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors">
          <ArrowLeft size={18} className="mr-2" />
          <span>Back to All Cars</span>
        </Link>
      </div>
      
      {/* Hero Section */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Main Image Gallery */}
            <div className="w-full lg:w-7/12 xl:w-8/12">
              <div className="relative rounded-lg overflow-hidden bg-gray-100 h-[400px] md:h-[500px]">
                <Image
                  src={car.images[activeImageIndex]}
                  alt={car.title}
                  fill
                  priority
                  className="object-cover"
                />
                
                {/* Image Navigation */}
                <div className="absolute inset-0 flex items-center justify-between px-4">
                  <button 
                    onClick={handlePrevImage}
                    className="bg-white/80 hover:bg-white rounded-full p-2 shadow-md transition-all"
                    aria-label="Previous image"
                  >
                    <ArrowLeft size={20} />
                  </button>
                  <button 
                    onClick={handleNextImage}
                    className="bg-white/80 hover:bg-white rounded-full p-2 shadow-md transition-all"
                    aria-label="Next image"
                  >
                    <ArrowRight size={20} />
                  </button>
                </div>
                
                {/* Image Counter */}
                <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                  {activeImageIndex + 1} / {car.images.length}
                </div>
              </div>
              
              {/* Thumbnails */}
              <div className="mt-4 grid grid-cols-5 gap-2">
                {car.images.map((image, index) => (
                  <button 
                    key={index} 
                    onClick={() => setActiveImageIndex(index)}
                    className={`relative h-20 w-full rounded-md overflow-hidden transition-all ${
                      activeImageIndex === index 
                        ? 'border-2 border-blue-600 opacity-100' 
                        : 'border border-gray-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${car.title} thumbnail ${index + 1}`}
                      fill
                      sizes="(max-width: 768px) 20vw, 10vw"
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
            
            {/* Key Details */}
            <div className="w-full lg:w-5/12 xl:w-4/12">
              <div className="bg-white p-6 rounded-lg h-full">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h1 className="text-3xl font-bold">{car.title}</h1>
                    <p className="text-gray-500 mt-1">Stock #: {car.stockNumber}</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-2 hover:bg-gray-100 rounded-full transition-colors" aria-label="Share">
                      <Share2 size={20} />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-full transition-colors" aria-label="Add to favorites">
                      <Heart size={20} />
                    </button>
                  </div>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg mb-6">
                  <div className="text-3xl font-bold text-blue-900">${car.price.toLocaleString()}</div>
                  <div className="text-blue-700 text-sm mt-1 font-medium">Price includes shipping and export documentation</div>
                </div>
                
                <div className="mb-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center">
                      <Calendar size={20} className="text-gray-500 mr-3" />
                      <div>
                        <div className="text-sm text-gray-500">Year</div>
                        <div className="font-medium">{car.year}</div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Gauge size={20} className="text-gray-500 mr-3" />
                      <div>
                        <div className="text-sm text-gray-500">Mileage</div>
                        <div className="font-medium">{car.mileage.toLocaleString()} {car.mileageUnit}</div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Fuel size={20} className="text-gray-500 mr-3" />
                      <div>
                        <div className="text-sm text-gray-500">Fuel</div>
                        <div className="font-medium">{car.fuel}</div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Settings size={20} className="text-gray-500 mr-3" />
                      <div>
                        <div className="text-sm text-gray-500">Transmission</div>
                        <div className="font-medium">{car.transmission}</div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Car size={20} className="text-gray-500 mr-3" />
                      <div>
                        <div className="text-sm text-gray-500">Body Type</div>
                        <div className="font-medium">{car.bodyType}</div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <MapPin size={20} className="text-gray-500 mr-3" />
                      <div>
                        <div className="text-sm text-gray-500">Location</div>
                        <div className="font-medium">{car.location}</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mb-6">
                  <div className="bg-green-50 text-green-800 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium">
                    <Check size={16} className="mr-1" /> Available for Export
                  </div>
                </div>
                
                <div className="flex flex-col gap-3">
                  <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white">
                    Request a Quote
                  </Button>
                  <div className="grid grid-cols-2 gap-3">
                    <Button variant="outline" size="lg" className="flex items-center justify-center">
                      <Phone size={18} className="mr-2" />
                      Call Us
                    </Button>
                    <Button variant="outline" size="lg" className="flex items-center justify-center">
                      <Mail size={18} className="mr-2" />
                      Email
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Tabs Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="border-b">
            <div className="flex overflow-x-auto">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors ${
                    activeTab === tab.id
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
          
          <div className="p-6">
            {/* Specifications Tab */}
            {activeTab === 'specifications' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-6 gap-x-10">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
                  <table className="w-full">
                    <tbody>
                      <tr className="border-b">
                        <td className="py-3 text-gray-500">Make</td>
                        <td className="py-3 text-right font-medium">{car.make}</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-3 text-gray-500">Model</td>
                        <td className="py-3 text-right font-medium">{car.model}</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-3 text-gray-500">Year</td>
                        <td className="py-3 text-right font-medium">{car.year}</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-3 text-gray-500">VIN</td>
                        <td className="py-3 text-right font-medium">{car.vin}</td>
                      </tr>
                      <tr>
                        <td className="py-3 text-gray-500">Condition</td>
                        <td className="py-3 text-right font-medium">{car.condition}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-4">Technical Specifications</h3>
                  <table className="w-full">
                    <tbody>
                      <tr className="border-b">
                        <td className="py-3 text-gray-500">Engine</td>
                        <td className="py-3 text-right font-medium">{car.engineType}</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-3 text-gray-500">Transmission</td>
                        <td className="py-3 text-right font-medium">{car.transmission}</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-3 text-gray-500">Drive Type</td>
                        <td className="py-3 text-right font-medium">{car.driveType}</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-3 text-gray-500">Fuel Type</td>
                        <td className="py-3 text-right font-medium">{car.fuel}</td>
                      </tr>
                      <tr>
                        <td className="py-3 text-gray-500">Body Type</td>
                        <td className="py-3 text-right font-medium">{car.bodyType}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-4">Exterior & Interior</h3>
                  <table className="w-full">
                    <tbody>
                      <tr className="border-b">
                        <td className="py-3 text-gray-500">Exterior Color</td>
                        <td className="py-3 text-right font-medium">{car.color}</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-3 text-gray-500">Interior Color</td>
                        <td className="py-3 text-right font-medium">{car.interiorColor}</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-3 text-gray-500">Doors</td>
                        <td className="py-3 text-right font-medium">{car.doors}</td>
                      </tr>
                      <tr>
                        <td className="py-3 text-gray-500">Seating</td>
                        <td className="py-3 text-right font-medium">{car.seatingCapacity} People</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            
            {/* Features Tab */}
            {activeTab === 'features' && (
              <div>
                <h3 className="text-lg font-semibold mb-6">Vehicle Features</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {car.features.map((feature, index) => (
                    <div key={index} className="flex items-center bg-gray-50 p-3 rounded-lg">
                      <Check size={18} className="text-green-600 mr-3 flex-shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Description Tab */}
            {activeTab === 'description' && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Vehicle Description</h3>
                <p className="text-gray-700 leading-relaxed">{car.description}</p>
              </div>
            )}
            
            {/* Inquire Tab */}
            {activeTab === 'inquire' && (
              <div>
                <h3 className="text-lg font-semibold mb-6">Contact Us About This Vehicle</h3>
                <form className="max-w-3xl">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                        Country *
                      </label>
                      <input
                        type="text"
                        id="country"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      rows={5}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      defaultValue={`I am interested in the ${car.year} ${car.make} ${car.model} (Stock #${car.stockNumber}). Please contact me with more information.`}
                      required
                    ></textarea>
                  </div>
                  
                  <Button type="submit" className="px-8">
                    Submit Inquiry
                  </Button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Similar Cars */}
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">Similar Vehicles</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {car.similarCars.map((similarCar) => (
            <Link href={`/cars/${similarCar.id}`} key={similarCar.id} className="group">
              <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="relative h-48">
                  <Image
                    src={similarCar.image}
                    alt={similarCar.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg group-hover:text-blue-600 transition-colors">{similarCar.title}</h3>
                  <div className="flex justify-between items-center mt-2">
                    <div className="font-bold text-lg">${similarCar.price.toLocaleString()}</div>
                    <div className="text-gray-500 text-sm">{similarCar.mileage.toLocaleString()} km</div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
} 