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

export default function HomePage() {
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

  // Mock data for recently added cars
  const recentCars = [
    {
      id: '1',
      title: '2023 Toyota Camry XSE',
      make: 'Toyota',
      model: 'Camry',
      year: 2023,
      price: 32500,
      stockNumber: 'T12345',
      status: 'in-stock' as const,
      imageUrl: 'https://placehold.co/600x400/png?text=Toyota+Camry',
      transmission: 'Automatic',
      fuel: 'Petrol'
    },
    {
      id: '2',
      title: '2022 BMW X5 xDrive40i',
      make: 'BMW',
      model: 'X5',
      year: 2022,
      price: 65999,
      stockNumber: 'B54321',
      status: 'in-stock' as const,
      imageUrl: 'https://placehold.co/600x400/png?text=BMW+X5',
      transmission: 'Automatic',
      fuel: 'Petrol'
    },
    {
      id: '3',
      title: '2021 Mercedes-Benz C300',
      make: 'Mercedes-Benz',
      model: 'C-Class',
      year: 2021,
      price: 45750,
      stockNumber: 'M98765',
      status: 'in-stock' as const,
      imageUrl: 'https://placehold.co/600x400/png?text=Mercedes+C300',
      transmission: 'Automatic',
      fuel: 'Petrol'
    },
    {
      id: '4',
      title: 'Subaru Sambar',
      make: 'Subaru',
      model: 'Sambar',
      year: 1997,
      price: 7500,
      stockNumber: 'JDM-3484',
      status: 'in-stock' as const,
      imageUrl: 'https://placehold.co/600x400/png?text=Subaru+Sambar',
      transmission: 'Manual',
      fuel: 'Petrol',
      mileage: 116885
    },
    {
      id: '5',
      title: 'Honda Acty SDX',
      make: 'Honda',
      model: 'Acty',
      year: 1998,
      price: 7000,
      stockNumber: 'JDM-0925',
      status: 'in-stock' as const,
      imageUrl: 'https://placehold.co/600x400/png?text=Honda+Acty',
      transmission: 'Manual',
      fuel: 'Petrol',
      mileage: 113832
    },
    {
      id: '6',
      title: 'Daihatsu Hijet',
      make: 'Daihatsu',
      model: 'Hijet',
      year: 1997,
      price: 8000,
      stockNumber: 'JDM-8724',
      status: 'in-stock' as const,
      imageUrl: 'https://placehold.co/600x400/png?text=Daihatsu+Hijet',
      transmission: 'Manual',
      fuel: 'Petrol',
      mileage: 107170
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
  
  // Mock data for car brands
  const carBrands = [
    { name: 'Toyota', logo: 'https://placehold.co/200x100/png?text=Toyota' },
    { name: 'BMW', logo: 'https://placehold.co/200x100/png?text=BMW' },
    { name: 'Mercedes-Benz', logo: 'https://placehold.co/200x100/png?text=Mercedes' },
    { name: 'Audi', logo: 'https://placehold.co/200x100/png?text=Audi' },
    { name: 'Honda', logo: 'https://placehold.co/200x100/png?text=Honda' },
    { name: 'Ford', logo: 'https://placehold.co/200x100/png?text=Ford' },
  ];

  // Brands with counts for sidebar
  const brandsWithCounts = [
    { name: 'TOYOTA', logo: 'https://placehold.co/32x32/png?text=TOYOTA', count: 76114 },
    { name: 'NISSAN', logo: 'https://placehold.co/32x32/png?text=NISSAN', count: 37392 },
    { name: 'HONDA', logo: 'https://placehold.co/32x32/png?text=HONDA', count: 31483 },
    { name: 'MAZDA', logo: 'https://placehold.co/32x32/png?text=MAZDA', count: 13107 },
    { name: 'MITSUBISHI', logo: 'https://placehold.co/32x32/png?text=MITSUBISHI', count: 11651 },
    { name: 'SUBARU', logo: 'https://placehold.co/32x32/png?text=SUBARU', count: 9789 },
    { name: 'SUZUKI', logo: 'https://placehold.co/32x32/png?text=SUZUKI', count: 38573 },
    { name: 'ISUZU', logo: 'https://placehold.co/32x32/png?text=ISUZU', count: 4660 },
    { name: 'DAIHATSU', logo: 'https://placehold.co/32x32/png?text=DAIHATSU', count: 31257 },
    { name: 'HINO', logo: 'https://placehold.co/32x32/png?text=HINO', count: 3095 },
    { name: 'LEXUS', logo: 'https://placehold.co/32x32/png?text=LEXUS', count: 6930 },
    { name: 'MERCEDES-BENZ', logo: 'https://placehold.co/32x32/png?text=MB', count: 21358 },
    { name: 'BMW', logo: 'https://placehold.co/32x32/png?text=BMW', count: 21996 },
    { name: 'VOLKSWAGEN', logo: 'https://placehold.co/32x32/png?text=VW', count: 5221 },
    { name: 'AUDI', logo: 'https://placehold.co/32x32/png?text=AUDI', count: 5994 },
    { name: 'PEUGEOT', logo: 'https://placehold.co/32x32/png?text=PEUGEOT', count: 1649 },
    { name: 'FORD', logo: 'https://placehold.co/32x32/png?text=FORD', count: 2992 },
    { name: 'VOLVO', logo: 'https://placehold.co/32x32/png?text=VOLVO', count: 3233 },
    { name: 'LAND ROVER', logo: 'https://placehold.co/32x32/png?text=LR', count: 9129 },
    { name: 'JAGUAR', logo: 'https://placehold.co/32x32/png?text=JAGUAR', count: 1102 },
    { name: 'JEEP', logo: 'https://placehold.co/32x32/png?text=JEEP', count: 3653 },
    { name: 'CHEVROLET', logo: 'https://placehold.co/32x32/png?text=CHEVY', count: 9788 },
    { name: 'HYUNDAI', logo: 'https://placehold.co/32x32/png?text=HYUNDAI', count: 46190 },
    { name: 'KIA', logo: 'https://placehold.co/32x32/png?text=KIA', count: 42211 },
    { name: 'SSANGYONG', logo: 'https://placehold.co/32x32/png?text=SSANGYONG', count: 7382 }
  ];

  return (
    <main className="bg-gray-100">
      {/* Hero Section */}
      <HeroSection buttons={heroButtons} />
      
      {/* Main Content with Sidebars */}
      <div className="w-full flex flex-col md:flex-row">
        {/* Left Sidebar - Shop By Make */}
        <div className="md:w-[280px] flex-shrink-0 md:sticky md:top-[73px] p-4">
          <BrandsSidebar brands={brandsWithCounts} />
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
      
      {/* Why Choose Us Section */}
      <WhyChooseUs features={features} />
      
      {/* Brands Section */}
      <BrandsSection brands={carBrands} />
      
      {/* FAQ Section */}
      <FAQSection faqs={faqs} />
      
      {/* CTA Section */}
      <CTASection 
        title="Ready to Export Your Dream Car?" 
        description="Get in touch with our expert team for personalized assistance with your vehicle export needs."
        buttons={ctaButtons}
      />
    </main>
  );
}
