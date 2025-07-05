'use client'
import { ComingSoon } from '@/components/ui/coming-soon';

export default function RegisterPage() {
  const handleNotifyClick = () => {
    // You can implement email notification signup here
    alert('Thank you for your interest! We\'ll notify you when user registration becomes available.');
  };

  return (
    <ComingSoon 
      title="User Registration"
      description="User account registration is coming soon! Create an account to save your favorite vehicles, track inquiries, and get personalized recommendations."
      showNotifyButton={true}
      onNotifyClick={handleNotifyClick}
    />
  );
} 