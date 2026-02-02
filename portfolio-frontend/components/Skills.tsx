/**
 * Skills Section Component
 * Displays technical skills organized by category with proficiency levels
 */

'use client'

import { SKILLS } from '@/lib/constants'

// Helper function to render skill proficiency as bars
const SkillLevel = ({ level }: { level: number }) => {
  return (
    <div className="flex gap-1">
      {[...Array(5)].map((_, index) => (
        <div
          key={index}
          className={`h-2 w-8 rounded-full ${
            index < level ? 'bg-primary-500' : 'bg-dark-border'
          }`}
        />
      ))}
    </div>
  )
}

export default function Skills() {
  // Organize skills into sections
  const skillSections = [
    { title: 'Cloud & AWS', skills: SKILLS.cloud },
    { title: 'Containers & Orchestration', skills: SKILLS.containers },
    { title: 'CI/CD', skills: SKILLS.cicd },
    { title: 'Infrastructure as Code', skills: SKILLS.iac },
    { title: 'Monitoring & Observability', skills: SKILLS.monitoring },
    { title: 'Programming Languages', skills: SKILLS.languages },
    { title: 'Operating Systems', skills: SKILLS.os },
  ]

  return (
    <div className="section-padding bg-dark-bg">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Technical <span className="text-gradient">Skills</span>
          </h2>
          <p className="text-dark-muted text-lg max-w-2xl mx-auto">
            Technologies and tools I work with daily to build scalable,
            reliable infrastructure
          </p>
        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {skillSections.map((section, sectionIndex) => (
            <div
              key={section.title}
              className="glass rounded-lg p-6 card-hover animate-fade-in-up"
              style={{ animationDelay: `${sectionIndex * 100}ms` }}
            >
              {/* Category Title */}
              <h3 className="text-xl font-semibold mb-6 text-primary-500">
                {section.title}
              </h3>

              {/* Skills List */}
              <div className="space-y-4">
                {section.skills.map((skill) => (
                  <div key={skill.name}>
                    {/* Skill Name and Icon */}
                    <div className="flex items-center justify-between mb-2">
                      <span className="flex items-center gap-2">
                        <span className="text-xl">{skill.icon}</span>
                        <span className="font-medium">{skill.name}</span>
                      </span>
                    </div>
                    
                    {/* Proficiency Level */}
                    <SkillLevel level={skill.level} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Skills Summary Stats */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-4xl font-bold text-primary-500 mb-2">3.5+</div>
            <div className="text-dark-muted">Years Experience</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-primary-500 mb-2">50+</div>
            <div className="text-dark-muted">Projects Deployed</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-primary-500 mb-2">100+</div>
            <div className="text-dark-muted">AWS Resources Managed</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-primary-500 mb-2">24/7</div>
            <div className="text-dark-muted">System Uptime</div>
          </div>
        </div>
      </div>
    </div>
  )
}
