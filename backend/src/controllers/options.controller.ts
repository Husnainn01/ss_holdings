import { Request, Response } from 'express';
import Option, { IOption } from '../models/options.model';
import { uploadFileToSFTP } from '../utils/sftpUpload.util';
import * as path from 'path';
import * as fs from 'fs-extra';

// Get all options by category
export const getOptionsByCategory = async (req: Request, res: Response) => {
  try {
    const { category } = req.params;
    const { includeInactive = false } = req.query;
    
    const filter: any = { category };
    if (!includeInactive) {
      filter.isActive = true;
    }
    
    const options = await Option.find(filter).sort({ order: 1, name: 1 });
    
    res.json({
      success: true,
      data: options
    });
  } catch (error) {
    console.error('Error fetching options:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch options'
    });
  }
};

// Get all options (for admin)
export const getAllOptions = async (req: Request, res: Response) => {
  try {
    const { category, page = 1, limit = 50 } = req.query;
    
    const filter: any = {};
    if (category) {
      filter.category = category;
    }
    
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;
    
    const [options, total] = await Promise.all([
      Option.find(filter)
        .sort({ category: 1, order: 1, name: 1 })
        .skip(skip)
        .limit(limitNum),
      Option.countDocuments(filter)
    ]);
    
    res.json({
      success: true,
      data: options,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    console.error('Error fetching all options:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch options'
    });
  }
};

// Get single option
export const getOption = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const option = await Option.findById(id);
    
    if (!option) {
      return res.status(404).json({
        success: false,
        message: 'Option not found'
      });
    }
    
    res.json({
      success: true,
      data: option
    });
  } catch (error) {
    console.error('Error fetching option:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch option'
    });
  }
};

// Create new option
export const createOption = async (req: Request, res: Response) => {
  try {
    const { name, category, isActive = true, order = 0 } = req.body;
    
    // Validate required fields
    if (!name || !category) {
      return res.status(400).json({
        success: false,
        message: 'Name and category are required'
      });
    }
    
    // Check if option already exists in this category
    const existingOption = await Option.findOne({ name, category });
    if (existingOption) {
      return res.status(409).json({
        success: false,
        message: 'Option already exists in this category'
      });
    }
    
    const option = new Option({
      name,
      category,
      isActive,
      order
    });
    
    await option.save();
    
    res.status(201).json({
      success: true,
      data: option,
      message: 'Option created successfully'
    });
  } catch (error) {
    console.error('Error creating option:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create option'
    });
  }
};

// Update option
export const updateOption = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, category, isActive, order } = req.body;
    
    const option = await Option.findById(id);
    
    if (!option) {
      return res.status(404).json({
        success: false,
        message: 'Option not found'
      });
    }
    
    // Check if name+category combination already exists (excluding current option)
    if (name && category) {
      const existingOption = await Option.findOne({ 
        name, 
        category, 
        _id: { $ne: id } 
      });
      
      if (existingOption) {
        return res.status(409).json({
          success: false,
          message: 'Option with this name already exists in this category'
        });
      }
    }
    
    // Update fields
    if (name !== undefined) option.name = name;
    if (category !== undefined) option.category = category;
    if (isActive !== undefined) option.isActive = isActive;
    if (order !== undefined) option.order = order;
    
    await option.save();
    
    res.json({
      success: true,
      data: option,
      message: 'Option updated successfully'
    });
  } catch (error) {
    console.error('Error updating option:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update option'
    });
  }
};

// Delete option
export const deleteOption = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const option = await Option.findById(id);
    
    if (!option) {
      return res.status(404).json({
        success: false,
        message: 'Option not found'
      });
    }
    
    await Option.findByIdAndDelete(id);
    
    res.json({
      success: true,
      message: 'Option deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting option:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete option'
    });
  }
};

// Upload brand image for make
export const uploadBrandImage = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const file = req.file;
    
    if (!file) {
      return res.status(400).json({
        success: false,
        message: 'No image file provided'
      });
    }
    
    const option = await Option.findById(id);
    
    if (!option) {
      return res.status(404).json({
        success: false,
        message: 'Option not found'
      });
    }
    
    // Verify this is a make category
    if (option.category !== 'makes') {
      return res.status(400).json({
        success: false,
        message: 'Image uploads are only supported for makes category'
      });
    }
    
    // Create a temporary file from the buffer
    const fileExt = path.extname(file.originalname).toLowerCase();
    const tempFilePath = path.join(process.cwd(), `temp-${Date.now()}${fileExt}`);
    
    try {
      // Write the buffer to a temporary file
      await fs.writeFile(tempFilePath, file.buffer);
      
      // Upload the file to SFTP
      console.log(`Uploading brand image for ${option.name}`);
      const uploadResult = await uploadFileToSFTP(tempFilePath, 'brands');
      
      // Update the option with the image URL
      if (fileExt === '.svg') {
        option.svgUrl = uploadResult.url;
      } else {
        option.imageUrl = uploadResult.url;
      }
      
      await option.save();
      
      // Clean up the temporary file
      await fs.unlink(tempFilePath);
      
      res.json({
        success: true,
        data: option,
        message: 'Brand image uploaded successfully'
      });
    } catch (error) {
      // Clean up the temporary file if it exists
      try {
        if (await fs.pathExists(tempFilePath)) {
          await fs.unlink(tempFilePath);
        }
      } catch (cleanupError) {
        console.error('Error cleaning up temporary file:', cleanupError);
      }
      
      throw error;
    }
  } catch (error) {
    console.error('Error uploading brand image:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload brand image'
    });
  }
};

// Bulk update order
export const updateOptionsOrder = async (req: Request, res: Response) => {
  try {
    const { options } = req.body; // Array of { id, order }
    
    if (!Array.isArray(options)) {
      return res.status(400).json({
        success: false,
        message: 'Options array is required'
      });
    }
    
    // Update all options in parallel
    const updatePromises = options.map(({ id, order }) =>
      Option.findByIdAndUpdate(id, { order }, { new: true })
    );
    
    await Promise.all(updatePromises);
    
    res.json({
      success: true,
      message: 'Options order updated successfully'
    });
  } catch (error) {
    console.error('Error updating options order:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update options order'
    });
  }
}; 