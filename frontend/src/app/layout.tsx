import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: {
    template: '%s | SS Holdings',
    default: 'SS Holdings - Premium Car Export Worldwide'
  },
  description: 'SS Holdings specializes in exporting high-quality vehicles to customers worldwide.',
};

// This is a minimal root layout that doesn't include Header or Footer
// The actual site layout is in (main)/layout.tsx
// Admin routes have their own root layout in /admin/layout.tsx
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} antialiased bg-[#F4E7E1]`}>
        {children}
      </body>
    </html>
  );
}
