import imageCompression from 'browser-image-compression';

// Size threshold in bytes (1MB)
const COMPRESSION_THRESHOLD = 1024 * 1024;

// Define the Options type based on the library's documentation
interface CompressionOptions {
  maxSizeMB?: number;
  maxWidthOrHeight?: number;
  useWebWorker?: boolean;
  maxIteration?: number;
  exifOrientation?: number;
  fileType?: string;
  initialQuality?: number;
  preserveExif?: boolean;
  alwaysKeepResolution?: boolean;
}

// Default compression options
const defaultOptions: CompressionOptions = {
  maxSizeMB: 1,          // Max size in MB
  maxWidthOrHeight: 1920, // Max width/height
  useWebWorker: true,    // Use web worker for better performance
  preserveExif: true,    // Preserve EXIF data
};

/**
 * Compresses an image if it's larger than the threshold
 * @param file The image file to compress
 * @param customOptions Optional custom compression options
 * @returns Promise with the compressed file (or original if small enough)
 */
export const compressImageIfNeeded = async (
  file: File,
  customOptions?: Partial<CompressionOptions>
): Promise<File> => {
  // Skip compression for small files or non-image files
  if (file.size <= COMPRESSION_THRESHOLD || !file.type.startsWith('image/')) {
    console.log(`Skipping compression for ${file.name} (${(file.size / 1024).toFixed(2)} KB)`);
    return file;
  }

  try {
    console.log(`Compressing ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)...`);
    
    // Merge default options with any custom options
    const options = {
      ...defaultOptions,
      ...customOptions,
    };
    
    // Compress the image
    const compressedFile = await imageCompression(file, options);
    
    console.log(`Compressed ${file.name} from ${(file.size / 1024 / 1024).toFixed(2)} MB to ${(compressedFile.size / 1024 / 1024).toFixed(2)} MB`);
    
    return compressedFile;
  } catch (error) {
    console.error('Error compressing image:', error);
    // Return the original file if compression fails
    return file;
  }
};

/**
 * Compresses multiple images if they're larger than the threshold
 * @param files Array of image files to compress
 * @param customOptions Optional custom compression options
 * @returns Promise with array of compressed files
 */
export const compressMultipleImages = async (
  files: File[],
  customOptions?: Partial<CompressionOptions>
): Promise<File[]> => {
  const compressionPromises = files.map(file => compressImageIfNeeded(file, customOptions));
  return Promise.all(compressionPromises);
};

/**
 * Calculates the optimal compression options based on the file size
 * @param file The image file to analyze
 * @returns Optimized compression options
 */
export const getOptimalCompressionOptions = (file: File): CompressionOptions => {
  const fileSizeMB = file.size / 1024 / 1024;
  
  // For very large files (>5MB), use more aggressive compression
  if (fileSizeMB > 5) {
    return {
      maxSizeMB: 0.8,
      maxWidthOrHeight: 1600,
      initialQuality: 0.7,
    };
  }
  
  // For medium files (2-5MB), use moderate compression
  if (fileSizeMB > 2) {
    return {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      initialQuality: 0.8,
    };
  }
  
  // For smaller files (1-2MB), use light compression
  return {
    maxSizeMB: 1,
    maxWidthOrHeight: 2048,
    initialQuality: 0.9,
  };
};

export default {
  compressImageIfNeeded,
  compressMultipleImages,
  getOptimalCompressionOptions,
}; 