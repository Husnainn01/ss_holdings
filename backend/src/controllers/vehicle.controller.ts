import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import Vehicle, { IVehicle } from '../models/vehicle.model';

// Get all vehicles with filtering, pagination, and sorting
export const getVehicles = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('=== DEBUG: getVehicles called ===');
    console.log('Database connection state:', require('mongoose').connection.readyState);
    console.log('Database name:', require('mongoose').connection.name);
    
    const { 
      page = 1, 
      limit = 10, 
      sort = '-createdAt',
      make, 
      model, 
      year,
      yearFrom,
      yearTo,
      minPrice, 
      maxPrice,
      bodyType,
      isFeatured,
      condition,
      minMileage,
      maxMileage,
      fuelType,
      vehicleTransmission,
      location,
      exclude
    } = req.query;

    // Build filter object
    const filter: any = {};
    
    if (make) filter.make = { $regex: make, $options: 'i' };
    if (model) filter.model = { $regex: model, $options: 'i' };
    if (location) filter.location = { $regex: location, $options: 'i' };
    
    // Exclude specific vehicle ID if provided (useful for similar vehicles)
    if (exclude) filter._id = { $ne: exclude };
    
    // Handle year filtering
    if (year) {
      filter.year = Number(year);
    } else {
      // Year range filtering
      if (yearFrom || yearTo) {
        filter.year = {};
        if (yearFrom) filter.year.$gte = Number(yearFrom);
        if (yearTo) filter.year.$lte = Number(yearTo);
      }
    }
    
    // Handle price filtering
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    
    // Handle mileage filtering
    if (minMileage || maxMileage) {
      filter.mileage = {};
      if (minMileage) filter.mileage.$gte = Number(minMileage);
      if (maxMileage) filter.mileage.$lte = Number(maxMileage);
    }
    
    if (bodyType) filter.bodyType = bodyType;
    if (isFeatured === 'true') filter.isFeatured = true;
    if (condition) filter.condition = condition;
    if (fuelType) filter.fuelType = fuelType;
    if (vehicleTransmission) filter.vehicleTransmission = vehicleTransmission;

    console.log('Filter applied:', JSON.stringify(filter));

    // Calculate pagination
    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;

    console.log('Pagination:', { pageNum, limitNum, skip });

    // First, let's check if any vehicles exist at all
    const totalVehicles = await Vehicle.countDocuments({});
    console.log('Total vehicles in database:', totalVehicles);

    // Execute query with pagination
    const vehicles = await Vehicle.find(filter)
      .sort(sort as string)
      .skip(skip)
      .limit(limitNum);

    console.log('Vehicles found with filter:', vehicles.length);

    // Get total count for pagination
    const total = await Vehicle.countDocuments(filter);

    console.log('=== DEBUG: Response data ===');
    console.log('Total matching filter:', total);
    console.log('Vehicles returned:', vehicles.length);

    res.status(200).json({
      vehicles,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      total
    });
  } catch (error) {
    console.error('Error fetching vehicles:', error);
    res.status(500).json({ message: 'Server error fetching vehicles' });
  }
};

// Get vehicle by ID
export const getVehicleById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    const vehicle = await Vehicle.findById(id);
    
    if (!vehicle) {
      res.status(404).json({ message: 'Vehicle not found' });
      return;
    }
    
    res.status(200).json(vehicle);
  } catch (error) {
    console.error('Error fetching vehicle:', error);
    res.status(500).json({ message: 'Server error fetching vehicle' });
  }
};

// Create new vehicle
export const createVehicle = async (req: Request, res: Response): Promise<void> => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    console.log('Creating vehicle with files:', req.files);

    // Parse form data
    const vehicleData: IVehicle = {
      ...req.body,
      // Parse JSON strings back to arrays/objects if they're provided as strings
      carFeature: req.body.carFeature ? 
        (typeof req.body.carFeature === 'string' ? JSON.parse(req.body.carFeature) : req.body.carFeature) : 
        [],
      carSafetyFeature: req.body.carSafetyFeature ? 
        (typeof req.body.carSafetyFeature === 'string' ? JSON.parse(req.body.carSafetyFeature) : req.body.carSafetyFeature) : 
        [],
      // Initialize empty images array if no images provided
      images: req.files && Array.isArray(req.files) && req.files.length > 0 ? 
        req.files.map((file: any, index) => {
          console.log('Processing file:', file);
          
          // Prioritize location over path for the URL
          // Make sure we're not using local file paths
          const imageUrl = file.location || file.path;
          console.log(`Using image URL: ${imageUrl}`);
          
          // Validate the URL is not a local file path
          if (imageUrl.includes('/Users/') || 
              imageUrl.includes('/Desktop/') || 
              imageUrl.includes('/backend/uploads/')) {
            console.error(`Invalid image URL detected: ${imageUrl}`);
            throw new Error('Invalid image URL. SFTP upload may have failed.');
          }
          
          return {
            url: imageUrl,
            publicId: file.publicId || file.key || file.filename,
            key: file.key || file.filename,
            order: index,
            isMain: index === 0 // First image is main by default
          };
        }) : []
    };
    
    console.log('Vehicle data images:', vehicleData.images);
    
    // Create new vehicle
    const vehicle = new Vehicle(vehicleData);
    await vehicle.save();
    
    res.status(201).json(vehicle);
  } catch (error: any) {
    console.error('Error creating vehicle:', error);
    res.status(500).json({ message: 'Server error creating vehicle', error: error.message });
  }
};

// Update vehicle
export const updateVehicle = async (req: Request, res: Response): Promise<void> => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { id } = req.params;
    
    console.log('Updating vehicle with files:', req.files);
    
    // Parse form data
    const vehicleData: any = {
      ...req.body,
      // Parse JSON strings back to arrays/objects if they're provided as strings
      carFeature: req.body.carFeature ? 
        (typeof req.body.carFeature === 'string' ? JSON.parse(req.body.carFeature) : req.body.carFeature) : 
        undefined,
      carSafetyFeature: req.body.carSafetyFeature ? 
        (typeof req.body.carSafetyFeature === 'string' ? JSON.parse(req.body.carSafetyFeature) : req.body.carSafetyFeature) : 
        undefined,
    };
    
    // Handle existing images if provided
    if (req.body.existingImages) {
      try {
        vehicleData.images = JSON.parse(req.body.existingImages);
        console.log('Existing images:', vehicleData.images);
        
        // Validate existing image URLs
        const invalidImages = vehicleData.images.filter((img: any) => 
          !img.url || 
          img.url.includes('/Users/') || 
          img.url.includes('/Desktop/') || 
          img.url.includes('/backend/uploads/')
        );
        
        if (invalidImages.length > 0) {
          console.warn('Found invalid image URLs in existing images:', invalidImages);
          
          // Filter out invalid images
          vehicleData.images = vehicleData.images.filter((img: any) => 
            img.url && 
            !img.url.includes('/Users/') && 
            !img.url.includes('/Desktop/') && 
            !img.url.includes('/backend/uploads/')
          );
          
          console.log('Filtered images after removing invalid URLs:', vehicleData.images);
        }
      } catch (e) {
        console.error('Error parsing existingImages:', e);
      }
    }
    
    // Add new images if provided
    if (req.files && Array.isArray(req.files) && req.files.length > 0) {
      const newImages = req.files.map((file: any, index) => {
        console.log('Processing file for update:', file);
        
        // Prioritize location over path for the URL
        const imageUrl = file.location || file.path;
        console.log(`Using image URL: ${imageUrl}`);
        
        // Validate the URL is not a local file path
        if (imageUrl.includes('/Users/') || 
            imageUrl.includes('/Desktop/') || 
            imageUrl.includes('/backend/uploads/')) {
          console.error(`Invalid image URL detected: ${imageUrl}`);
          throw new Error('Invalid image URL. SFTP upload may have failed.');
        }
        
        return {
          url: imageUrl,
          publicId: file.publicId || file.key || file.filename,
          key: file.key || file.filename,
          order: (vehicleData.images?.length || 0) + index,
          isMain: !vehicleData.images || vehicleData.images.length === 0 ? index === 0 : false
        };
      });
      
      console.log('New images:', newImages);
      
      if (vehicleData.images) {
        vehicleData.images = [...vehicleData.images, ...newImages];
      } else {
        vehicleData.images = newImages;
      }
    }
    
    // Find and update vehicle
    const vehicle = await Vehicle.findByIdAndUpdate(
      id, 
      vehicleData, 
      { new: true, runValidators: true }
    );
    
    if (!vehicle) {
      res.status(404).json({ message: 'Vehicle not found' });
      return;
    }
    
    res.status(200).json(vehicle);
  } catch (error: any) {
    console.error('Error updating vehicle:', error);
    res.status(500).json({ message: 'Server error updating vehicle', error: error.message });
  }
};

// Delete vehicle
export const deleteVehicle = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    const vehicle = await Vehicle.findByIdAndDelete(id);
    
    if (!vehicle) {
      res.status(404).json({ message: 'Vehicle not found' });
      return;
    }
    
    res.status(200).json({ message: 'Vehicle deleted successfully' });
  } catch (error) {
    console.error('Error deleting vehicle:', error);
    res.status(500).json({ message: 'Server error deleting vehicle' });
  }
};

// Get featured vehicles
export const getFeaturedVehicles = async (req: Request, res: Response): Promise<void> => {
  try {
    const limit = Number(req.query.limit) || 6;
    
    const vehicles = await Vehicle.find({ isFeatured: true })
      .sort('-createdAt')
      .limit(limit);
    
    res.status(200).json(vehicles);
  } catch (error) {
    console.error('Error fetching featured vehicles:', error);
    res.status(500).json({ message: 'Server error fetching featured vehicles' });
  }
};

// Get recently added vehicles
export const getRecentVehicles = async (req: Request, res: Response): Promise<void> => {
  try {
    const limit = Number(req.query.limit) || 6;
    
    const vehicles = await Vehicle.find()
      .sort('-createdAt')
      .limit(limit);
    
    res.status(200).json(vehicles);
  } catch (error) {
    console.error('Error fetching recent vehicles:', error);
    res.status(500).json({ message: 'Server error fetching recent vehicles' });
  }
};

// Get unique vehicle locations
export const getVehicleLocations = async (req: Request, res: Response): Promise<void> => {
  try {
    // Aggregate to get unique locations with count
    const locations = await Vehicle.aggregate([
      // Filter out vehicles with no location
      { $match: { location: { $exists: true, $ne: '' } } },
      // Group by location and count
      { $group: { _id: '$location', count: { $sum: 1 } } },
      // Format the output
      { $project: { _id: 0, name: '$_id', count: 1 } },
      // Sort by count descending
      { $sort: { count: -1 } }
    ]);
    
    res.status(200).json(locations);
  } catch (error) {
    console.error('Error fetching vehicle locations:', error);
    res.status(500).json({ message: 'Server error fetching vehicle locations' });
  }
};

// Get unique models by make
export const getModelsByMake = async (req: Request, res: Response): Promise<void> => {
  try {
    const { make } = req.params;
    
    if (!make) {
      res.status(400).json({ message: 'Make parameter is required' });
      return;
    }
    
    // Aggregate to get unique models with count for the specified make
    const models = await Vehicle.aggregate([
      // Filter by make (case insensitive)
      { $match: { make: { $regex: make, $options: 'i' } } },
      // Filter out vehicles with no model
      { $match: { model: { $exists: true, $ne: '' } } },
      // Group by model and count
      { $group: { _id: '$model', count: { $sum: 1 } } },
      // Format the output
      { $project: { _id: 0, name: '$_id', count: 1 } },
      // Sort by name ascending
      { $sort: { name: 1 } }
    ]);
    
    res.status(200).json(models);
  } catch (error) {
    console.error('Error fetching models by make:', error);
    res.status(500).json({ message: 'Server error fetching models' });
  }
}; 