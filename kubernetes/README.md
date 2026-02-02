# Kubernetes Manifests

Production-ready Kubernetes configurations for deploying the portfolio application on AWS EKS.

## Directory Structure

```
kubernetes/
├── base/                      # Base configurations
│   ├── namespaces/           # Namespace definitions
│   ├── rbac/                 # RBAC roles and bindings
│   ├── network-policies/     # Network security policies
│   └── storage/              # Storage classes and PVCs
├── applications/             # Application deployments
│   ├── frontend/            # Portfolio frontend
│   ├── chatbot/             # AI chatbot service
│   └── postgres/            # PostgreSQL database
├── platform/                 # Platform services
│   ├── argocd/              # GitOps deployment
│   ├── vault/               # Secret management
│   ├── istio/               # Service mesh
│   ├── kyverno/             # Policy engine
│   ├── monitoring/          # Prometheus + Grafana
│   └── cert-manager/        # SSL certificate management
└── overlays/                 # Environment-specific configs
    ├── dev/
    ├── staging/
    └── production/
```

## Deployment Order

### Phase 1: Foundation (Required First)
1. Namespaces
2. Storage Classes
3. RBAC (Service Accounts, Roles, RoleBindings)
4. Network Policies

### Phase 2: Platform Services
5. HashiCorp Vault (secrets management)
6. ArgoCD (GitOps)
7. Istio (service mesh)
8. Kyverno (policy engine)
9. Cert-Manager (SSL certificates)
10. Prometheus + Grafana (monitoring)

### Phase 3: Applications
11. PostgreSQL (database)
12. Chatbot Service
13. Frontend Application
14. Ingress/Gateway

## Quick Start

### Prerequisites
```bash
# Configure kubectl for EKS cluster
aws eks update-kubeconfig --region ap-south-1 --name portfolio-eks-cluster

# Verify connection
kubectl cluster-info
kubectl get nodes
```

### Deploy Foundation
```bash
# Create namespaces
kubectl apply -f base/namespaces/

# Apply storage configurations
kubectl apply -f base/storage/

# Setup RBAC
kubectl apply -f base/rbac/

# Apply network policies
kubectl apply -f base/network-policies/
```

### Deploy Platform Services
```bash
# Install Vault
kubectl apply -f platform/vault/

# Install ArgoCD
kubectl apply -f platform/argocd/

# Install Istio
kubectl apply -f platform/istio/

# Install monitoring
kubectl apply -f platform/monitoring/
```

### Deploy Applications
```bash
# Deploy PostgreSQL
kubectl apply -f applications/postgres/

# Deploy Chatbot
kubectl apply -f applications/chatbot/

# Deploy Frontend
kubectl apply -f applications/frontend/
```

## Environment-Specific Deployments

Using Kustomize for environment overlays:

```bash
# Development
kubectl apply -k overlays/dev/

# Staging
kubectl apply -k overlays/staging/

# Production
kubectl apply -k overlays/production/
```

## Namespaces

| Namespace | Purpose | Resource Quota |
|-----------|---------|----------------|
| `portfolio-dev` | Development environment | 4 CPU, 8Gi RAM |
| `portfolio-staging` | Staging environment | 8 CPU, 16Gi RAM |
| `portfolio-prod` | Production environment | 16 CPU, 32Gi RAM |
| `argocd` | ArgoCD GitOps | 2 CPU, 4Gi RAM |
| `istio-system` | Istio service mesh | 4 CPU, 8Gi RAM |
| `vault` | HashiCorp Vault | 2 CPU, 4Gi RAM |
| `monitoring` | Prometheus + Grafana | 4 CPU, 8Gi RAM |
| `kyverno` | Policy engine | 1 CPU, 2Gi RAM |

## Security Features

### Network Policies
- Default deny all ingress/egress
- Explicit allow rules for required communication
- Namespace isolation

### RBAC
- Least privilege principle
- Service accounts for each application
- Role-based access control

### Pod Security
- Pod Security Standards (restricted)
- Non-root containers
- Read-only root filesystem where possible
- No privilege escalation

### Secrets Management
- HashiCorp Vault for sensitive data
- External Secrets Operator integration
- Automatic secret rotation

## Resource Management

### Resource Requests & Limits
All pods have defined:
- CPU requests and limits
- Memory requests and limits
- Storage requests (for stateful apps)

### Horizontal Pod Autoscaling (HPA)
- Frontend: 2-10 replicas based on CPU
- Chatbot: 2-5 replicas based on CPU
- Target: 70% CPU utilization

### Vertical Pod Autoscaling (VPA)
- Enabled for resource optimization
- Recommendations for right-sizing

## Monitoring & Observability

### Metrics
- Prometheus for metrics collection
- Grafana dashboards for visualization
- AlertManager for alerting

### Logging
- Fluent Bit for log collection
- CloudWatch Logs for storage
- Structured JSON logging

### Tracing
- Istio distributed tracing
- Jaeger integration

## High Availability

### Frontend
- Min 2 replicas across AZs
- Pod anti-affinity rules
- PodDisruptionBudget (min 1 available)

### Chatbot
- Min 2 replicas
- Session affinity for conversations
- Graceful shutdown (30s)

### Database
- RDS PostgreSQL (managed)
- Multi-AZ deployment
- Automated backups

## Disaster Recovery

### Backups
- Velero for cluster backups
- Daily snapshots to S3
- 30-day retention

### GitOps
- All configs in Git (this repo)
- ArgoCD auto-sync
- Easy rollback to previous versions

## Troubleshooting

### Common Issues

**Pods not starting:**
```bash
kubectl describe pod <pod-name> -n <namespace>
kubectl logs <pod-name> -n <namespace>
```

**Network connectivity issues:**
```bash
# Check network policies
kubectl get networkpolicies -n <namespace>

# Test connectivity
kubectl run test -it --rm --image=busybox -n <namespace> -- /bin/sh
```

**Resource constraints:**
```bash
# Check resource usage
kubectl top nodes
kubectl top pods -n <namespace>

# Check events
kubectl get events -n <namespace> --sort-by='.lastTimestamp'
```

## Updates & Rollbacks

### Rolling Updates
All deployments use `RollingUpdate` strategy:
- Max unavailable: 0 (zero downtime)
- Max surge: 1 (controlled rollout)

### Rollback
```bash
# View rollout history
kubectl rollout history deployment/<name> -n <namespace>

# Rollback to previous version
kubectl rollout undo deployment/<name> -n <namespace>

# Rollback to specific revision
kubectl rollout undo deployment/<name> --to-revision=<n> -n <namespace>
```

## Cost Optimization

### Resource Right-Sizing
- VPA recommendations applied
- Regular review of resource usage
- Pod priorities for cost optimization

### Cluster Autoscaler
- Automatic node scaling
- Scale down unused nodes
- Spot instances for non-production

## Compliance & Policies

### Kyverno Policies
- Require resource limits
- Enforce security standards
- Restrict image registries (ECR only)
- Require labels
- Validate configurations

### Audit Logging
- EKS audit logs enabled
- CloudWatch Logs retention
- Compliance reporting

## Contributing

When adding new manifests:
1. Follow naming conventions
2. Add resource requests/limits
3. Include health checks
4. Document in this README
5. Test in dev environment first
6. Update overlays if needed

## Support

For issues or questions:
- Check troubleshooting section
- Review pod logs
- Check ArgoCD sync status
- Review Grafana dashboards
