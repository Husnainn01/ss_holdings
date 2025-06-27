import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: {
    template: '%s | SS Holdings',
    default: 'SS Holdings - Premium Car Export Worldwide'
  },
  description: 'SS Holdings specializes in exporting high-quality vehicles to customers worldwide.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} antialiased bg-[#F4E7E1]`}>
        <div className="flex min-h-screen flex-col">
          <Header />
          <div className="flex-1 w-full">
            {children}
          </div>
          <Footer />
        </div>
      </body>
    </html>
  );
}
