'use client';

import { useEffect } from 'react';
import { Poppins } from "next/font/google";
import "../globals.css";
import { cleanCachedImageData } from '@/lib/utils';

// Use Poppins for a more modern, professional look
const poppins = Poppins({ 
  weight: ['300', '400', '500', '600', '700'],
  subsets: ["latin"],
  variable: "--font-poppins" 
});

// This is a completely separate root layout for the admin section
// It does NOT inherit from the main site layout (app/layout.tsx)
export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Clean any cached image data with invalid paths when the layout mounts
  useEffect(() => {
    cleanCachedImageData();
  }, []);

  return (
    <html lang="en" className="h-full">
      <body className={`${poppins.variable} font-sans antialiased h-full bg-slate-50`}>
        {/* Admin content without any main site navigation */}
        {children}
      </body>
    </html>
  );
} 