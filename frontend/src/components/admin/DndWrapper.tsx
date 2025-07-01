import React, { useEffect, useState } from 'react';
import { DragDropContext, Droppable, DroppableProps } from 'react-beautiful-dnd';

// This component is a workaround for the issue with react-beautiful-dnd and React StrictMode
// It helps prevent the "Unable to find draggable with id" error
export const StrictModeDroppable = ({ children, ...props }: DroppableProps) => {
  const [enabled, setEnabled] = useState(false);
  
  useEffect(() => {
    // We need to delay enabling the Droppable until after the initial render in StrictMode
    const animation = requestAnimationFrame(() => setEnabled(true));
    
    return () => {
      cancelAnimationFrame(animation);
      setEnabled(false);
    };
  }, []);
  
  if (!enabled) {
    return null;
  }
  
  // Ensure isDropDisabled is a boolean
  const safeProps = {
    ...props,
    isDropDisabled: props.isDropDisabled === true
  };
  
  return <Droppable {...safeProps}>{children}</Droppable>;
};

export default StrictModeDroppable; 