'use client';

import React, { useEffect, ReactNode } from 'react';
import Image from 'next/image';
import { motion, useAnimation, useInView } from 'framer-motion';
import { CheckCircle, TrendingUp, Globe, Users, Award } from 'lucide-react';

interface AnimatedSectionProps {
  children: ReactNode;
  delay?: number;
}

const AnimatedSection = ({ children, delay = 0 }: AnimatedSectionProps) => {
  const controls = useAnimation();
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  
  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    }
  }, [controls, isInView]);
  
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: { 
          opacity: 1, 
          y: 0,
          transition: { 
            duration: 0.6, 
            ease: "easeOut",
            delay: delay
          }
        }
      }}
    >
      {children}
    </motion.div>
  );
};

interface StatProps {
  value: string;
  label: string;
  icon: ReactNode;
}

const Stat = ({ value, label, icon }: StatProps) => {
  const controls = useAnimation();
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true });
  
  useEffect(() => {
    if (isInView) {
      controls.start({
        scale: [0.8, 1.2, 1],
        opacity: [0, 1],
        transition: { duration: 0.5 }
      });
    }
  }, [controls, isInView]);
  
  return (
    <motion.div 
      ref={ref}
      animate={controls}
      className="flex flex-col items-center p-6 bg-white rounded-lg shadow-lg"
    >
      <div className="mb-3 text-red-600">
        {icon}
      </div>
      <div className="text-3xl font-bold mb-1">{value}</div>
      <div className="text-gray-600 text-sm text-center">{label}</div>
    </motion.div>
  );
};

interface ProcessStepProps {
  number: string;
  title: string;
  description: string;
}

const ProcessStep = ({ number, title, description }: ProcessStepProps) => (
  <motion.div 
    className="flex items-start group"
    whileHover={{ x: 5 }}
    transition={{ duration: 0.2 }}
  >
    <div className="flex-shrink-0 h-12 w-12 bg-gradient-to-br from-red-500 to-red-700 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg group-hover:shadow-xl transition-all duration-300">
      {number}
    </div>
    <div className="ml-6">
      <h3 className="font-semibold text-lg group-hover:text-red-600 transition-colors duration-300">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  </motion.div>
);

interface FeatureCardProps {
  title: string;
  description: string;
  icon: ReactNode;
}

const FeatureCard = ({ title, description, icon }: FeatureCardProps) => (
  <motion.div 
    className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300"
    whileHover={{ y: -5 }}
  >
    <div className="inline-block p-3 bg-red-50 rounded-lg mb-4 text-red-600">
      {icon}
    </div>
    <h3 className="font-semibold text-lg mb-2">{title}</h3>
    <p className="text-gray-600 text-sm">{description}</p>
  </motion.div>
);

export default function AboutPage() {
  return (
    <div className="bg-gray-50 mb-20">
      {/* Hero Section */}
      <div className="relative h-[40vh] md:h-[50vh] bg-gradient-to-r from-gray-900 to-black overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <Image 
            src="https://placehold.co/1920x1080/png?text=About+SS+Holdings" 
            alt="About SS Holdings"
            fill
            style={{ objectFit: 'cover' }}
            priority
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
        <div className="container mx-auto px-4 h-full flex items-center relative z-10">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">About SS Holdings</h1>
              <div className="w-20 h-1 bg-red-600 mb-6"></div>
              <p className="text-lg text-gray-200">
                Your trusted partner for premium car exports worldwide, connecting buyers with their dream vehicles across the globe.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Our Story */}
          <AnimatedSection>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
              <div>
                <h2 className="text-3xl font-bold mb-6 relative">
                  Our Story
                  <div className="absolute -bottom-3 left-0 w-16 h-1 bg-red-600"></div>
                </h2>
                <p className="text-gray-700 mb-4">
                  SS Holdings is a premier car export company, established with a vision to provide high-quality vehicles to customers worldwide. With years of experience in the automotive industry, we have built a reputation for reliability, integrity, and excellence in service.
                </p>
                <p className="text-gray-700">
                  Our journey began with a simple goal: to make the process of buying and exporting cars as seamless and transparent as possible. Today, we are proud to serve clients across the globe, offering a wide selection of vehicles that meet the highest standards of quality and performance.
                </p>
              </div>
              <div className="rounded-lg overflow-hidden shadow-xl">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                >
                  <Image
                    src="https://placehold.co/600x400/png?text=Our+Story"
                    alt="Our Story"
                    width={600}
                    height={400}
                    className="w-full h-auto"
                  />
                </motion.div>
              </div>
            </div>
          </AnimatedSection>
          
          {/* Our Mission */}
          <AnimatedSection delay={0.2}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
              <div className="order-2 md:order-1 rounded-lg overflow-hidden shadow-xl">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                >
                  <Image
                    src="https://placehold.co/600x400/png?text=Our+Mission"
                    alt="Our Mission"
                    width={600}
                    height={400}
                    className="w-full h-auto"
                  />
                </motion.div>
              </div>
              <div className="order-1 md:order-2">
                <h2 className="text-3xl font-bold mb-6 relative">
                  Our Mission
                  <div className="absolute -bottom-3 left-0 w-16 h-1 bg-red-600"></div>
                </h2>
                <p className="text-gray-700">
                  At SS Holdings, our mission is to connect car enthusiasts around the world with their dream vehicles. We strive to provide exceptional service, competitive pricing, and a hassle-free export process. Our commitment to customer satisfaction drives every aspect of our business, from vehicle selection to delivery logistics.
                </p>
                <ul className="mt-6 space-y-3">
                  <li className="flex items-center">
                    <CheckCircle className="text-green-500 mr-3 flex-shrink-0" size={20} />
                    <span>Quality vehicles at competitive prices</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="text-green-500 mr-3 flex-shrink-0" size={20} />
                    <span>Transparent and hassle-free process</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="text-green-500 mr-3 flex-shrink-0" size={20} />
                    <span>Personalized customer service</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="text-green-500 mr-3 flex-shrink-0" size={20} />
                    <span>Global shipping and logistics expertise</span>
                  </li>
                </ul>
              </div>
            </div>
          </AnimatedSection>
          
          {/* Stats */}
          <AnimatedSection delay={0.3}>
            <div className="mb-20">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">Our Impact</h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  We take pride in our achievements and the trust our clients place in us for their vehicle export needs.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <Stat value="10+" label="Years of Experience" icon={<Award size={28} />} />
                <Stat value="5,000+" label="Vehicles Exported" icon={<TrendingUp size={28} />} />
                <Stat value="120+" label="Countries Served" icon={<Globe size={28} />} />
                <Stat value="98%" label="Customer Satisfaction" icon={<Users size={28} />} />
              </div>
            </div>
          </AnimatedSection>
          
          {/* Why Choose Us */}
          <AnimatedSection delay={0.4}>
            <div className="mb-20">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">Why Choose Us</h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  We offer a comprehensive range of services designed to make your car export experience seamless and satisfying.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FeatureCard 
                  title="Extensive Inventory" 
                  description="We offer a diverse range of vehicles, from economy cars to luxury automobiles, ensuring that we can meet the specific needs and preferences of our clients."
                  icon={<svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>}
                />
                <FeatureCard 
                  title="Quality Assurance" 
                  description="Every vehicle in our inventory undergoes rigorous inspection to ensure that it meets our strict quality standards before being offered to our clients."
                  icon={<svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>}
                />
                <FeatureCard 
                  title="Global Shipping" 
                  description="We have established reliable shipping networks across the globe, allowing us to deliver vehicles to virtually any destination worldwide."
                  icon={<svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>}
                />
                <FeatureCard 
                  title="Customer Support" 
                  description="Our dedicated team of professionals is committed to providing exceptional customer service at every step of the process, from selection to delivery."
                  icon={<svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                  </svg>}
                />
              </div>
            </div>
          </AnimatedSection>
          
          {/* Our Process */}
          <AnimatedSection delay={0.5}>
            <div className="mb-20">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">Our Process</h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  We've streamlined the export process to make it as simple and efficient as possible for our clients.
                </p>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-8">
                <div className="space-y-8">
                  <ProcessStep 
                    number="1" 
                    title="Vehicle Selection" 
                    description="Browse our extensive inventory and select the vehicle that meets your requirements."
                  />
                  <ProcessStep 
                    number="2" 
                    title="Documentation" 
                    description="Our team handles all the necessary paperwork for the export process."
                  />
                  <ProcessStep 
                    number="3" 
                    title="Shipping" 
                    description="We arrange for the safe and timely shipping of your vehicle to your desired location."
                  />
                  <ProcessStep 
                    number="4" 
                    title="Delivery" 
                    description="Receive your vehicle at the agreed location, ready for use."
                  />
                </div>
              </div>
            </div>
          </AnimatedSection>
          
          {/* CTA */}
          <AnimatedSection delay={0.6}>
            <div className="bg-gradient-to-r from-gray-900 to-black rounded-xl overflow-hidden shadow-xl">
              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="p-8 md:p-12">
                  <h2 className="text-3xl font-bold text-white mb-4">Ready to Find Your Dream Car?</h2>
                  <p className="text-gray-300 mb-6">
                    Browse our inventory or contact us today to discuss your specific requirements.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <motion.a 
                      href="/cars" 
                      className="px-6 py-3 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Browse Inventory
                    </motion.a>
                    <motion.a 
                      href="/contact" 
                      className="px-6 py-3 border border-white text-white rounded-md hover:bg-white hover:text-black transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Contact Us
                    </motion.a>
                  </div>
                </div>
                <div className="hidden md:block relative">
                  <Image
                    src="https://placehold.co/600x400/png?text=Contact+Us"
                    alt="Contact Us"
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </div>
  );
} 