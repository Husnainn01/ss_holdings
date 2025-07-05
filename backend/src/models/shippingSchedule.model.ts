import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IShippingSchedule extends Document {
  fromPort: string;
  fromCountry: string;
  fromFlag: string;
  toPort: string;
  toCountry: string;
  toFlag: string;
  carrier: string;
  transitTime: string;
  frequency: string;
  nextDeparture: Date;
  estimatedArrival: Date;
  cutOffTime: Date;
  status: 'active' | 'delayed' | 'cancelled';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdBy: mongoose.Types.ObjectId;
  updatedBy: mongoose.Types.ObjectId;
}

const shippingScheduleSchema: Schema = new Schema({
  fromPort: {
    type: String,
    required: [true, 'From port is required'],
    trim: true,
    maxlength: [100, 'From port name cannot exceed 100 characters']
  },
  fromCountry: {
    type: String,
    required: [true, 'From country is required'],
    trim: true,
    maxlength: [100, 'From country name cannot exceed 100 characters']
  },
  fromFlag: {
    type: String,
    required: [true, 'From flag is required'],
    trim: true,
    maxlength: [10, 'From flag cannot exceed 10 characters']
  },
  toPort: {
    type: String,
    required: [true, 'To port is required'],
    trim: true,
    maxlength: [100, 'To port name cannot exceed 100 characters']
  },
  toCountry: {
    type: String,
    required: [true, 'To country is required'],
    trim: true,
    maxlength: [100, 'To country name cannot exceed 100 characters']
  },
  toFlag: {
    type: String,
    required: [true, 'To flag is required'],
    trim: true,
    maxlength: [10, 'To flag cannot exceed 10 characters']
  },
  carrier: {
    type: String,
    required: [true, 'Carrier is required'],
    trim: true,
    maxlength: [100, 'Carrier name cannot exceed 100 characters']
  },
  transitTime: {
    type: String,
    required: [true, 'Transit time is required'],
    trim: true,
    maxlength: [50, 'Transit time cannot exceed 50 characters']
  },
  frequency: {
    type: String,
    required: [true, 'Frequency is required'],
    enum: ['Daily', 'Weekly', 'Bi-weekly', 'Monthly'],
    trim: true
  },
  nextDeparture: {
    type: Date,
    required: [true, 'Next departure date is required']
  },
  estimatedArrival: {
    type: Date,
    required: [true, 'Estimated arrival date is required']
  },
  cutOffTime: {
    type: Date,
    required: [true, 'Cut-off time is required']
  },
  status: {
    type: String,
    enum: ['active', 'delayed', 'cancelled'],
    default: 'active'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true,
  collection: 'shippingSchedules'
});

// Indexes for better query performance
shippingScheduleSchema.index({ fromPort: 1, toPort: 1 });
shippingScheduleSchema.index({ fromCountry: 1, toCountry: 1 });
shippingScheduleSchema.index({ status: 1, isActive: 1 });
shippingScheduleSchema.index({ nextDeparture: 1 });
shippingScheduleSchema.index({ carrier: 1 });

// Virtual for route name
shippingScheduleSchema.virtual('routeName').get(function() {
  return `${this.fromPort} to ${this.toPort}`;
});

// Validation to ensure cutOffTime is before nextDeparture
shippingScheduleSchema.pre('save', function(next) {
  if (this.cutOffTime >= this.nextDeparture) {
    const error = new Error('Cut-off time must be before departure time');
    return next(error);
  }
  
  if (this.nextDeparture >= this.estimatedArrival) {
    const error = new Error('Departure time must be before estimated arrival time');
    return next(error);
  }
  
  next();
});

// Method to check if schedule is expired
shippingScheduleSchema.methods.isExpired = function() {
  return this.nextDeparture < new Date();
};

// Static method to find active schedules
shippingScheduleSchema.statics.findActive = function() {
  return this.find({ isActive: true, status: 'active' });
};

// Static method to find schedules by route
shippingScheduleSchema.statics.findByRoute = function(fromPort: string, toPort: string) {
  return this.find({ fromPort, toPort, isActive: true });
};

const ShippingSchedule: Model<IShippingSchedule> = mongoose.model<IShippingSchedule>('ShippingSchedule', shippingScheduleSchema);

export default ShippingSchedule; 