import React, { useState, useRef } from 'react';
import { Upload, X } from 'lucide-react';

interface DropZoneProps {
  onFilesAdded: (files: File[]) => void;
  disabled?: boolean;
  maxFiles?: number;
  accept?: string;
  multiple?: boolean;
}

const DropZone: React.FC<DropZoneProps> = ({
  onFilesAdded,
  disabled = false,
  maxFiles = 10,
  accept = 'image/*',
  multiple = true
}) => {
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) setIsDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer) {
      e.dataTransfer.dropEffect = 'copy';
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (disabled) return;
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      // Convert FileList to Array and filter by accepted types
      const droppedFiles = Array.from(e.dataTransfer.files)
        .filter(file => {
          // If accept is set, check if the file type matches
          if (accept) {
            const fileType = file.type;
            const acceptTypes = accept.split(',').map(type => type.trim());
            
            // Check if any accept type matches the file type
            return acceptTypes.some(acceptType => {
              // Handle wildcards like image/*
              if (acceptType.endsWith('/*')) {
                const category = acceptType.split('/')[0];
                return fileType.startsWith(`${category}/`);
              }
              return acceptType === fileType;
            });
          }
          return true;
        })
        .slice(0, maxFiles);
      
      onFilesAdded(droppedFiles);
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = Array.from(e.target.files).slice(0, maxFiles);
      onFilesAdded(selectedFiles);
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
        isDragActive 
          ? 'border-blue-400 bg-blue-50' 
          : disabled 
            ? 'border-gray-200 bg-gray-50 cursor-not-allowed' 
            : 'border-gray-300 hover:border-blue-300 hover:bg-blue-50 cursor-pointer'
      }`}
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => !disabled && fileInputRef.current?.click()}
    >
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept={accept}
        multiple={multiple}
        onChange={handleFileInputChange}
        disabled={disabled}
      />
      
      <div className="flex flex-col items-center justify-center space-y-2">
        {isDragActive ? (
          <>
            <div className="p-3 rounded-full bg-blue-100">
              <Upload className="h-6 w-6 text-blue-500" />
            </div>
            <p className="text-sm font-medium text-blue-500">Drop files to upload</p>
          </>
        ) : (
          <>
            <div className="p-3 rounded-full bg-gray-100">
              <Upload className={`h-6 w-6 ${disabled ? 'text-gray-400' : 'text-gray-500'}`} />
            </div>
            <p className={`text-sm font-medium ${disabled ? 'text-gray-400' : 'text-gray-500'}`}>
              {disabled ? 'Upload disabled' : 'Drag files here or click to upload'}
            </p>
          </>
        )}
        <p className={`text-xs ${disabled ? 'text-gray-400' : 'text-gray-400'}`}>
          {multiple ? `Up to ${maxFiles} files` : 'One file only'} • {accept.replace('*', 'all')}
        </p>
      </div>
    </div>
  );
};

export default DropZone; 