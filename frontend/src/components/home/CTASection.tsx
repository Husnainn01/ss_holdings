'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { PhoneCall, Mail, ArrowRight, Car, CheckCircle } from 'lucide-react';

interface CTAButton {
  text: string;
  href: string;
  variant: 'default' | 'outline';
}

interface CTASectionProps {
  title?: string;
  description?: string;
  buttons: CTAButton[];
  bgColor?: string;
  textColor?: string;
}

const CTAFeatureItem = ({ icon, text }: { icon: React.ReactNode, text: string }) => (
  <motion.div 
    className="flex items-center"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
  >
    <div className="flex-shrink-0 bg-white/10 rounded-full p-2 mr-3">
      {icon}
    </div>
    <p className="text-sm">{text}</p>
  </motion.div>
);

export default function CTASection({
  title = "Ready to Export Your Dream Car?",
  description = "Contact us today to discuss your specific requirements and discover our current inventory of premium vehicles available for export.",
  buttons,
  bgColor = "bg-black",
  textColor = "text-white"
}: CTASectionProps) {
  // Parallax effect for background elements
  const [scrollY, setScrollY] = useState(0);
  
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className={`py-24 ${bgColor} ${textColor} relative overflow-hidden border-0 mb-0`}>
      {/* Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-64 h-64 rounded-full bg-gradient-to-r from-blue-600/20 to-purple-600/20 blur-3xl" 
             style={{ transform: `translate(${scrollY * 0.05}px, ${scrollY * 0.02}px)` }} />
        <div className="absolute bottom-0 right-0 w-72 h-72 rounded-full bg-gradient-to-r from-red-600/10 to-orange-600/10 blur-3xl" 
             style={{ transform: `translate(${scrollY * -0.05}px, ${scrollY * -0.02}px)` }} />
        <div className="absolute top-1/2 -translate-y-1/2 right-[5%] w-40 h-40 rounded-full bg-gradient-to-r from-green-600/10 to-teal-600/10 blur-2xl" 
             style={{ transform: `translateY(calc(-50% + ${scrollY * 0.03}px))` }} />
      </div>
      
      {/* Content Layer */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Side: Text Content */}
          <div className="max-w-xl">
            <motion.div 
              className="mb-2 inline-block"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="flex items-center">
                <div className="h-1 w-8 bg-red-500 mr-3"></div>
                <span className="text-red-500 font-semibold uppercase text-sm tracking-wider">Get Started Today</span>
              </div>
            </motion.div>
            
            <motion.h2 
              className="text-4xl md:text-5xl font-bold mb-6 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              {title}
            </motion.h2>
            
            <motion.p 
              className="text-lg mb-8 opacity-90"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              {description}
            </motion.p>
            
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <CTAFeatureItem 
                icon={<CheckCircle className="h-5 w-5 text-green-500" />} 
                text="Simple Export Process" 
              />
              <CTAFeatureItem 
                icon={<CheckCircle className="h-5 w-5 text-green-500" />} 
                text="Worldwide Shipping" 
              />
              <CTAFeatureItem 
                icon={<CheckCircle className="h-5 w-5 text-green-500" />} 
                text="Quality Guaranteed" 
              />
              <CTAFeatureItem 
                icon={<CheckCircle className="h-5 w-5 text-green-500" />} 
                text="Full Documentation" 
              />
            </motion.div>
            
            <motion.div 
              className="flex flex-wrap gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
            >
              {buttons.map((button, index) => (
                button.variant === 'default' ? (
                  <motion.div 
                    key={index} 
                    whileHover={{ scale: 1.05 }} 
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      asChild
                      size="lg"
                      className="bg-red-600 hover:bg-red-700 text-white border-0 relative overflow-hidden group"
                    >
                      <Link href={button.href} className="flex items-center">
                        {button.text}
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                        <span className="absolute inset-0 h-full w-0 bg-white/20 transition-all duration-300 group-hover:w-full"></span>
                      </Link>
                    </Button>
                  </motion.div>
                ) : (
                  <motion.div 
                    key={index} 
                    whileHover={{ scale: 1.05 }} 
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      asChild
                      variant="outline"
                      size="lg"
                      className="border-white text-white hover:bg-white hover:text-black relative overflow-hidden"
                    >
                      <Link href={button.href} className="flex items-center">
                        {button.text}
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                      </Link>
                    </Button>
                  </motion.div>
                )
              ))}
            </motion.div>
            
            <motion.div 
              className="mt-10 flex flex-col sm:flex-row items-center gap-6 text-sm opacity-80"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.5 }}
            >
              <div className="flex items-center">
                <PhoneCall className="h-4 w-4 mr-2" />
                <span>+1 (800) 123-4567</span>
              </div>
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-2" />
                <span>contact@ssholdings.com</span>
              </div>
            </motion.div>
          </div>
          
          {/* Right Side: Image or Video */}
          <motion.div 
            className="hidden md:block"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-2xl blur-lg"></div>
              <div className="relative bg-gray-800 rounded-xl overflow-hidden aspect-[4/3] shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/60"></div>
                <Image
                  src="https://placehold.co/800x600/png?text=Premium+Export+Cars"
                  alt="Premium Export Cars"
                  className="object-cover"
                  width={800}
                  height={600}
                  style={{ transform: `translateY(${scrollY * 0.05}px)` }}
                />
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="bg-black/70 backdrop-blur-sm rounded-lg p-4">
                    <div className="flex items-center text-xs font-medium text-white">
                      <Car className="h-4 w-4 mr-1 text-red-500" />
                      <span>Premium vehicles ready for export</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Bottom Wave */}
      <div className="absolute bottom-[-2px] left-0 right-0 z-10">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 100" className="w-full h-auto fill-white" style={{ display: 'block', marginBottom: '-1px' }}>
          <path d="M0,96L80,90.7C160,85,320,75,480,74.7C640,75,800,85,960,85.3C1120,85,1280,75,1360,69.3L1440,64L1440,100L1360,100C1280,100,1120,100,960,100C800,100,640,100,480,100C320,100,160,100,80,100L0,100Z"></path>
        </svg>
      </div>
    </section>
  );
} 