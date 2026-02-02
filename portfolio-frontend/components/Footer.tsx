/**
 * Footer Component
 * Bottom section with copyright and quick links
 */

'use client'

import { Github, Linkedin, Mail } from 'lucide-react'
import { PERSONAL_INFO, SOCIAL_LINKS } from '@/lib/constants'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-dark-card border-t border-dark-border py-12">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* About Section */}
          <div>
            <h3 className="text-xl font-bold text-gradient mb-4">
              {PERSONAL_INFO.name}
            </h3>
            <p className="text-dark-muted">
              {PERSONAL_INFO.role} specializing in cloud infrastructure,
              Kubernetes, and CI/CD automation.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#home"
                  className="text-dark-muted hover:text-primary-500 transition-colors"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="#skills"
                  className="text-dark-muted hover:text-primary-500 transition-colors"
                >
                  Skills
                </a>
              </li>
              <li>
                <a
                  href="#experience"
                  className="text-dark-muted hover:text-primary-500 transition-colors"
                >
                  Experience
                </a>
              </li>
              <li>
                <a
                  href="#projects"
                  className="text-dark-muted hover:text-primary-500 transition-colors"
                >
                  Projects
                </a>
              </li>
            </ul>
          </div>

          {/* Contact & Social */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Connect</h3>
            <div className="space-y-3">
              {/* Email */}
              <a
                href={`mailto:${PERSONAL_INFO.email}`}
                className="flex items-center gap-2 text-dark-muted hover:text-primary-500 transition-colors"
              >
                <Mail size={18} />
                {PERSONAL_INFO.email}
              </a>

              {/* Social Links */}
              <div className="flex items-center gap-4 mt-4">
                <a
                  href={SOCIAL_LINKS.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-dark-muted hover:text-primary-500 transition-colors"
                  aria-label="GitHub"
                >
                  <Github size={24} />
                </a>
                <a
                  href={SOCIAL_LINKS.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-dark-muted hover:text-primary-500 transition-colors"
                  aria-label="LinkedIn"
                >
                  <Linkedin size={24} />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-dark-border pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Copyright */}
            <p className="text-dark-muted text-sm">
              © {currentYear} {PERSONAL_INFO.name}. All rights reserved.
            </p>

            {/* Tech Stack Info */}
            <p className="text-dark-muted text-sm">
              Built with Next.js • Deployed on AWS EKS • Powered by GitOps
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
