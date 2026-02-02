/**
 * Constants and Configuration
 * Centralized configuration values used across the application
 */

// Social media links
export const SOCIAL_LINKS = {
  github: 'https://github.com/Princekalyan44',
  linkedin: 'https://linkedin.com/in/kalyan-devops',
  email: 'kalyan@example.com',
  phone: '+919876543210',
}

// Personal information
export const PERSONAL_INFO = {
  name: 'Kalyan',
  role: 'DevOps Engineer',
  location: 'Bangalore, Karnataka, India',
  experience: '3.5+ years',
  tagline: 'Building scalable, secure, and automated cloud infrastructure',
}

// Navigation items
export const NAV_ITEMS = [
  { name: 'Home', href: '#home' },
  { name: 'Skills', href: '#skills' },
  { name: 'Experience', href: '#experience' },
  { name: 'Projects', href: '#projects' },
  { name: 'Contact', href: '#contact' },
]

// API endpoints
export const API_ENDPOINTS = {
  chatbot: process.env.NEXT_PUBLIC_CHATBOT_API_URL || 'http://localhost:8080',
  health: '/api/health',
}

// Feature flags
export const FEATURES = {
  chatbot: true,
  analytics: false, // Set to true when GA is configured
  contactForm: true,
}
