/**
 * Root Layout Component
 * This wraps all pages and provides global styles and metadata
 */

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

// Load Inter font from Google Fonts
// This provides better typography than system fonts
const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap', // Shows fallback font while loading
})

// SEO Metadata
// This appears in search results and social media shares
export const metadata: Metadata = {
  title: 'Kalyan - DevOps Engineer | Portfolio',
  description: 'DevOps Engineer with 3.5+ years of experience in Kubernetes, AWS, CI/CD, and cloud infrastructure. Specialized in building scalable, secure systems.',
  keywords: ['DevOps', 'Kubernetes', 'AWS', 'Docker', 'CI/CD', 'Terraform', 'Engineer'],
  authors: [{ name: 'Kalyan' }],
  openGraph: {
    title: 'Kalyan - DevOps Engineer',
    description: 'Building scalable cloud infrastructure and automating deployments',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      {/* scroll-smooth enables smooth scrolling for anchor links */}
      <body className={`${inter.className} bg-dark-bg text-dark-text antialiased`}>
        {/* antialiased makes text look smoother */}
        {children}
      </body>
    </html>
  )
}
