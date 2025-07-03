import { useState } from 'react';

interface ConfirmationOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
}

export const useConfirmation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [options, setOptions] = useState<ConfirmationOptions>({
    title: '',
    message: ''
  });
  const [onConfirmCallback, setOnConfirmCallback] = useState<(() => void | Promise<void>) | null>(null);

  const showConfirmation = (
    confirmationOptions: ConfirmationOptions,
    onConfirm: () => void | Promise<void>
  ) => {
    setOptions(confirmationOptions);
    setOnConfirmCallback(() => onConfirm);
    setIsOpen(true);
  };

  const hideConfirmation = () => {
    setIsOpen(false);
    setIsLoading(false);
    setOnConfirmCallback(null);
  };

  const handleConfirm = async () => {
    if (onConfirmCallback) {
      setIsLoading(true);
      try {
        await onConfirmCallback();
        hideConfirmation();
      } catch (error) {
        console.error('Confirmation action failed:', error);
        setIsLoading(false);
      }
    }
  };

  return {
    isOpen,
    isLoading,
    options,
    showConfirmation,
    hideConfirmation,
    handleConfirm
  };
}; 