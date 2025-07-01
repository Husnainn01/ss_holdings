import React from 'react';
import { Loader2 } from 'lucide-react';

interface ImageProcessingIndicatorProps {
  isProcessing: boolean;
}

const ImageProcessingIndicator: React.FC<ImageProcessingIndicatorProps> = ({ isProcessing }) => {
  if (!isProcessing) return null;

  return (
    <div className="flex items-center justify-center p-4 bg-blue-50 border border-blue-200 rounded-md mb-4">
      <Loader2 className="h-5 w-5 text-blue-500 animate-spin mr-2" />
      <span className="text-sm text-blue-700">
        Processing images... This may take a moment for large files.
      </span>
    </div>
  );
};

export default ImageProcessingIndicator; 