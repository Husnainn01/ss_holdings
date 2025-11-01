import HomePageClient from '@/components/home/HomePageClient';
import MainLayout from './layout-main';

export default function RootPage() {
  return (
    <MainLayout>
      <HomePageClient />
    </MainLayout>
  );
}