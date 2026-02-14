# Complete IAM Permissions Fix

## Current Errors Summary

Your `github-actions-cicd` user is missing these permissions:

| Missing Permission | Resource | Error |
|-------------------|----------|-------|
| `ecr:TagResource` | ECR repositories | ❌ Cannot tag ECR repos |
| `iam:CreateRole` | IAM roles | ❌ Cannot create EKS/VPC roles |
| `ec2:CreateVpc` | VPC | ❌ Cannot create VPC |
| `ec2:AllocateAddress` | Elastic IPs | ❌ Cannot create NAT gateway IPs |
| `logs:CreateLogGroup` | CloudWatch Logs | ❌ Cannot create VPC flow logs |
| `rds:CreateDBParameterGroup` | RDS | ❌ Cannot create DB parameter group |
| `wafv2:CreateWebACL` | WAF | ❌ Cannot create WAF rules |

---

## Quick Fix (Recommended)

### Option 1: Automated Script

**Run the provided script to fix all permissions at once:**

```bash
# Pull latest changes
git pull origin develop

# Make script executable
chmod +x scripts/fix-all-iam-permissions.sh

# Run the script
./scripts/fix-all-iam-permissions.sh
```

**What it does:**
- Attaches 10 AWS managed policies
- Creates custom WAF policy
- Shows summary of attached policies
- Takes ~30 seconds

**Expected output:**
```
========================================
Fixing IAM Permissions for Terraform
User: github-actions-cicd
========================================

✓ AWS CLI configured
✓ AWS Account ID: 688567293805

Attaching AWS managed policies...

Attaching: AmazonEC2ContainerRegistryFullAccess
  ✓ Attached successfully
Attaching: AmazonEC2FullAccess
  ✓ Attached successfully
...

========================================
✅ All IAM permissions configured!
========================================
```

---

## Manual Fix (Alternative)

If you prefer manual commands:

```bash
USER_NAME="github-actions-cicd"

# ECR Full Access (includes TagResource)
aws iam attach-user-policy \
    --user-name $USER_NAME \
    --policy-arn arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryFullAccess

# EC2 Full Access (includes CreateVpc, AllocateAddress)
aws iam attach-user-policy \
    --user-name $USER_NAME \
    --policy-arn arn:aws:iam::aws:policy/AmazonEC2FullAccess

# IAM Full Access (includes CreateRole)
aws iam attach-user-policy \
    --user-name $USER_NAME \
    --policy-arn arn:aws:iam::aws:policy/IAMFullAccess

# RDS Full Access (includes CreateDBParameterGroup)
aws iam attach-user-policy \
    --user-name $USER_NAME \
    --policy-arn arn:aws:iam::aws:policy/AmazonRDSFullAccess

# CloudWatch Logs Full Access (includes CreateLogGroup)
aws iam attach-user-policy \
    --user-name $USER_NAME \
    --policy-arn arn:aws:iam::aws:policy/CloudWatchLogsFullAccess

# EKS Cluster Policy
aws iam attach-user-policy \
    --user-name $USER_NAME \
    --policy-arn arn:aws:iam::aws:policy/AmazonEKSClusterPolicy

# VPC Full Access
aws iam attach-user-policy \
    --user-name $USER_NAME \
    --policy-arn arn:aws:iam::aws:policy/AmazonVPCFullAccess

# S3 Full Access
aws iam attach-user-policy \
    --user-name $USER_NAME \
    --policy-arn arn:aws:iam::aws:policy/AmazonS3FullAccess

# DynamoDB Full Access
aws iam attach-user-policy \
    --user-name $USER_NAME \
    --policy-arn arn:aws:iam::aws:policy/AmazonDynamoDBFullAccess

# Elastic Load Balancing Full Access
aws iam attach-user-policy \
    --user-name $USER_NAME \
    --policy-arn arn:aws:iam::aws:policy/ElasticLoadBalancingFullAccess
```

### WAF Custom Policy

```bash
# Get account ID
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)

# Create WAF policy
cat > waf-policy.json <<'EOF'
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["wafv2:*"],
      "Resource": "*"
    }
  ]
}
EOF

aws iam create-policy \
    --policy-name TerraformWAFPolicy \
    --policy-document file://waf-policy.json

# Attach WAF policy
aws iam attach-user-policy \
    --user-name $USER_NAME \
    --policy-arn arn:aws:iam::${ACCOUNT_ID}:policy/TerraformWAFPolicy

rm waf-policy.json
```

---

## Complete Policy List

After running the script, your user will have:

| # | Policy Name | Purpose |
|---|-------------|----------|
| 1 | AmazonEC2ContainerRegistryFullAccess | ECR repositories (including tagging) |
| 2 | AmazonEC2FullAccess | VPC, subnets, security groups, EIPs |
| 3 | AmazonEKSClusterPolicy | EKS cluster management |
| 4 | IAMFullAccess | Create roles for EKS, VPC flow logs |
| 5 | AmazonRDSFullAccess | RDS database and parameter groups |
| 6 | AmazonS3FullAccess | S3 buckets for artifacts |
| 7 | AmazonDynamoDBFullAccess | Terraform state locking |
| 8 | AmazonVPCFullAccess | Network infrastructure |
| 9 | CloudWatchLogsFullAccess | VPC flow logs |
| 10 | ElasticLoadBalancingFullAccess | Application Load Balancer |
| 11 | TerraformWAFPolicy (custom) | WAF web ACL |

---

## Verification

### Check Attached Policies

```bash
aws iam list-attached-user-policies --user-name github-actions-cicd
```

### Test Permissions

```bash
# Test ECR
aws ecr describe-repositories --region ap-south-1

# Test EC2
aws ec2 describe-vpcs --region ap-south-1

# Test IAM
aws iam list-roles --max-items 1

# Test RDS
aws rds describe-db-parameter-groups --region ap-south-1

# Test CloudWatch Logs
aws logs describe-log-groups --region ap-south-1 --max-items 1
```

**All commands should return data without errors.**

---

## After Fixing Permissions

**Wait 30 seconds** for IAM changes to propagate globally, then:

```bash
cd terraform
terraform plan
```

**Expected result:**
```
Plan: XX to add, 0 to change, 0 to destroy.
```

No permission errors! ✅

### If Plan Succeeds

```bash
# Apply the infrastructure
terraform apply

# Type 'yes' when prompted
```

**Deployment time:** ~15-20 minutes for complete infrastructure.

---

## Security Note

⚠️ **For Production:** These are full access policies suitable for development/learning.

For production environments:
1. Create custom policies with least privilege
2. Limit resources by tags
3. Use conditions and resource ARNs
4. Review the IAM_PERMISSIONS_FIX.md guide for least-privilege examples

---

## Troubleshooting

### Still Getting Permission Errors?

**Wait longer:** IAM changes can take up to 1 minute to propagate.

```bash
# Wait and retry
sleep 60
terraform plan
```

### Check Current Identity

```bash
aws sts get-caller-identity
```

**Expected:**
```json
{
    "UserId": "AIDAXXXXXXXXXXXXXXXXX",
    "Account": "688567293805",
    "Arn": "arn:aws:iam::688567293805:user/github-actions-cicd"
}
```

### Policy Already Attached Error

This is **normal** and **safe to ignore**. It means the policy was already attached from a previous run.

---

## Summary

✅ **Single command to fix all:**
```bash
./scripts/fix-all-iam-permissions.sh
```

✅ **Then deploy:**
```bash
cd terraform
terraform plan
terraform apply
```

🎉 **Your infrastructure will be deployed!**

---

**Created:** February 14, 2026  
**Account:** 688567293805  
**Region:** ap-south-1  
**User:** github-actions-cicd  
**Status:** 🛠️ Ready to fix
