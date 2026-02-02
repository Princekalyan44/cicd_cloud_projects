/**
 * Hero Section Component
 * First section users see - Introduction and CTA buttons
 */

'use client'

import { ArrowRight, Download, Mail } from 'lucide-react'
import { PERSONAL_INFO, SOCIAL_LINKS } from '@/lib/constants'

export default function Hero() {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-900/20 via-dark-bg to-dark-bg" />
      
      {/* Floating shapes for visual interest */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary-600/10 rounded-full blur-3xl animate-pulse delay-1000" />

      <div className="container-custom relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Greeting - slides in from bottom */}
          <p className="text-primary-500 text-lg mb-4 animate-fade-in-up">
            Hi, I'm
          </p>

          {/* Name - large and bold */}
          <h1 className="text-5xl md:text-7xl font-bold mb-4 animate-fade-in-up delay-100">
            {PERSONAL_INFO.name}
          </h1>

          {/* Role with gradient */}
          <h2 className="text-3xl md:text-5xl font-bold text-gradient mb-6 animate-fade-in-up delay-200">
            {PERSONAL_INFO.role}
          </h2>

          {/* Brief description */}
          <p className="text-dark-muted text-lg md:text-xl mb-8 max-w-2xl mx-auto animate-fade-in-up delay-300">
            {PERSONAL_INFO.yearsOfExperience} years of experience building scalable cloud infrastructure,
            automating deployments, and managing Kubernetes clusters. Passionate about DevOps,
            cloud technologies, and continuous improvement.
          </p>

          {/* Call-to-action buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up delay-400">
            {/* Primary CTA - View Projects */}
            <a
              href="#projects"
              className="group px-8 py-4 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-semibold transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-primary-500/50"
            >
              View My Work
              <ArrowRight
                size={20}
                className="group-hover:translate-x-1 transition-transform"
              />
            </a>

            {/* Secondary CTA - Download Resume */}
            <a
              href="/resume.pdf" // You'll need to add your resume PDF to public folder
              download
              className="px-8 py-4 border-2 border-primary-500 text-primary-500 hover:bg-primary-500 hover:text-white rounded-lg font-semibold transition-all duration-300 flex items-center gap-2"
            >
              <Download size={20} />
              Download CV
            </a>

            {/* Tertiary CTA - Contact */}
            <a
              href="#contact"
              className="px-8 py-4 border-2 border-dark-border hover:border-primary-500 text-dark-text hover:text-primary-500 rounded-lg font-semibold transition-all duration-300 flex items-center gap-2"
            >
              <Mail size={20} />
              Contact Me
            </a>
          </div>

          {/* Social Links */}
          <div className="mt-12 flex items-center justify-center gap-6 animate-fade-in-up delay-500">
            {/* GitHub */}
            <a
              href={SOCIAL_LINKS.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-dark-muted hover:text-primary-500 transition-colors duration-300"
              aria-label="GitHub"
            >
              <svg
                className="w-8 h-8"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
            </a>

            {/* LinkedIn */}
            <a
              href={SOCIAL_LINKS.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-dark-muted hover:text-primary-500 transition-colors duration-300"
              aria-label="LinkedIn"
            >
              <svg
                className="w-8 h-8"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </a>
          </div>

          {/* Scroll indicator */}
          <div className="mt-16 animate-bounce">
            <a href="#skills" className="text-dark-muted hover:text-primary-500">
              <svg
                className="w-6 h-6 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
