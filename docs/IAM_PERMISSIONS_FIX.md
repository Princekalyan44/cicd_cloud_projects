# IAM Permissions Fix Guide

## Problem

You're encountering permission errors:

```
AccessDeniedException: User: arn:aws:iam::688567293805:user/github-actions-cicd 
is not authorized to perform: dynamodb:CreateTable on resource: 
arn:aws:dynamodb:ap-south-1:688567293805:table/portfolio-terraform-locks
```

**Root Cause:** The `github-actions-cicd` IAM user lacks required permissions for Terraform backend setup and infrastructure deployment.

---

## Solution Overview

The IAM user needs permissions for:
1. **DynamoDB** - Terraform state locking
2. **S3** - Terraform state storage
3. **ECR** - Container registry operations
4. **EKS** - Kubernetes cluster management
5. **VPC, EC2, RDS, etc.** - Infrastructure provisioning

---

## Quick Fix (Recommended for Development)

### Option 1: Using AWS Console

1. **Go to IAM Console:**
   - Navigate to [IAM Users](https://console.aws.amazon.com/iam/home#/users)
   - Click on user: **`github-actions-cicd`**

2. **Attach Policies:**
   - Click **"Add permissions"** → **"Attach policies directly"**
   - Search and attach these AWS managed policies:

   ✅ **Required Policies:**
   - `AmazonEC2ContainerRegistryPowerUser` (for ECR)
   - `AmazonEKSClusterPolicy` (for EKS)
   - `AmazonS3FullAccess` (for Terraform state)
   - `AmazonDynamoDBFullAccess` (for Terraform locks)
   - `AmazonVPCFullAccess` (for network resources)
   - `AmazonRDSFullAccess` (for database)
   - `IAMFullAccess` (for role creation)

3. **Click "Next"** → **"Add permissions"**

### Option 2: Using AWS CLI

```bash
# Set your IAM user
USER_NAME="github-actions-cicd"

# Attach required policies
aws iam attach-user-policy \
    --user-name $USER_NAME \
    --policy-arn arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryPowerUser

aws iam attach-user-policy \
    --user-name $USER_NAME \
    --policy-arn arn:aws:iam::aws:policy/AmazonEKSClusterPolicy

aws iam attach-user-policy \
    --user-name $USER_NAME \
    --policy-arn arn:aws:iam::aws:policy/AmazonS3FullAccess

aws iam attach-user-policy \
    --user-name $USER_NAME \
    --policy-arn arn:aws:iam::aws:policy/AmazonDynamoDBFullAccess

aws iam attach-user-policy \
    --user-name $USER_NAME \
    --policy-arn arn:aws:iam::aws:policy/AmazonVPCFullAccess

aws iam attach-user-policy \
    --user-name $USER_NAME \
    --policy-arn arn:aws:iam::aws:policy/AmazonRDSFullAccess

aws iam attach-user-policy \
    --user-name $USER_NAME \
    --policy-arn arn:aws:iam::aws:policy/IAMFullAccess
```

---

## Secure Fix (Recommended for Production)

### Create Custom Policy with Least Privilege

Create a custom policy file: `terraform-cicd-policy.json`

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "TerraformStateManagement",
      "Effect": "Allow",
      "Action": [
        "s3:ListBucket",
        "s3:GetObject",
        "s3:PutObject",
        "s3:DeleteObject"
      ],
      "Resource": [
        "arn:aws:s3:::portfolio-terraform-state-*",
        "arn:aws:s3:::portfolio-terraform-state-*/*"
      ]
    },
    {
      "Sid": "TerraformStateLocking",
      "Effect": "Allow",
      "Action": [
        "dynamodb:CreateTable",
        "dynamodb:DescribeTable",
        "dynamodb:GetItem",
        "dynamodb:PutItem",
        "dynamodb:DeleteItem",
        "dynamodb:TagResource"
      ],
      "Resource": "arn:aws:dynamodb:*:*:table/portfolio-terraform-locks"
    },
    {
      "Sid": "ECRManagement",
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
        "ecr:PutLifecyclePolicy"
      ],
      "Resource": "*"
    },
    {
      "Sid": "EKSManagement",
      "Effect": "Allow",
      "Action": [
        "eks:*",
        "ec2:DescribeSecurityGroups",
        "ec2:DescribeSubnets",
        "ec2:DescribeVpcs"
      ],
      "Resource": "*"
    },
    {
      "Sid": "VPCAndNetworking",
      "Effect": "Allow",
      "Action": [
        "ec2:*Vpc*",
        "ec2:*Subnet*",
        "ec2:*SecurityGroup*",
        "ec2:*InternetGateway*",
        "ec2:*NatGateway*",
        "ec2:*RouteTable*",
        "ec2:*Route",
        "ec2:*Address*",
        "ec2:Describe*",
        "ec2:CreateTags",
        "ec2:DeleteTags"
      ],
      "Resource": "*"
    },
    {
      "Sid": "RDSManagement",
      "Effect": "Allow",
      "Action": [
        "rds:*"
      ],
      "Resource": "*"
    },
    {
      "Sid": "IAMRoleManagement",
      "Effect": "Allow",
      "Action": [
        "iam:CreateRole",
        "iam:GetRole",
        "iam:DeleteRole",
        "iam:AttachRolePolicy",
        "iam:DetachRolePolicy",
        "iam:PutRolePolicy",
        "iam:DeleteRolePolicy",
        "iam:GetRolePolicy",
        "iam:ListAttachedRolePolicies",
        "iam:ListRolePolicies",
        "iam:TagRole",
        "iam:CreateOpenIDConnectProvider",
        "iam:GetOpenIDConnectProvider",
        "iam:DeleteOpenIDConnectProvider",
        "iam:TagOpenIDConnectProvider"
      ],
      "Resource": "*"
    },
    {
      "Sid": "LoadBalancerManagement",
      "Effect": "Allow",
      "Action": [
        "elasticloadbalancing:*"
      ],
      "Resource": "*"
    },
    {
      "Sid": "WAFManagement",
      "Effect": "Allow",
      "Action": [
        "wafv2:*"
      ],
      "Resource": "*"
    },
    {
      "Sid": "AutoScalingManagement",
      "Effect": "Allow",
      "Action": [
        "autoscaling:*"
      ],
      "Resource": "*"
    }
  ]
}
```

### Apply the Custom Policy

```bash
# Create the policy
aws iam create-policy \
    --policy-name TerraformCICDPolicy \
    --policy-document file://terraform-cicd-policy.json

# Get your account ID
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)

# Attach the policy to the user
aws iam attach-user-policy \
    --user-name github-actions-cicd \
    --policy-arn arn:aws:iam::${ACCOUNT_ID}:policy/TerraformCICDPolicy
```

---

## Verification

### Check Attached Policies

```bash
# List policies attached to user
aws iam list-attached-user-policies --user-name github-actions-cicd
```

**Expected output:**
```json
{
    "AttachedPolicies": [
        {
            "PolicyName": "AmazonEC2ContainerRegistryPowerUser",
            "PolicyArn": "arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryPowerUser"
        },
        {
            "PolicyName": "AmazonS3FullAccess",
            "PolicyArn": "arn:aws:iam::aws:policy/AmazonS3FullAccess"
        },
        {
            "PolicyName": "AmazonDynamoDBFullAccess",
            "PolicyArn": "arn:aws:iam::aws:policy/AmazonDynamoDBFullAccess"
        }
        // ... other policies
    ]
}
```

### Test DynamoDB Access

```bash
# Test creating a table (will be used by Terraform)
aws dynamodb describe-table \
    --table-name portfolio-terraform-locks \
    --region ap-south-1 2>&1 || echo "Table doesn't exist yet (expected)"
```

---

## Alternative: Use Administrator Access (Not Recommended)

⚠️ **WARNING:** Only use for development/learning. Never in production!

```bash
aws iam attach-user-policy \
    --user-name github-actions-cicd \
    --policy-arn arn:aws:iam::aws:policy/AdministratorAccess
```

**Why not recommended:**
- Violates principle of least privilege
- Security risk if credentials are compromised
- Against AWS best practices

---

## After Fixing Permissions

### Re-run Terraform Backend Setup

```bash
cd terraform/scripts
./setup-backend.sh
```

**Expected output:**
```
========================================
Terraform Backend Setup
========================================

✓ AWS CLI is configured
✓ Account ID: 688567293805
✓ Region: ap-south-1

✓ S3 bucket created: portfolio-terraform-state-688567293805
✓ Versioning enabled
✓ Encryption enabled
✓ DynamoDB table created: portfolio-terraform-locks
✓ Backend configuration saved: backend-config.hcl

========================================
✅ Terraform backend is ready!
========================================
```

### Re-run Terraform Init

```bash
cd terraform
terraform init -backend-config=backend-config.hcl
```

---

## Troubleshooting

### Still Getting Permission Errors?

**Check if policies are attached:**
```bash
aws iam list-attached-user-policies --user-name github-actions-cicd
```

**Wait for propagation:**
IAM changes can take 5-10 seconds to propagate. Wait a minute and retry.

**Check your AWS credentials:**
```bash
aws sts get-caller-identity
```

Ensure the output shows user: `github-actions-cicd`

### Error: "Policy already exists"

If the custom policy already exists:
```bash
# Get the policy ARN
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
POLICY_ARN="arn:aws:iam::${ACCOUNT_ID}:policy/TerraformCICDPolicy"

# Attach it to the user
aws iam attach-user-policy \
    --user-name github-actions-cicd \
    --policy-arn $POLICY_ARN
```

---

## Summary of Required Permissions

| Service | Purpose | Policy |
|---------|---------|--------|
| DynamoDB | Terraform state locking | CreateTable, GetItem, PutItem, DeleteItem |
| S3 | Terraform state storage | ListBucket, GetObject, PutObject |
| ECR | Container images | Create repos, push images |
| EKS | Kubernetes cluster | Full EKS management |
| VPC | Networking | Create VPC, subnets, routes |
| EC2 | Compute resources | Create instances, security groups |
| RDS | Database | Create DB instances |
| IAM | Service roles | Create and manage roles |
| ELB | Load balancers | Create ALB/NLB |
| WAF | Web firewall | Create WAF rules |

---

## Next Steps

1. ✅ **Fix IAM permissions** (follow Option 1 or 2 above)
2. ✅ **Re-run backend setup**: `./terraform/scripts/setup-backend.sh`
3. ✅ **Initialize Terraform**: `terraform init -backend-config=backend-config.hcl`
4. ✅ **Deploy infrastructure**: `terraform plan && terraform apply`
5. ✅ **Run CI/CD pipeline**: Push to develop/main branch

---

**Created:** February 14, 2026  
**Your Account ID:** 688567293805  
**Your Region:** ap-south-1  
**Your IAM User:** github-actions-cicd  
**Status:** 🔧 Needs permission update
