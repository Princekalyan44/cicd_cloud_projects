/**
 * Projects Section Component
 * Showcase of portfolio projects
 * Cards with project details, tech stack, and links
 */

'use client'

import { motion } from 'framer-motion'
import { ExternalLink, Github, Award } from 'lucide-react'

// Project data
const projects = [
  {
    title: 'Enterprise CI/CD Pipeline with AWS EKS',
    description: 'Production-grade DevOps portfolio project featuring complete CI/CD pipeline, Kubernetes deployment, GitOps with ArgoCD, and AI-powered chatbot. Demonstrates enterprise-level DevOps practices.',
    features: [
      'Multi-stage GitHub Actions pipeline with security scanning',
      'AWS EKS cluster with GPU-enabled nodes',
      'PostgreSQL with pgvector for RAG implementation',
      'Istio service mesh and Prometheus monitoring',
      'HashiCorp Vault for secrets management',
      'Kyverno policies for security compliance',
    ],
    technologies: ['Kubernetes', 'AWS', 'Terraform', 'ArgoCD', 'React', 'Next.js', 'PostgreSQL', 'Python'],
    github: 'https://github.com/Princekalyan44/cicd_cloud_projects',
    demo: null,
    status: 'In Progress',
    featured: true,
  },
  {
    title: 'DevOps Infrastructure at Justdial',
    description: 'Led DevOps transformation for a large-scale B2B platform. Managed Kubernetes clusters, implemented CI/CD pipelines, and automated infrastructure provisioning.',
    features: [
      'EKS cluster management for 50+ microservices',
      'GitLab CI/CD pipelines reducing deployment time by 60%',
      'Terraform automation for 100+ AWS resources',
      'Comprehensive monitoring with Prometheus/Grafana',
      'Zero-downtime deployments with rolling updates',
    ],
    technologies: ['Kubernetes', 'AWS EKS', 'GitLab CI', 'Terraform', 'Prometheus', 'Docker'],
    github: null,
    demo: null,
    status: 'Production',
    featured: true,
  },
  {
    title: 'Multi-Cloud Infrastructure Automation',
    description: 'Terraform modules for deploying infrastructure across AWS, Azure, and GCP. Includes VPC setup, Kubernetes clusters, databases, and monitoring.',
    features: [
      'Modular Terraform code for reusability',
      'Cross-cloud compatible architectures',
      'Automated testing with Terratest',
      'Cost optimization strategies',
    ],
    technologies: ['Terraform', 'AWS', 'Azure', 'GCP', 'Go'],
    github: 'https://github.com/Princekalyan44',
    demo: null,
    status: 'Completed',
    featured: false,
  },
]

const Projects = () => {
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
          <span className="gradient-text">Featured Projects</span>
        </h2>
        <p className="text-slate-400 text-lg">
          Building production-grade infrastructure and automation
        </p>
      </motion.div>

      {/* Projects grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {projects.map((project, index) => (
          <motion.div
            key={project.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
            className={`glass rounded-xl p-6 hover:bg-white/10 transition-all ${
              project.featured ? 'lg:col-span-2' : ''
            }`}
          >
            {/* Project header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-2xl font-bold text-white">{project.title}</h3>
                  {project.featured && (
                    <span className="flex items-center gap-1 px-2 py-1 text-xs bg-yellow-500/20 text-yellow-300 rounded-full border border-yellow-500/30">
                      <Award size={12} />
                      Featured
                    </span>
                  )}
                </div>
                <span className={`text-sm px-3 py-1 rounded-full ${
                  project.status === 'Production' ? 'bg-green-500/20 text-green-300 border border-green-500/30' :
                  project.status === 'In Progress' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' :
                  'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                }`}>
                  {project.status}
                </span>
              </div>
            </div>

            {/* Description */}
            <p className="text-slate-300 mb-4">{project.description}</p>

            {/* Features */}
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-slate-300 mb-2">Key Features:</h4>
              <ul className="space-y-1">
                {project.features.map((feature, i) => (
                  <li key={i} className="text-sm text-slate-400 flex items-start">
                    <span className="text-blue-400 mr-2">•</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Technologies */}
            <div className="mb-4">
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1 text-xs bg-slate-700/50 text-slate-300 rounded-full"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Links */}
            <div className="flex gap-4">
              {project.github && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-slate-700/50 hover:bg-slate-700 rounded-lg transition-colors"
                >
                  <Github size={18} />
                  <span className="text-sm">View Code</span>
                </a>
              )}
              {project.demo && (
                <a
                  href={project.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded-lg transition-colors border border-blue-500/30"
                >
                  <ExternalLink size={18} />
                  <span className="text-sm">Live Demo</span>
                </a>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* GitHub link */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        viewport={{ once: true }}
        className="mt-12 text-center"
      >
        <a
          href="https://github.com/Princekalyan44"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
        >
          <Github size={20} />
          <span>View more projects on GitHub</span>
          <ExternalLink size={16} />
        </a>
      </motion.div>
    </div>
  )
}

export default Projects
