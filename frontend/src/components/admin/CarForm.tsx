"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Car, ChevronDown, Loader2, Save, X } from "lucide-react";

interface CarFormProps {
  id?: string;
  isEditMode?: boolean;
}

interface CarData {
  name: string;
  brand: string;
  year: number;
  price: number;
  mileage: number;
  status: string;
  transmission: string;
  fuelType: string;
  description: string;
  features: string[];
}

// List of available features
const availableFeatures = [
  "Air Conditioning",
  "Power Steering",
  "Power Windows",
  "ABS",
  "Navigation System",
  "Bluetooth",
  "Backup Camera",
  "Keyless Entry",
  "Cruise Control",
  "Leather Seats",
  "Sunroof",
  "Heated Seats",
  "Third Row Seating",
  "Premium Sound",
  "Alloy Wheels",
];

// List of brands
const carBrands = [
  "Toyota",
  "Honda",
  "Ford",
  "BMW",
  "Mercedes-Benz",
  "Audi",
  "Lexus",
  "Nissan",
  "Chevrolet",
  "Hyundai",
  "Kia",
  "Volkswagen",
  "Mazda",
  "Subaru",
  "Tesla",
];

export default function CarForm({ id, isEditMode = false }: CarFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  // Default empty car data
  const defaultCarData: CarData = {
    name: "",
    brand: "",
    year: new Date().getFullYear(),
    price: 0,
    mileage: 0,
    status: "available",
    transmission: "automatic",
    fuelType: "gasoline",
    description: "",
    features: [],
  };

  const [car, setCar] = useState<CarData>(defaultCarData);

  useEffect(() => {
    if (isEditMode && id) {
      // In a real app, this would be an API call
      setIsLoading(true);
      
      // Mock data fetch for editing
      setTimeout(() => {
        // This is mocked data - in a real app you'd fetch this from an API
        const mockCarData: CarData = {
          name: "Toyota Camry XLE",
          brand: "Toyota",
          year: 2023,
          price: 32000,
          mileage: 1500,
          status: "available",
          transmission: "automatic",
          fuelType: "hybrid",
          description: "A well-maintained sedan with excellent fuel economy and premium features.",
          features: ["Air Conditioning", "Bluetooth", "Backup Camera", "Keyless Entry"],
        };
        
        setCar(mockCarData);
        setIsLoading(false);
      }, 1000);
    }
  }, [id, isEditMode]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCar(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCar(prevState => ({
      ...prevState,
      [name]: value === "" ? 0 : Number(value)
    }));
  };

  const handleFeatureToggle = (feature: string) => {
    setCar(prevState => {
      if (prevState.features.includes(feature)) {
        return {
          ...prevState,
          features: prevState.features.filter(f => f !== feature)
        };
      } else {
        return {
          ...prevState,
          features: [...prevState.features, feature]
        };
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSaving(true);

    try {
      // In a real app, this would be an API call to save the data
      // For now, we'll just simulate a delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // After successful save, redirect
      router.push("/admin/dashboard/cars");
    } catch (err) {
      setError("Failed to save car data. Please try again.");
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <span className="ml-2 text-gray-600">Loading car data...</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <X className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Basic Info Section */}
      <div className="bg-white shadow-sm rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Car Name*
            </label>
            <input
              type="text"
              name="name"
              id="name"
              required
              value={car.name}
              onChange={handleChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label htmlFor="brand" className="block text-sm font-medium text-gray-700 mb-1">
              Brand*
            </label>
            <div className="relative">
              <select
                name="brand"
                id="brand"
                required
                value={car.brand}
                onChange={handleChange}
                className="block w-full appearance-none rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">Select a brand</option>
                {carBrands.map(brand => (
                  <option key={brand} value={brand}>{brand}</option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
            </div>
          </div>
          
          <div>
            <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-1">
              Year*
            </label>
            <input
              type="number"
              name="year"
              id="year"
              required
              min="1900"
              max={new Date().getFullYear() + 1}
              value={car.year}
              onChange={handleNumberChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
              Price (USD)*
            </label>
            <div className="relative rounded-md shadow-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <span className="text-gray-500 sm:text-sm">$</span>
              </div>
              <input
                type="number"
                name="price"
                id="price"
                required
                min="0"
                value={car.price}
                onChange={handleNumberChange}
                className="block w-full rounded-md border-gray-300 pl-7 focus:border-blue-500 focus:ring-blue-500"
                placeholder="0.00"
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="mileage" className="block text-sm font-medium text-gray-700 mb-1">
              Mileage
            </label>
            <input
              type="number"
              name="mileage"
              id="mileage"
              min="0"
              value={car.mileage}
              onChange={handleNumberChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              name="status"
              id="status"
              value={car.status}
              onChange={handleChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="available">Available</option>
              <option value="pending">Pending</option>
              <option value="sold">Sold</option>
            </select>
          </div>
        </div>
      </div>

      {/* Details Section */}
      <div className="bg-white shadow-sm rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Vehicle Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="transmission" className="block text-sm font-medium text-gray-700 mb-1">
              Transmission
            </label>
            <select
              name="transmission"
              id="transmission"
              value={car.transmission}
              onChange={handleChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="automatic">Automatic</option>
              <option value="manual">Manual</option>
              <option value="cvt">CVT</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="fuelType" className="block text-sm font-medium text-gray-700 mb-1">
              Fuel Type
            </label>
            <select
              name="fuelType"
              id="fuelType"
              value={car.fuelType}
              onChange={handleChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="gasoline">Gasoline</option>
              <option value="diesel">Diesel</option>
              <option value="hybrid">Hybrid</option>
              <option value="electric">Electric</option>
            </select>
          </div>
          
          <div className="md:col-span-2">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              id="description"
              rows={4}
              value={car.description}
              onChange={handleChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white shadow-sm rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Features</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {availableFeatures.map((feature) => (
            <div key={feature} className="flex items-center">
              <input
                id={`feature-${feature}`}
                name={`feature-${feature}`}
                type="checkbox"
                checked={car.features.includes(feature)}
                onChange={() => handleFeatureToggle(feature)}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor={`feature-${feature}`} className="ml-2 block text-sm text-gray-700">
                {feature}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Submit Buttons */}
      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSaving}
          className="inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {isSaving ? (
            <>
              <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" />
              Saving...
            </>
          ) : (
            <>
              <Save className="-ml-1 mr-2 h-4 w-4" />
              Save Car
            </>
          )}
        </button>
      </div>
    </form>
  );
} 