import React, { useState } from 'react';
import { DragDropContext, Draggable } from 'react-beautiful-dnd';
import { AlertCircle, Trash } from 'lucide-react';
import StrictModeDroppable from './DndWrapper';
import { updateImageUrl } from '@/lib/utils';

interface DraggableImageListProps {
  images: Array<{ id: string; url: string; isMain?: boolean }>;
  onReorder: (reorderedImages: Array<{ id: string; url: string; isMain?: boolean }>) => void;
  onRemove?: (index: number) => void;
  onSetMain?: (index: number) => void;
  title?: string;
}

const DraggableImageList: React.FC<DraggableImageListProps> = ({
  images,
  onReorder,
  onRemove,
  onSetMain,
  title = 'Images'
}) => {
  // Track images that failed to load
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  const handleDragEnd = (result: any) => {
    // Dropped outside the list
    if (!result.destination) {
      return;
    }

    // Reorder the images
    const reorderedImages = Array.from(images);
    const [removed] = reorderedImages.splice(result.source.index, 1);
    reorderedImages.splice(result.destination.index, 0, removed);

    // Update the main image if needed
    if (result.source.index === 0 || result.destination.index === 0) {
      // Mark the first image as main
      const updatedImages = reorderedImages.map((img, idx) => ({
        ...img,
        isMain: idx === 0
      }));
      onReorder(updatedImages);
    } else {
      onReorder(reorderedImages);
    }
  };

  const handleImageError = (id: string) => {
    console.error(`Image failed to load: ${id}`);
    setFailedImages(prev => ({ ...prev, [id]: true }));
  };

  return (
    <div className="mt-4">
      {title && <h4 className="text-sm font-medium text-gray-700 mb-2">{title}</h4>}
      
      {images.length === 0 ? (
        <p className="text-gray-500 text-sm">No images available</p>
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <StrictModeDroppable droppableId="image-list" direction="horizontal">
            {(provided) => (
              <div 
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {images.map((image, index) => (
                  <Draggable key={image.id} draggableId={image.id} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={`relative rounded-md overflow-hidden group ${
                          snapshot.isDragging ? 'shadow-lg ring-2 ring-blue-500' : ''
                        } ${failedImages[image.id] ? 'border border-red-500' : ''}`}
                        style={{
                          ...provided.draggableProps.style,
                        }}
                      >
                        {failedImages[image.id] ? (
                          <div className="h-32 w-full bg-gray-200 flex items-center justify-center">
                            <div className="text-center p-2">
                              <AlertCircle className="h-6 w-6 text-red-500 mx-auto mb-1" />
                              <p className="text-xs text-gray-700">Image failed to load</p>
                            </div>
                          </div>
                        ) : (
                          <img 
                            src={updateImageUrl(image.url)} 
                            alt={`Image ${index}`} 
                            className="h-32 w-full object-cover"
                            onError={() => handleImageError(image.id)}
                          />
                        )}
                        
                        {/* Controls */}
                        <div className="absolute top-0 right-0 p-1 flex gap-1">
                          {onRemove && (
                            <button
                              type="button"
                              onClick={() => onRemove(index)}
                              className="bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Trash className="h-4 w-4" />
                            </button>
                          )}
                        </div>

                        {/* Main image indicator */}
                        {image.isMain && (
                          <div className="absolute bottom-0 left-0 right-0 bg-green-500 text-white text-xs text-center py-1">
                            Main Image
                          </div>
                        )}

                        {/* Set as main button (not for the first image which is already main) */}
                        {!image.isMain && onSetMain && (
                          <button
                            type="button"
                            onClick={() => onSetMain(index)}
                            className="absolute bottom-0 left-0 right-0 bg-gray-700 bg-opacity-70 text-white text-xs text-center py-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            Set as Main
                          </button>
                        )}
                        
                        {/* Drag indicator */}
                        <div className="absolute top-1 left-1 bg-gray-800 bg-opacity-50 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                          Drag to reorder
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </StrictModeDroppable>
        </DragDropContext>
      )}
    </div>
  );
};

export default DraggableImageList; 