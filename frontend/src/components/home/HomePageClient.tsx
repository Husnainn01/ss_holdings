'use client';

import React, { useState, useEffect } from 'react';
import SafeClientWrapper from './SafeClientWrapper';
import HeroSection from '@/components/home/HeroSection';
import BrandsSidebar from '@/components/home/BrandsSidebar';
import SearchForm from '@/components/home/SearchForm';
import RecentlyAdded from '@/components/home/RecentlyAdded';
import WhyChooseUs from '@/components/home/WhyChooseUs';
import FAQSection from '@/components/home/FAQSection';
import CTASection from '@/components/home/CTASection';
import BrandsSection from '@/components/home/BrandsSection';
import SidebarShipping from '@/components/home/SidebarShipping';
import FeaturedCars from '@/components/home/FeaturedCars';
import { vehicleAPI } from '@/services/api';
import config from '@/config';
// Removed Header and Footer imports as they're now in the MainLayout

// Client-side data fetching function
async function getVehicles() {
  try {
    console.log('Fetching vehicles using API URL:', config.apiUrl);
    
    // Fetch recently added vehicles using the vehicleAPI service
    const recentResponse = await vehicleAPI.getVehicles({
      limit: 8,
      sort: '-createdAt'
    });
    
    // Fetch featured vehicles using the vehicleAPI service
    const featuredResponse = await vehicleAPI.getVehicles({
      isFeatured: true,
      limit: 4
    });
    
    // Map the API data to our component format
    const mapVehicle = (vehicle: any) => ({
      id: vehicle._id,
      title: `${vehicle.year} ${vehicle.make} ${vehicle.model}`,
      make: vehicle.make,
      model: vehicle.model,
      year: vehicle.year,
      price: vehicle.price,
      stockNumber: vehicle.stockNumber || '',
      status: vehicle.status || 'in-stock',
      imageUrl: vehicle.images && vehicle.images.length > 0 ? 
        vehicle.images.find((img: any) => img.isMain)?.url || vehicle.images[0].url : 
        `https://placehold.co/600x400/png?text=${vehicle.make}+${vehicle.model}`,
      transmission: vehicle.vehicleTransmission || 'N/A',
      fuel: vehicle.fuelType || 'N/A',
      mileage: vehicle.mileage || 0,
      mileageUnit: vehicle.mileageUnit || 'km',
      location: vehicle.location || 'N/A',
      bodyType: vehicle.bodyType || 'N/A',
      featured: vehicle.isFeatured || false
    });
    
    const recentCars = recentResponse.data.vehicles ? recentResponse.data.vehicles.map(mapVehicle) : [];
    const featuredCars = featuredResponse.data.vehicles ? featuredResponse.data.vehicles.map(mapVehicle) : [];
    
    console.log('Fetched vehicles:', { 
      recentCount: recentCars.length, 
      featuredCount: featuredCars.length,
      recentTotal: recentResponse.data.total,
      featuredTotal: featuredResponse.data.total
    });
    
    return { recentCars, featuredCars };
  } catch (error) {
    console.error('Error fetching vehicles:', error);
    return { recentCars: [], featuredCars: [] };
  }
}

export default function HomePageClient() {
  const [recentCars, setRecentCars] = useState<any[]>([]);
  const [featuredCars, setFeaturedCars] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log('HomePageClient: Starting to fetch vehicles...');
    
    // Check if the backend server is running
    const checkBackendServer = async () => {
      try {
        console.log('Checking if backend server is running at:', config.apiUrl);
        const response = await fetch(`${config.apiUrl}/health-check`, { 
          method: 'HEAD',
          headers: { 'Content-Type': 'application/json' },
          // Short timeout to quickly detect if server is not responding
          signal: AbortSignal.timeout(2000)
        });
        
        if (response.ok) {
          console.log('Backend server is running!');
          return true;
        } else {
          console.warn('Backend server returned an error status:', response.status);
          return false;
        }
      } catch (error) {
        console.warn('Backend server check failed, trying to fetch data anyway:', error);
        return false;
      }
    };
    
    const fetchData = async () => {
      try {
        // We'll try to fetch data even if the health check fails
        await checkBackendServer();
        
        console.log('HomePageClient: Calling getVehicles()...');
        const { recentCars: recent, featuredCars: featured } = await getVehicles();
        
        console.log('HomePageClient: Got vehicles data:', { 
          recentCount: recent?.length || 0, 
          featuredCount: featured?.length || 0 
        });
        
        setRecentCars(recent || []);
        setFeaturedCars(featured || []);
      } catch (error) {
        console.error('HomePageClient: Error in fetchData:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Hero buttons
  const heroButtons = [
    {
      text: "Browse Our Cars",
      href: "/cars",
      variant: "default" as const
    },
    {
      text: "Request a Quote",
      href: "/contact",
      variant: "outline" as const
    }
  ];

  // Features for "Why Choose Us" section
  const features = [
    {
      icon: (
        <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      title: "Quality Assurance",
      description: "Every vehicle undergoes rigorous inspection to ensure it meets our high quality standards before export."
    },
    {
      icon: (
        <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: "Global Shipping",
      description: "We handle all logistics to deliver your vehicle safely to virtually any destination worldwide."
    },
    {
      icon: (
        <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
        </svg>
      ),
      title: "Expert Support",
      description: "Our experienced team provides personalized assistance throughout the entire export process."
    }
  ];
   
  // FAQ items
  const faqs = [
    {
      question: "How long does the export process take?",
      answer: "The export process timeline varies depending on your location and specific requirements. Typically, it takes 2-4 weeks from purchase to shipping, and an additional 1-8 weeks for shipping, depending on the destination."
    },
    {
      question: "Which countries do you export to?",
      answer: "We export vehicles to most countries worldwide. Our extensive shipping network allows us to deliver to virtually any destination, including Asia, Africa, Europe, the Middle East, and the Americas."
    },
    {
      question: "Do you handle customs clearance?",
      answer: "Yes, we handle export customs clearance. Import customs clearance at the destination can also be arranged in many countries through our network of partners, though additional fees may apply."
    }
  ];
  
  // CTA buttons
  const ctaButtons = [
    {
      text: "Get a Free Quote",
      href: "/contact",
      variant: "default" as const
    },
    {
      text: "Browse Inventory",
      href: "/cars",
      variant: "outline" as const
    }
  ];
  
  return (
    <SafeClientWrapper>
      <main className="flex-1 w-full bg-gray-100">
        {/* Hero Section */}
        <HeroSection buttons={heroButtons} />
        
        {/* Main Content with Sidebars */}
        <div className="w-full flex flex-col md:flex-row">
          {/* Left Sidebar - Shop By Make */}
          <div className="md:w-[280px] flex-shrink-0 md:sticky md:top-[73px] p-4">
            <BrandsSidebar initialBrands={[]} />
          </div>
          
          {/* Main Content */}
          <div className="flex-1 px-4 md:px-6 py-8">
            {/* Search Form */}
            <div className="mb-8">
              <SearchForm />
            </div>
            
            {/* Recently Added Cars */}
            <div className="mb-12">
              {isLoading ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
                  <div className="animate-pulse flex flex-col items-center">
                    <div className="h-8 w-64 bg-gray-200 rounded mb-4"></div>
                    <div className="h-4 w-48 bg-gray-200 rounded mb-8"></div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full">
                      {[...Array(4)].map((_, i) => (
                        <div key={i} className="h-48 bg-gray-200 rounded"></div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <RecentlyAdded cars={recentCars} />
              )}
            </div>
          </div>
          
          {/* Right Sidebar - Shipping Info */}
          <div className="md:w-[280px] flex-shrink-0 md:sticky md:top-[73px] p-4">
            <SidebarShipping />
          </div>
        </div>
        
        {/* Why Choose Us Section */}
        <WhyChooseUs features={features} />
        
        {/* Brands Section */}
        <BrandsSection initialBrands={[]} />
        
        {/* FAQ Section */}
        <FAQSection faqs={faqs} />
        
        {/* CTA Section */}
        <CTASection 
          title="Ready to Export Your Dream Car?" 
          description="Contact us today to get started with your vehicle export journey."
          buttons={ctaButtons}
        />
      </main>
    </SafeClientWrapper>
  );
}
