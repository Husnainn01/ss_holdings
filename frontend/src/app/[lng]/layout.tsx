import { languages } from '../i18n/settings';
import { LanguageProvider } from '@/components/providers/LanguageProvider';

export async function generateStaticParams() {
  return languages.map((lng) => ({ lng }));
}

interface LngLayoutProps {
  children: React.ReactNode;
  params: Promise<{ lng: string }>;
}

export default async function LngLayout({
  children,
  params
}: LngLayoutProps) {
  const { lng } = await params;
  
  return (
    <div data-lng={lng}>
      <LanguageProvider>
        {children}
      </LanguageProvider>
    </div>
  );
} 