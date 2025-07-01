import mongoose, { Schema, Document } from 'mongoose';

// Interface for individual option items
export interface IOption extends Document {
  name: string;
  category: string;
  isActive: boolean;
  order: number;
  imageUrl?: string;
  svgUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const optionSchema = new Schema<IOption>(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    category: {
      type: String,
      required: true,
      enum: [
        'features',
        'safetyFeatures', 
        'makes',
        'bodyTypes',
        'fuelTypes',
        'transmissionTypes',
        'driveTypes',
        'conditionTypes',
        'months',
        'offerTypes'
      ]
    },
    isActive: {
      type: Boolean,
      default: true
    },
    order: {
      type: Number,
      default: 0
    },
    imageUrl: {
      type: String,
      trim: true
    },
    svgUrl: {
      type: String,
      trim: true
    }
  },
  {
    timestamps: true
  }
);

// Create compound index for category and name to ensure unique names within each category
optionSchema.index({ category: 1, name: 1 }, { unique: true });

// Create index for category and order for efficient sorting
optionSchema.index({ category: 1, order: 1 });

const Option = mongoose.model<IOption>('Option', optionSchema);

export default Option; 