"use client";

import React, { useState } from 'react';
import { Shield, CreditCard, Building, Globe, ArrowRight, Eye, EyeOff, Lock } from 'lucide-react';
import Link from 'next/link';
import { Turnstile } from '@marsidev/react-turnstile';

export default function BankingPage() {
  const [verifiedAccountId, setVerifiedAccountId] = useState<number | null>(null);
  const [showVerification, setShowVerification] = useState<number | null>(null);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);

  // Banking information
  const bankAccounts = [
    {
      bankName: "MITSUBISHI TOKYO UFJ BANK",
      swiftCode: "BOTKJPJT",
      branchName: "YANAGIBASHI BRANCH	",
      country: "JAPAN",
      accountName: "SS HOLDINGS",
      accountNumber: "0268370",
      branchAddress: "AICHI KEN YATOMI SHI HIGASHISUEHIRO 5 CHOME 41",
      currency: "JPY",
      status: "active"
    },
    {
      bankName: "Tokyo Financial Group",
      accountName: "SS Holdings Japan",
      accountNumber: "XXXX-XXXX-XXXX-5678",
      swiftCode: "TFGXXXX",
      routingNumber: "987654321",
      branchAddress: "456 Banking Avenue, Tokyo, Japan",
      currency: "JPY",
      status: "coming_soon"
    },
    {
      bankName: "Emirates International Bank",
      accountName: "SS Holdings Middle East",
      accountNumber: "XXXX-XXXX-XXXX-9012",
      swiftCode: "EIBXXXX",
      routingNumber: "456789123",
      branchAddress: "789 Finance Tower, Dubai, UAE",
      currency: "AED",
      status: "coming_soon"
    }
  ];

  const handleVerifyClick = (index: number) => {
    setShowVerification(index);
  };

  const handleTurnstileSuccess = async (token: string) => {
    setTurnstileToken(token);
    // In production, you would verify this token with your backend
    // For now, we'll just show the account number
    setVerifiedAccountId(showVerification);
    setShowVerification(null);
  };

  const maskAccountNumber = (accountNumber: string) => {
    return accountNumber.replace(/\d(?=\d{4})/g, "X");
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <div className="bg-[#F4E7E1] py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Banking Information</h1>
          <p className="mt-4 text-lg text-gray-600 max-w-3xl">
            Secure and convenient payment options for your vehicle purchase. Please use the banking details below for wire transfers and international payments.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Security Notice */}
        <div className="bg-blue-50 border-l-4 border-blue-500 p-6 mb-12 rounded-r-lg">
          <div className="flex items-start">
            <Shield className="h-6 w-6 text-blue-500 mr-3 mt-0.5" />
            <div>
              <h3 className="font-medium text-blue-800">Secure Banking Information</h3>
              <p className="mt-2 text-blue-700">
                For your security, always verify banking details by contacting our finance department before making any transfers. 
                Never share these details with unauthorized parties.
              </p>
              <p className="mt-2 text-blue-700">
                Contact: <span className="font-semibold">finance@ssholdings.com</span> or <span className="font-semibold">+1 (555) 123-4567</span>
              </p>
            </div>
          </div>
        </div>

        {/* Bank Accounts */}
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Our Banking Details</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {bankAccounts.map((account, index) => (
            <div key={index} className={`border border-gray-200 rounded-lg overflow-hidden shadow-sm transition-shadow ${account.status === 'active' ? 'hover:shadow-md' : 'opacity-75'}`}>
              <div className="bg-gray-50 p-4 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-lg">{account.bankName}</h3>
                  {account.status === 'active' ? (
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium">
                      {account.currency}
                    </span>
                  ) : (
                    <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full font-medium">
                      Coming Soon
                    </span>
                  )}
                </div>
                <p className="text-gray-600 text-sm mt-1">{account.accountName}</p>
              </div>
              
              {account.status === 'active' ? (
                <div className="p-4">
                  <table className="w-full text-sm">
                    <tbody>
                      <tr>
                        <td className="py-2 text-gray-500 font-medium">Account Number:</td>
                        <td className="py-2 text-gray-900 font-mono flex justify-between items-center">
                          {verifiedAccountId === index ? account.accountNumber : maskAccountNumber(account.accountNumber)}
                          {!showVerification && (
                            <button
                              onClick={() => handleVerifyClick(index)}
                              className="ml-2 text-blue-600 hover:text-blue-800 flex items-center text-xs"
                            >
                              {verifiedAccountId === index ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <>
                                  <Eye className="h-4 w-4 mr-1" />
                                  Reveal
                                </>
                              )}
                            </button>
                          )}
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2 text-gray-500 font-medium">SWIFT Code:</td>
                        <td className="py-2 text-gray-900 font-mono">{account.swiftCode}</td>
                      </tr>
                      <tr>
                        <td className="py-2 text-gray-500 font-medium">Branch Name:</td>
                        <td className="py-2 text-gray-900 font-mono">{account.branchName}</td>
                      </tr>
                      <tr>
                        <td className="py-2 text-gray-500 font-medium">Branch Address:</td>
                        <td className="py-2 text-gray-900">{account.branchAddress}</td>
                      </tr>
                      <tr>
                        <td className="py-2 text-gray-500 font-medium">Country:</td>
                        <td className="py-2 text-gray-900 font-mono">{account.country}</td>
                      </tr>
                    </tbody>
                  </table>

                  {showVerification === index && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center mb-3">
                        <Lock className="h-4 w-4 text-gray-500 mr-2" />
                        <p className="text-sm text-gray-600">Please verify that you are human</p>
                      </div>
                      <Turnstile
                        siteKey="YOUR_SITE_KEY" // Replace with your Cloudflare Turnstile site key
                        onSuccess={handleTurnstileSuccess}
                      />
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-4">
                  <p className="text-gray-500 text-sm">
                    This banking option will be available soon. Please use our active banking details for now.
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Payment Process */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Payment Process</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 border border-gray-200 rounded-lg">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <CreditCard className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="font-bold text-lg mb-2">1. Confirm Your Order</h3>
              <p className="text-gray-600">
                After selecting your vehicle, our team will send you a detailed invoice with the total amount and payment instructions.
              </p>
            </div>
            
            <div className="bg-white p-6 border border-gray-200 rounded-lg">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <Building className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="font-bold text-lg mb-2">2. Make the Payment</h3>
              <p className="text-gray-600">
                Transfer the funds to the appropriate bank account based on your preferred currency and location.
              </p>
            </div>
            
            <div className="bg-white p-6 border border-gray-200 rounded-lg">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <Globe className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="font-bold text-lg mb-2">3. Confirm Receipt</h3>
              <p className="text-gray-600">
                Once payment is received, we'll begin processing your order and arrange for shipping or pickup of your vehicle.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 bg-gray-50 p-8 rounded-lg border border-gray-200">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Need Assistance with Payment?</h3>
          <p className="text-gray-600 mb-6">
            Our finance team is available to assist you with any questions regarding payment methods, bank transfers, or financing options.
          </p>
          <Link 
            href="/contact" 
            className="inline-flex items-center px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
          >
            Contact Our Finance Team <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
} 