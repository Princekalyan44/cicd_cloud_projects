/**
 * Projects Section Component
 * Showcase of portfolio projects with links
 */

'use client'

import { ExternalLink, Github } from 'lucide-react'
import { PROJECTS } from '@/lib/constants'

export default function Projects() {
  return (
    <div className="section-padding bg-dark-bg">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Featured <span className="text-gradient">Projects</span>
          </h2>
          <p className="text-dark-muted text-lg max-w-2xl mx-auto">
            Real-world projects demonstrating DevOps expertise and
            infrastructure automation
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {PROJECTS.map((project, index) => (
            <div
              key={index}
              className="glass rounded-lg overflow-hidden card-hover animate-fade-in-up"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              {/* Project Header with Icon/Image placeholder */}
              <div className="bg-gradient-to-br from-primary-600 to-primary-800 p-8 text-center">
                <div className="text-6xl mb-4">
                  {index === 0 ? '🚀' : '🛠️'}
                </div>
                <h3 className="text-2xl font-bold">{project.title}</h3>
              </div>

              <div className="p-6">
                {/* Description */}
                <p className="text-dark-muted mb-6">{project.description}</p>

                {/* Key Highlights */}
                <div className="mb-6">
                  <h4 className="font-semibold mb-3 text-primary-500">
                    Key Features:
                  </h4>
                  <ul className="space-y-2">
                    {project.highlights.map((highlight, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-2 text-sm text-dark-muted"
                      >
                        <span className="text-primary-500 mt-0.5">✓</span>
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Technologies */}
                <div className="mb-6">
                  <h4 className="font-semibold mb-3 text-primary-500">
                    Tech Stack:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1 bg-dark-bg text-dark-text rounded-full text-xs border border-dark-border"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4">
                  {/* GitHub Link */}
                  {project.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 px-4 py-2 bg-dark-bg hover:bg-primary-500 text-center rounded-lg transition-all duration-300 flex items-center justify-center gap-2 border border-dark-border hover:border-primary-500"
                    >
                      <Github size={18} />
                      View Code
                    </a>
                  )}

                  {/* Live Demo Link */}
                  {project.demo && (
                    <a
                      href={project.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-center rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      <ExternalLink size={18} />
                      Live Demo
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* GitHub Profile CTA */}
        <div className="text-center mt-12">
          <p className="text-dark-muted mb-4">
            Want to see more? Check out my GitHub profile
          </p>
          <a
            href="https://github.com/Princekalyan44"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-dark-card hover:bg-primary-500 rounded-lg transition-all duration-300 border border-dark-border hover:border-primary-500"
          >
            <Github size={20} />
            View All Repositories
          </a>
        </div>
      </div>
    </div>
  )
}
