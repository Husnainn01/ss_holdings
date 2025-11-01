'use client';

import MainLayout from '../layout-main';

export default function RoutesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MainLayout>{children}</MainLayout>;
}
