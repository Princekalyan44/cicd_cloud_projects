# Enterprise CI/CD Pipeline with AWS EKS

## Overview
A production-grade CI/CD pipeline demonstrating enterprise DevOps practices with AWS cloud infrastructure, GitOps, security compliance, and AI-powered operations.

## Architecture Components

### CI/CD Pipeline
- **GitHub Actions**: Continuous Integration with security scanning
- **ArgoCD**: GitOps-based Continuous Deployment
- **Vault**: Secrets management and encryption

### Infrastructure
- **Terraform**: Infrastructure as Code for AWS resources
- **Amazon EKS**: Managed Kubernetes cluster
- **AWS WAF**: Web Application Firewall for security

### Security & Compliance
- **Kyverno**: Policy engine for Pod Security Standards (PSS)
- **Secret scanning**: TruffleHog integration
- **Container scanning**: Trivy for vulnerability detection
- **IaC scanning**: tfsec and Checkov

### Service Mesh & Observability
- **Istio**: Service mesh for traffic management and security
- **Prometheus**: Metrics collection and alerting
- **Grafana**: Visualization and dashboards

### AI Operations
- **LLM Log Analyzer**: GPU-enabled AI model for intelligent log analysis and troubleshooting

## Project Structure
```
├── .github/workflows/          # GitHub Actions CI pipelines
├── terraform/                  # Infrastructure as Code
│   ├── modules/               # Reusable Terraform modules
│   ├── environments/          # Environment-specific configs
│   └── backend.tf             # Remote state configuration
├── kubernetes/                # Kubernetes manifests
│   ├── base/                  # Base configurations
│   ├── overlays/              # Kustomize overlays per environment
│   └── argocd/                # ArgoCD application definitions
├── kyverno/                   # Policy definitions
├── istio/                     # Service mesh configurations
├── monitoring/                # Prometheus & Grafana configs
├── vault/                     # Vault configuration
├── llm-log-analyzer/          # AI-powered log analysis service
├── sample-app/                # Demo microservice application
└── scripts/                   # Utility scripts
```

## Getting Started

### Prerequisites
- AWS Account with appropriate permissions
- Terraform >= 1.5.0
- kubectl >= 1.28
- AWS CLI configured
- Docker
- GitHub account

### Deployment Steps
1. **Infrastructure Provisioning**: Deploy AWS resources with Terraform
2. **EKS Cluster Setup**: Configure kubectl and install add-ons
3. **ArgoCD Installation**: Set up GitOps deployment
4. **Vault Deployment**: Initialize secrets management
5. **Service Mesh**: Deploy Istio
6. **Monitoring Stack**: Install Prometheus and Grafana
7. **Security Policies**: Apply Kyverno policies
8. **LLM Analyzer**: Deploy AI log analysis service
9. **Sample Application**: Deploy demo microservices

## Features

### Security
- End-to-end encryption with Vault
- Pod Security Standards enforcement
- Network policies and mTLS with Istio
- AWS WAF protection
- Automated vulnerability scanning

### Observability
- Distributed tracing
- Centralized logging
- Custom metrics and dashboards
- AI-powered anomaly detection

### Automation
- Infrastructure as Code
- GitOps deployment workflow
- Automated testing and security scanning
- Self-healing capabilities

## License
MIT

## Author
Kalyan - DevOps Engineer
