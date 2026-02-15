/**
 * Experience Section Component
 * Timeline view of work experience
 * Shows company, role, duration, and responsibilities
 */

'use client'

import { motion } from 'framer-motion'
import { Briefcase, Calendar, MapPin } from 'lucide-react'

// Work experience data
const experiences = [
  {
    company: 'Justdial Ltd.',
    role: 'DevOps Engineer',
    duration: 'June 2022 - January 2026',
    location: 'Bangalore, India',
    type: 'Full-time',
    description: 'Leading DevOps initiatives for a large-scale B2B platform serving millions of users.',
    responsibilities: [
      'Managed and optimized Kubernetes clusters (EKS) handling 10,000+ daily requests',
      'Implemented GitLab CI/CD pipelines reducing deployment time by 60%',
      'Configured comprehensive monitoring with Prometheus and Grafana for 50+ microservices',
      'Automated infrastructure provisioning using Terraform, managing 100+ AWS resources',
      'Led migration from monolithic to microservices architecture',
      'Performed Linux/RHEL system administration and troubleshooting',
      'Collaborated with development teams to implement DevOps best practices',
    ],
    technologies: ['Kubernetes', 'AWS', 'GitLab CI', 'Terraform', 'Prometheus', 'Docker', 'Linux'],
  },
  {
    company: 'Tech Mahindra',
    role: 'Associate Software Engineer',
    duration: 'January 2021 - May 2022',
    location: 'Bangalore, India',
    type: 'Full-time',
    description: 'Started career as a software engineer, transitioned to DevOps role.',
    responsibilities: [
      'Developed and maintained CI/CD pipelines using Jenkins',
      'Containerized legacy applications using Docker',
      'Managed version control with Git and code reviews',
      'Automated deployment processes and server configurations',
      'Provided technical support for development and QA teams',
    ],
    technologies: ['Jenkins', 'Docker', 'Git', 'Linux', 'Shell Scripting'],
  },
]

const Experience = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Section header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <h2 className="text-4xl md:text-5xl font-bold mb-4">
          <span className="gradient-text">Work Experience</span>
        </h2>
        <p className="text-slate-400 text-lg">
          3.5+ years of professional DevOps experience
        </p>
      </motion.div>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-0 md:left-1/2 transform md:-translate-x-1/2 h-full w-0.5 bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500" />

        {/* Experience cards */}
        <div className="space-y-12">
          {experiences.map((exp, index) => (
            <motion.div
              key={exp.company}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              viewport={{ once: true }}
              className={`relative flex items-center ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
            >
              {/* Timeline dot */}
              <div className="absolute left-0 md:left-1/2 transform md:-translate-x-1/2 w-4 h-4 bg-blue-500 rounded-full border-4 border-slate-900 z-10" />

              {/* Content card */}
              <div className={`ml-8 md:ml-0 md:w-5/12 ${index % 2 === 0 ? 'md:mr-auto md:pr-8' : 'md:ml-auto md:pl-8'}`}>
                <div className="glass rounded-xl p-6 hover:bg-white/10 transition-all">
                  {/* Company and role */}
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-1">
                        {exp.company}
                      </h3>
                      <p className="text-lg text-blue-400 font-semibold">
                        {exp.role}
                      </p>
                    </div>
                    <Briefcase className="text-purple-400" size={24} />
                  </div>

                  {/* Duration and location */}
                  <div className="flex flex-wrap gap-4 mb-4 text-sm text-slate-400">
                    <div className="flex items-center gap-2">
                      <Calendar size={16} />
                      <span>{exp.duration}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin size={16} />
                      <span>{exp.location}</span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-slate-300 mb-4">{exp.description}</p>

                  {/* Responsibilities */}
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-slate-300 mb-2">Key Responsibilities:</h4>
                    <ul className="space-y-2">
                      {exp.responsibilities.map((resp, i) => (
                        <li key={i} className="text-sm text-slate-400 flex items-start">
                          <span className="text-blue-400 mr-2">•</span>
                          <span>{resp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Technologies */}
                  <div className="flex flex-wrap gap-2">
                    {exp.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1 text-xs bg-blue-500/20 text-blue-300 rounded-full border border-blue-500/30"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Certifications section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        viewport={{ once: true }}
        className="mt-16 glass rounded-xl p-8"
      >
        <h3 className="text-2xl font-bold mb-6 text-center">
          <span className="gradient-text">Certifications & Education</span>
        </h3>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* Certifications */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-3">Certifications</h4>
            <ul className="space-y-2">
              <li className="text-slate-300 flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>AWS Certified Solutions Architect</strong>
                  <br />
                  <span className="text-sm text-slate-400">Valid through 2026</span>
                </span>
              </li>
              <li className="text-slate-300 flex items-start">
                <span className="text-yellow-400 mr-2">⏳</span>
                <span>
                  <strong>Certified Kubernetes Administrator (CKA)</strong>
                  <br />
                  <span className="text-sm text-slate-400">In preparation</span>
                </span>
              </li>
            </ul>
          </div>

          {/* Education */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-3">Education</h4>
            <div className="text-slate-300">
              <p className="font-semibold">B.E. Computer Science</p>
              <p className="text-sm text-slate-400">Dr. Ambedkar Institute of Technology</p>
              <p className="text-sm text-slate-400">2017 - 2020 | CGPA: 7.52/10</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default Experience
