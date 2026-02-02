/**
 * Root Layout Component
 * This wraps all pages and provides:
 * - HTML structure
 * - Global styles
 * - Metadata for SEO
 * - Font loading
 */

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

// Load Inter font from Google Fonts
// This font is used throughout the application
const inter = Inter({ subsets: ['latin'] })

// Metadata for SEO (Search Engine Optimization)
// This appears in browser tabs and search results
export const metadata: Metadata = {
  title: 'Kalyan - DevOps Engineer | Portfolio',
  description: 'DevOps Engineer with 3.5+ years of experience in AWS, Kubernetes, CI/CD, and Infrastructure as Code. Based in Bangalore, India.',
  keywords: ['DevOps', 'AWS', 'Kubernetes', 'Docker', 'CI/CD', 'Terraform', 'Portfolio'],
  authors: [{ name: 'Kalyan' }],
  openGraph: {
    title: 'Kalyan - DevOps Engineer',
    description: 'Experienced DevOps Engineer specializing in cloud infrastructure and automation',
    type: 'website',
  },
}

// Root layout that wraps all pages
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      {/* scroll-smooth enables smooth scrolling for anchor links */}
      <body className={inter.className}>
        {/* Main content of each page goes here */}
        {children}
      </body>
    </html>
  )
}
