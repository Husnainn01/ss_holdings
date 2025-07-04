'use client';

import { useEffect } from 'react';
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { cleanCachedImageData } from '@/lib/utils';

// This layout applies to all routes in the (main) group
export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Clean any cached image data with invalid paths when the layout mounts
  useEffect(() => {
    cleanCachedImageData();
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-[#F4E7E1]">
      <Header />
      <div className="flex-1 w-full">
        {children}
      </div>
      <Footer />
    </div>
  );
} 