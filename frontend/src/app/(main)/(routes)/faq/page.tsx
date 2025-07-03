'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Search, MessageSquare, Phone } from 'lucide-react';
import Link from 'next/link';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

interface FAQSectionProps {
  title: string;
  faqs: FAQItem[];
}

const FAQSection = ({ title, faqs }: FAQSectionProps) => {
  const [openId, setOpenId] = useState<string | null>(null);

  const toggleFAQ = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section className="mb-10">
      <h2 className="text-2xl font-bold mb-6 flex items-center">
        <span className="w-1.5 h-6 bg-primary rounded-full mr-3"></span>
        {title}
      </h2>
      <div className="space-y-4">
        {faqs.map((faq) => (
          <div 
            key={faq.id}
            className={`bg-white border rounded-lg transition-all duration-200 ${
              openId === faq.id 
                ? 'shadow-md border-primary/30' 
                : 'hover:border-gray-300'
            }`}
          >
            <button
              className="w-full text-left px-6 py-4 flex justify-between items-center focus:outline-none"
              onClick={() => toggleFAQ(faq.id)}
              aria-expanded={openId === faq.id}
            >
              <h3 className="text-lg font-medium">{faq.question}</h3>
              {openId === faq.id ? (
                <ChevronUp className="h-5 w-5 text-primary flex-shrink-0" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-500 flex-shrink-0" />
              )}
            </button>
            <div
              className={`px-6 overflow-hidden transition-all duration-300 ${
                openId === faq.id ? 'max-h-96 pb-6' : 'max-h-0'
              }`}
            >
              <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState('');
  
  const generalFAQs: FAQItem[] = [
    {
      id: 'what-do-you-do',
      question: "What does SS Holdings do?",
      answer: "SS Holdings is a car export company that specializes in sourcing and exporting quality vehicles to customers worldwide. We handle everything from vehicle sourcing to shipping logistics, ensuring a seamless experience for our clients."
    },
    {
      id: 'export-countries',
      question: "Which countries do you export to?",
      answer: "We export vehicles to most countries worldwide. Our extensive shipping network allows us to deliver to virtually any destination, including Asia, Africa, Europe, the Middle East, and the Americas."
    },
    {
      id: 'export-time',
      question: "How long does the export process take?",
      answer: "The export process timeline varies depending on your location and specific requirements. Typically, from the time of purchase, it takes about 1-4 weeks to prepare the vehicle for shipping, and then an additional 1-8 weeks for shipping, depending on the destination."
    }
  ];
  
  const vehicleFAQs: FAQItem[] = [
    {
      id: 'vehicle-types',
      question: "What types of vehicles do you offer?",
      answer: "We offer a wide range of vehicles, including sedans, SUVs, luxury cars, commercial vehicles, and specialized equipment. Our inventory is constantly updated with new arrivals from various manufacturers and in different price ranges."
    },
    {
      id: 'specific-model',
      question: "Can I request a specific model that's not in your inventory?",
      answer: "Yes, we offer vehicle sourcing services. If you don't see the specific model you're looking for in our current inventory, please contact us with your requirements, and our team will work to find a suitable match for you."
    },
    {
      id: 'new-used',
      question: "Do you sell both new and used vehicles?",
      answer: "Yes, we export both new and pre-owned vehicles. All our pre-owned vehicles undergo thorough inspection and quality checks to ensure they meet our standards before being offered to clients."
    }
  ];
  
  const pricingFAQs: FAQItem[] = [
    {
      id: 'price-determination',
      question: "How is the price of a vehicle determined?",
      answer: "The price is determined by several factors, including the vehicle's make, model, year, condition, mileage, market value, and any additional features. Shipping costs, insurance, and import taxes at the destination country may also affect the final price."
    },
    {
      id: 'payment-methods',
      question: "What payment methods do you accept?",
      answer: "We accept various payment methods, including bank transfers, letters of credit, and other secure international payment options. Our team will guide you through the available payment options for your specific situation."
    },
    {
      id: 'upfront-payment',
      question: "Do I need to pay the full amount upfront?",
      answer: "Typically, we require a deposit to secure the vehicle and begin the export process, with the remaining balance due before shipping. However, payment terms can be discussed based on your specific circumstances and the type of transaction."
    }
  ];
  
  const shippingFAQs: FAQItem[] = [
    {
      id: 'shipping-method',
      question: "How are vehicles shipped?",
      answer: "Vehicles are typically shipped via ocean freight in secure containers or RoRo (Roll-on/Roll-off) vessels. For some destinations, we may also arrange air freight for expedited delivery, though this option is more expensive."
    },
    {
      id: 'insurance',
      question: "Is insurance included in the shipping?",
      answer: "We offer comprehensive marine insurance options to protect your vehicle during transit. While insurance is not automatically included in all quotes, we strongly recommend it for all shipments, and our team can arrange appropriate coverage."
    },
    {
      id: 'arrival-process',
      question: "What happens after the vehicle arrives at the destination port?",
      answer: "Once the vehicle arrives, it will need to clear customs and complete import procedures. Depending on your arrangement with us, we can assist with these processes or provide guidance on the steps you need to take to receive your vehicle."
    }
  ];
  
  const documentsFAQs: FAQItem[] = [
    {
      id: 'required-documents',
      question: "What documents are required for exporting a vehicle?",
      answer: "Required documents typically include the original title, bill of sale, export declaration, shipping documents, and destination-specific import paperwork. Our team will guide you through the specific requirements for your destination country."
    },
    {
      id: 'customs-clearance',
      question: "Do you handle customs clearance?",
      answer: "We can assist with export customs clearance. Import customs clearance at the destination can also be arranged in many countries through our network of partners, though additional fees may apply."
    }
  ];
  
  // Combine all FAQs for search
  const allFAQs = [
    ...generalFAQs,
    ...vehicleFAQs,
    ...pricingFAQs,
    ...shippingFAQs,
    ...documentsFAQs
  ];
  
  // Filter FAQs based on search query
  const filteredFAQs = searchQuery.trim() === '' 
    ? [] 
    : allFAQs.filter(faq => 
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
      );
  
  return (
    <div className="bg-light min-h-screen mb-20">
      {/* Hero Section */}
      <div className="bg-primary text-white py-16 relative">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Frequently Asked Questions</h1>
            <p className="text-xl opacity-90 mb-12">
              Find answers to common questions about our vehicle export services
            </p>
          </div>
        </div>
        
        {/* Search Bar - Positioned to overlap hero section and content */}
        <div className="absolute left-0 right-0 bottom-0 transform translate-y-1/2">
          <div className="max-w-2xl mx-auto px-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                <Search className="h-6 w-6 text-primary" />
              </div>
              <input
                type="text"
                placeholder="Search for answers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-14 pr-5 py-5 rounded-xl focus:outline-none focus:ring-4 focus:ring-secondary/30 shadow-lg border-2 border-white bg-white text-gray-800 text-lg"
              />
              <div className="absolute inset-y-0 right-0 pr-5 flex items-center pointer-events-none">
                {searchQuery.trim() !== '' && (
                  <div className="bg-primary text-white text-xs font-bold px-2 py-1 rounded-full">
                    Press Enter
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content - Add padding top to accommodate the search bar */}
      <div className="container mx-auto px-4 py-12 pt-20">
        <div className="max-w-4xl mx-auto">
          {/* Search Results */}
          {searchQuery.trim() !== '' && (
            <div className="mb-10">
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <Search className="h-5 w-5 text-primary mr-3" />
                Search Results ({filteredFAQs.length})
              </h2>
              
              {filteredFAQs.length > 0 ? (
                <div className="space-y-4">
                  {filteredFAQs.map(faq => (
                    <div key={faq.id} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                      <h3 className="text-lg font-medium mb-2 text-primary">{faq.question}</h3>
                      <p className="text-gray-700">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
                  <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-gray-100 mb-4">
                    <Search className="h-8 w-8 text-gray-400" />
                  </div>
                  <p className="text-gray-700 text-lg mb-2">No results found for "{searchQuery}"</p>
                  <p className="text-gray-500">Try different keywords or browse the categories below</p>
                </div>
              )}
            </div>
          )}
          
          {/* FAQ Categories */}
          {searchQuery.trim() === '' && (
            <>
              <FAQSection title="General Questions" faqs={generalFAQs} />
              <FAQSection title="Vehicle Selection" faqs={vehicleFAQs} />
              <FAQSection title="Pricing and Payment" faqs={pricingFAQs} />
              <FAQSection title="Shipping and Delivery" faqs={shippingFAQs} />
              <FAQSection title="Documentation and Compliance" faqs={documentsFAQs} />
              
              {/* CTA Section */}
              <div className="bg-gradient-to-r from-primary to-primary-light rounded-2xl p-8 text-white mt-12">
                <div className="flex flex-col md:flex-row items-center justify-between">
                  <div className="mb-6 md:mb-0 md:mr-6">
                    <h2 className="text-2xl font-bold mb-2">Still Have Questions?</h2>
                    <p className="opacity-90">
                      If you couldn't find the answer to your question, our support team is here to help.
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link href="/contact" 
                      className="flex items-center justify-center bg-white text-primary px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
                    >
                      <MessageSquare className="h-5 w-5 mr-2" />
                      Contact Us
                    </Link>
                    <a 
                      href="tel:+810523879772"
                      className="flex items-center justify-center bg-secondary text-dark px-6 py-3 rounded-lg font-medium hover:bg-secondary-hover transition-colors"
                    >
                      <Phone className="h-5 w-5 mr-2" />
                      Call Support
                    </a>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
} 