/**
 * Experience Section Component
 * Displays work history in a timeline format
 */

'use client'

import { Briefcase, Calendar, MapPin } from 'lucide-react'
import { EXPERIENCE, CERTIFICATIONS, EDUCATION } from '@/lib/constants'

export default function Experience() {
  return (
    <div className="section-padding bg-dark-card">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Professional <span className="text-gradient">Journey</span>
          </h2>
          <p className="text-dark-muted text-lg max-w-2xl mx-auto">
            My career path in DevOps and cloud infrastructure
          </p>
        </div>

        {/* Work Experience Timeline */}
        <div className="max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold mb-8 flex items-center gap-2">
            <Briefcase className="text-primary-500" />
            Work Experience
          </h3>

          <div className="space-y-8">
            {EXPERIENCE.map((job, index) => (
              <div
                key={index}
                className="relative pl-8 pb-8 border-l-2 border-primary-500/30 last:pb-0 animate-fade-in-up"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                {/* Timeline Dot */}
                <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-primary-500" />

                {/* Job Card */}
                <div className="glass rounded-lg p-6 card-hover">
                  {/* Company & Role */}
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                    <div>
                      <h4 className="text-2xl font-bold text-primary-500">
                        {job.role}
                      </h4>
                      <p className="text-xl font-semibold">{job.company}</p>
                    </div>
                  </div>

                  {/* Duration & Location */}
                  <div className="flex flex-wrap gap-4 mb-4 text-dark-muted">
                    <div className="flex items-center gap-2">
                      <Calendar size={16} />
                      <span>{job.duration}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin size={16} />
                      <span>{job.location}</span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-dark-muted mb-4">{job.description}</p>

                  {/* Responsibilities */}
                  <ul className="space-y-2 mb-4">
                    {job.responsibilities.map((resp, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-dark-muted">
                        <span className="text-primary-500 mt-1">•</span>
                        <span>{resp}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Technologies */}
                  <div className="flex flex-wrap gap-2">
                    {job.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1 bg-primary-500/20 text-primary-400 rounded-full text-sm"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Certifications & Education Grid */}
        <div className="max-w-4xl mx-auto mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Certifications */}
          <div>
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <span className="text-primary-500">🏆</span>
              Certifications
            </h3>
            <div className="space-y-4">
              {CERTIFICATIONS.map((cert, index) => (
                <div
                  key={index}
                  className="glass rounded-lg p-4 card-hover"
                >
                  <h4 className="font-semibold text-primary-500 mb-1">
                    {cert.name}
                  </h4>
                  <p className="text-sm text-dark-muted mb-1">{cert.issuer}</p>
                  <p className="text-sm text-dark-muted">{cert.date}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Education */}
          <div>
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <span className="text-primary-500">🎓</span>
              Education
            </h3>
            <div className="glass rounded-lg p-4 card-hover">
              <h4 className="font-semibold text-primary-500 mb-2">
                {EDUCATION.degree}
              </h4>
              <p className="text-dark-muted mb-1">{EDUCATION.institution}</p>
              <div className="flex items-center gap-4 text-sm text-dark-muted">
                <span>{EDUCATION.duration}</span>
                <span>•</span>
                <span>CGPA: {EDUCATION.cgpa}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
