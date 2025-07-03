import Image from 'next/image';
import { Button } from "@/components/ui/button";
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

// This is a server component, so we can fetch data directly
async function getVehicles() {
  try {
    // Fetch recently added vehicles
    const recentResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api'}/vehicles?limit=8&sort=-createdAt`, { 
      cache: 'no-store',
      next: { revalidate: 3600 } // Revalidate every hour
    });
    
    // Fetch featured vehicles
    const featuredResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api'}/vehicles?isFeatured=true&limit=4`, { 
      cache: 'no-store',
      next: { revalidate: 3600 } // Revalidate every hour
    });
    
    if (!recentResponse.ok || !featuredResponse.ok) {
      console.error('Error fetching vehicles:', 
        recentResponse.ok ? '' : `Recent: ${recentResponse.status}`,
        featuredResponse.ok ? '' : `Featured: ${featuredResponse.status}`
      );
      // If there's an error, return empty arrays
      return { recentCars: [], featuredCars: [] };
    }
    
    const recentData = await recentResponse.json();
    const featuredData = await featuredResponse.json();
    
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
    
    const recentCars = recentData.vehicles ? recentData.vehicles.map(mapVehicle) : [];
    const featuredCars = featuredData.vehicles ? featuredData.vehicles.map(mapVehicle) : [];
    
    console.log('Fetched vehicles:', { recentCount: recentCars.length, featuredCount: featuredCars.length });
    
    return { recentCars, featuredCars };
  } catch (error) {
    console.error('Error fetching vehicles:', error);
    return { recentCars: [], featuredCars: [] };
  }
}

export default async function HomePage() {
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

  // Fetch real vehicle data
  const { recentCars, featuredCars } = await getVehicles();
   
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
    <main className="bg-gray-100">
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
            <RecentlyAdded cars={recentCars} />
          </div>
        </div>
        
        {/* Right Sidebar - Shipping Info */}
        <div className="md:w-[280px] flex-shrink-0 md:sticky md:top-[73px] p-4">
          <SidebarShipping />
        </div>
      </div>
      
      {/* Featured Cars Section */}
      <FeaturedCars 
        cars={featuredCars} 
        title="Featured Vehicles" 
        subtitle="Premium selection of our most popular export vehicles"
      />
      
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
  );
}
