'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { motion, Variants } from "framer-motion";
import { ArrowRight } from "lucide-react";
// Removed language-related imports

interface HeroButton {
  text: string;
  href: string;
  variant: 'default' | 'outline';
}

interface HeroSectionProps {
  title?: string;
  subtitle?: string;
  imageUrl?: string;
  imageAlt?: string;
  buttons?: HeroButton[];
  height?: string;
}

export default function HeroSection({
  title,
  subtitle,
  imageUrl = "/hero-section/home-page.png",
  imageAlt = "Luxury car export",
  buttons,
  height = "h-[400px]"
}: HeroSectionProps) {
  const currentLanguage = 'en';
  
  // Use hardcoded values if title/subtitle not provided via props
  const heroTitle = title || "Premium Vehicle Export Worldwide";
  const heroSubtitle = subtitle || "Find and export your dream car with our trusted global shipping service";
  
  // Use hardcoded values for buttons if not provided via props
  const heroButtons = buttons || [
    {
      text: "Browse Our Cars",
      href: "/cars",
      variant: "default" as const
    },
    {
      text: "Request a Quote",
      href: "/contact",
      variant: "outline" as const
    }
  ];
  const [scrollY, setScrollY] = useState(0);
  const isMounted = useRef(true);
  
  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;
    
    const handleScroll = () => {
      if (isMounted.current) {
        setScrollY(window.scrollY);
      }
    };
    
    // Safe event listener
    window.addEventListener("scroll", handleScroll);
    
    return () => {
      isMounted.current = false;
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const heroVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <section className={`relative ${height} bg-[#1a1a1a] text-white overflow-hidden`}>
      {/* Background Image with Subtle Parallax */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-black to-transparent opacity-70 z-10"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-50 z-10"></div>
        <div 
          className="h-full w-full relative"
          style={{ transform: `translateY(${scrollY * 0.1}px)` }}
        >
          <Image
            src={imageUrl}
            alt={imageAlt}
            fill
            priority
            sizes="100vw"
            className="object-cover"
            quality={90}
          />
        </div>
      </div>
      
      {/* Content */}
      <div className="max-w-[1400px] mx-auto px-4 relative z-20 h-full flex flex-col justify-center">
        <motion.div 
          className="max-w-2xl"
          variants={heroVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants} className="mb-2 inline-block">
            <div className="flex items-center">
              <div className="h-1 w-8 bg-red-600 mr-3"></div>
              <span className="text-red-500 font-semibold uppercase text-xs tracking-wider">Premium Auto Export</span>
            </div>
          </motion.div>
          
          <motion.h1 
            variants={itemVariants}
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4"
          >
            {heroTitle}
          </motion.h1>
          
          <motion.p 
            variants={itemVariants}
            className="text-lg md:text-xl mb-6 text-gray-300"
          >
            {heroSubtitle}
          </motion.p>
          
          <motion.div 
            variants={itemVariants}
            className="flex flex-wrap gap-4"
          >
            {heroButtons.map((button, index) => (
              button.variant === 'default' ? (
                <motion.div 
                  key={index} 
                  whileHover={{ scale: 1.05 }} 
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    asChild
                    size="lg"
                    className="bg-red-600 hover:bg-red-700 text-white relative overflow-hidden group"
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
                    className="border-white text-white hover:bg-white hover:text-black transition-colors"
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
        </motion.div>
      </div>
    </section>
  );
} 