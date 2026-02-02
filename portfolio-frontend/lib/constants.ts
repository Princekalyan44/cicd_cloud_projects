/**
 * Constants and Configuration
 * Centralized place for all static data and configuration
 */

// Personal Information
export const PERSONAL_INFO = {
  name: 'Kalyan',
  role: 'DevOps Engineer',
  location: 'Bangalore, India',
  email: 'your.email@example.com', // Update with your email
  phone: '+91-XXXXXXXXXX', // Update with your phone
  yearsOfExperience: '3.5+',
}

// Social Media Links
export const SOCIAL_LINKS = {
  github: 'https://github.com/Princekalyan44',
  linkedin: 'https://linkedin.com/in/your-profile', // Update with your LinkedIn
  twitter: 'https://twitter.com/your-handle', // Optional
}

// Navigation Menu Items
export const NAV_ITEMS = [
  { label: 'Home', href: '#home' },
  { label: 'Skills', href: '#skills' },
  { label: 'Experience', href: '#experience' },
  { label: 'Projects', href: '#projects' },
  { label: 'Contact', href: '#contact' },
]

// Skills Data
// Categories with skills and proficiency levels (1-5)
export const SKILLS = {
  cloud: [
    { name: 'AWS', level: 4, icon: '☁️' },
    { name: 'EKS', level: 4, icon: '⚓' },
    { name: 'EC2', level: 5, icon: '💻' },
    { name: 'S3', level: 5, icon: '📦' },
    { name: 'RDS', level: 4, icon: '🗄️' },
    { name: 'Lambda', level: 3, icon: 'λ' },
  ],
  containers: [
    { name: 'Docker', level: 5, icon: '🐳' },
    { name: 'Kubernetes', level: 4, icon: '☸️' },
    { name: 'Helm', level: 4, icon: '⎈' },
  ],
  cicd: [
    { name: 'Jenkins', level: 4, icon: '🔧' },
    { name: 'GitLab CI', level: 4, icon: '🦊' },
    { name: 'GitHub Actions', level: 4, icon: '⚡' },
    { name: 'ArgoCD', level: 3, icon: '🔄' },
  ],
  iac: [
    { name: 'Terraform', level: 4, icon: '🏗️' },
    { name: 'Ansible', level: 3, icon: '📜' },
  ],
  monitoring: [
    { name: 'Prometheus', level: 4, icon: '📊' },
    { name: 'Grafana', level: 4, icon: '📈' },
    { name: 'ELK Stack', level: 3, icon: '🔍' },
  ],
  languages: [
    { name: 'Python', level: 4, icon: '🐍' },
    { name: 'Bash', level: 5, icon: '💻' },
    { name: 'Node.js', level: 3, icon: '💚' },
  ],
  os: [
    { name: 'Linux/RHEL', level: 5, icon: '🐧' },
    { name: 'Ubuntu', level: 5, icon: '🟠' },
  ],
}

// Work Experience
export const EXPERIENCE = [
  {
    company: 'Justdial Ltd.',
    role: 'DevOps Engineer',
    duration: 'Jun 2022 - Jan 2026',
    location: 'Bangalore, India',
    description: 'Led DevOps initiatives for microservices infrastructure',
    responsibilities: [
      'Managed Kubernetes clusters for 50+ microservices deployment',
      'Implemented CI/CD pipelines using GitLab and Jenkins, reducing deployment time by 60%',
      'Configured monitoring with Prometheus and Grafana for 24/7 system observability',
      'Automated infrastructure provisioning with Terraform, managing 100+ AWS resources',
      'Performed Linux/RHEL system administration and troubleshooting',
      'Collaborated with development teams for seamless application deployments',
    ],
    technologies: ['Kubernetes', 'AWS', 'Docker', 'Jenkins', 'Terraform', 'Prometheus'],
  },
  {
    company: 'Tech Mahindra',
    role: 'System Engineer',
    duration: 'Prior to Jun 2022',
    location: 'India',
    description: 'Infrastructure and system administration',
    responsibilities: [
      'System administration and maintenance',
      'Infrastructure support and troubleshooting',
      'Server management and monitoring',
    ],
    technologies: ['Linux', 'Networking', 'System Administration'],
  },
]

// Projects
export const PROJECTS = [
  {
    title: 'Enterprise CI/CD Pipeline on AWS EKS',
    description: 'Production-grade DevOps portfolio project featuring AI chatbot, GitOps, service mesh, and complete observability stack',
    technologies: [
      'AWS EKS',
      'Terraform',
      'ArgoCD',
      'Istio',
      'Vault',
      'Prometheus',
      'Grafana',
      'Next.js',
      'PostgreSQL',
      'pgvector',
    ],
    highlights: [
      'Multi-stage Docker builds with security scanning',
      'RAG-powered AI chatbot using pgvector',
      'GPU-enabled LLM log analyzer',
      'Kyverno policy enforcement',
      'AWS WAF protection',
      'Complete GitOps workflow',
    ],
    github: 'https://github.com/Princekalyan44/cicd_cloud_projects',
    demo: '', // Will be your ALB URL
  },
  {
    title: 'DevOps Infrastructure at Justdial',
    description: 'Managed and automated cloud infrastructure for large-scale microservices architecture',
    technologies: ['Kubernetes', 'AWS', 'Jenkins', 'GitLab', 'Terraform', 'Monitoring'],
    highlights: [
      'Reduced deployment time by 60%',
      'Managed 50+ microservices',
      'Implemented automated CI/CD',
      '24/7 monitoring and alerting',
    ],
    github: '', // Private company project
    demo: '',
  },
]

// Certifications
export const CERTIFICATIONS = [
  {
    name: 'AWS Solutions Architect Associate',
    issuer: 'Amazon Web Services',
    date: 'Valid through 2026',
    credentialId: 'YOUR_CREDENTIAL_ID',
  },
  {
    name: 'Certified Kubernetes Administrator (CKA)',
    issuer: 'Cloud Native Computing Foundation',
    date: 'In Preparation',
    credentialId: '',
  },
]

// Education
export const EDUCATION = {
  degree: 'Bachelor of Engineering in Computer Science',
  institution: 'Dr. Ambedkar Institute of Technology',
  duration: '2017 - 2020',
  cgpa: '7.52/10',
}

// Chatbot API Configuration
export const CHATBOT_CONFIG = {
  apiUrl: process.env.NEXT_PUBLIC_CHATBOT_API_URL || 'http://chatbot-service:8080',
  enabled: true,
}
