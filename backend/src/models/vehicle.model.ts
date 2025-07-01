import mongoose, { Schema } from 'mongoose';

export interface IVehicleImage {
  url: string;
  publicId: string;
  key: string;
  order: number;
  isMain: boolean;
}

export interface IVehicle {
  title: string;
  price: number;
  priceCurrency: string;
  description: string;
  make: string;
  model: string;
  year: number;
  mileage: string;
  mileageUnit: string;
  vin?: string;
  bodyType?: string;
  color?: string;
  fuelType?: string;
  vehicleSeatingCapacity?: string;
  vehicleTransmission?: string;
  carFeature: string[];
  carSafetyFeature: string[];
  images: IVehicleImage[];
  stockNumber?: string;
  driveType?: string;
  engineType?: string;
  engineCapacity?: string;
  interiorColor?: string;
  doors?: string;
  condition?: string;
  month?: string;
  location?: string;
  isFeatured: boolean;
  section?: string;
  offerType: string;
  date: Date;
  _id?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const vehicleSchema = new Schema<IVehicle>(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    price: {
      type: Number,
      required: true
    },
    priceCurrency: {
      type: String,
      default: 'USD'
    },
    description: {
      type: String,
      default: ''
    },
    make: {
      type: String,
      required: true,
      trim: true
    },
    model: {
      type: String,
      required: true,
      trim: true
    },
    year: {
      type: Number,
      required: true
    },
    mileage: {
      type: String,
      required: true
    },
    mileageUnit: {
      type: String,
      default: 'km'
    },
    vin: {
      type: String
    },
    bodyType: {
      type: String
    },
    color: {
      type: String
    },
    fuelType: {
      type: String
    },
    vehicleSeatingCapacity: {
      type: String
    },
    vehicleTransmission: {
      type: String
    },
    carFeature: {
      type: [String],
      default: []
    },
    carSafetyFeature: {
      type: [String],
      default: []
    },
    images: [
      {
        url: String,
        publicId: String,
        key: String,
        order: Number,
        isMain: {
          type: Boolean,
          default: false
        }
      }
    ],
    stockNumber: {
      type: String
    },
    driveType: {
      type: String
    },
    engineType: {
      type: String
    },
    engineCapacity: {
      type: String
    },
    interiorColor: {
      type: String
    },
    doors: {
      type: String
    },
    condition: {
      type: String
    },
    month: {
      type: String
    },
    location: {
      type: String
    },
    isFeatured: {
      type: Boolean,
      default: false
    },
    section: {
      type: String
    },
    offerType: {
      type: String,
      default: 'In Stock'
    },
    date: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

// Update the updatedAt field on save
vehicleSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Create indexes for frequently searched fields
vehicleSchema.index({ make: 1 });
vehicleSchema.index({ model: 1 });
vehicleSchema.index({ year: 1 });
vehicleSchema.index({ price: 1 });
vehicleSchema.index({ isFeatured: 1 });
vehicleSchema.index({ offerType: 1 });
vehicleSchema.index({ condition: 1 });

const Vehicle = mongoose.model<IVehicle>('CarListing', vehicleSchema);

export default Vehicle; 