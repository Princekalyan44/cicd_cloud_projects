# System Architecture

## High-Level Architecture

### Infrastructure Layer (AWS)
- **VPC**: Multi-AZ deployment with public/private subnets
- **EKS Cluster**: Managed Kubernetes control plane
- **Node Groups**: Auto-scaling worker nodes (GPU-enabled for LLM)
- **RDS**: PostgreSQL for application data
- **S3**: Artifact storage and Terraform state
- **ECR**: Container image registry
- **WAF**: Web application firewall
- **Route53**: DNS management
- **ALB**: Application load balancer

### Kubernetes Layer
- **Namespaces**: Logical separation (dev, staging, prod)
- **Istio Service Mesh**: Traffic management, security, observability
- **ArgoCD**: GitOps deployment engine
- **Kyverno**: Policy enforcement
- **Vault Agent**: Secrets injection

### Application Layer
- **Microservices**: Sample multi-tier application
- **LLM Log Analyzer**: AI-powered troubleshooting service
- **Prometheus**: Metrics collection
- **Grafana**: Visualization

## Data Flow

### CI Pipeline
1. Developer pushes code to GitHub
2. GitHub Actions triggers:
   - Secret scanning (TruffleHog)
   - SAST (CodeQL)
   - Dependency audit
   - Unit tests
3. Docker image build
4. Container scanning (Trivy)
5. Push to ECR
6. Update ArgoCD manifest

### CD Pipeline
1. ArgoCD detects manifest changes
2. Syncs with cluster state
3. Applies Kubernetes resources
4. Kyverno validates policies
5. Istio handles traffic routing
6. Prometheus monitors deployment
7. LLM analyzer monitors logs

## Security Architecture

### Defense in Depth
1. **Perimeter**: AWS WAF, Security Groups
2. **Network**: Istio mTLS, Network Policies
3. **Application**: Kyverno PSS, RBAC
4. **Data**: Vault encryption, AWS KMS
5. **Monitoring**: Prometheus alerts, LLM anomaly detection

### Secret Management Flow
1. Secrets stored in HashiCorp Vault
2. Vault runs in HA mode on EKS
3. Applications use Vault Agent sidecar
4. Secrets injected at runtime (never in Git)
5. Auto-rotation policies enforced

## Observability Stack

### Metrics
- **Prometheus**: Scrapes metrics from Istio, applications, nodes
- **Grafana**: Dashboards for visualization
- **Custom metrics**: Application-specific KPIs

### Logging
- **Fluent Bit**: Log collection from pods
- **CloudWatch Logs**: Centralized storage
- **LLM Analyzer**: Intelligent log parsing and anomaly detection

### Tracing
- **Jaeger**: Distributed tracing (via Istio)
- **Service graph**: Dependency mapping

## AI Operations

### LLM Log Analyzer
- **Purpose**: Automated troubleshooting and root cause analysis
- **Model**: Open-source LLM (e.g., Llama 2, Mistral)
- **Infrastructure**: GPU-enabled node group
- **Features**:
  - Real-time log analysis
  - Anomaly detection
  - Automated remediation suggestions
  - Natural language incident reports

## Disaster Recovery

- **Terraform state**: Stored in S3 with versioning
- **Cluster backup**: Velero for etcd and PV snapshots
- **Multi-AZ deployment**: High availability
- **GitOps**: Infrastructure and apps defined as code
- **RTO**: < 1 hour
- **RPO**: < 15 minutes
