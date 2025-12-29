import React from 'react';
import Link from 'next/link';
import { Button } from './button';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { useTranslation } from '@/app/i18n/client';
import { useLanguage } from '@/components/providers/LanguageProvider';

interface ComingSoonProps {
  title?: string;
  description?: string;
  showNotifyButton?: boolean;
  onNotifyClick?: () => void;
}

export function ComingSoon({ 
  title, 
  description,
  showNotifyButton = true,
  onNotifyClick
}: ComingSoonProps) {
  useLanguage();
  const { t } = useTranslation(); // Remove the argument as it's not expected

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            {title || "Coming Soon"}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <p className="text-gray-600 leading-relaxed">
            {description || "This feature is currently under development. Stay tuned for updates!"}
          </p>
          
          <div className="space-y-4">
            {showNotifyButton && (
              <Button 
                onClick={onNotifyClick}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                Notify Me When Available
              </Button>
            )}
            
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => window.history.back()}
            >
              {t('common.back')}
            </Button>
          </div>
          
          <div className="pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Need immediate assistance?{' '}
              <Link 
                href="/contact"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Contact Us
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 