import './globals.css'
import type { Metadata } from 'next'
import { raleway } from './fonts'

export const metadata: Metadata = {
  title: {
    template: '%s | SS Holdings',
    default: 'SS Holdings - Premium Car Export Worldwide'
  },
  description: 'SS Holdings specializes in exporting high-quality vehicles to customers worldwide.',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

// This is a minimal root layout that doesn't include Header or Footer
// The actual site layout is in (main)/layout.tsx
// Admin routes have their own root layout in /admin/layout.tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${raleway.variable}`}>
      <body className={`${raleway.className}`}>
        {children}
      </body>
    </html>
  )
}
