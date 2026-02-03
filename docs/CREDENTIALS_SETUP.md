# Credentials Setup Guide

Complete guide for setting up all required credentials for AWS, GitHub Actions, and Kubernetes.

---

## Table of Contents
1. [AWS Account Setup](#1-aws-account-setup)
2. [AWS IAM User for CI/CD](#2-aws-iam-user-for-cicd)
3. [GitHub Secrets Configuration](#3-github-secrets-configuration)
4. [Terraform Variables](#4-terraform-variables)
5. [Kubernetes Secrets](#5-kubernetes-secrets)
6. [Verification](#6-verification)

---

## 1. AWS Account Setup

### Get Your AWS Account ID

**Method 1: AWS Console**
1. Log into [AWS Console](https://console.aws.amazon.com)
2. Click on your account name (top-right corner)
3. Your 12-digit Account ID is displayed
4. Copy it (e.g., `123456789012`)

**Method 2: AWS CLI**
```bash
# Must have AWS CLI configured first
aws sts get-caller-identity --query Account --output text
```

**Save it:** You'll need this for:
- GitHub Secrets: `AWS_ACCOUNT_ID`
- Terraform: `aws_account_id` variable
- ECR image URLs: `123456789012.dkr.ecr.ap-south-1.amazonaws.com`

---

## 2. AWS IAM User for CI/CD

### Why Create a Separate IAM User?

- ✅ **Least Privilege**: Specific permissions only
- ✅ **Security**: No root account credentials in CI/CD
- ✅ **Audit Trail**: Track all actions
- ✅ **Rotation**: Easy to rotate without affecting others

### Step-by-Step IAM User Creation

#### Step 1: Create IAM User

1. **Open IAM Console**: https://console.aws.amazon.com/iam/
2. Click **Users** → **Create user**
3. **User name**: `github-actions-cicd`
4. ❌ **Uncheck** "Provide user access to the AWS Management Console"
5. Click **Next**

#### Step 2: Attach Permissions

**Option A: Use Managed Policies (Quick Setup)**

Attach these AWS managed policies:
- `AmazonEC2ContainerRegistryPowerUser` - For ECR push/pull
- `AmazonEKSClusterPolicy` - For EKS management
- `AmazonVPCFullAccess` - For networking
- `IAMFullAccess` - For role creation (be careful!)

**Option B: Custom Policy (Recommended for Production)**

Create a custom policy with minimum required permissions:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "ECRPushPull",
      "Effect": "Allow",
      "Action": [
        "ecr:GetAuthorizationToken",
        "ecr:BatchCheckLayerAvailability",
        "ecr:GetDownloadUrlForLayer",
        "ecr:BatchGetImage",
        "ecr:PutImage",
        "ecr:InitiateLayerUpload",
        "ecr:UploadLayerPart",
        "ecr:CompleteLayerUpload",
        "ecr:DescribeRepositories",
        "ecr:CreateRepository",
        "ecr:ListImages"
      ],
      "Resource": "*"
    },
    {
      "Sid": "EKSDescribe",
      "Effect": "Allow",
      "Action": [
        "eks:DescribeCluster",
        "eks:ListClusters",
        "eks:DescribeNodegroup",
        "eks:ListNodegroups"
      ],
      "Resource": "*"
    },
    {
      "Sid": "S3TerraformState",
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:PutObject",
        "s3:DeleteObject",
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::portfolio-terraform-state-*",
        "arn:aws:s3:::portfolio-terraform-state-*/*"
      ]
    },
    {
      "Sid": "DynamoDBStateLock",
      "Effect": "Allow",
      "Action": [
        "dynamodb:GetItem",
        "dynamodb:PutItem",
        "dynamodb:DeleteItem",
        "dynamodb:DescribeTable"
      ],
      "Resource": "arn:aws:dynamodb:*:*:table/portfolio-terraform-locks"
    }
  ]
}
```

**To attach custom policy:**
1. In user creation, select **Attach policies directly**
2. Click **Create policy** (opens new tab)
3. Choose **JSON** tab
4. Paste the policy above
5. Click **Next: Tags** → **Next: Review**
6. **Name**: `GitHubActionsPolicy`
7. Click **Create policy**
8. Return to user creation tab and refresh
9. Search for `GitHubActionsPolicy` and select it
10. Click **Next**

#### Step 3: Create Access Keys

1. After user is created, click on the user name
2. Click **Security credentials** tab
3. Scroll to **Access keys** section
4. Click **Create access key**
5. Choose use case: **Application running outside AWS**
6. Click **Next**
7. Optional: Add description tag (e.g., "GitHub Actions CI/CD")
8. Click **Create access key**

#### Step 4: Save Credentials SECURELY

⚠️ **CRITICAL: This is your ONLY chance to see the Secret Access Key!**

**You'll see:**
```
Access key ID: AKIAIOSFODNN7EXAMPLE
Secret access key: wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
```

**Save these immediately:**
1. **Download .csv file** (backup)
2. **Copy to password manager** (1Password, LastPass, etc.)
3. ❌ **NEVER commit to git**
4. ❌ **NEVER share in Slack/email**
5. ❌ **NEVER hardcode in scripts**

---

## 3. GitHub Secrets Configuration

### What are GitHub Secrets?

Encrypted environment variables stored in GitHub, accessible only to Actions workflows.

### Required Secrets

You need to set up **3 secrets**:

1. `AWS_ACCESS_KEY_ID` - IAM user access key
2. `AWS_SECRET_ACCESS_KEY` - IAM user secret key
3. `AWS_ACCOUNT_ID` - Your 12-digit AWS account ID

### Step-by-Step: Add Secrets to GitHub

#### Method 1: Via GitHub Web UI

1. **Navigate to your repository**
   ```
   https://github.com/YOUR_USERNAME/cicd_cloud_projects
   ```

2. **Go to Settings**
   - Click **Settings** (top-right, near Code/Issues/Pull requests)
   - If you don't see Settings, you may not have admin access

3. **Access Secrets**
   - In left sidebar, expand **Secrets and variables**
   - Click **Actions**

4. **Add AWS_ACCOUNT_ID**
   - Click **New repository secret** (green button)
   - **Name**: `AWS_ACCOUNT_ID`
   - **Secret**: Your 12-digit account ID (e.g., `123456789012`)
   - Click **Add secret**

5. **Add AWS_ACCESS_KEY_ID**
   - Click **New repository secret**
   - **Name**: `AWS_ACCESS_KEY_ID`
   - **Secret**: Your access key (e.g., `AKIAIOSFODNN7EXAMPLE`)
   - Click **Add secret**

6. **Add AWS_SECRET_ACCESS_KEY**
   - Click **New repository secret**
   - **Name**: `AWS_SECRET_ACCESS_KEY`
   - **Secret**: Your secret key (e.g., `wJalrXUtnFEMI/K7MDENG/...`)
   - Click **Add secret**

#### Method 2: Via GitHub CLI

```bash
# Install GitHub CLI if not already installed
# macOS: brew install gh
# Linux: See https://cli.github.com/

# Login to GitHub
gh auth login

# Add secrets
gh secret set AWS_ACCOUNT_ID --body "123456789012"
gh secret set AWS_ACCESS_KEY_ID --body "AKIAIOSFODNN7EXAMPLE"
gh secret set AWS_SECRET_ACCESS_KEY --body "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY"
```

### Verify Secrets Were Added

**In GitHub Web UI:**
1. Go to **Settings** → **Secrets and variables** → **Actions**
2. You should see 3 secrets listed:
   - `AWS_ACCESS_KEY_ID` (Updated X time ago)
   - `AWS_ACCOUNT_ID` (Updated X time ago)
   - `AWS_SECRET_ACCESS_KEY` (Updated X time ago)
3. ⚠️ You **cannot view** secret values (by design)

**Via GitHub CLI:**
```bash
gh secret list
```

Expected output:
```
AWS_ACCESS_KEY_ID        Updated 2026-02-03
AWS_ACCOUNT_ID           Updated 2026-02-03
AWS_SECRET_ACCESS_KEY    Updated 2026-02-03
```

---

## 4. Terraform Variables

### Create terraform.tfvars

**Location:** `terraform/terraform.tfvars`

```bash
cd terraform
cp terraform.tfvars.example terraform.tfvars
```

### Edit terraform.tfvars

```hcl
# Required: Your AWS Account ID
aws_account_id = "123456789012"  # Replace with your actual account ID

# AWS Region (default: ap-south-1 - Mumbai)
aws_region = "ap-south-1"

# Environment
environment = "production"  # or "development", "staging"

# Project Name
project_name = "portfolio"

# VPC Configuration
vpc_cidr = "10.0.0.0/16"
availability_zones = ["ap-south-1a", "ap-south-1b", "ap-south-1c"]

# EKS Configuration
eks_cluster_version = "1.28"
eks_cluster_name    = "portfolio-eks-cluster"

# Node Groups
node_group_general_desired_size = 2
node_group_general_min_size     = 1
node_group_general_max_size     = 4

# RDS Database
db_instance_class = "db.t3.micro"  # Free tier eligible
db_username       = "dbadmin"
enable_db_multi_az = false  # Set true for production HA

# Domain (leave empty if none)
domain_name         = ""  # e.g., "portfolio.example.com"
create_route53_zone = false

# Security
enable_waf = true
```

### Important Notes

⚠️ **Security:**
- `terraform.tfvars` is in `.gitignore` - **DO NOT COMMIT IT**
- Contains your account ID and configuration
- Each team member should have their own `terraform.tfvars`

✅ **Safe to Commit:**
- `terraform.tfvars.example` - Template without real values
- All `*.tf` files - Infrastructure code
- `backend-config.hcl.example` - Template

---

## 5. Kubernetes Secrets

### When to Create

After Terraform deploys EKS cluster and you have kubectl access.

### Database Password

```bash
# Generate a strong password
DB_PASSWORD=$(openssl rand -base64 32)

# Create secret in Kubernetes
kubectl create secret generic postgres-secret \
  --from-literal=password="$DB_PASSWORD" \
  --namespace=portfolio-prod

# Save password securely (e.g., password manager)
echo "Database password: $DB_PASSWORD"
```

### Chatbot Secrets

```bash
# Get OpenAI API Key from https://platform.openai.com/api-keys
OPENAI_API_KEY="sk-..."

# Generate application secret key
SECRET_KEY=$(openssl rand -hex 32)

# Create secret
kubectl create secret generic chatbot-secret \
  --from-literal=db-password="$DB_PASSWORD" \
  --from-literal=openai-api-key="$OPENAI_API_KEY" \
  --from-literal=secret-key="$SECRET_KEY" \
  --namespace=portfolio-prod
```

### SSL/TLS Certificate (if not using ACM)

```bash
# If you have your own certificate and key
kubectl create secret tls tls-secret \
  --cert=path/to/tls.crt \
  --key=path/to/tls.key \
  --namespace=portfolio-prod
```

---

## 6. Verification

### Test AWS Credentials Locally

```bash
# Configure AWS CLI with your IAM user credentials
aws configure
# Enter:
# - AWS Access Key ID: AKIAIOSFODNN7EXAMPLE
# - AWS Secret Access Key: wJalrXUtnFEMI/K7MDENG/...
# - Default region: ap-south-1
# - Default output format: json

# Test credentials
aws sts get-caller-identity
```

Expected output:
```json
{
    "UserId": "AIDACKCEVSQ6C2EXAMPLE",
    "Account": "123456789012",
    "Arn": "arn:aws:iam::123456789012:user/github-actions-cicd"
}
```

### Test ECR Access

```bash
# Login to ECR
aws ecr get-login-password --region ap-south-1 | \
  docker login --username AWS --password-stdin \
  123456789012.dkr.ecr.ap-south-1.amazonaws.com
```

Expected: `Login Succeeded`

### Test GitHub Actions

1. **Make a small change and push:**
   ```bash
   echo "# Test" >> README.md
   git add README.md
   git commit -m "Test CI/CD pipeline"
   git push origin develop
   ```

2. **Check workflow:**
   - Go to GitHub repository
   - Click **Actions** tab
   - You should see a workflow running
   - Click on it to view details

3. **Expected results:**
   - ✅ Security scanning completes
   - ✅ CodeQL analysis completes
   - ✅ Frontend build completes
   - ✅ Chatbot build completes
   - ✅ No AWS credential errors

### Test Terraform

```bash
cd terraform

# Initialize (sets up backend)
terraform init -backend-config=backend-config.hcl

# Validate configuration
terraform validate

# Plan (dry-run)
terraform plan
```

Expected: No errors about missing variables or credentials

---

## Security Best Practices

### DO ✅

1. **Use IAM users for programmatic access**
   - Not root account
   - Not personal AWS console users

2. **Enable MFA on AWS account**
   - Even if using IAM user for CI/CD
   - Protects against root account compromise

3. **Rotate credentials regularly**
   - Every 90 days minimum
   - Update in GitHub Secrets immediately

4. **Use least privilege principle**
   - Only grant permissions needed
   - Review IAM policies regularly

5. **Monitor credential usage**
   - Check AWS CloudTrail logs
   - Set up alerts for unusual activity

6. **Store secrets in password manager**
   - 1Password, LastPass, AWS Secrets Manager
   - Not in text files or Slack

### DON'T ❌

1. **Never commit credentials to git**
   - Check with `git log -p | grep -i 'aws_secret\|access_key'`
   - If found, rotate immediately

2. **Never share credentials**
   - Not via email, Slack, or screenshots
   - Use secure sharing tools if necessary

3. **Never use root account credentials**
   - Root has unlimited access
   - Create IAM users instead

4. **Never hardcode secrets in code**
   - Use environment variables
   - Use secrets management systems

5. **Never reuse credentials**
   - Different credentials for dev/staging/prod
   - Different credentials per application

---

## Credential Rotation

### When to Rotate

- ⚠️ **Immediately** if compromised
- ⚠️ **Immediately** if employee leaves
- 📅 **Every 90 days** (good practice)
- 📅 **Before major deployments** (optional)

### How to Rotate AWS Keys

1. **Create new access key** (AWS allows 2 active keys)
   - IAM Console → Users → Security credentials
   - Create access key (now you have 2 active)

2. **Update GitHub Secrets**
   - Settings → Secrets and variables → Actions
   - Update `AWS_ACCESS_KEY_ID`
   - Update `AWS_SECRET_ACCESS_KEY`

3. **Test new credentials**
   - Trigger a workflow run
   - Verify it works

4. **Delete old access key**
   - Only after confirming new one works
   - IAM Console → Users → Security credentials
   - Delete old key

---

## Troubleshooting

### Error: "AWS credentials not found"

**Cause:** GitHub Secrets not configured correctly

**Fix:**
1. Verify secrets exist: Settings → Secrets and variables → Actions
2. Check spelling: Must be exactly `AWS_ACCESS_KEY_ID` (not `aws_access_key_id`)
3. Re-create secrets if necessary

### Error: "Access Denied"

**Cause:** IAM user lacks required permissions

**Fix:**
1. Review IAM user policies
2. Add missing permissions
3. Test with AWS CLI: `aws ecr describe-repositories`

### Error: "Invalid account ID"

**Cause:** Wrong account ID in secrets or variables

**Fix:**
1. Get correct account ID: `aws sts get-caller-identity --query Account --output text`
2. Update GitHub Secret: `AWS_ACCOUNT_ID`
3. Update `terraform.tfvars`: `aws_account_id`

### Error: "Could not find backend configuration"

**Cause:** Missing `backend-config.hcl`

**Fix:**
1. Run backend setup: `./scripts/setup-backend.sh`
2. Or create manually from `backend-config.hcl.example`

---

## Summary Checklist

### AWS Setup
- [ ] Get AWS Account ID
- [ ] Create IAM user: `github-actions-cicd`
- [ ] Attach IAM policies
- [ ] Create access keys
- [ ] Save credentials securely

### GitHub Setup
- [ ] Add secret: `AWS_ACCOUNT_ID`
- [ ] Add secret: `AWS_ACCESS_KEY_ID`
- [ ] Add secret: `AWS_SECRET_ACCESS_KEY`
- [ ] Verify secrets are listed

### Terraform Setup
- [ ] Copy `terraform.tfvars.example` to `terraform.tfvars`
- [ ] Edit `terraform.tfvars` with your values
- [ ] Run `./scripts/setup-backend.sh`
- [ ] Initialize: `terraform init -backend-config=backend-config.hcl`

### Kubernetes Setup (after EKS deployed)
- [ ] Create database password secret
- [ ] Create chatbot secrets
- [ ] Create TLS certificate secret (if needed)

### Verification
- [ ] Test AWS CLI locally
- [ ] Test ECR access
- [ ] Push to GitHub and verify workflow runs
- [ ] Run terraform plan successfully

---

## Additional Resources

- [AWS IAM Best Practices](https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html)
- [GitHub Secrets Documentation](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- [Terraform Variables](https://www.terraform.io/docs/language/values/variables.html)
- [Kubernetes Secrets](https://kubernetes.io/docs/concepts/configuration/secret/)
- [AWS CLI Configuration](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-files.html)

---

**Last Updated:** February 3, 2026  
**Maintained by:** Kalyan
