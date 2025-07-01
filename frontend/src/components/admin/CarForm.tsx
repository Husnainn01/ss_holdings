"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Car, ChevronDown, Loader2, Plus, Save, Trash, Upload, X } from "lucide-react";
import { vehicleAPI } from "@/services/api";
import { getOptionsByCategory, Option, OptionCategory } from "@/services/optionsAPI";
import DraggableImageList from "./DraggableImageList";
import { compressImageIfNeeded, getOptimalCompressionOptions } from "@/lib/imageCompression";
import ImageProcessingIndicator from "./ImageProcessingIndicator";
import FileSizeIndicator from "./FileSizeIndicator";
import DropZone from "./DropZone";

interface CarFormProps {
  id?: string;
  isEditMode?: boolean;
}

interface CarImage {
  url: string;
  publicId: string;
  key: string;
  order: number;
  isMain: boolean;
}

interface CarData {
  title: string;
  price: number | null;
  priceCurrency: string;
  description: string;
  make: string;
  model: string;
  year: number;
  mileage: string;
  mileageUnit: string;
  vin: string;
  bodyType: string;
  color: string;
  fuelType: string;
  vehicleSeatingCapacity: string;
  vehicleTransmission: string;
  carFeature: string[];
  carSafetyFeature: string[];
  images: CarImage[];
  stockNumber: string;
  driveType: string;
  engineType: string;
  engineCapacity: string;
  interiorColor: string;
  doors: string;
  condition: string;
  month: string;
  location: string;
  isFeatured: boolean;
  section: string;
  offerType: string;
}

// Dynamic options from API
interface DynamicOptions {
  features: Option[];
  safetyFeatures: Option[];
  makes: Option[];
  bodyTypes: Option[];
  fuelTypes: Option[];
  transmissionTypes: Option[];
  driveTypes: Option[];
  conditionTypes: Option[];
  months: Option[];
  offerTypes: Option[];
}

export default function CarForm({ id, isEditMode = false }: CarFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [options, setOptions] = useState<DynamicOptions>({
    features: [],
    safetyFeatures: [],
    makes: [],
    bodyTypes: [],
    fuelTypes: [],
    transmissionTypes: [],
    driveTypes: [],
    conditionTypes: [],
    months: [],
    offerTypes: []
  });
  const [isLoadingOptions, setIsLoadingOptions] = useState(true);

  // Default empty car data
  const defaultCarData: CarData = {
    title: "",
    price: null,
    priceCurrency: "USD",
    description: "",
    make: "",
    model: "",
    year: new Date().getFullYear(),
    mileage: "",
    mileageUnit: "km",
    vin: "",
    bodyType: "",
    color: "",
    fuelType: "",
    vehicleSeatingCapacity: "",
    vehicleTransmission: "",
    carFeature: [],
    carSafetyFeature: [],
    images: [],
    stockNumber: "",
    driveType: "",
    engineType: "",
    engineCapacity: "",
    interiorColor: "",
    doors: "",
    condition: "Used",
    month: "",
    location: "",
    isFeatured: false,
    section: "",
    offerType: "In Stock",
  };

  const [car, setCar] = useState<CarData>(defaultCarData);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [newImages, setNewImages] = useState<Array<{ id: string; url: string; file: File; isMain: boolean }>>([]);
  const [isProcessingImages, setIsProcessingImages] = useState(false);
  const [compressionStats, setCompressionStats] = useState<Array<{
    fileName: string;
    originalSize: number;
    compressedSize: number;
  }>>([]);

  // Fetch all options
  useEffect(() => {
    const fetchAllOptions = async () => {
      setIsLoadingOptions(true);
      try {
        const [
          featuresData,
          safetyFeaturesData,
          makesData,
          bodyTypesData,
          fuelTypesData,
          transmissionTypesData,
          driveTypesData,
          conditionTypesData,
          monthsData,
          offerTypesData
        ] = await Promise.all([
          getOptionsByCategory('features'),
          getOptionsByCategory('safetyFeatures'),
          getOptionsByCategory('makes'),
          getOptionsByCategory('bodyTypes'),
          getOptionsByCategory('fuelTypes'),
          getOptionsByCategory('transmissionTypes'),
          getOptionsByCategory('driveTypes'),
          getOptionsByCategory('conditionTypes'),
          getOptionsByCategory('months'),
          getOptionsByCategory('offerTypes')
        ]);

        setOptions({
          features: featuresData,
          safetyFeatures: safetyFeaturesData,
          makes: makesData,
          bodyTypes: bodyTypesData,
          fuelTypes: fuelTypesData,
          transmissionTypes: transmissionTypesData,
          driveTypes: driveTypesData,
          conditionTypes: conditionTypesData,
          months: monthsData,
          offerTypes: offerTypesData
        });
      } catch (error) {
        console.error("Error fetching options:", error);
      } finally {
        setIsLoadingOptions(false);
      }
    };

    fetchAllOptions();
  }, []);

  useEffect(() => {
    if (isEditMode && id) {
      fetchCarData();
    }
  }, [id, isEditMode]);

  const fetchCarData = async () => {
    try {
      setIsLoading(true);
      setError("");
      
      const response = await vehicleAPI.getVehicle(id!);
      const vehicleData = response.data;
      
      // Map the API response to our form structure
      const mappedData: CarData = {
        title: vehicleData.title || "",
        price: vehicleData.price !== undefined ? vehicleData.price : null,
        priceCurrency: vehicleData.priceCurrency || "USD",
        description: vehicleData.description || "",
        make: vehicleData.make || "",
        model: vehicleData.model || "",
        year: vehicleData.year || new Date().getFullYear(),
        mileage: vehicleData.mileage || "",
        mileageUnit: vehicleData.mileageUnit || "km",
        vin: vehicleData.vin || "",
        bodyType: vehicleData.bodyType || "",
        color: vehicleData.color || "",
        fuelType: vehicleData.fuelType || "",
        vehicleSeatingCapacity: vehicleData.vehicleSeatingCapacity || "",
        vehicleTransmission: vehicleData.vehicleTransmission || "",
        carFeature: vehicleData.carFeature || [],
        carSafetyFeature: vehicleData.carSafetyFeature || [],
        images: vehicleData.images ? vehicleData.images.map((img: any) => ({
          ...img,
          // Update image URLs to use the new CDN domain if they're using the old domain
          url: img.url.replace('https://ss.holdings/uploads', 'https://cdn.ss.holdings/uploads')
        })) : [],
        stockNumber: vehicleData.stockNumber || "",
        driveType: vehicleData.driveType || "",
        engineType: vehicleData.engineType || "",
        engineCapacity: vehicleData.engineCapacity || "",
        interiorColor: vehicleData.interiorColor || "",
        doors: vehicleData.doors || "",
        condition: vehicleData.condition || "Used",
        month: vehicleData.month || "",
        location: vehicleData.location || "",
        isFeatured: vehicleData.isFeatured || false,
        section: vehicleData.section || "",
        offerType: vehicleData.offerType || "In Stock",
      };
      
      setCar(mappedData);
      
      // Set preview images from existing images
      if (vehicleData.images && vehicleData.images.length > 0) {
        // Update image URLs to use the new CDN domain
        const imageUrls = vehicleData.images.map((img: any) => 
          img.url.replace('https://ss.holdings/uploads', 'https://cdn.ss.holdings/uploads')
        );
        setPreviewImages(imageUrls);
      }
    } catch (err) {
      console.error("Error fetching car data:", err);
      setError("Failed to load car data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

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
      [name]: value === "" ? null : Number(value)
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setCar(prevState => ({
      ...prevState,
      [name]: checked
    }));
  };

  const handleFeatureToggle = (feature: string) => {
    setCar(prevState => {
      if (prevState.carFeature.includes(feature)) {
        return {
          ...prevState,
          carFeature: prevState.carFeature.filter(f => f !== feature)
        };
      } else {
        return {
          ...prevState,
          carFeature: [...prevState.carFeature, feature]
        };
      }
    });
  };

  const handleSafetyFeatureToggle = (feature: string) => {
    setCar(prevState => {
      if (prevState.carSafetyFeature.includes(feature)) {
        return {
          ...prevState,
          carSafetyFeature: prevState.carSafetyFeature.filter(f => f !== feature)
        };
      } else {
        return {
          ...prevState,
          carSafetyFeature: [...prevState.carSafetyFeature, feature]
        };
      }
    });
  };

  // Create a new function to handle file uploads from the DropZone
  const handleFilesAdded = async (files: File[]) => {
    if (files.length === 0) return;
    
    // Show processing state
    setIsProcessingImages(true);
    
    try {
      // Process each file - compress if needed
      const processedFiles = await Promise.all(files.map(async (file) => {
        // Get original file size
        const originalSize = file.size;
        
        // Get optimal compression options based on file size
        const options = getOptimalCompressionOptions(file);
        
        // Compress the image if needed
        const compressedFile = await compressImageIfNeeded(file, options);
        
        // Create preview URL
        const previewUrl = URL.createObjectURL(compressedFile);
        
        // Track compression stats
        setCompressionStats(prev => [...prev, {
          fileName: file.name,
          originalSize,
          compressedSize: compressedFile.size
        }]);
        
        return {
          id: `new-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          url: previewUrl,
          file: compressedFile,
          isMain: newImages.length === 0 && car.images.length === 0 // First image is main if no other images exist
        };
      }));
      
      // Add the processed images to the state
      setNewImages(prev => [...prev, ...processedFiles]);
    } catch (error) {
      console.error("Error processing images:", error);
      setError("Failed to process some images. Please try again.");
    } finally {
      setIsProcessingImages(false);
    }
  };

  const handleNewImagesReorder = (reorderedImages: Array<{ id: string; url: string; isMain?: boolean }>) => {
    // Map back the file information that isn't included in the reordered array
    const updatedImages = reorderedImages.map(img => {
      const originalImage = newImages.find(original => original.id === img.id);
      return {
        ...originalImage!,
        isMain: img.isMain !== undefined ? img.isMain : originalImage!.isMain
      };
    });
    
    setNewImages(updatedImages);
  };

  const handleExistingImagesReorder = (reorderedImages: Array<{ id: string; url: string; isMain?: boolean }>) => {
    // Map back to the original car image structure
    const updatedImages = reorderedImages.map((img, index) => {
      const originalImage = car.images.find(original => original.url === img.url);
      return {
        ...originalImage!,
        order: index,
        isMain: img.isMain !== undefined ? img.isMain : index === 0
      };
    });
    
    setCar(prev => ({
      ...prev,
      images: updatedImages
    }));
  };

  const removeNewImage = (index: number) => {
    // Get the file name of the image being removed
    const imageToRemove = newImages[index];
    
    // Update newImages state
    setNewImages(prev => {
      const updatedImages = prev.filter((_, i) => i !== index);
      
      // If we removed the main image, set the first image as main
      if (prev[index]?.isMain && updatedImages.length > 0) {
        updatedImages[0].isMain = true;
      }
      
      return updatedImages;
    });
    
    // Remove the corresponding compression stat if it exists
    if (imageToRemove && imageToRemove.file) {
      const fileName = imageToRemove.file.name;
      setCompressionStats(prev => 
        prev.filter(stat => stat.fileName !== fileName)
      );
    }
  };

  const removeExistingImage = (index: number) => {
    try {
      setCar(prev => {
        const updatedImages = prev.images.filter((_, i) => i !== index);
        
        // If we removed the main image, set the first image as main
        if (prev.images[index]?.isMain && updatedImages.length > 0) {
          updatedImages[0].isMain = true;
        }
        
        return {
          ...prev,
          images: updatedImages
        };
      });
    } catch (error) {
      console.error("Error removing existing image:", error);
      setError("Failed to remove image. Please try again.");
    }
  };

  const setMainNewImage = (index: number) => {
    setNewImages(prev => 
      prev.map((img, i) => ({
        ...img,
        isMain: i === index
      }))
    );
  };

  const setMainExistingImage = (index: number) => {
    setCar(prev => ({
      ...prev,
      images: prev.images.map((img, i) => ({
        ...img,
        isMain: i === index
      }))
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError("");

    // Basic validation
    if (!car.title) {
      setError("Car title is required");
      setIsSaving(false);
      return;
    }

    if (!car.make) {
      setError("Car make is required");
      setIsSaving(false);
      return;
    }

    if (!car.model) {
      setError("Car model is required");
      setIsSaving(false);
      return;
    }

    if (!car.price) {
      setError("Price is required");
      setIsSaving(false);
      return;
    }

    // Validate that we have at least one image (either existing or new)
    const hasExistingImages = car.images && car.images.length > 0;
    const hasNewImages = newImages && newImages.length > 0;
    
    if (!hasExistingImages && !hasNewImages) {
      setError("At least one image is required");
      setIsSaving(false);
      return;
    }

    try {
      // Prepare the data for submission
      const formData = new FormData();
      
      // Add all car data
      Object.entries(car).forEach(([key, value]) => {
        if (key === 'carFeature' || key === 'carSafetyFeature') {
          formData.append(key, JSON.stringify(value));
        } else if (key === 'images') {
          // Skip images here, we'll handle them separately
        } else if (value === null) {
          // Skip null values or set them to empty string
          formData.append(key, '');
        } else {
          formData.append(key, value.toString());
        }
      });

      // Add new image files if any
      if (newImages.length > 0) {
        // Sort by isMain first, then by the order in the array
        const sortedNewImages = [...newImages].sort((a, b) => {
          if (a.isMain && !b.isMain) return -1;
          if (!a.isMain && b.isMain) return 1;
          return 0;
        });
        
        sortedNewImages.forEach((image) => {
          if (!image.file) {
            console.error("Missing file in image object:", image);
            throw new Error("One or more image files are invalid");
          }
          formData.append('images', image.file);
        });
      }

      // Add existing images if in edit mode
      if (isEditMode && car.images && car.images.length > 0) {
        // Validate that all existing images have valid URLs
        const invalidImages = car.images.filter(img => 
          !img.url || 
          img.url.includes('/Users/') || 
          img.url.includes('/Desktop/') || 
          img.url.includes('/backend/uploads/')
        );
        
        if (invalidImages.length > 0) {
          console.warn("Found invalid image URLs:", invalidImages);
          // Filter out invalid images
          const validImages = car.images.filter(img => 
            img.url && 
            !img.url.includes('/Users/') && 
            !img.url.includes('/Desktop/') && 
            !img.url.includes('/backend/uploads/')
          );
          
          if (validImages.length === 0 && !hasNewImages) {
            setError("All existing images have invalid URLs. Please add new images.");
            setIsSaving(false);
            return;
          }
          
          // Use only valid images
          formData.append('existingImages', JSON.stringify(validImages));
        } else {
          formData.append('existingImages', JSON.stringify(car.images));
        }
      }

      let response;
      if (isEditMode && id) {
        response = await vehicleAPI.updateVehicle(id, formData);
      } else {
        response = await vehicleAPI.createVehicle(formData);
      }

      if (response.data) {
        // Show success message before redirecting
        setError("");
        alert(`Car ${isEditMode ? 'updated' : 'created'} successfully!`);
        router.push('/admin/dashboard/cars');
      }
    } catch (err: any) {
      console.error("Error saving car:", err);
      
      // Handle different types of errors
      if (err.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        const errorMessage = err.response.data?.message || 
                            err.response.data?.error || 
                            `Server error: ${err.response.status}`;
        setError(errorMessage);
      } else if (err.request) {
        // The request was made but no response was received
        setError("No response from server. Please check your internet connection.");
      } else {
        // Something happened in setting up the request that triggered an Error
        setError(`Error: ${err.message || "Failed to save car"}`);
      }
    } finally {
      setIsSaving(false);
    }
  };

  // Format number with commas
  const formatNumberWithCommas = (value: string | number): string => {
    if (value === null || value === undefined || value === '') return '';
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // Parse number removing commas
  const parseNumberRemovingCommas = (value: string): string => {
    return value.replace(/,/g, '');
  };

  // Handle mileage change with comma formatting
  const handleMileageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // Remove any commas first
    const rawValue = parseNumberRemovingCommas(value);
    // Update the state with raw value
    setCar(prevState => ({
      ...prevState,
      [name]: rawValue
    }));
  };

  // Add the clearCompressionStats function after handleImageUpload
  const clearCompressionStats = () => {
    setCompressionStats([]);
  };

  if (isLoading) {
    return (
      <div className="w-full flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <span className="ml-2 text-gray-600">Loading car data...</span>
      </div>
    );
  }
  
  if (isLoadingOptions) {
    return (
      <div className="w-full flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <span className="ml-2 text-gray-600">Loading options data...</span>
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Car Title*
            </label>
            <input
              type="text"
              name="title"
              id="title"
              required
              value={car.title}
              onChange={handleChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 h-10 px-4"
            />
          </div>
          
          <div>
            <label htmlFor="make" className="block text-sm font-medium text-gray-700 mb-1">
              Make*
            </label>
            <div className="relative">
              <select
                id="make"
                name="make"
                value={car.make}
                onChange={handleChange}
                className="block w-full appearance-none rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 h-10 px-4"
              >
                <option value="">Select a make</option>
                {options.makes.map(make => (
                  <option key={make._id} value={make.name}>{make.name}</option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
            </div>
          </div>
          
          <div>
            <label htmlFor="model" className="block text-sm font-medium text-gray-700 mb-1">
              Model*
            </label>
            <input
              type="text"
              name="model"
              id="model"
              required
              value={car.model}
              onChange={handleChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 h-10 px-4"
            />
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
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 h-10 px-4"
            />
          </div>
          
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
              Price*
            </label>
            <div className="relative rounded-md shadow-sm">
              <input
                type="number"
                name="price"
                id="price"
                required
                min="0"
                step="0.01"
                value={car.price === null ? '' : car.price}
                onChange={handleNumberChange}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 h-10 px-4"
                placeholder="Enter price"
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="priceCurrency" className="block text-sm font-medium text-gray-700 mb-1">
              Currency
            </label>
            <div className="relative">
              <select
                name="priceCurrency"
                id="priceCurrency"
                value={car.priceCurrency}
                onChange={handleChange}
                className="block w-full appearance-none rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 h-10 px-4"
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="JPY">JPY</option>
                <option value="GBP">GBP</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
            </div>
          </div>

          <div>
            <label htmlFor="stockNumber" className="block text-sm font-medium text-gray-700 mb-1">
              Stock Number
            </label>
            <input
              type="text"
              name="stockNumber"
              id="stockNumber"
              value={car.stockNumber}
              onChange={handleChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 h-10 px-4"
            />
          </div>

          <div>
            <label htmlFor="vin" className="block text-sm font-medium text-gray-700 mb-1">
              VIN
            </label>
            <input
              type="text"
              name="vin"
              id="vin"
              value={car.vin}
              onChange={handleChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 h-10 px-4"
            />
          </div>

          <div>
            <label htmlFor="condition" className="block text-sm font-medium text-gray-700 mb-1">
              Condition
            </label>
            <div className="relative">
              <select
                id="condition"
                name="condition"
                value={car.condition}
                onChange={handleChange}
                className="block w-full appearance-none rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 h-10 px-4"
              >
                {options.conditionTypes.map(condition => (
                  <option key={condition._id} value={condition.name}>{condition.name}</option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
            </div>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="isFeatured"
              id="isFeatured"
              checked={car.isFeatured}
              onChange={handleCheckboxChange}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="isFeatured" className="ml-2 block text-sm text-gray-900">
              Featured Vehicle
            </label>
          </div>
        </div>
      </div>

      {/* Vehicle Details Section */}
      <div className="bg-white shadow-sm rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Vehicle Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <label htmlFor="bodyType" className="block text-sm font-medium text-gray-700 mb-1">
              Body Type
            </label>
            <div className="relative">
              <select
                id="bodyType"
                name="bodyType"
                value={car.bodyType}
                onChange={handleChange}
                className="block w-full appearance-none rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 h-10 px-4"
              >
                <option value="">Select body type</option>
                {options.bodyTypes.map(type => (
                  <option key={type._id} value={type.name}>{type.name}</option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
            </div>
          </div>
          
          <div>
            <label htmlFor="doors" className="block text-sm font-medium text-gray-700 mb-1">
              Doors
            </label>
            <input
              type="text"
              name="doors"
              id="doors"
              value={car.doors}
              onChange={handleChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 h-10 px-4"
            />
          </div>

          <div>
            <label htmlFor="vehicleSeatingCapacity" className="block text-sm font-medium text-gray-700 mb-1">
              Seating Capacity
            </label>
            <input
              type="text"
              name="vehicleSeatingCapacity"
              id="vehicleSeatingCapacity"
              value={car.vehicleSeatingCapacity}
              onChange={handleChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 h-10 px-4"
            />
          </div>
          
          <div>
            <label htmlFor="color" className="block text-sm font-medium text-gray-700 mb-1">
              Exterior Color
            </label>
            <input
              type="text"
              name="color"
              id="color"
              value={car.color}
              onChange={handleChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 h-10 px-4"
            />
          </div>

          <div>
            <label htmlFor="interiorColor" className="block text-sm font-medium text-gray-700 mb-1">
              Interior Color
            </label>
            <input
              type="text"
              name="interiorColor"
              id="interiorColor"
              value={car.interiorColor}
              onChange={handleChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 h-10 px-4"
            />
          </div>

          <div>
            <label htmlFor="mileage" className="block text-sm font-medium text-gray-700 mb-1">
              Mileage*
            </label>
            <div className="flex">
              <input
                type="text"
                name="mileage"
                id="mileage"
                required
                value={formatNumberWithCommas(car.mileage)}
                onChange={handleMileageChange}
                className="block w-3/4 rounded-l-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 h-10 px-4"
                placeholder="Enter mileage"
              />
              <select
                name="mileageUnit"
                value={car.mileageUnit}
                onChange={handleChange}
                className="block w-1/4 rounded-r-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 h-10"
              >
                <option value="km">km</option>
                <option value="mi">mi</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Engine & Transmission */}
      <div className="bg-white shadow-sm rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Engine & Transmission</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <label htmlFor="engineType" className="block text-sm font-medium text-gray-700 mb-1">
              Engine Type
            </label>
            <input
              type="text"
              name="engineType"
              id="engineType"
              value={car.engineType}
              onChange={handleChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 h-10 px-4"
            />
          </div>
          
          <div>
            <label htmlFor="engineCapacity" className="block text-sm font-medium text-gray-700 mb-1">
              Engine Capacity
            </label>
            <input
              type="text"
              name="engineCapacity"
              id="engineCapacity"
              value={car.engineCapacity}
              onChange={handleChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 h-10 px-4"
            />
          </div>
          
          <div>
            <label htmlFor="fuelType" className="block text-sm font-medium text-gray-700 mb-1">
              Fuel Type
            </label>
            <div className="relative">
              <select
                id="fuelType"
                name="fuelType"
                value={car.fuelType}
                onChange={handleChange}
                className="block w-full appearance-none rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 h-10 px-4"
              >
                <option value="">Select fuel type</option>
                {options.fuelTypes.map(type => (
                  <option key={type._id} value={type.name}>{type.name}</option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
            </div>
          </div>
          
          <div>
            <label htmlFor="vehicleTransmission" className="block text-sm font-medium text-gray-700 mb-1">
              Transmission
            </label>
            <div className="relative">
              <select
                id="vehicleTransmission"
                name="vehicleTransmission"
                value={car.vehicleTransmission}
                onChange={handleChange}
                className="block w-full appearance-none rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 h-10 px-4"
              >
                <option value="">Select transmission</option>
                {options.transmissionTypes.map(type => (
                  <option key={type._id} value={type.name}>{type.name}</option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
            </div>
          </div>
          
          <div>
            <label htmlFor="driveType" className="block text-sm font-medium text-gray-700 mb-1">
              Drive Type
            </label>
            <div className="relative">
              <select
                id="driveType"
                name="driveType"
                value={car.driveType}
                onChange={handleChange}
                className="block w-full appearance-none rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 h-10 px-4"
              >
                <option value="">Select drive type</option>
                {options.driveTypes.map(type => (
                  <option key={type._id} value={type.name}>{type.name}</option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Additional Details */}
      <div className="bg-white shadow-sm rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Additional Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <label htmlFor="month" className="block text-sm font-medium text-gray-700 mb-1">
              Month
            </label>
            <div className="relative">
              <select
                id="month"
                name="month"
                value={car.month}
                onChange={handleChange}
                className="block w-full appearance-none rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 h-10 px-4"
              >
                <option value="">Select month</option>
                {options.months.map(month => (
                  <option key={month._id} value={month.name}>{month.name}</option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
            </div>
          </div>
          
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
              Location
            </label>
            <input
              type="text"
              name="location"
              id="location"
              value={car.location}
              onChange={handleChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 h-10 px-4"
            />
          </div>
          
          <div>
            <label htmlFor="section" className="block text-sm font-medium text-gray-700 mb-1">
              Section
            </label>
            <input
              type="text"
              name="section"
              id="section"
              value={car.section}
              onChange={handleChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 h-10 px-4"
              placeholder="e.g., Sedans, SUVs, etc."
            />
          </div>

          <div>
            <label htmlFor="offerType" className="block text-sm font-medium text-gray-700 mb-1">
              Offer Type
            </label>
            <div className="relative">
              <select
                id="offerType"
                name="offerType"
                value={car.offerType}
                onChange={handleChange}
                className="block w-full appearance-none rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 h-10 px-4"
              >
                {options.offerTypes.map(type => (
                  <option key={type._id} value={type.name}>{type.name}</option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="bg-white shadow-sm rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Description</h3>
        <div>
          <textarea
            name="description"
            id="description"
            rows={5}
            value={car.description}
            onChange={handleChange}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 h-32 px-4 py-2"
            placeholder="Provide a detailed description of the vehicle..."
          ></textarea>
        </div>
      </div>

      {/* Features */}
      <div className="bg-white shadow-sm rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h4 className="font-medium text-gray-800 mb-3">Comfort & Convenience</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {options.features.map(feature => (
                <div key={feature._id} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`feature-${feature.name}`}
                    checked={car.carFeature.includes(feature.name)}
                    onChange={() => handleFeatureToggle(feature.name)}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor={`feature-${feature.name}`} className="ml-2 block text-sm text-gray-900">
                    {feature.name}
                  </label>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-800 mb-3">Safety Features</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {options.safetyFeatures.map(feature => (
                <div key={feature._id} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`safety-${feature.name}`}
                    checked={car.carSafetyFeature.includes(feature.name)}
                    onChange={() => handleSafetyFeatureToggle(feature.name)}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor={`safety-${feature.name}`} className="ml-2 block text-sm text-gray-900">
                    {feature.name}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Images */}
      <div className="bg-white shadow-sm rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Vehicle Images</h3>
        
        {/* Drop zone for image uploads */}
        <DropZone
          onFilesAdded={handleFilesAdded}
          disabled={isProcessingImages}
          maxFiles={40}
          multiple={true}
          accept="image/*"
        />

        {/* Image processing indicator */}
        <ImageProcessingIndicator isProcessing={isProcessingImages} />

        {/* Compression stats */}
        {compressionStats.length > 0 && (
          <div className="mb-4 mt-4">
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-sm font-medium text-gray-700">Image Compression</h4>
              <button
                type="button"
                onClick={clearCompressionStats}
                className="text-xs text-gray-500 hover:text-gray-700"
              >
                Clear
              </button>
            </div>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {compressionStats.map((stat, index) => (
                <FileSizeIndicator
                  key={index}
                  fileName={stat.fileName}
                  originalSize={stat.originalSize}
                  compressedSize={stat.compressedSize}
                />
              ))}
            </div>
          </div>
        )}

        {/* New images with drag-and-drop */}
        {newImages.length > 0 && (
          <DraggableImageList
            images={newImages.map(img => ({ id: img.id, url: img.url, isMain: img.isMain }))}
            onReorder={handleNewImagesReorder}
            onRemove={removeNewImage}
            onSetMain={setMainNewImage}
            title="New Images"
          />
        )}

        {/* Existing images with drag-and-drop (for edit mode) */}
        {isEditMode && car.images.length > 0 && (
          <DraggableImageList
            images={car.images.map((img, index) => ({ 
              id: img.publicId || `existing-${index}`, 
              url: img.url, 
              isMain: img.isMain 
            }))}
            onReorder={handleExistingImagesReorder}
            onRemove={removeExistingImage}
            onSetMain={setMainExistingImage}
            title="Current Images"
          />
        )}
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={() => router.push("/admin/dashboard/cars")}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSaving}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center disabled:bg-blue-300"
        >
          {isSaving ? (
            <>
              <Loader2 className="animate-spin mr-2 h-4 w-4" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Car
            </>
          )}
        </button>
      </div>
    </form>
  );
} 