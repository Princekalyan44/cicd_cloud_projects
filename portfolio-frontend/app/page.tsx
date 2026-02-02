/**
 * Home Page Component
 * This is the main landing page that combines all sections
 */

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
    <main className="min-h-screen">
      {/* Navigation bar - fixed at top */}
      <Navbar />

      {/* All sections stacked vertically */}
      {/* Each section has a unique ID for navigation */}
      
      {/* Hero section - First thing users see */}
      <section id="home">
        <Hero />
      </section>

      {/* Skills section - Technical expertise */}
      <section id="skills">
        <Skills />
      </section>

      {/* Experience section - Work history */}
      <section id="experience">
        <Experience />
      </section>

      {/* Projects section - Portfolio showcase */}
      <section id="projects">
        <Projects />
      </section>

      {/* Contact section - Get in touch */}
      <section id="contact">
        <Contact />
      </section>

      {/* Footer - Copyright and links */}
      <Footer />

      {/* Floating chatbot widget - always visible */}
      <Chatbot />
    </main>
  )
}
