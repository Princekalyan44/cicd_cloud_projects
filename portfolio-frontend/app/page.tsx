/**
 * Home Page - Main Portfolio Page
 * This is the entry point of the application
 * Combines all sections into a single-page portfolio
 */

'use client' // This is a client component (uses React hooks and interactions)

import Hero from '@/components/Hero'
import Skills from '@/components/Skills'
import Experience from '@/components/Experience'
import Projects from '@/components/Projects'
import Contact from '@/components/Contact'
import Chatbot from '@/components/Chatbot'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Navigation bar - sticky at top */}
      <Navigation />
      
      {/* Main content sections */}
      <div className="relative">
        {/* Hero section - Introduction */}
        <section id="home">
          <Hero />
        </section>
        
        {/* Skills section - Technical expertise */}
        <section id="skills" className="py-20">
          <Skills />
        </section>
        
        {/* Experience section - Work history */}
        <section id="experience" className="py-20">
          <Experience />
        </section>
        
        {/* Projects section - Portfolio projects */}
        <section id="projects" className="py-20">
          <Projects />
        </section>
        
        {/* Contact section - Get in touch */}
        <section id="contact" className="py-20">
          <Contact />
        </section>
      </div>
      
      {/* Footer */}
      <Footer />
      
      {/* Floating chatbot widget - always visible */}
      <Chatbot />
    </main>
  )
}
