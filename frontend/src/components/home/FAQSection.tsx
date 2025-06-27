'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight, Search, PlusCircle, MinusCircle } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSectionProps {
  title?: string;
  subtitle?: string;
  faqs: FAQItem[];
  viewAllLink?: string;
  viewAllText?: string;
}

const FAQAccordionItem = ({ 
  faq, 
  index, 
  isExpanded, 
  toggleItem 
}: { 
  faq: FAQItem; 
  index: number;
  isExpanded: boolean;
  toggleItem: () => void;
}) => {
  return (
    <motion.div 
      className={`border border-gray-200 rounded-lg overflow-hidden mb-4 ${isExpanded ? 'shadow-lg bg-white' : 'bg-white/50 hover:bg-white hover:shadow-md'}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <button
        className="w-full p-6 text-left flex justify-between items-center focus:outline-none"
        onClick={toggleItem}
      >
        <h3 className="text-xl font-semibold text-gray-800 pr-8">{faq.question}</h3>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className={`flex-shrink-0 p-1 rounded-full ${isExpanded ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-500'}`}
        >
          <ChevronDown className="h-5 w-5" />
        </motion.div>
      </button>
      
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="px-6 pb-6 border-t border-gray-100 pt-4">
              <p className="text-gray-600 leading-relaxed">
                {faq.answer}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default function FAQSection({
  title = "Frequently Asked Questions",
  subtitle = "Find answers to common questions about our car export services.",
  faqs,
  viewAllLink = "/faq",
  viewAllText = "View All FAQs"
}: FAQSectionProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandAll, setExpandAll] = useState(false);
  const [expandedItems, setExpandedItems] = useState<number[]>([]);
  const initialRender = useRef(true);
  
  const filteredFaqs = faqs.filter(faq => {
    if (!searchTerm) return true;
    const searchTermLower = searchTerm.toLowerCase();
    return (
      faq.question.toLowerCase().includes(searchTermLower) ||
      faq.answer.toLowerCase().includes(searchTermLower)
    );
  });

  // Toggle individual FAQ item
  const toggleItem = (index: number) => {
    setExpandedItems(prev => {
      if (prev.includes(index)) {
        return prev.filter(i => i !== index);
      } else {
        return [...prev, index];
      }
    });
  };

  // Handle expand all / collapse all
  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
      return;
    }
    
    if (expandAll) {
      setExpandedItems(Array.from({ length: filteredFaqs.length }, (_, i) => i));
    } else {
      setExpandedItems([]);
    }
  }, [expandAll, filteredFaqs.length]);
  
  // Reset expanded items when search changes
  useEffect(() => {
    if (searchTerm && !initialRender.current) {
      setExpandedItems([]);
      setExpandAll(false);
    }
  }, [searchTerm]);
  
  return (
    <section className="pt-20 pb-0 bg-gradient-to-b from-white to-gray-50 border-0 relative z-10 mb-20">
      <div className="container mx-auto px-4 pb-20">
        <motion.div 
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-12">
            <div className="inline-block mb-3">
              <div className="flex items-center justify-center space-x-2">
                <div className="h-1 w-6 bg-red-500"></div>
                <span className="text-red-500 font-medium uppercase text-sm tracking-wider">Got Questions?</span>
                <div className="h-1 w-6 bg-red-500"></div>
              </div>
            </div>
            
            <motion.h2 
              className="text-3xl md:text-4xl font-bold mb-4 text-gray-800"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              {title}
            </motion.h2>
            
            <motion.p 
              className="text-gray-600 text-lg max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              {subtitle}
            </motion.p>
          </div>
          
          {/* Search and Toggle */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <div className="relative w-full md:w-auto mb-4 md:mb-0">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input 
                type="text" 
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full md:w-80 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Search questions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  onClick={() => setSearchTerm('')}
                >
                  <span className="sr-only">Clear search</span>
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
            
            <button 
              onClick={() => setExpandAll(!expandAll)}
              className="flex items-center text-sm font-medium text-gray-600 hover:text-red-500 transition-colors"
            >
              {expandAll ? (
                <>
                  <MinusCircle className="h-4 w-4 mr-2" />
                  Collapse All
                </>
              ) : (
                <>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Expand All
                </>
              )}
            </button>
          </div>
          
          {/* FAQ Items */}
          <div className="space-y-4">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq, index) => (
                <FAQAccordionItem 
                  key={index} 
                  faq={faq} 
                  index={index}
                  isExpanded={expandedItems.includes(index)}
                  toggleItem={() => toggleItem(index)}
                />
              ))
            ) : (
              <div className="text-center py-8 bg-white rounded-lg shadow-sm border border-gray-200">
                <p className="text-gray-500">No results match your search criteria.</p>
                <button 
                  onClick={() => setSearchTerm('')}
                  className="mt-2 text-red-500 hover:text-red-700"
                >
                  Clear search
                </button>
              </div>
            )}
          </div>
          
          {/* View All Link */}
          {viewAllLink && filteredFaqs.length > 0 && !searchTerm && (
            <motion.div 
              className="mt-10 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <Button 
                asChild 
                variant="outline" 
                className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-colors"
              >
                <Link href={viewAllLink} className="flex items-center">
                  {viewAllText}
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </motion.div>
          )}
          
          {/* Help prompt */}
          <motion.div 
            className="mt-12 bg-gray-50 border border-gray-200 rounded-lg p-6 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <h4 className="font-medium text-gray-800 mb-2">Still have questions?</h4>
            <p className="text-gray-600 mb-4">We&apos;re here to help with any questions about exporting vehicles.</p>
            <Button asChild>
              <Link href="/contact">Contact Our Team</Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
      
      {/* Bottom Wave - Adding proper z-index and positioning */}
      <div className="absolute bottom-0 left-0 right-0 w-full z-0">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 100" preserveAspectRatio="none" className="w-full h-20 fill-white">
          <path d="M0,0L48,5.3C96,11,192,21,288,37.3C384,53,480,75,576,75C672,75,768,53,864,42.7C960,32,1056,32,1152,42.7C1248,53,1344,75,1392,85.3L1440,96L1440,100L1392,100C1344,100,1248,100,1152,100C1056,100,960,100,864,100C768,100,672,100,576,100C480,100,384,100,288,100C192,100,96,100,48,100L0,100Z"></path>
        </svg>
      </div>
    </section>
  );
} 