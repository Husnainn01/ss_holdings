'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, GaugeIcon, FuelIcon, Settings2Icon, Tag, Heart, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

interface CarCardProps {
  car: {
    id: string;
    title: string;
    stockNumber: string;
    price: number;
    year: number;
    make: string;
    model: string;
    mileage?: number;
    mileageUnit?: 'km' | 'miles';
    transmission: string;
    fuel: string;
    imageUrl?: string;
    status: 'in-stock' | 'sold';
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
    status 
  } = car;

  // Use a default image if none is provided
  const displayImage = imageUrl || `https://placehold.co/600x400/e0e0e0/8A0000?text=${make}+${model}`;

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <Link href={`/cars/${id}`} className="flex flex-col h-full">
        <div className="relative w-full" style={{ height: "150px" }}>
          <div className="relative h-full w-full bg-gray-200">
            <Image
              src={displayImage}
              alt={`${make} ${model}`}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
          
          {status === 'sold' && (
            <div className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-bl-lg shadow-md">
              SOLD
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
              <Tag className="h-3 w-3 text-[#1a3d50] mr-1" />
              <p className="text-xs text-gray-500 font-medium">
                #{stockNumber}
              </p>
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
            
            {mileage && (
              <div className="flex items-center">
                <GaugeIcon className="h-3 w-3 mr-1 text-gray-500" />
                <span className="font-medium">{mileage.toLocaleString()}</span>
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
              <Badge variant="outline" className="text-xs px-1.5 py-0.5 bg-[#1a3d50]/5 text-[#1a3d50] border-[#1a3d50]/20 hover:bg-[#1a3d50]/10">
                {status === 'in-stock' ? 'In Stock' : 'Sold'}
              </Badge>
              
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