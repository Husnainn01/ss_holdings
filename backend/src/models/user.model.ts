import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

// Define available permissions
export const PERMISSIONS = {
  // Vehicle permissions
  VIEW_VEHICLES: 'view_vehicles',
  CREATE_VEHICLE: 'create_vehicle',
  EDIT_VEHICLE: 'edit_vehicle',
  DELETE_VEHICLE: 'delete_vehicle',
  FEATURE_VEHICLE: 'feature_vehicle',
  
  // User permissions
  VIEW_USERS: 'view_users',
  CREATE_USER: 'create_user',
  EDIT_USER: 'edit_user',
  DELETE_USER: 'delete_user',
  
  // Dashboard permissions
  VIEW_DASHBOARD: 'view_dashboard',
  VIEW_STATISTICS: 'view_statistics',
  
  // Settings permissions
  MANAGE_SETTINGS: 'manage_settings'
};

// Define roles with their permissions
export const ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  EDITOR: 'editor',
  USER: 'user'
};

// Define default permissions for each role
export const ROLE_PERMISSIONS = {
  [ROLES.ADMIN]: Object.values(PERMISSIONS), // Admin has all permissions
  [ROLES.MANAGER]: [
    PERMISSIONS.VIEW_VEHICLES,
    PERMISSIONS.CREATE_VEHICLE,
    PERMISSIONS.EDIT_VEHICLE,
    PERMISSIONS.FEATURE_VEHICLE,
    PERMISSIONS.VIEW_USERS,
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.VIEW_STATISTICS
  ],
  [ROLES.EDITOR]: [
    PERMISSIONS.VIEW_VEHICLES,
    PERMISSIONS.CREATE_VEHICLE,
    PERMISSIONS.EDIT_VEHICLE,
    PERMISSIONS.VIEW_DASHBOARD
  ],
  [ROLES.USER]: [
    PERMISSIONS.VIEW_VEHICLES
  ]
};

export interface IUser {
  name: string;
  email: string;
  password: string;
  role: string;
  permissions: string[];
  isActive: boolean;
  lastLogin?: Date;
  _id?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const userSchema = new Schema<IUser & { comparePassword: (candidatePassword: string) => Promise<boolean> }>(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true
    },
    password: {
      type: String,
      required: true,
      minlength: 6
    },
    role: {
      type: String,
      enum: Object.values(ROLES),
      default: ROLES.USER
    },
    permissions: {
      type: [String],
      default: function(this: IUser) {
        return ROLE_PERMISSIONS[this.role] || [];
      }
    },
    isActive: {
      type: Boolean,
      default: true
    },
    lastLogin: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

// Hash password before saving
userSchema.pre('save', async function(next) {
  const user = this;
  
  // Update permissions based on role if role is changed
  if (user.isModified('role')) {
    user.permissions = ROLE_PERMISSIONS[user.role] || [];
  }
  
  if (!user.isModified('password')) {
    return next();
  }
  
  try {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Create index for email for faster lookups
userSchema.index({ email: 1 });

const User = mongoose.model<IUser & { comparePassword: (candidatePassword: string) => Promise<boolean> }>('User', userSchema);

export default User; 