'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Clock, Sparkles, ShieldCheck, ArrowUpRight } from 'lucide-react';

const highlights = [
  {
    icon: Sparkles,
    title: 'Refined Inventory Experience',
    description: 'We are rebuilding the browsing journey with richer vehicle data, immersive imagery, and smarter filters.',
  },
  {
    icon: ShieldCheck,
    title: 'Streamlined Purchasing',
    description: 'Quote requests, export paperwork, and payments are being consolidated into one transparent flow.',
  },
  {
    icon: Clock,
    title: 'Live Availability Alerts',
    description: 'Reserve units and subscribe to real-time shipping notifications the moment a vehicle is assigned.',
  },
];

export default function ComingSoonLanding() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#030611] text-white">
      <div className="absolute inset-0">
        <div className="absolute -top-32 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-red-600/20 blur-[160px]" />
        <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-blue-500/10 blur-[120px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.08),_transparent_55%)]" />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="w-full max-w-4xl rounded-[32px] border border-white/10 bg-white/[0.04] p-8 text-center shadow-2xl backdrop-blur-xl md:p-12"
        >
          <p className="text-xs uppercase tracking-[0.4em] text-red-200">
            SS Holdings • Next Chapter
          </p>
          <h1 className="mt-4 text-4xl font-semibold leading-tight md:text-5xl">
            A completely reimagined vehicle export platform is on the way.
          </h1>
          <div className="mt-6 space-y-6 text-base text-gray-200 md:text-lg">
            <p className="leading-relaxed max-w-3xl mx-auto">
              We&apos;re polishing the final details to deliver faster inventory updates, concierge sourcing,
              and end-to-end logistics visibility. Be the first to explore it.
            </p>
            <p className="leading-relaxed max-w-3xl mx-auto">
              <span className="font-semibold text-white">Company Profile:</span> SS Holdings is a global leader in the export of automobiles
              and machinery, experiencing growth across all regions of the world.
            </p>
            <div className="space-y-4 max-w-3xl mx-auto">
              <p>
                We are currently updating our website. For information on our stock and services, please visit our social media pages linked below:
              </p>
              <div className="flex flex-col items-center gap-4 md:flex-row md:justify-center">
                {[
                  {
                    label: 'Facebook Page',
                    href: 'https://www.facebook.com/share/1ByHGaEz2r/?mibextid=wwXIfr',
                  },
                  {
                    label: 'TikTok',
                    href: 'https://www.tiktok.com/@salman_ssholdings?_r=1&_t=ZS-92Z7AzRtWHI',
                  },
                ].map(({ label, href }) => (
                  <Link
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3 text-white transition-colors hover:border-white hover:bg-white/10"
                  >
                    {label}
                    <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6, ease: 'easeOut' }}
          className="mt-12 grid w-full max-w-5xl gap-6 md:grid-cols-3"
        >
          {highlights.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 text-left transition hover:border-white/30 hover:bg-white/[0.08]"
            >
              <div className="mb-4 inline-flex items-center justify-center rounded-full bg-red-600/20 p-3 text-red-200">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold">{title}</h3>
              <p className="mt-2 text-sm text-gray-300 leading-relaxed">{description}</p>
            </div>
          ))}
        </motion.div>

        <footer className="mt-12 text-sm text-gray-400">
          © {new Date().getFullYear()} SS Holdings. All rights reserved.
        </footer>
      </div>
    </div>
  );
}
