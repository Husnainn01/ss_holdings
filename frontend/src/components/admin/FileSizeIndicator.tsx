import React from 'react';
import { FileText } from 'lucide-react';

interface FileSizeIndicatorProps {
  originalSize: number;
  compressedSize: number;
  fileName: string;
}

const FileSizeIndicator: React.FC<FileSizeIndicatorProps> = ({
  originalSize,
  compressedSize,
  fileName
}) => {
  // Calculate size reduction percentage
  const reductionPercent = originalSize > 0 
    ? Math.round((1 - (compressedSize / originalSize)) * 100) 
    : 0;
  
  // Format file sizes
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };
  
  // Determine if compression was significant
  const isSignificantReduction = reductionPercent > 10;
  
  return (
    <div className="flex items-center p-2 bg-gray-50 border border-gray-200 rounded-md text-xs mb-2">
      <FileText className="h-4 w-4 text-gray-500 mr-2" />
      <div className="flex-1">
        <div className="font-medium text-gray-700 truncate" title={fileName}>
          {fileName.length > 20 ? `${fileName.substring(0, 20)}...` : fileName}
        </div>
        <div className="flex items-center mt-1">
          <span className="text-gray-500">
            Original: {formatFileSize(originalSize)}
          </span>
          <span className="mx-2 text-gray-400">→</span>
          <span className={`${isSignificantReduction ? 'text-green-600 font-medium' : 'text-gray-500'}`}>
            Compressed: {formatFileSize(compressedSize)}
          </span>
          
          {isSignificantReduction && (
            <span className="ml-2 bg-green-100 text-green-800 px-1.5 py-0.5 rounded-full text-xs">
              -{reductionPercent}%
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default FileSizeIndicator; 