# Kubernetes Manifests

This directory contains all Kubernetes manifests for deploying the portfolio application.

## Structure

```
kubernetes/
├── namespaces/           # Namespace definitions
├── base/                 # Base configurations (RBAC, network policies)
├── applications/         # Application deployments
│   ├── frontend/        # Portfolio frontend
│   ├── chatbot/         # AI chatbot service
│   └── database/        # PostgreSQL database
├── platform/            # Platform services
│   ├── argocd/          # GitOps - ArgoCD
│   ├── vault/           # Secrets management
│   ├── istio/           # Service mesh
│   └── kyverno/         # Policy engine
├── monitoring/          # Observability stack
│   ├── prometheus/      # Metrics collection
│   ├── grafana/         # Dashboards
│   └── loki/            # Log aggregation
└── ingress/             # Ingress and routing
```

## Deployment Order

### Phase 1: Foundation
1. Namespaces
2. Storage classes
3. Network policies
4. RBAC (roles and service accounts)

### Phase 2: Platform Services
1. ArgoCD
2. Vault
3. Istio
4. Kyverno

### Phase 3: Applications
1. PostgreSQL database
2. Chatbot service
3. Frontend application
4. Ingress/ALB

### Phase 4: Observability
1. Prometheus
2. Grafana
3. Loki

## Quick Deploy

### Deploy everything (recommended for GitOps)
```bash
# Apply ArgoCD Application of Applications
kubectl apply -f platform/argocd/app-of-apps.yaml
```

### Manual deployment
```bash
# Phase 1: Foundation
kubectl apply -f namespaces/
kubectl apply -f base/

# Phase 2: Platform
kubectl apply -f platform/argocd/
kubectl apply -f platform/vault/
kubectl apply -f platform/istio/
kubectl apply -f platform/kyverno/

# Phase 3: Applications
kubectl apply -f applications/database/
kubectl apply -f applications/chatbot/
kubectl apply -f applications/frontend/
kubectl apply -f ingress/

# Phase 4: Monitoring
kubectl apply -f monitoring/prometheus/
kubectl apply -f monitoring/grafana/
```

## Namespaces

- `portfolio-dev` - Development environment
- `portfolio-staging` - Staging environment
- `portfolio-prod` - Production environment
- `argocd` - ArgoCD GitOps
- `vault` - HashiCorp Vault
- `istio-system` - Istio service mesh
- `monitoring` - Prometheus, Grafana, Loki
- `kyverno` - Policy engine

## Configuration

### Secrets
Secrets are managed by HashiCorp Vault. Each application has a ServiceAccount with:
- Vault role binding
- IAM role for AWS resources (IRSA)

### Environment Variables
ConfigMaps for each environment:
- `portfolio-dev-config`
- `portfolio-staging-config`
- `portfolio-prod-config`

### Resource Limits

| Service | Requests | Limits |
|---------|----------|--------|
| Frontend | 256Mi RAM, 0.25 CPU | 512Mi RAM, 0.5 CPU |
| Chatbot | 512Mi RAM, 0.5 CPU | 1Gi RAM, 1 CPU |
| PostgreSQL | 512Mi RAM, 0.5 CPU | 2Gi RAM, 1 CPU |

## Monitoring

- **Metrics**: Prometheus scrapes all pods with `prometheus.io/scrape: "true"` annotation
- **Logs**: Loki collects logs from all pods
- **Traces**: Istio provides distributed tracing
- **Dashboards**: Grafana dashboards in `monitoring/grafana/dashboards/`

## Security

- **Network Policies**: Restrict pod-to-pod communication
- **Pod Security**: Enforced by Kyverno policies
- **mTLS**: Enabled via Istio
- **Secrets**: Stored in Vault, injected at runtime
- **RBAC**: Least privilege access

## Scaling

### Horizontal Pod Autoscaler (HPA)
- Frontend: 2-10 replicas (CPU > 70%)
- Chatbot: 2-5 replicas (CPU > 80%)

### Vertical Pod Autoscaler (VPA)
Enabled for all applications with recommendation mode.

## Troubleshooting

### Check pod status
```bash
kubectl get pods -n portfolio-prod
```

### View logs
```bash
kubectl logs -n portfolio-prod deployment/frontend -f
```

### Describe resources
```bash
kubectl describe pod <pod-name> -n portfolio-prod
```

### Port forward for testing
```bash
kubectl port-forward -n portfolio-prod svc/frontend 3000:3000
```

## Rollback

### Using kubectl
```bash
kubectl rollout undo deployment/frontend -n portfolio-prod
```

### Using ArgoCD
```bash
argocd app rollback portfolio-frontend <revision>
```
