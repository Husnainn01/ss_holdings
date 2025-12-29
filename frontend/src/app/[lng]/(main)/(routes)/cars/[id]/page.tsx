'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { notFound, useParams } from 'next/navigation';
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
  ArrowRight,
  Lock
} from 'lucide-react';
import { vehicleAPI, authAPI } from '@/services/api';
import { IVehicle, IVehicleImage } from '@/types/vehicle';
import { updateImageUrl } from '@/lib/utils';
import { Turnstile } from '@marsidev/react-turnstile';

// Check if a string is a valid MongoDB ObjectId
function isValidObjectId(id: string): boolean {
  return /^[0-9a-fA-F]{24}$/.test(id);
}

export default function CarDetailPage() {
  // Use useParams hook to get the id parameter in Client Component
  const params = useParams();
  const id = params.id as string;
  
  // State hooks
  const [car, setCar] = useState<IVehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('specifications');
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [similarCars, setSimilarCars] = useState<IVehicle[]>([]);
  
  // Form state
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    country: '',
    message: ''
  });
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  
  // Ref hooks
  const contactSectionRef = useRef<HTMLDivElement>(null);
  
  // Effect to fetch car data
  useEffect(() => {
    const fetchCarData = async () => {
      try {
        // Check if the ID is a valid MongoDB ObjectId before making the request
        if (!isValidObjectId(id)) {
          console.error('Invalid MongoDB ObjectId:', id);
          setError('Invalid vehicle ID');
          setLoading(false);
          return;
        }
        
        setLoading(true);
        const response = await vehicleAPI.getVehicle(id);
        setCar(response.data);
        
        // Fetch similar cars (same make or body type)
        try {
          const similarResponse = await vehicleAPI.getVehicles({
            limit: 3,
            make: response.data.make,
            exclude: id
          });
          setSimilarCars(similarResponse.data.vehicles || []);
        } catch (err) {
          console.error('Error fetching similar cars:', err);
          setSimilarCars([]);
        }
      } catch (err) {
        console.error('Error fetching car details:', err);
        setError('Failed to load car details');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCarData();
    }
  }, [id]);
  
  // Effect to set default message when car data changes
  useEffect(() => {
    if (car) {
      setFormData(prev => ({
        ...prev,
        message: `I'm interested in this ${car.year} ${car.make} ${car.model}. Please contact me with more information.`
      }));
    }
  }, [car]);

  // Function to scroll to inquiry form
  const scrollToInquiryForm = () => {
    setActiveTab('inquire');
    setTimeout(() => {
      contactSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };
  
  // Form change handler
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Form submit handler
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.fullName || !formData.email || !formData.message) {
      setFormError('Please fill in all required fields');
      return;
    }
    
    // Check if Turnstile token is available
    if (!turnstileToken) {
      setFormError('Please complete the verification first');
      return;
    }
    
    setFormSubmitting(true);
    setFormError(null);
    
    try {
      // Verify Turnstile token
      await authAPI.verifyTurnstile(turnstileToken);
      
      // Prepare car inquiry data
      const inquiryData = {
        name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        country: formData.country,
        vehicleId: id,
        vehicleName: `${car?.year} ${car?.make} ${car?.model}`,
        message: formData.message,
      };

      // Send car inquiry to backend
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api'}/contact/car-inquiry`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(inquiryData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to send inquiry');
      }
      
      setFormSubmitted(true);
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        country: '',
        message: ''
      });
      setTurnstileToken(null);
    } catch (error) {
      console.error('Error submitting inquiry:', error);
      setFormError(error instanceof Error ? error.message : 'Failed to send inquiry. Please try again.');
      setTurnstileToken(null);
    } finally {
      setFormSubmitting(false);
    }
  };
  
  // Handle Turnstile success
  const handleTurnstileSuccess = (token: string) => {
    setTurnstileToken(token);
  };

  const handlePrevImage = () => {
    if (!car || !car.images || car.images.length === 0) return;
    setActiveImageIndex((prev) => 
      prev === 0 ? car.images.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    if (!car || !car.images || car.images.length === 0) return;
    setActiveImageIndex((prev) => 
      prev === car.images.length - 1 ? 0 : prev + 1
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-blue-600 border-b-blue-600 rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading car details...</p>
        </div>
      </div>
    );
  }

  if (error || !car) {
    return notFound();
  }

  const tabs = [
    { id: 'specifications', label: 'Specifications' },
    { id: 'features', label: 'Features' },
    { id: 'description', label: 'Description' },
    { id: 'inquire', label: 'Inquire' },
  ];

  // Default image if no images are available
  const defaultImage = 'https://placehold.co/800x600/png?text=No+Image+Available';
  const carImages = car.images && car.images.length > 0 
    ? car.images.map((img: IVehicleImage) => updateImageUrl(img.url)) 
    : [defaultImage];

  // Combine car features and safety features
  const allFeatures = [
    ...(car.carFeature || []),
    ...(car.carSafetyFeature || [])
  ];

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
                <img
                  src={carImages[activeImageIndex]}
                  alt={car.title}
                  className="object-cover w-full h-full"
                  onError={(e) => {
                    console.error(`Error loading image: ${carImages[activeImageIndex]}`);
                    e.currentTarget.src = defaultImage;
                  }}
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
                {carImages.length > 1 && (
                  <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                    {activeImageIndex + 1} / {carImages.length}
                  </div>
                )}
              </div>
              
              {/* Thumbnails */}
              {carImages.length > 1 && (
                <div className="mt-4 grid grid-cols-5 gap-2">
                  {carImages.map((image: string, index: number) => (
                    <button 
                      key={index} 
                      onClick={() => setActiveImageIndex(index)}
                      className={`relative h-20 w-full rounded-md overflow-hidden transition-all ${
                        activeImageIndex === index 
                          ? 'border-2 border-blue-600 opacity-100' 
                          : 'border border-gray-200 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${car.title} thumbnail ${index + 1}`}
                        className="object-cover w-full h-full"
                        onError={(e) => {
                          console.error(`Error loading thumbnail: ${image}`);
                          e.currentTarget.src = defaultImage;
                        }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            {/* Key Details */}
            <div className="w-full lg:w-5/12 xl:w-4/12">
              <div className="bg-white p-6 rounded-lg h-full">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h1 className="text-3xl font-bold">{car.title}</h1>
                    {car.stockNumber && <p className="text-gray-500 mt-1">Stock #: {car.stockNumber}</p>}
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
                        <div className="font-medium">{car.mileage} {car.mileageUnit}</div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Fuel size={20} className="text-gray-500 mr-3" />
                      <div>
                        <div className="text-sm text-gray-500">Fuel</div>
                        <div className="font-medium">{car.fuelType || 'Not specified'}</div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Settings size={20} className="text-gray-500 mr-3" />
                      <div>
                        <div className="text-sm text-gray-500">Transmission</div>
                        <div className="font-medium">{car.vehicleTransmission || 'Not specified'}</div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Car size={20} className="text-gray-500 mr-3" />
                      <div>
                        <div className="text-sm text-gray-500">Body Type</div>
                        <div className="font-medium">{car.bodyType || 'Not specified'}</div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <MapPin size={20} className="text-gray-500 mr-3" />
                      <div>
                        <div className="text-sm text-gray-500">Location</div>
                        <div className="font-medium">{car.location || 'Not specified'}</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 rounded-lg flex items-center justify-center gap-2">
                    <Phone size={18} />
                    <span>Call for Price</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full border-blue-600 text-blue-600 hover:bg-blue-50 py-6 rounded-lg flex items-center justify-center gap-2"
                    onClick={scrollToInquiryForm}
                  >
                    <Mail size={18} />
                    <span>Email Inquiry</span>
                  </Button>
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
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-4 text-sm font-medium whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
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
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Vehicle Information</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">Make</span>
                      <span className="font-medium">{car.make}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">Model</span>
                      <span className="font-medium">{car.model}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">Year</span>
                      <span className="font-medium">{car.year}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">Body Type</span>
                      <span className="font-medium">{car.bodyType || 'Not specified'}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">Color</span>
                      <span className="font-medium">{car.color || 'Not specified'}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">Interior Color</span>
                      <span className="font-medium">{car.interiorColor || 'Not specified'}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">Doors</span>
                      <span className="font-medium">{car.doors || 'Not specified'}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">Seating Capacity</span>
                      <span className="font-medium">{car.vehicleSeatingCapacity || 'Not specified'}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-4">Technical Specifications</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">Fuel Type</span>
                      <span className="font-medium">{car.fuelType || 'Not specified'}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">Transmission</span>
                      <span className="font-medium">{car.vehicleTransmission || 'Not specified'}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">Drive Type</span>
                      <span className="font-medium">{car.driveType || 'Not specified'}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">Engine</span>
                      <span className="font-medium">{car.engineType || 'Not specified'}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">Engine Capacity</span>
                      <span className="font-medium">{car.engineCapacity || 'Not specified'}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">Mileage</span>
                      <span className="font-medium">{car.mileage} {car.mileageUnit}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">Condition</span>
                      <span className="font-medium">{car.condition || 'Not specified'}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">VIN</span>
                      <span className="font-medium">{car.vin || 'Not specified'}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Features Tab */}
            {activeTab === 'features' && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Features & Options</h3>
                {allFeatures.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {allFeatures.map((feature, index) => (
                      <div key={index} className="flex items-center">
                        <Check size={16} className="text-green-500 mr-2" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No features specified for this vehicle.</p>
                )}
              </div>
            )}
            
            {/* Description Tab */}
            {activeTab === 'description' && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Vehicle Description</h3>
                {car.description ? (
                  <p className="text-gray-700 whitespace-pre-line">{car.description}</p>
                ) : (
                  <p className="text-gray-500">No description available for this vehicle.</p>
                )}
              </div>
            )}
            
            {/* Inquire Tab */}
            {activeTab === 'inquire' && (
              <div id="inquire-tab" ref={contactSectionRef}>
                <h3 className="text-lg font-semibold mb-4">Contact Us About This Vehicle</h3>
                
                {formSubmitted ? (
                  <div className="bg-green-50 border border-green-200 rounded-md p-4">
                    <h4 className="text-green-800 font-medium text-lg mb-2">Thank you for your inquiry!</h4>
                    <p className="text-green-700">We have received your message and will contact you shortly.</p>
                    <Button 
                      className="mt-4 bg-green-600 hover:bg-green-700 text-white"
                      onClick={() => setFormSubmitted(false)}
                    >
                      Send Another Inquiry
                    </Button>
                  </div>
                ) : (
                  <form className="space-y-4" onSubmit={handleFormSubmit}>
                    {formError && (
                      <div className="bg-red-50 border border-red-200 rounded-md p-3 text-red-700">
                        {formError}
                      </div>
                    )}
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Full Name <span className="text-red-500">*</span>
                        </label>
                        <input 
                          type="text" 
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleFormChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" 
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email <span className="text-red-500">*</span>
                        </label>
                        <input 
                          type="email" 
                          name="email"
                          value={formData.email}
                          onChange={handleFormChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" 
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Phone
                        </label>
                        <input 
                          type="tel" 
                          name="phone"
                          value={formData.phone}
                          onChange={handleFormChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" 
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Country
                        </label>
                        <input 
                          type="text" 
                          name="country"
                          value={formData.country}
                          onChange={handleFormChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" 
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Message <span className="text-red-500">*</span>
                      </label>
                      <textarea 
                        rows={4} 
                        name="message"
                        value={formData.message}
                        onChange={handleFormChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" 
                        required
                      ></textarea>
                    </div>
                    
                    {/* Turnstile Verification */}
                    <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
                      <div className="flex items-center mb-3">
                        <Lock className="h-4 w-4 text-gray-500 mr-2" />
                        <p className="text-sm text-gray-600">Please verify that you are human</p>
                      </div>
                      <Turnstile
                        siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "0x4AAAAAABjiJBiYGbz486u9"}
                        onSuccess={handleTurnstileSuccess}
                        onError={(error) => {
                          console.error('Turnstile error:', error);
                          setFormError('Verification failed. Please try again.');
                          setTurnstileToken(null);
                        }}
                      />
                    </div>
                    
                    <Button 
                      type="submit"
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 rounded-lg disabled:opacity-50"
                      disabled={formSubmitting || !turnstileToken}
                    >
                      {formSubmitting ? (
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          Submitting...
                        </div>
                      ) : (
                        'Submit Inquiry'
                      )}
                    </Button>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Similar Cars Section */}
      {similarCars.length > 0 && (
        <div className="container mx-auto px-4 py-8">
          <h2 className="text-2xl font-bold mb-6">Similar Vehicles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {similarCars.map((similarCar) => (
              <Link href={`/cars/${similarCar._id}`} key={similarCar._id} className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="relative h-48">
                  <Image
                    src={similarCar.images && similarCar.images.length > 0 ? similarCar.images[0].url : defaultImage}
                    alt={similarCar.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg">{similarCar.title}</h3>
                  <div className="text-blue-600 font-bold mt-1">${similarCar.price.toLocaleString()}</div>
                  <div className="flex items-center text-sm text-gray-500 mt-2">
                    <Gauge size={14} className="mr-1" />
                    <span>{similarCar.mileage} {similarCar.mileageUnit}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 