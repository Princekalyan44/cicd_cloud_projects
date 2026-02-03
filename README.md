# Enterprise CI/CD Pipeline with AWS EKS

[![CI Pipeline](https://github.com/Princekalyan44/cicd_cloud_projects/actions/workflows/ci-pipeline.yml/badge.svg)](https://github.com/Princekalyan44/cicd_cloud_projects/actions/workflows/ci-pipeline.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Overview

A production-grade CI/CD pipeline demonstrating enterprise DevOps practices with AWS cloud infrastructure, GitOps, security compliance, and AI-powered operations.

### Key Features

- ✅ **Complete CI/CD Pipeline** with GitHub Actions
- ✅ **Infrastructure as Code** with Terraform
- ✅ **Kubernetes Orchestration** on Amazon EKS
- ✅ **GitOps Deployment** with ArgoCD
- ✅ **Security First** with multi-layer scanning
- ✅ **Service Mesh** with Istio
- ✅ **Observability** with Prometheus & Grafana
- ✅ **Secrets Management** with HashiCorp Vault
- ✅ **AI-Powered Operations** with LLM Log Analyzer

---

## Architecture

### CI/CD Pipeline
- **GitHub Actions**: Continuous Integration with security scanning
- **ArgoCD**: GitOps-based Continuous Deployment
- **Vault**: Secrets management and encryption
- **Automated Testing**: Unit, integration, and security tests

### Infrastructure (AWS)
- **Amazon EKS**: Managed Kubernetes (v1.28)
- **VPC**: Multi-AZ setup with public/private/database subnets
- **RDS PostgreSQL**: Managed database with pgvector
- **ECR**: Container registry for Docker images
- **ALB**: Application Load Balancer with WAF
- **Route53**: DNS management (optional)

### Security & Compliance
- **Kyverno**: Policy engine for Pod Security Standards
- **TruffleHog**: Secret scanning in git history
- **Trivy**: Container vulnerability scanning
- **tfsec & Checkov**: Infrastructure as Code scanning
- **AWS WAF**: Web Application Firewall
- **CodeQL**: Static Application Security Testing (SAST)

### Observability
- **Prometheus**: Metrics collection and alerting
- **Grafana**: Visualization and dashboards
- **Istio**: Service mesh with distributed tracing
- **Centralized logging**: ELK/EFK stack ready

### Applications
- **Portfolio Frontend**: Next.js 14 application
- **AI Chatbot**: RAG-powered chatbot with pgvector
- **LLM Log Analyzer**: GPU-enabled AI for log analysis

---

## Project Structure

```
├── .github/workflows/          # GitHub Actions CI/CD pipelines
│   └── ci-pipeline.yml         # Main CI pipeline
├── terraform/                  # Infrastructure as Code
│   ├── modules/               # Reusable Terraform modules
│   ├── scripts/               # Setup and validation scripts
│   ├── versions.tf            # Version constraints
│   ├── provider.tf            # AWS provider config
│   ├── backend.tf             # S3 remote state
│   ├── variables.tf           # Input variables
│   ├── locals.tf              # Computed values
│   ├── data.tf                # Data sources
│   ├── main.tf                # Main resources
│   ├── outputs.tf             # Outputs
│   └── SETUP_GUIDE.md         # Detailed setup instructions
├── kubernetes/                # Kubernetes manifests
│   ├── base/                  # Foundation (RBAC, policies, quotas)
│   ├── applications/          # App deployments
│   │   ├── database/          # PostgreSQL StatefulSet
│   │   ├── chatbot/           # Chatbot deployment
│   │   └── frontend/          # Frontend deployment
│   ├── ingress/               # ALB ingress configuration
│   └── README.md              # Kubernetes guide
├── portfolio-frontend/        # Next.js application
├── chatbot-service/           # AI chatbot service
├── docs/                      # Documentation
│   ├── CREDENTIALS_SETUP.md   # Credentials guide
│   ├── CI_CD_TROUBLESHOOTING.md # CI/CD troubleshooting
│   └── KUBERNETES_COMPLETE.md # K8s deployment guide
└── scripts/                   # Utility scripts
```

---

## Quick Start

### Prerequisites

- **AWS Account** with admin permissions
- **Terraform** >= 1.5.0
- **kubectl** >= 1.28
- **AWS CLI** >= 2.0
- **Docker** >= 20.10
- **GitHub account** with repository access
- **Node.js** >= 20 (for local development)

### Step 1: Credentials Setup

**🔑 This is the MOST IMPORTANT step!**

#### AWS Credentials

1. **Get your AWS Account ID:**
   ```bash
   aws sts get-caller-identity --query Account --output text
   ```
   Example output: `123456789012`

2. **Create IAM User for CI/CD:**
   - Go to [AWS IAM Console](https://console.aws.amazon.com/iam/)
   - Create user: `github-actions-cicd`
   - Attach policies: `AmazonEC2ContainerRegistryPowerUser`, `AmazonEKSClusterPolicy`
   - Create access keys
   - **Save the credentials securely!**

3. **Configure GitHub Secrets:**
   - Go to your repo: **Settings** → **Secrets and variables** → **Actions**
   - Add **3 secrets**:
     - `AWS_ACCOUNT_ID`: Your 12-digit account ID
     - `AWS_ACCESS_KEY_ID`: IAM user access key
     - `AWS_SECRET_ACCESS_KEY`: IAM user secret key

📚 **Detailed Guide:** See [docs/CREDENTIALS_SETUP.md](docs/CREDENTIALS_SETUP.md) for complete instructions

#### Terraform Variables

```bash
cd terraform
cp terraform.tfvars.example terraform.tfvars

# Edit terraform.tfvars with your values:
# - aws_account_id = "123456789012"
# - aws_region = "ap-south-1"
# - Other configuration as needed
```

### Step 2: Backend Setup

```bash
cd terraform/scripts
chmod +x setup-backend.sh
./setup-backend.sh
```

This creates:
- S3 bucket for Terraform state
- DynamoDB table for state locking
- `backend-config.hcl` with your configuration

### Step 3: Deploy Infrastructure

```bash
cd terraform

# Initialize Terraform
terraform init -backend-config=backend-config.hcl

# Validate configuration
terraform validate

# Review plan
terraform plan

# Deploy (takes ~20-25 minutes)
terraform apply
```

### Step 4: Configure kubectl

```bash
# Get cluster name from Terraform output
CLUSTER_NAME=$(terraform output -raw cluster_name)

# Configure kubectl
aws eks update-kubeconfig \
  --region ap-south-1 \
  --name $CLUSTER_NAME

# Verify connection
kubectl get nodes
```

### Step 5: Deploy Applications

```bash
cd ../kubernetes

# Deploy foundation
kubectl apply -f namespaces/
kubectl apply -f base/

# Create secrets (replace with your values)
kubectl create secret generic postgres-secret \
  --from-literal=password='YOUR_PASSWORD' \
  -n portfolio-prod

kubectl create secret generic chatbot-secret \
  --from-literal=db-password='YOUR_PASSWORD' \
  --from-literal=openai-api-key='YOUR_API_KEY' \
  --from-literal=secret-key='YOUR_SECRET_KEY' \
  -n portfolio-prod

# Deploy applications
kubectl apply -f applications/database/
kubectl apply -f applications/chatbot/
kubectl apply -f applications/frontend/
kubectl apply -f ingress/
```

### Step 6: Verify Deployment

```bash
# Check all pods are running
kubectl get pods -n portfolio-prod

# Get ALB DNS name
kubectl get ingress -n portfolio-prod

# Test application
kubectl port-forward -n portfolio-prod svc/frontend 3000:3000
# Visit http://localhost:3000
```

---

## CI/CD Workflow

### Trigger
- Push to `main` or `develop` branches
- Pull requests to `main`

### Pipeline Stages

1. **Security Scanning** (Parallel)
   - Secret scanning with TruffleHog
   - Terraform security with tfsec & Checkov
   - CodeQL analysis for JavaScript

2. **Build & Test** (Parallel after security)
   - Frontend: npm install, lint, test, build
   - Chatbot: Docker build

3. **Container Scanning**
   - Trivy vulnerability scan on Docker images

4. **Push to ECR** (on push to main/develop)
   - Tag with branch name and git SHA
   - Upload to Amazon ECR

5. **Update Manifests** (on push to main only)
   - Update Kubernetes deployment YAMLs
   - Commit changes (triggers ArgoCD sync)

6. **Notify**
   - Build summary in GitHub Actions UI

### View Pipeline Status

- **GitHub Actions**: [Actions Tab](../../actions)
- **Workflow File**: [.github/workflows/ci-pipeline.yml](.github/workflows/ci-pipeline.yml)

---

## Cost Estimate

### Monthly AWS Costs (ap-south-1 region)

| Resource | Configuration | Estimated Cost |
|----------|--------------|----------------|
| EKS Control Plane | 1 cluster | $73 |
| EC2 Nodes | 2x t3.medium | ~$50 |
| NAT Gateway | 3x (HA) | ~$100 |
| RDS PostgreSQL | db.t3.micro | ~$15 |
| Application Load Balancer | 1x | ~$20 |
| Data Transfer | ~100 GB | ~$10 |
| ECR Storage | ~10 GB | ~$1 |
| **Total** | | **~$269/month** |

### Cost Optimization Tips

- 💵 Use **Spot Instances** for non-prod (save ~70%)
- 💵 Single **NAT Gateway** for dev/staging (save ~$65)
- 💵 **Stop RDS** when not in use (dev only)
- 💵 Use **AWS Free Tier** (first 12 months)
- 💵 Enable **EKS Fargate** for variable workloads

---

## Documentation

### Complete Guides

- **[Credentials Setup](docs/CREDENTIALS_SETUP.md)** - AWS & GitHub credentials configuration
- **[Terraform Setup](terraform/SETUP_GUIDE.md)** - Infrastructure deployment guide
- **[Terraform Best Practices](terraform/BEST_PRACTICES.md)** - IaC best practices applied
- **[Kubernetes Complete](docs/KUBERNETES_COMPLETE.md)** - All K8s manifests explained
- **[CI/CD Troubleshooting](docs/CI_CD_TROUBLESHOOTING.md)** - Common issues and fixes

### Quick References

- [Kubernetes README](kubernetes/README.md) - K8s manifest structure
- [Frontend README](portfolio-frontend/README.md) - Next.js application
- [Chatbot README](chatbot-service/README.md) - AI chatbot service

---

## Security

### Implemented Security Measures

- ✅ **Network Isolation**: Zero-trust network policies
- ✅ **RBAC**: Least privilege access control
- ✅ **Secrets Management**: Vault integration ready
- ✅ **Pod Security**: Restricted security contexts
- ✅ **TLS Encryption**: End-to-end HTTPS
- ✅ **WAF Protection**: DDoS and attack mitigation
- ✅ **Multi-layer Scanning**: Secrets, IaC, containers, code
- ✅ **Audit Logging**: CloudTrail and EKS logs

### Security Scanning in CI/CD

| Scanner | What it Scans | When it Runs |
|---------|---------------|-------------|
| TruffleHog | Git history for secrets | Every commit |
| tfsec | Terraform security issues | Every commit |
| Checkov | IaC policy violations | Every commit |
| CodeQL | JavaScript vulnerabilities | Every commit |
| Trivy | Container vulnerabilities | On image build |
| npm audit | Dependency vulnerabilities | On npm install |

---

## Troubleshooting

### Common Issues

#### 1. "AWS credentials not found"
- **Cause**: GitHub Secrets not configured
- **Fix**: See [Credentials Setup Guide](docs/CREDENTIALS_SETUP.md#3-github-secrets-configuration)

#### 2. "Error: Some specified paths were not resolved"
- **Cause**: Missing package-lock.json for npm cache
- **Fix**: See [CI/CD Troubleshooting](docs/CI_CD_TROUBLESHOOTING.md)

#### 3. "Backend configuration changed"
- **Cause**: Terraform backend not initialized
- **Fix**: `terraform init -reconfigure -backend-config=backend-config.hcl`

#### 4. "EKS cluster not accessible"
- **Cause**: kubectl not configured
- **Fix**: `aws eks update-kubeconfig --region ap-south-1 --name <cluster-name>`

### Need Help?

1. Check [CI/CD Troubleshooting Guide](docs/CI_CD_TROUBLESHOOTING.md)
2. Check [Terraform Setup Guide](terraform/SETUP_GUIDE.md)
3. Review [GitHub Actions logs](../../actions)
4. Check AWS CloudWatch logs

---

## Technology Stack

### Infrastructure
- Terraform 1.5+
- AWS (EKS, VPC, RDS, ECR, ALB, WAF)
- Kubernetes 1.28

### CI/CD & GitOps
- GitHub Actions
- ArgoCD
- Docker

### Security
- TruffleHog (secrets)
- tfsec & Checkov (IaC)
- Trivy (containers)
- CodeQL (SAST)
- AWS WAF
- Kyverno (policies)

### Observability
- Prometheus
- Grafana
- Istio

### Applications
- Next.js 14
- Python 3.11
- PostgreSQL 15 with pgvector
- OpenAI GPT models

---

## Contributing

Contributions welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

## License

MIT License - see [LICENSE](LICENSE) file for details

---

## Author

**Kalyan**  
DevOps Engineer

- GitHub: [@Princekalyan44](https://github.com/Princekalyan44)
- Project: [cicd_cloud_projects](https://github.com/Princekalyan44/cicd_cloud_projects)

---

## Acknowledgments

- AWS for EKS and cloud services
- HashiCorp for Terraform
- CNCF for Kubernetes ecosystem
- GitHub for Actions and hosting

---

**Last Updated:** February 3, 2026
