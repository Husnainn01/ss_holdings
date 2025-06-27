'use client';

import React from 'react';
import Image from 'next/image';

interface Brand {
  name: string;
  logo: string;
}

interface BrandsSectionProps {
  title?: string;
  brands: Brand[];
}

export default function BrandsSection({
  title = "Brands We Export",
  brands
}: BrandsSectionProps) {
  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold">{title}</h2>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {brands.map((brand) => (
            <div key={brand.name} className="flex items-center justify-center p-4 bg-white rounded-lg h-24">
              <Image
                src={brand.logo}
                alt={`${brand.name} logo`}
                width={150}
                height={75}
                className="max-h-16 w-auto object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 