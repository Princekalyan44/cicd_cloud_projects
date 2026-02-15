# Terraform Infrastructure

This directory contains Terraform code to provision AWS infrastructure for the portfolio project.

## Prerequisites

1. **AWS CLI** configured with appropriate credentials
2. **Terraform** >= 1.5.0
3. **AWS Account** with sufficient permissions

## Quick Start

### 1. Setup Backend

First, create the S3 bucket and DynamoDB table for Terraform state:

```bash
../scripts/setup-backend.sh
```

### 2. Configure Variables

Copy the example variables file and customize it:

```bash
cp terraform.tfvars.example terraform.tfvars
```

Edit `terraform.tfvars` with your values:
- AWS account ID
- Region preferences
- Instance sizes
- Node group configurations

### 3. Deploy Infrastructure

Run the deployment script:

```bash
../scripts/deploy-infrastructure.sh
```

Or manually:

```bash
terraform init
terraform plan
terraform apply
```

### 4. Configure kubectl

After deployment, configure kubectl to access the EKS cluster:

```bash
aws eks update-kubeconfig --region ap-south-1 --name portfolio-eks-cluster
```

### 5. Verify Deployment

```bash
kubectl get nodes
kubectl get namespaces
```

## Architecture

### Networking
- **VPC**: Multi-AZ setup with public, private, and database subnets
- **NAT Gateway**: For private subnet internet access
- **Security Groups**: Layered security for each component

### Compute
- **EKS Cluster**: Managed Kubernetes control plane
- **Node Groups**:
  - General purpose (t3.medium) for applications
  - GPU-enabled (g4dn.xlarge) for LLM workloads

### Database
- **RDS PostgreSQL**: With pgvector extension for embeddings
- **Multi-AZ**: Optional for production HA

### Container Registry
- **ECR Repositories**: For frontend, chatbot, and LLM analyzer images

### Load Balancing & Security
- **Application Load Balancer**: For HTTP/HTTPS traffic
- **AWS WAF**: Web application firewall protection

### Storage
- **S3**: Artifacts and ALB logs

### DNS (Optional)
- **Route53**: Domain management if configured

## Modules

- `vpc`: VPC, subnets, NAT gateways, route tables
- `eks`: EKS cluster, node groups, OIDC provider
- `rds`: PostgreSQL database instance
- `rds-parameter-group`: Database parameters for pgvector
- `ecr`: Container registries
- `s3`: S3 buckets
- `alb`: Application load balancer
- `waf`: Web application firewall
- `route53`: DNS records
- `security-group`: Security group rules

## Outputs

After deployment, Terraform provides important outputs:

```bash
terraform output
```

Key outputs:
- `eks_cluster_endpoint`: Kubernetes API endpoint
- `rds_endpoint`: Database connection string
- `ecr_repository_urls`: Container registry URLs
- `alb_dns_name`: Load balancer DNS
- `configure_kubectl`: Command to setup kubectl

## Cost Optimization

### Development/Testing
- Use `t3.medium` for node groups
- Single NAT gateway
- `db.t3.micro` for RDS
- Disable Multi-AZ
- Scale GPU nodes to 0 when not in use

### Production
- Enable Multi-AZ for RDS
- Use multiple NAT gateways for HA
- Enable deletion protection
- Increase backup retention

## Cleanup

To destroy all infrastructure:

```bash
../scripts/destroy-infrastructure.sh
```

**Warning**: This will permanently delete all resources!

## Estimated Monthly Costs

### Development Setup (~$100-150/month)
- EKS Control Plane: $73
- 2x t3.medium nodes: $60
- db.t3.micro RDS: $15
- NAT Gateway: $32
- ALB: $16
- Storage & Data Transfer: ~$10

### Production Setup (~$300-400/month)
- EKS Control Plane: $73
- 3-4x t3.medium nodes: $90-120
- db.t3.small Multi-AZ: $60
- 2x NAT Gateways: $64
- ALB: $16
- WAF: $5-10
- Storage & Data Transfer: ~$20

**Note**: GPU nodes (g4dn.xlarge) add ~$526/month if running 24/7.

## Troubleshooting

### Backend initialization fails
```bash
# Run setup-backend.sh first
../scripts/setup-backend.sh
```

### Node groups fail to create
- Check service quotas for EC2 instances
- Verify IAM permissions
- Check availability zone capacity

### RDS connection issues
- Verify security group rules
- Check that pods are in same VPC
- Confirm database subnet group

## Security Considerations

1. **Never commit `terraform.tfvars`** - contains sensitive data
2. **Use IAM roles** instead of access keys where possible
3. **Enable encryption** for all data at rest (enabled by default)
4. **Restrict security groups** to minimum required access
5. **Enable CloudWatch logging** for audit trails
6. **Use AWS Secrets Manager** for database credentials

## Next Steps

After infrastructure is deployed:
1. Install ArgoCD on EKS cluster
2. Deploy HashiCorp Vault
3. Install Istio service mesh
4. Setup Prometheus & Grafana
5. Deploy Kyverno policies
6. Deploy application workloads
