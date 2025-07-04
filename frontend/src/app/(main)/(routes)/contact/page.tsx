'use client';

import React, { useState } from 'react';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Facebook, 
  Instagram, 
  Twitter,
  CheckCircle,
  Send,
  User,
  MessageSquare,
  Building,
  Globe,
  Lock
} from 'lucide-react';
import { Turnstile } from '@marsidev/react-turnstile';
import { authAPI } from '@/services/api';

export default function ContactPage() {
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [showTurnstile, setShowTurnstile] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!turnstileToken) {
      setShowTurnstile(true);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Verify Turnstile token
      await authAPI.verifyTurnstile(turnstileToken);
      
      // Here you would typically send the form data to your backend
      // For now, we'll just simulate a successful submission
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Show success message
      setIsFormSubmitted(true);
      
      // Reset form after 5 seconds
      setTimeout(() => {
        setIsFormSubmitted(false);
        setShowTurnstile(false);
        setTurnstileToken(null);
        const form = e.target as HTMLFormElement;
        form.reset();
      }, 5000);
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Verification failed. Please try again.');
      setShowTurnstile(false);
      setTurnstileToken(null);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleTurnstileSuccess = (token: string) => {
    setTurnstileToken(token);
    setShowTurnstile(false);
  };

  return (
    <div className="bg-light min-h-screen mb-20">
      {/* Hero Section */}
      <div className="bg-primary text-white py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Get In Touch</h1>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              Have questions about our vehicle export services? Our team is ready to assist you with any inquiries.
            </p>
          </div>
        </div>
      </div>
      
      {/* Contact Info Cards */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-8 flex flex-col items-center text-center hover:shadow-md transition-shadow">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-5">
                  <Phone className="h-7 w-7 text-primary" />
                </div>
                <h2 className="text-xl font-semibold mb-3">Call Us</h2>
                <p className="text-gray-500 mb-4">Our support team is available during business hours</p>
                <a href="tel:+15551234567" className="text-primary font-medium hover:text-primary-hover transition-colors">
                  +1 (555) 123-4567
                </a>
              </div>
              
              <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-8 flex flex-col items-center text-center hover:shadow-md transition-shadow">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-5">
                  <Mail className="h-7 w-7 text-primary" />
                </div>
                <h2 className="text-xl font-semibold mb-3">Email Us</h2>
                <p className="text-gray-500 mb-4">Send us an email and we'll respond within 24 hours</p>
                <a href="mailto:cs@ss.holdings" className="text-primary font-medium hover:text-primary-hover transition-colors">
                  cs@ss.holdings
                </a>
              </div>
              
              <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-8 flex flex-col items-center text-center hover:shadow-md transition-shadow">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-5">
                  <MapPin className="h-7 w-7 text-primary" />
                </div>
                <h2 className="text-xl font-semibold mb-3">Visit Us</h2>
                <p className="text-gray-500 mb-4">Our headquarters location</p>
                <p className="text-primary font-medium">
                  Aichi Ken Nagoya Shi Minato Ku Nishifukuta 1-1506
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="container mx-auto px-4 py-16 bg-light">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Contact Form */}
            <div className="lg:col-span-7">
              <div className="bg-white rounded-xl shadow-md p-8 border border-gray-100">
                <div className="flex items-center mb-8 pb-4 border-b border-gray-100">
                  <MessageSquare className="h-6 w-6 text-primary mr-3" />
                  <h2 className="text-2xl font-bold">Send Us a Message</h2>
                </div>
                
                {isFormSubmitted ? (
                  <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
                    <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                      <CheckCircle className="h-8 w-8 text-green-600" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">Message Sent Successfully!</h3>
                    <p className="text-gray-600 max-w-md mx-auto">
                      Thank you for reaching out to SS Holdings. Our team will review your message and get back to you shortly.
                    </p>
                  </div>
                ) : (
                  <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                          Full Name <span className="text-primary">*</span>
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <User className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            type="text"
                            id="name"
                            name="name"
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                            placeholder="John Doe"
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                          Email Address <span className="text-primary">*</span>
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Mail className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            type="email"
                            id="email"
                            name="email"
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                            placeholder="john@example.com"
                            required
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                          Phone Number
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Phone className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            type="tel"
                            id="phone"
                            name="phone"
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                            placeholder="+1 (555) 123-4567"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                          Country <span className="text-primary">*</span>
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Globe className="h-5 w-5 text-gray-400" />
                          </div>
                          <select
                            id="country"
                            name="country"
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                            required
                          >
                            <option value="">Select your country</option>
                            <option value="us">United States</option>
                            <option value="ca">Canada</option>
                            <option value="uk">United Kingdom</option>
                            <option value="au">Australia</option>
                            <option value="jp">Japan</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
                        Subject <span className="text-primary">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <MessageSquare className="h-5 w-5 text-gray-400" />
                        </div>
                        <select
                          id="subject"
                          name="subject"
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                          required
                        >
                          <option value="">Select a topic</option>
                          <option value="export-inquiry">Vehicle Export Inquiry</option>
                          <option value="vehicle-sourcing">Vehicle Sourcing</option>
                          <option value="shipping">Shipping & Logistics</option>
                          <option value="documentation">Documentation & Compliance</option>
                          <option value="pricing">Pricing & Payment</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                        Message <span className="text-primary">*</span>
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        rows={5}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                        placeholder="Please describe your inquiry in detail..."
                        required
                      ></textarea>
                    </div>
                    
                                          {/* Turnstile Verification */}
                      {showTurnstile && (
                        <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
                                                    <div className="flex items-center mb-3">
                            <Lock className="h-4 w-4 text-gray-500 mr-2" />
                            <p className="text-sm text-gray-600">Please verify that you are human</p>
                          </div>
                          <Turnstile
                            siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "0x4AAAAAABjiJBiYGbz486u9"}
                            onSuccess={handleTurnstileSuccess}
                            onError={(error) => {
                              console.error('Turnstile error:', error);
                              alert('Verification failed. Please try again.');
                            }}
                          />
                      </div>
                    )}
                    
                    <button
                      type="submit"
                      className="w-full py-3 px-6 flex items-center justify-center bg-primary text-white rounded-lg hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors font-medium text-lg disabled:opacity-50"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      ) : (
                        <Send className="h-5 w-5 mr-2" />
                      )}
                      {isSubmitting ? 'Sending...' : 'Send Message'}
                    </button>
                  </form>
                )}
              </div>
            </div>
            
            {/* Contact Information */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-xl shadow-md p-8 border border-gray-100 mb-8">
                <h2 className="text-xl font-bold mb-6 pb-4 border-b border-gray-100">Company Information</h2>
                <div className="space-y-6">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <Building className="h-5 w-5 text-primary" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium">SS Holdings</h3>
                      <p className="text-gray-600 mt-1">Global Vehicle Export Specialists</p>
                    </div>
                  </div>
                  
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <Phone className="h-5 w-5 text-primary" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium">Phone</h3>
                      <p className="text-gray-600 mt-1">+81 052 387 9772 (Sales)</p>
                      <p className="text-gray-600">+81 052 387 9772 (Support)</p>
                    </div>
                  </div>
                  
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <Mail className="h-5 w-5 text-primary" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium">Email</h3>
                      <p className="text-gray-600 mt-1">cs@ss.holdings</p>
                      <p className="text-gray-600">info@ss.holdings</p>
                    </div>
                  </div>
                  
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <MapPin className="h-5 w-5 text-primary" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium">Address</h3>
                      <p className="text-gray-600 mt-1">
                        Aichi Ken Nagoya Shi Minato Ku Nishifukuta 1-1506<br />
                        Nagoya, Aichi, Japan
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-md p-8 border border-gray-100 mb-8">
                <div className="flex items-center mb-6 pb-4 border-b border-gray-100">
                  <Clock className="h-5 w-5 text-primary mr-3" />
                  <h2 className="text-xl font-bold">Business Hours</h2>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between pb-3 border-b border-gray-100">
                    <span className="text-gray-600">Monday - Friday</span>
                    <span className="font-medium">9:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between pb-3 border-b border-gray-100">
                    <span className="text-gray-600">Saturday</span>
                    <span className="font-medium">10:00 AM - 4:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Sunday</span>
                    <span className="font-medium text-primary">Closed</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-md p-8 border border-gray-100">
                <h2 className="text-xl font-bold mb-6 pb-4 border-b border-gray-100">Connect With Us</h2>
                <div className="flex space-x-4">
                  <a href="#" className="h-12 w-12 bg-primary rounded-full flex items-center justify-center text-white hover:bg-primary-hover transition-colors">
                    <Facebook className="h-6 w-6" />
                  </a>
                  <a href="#" className="h-12 w-12 bg-secondary rounded-full flex items-center justify-center text-dark hover:bg-secondary-hover transition-colors">
                    <Instagram className="h-6 w-6" />
                  </a>
                  <a href="#" className="h-12 w-12 bg-dark rounded-full flex items-center justify-center text-white hover:bg-dark-light transition-colors">
                    <Twitter className="h-6 w-6" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Map Section */}
      <div className="w-full">
        <iframe 
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3241.329472092001!2d136.9352023758021!3d35.18123622400001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6001087d0d839573%3A0x42097772e907adbe!2sSS%20Holdings!5e0!3m2!1sen!2s!4v1720000000000!5m2!1sen!2s" 
          width="100%" 
          height="450" 
          style={{ border: 0 }} 
          loading="lazy"
          title="SS Holdings Location"
          aria-label="Map showing the location of SS Holdings office in Nagoya, Aichi, Japan"
          className="mt-0"
        ></iframe>
      </div>
    </div>
  );
} 