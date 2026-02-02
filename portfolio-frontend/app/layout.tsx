/**
 * Root Layout Component
 * This is the main layout wrapper for the entire application
 * It includes global styles, fonts, and metadata
 */

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

// Load Inter font from Google Fonts
// This is optimized by Next.js for performance
const inter = Inter({ subsets: ['latin'] })

// SEO Metadata - This appears in search results and social shares
export const metadata: Metadata = {
  title: 'Kalyan - DevOps Engineer Portfolio',
  description: 'DevOps Engineer with 3.5+ years of experience in Kubernetes, AWS, CI/CD, and cloud infrastructure. Specializing in container orchestration and automation.',
  keywords: ['DevOps', 'Kubernetes', 'AWS', 'CI/CD', 'Docker', 'Terraform', 'Engineer'],
  authors: [{ name: 'Kalyan' }],
  openGraph: {
    title: 'Kalyan - DevOps Engineer',
    description: 'Portfolio showcasing DevOps projects and expertise',
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
      <body className={inter.className}>
        {/* Main content from each page */}
        {children}
      </body>
    </html>
  )
}
