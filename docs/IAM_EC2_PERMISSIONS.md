# Missing EC2 Permissions Fix

## Problem

Terraform is failing with EC2 permission errors:

```
Error: You are not authorized to perform this operation. 
User: arn:aws:iam::688567293805:user/github-actions-cicd is not authorized to perform: 
- ec2:DescribeAvailabilityZones
- ec2:DescribeImages
```

**Root Cause:** The `github-actions-cicd` IAM user needs EC2 read permissions for Terraform data sources.

---

## Quick Fix

### Option 1: Attach AmazonEC2ReadOnlyAccess Policy

**Fastest solution:**

```bash
aws iam attach-user-policy \
    --user-name github-actions-cicd \
    --policy-arn arn:aws:iam::aws:policy/AmazonEC2ReadOnlyAccess
```

This provides all EC2 read permissions needed for Terraform.

### Option 2: Attach EC2FullAccess (For Full Infrastructure Management)

**If you need to create EC2 resources:**

```bash
aws iam attach-user-policy \
    --user-name github-actions-cicd \
    --policy-arn arn:aws:iam::aws:policy/AmazonEC2FullAccess
```

---

## Why These Permissions Are Needed

### ec2:DescribeAvailabilityZones

**Used by:** `data.aws_availability_zones.available` in `data.tf`

**Purpose:** Terraform needs to fetch available AZs in your region to:
- Place subnets across multiple AZs
- Ensure high availability
- Validate AZ configuration

```hcl
data "aws_availability_zones" "available" {
  state = "available"
}
```

### ec2:DescribeImages

**Used by:** `data.aws_ami.eks_default` and `data.aws_ami.eks_gpu` in `data.tf`

**Purpose:** Terraform needs to fetch EKS-optimized AMI IDs for:
- General workload node groups
- GPU workload node groups
- Ensuring latest AMI versions

```hcl
data "aws_ami" "eks_default" {
  most_recent = true
  owners      = ["amazon"]
  # ... filter for EKS AMI
}
```

---

## Complete IAM Policies Summary

Your `github-actions-cicd` user should have these policies attached:

| Policy | Purpose | Status |
|--------|---------|--------|
| AmazonEC2ContainerRegistryPowerUser | ECR operations | ✅ Attached |
| AmazonS3FullAccess | Terraform state storage | ✅ Attached |
| AmazonDynamoDBFullAccess | Terraform state locking | ✅ Attached |
| AmazonVPCFullAccess | Network infrastructure | ✅ Attached |
| AmazonRDSFullAccess | Database management | ✅ Attached |
| IAMFullAccess | Role creation | ✅ Attached |
| **AmazonEC2ReadOnlyAccess** | **EC2 data queries** | ❌ **MISSING** |
| AmazonEKSClusterPolicy | EKS management | Recommended |

---

## Verify Permissions

```bash
# List all attached policies
aws iam list-attached-user-policies --user-name github-actions-cicd

# Test EC2 permissions
aws ec2 describe-availability-zones --region ap-south-1
aws ec2 describe-images --owners amazon --region ap-south-1 --max-items 1
```

**Expected:** Both commands should return data without errors.

---

## After Fixing Permissions

1. **Wait 30 seconds** for IAM changes to propagate
2. **Re-run terraform plan:**

```bash
cd terraform
terraform plan
```

**Expected result:** 
- ✅ No EC2 permission errors
- ✅ S3 lifecycle warning only (not a blocker)
- ✅ Plan shows resources to be created

---

## All Fixes Applied in This Session

✅ **S3 Lifecycle:** Added required `filter {}` block  
✅ **EKS Taint Effect:** Changed `NoSchedule` to `NO_SCHEDULE`  
✅ **Module Variable Types:** Changed `map(any)` to `any` for flexibility  
✅ **Null Value Handling:** Updated dynamic blocks to handle null  
❌ **IAM EC2 Permissions:** Waiting for you to attach policy  

---

## Summary Commands

```bash
# 1. Fix IAM permissions
aws iam attach-user-policy \
    --user-name github-actions-cicd \
    --policy-arn arn:aws:iam::aws:policy/AmazonEC2ReadOnlyAccess

# 2. Verify
aws iam list-attached-user-policies --user-name github-actions-cicd

# 3. Test Terraform
cd terraform
terraform plan

# 4. If plan succeeds, apply
terraform apply
```

---

**Created:** February 14, 2026  
**Your Account:** 688567293805  
**Your Region:** ap-south-1  
**Your User:** github-actions-cicd  
**Status:** 🔧 Needs EC2 read permissions
