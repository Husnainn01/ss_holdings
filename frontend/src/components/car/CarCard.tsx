'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, GaugeIcon, FuelIcon, Settings2Icon, Tag, Heart, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { updateImageUrl } from "@/lib/utils";

interface CarCardProps {
  car: {
    id: string;
    title: string;
    stockNumber?: string;
    price: number;
    year: number;
    make: string;
    model: string;
    mileage?: string | number;
    mileageUnit?: 'km' | 'miles';
    transmission: string;
    fuel: string;
    imageUrl?: string;
    status?: 'in-stock' | 'sold';
    location?: string;
    bodyType?: string;
    featured?: boolean;
  }
}

export default function CarCard({ car }: CarCardProps) {
  const { 
    id, 
    title, 
    stockNumber, 
    price, 
    year, 
    make, 
    model, 
    mileage, 
    mileageUnit, 
    transmission, 
    fuel, 
    imageUrl, 
    status = 'in-stock',
    location,
    bodyType,
    featured
  } = car;

  const [imageError, setImageError] = useState(false);

  // Generate a fallback image URL if the provided URL is invalid or loading fails
  const fallbackImage = `https://placehold.co/600x400/e0e0e0/8A0000?text=${make}+${model}`;
  
  // Process the image URL to handle invalid paths and update to CDN domain
  const processedImageUrl = imageUrl ? updateImageUrl(imageUrl) : fallbackImage;
  
  // Use the processed image URL or fallback to placeholder if there was an error
  const displayImage = !imageError ? processedImageUrl : fallbackImage;

  // Format mileage correctly whether it's a string or number
  const formattedMileage = typeof mileage === 'string' ? 
    parseInt(mileage).toLocaleString() : 
    mileage ? mileage.toLocaleString() : null;

  // Handle image loading error
  const handleImageError = () => {
    console.log(`Image failed to load: ${processedImageUrl}`);
    setImageError(true);
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <Link href={`/cars/${id}`} className="flex flex-col h-full">
        <div className="relative w-full" style={{ height: "150px" }}>
          <div className="relative h-full w-full bg-gray-200">
            <img
              src={displayImage}
              alt={`${make} ${model}`}
              className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
              onError={handleImageError}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
          
          {status === 'sold' && (
            <div className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-bl-lg shadow-md">
              SOLD
            </div>
          )}

          {featured && (
            <div className="absolute top-0 right-0 bg-yellow-500 text-white text-xs font-bold px-2 py-0.5 rounded-bl-lg shadow-md">
              FEATURED
            </div>
          )}
          
          <div className="absolute top-0 left-0 p-2">
            <Badge variant="secondary" className="bg-black/50 hover:bg-black/60 text-white border-0 backdrop-blur-sm text-xs">
              {make} {model}
            </Badge>
          </div>
          
          <div className="absolute bottom-0 left-0 right-0 p-2 transform translate-y-0 group-hover:translate-y-0 transition-transform duration-300">
            <h3 className="font-medium text-xs text-white leading-tight line-clamp-1 drop-shadow-md">{title || `${year} ${make} ${model}`}</h3>
          </div>
        </div>
        
        <div className="p-2 flex-1 flex flex-col bg-white">
          <div className="flex justify-between items-center mb-1">
            <div className="flex items-center">
              {stockNumber ? (
                <>
                  <Tag className="h-3 w-3 text-[#1a3d50] mr-1" />
                  <p className="text-xs text-gray-500 font-medium">
                    #{stockNumber}
                  </p>
                </>
              ) : location ? (
                <p className="text-xs text-gray-500 font-medium">
                  {location}
                </p>
              ) : null}
            </div>
            <div className="font-bold text-sm text-[#1a3d50]">
              ${price.toLocaleString()}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-xs mb-2 bg-gray-50 rounded-lg p-1.5">
            <div className="flex items-center">
              <CalendarIcon className="h-3 w-3 mr-1 text-gray-500" />
              <span className="font-medium">{year}</span>
            </div>
            
            {formattedMileage && (
              <div className="flex items-center">
                <GaugeIcon className="h-3 w-3 mr-1 text-gray-500" />
                <span className="font-medium">{formattedMileage}</span>
              </div>
            )}
            
            <div className="flex items-center">
              <Settings2Icon className="h-3 w-3 mr-1 text-gray-500" />
              <span className="font-medium">{transmission}</span>
            </div>
            
            <div className="flex items-center">
              <FuelIcon className="h-3 w-3 mr-1 text-gray-500" />
              <span className="font-medium">{fuel}</span>
            </div>
          </div>
          
          <div className="mt-auto pt-1 border-t border-gray-100">
            <div className="flex justify-between items-center">
              {status ? (
                <Badge variant="outline" className="text-xs px-1.5 py-0.5 bg-[#1a3d50]/5 text-[#1a3d50] border-[#1a3d50]/20 hover:bg-[#1a3d50]/10">
                  {status}
                </Badge>
              ) : (
                <Badge variant="outline" className="text-xs px-1.5 py-0.5 bg-[#1a3d50]/5 text-[#1a3d50] border-[#1a3d50]/20 hover:bg-[#1a3d50]/10">
                  {bodyType}
                </Badge>
              )}
              
              <span className="text-xs text-[#1a3d50] font-medium group-hover:underline flex items-center">
                View
                <ArrowRight className="h-3 w-3 ml-0.5 transition-transform duration-300 group-hover:translate-x-1" />
              </span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
} 