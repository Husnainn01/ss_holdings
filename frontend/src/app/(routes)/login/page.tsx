'use client'
import { ComingSoon } from '@/components/ui/coming-soon';

export default function LoginPage() {
  const handleNotifyClick = () => {
    // You can implement email notification signup here
    alert('Thank you for your interest! We\'ll notify you when user accounts become available.');
  };

  return (
    <ComingSoon 
      title="User Login"
      description="User account login is coming soon! We're working hard to bring you a seamless login experience for browsing and managing your vehicle purchases."
      showNotifyButton={true}
      onNotifyClick={handleNotifyClick}
    />
  );
} 