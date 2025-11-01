import '../lib/mockLocalStorage' // Import mock localStorage first
import '../lib/mockWindow' // Import mock window.location
import '../lib/debugLocalStorage' // Import debug helper
import './globals.css'
import type { Metadata } from 'next'
import { raleway } from './fonts'
import { SITE_NAME, SITE_DESCRIPTION } from '@/config'

export const metadata: Metadata = {
  title: {
    template: `%s | ${SITE_NAME}`,
    default: `${SITE_NAME} - Premium Car Export Worldwide`
  },
  description: SITE_DESCRIPTION,
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
// The actual site layout is applied in route groups: (main) and (routes)
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
