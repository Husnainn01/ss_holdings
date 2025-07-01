'use client';

import React, { useState, useEffect } from 'react';
import { getOptionsByCategory } from '@/services/optionsAPI';
import { updateImageUrl } from '@/lib/utils';

interface Brand {
  name: string;
  logo: string;
  svgLogo?: string;
}

interface BrandsSectionProps {
  title?: string;
  initialBrands?: Brand[];
}

export default function BrandsSection({
  title = "Brands We Export",
  initialBrands = []
}: BrandsSectionProps) {
  const [brands, setBrands] = useState<Brand[]>(initialBrands);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        setLoading(true);
        const makesData = await getOptionsByCategory('makes');
        
        // Transform the options data into the Brand format
        const brandsData: Brand[] = makesData.map(make => ({
          name: make.name,
          // Use the imageUrl from the option if available, otherwise use a fallback
          logo: make.imageUrl || `/brands/${make.name.toLowerCase()}.png`,
          // Use the svgUrl if available
          svgLogo: make.svgUrl || `/brands/${make.name.toLowerCase()}.svg`,
        }));
        
        setBrands(brandsData);
      } catch (error) {
        console.error('Error fetching brands:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBrands();
  }, []);
  
  if (loading) {
    return (
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold">{title}</h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="flex items-center justify-center p-4 bg-white rounded-lg h-24">
                <div className="animate-pulse bg-gray-200 h-12 w-full rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }
  
  if (!brands || brands.length === 0) {
    return null;
  }
  
  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold">{title}</h2>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {brands.map((brand) => (
            <div key={brand.name} className="flex items-center justify-center p-4 bg-white rounded-lg h-24">
              {/* Try to use SVG first, then fallback to regular image */}
              {brand.svgLogo ? (
                <img
                  src={updateImageUrl(brand.svgLogo)}
                  alt={`${brand.name} logo`}
                  className="max-h-16 w-auto object-contain"
                  onError={(e) => {
                    // If SVG fails, try the regular logo
                    const target = e.currentTarget;
                    if (brand.logo) {
                      target.src = updateImageUrl(brand.logo);
                    } else {
                      // If both fail, use a fallback car icon
                      target.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWNhciI+PHBhdGggZD0iTTE5IDE3aDJjLjYgMCAxLS40IDEtMXYtM2MwLS42LS40LTEtMS0xaC0yIi8+PHBhdGggZD0iTTUtM2g0bDIuNjkgNS4zOWEyIDIgMCAwIDAgMS43OSAxLjA5aDQuNmEyIDIgMCAwIDEgMiAyLjM0bC0uOCA0QTIgMiAwIDAgMSAxNy41IDE3SDJjLS41LTEuNS0uNS0yIDEtMmgxMiIvPjxwYXRoIGQ9Ik05IDE3SDZhMSAxIDAgMCAxLTEtMXYtMWExIDEgMCAwIDEgMS0xaDMiLz48Y2lyY2xlIGN4PSI1IiBjeT0iMTciIHI9IjIiLz48Y2lyY2xlIGN4PSIxNSIgY3k9IjE3IiByPSIyIi8+PC9zdmc+';
                    }
                  }}
                />
              ) : brand.logo ? (
                <img
                  src={updateImageUrl(brand.logo)}
                  alt={`${brand.name} logo`}
                  className="max-h-16 w-auto object-contain"
                  onError={(e) => {
                    // If the image fails to load, use a fallback
                    e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWNhciI+PHBhdGggZD0iTTE5IDE3aDJjLjYgMCAxLS40IDEtMXYtM2MwLS42LS40LTEtMS0xaC0yIi8+PHBhdGggZD0iTTUtM2g0bDIuNjkgNS4zOWEyIDIgMCAwIDAgMS43OSAxLjA5aDQuNmEyIDIgMCAwIDEgMiAyLjM0bC0uOCA0QTIgMiAwIDAgMSAxNy41IDE3SDJjLS41LTEuNS0uNS0yIDEtMmgxMiIvPjxwYXRoIGQ9Ik05IDE3SDZhMSAxIDAgMCAxLTEtMXYtMWExIDEgMCAwIDEgMS0xaDMiLz48Y2lyY2xlIGN4PSI1IiBjeT0iMTciIHI9IjIiLz48Y2lyY2xlIGN4PSIxNSIgY3k9IjE3IiByPSIyIi8+PC9zdmc+';
                  }}
                />
              ) : (
                // Fallback car icon
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-car">
                  <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.6-.4-1-1-1h-2"/>
                  <path d="M5 17H3c-.6 0-1-.4-1-1v-3c0-.6.4-1 1-1h2"/>
                  <path d="M14 17H9"/>
                  <path d="M21 9l-3-6H7L4 9h17Z"/>
                  <path d="M9 9H4l1 4h14l1-4h-5"/>
                  <circle cx="5" cy="17" r="2"/>
                  <circle cx="19" cy="17" r="2"/>
                </svg>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 