/**
 * Footer Component
 * Bottom section with copyright and links
 */

'use client'

import { Github, Linkedin, Mail, Heart } from 'lucide-react'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="mt-20 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <h3 className="text-xl font-bold gradient-text mb-4">Kalyan</h3>
            <p className="text-slate-400 text-sm">
              DevOps Engineer passionate about cloud infrastructure, automation, and continuous delivery.
              Building scalable and reliable systems.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#skills" className="text-slate-400 hover:text-white transition-colors">
                  Skills
                </a>
              </li>
              <li>
                <a href="#experience" className="text-slate-400 hover:text-white transition-colors">
                  Experience
                </a>
              </li>
              <li>
                <a href="#projects" className="text-slate-400 hover:text-white transition-colors">
                  Projects
                </a>
              </li>
              <li>
                <a href="#contact" className="text-slate-400 hover:text-white transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h4 className="font-semibold mb-4">Connect</h4>
            <div className="flex gap-4">
              <a
                href="https://github.com/kalyanace44"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
                aria-label="GitHub Profile"
              >
                <Github size={20} />
              </a>
              <a
                href="https://www.linkedin.com/in/ekalyan"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
                aria-label="LinkedIn Profile"
              >
                <Linkedin size={20} />
              </a>
              <a
                href="mailto:kalyanace44@gmail.com"
                className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
                aria-label="Email Contact"
              >
                <Mail size={20} />
              </a>
            </div>
            <p className="text-slate-400 text-sm mt-4">
              Open to opportunities and collaborations
            </p>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-slate-800 text-center">
          <p className="text-slate-400 text-sm flex items-center justify-center gap-2">
            © {currentYear} Kalyan. Built with <Heart size={16} className="text-red-500" /> using Next.js, deployed on AWS EKS
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
