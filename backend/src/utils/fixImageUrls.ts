import mongoose from 'mongoose';
import Vehicle from '../models/vehicle.model';
import config from '../config/config';

// Function to fix image URLs in the database
export const fixImageUrls = async () => {
  try {
    console.log('Checking for invalid image URLs...');
    
    // Patterns to identify invalid URLs
    const invalidUrlPatterns = [
      { 'images.url': { $regex: '/Users/' } },
      { 'images.url': { $regex: '/Desktop/' } },
      { 'images.url': { $regex: '/backend/uploads/' } },
      { 'images.url': { $regex: 'example.com' } },
      { 'images.url': { $regex: 'example.org' } },
      { 'images.url': { $regex: 'placeholder' } },
      { 'images.url': { $exists: true, $eq: '' } },
      { 'images.url': null }
    ];
    
    let totalFixed = 0;
    
    // Process each invalid pattern
    for (const pattern of invalidUrlPatterns) {
      const vehiclesWithInvalidUrls = await Vehicle.find(pattern);
      console.log(`Found ${vehiclesWithInvalidUrls.length} vehicles with invalid URLs matching pattern:`, pattern);
      
      // Process each vehicle with invalid URLs
      for (const vehicle of vehiclesWithInvalidUrls) {
        const updatedImages = vehicle.images.map((image: any) => {
          // Check for invalid URLs
          if (!image.url || 
              image.url.includes('/Users/') || 
              image.url.includes('/Desktop/') || 
              image.url.includes('/backend/uploads/') ||
              image.url.includes('example.com') || 
              image.url.includes('example.org') ||
              image.url.includes('placeholder') ||
              image.url === '') {
            
            // Generate a placeholder URL based on the vehicle make and model
            const placeholderText = `${vehicle.make}+${vehicle.model}`;
            return {
              ...image,
              url: `https://placehold.co/600x400/e0e0e0/8A0000?text=${placeholderText}`
            };
          }
          
          // Check for old domain URLs
          if (image.url && image.url.includes('https://ss.holdings/uploads')) {
            return {
              ...image,
              url: image.url.replace('https://ss.holdings/uploads', `${config.cdn.url}${config.cdn.uploadsPath}`)
            };
          }
          
          // Check for relative URLs
          if (image.url && image.url.startsWith('/uploads/')) {
            return {
              ...image,
              url: `${config.cdn.url}${image.url}`
            };
          }
          
          return image;
        });
        
        // Use updateOne with _id for precise updating
        const updateResult = await Vehicle.updateOne(
          { _id: vehicle._id },
          { $set: { images: updatedImages } }
        );
        
        if (updateResult.modifiedCount > 0) {
          totalFixed++;
          console.log(`Updated vehicle: ${vehicle.make} ${vehicle.model}`);
        }
      }
    }
    
    // Check for any remaining invalid URLs
    const remainingInvalidUrls = await Vehicle.countDocuments({
      $or: invalidUrlPatterns
    });
    
    if (remainingInvalidUrls > 0) {
      console.log(`WARNING: Still found ${remainingInvalidUrls} vehicles with invalid URLs`);
    } else {
      console.log('All invalid image URLs have been fixed');
    }
    
    return totalFixed;
  } catch (error) {
    console.error('Error updating image URLs:', error);
    return 0;
  }
}; 