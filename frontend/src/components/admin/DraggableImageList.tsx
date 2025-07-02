import React, { useState } from 'react';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, useSortable, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { AlertCircle, Trash } from 'lucide-react';
import { updateImageUrl } from '@/lib/utils';

interface DraggableImageListProps {
  images: Array<{ id: string; url: string; isMain?: boolean }>;
  onReorder: (reorderedImages: Array<{ id: string; url: string; isMain?: boolean }>) => void;
  onRemove?: (index: number) => void;
  onSetMain?: (index: number) => void;
  title?: string;
}

interface SortableImageProps {
  image: { id: string; url: string; isMain?: boolean };
  index: number;
  failed: boolean;
  onRemove?: (index: number) => void;
  onSetMain?: (index: number) => void;
  isMain?: boolean;
}

// SortableImage component using @dnd-kit
function SortableImage({ image, index, failed, onRemove, onSetMain, isMain }: SortableImageProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: image.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : undefined,
  };
  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`relative rounded-md overflow-hidden group ${isDragging ? 'shadow-lg ring-2 ring-blue-500' : ''} ${failed ? 'border border-red-500' : ''}`}
    >
      {failed ? (
        <div className="h-32 w-full bg-gray-200 flex items-center justify-center">
          <div className="text-center p-2">
            <AlertCircle className="h-6 w-6 text-red-500 mx-auto mb-1" />
            <p className="text-xs text-gray-700">Image failed to load</p>
          </div>
        </div>
      ) : (
        <img
          src={updateImageUrl(image.url)}
          alt={`Vehicle image ${index + 1}`}
          className="h-32 w-full object-cover"
          onError={() => onRemove && onRemove(index)}
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
      {isMain && (
        <div className="absolute bottom-0 left-0 right-0 bg-green-500 text-white text-xs text-center py-1">
          Main Image
        </div>
      )}
      {/* Set as main button (not for the first image which is already main) */}
      {!isMain && onSetMain && (
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
  );
}

const DraggableImageList: React.FC<DraggableImageListProps> = ({
  images,
  onReorder,
  onRemove,
  onSetMain,
  title = 'Images',
}) => {
  // Setup sensors for pointer events
  const sensors = useSensors(useSensor(PointerSensor));

  // Handle drag end event
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = images.findIndex((img) => img.id === active.id);
    const newIndex = images.findIndex((img) => img.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;
    const reorderedImages = arrayMove(images, oldIndex, newIndex);
    // Update the main image if needed
    if (oldIndex === 0 || newIndex === 0) {
      const updatedImages = reorderedImages.map((img, idx) => ({ ...img, isMain: idx === 0 }));
      onReorder(updatedImages);
    } else {
      onReorder(reorderedImages);
    }
  };

  return (
    <div className="mt-4">
      {title && <h4 className="text-sm font-medium text-gray-700 mb-2">{title}</h4>}
      {images.length === 0 ? (
        <p className="text-gray-500 text-sm">No images available</p>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={images.map((img) => img.id)} strategy={horizontalListSortingStrategy}>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {images.map((image, index) => (
                <SortableImage
                  key={image.id}
                  image={image}
                  index={index}
                  failed={false}
                  onRemove={(i: number) => {
                    if (onRemove) onRemove(i);
                  }}
                  onSetMain={onSetMain}
                  isMain={image.isMain}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
};

export default DraggableImageList; 