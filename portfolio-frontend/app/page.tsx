/**
 * Home Page - Main Portfolio Page
 * This is the landing page that visitors see first
 * It assembles all the components into a single scrollable page
 */

'use client' // This is a client component (uses interactivity)

import Hero from '@/components/Hero'
import Skills from '@/components/Skills'
import Experience from '@/components/Experience'
import Projects from '@/components/Projects'
import Contact from '@/components/Contact'
import Chatbot from '@/components/Chatbot'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Fixed navigation bar at top */}
      <Navbar />
      
      {/* Main content sections */}
      {/* Each section has an id for smooth scrolling from navbar */}
      <section id="home">
        <Hero />
      </section>
      
      <section id="skills" className="py-20">
        <Skills />
      </section>
      
      <section id="experience" className="py-20">
        <Experience />
      </section>
      
      <section id="projects" className="py-20">
        <Projects />
      </section>
      
      <section id="contact" className="py-20">
        <Contact />
      </section>
      
      {/* Floating chatbot widget - always visible */}
      <Chatbot />
      
      {/* Footer with links and copyright */}
      <Footer />
    </main>
  )
}
