import mongoose, { Document, Schema } from 'mongoose';

export interface ISftpUsage extends Document {
  date: Date;
  uploadsCount: number;
  totalSizeBytes: number;
  totalSizeMB: number;
  fileTypes: {
    images: number;
    documents: number;
    others: number;
  };
  operationType: 'upload' | 'delete' | 'storage_check';
  filePath?: string;
  fileName?: string;
  fileSize?: number;
  createdAt: Date;
  updatedAt: Date;
}

const sftpUsageSchema = new Schema<ISftpUsage>({
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  uploadsCount: {
    type: Number,
    default: 0
  },
  totalSizeBytes: {
    type: Number,
    default: 0
  },
  totalSizeMB: {
    type: Number,
    default: 0
  },
  fileTypes: {
    images: { type: Number, default: 0 },
    documents: { type: Number, default: 0 },
    others: { type: Number, default: 0 }
  },
  operationType: {
    type: String,
    enum: ['upload', 'delete', 'storage_check'],
    required: true
  },
  filePath: String,
  fileName: String,
  fileSize: Number
}, {
  timestamps: true
});

// Index for efficient date-based queries
sftpUsageSchema.index({ date: 1 });
sftpUsageSchema.index({ operationType: 1 });

const SftpUsage = mongoose.model<ISftpUsage>('SftpUsage', sftpUsageSchema);

export default SftpUsage; 