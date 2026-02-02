/**
 * Navigation Bar Component
 * Fixed navigation with smooth scroll to sections
 */

'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { NAV_ITEMS } from '@/lib/constants'

export default function Navbar() {
  // State for mobile menu (open/closed)
  const [isOpen, setIsOpen] = useState(false)
  
  // State for navbar background (transparent when at top, solid when scrolled)
  const [isScrolled, setIsScrolled] = useState(false)

  // Listen for scroll events to change navbar appearance
  useEffect(() => {
    const handleScroll = () => {
      // If scrolled more than 50px, add background
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    // Cleanup: remove event listener when component unmounts
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-dark-card shadow-lg' : 'bg-transparent'
      }`}
    >
      <div className="container-custom py-4">
        <div className="flex items-center justify-between">
          {/* Logo / Name */}
          <Link href="#home" className="text-2xl font-bold text-gradient">
            Kalyan
          </Link>

          {/* Desktop Navigation - hidden on mobile */}
          <div className="hidden md:flex items-center space-x-8">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-dark-muted hover:text-primary-500 transition-colors duration-300"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button - only visible on mobile */}
          <button
            className="md:hidden text-dark-text"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu - slides down when open */}
        {isOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-4 animate-fade-in-up">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block text-dark-muted hover:text-primary-500 transition-colors duration-300"
                onClick={() => setIsOpen(false)} // Close menu when item is clicked
              >
                {item.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  )
}
