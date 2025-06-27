'use client';
import React, { useState } from 'react';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

interface FeatureProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface WhyChooseUsProps {
  title?: string;
  subtitle?: string;
  features: FeatureProps[];
}

interface StatCounterProps {
  value: number;
  label: string;
  duration?: number;
}

const StatCounter: React.FC<StatCounterProps> = ({ value, label, duration = 2 }) => {
  const [count, setCount] = useState(0);
  
  React.useEffect(() => {
    if (count < value) {
      const interval = setInterval(() => {
        setCount(prev => {
          const newValue = prev + Math.ceil(value / (duration * 10));
          return newValue > value ? value : newValue;
        });
      }, 100);
      
      return () => clearInterval(interval);
    }
  }, [count, value, duration]);
  
  return (
    <div className="text-center p-4">
      <div className="text-3xl font-bold text-[#1a3d50] mb-2">{count.toLocaleString()}+</div>
      <div className="text-sm text-gray-600">{label}</div>
    </div>
  );
};

const Feature: React.FC<FeatureProps> = ({ icon, title, description }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.div
      className={`flex items-start p-5 transition-all ${isHovered ? 'bg-white shadow-md' : 'hover:bg-white/70'} rounded-lg border border-transparent hover:border-gray-200`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <div className={`flex-shrink-0 mr-4 transition-all ${isHovered ? 'text-[#ff4545]' : 'text-[#4a89dc]'}`}>
        {icon}
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-2 text-[#1a3d50]">{title}</h3>
        <p className="text-gray-600 text-sm leading-relaxed">
          {description}
        </p>
        
        {isHovered && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-3"
          >
            <Button variant="link" className="p-0 text-[#4a89dc] flex items-center text-sm">
              Learn more <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default function WhyChooseUs({
  title = "Why Choose SS Holdings",
  subtitle = "We provide comprehensive export services with a focus on quality, reliability, and customer satisfaction.",
  features
}: WhyChooseUsProps) {
  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: '60px' }}
            className="h-1 bg-[#4a89dc] mx-auto mb-4"
          ></motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-3xl font-bold text-[#1a3d50] mb-3"
          >
            {title}
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-gray-600 max-w-xl mx-auto mb-10"
          >
            {subtitle}
          </motion.p>
          
          {/* Stats Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12 bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <StatCounter value={15000} label="Vehicles Exported" />
            <StatCounter value={120} label="Destination Countries" />
            <StatCounter value={98} label="Customer Satisfaction %" />
            <StatCounter value={10} label="Years in Business" />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {features.map((feature, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <Feature 
                icon={feature.icon} 
                title={feature.title} 
                description={feature.description} 
              />
            </motion.div>
          ))}
        </div>
        
        <motion.div 
          className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 mt-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-center group">
              <CheckCircle className="h-5 w-5 mr-3 text-[#4a89dc] group-hover:text-[#ff4545] transition-colors" />
              <span className="text-sm group-hover:text-[#1a3d50] transition-colors">100% Customer Satisfaction</span>
            </div>
            <div className="flex items-center group">
              <CheckCircle className="h-5 w-5 mr-3 text-[#4a89dc] group-hover:text-[#ff4545] transition-colors" />
              <span className="text-sm group-hover:text-[#1a3d50] transition-colors">Global Shipping Network</span>
            </div>
            <div className="flex items-center group">
              <CheckCircle className="h-5 w-5 mr-3 text-[#4a89dc] group-hover:text-[#ff4545] transition-colors" />
              <span className="text-sm group-hover:text-[#1a3d50] transition-colors">Competitive Pricing</span>
            </div>
            <div className="flex items-center group">
              <CheckCircle className="h-5 w-5 mr-3 text-[#4a89dc] group-hover:text-[#ff4545] transition-colors" />
              <span className="text-sm group-hover:text-[#1a3d50] transition-colors">24/7 Customer Support</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
} 