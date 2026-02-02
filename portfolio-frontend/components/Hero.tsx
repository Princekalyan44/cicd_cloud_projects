/**
 * Hero Component
 * Landing section with introduction and call-to-action
 * Includes animated gradient background and typewriter effect
 */

'use client'

import { useEffect, useState } from 'react'
import { Github, Linkedin, Mail, Download } from 'lucide-react'

const Hero = () => {
  // Typewriter effect for roles
  const [roleIndex, setRoleIndex] = useState(0)
  const roles = ['DevOps Engineer', 'Cloud Architect', 'Kubernetes Expert', 'CI/CD Specialist']

  useEffect(() => {
    const interval = setInterval(() => {
      setRoleIndex((prev) => (prev + 1) % roles.length)
    }, 3000) // Change role every 3 seconds

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden pt-16">
      {/* Animated background gradient circles */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-slow"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        {/* Greeting */}
        <div className="animate-fade-in">
          <p className="text-blue-400 text-lg mb-4">Hi, I'm</p>
          
          {/* Name with gradient */}
          <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">
            Kalyan
          </h1>
          
          {/* Animated role */}
          <div className="h-16 mb-8">
            <h2 className="text-3xl md:text-4xl font-semibold text-gray-300">
              {roles[roleIndex]}
            </h2>
          </div>
          
          {/* Brief description */}
          <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
            3.5+ years of experience building scalable cloud infrastructure, 
            implementing CI/CD pipelines, and managing Kubernetes clusters. 
            Passionate about automation and DevOps best practices.
          </p>
          
          {/* Call to action buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <a href="#contact" className="btn-primary w-full sm:w-auto">
              Get In Touch
            </a>
            <a href="#projects" className="btn-secondary w-full sm:w-auto">
              View Projects
            </a>
          </div>
          
          {/* Social links */}
          <div className="flex gap-6 justify-center">
            <a
              href="https://github.com/Princekalyan44"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors duration-200"
              aria-label="GitHub"
            >
              <Github size={28} />
            </a>
            <a
              href="https://linkedin.com/in/yourprofile"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors duration-200"
              aria-label="LinkedIn"
            >
              <Linkedin size={28} />
            </a>
            <a
              href="mailto:your.email@example.com"
              className="text-gray-400 hover:text-white transition-colors duration-200"
              aria-label="Email"
            >
              <Mail size={28} />
            </a>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-blue-400 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-blue-400 rounded-full mt-2"></div>
        </div>
      </div>
    </div>
  )
}

export default Hero
