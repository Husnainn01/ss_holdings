import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import Option from '../models/options.model';
import config from '../config/config';

// Car SVG template
const carSvgTemplate = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-car">
  <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.6-.4-1-1-1h-2"/>
  <path d="M5-3h4l2.69 5.39a2 2 0 0 0 1.79 1.09h4.6a2 2 0 0 1 2 2.34l-.8 4A2 2 0 0 1 17.5 17H2c-.5-1.5-.5-2 1-2h12"/>
  <path d="M9 17H6a1 1 0 0 1-1-1v-1a1 1 0 0 1 1-1h3"/>
  <circle cx="5" cy="17" r="2"/>
  <circle cx="15" cy="17" r="2"/>
</svg>`;

// Function to generate SVG files for all makes
const generateBrandSVGs = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(config.mongoUri);
    console.log('Connected to MongoDB');
    
    // Get all makes from the database
    const makes = await Option.find({ category: 'makes' });
    console.log(`Found ${makes.length} makes in the database`);
    
    // Create the brands directory if it doesn't exist
    const brandsDir = path.join(process.cwd(), '..', 'frontend', 'public', 'brands');
    if (!fs.existsSync(brandsDir)) {
      fs.mkdirSync(brandsDir, { recursive: true });
      console.log(`Created directory: ${brandsDir}`);
    }
    
    // Generate SVG files for each make
    for (const make of makes) {
      const fileName = `${make.name.toLowerCase()}.svg`;
      const filePath = path.join(brandsDir, fileName);
      
      // Write the SVG file
      fs.writeFileSync(filePath, carSvgTemplate);
      console.log(`Generated SVG file for ${make.name}: ${filePath}`);
      
      // Also create a PNG file with the same name (just a placeholder)
      const pngFilePath = path.join(brandsDir, `${make.name.toLowerCase()}.png`);
      fs.writeFileSync(pngFilePath, '');
      console.log(`Generated empty PNG file for ${make.name}: ${pngFilePath}`);
    }
    
    console.log('All brand SVG files generated successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error generating brand SVG files:', error);
    process.exit(1);
  }
};

// Run the script
generateBrandSVGs(); 