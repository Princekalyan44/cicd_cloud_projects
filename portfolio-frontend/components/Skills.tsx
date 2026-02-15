/**
 * Skills Section Component
 * Displays technical skills with visual proficiency indicators
 * Organized by categories (Cloud, DevOps, Languages, etc.)
 */

'use client'

import { motion } from 'framer-motion'
import { Cloud, Server, Code, Database, Shield, GitBranch } from 'lucide-react'

// Define skill categories with icons and items
const skillCategories = [
  {
    icon: Cloud,
    title: 'Cloud Platforms',
    color: 'from-blue-400 to-cyan-400',
    skills: [
      { name: 'AWS (EKS, EC2, S3, RDS, Lambda)', level: 90 },
      { name: 'Azure', level: 60 },
      { name: 'Google Cloud', level: 50 },
    ],
  },
  {
    icon: Server,
    title: 'Container & Orchestration',
    color: 'from-purple-400 to-pink-400',
    skills: [
      { name: 'Kubernetes', level: 90 },
      { name: 'Docker', level: 95 },
      { name: 'Helm', level: 85 },
      { name: 'Istio', level: 70 },
    ],
  },
  {
    icon: GitBranch,
    title: 'CI/CD & Automation',
    color: 'from-green-400 to-emerald-400',
    skills: [
      { name: 'Jenkins', level: 85 },
      { name: 'GitLab CI', level: 80 },
      { name: 'GitHub Actions', level: 90 },
      { name: 'ArgoCD', level: 85 },
    ],
  },
  {
    icon: Code,
    title: 'Infrastructure as Code',
    color: 'from-orange-400 to-red-400',
    skills: [
      { name: 'Terraform', level: 85 },
      { name: 'Ansible', level: 75 },
      { name: 'CloudFormation', level: 60 },
    ],
  },
  {
    icon: Database,
    title: 'Monitoring & Observability',
    color: 'from-yellow-400 to-orange-400',
    skills: [
      { name: 'Prometheus', level: 85 },
      { name: 'Grafana', level: 85 },
      { name: 'ELK Stack', level: 70 },
      { name: 'Datadog', level: 60 },
    ],
  },
  {
    icon: Shield,
    title: 'Security & Compliance',
    color: 'from-red-400 to-rose-400',
    skills: [
      { name: 'Vault', level: 75 },
      { name: 'Kyverno', level: 70 },
      { name: 'Trivy', level: 80 },
      { name: 'AWS WAF', level: 70 },
    ],
  },
]

const Skills = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Section header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <h2 className="text-4xl md:text-5xl font-bold mb-4">
          <span className="gradient-text">Technical Skills</span>
        </h2>
        <p className="text-slate-400 text-lg">
          Technologies and tools I work with daily
        </p>
      </motion.div>

      {/* Skills grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {skillCategories.map((category, categoryIndex) => {
          const Icon = category.icon
          
          return (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: categoryIndex * 0.1 }}
              viewport={{ once: true }}
              className="glass rounded-xl p-6 hover:bg-white/10 transition-all"
            >
              {/* Category header with icon */}
              <div className="flex items-center gap-3 mb-6">
                <div className={`p-3 rounded-lg bg-gradient-to-r ${category.color}`}>
                  <Icon size={24} className="text-white" />
                </div>
                <h3 className="text-xl font-semibold">{category.title}</h3>
              </div>

              {/* Individual skills with progress bars */}
              <div className="space-y-4">
                {category.skills.map((skill, skillIndex) => (
                  <div key={skill.name}>
                    {/* Skill name and percentage */}
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-slate-300">{skill.name}</span>
                      <span className="text-slate-400">{skill.level}%</span>
                    </div>
                    
                    {/* Progress bar */}
                    <div className="h-2 bg-slate-700/50 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.level}%` }}
                        transition={{ duration: 1, delay: categoryIndex * 0.1 + skillIndex * 0.1 }}
                        viewport={{ once: true }}
                        className={`h-full bg-gradient-to-r ${category.color} rounded-full`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Additional skills section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        viewport={{ once: true }}
        className="mt-12 text-center"
      >
        <p className="text-slate-400">
          <span className="font-semibold text-slate-300">Other skills:</span>{' '}
          Python, Bash, YAML, JSON, Linux (RHEL/Ubuntu), Networking, Git, JIRA, Agile
        </p>
      </motion.div>
    </div>
  )
}

export default Skills
