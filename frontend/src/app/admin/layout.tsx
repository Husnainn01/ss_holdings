import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: {
    template: '%s | Admin - SS Holdings',
    default: 'Admin Dashboard - SS Holdings'
  },
  description: 'Admin panel for SS Holdings car export management.',
};

// This is a completely separate root layout for the admin section
// It does NOT inherit from the main site layout (app/layout.tsx)
export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} antialiased h-full bg-gray-100`}>
        {/* Admin content without any main site navigation */}
        {children}
      </body>
    </html>
  );
} 