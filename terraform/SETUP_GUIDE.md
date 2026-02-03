# Terraform Setup Guide

Complete guide to set up and use Terraform for this project following best practices.

## Prerequisites

### Required Software

1. **Terraform** (>= 1.5.0)
   ```bash
   # macOS
   brew install terraform
   
   # Linux
   wget https://releases.hashicorp.com/terraform/1.5.0/terraform_1.5.0_linux_amd64.zip
   unzip terraform_1.5.0_linux_amd64.zip
   sudo mv terraform /usr/local/bin/
   
   # Verify
   terraform version
   ```

2. **AWS CLI** (>= 2.0)
   ```bash
   # macOS
   brew install awscli
   
   # Linux
   curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
   unzip awscliv2.zip
   sudo ./aws/install
   
   # Verify
   aws --version
   ```

3. **kubectl** (for EKS management)
   ```bash
   # macOS
   brew install kubectl
   
   # Linux
   curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
   sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl
   
   # Verify
   kubectl version --client
   ```

### Optional but Recommended

4. **TFLint** (Terraform linter)
   ```bash
   # macOS
   brew install tflint
   
   # Linux
   curl -s https://raw.githubusercontent.com/terraform-linters/tflint/master/install_linux.sh | bash
   
   # Verify
   tflint --version
   ```

5. **tfsec** (Security scanner)
   ```bash
   # macOS
   brew install tfsec
   
   # Linux
   curl -s https://raw.githubusercontent.com/aquasecurity/tfsec/master/scripts/install_linux.sh | bash
   
   # Verify
   tfsec --version
   ```

6. **Checkov** (Policy scanner)
   ```bash
   pip3 install checkov
   checkov --version
   ```

7. **pre-commit** (Git hooks)
   ```bash
   pip3 install pre-commit
   pre-commit --version
   ```

---

## Step 1: Configure AWS Credentials

### Option A: Using AWS CLI
```bash
aws configure
```
Enter:
- AWS Access Key ID
- AWS Secret Access Key
- Default region: `ap-south-1`
- Default output format: `json`

### Option B: Using Environment Variables
```bash
export AWS_ACCESS_KEY_ID="your-access-key"
export AWS_SECRET_ACCESS_KEY="your-secret-key"
export AWS_DEFAULT_REGION="ap-south-1"
```

### Verify Credentials
```bash
aws sts get-caller-identity
```

You should see your account ID, user ARN, and user ID.

---

## Step 2: Setup Terraform Backend

The backend (S3 + DynamoDB) stores Terraform state remotely.

### Automated Setup (Recommended)

```bash
cd terraform/scripts
chmod +x setup-backend.sh
./setup-backend.sh
```

This script will:
1. ✅ Create S3 bucket for state storage
2. ✅ Enable versioning (for rollback)
3. ✅ Enable encryption (AES-256)
4. ✅ Block public access
5. ✅ Create DynamoDB table for locking
6. ✅ Generate `backend-config.hcl`
7. ✅ Add to `.gitignore`

### Manual Setup (Alternative)

If you prefer manual setup:

1. **Create S3 Bucket**
   ```bash
   aws s3api create-bucket \
     --bucket portfolio-terraform-state-YOUR_ACCOUNT_ID \
     --region ap-south-1 \
     --create-bucket-configuration LocationConstraint=ap-south-1
   ```

2. **Enable Versioning**
   ```bash
   aws s3api put-bucket-versioning \
     --bucket portfolio-terraform-state-YOUR_ACCOUNT_ID \
     --versioning-configuration Status=Enabled
   ```

3. **Enable Encryption**
   ```bash
   aws s3api put-bucket-encryption \
     --bucket portfolio-terraform-state-YOUR_ACCOUNT_ID \
     --server-side-encryption-configuration '{
       "Rules": [{
         "ApplyServerSideEncryptionByDefault": {
           "SSEAlgorithm": "AES256"
         }
       }]
     }'
   ```

4. **Create DynamoDB Table**
   ```bash
   aws dynamodb create-table \
     --table-name portfolio-terraform-locks \
     --attribute-definitions AttributeName=LockID,AttributeType=S \
     --key-schema AttributeName=LockID,KeyType=HASH \
     --billing-mode PAY_PER_REQUEST \
     --region ap-south-1
   ```

---

## Step 3: Configure Variables

### Create terraform.tfvars

```bash
cd terraform
cp terraform.tfvars.example terraform.tfvars
```

### Edit terraform.tfvars

```hcl
# Required
aws_account_id = "123456789012"  # Your AWS account ID

# Optional (override defaults)
environment    = "production"
project_name   = "portfolio"
aws_region     = "ap-south-1"

# VPC Configuration
vpc_cidr = "10.0.0.0/16"

# EKS Configuration
eks_cluster_version = "1.28"
eks_cluster_name    = "portfolio-eks-cluster"

# Node Groups
node_group_general_desired_size = 2
node_group_general_min_size     = 1
node_group_general_max_size     = 4

# RDS Configuration
db_instance_class = "db.t3.micro"
db_username       = "dbadmin"

# Domain (if you have one)
domain_name         = ""  # Leave empty if no domain
create_route53_zone = false

# Security
enable_waf = true
```

---

## Step 4: Initialize Terraform

### Using Backend Config File (Recommended)

```bash
cd terraform
terraform init -backend-config=backend-config.hcl
```

### Without Backend (Local State - Not Recommended)

```bash
terraform init -backend=false
```

### Expected Output

```
Initializing the backend...

Successfully configured the backend "s3"!

Initializing provider plugins...
- Finding hashicorp/aws versions matching "~> 5.0"...
- Installing hashicorp/aws v5.x.x...

Terraform has been successfully initialized!
```

---

## Step 5: Validate Configuration

### Manual Validation

```bash
# Format check
terraform fmt -check -recursive

# Format files (auto-fix)
terraform fmt -recursive

# Validate syntax
terraform validate

# Lint (if tflint installed)
tflint --init
tflint

# Security scan (if tfsec installed)
tfsec .
```

### Automated Validation Script

```bash
cd terraform/scripts
chmod +x validate-terraform.sh
./validate-terraform.sh
```

This runs all validation checks in one command.

---

## Step 6: Plan Infrastructure

### Review What Will Be Created

```bash
terraform plan
```

### Save Plan for Review

```bash
terraform plan -out=tfplan
```

### Review Specific Resources

```bash
# Show plan details
terraform show tfplan

# Show plan in JSON
terraform show -json tfplan | jq
```

### Expected Resources

The plan should show creation of:
- ✅ VPC with public/private/database subnets
- ✅ NAT Gateways (3 for HA)
- ✅ Internet Gateway
- ✅ Route tables and associations
- ✅ Security groups
- ✅ EKS cluster
- ✅ EKS node groups (general + GPU)
- ✅ RDS PostgreSQL instance
- ✅ ECR repositories
- ✅ IAM roles and policies
- ✅ ALB for ingress
- ✅ Route53 (if domain configured)
- ✅ ACM certificate (if domain configured)
- ✅ WAF Web ACL

**Total:** ~60-80 resources

---

## Step 7: Apply Infrastructure

### Apply Saved Plan

```bash
terraform apply tfplan
```

### Or Apply Directly (with confirmation)

```bash
terraform apply
```

Type `yes` when prompted.

### Apply with Auto-Approve (Dangerous!)

```bash
# Only use in automation/CI-CD
terraform apply -auto-approve
```

### Expected Duration

- VPC and networking: **~3 minutes**
- EKS cluster: **~10-15 minutes**
- RDS instance: **~5 minutes**
- Other resources: **~2 minutes**

**Total time:** ~20-25 minutes

---

## Step 8: Verify Deployment

### Check Terraform Outputs

```bash
terraform output
```

You should see:
- VPC ID
- Subnet IDs
- EKS cluster endpoint
- RDS endpoint
- ECR repository URLs
- ALB DNS name

### Configure kubectl

```bash
# Get cluster name from output
CLUSTER_NAME=$(terraform output -raw cluster_name)

# Update kubeconfig
aws eks update-kubeconfig \
  --region ap-south-1 \
  --name $CLUSTER_NAME

# Verify connection
kubectl get nodes
kubectl get pods -A
```

### Check AWS Console

1. **VPC**: https://console.aws.amazon.com/vpc
2. **EKS**: https://console.aws.amazon.com/eks
3. **RDS**: https://console.aws.amazon.com/rds
4. **ECR**: https://console.aws.amazon.com/ecr

---

## Step 9: Setup Pre-commit Hooks (Optional)

Automate validation on every commit.

```bash
cd terraform

# Install pre-commit hooks
pre-commit install

# Test hooks
pre-commit run --all-files
```

Now validation runs automatically before each commit!

---

## Common Operations

### View Current State

```bash
# List all resources
terraform state list

# Show specific resource
terraform state show aws_vpc.main

# Pull remote state
terraform state pull
```

### Update Infrastructure

```bash
# Modify terraform.tfvars or *.tf files
# Then:
terraform plan
terraform apply
```

### Destroy Specific Resource

```bash
# Target specific resource
terraform destroy -target=aws_instance.example
```

### Import Existing Resource

```bash
# Import VPC
terraform import aws_vpc.main vpc-12345678

# Import EKS cluster
terraform import aws_eks_cluster.main my-cluster-name
```

### Refresh State

```bash
# Update state with real infrastructure
terraform refresh
```

### Taint Resource (Force Replacement)

```bash
# Mark resource for replacement
terraform taint aws_instance.example
terraform apply
```

---

## Workspaces (Multi-Environment)

### Create Workspaces

```bash
# Create dev workspace
terraform workspace new dev

# Create staging workspace
terraform workspace new staging

# Create production workspace
terraform workspace new production
```

### Switch Workspaces

```bash
# List workspaces
terraform workspace list

# Switch to production
terraform workspace select production

# Show current workspace
terraform workspace show
```

### Use Workspace in Code

```hcl
resource "aws_instance" "example" {
  instance_type = terraform.workspace == "production" ? "t3.large" : "t3.micro"
  
  tags = {
    Workspace = terraform.workspace
  }
}
```

---

## Troubleshooting

### Error: Backend Configuration Changed

```bash
# Reconfigure backend
terraform init -reconfigure -backend-config=backend-config.hcl
```

### Error: State Lock

```bash
# Force unlock (use carefully!)
terraform force-unlock <LOCK_ID>
```

### Error: Provider Plugin Not Found

```bash
# Clear plugin cache
rm -rf .terraform
terraform init -backend-config=backend-config.hcl
```

### Error: Validation Failed

```bash
# Check for syntax errors
terraform validate

# Format files
terraform fmt -recursive

# Run validation script
./scripts/validate-terraform.sh
```

### Debugging

```bash
# Enable debug logging
export TF_LOG=DEBUG
terraform plan

# Save logs to file
export TF_LOG_PATH=terraform.log
terraform apply

# Disable logging
unset TF_LOG
unset TF_LOG_PATH
```

---

## Cost Estimation

### Before Apply

```bash
# Generate plan
terraform plan -out=tfplan

# Use Infracost (if installed)
infracost breakdown --path tfplan
```

### Expected Monthly Costs (ap-south-1)

| Resource | Cost |
|----------|------|
| EKS Control Plane | $73 |
| EC2 Nodes (2x t3.medium) | ~$50 |
| NAT Gateway (3x) | ~$100 |
| RDS (db.t3.micro) | ~$15 |
| ALB | ~$20 |
| Data Transfer | ~$10 |
| **Total** | **~$268/month** |

### Cost Optimization Tips

1. **Use Spot Instances** for dev/staging
2. **Single NAT Gateway** for non-production
3. **Smaller instance types** where possible
4. **Stop RDS** when not in use (dev)
5. **Use AWS Free Tier** (first 12 months)

---

## Cleanup (Destroy Infrastructure)

### ⚠️ Warning
This will **permanently delete** all infrastructure!

### Step-by-Step Destruction

```bash
# 1. Backup state
terraform state pull > backup-state.json

# 2. Review what will be destroyed
terraform plan -destroy

# 3. Destroy specific resources first (optional)
terraform destroy -target=aws_eks_cluster.main

# 4. Destroy everything
terraform destroy

# Type 'yes' when prompted
```

### Force Destroy (Skip Confirmation)

```bash
# Dangerous! Only use in automation
terraform destroy -auto-approve
```

### Cleanup Local Files

```bash
# Remove Terraform files
rm -rf .terraform
rm -f .terraform.lock.hcl
rm -f tfplan
rm -f terraform.tfstate*
```

### Delete Backend Resources

```bash
# Delete DynamoDB table
aws dynamodb delete-table \
  --table-name portfolio-terraform-locks \
  --region ap-south-1

# Empty and delete S3 bucket
BUCKET="portfolio-terraform-state-$(aws sts get-caller-identity --query Account --output text)"
aws s3 rm s3://$BUCKET --recursive
aws s3api delete-bucket --bucket $BUCKET --region ap-south-1
```

---

## Next Steps

1. ✅ Deploy applications to EKS (see `kubernetes/` directory)
2. ✅ Configure CI/CD pipeline (GitHub Actions)
3. ✅ Setup monitoring (Prometheus/Grafana)
4. ✅ Configure DNS and SSL certificates
5. ✅ Implement backup strategy

---

## Additional Resources

- [Terraform AWS Provider Docs](https://registry.terraform.io/providers/hashicorp/aws/latest/docs)
- [EKS Best Practices](https://aws.github.io/aws-eks-best-practices/)
- [Terraform Best Practices Guide](./BEST_PRACTICES.md)
- [AWS Well-Architected Framework](https://aws.amazon.com/architecture/well-architected/)

---

## Support

For issues or questions:
1. Check [Troubleshooting](#troubleshooting) section
2. Review [Terraform AWS Provider Issues](https://github.com/hashicorp/terraform-provider-aws/issues)
3. Check [EKS Documentation](https://docs.aws.amazon.com/eks/)
