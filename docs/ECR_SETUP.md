# ECR Setup Guide

## Problem

The CI/CD pipeline fails with:
```
ERROR: failed to push ***.dkr.ecr.ap-south-1.amazonaws.com/portfolio-frontend:develop: 
unknown: The repository with name 'portfolio-frontend' does not exist in the registry
```

**Root Cause:** ECR repositories must be created before the CI/CD pipeline can push Docker images.

---

## Solution

### Option 1: Automated Script (Recommended)

**Run the provided script to create both repositories:**

```bash
# Navigate to scripts directory
cd scripts

# Make script executable
chmod +x create-ecr-repos.sh

# Run the script
./create-ecr-repos.sh
```

**What the script does:**
- Creates `portfolio-frontend` ECR repository
- Creates `portfolio-chatbot` ECR repository
- Enables image scanning on push (security)
- Sets lifecycle policy to keep only last 10 images (cost optimization)
- Enables AES256 encryption
- Adds project tags

**Expected output:**
```
========================================
Creating ECR Repositories
Region: ap-south-1
========================================

✓ AWS CLI configured
✓ AWS Account ID: 123456789012

Creating repository: portfolio-frontend
  ✓ Repository created successfully
  ✓ URI: 123456789012.dkr.ecr.ap-south-1.amazonaws.com/portfolio-frontend
  ✓ Lifecycle policy set

Creating repository: portfolio-chatbot
  ✓ Repository created successfully
  ✓ URI: 123456789012.dkr.ecr.ap-south-1.amazonaws.com/portfolio-chatbot
  ✓ Lifecycle policy set

========================================
✅ All ECR repositories are ready!
========================================
```

---

### Option 2: Manual Creation via AWS Console

1. **Go to AWS Console:**
   - Navigate to [ECR Console](https://console.aws.amazon.com/ecr/repositories)
   - Select region: **ap-south-1** (Mumbai)

2. **Create portfolio-frontend repository:**
   - Click **"Create repository"**
   - Repository name: `portfolio-frontend`
   - Image scan on push: **Enabled**
   - Encryption: **AES-256**
   - Click **"Create repository"**

3. **Create portfolio-chatbot repository:**
   - Repeat above steps with name: `portfolio-chatbot`

4. **Set lifecycle policy (optional but recommended):**
   - Click on repository name
   - Go to **"Lifecycle policies"** tab
   - Click **"Create rule"**
   - Rule priority: `1`
   - Rule description: `Keep only last 10 images`
   - Image status: `Any`
   - Count type: `Image count more than`
   - Count number: `10`
   - Click **"Save"**

---

### Option 3: Manual Creation via AWS CLI

```bash
# Set your region
export AWS_REGION=ap-south-1

# Create portfolio-frontend repository
aws ecr create-repository \
    --repository-name portfolio-frontend \
    --region $AWS_REGION \
    --image-scanning-configuration scanOnPush=true \
    --encryption-configuration encryptionType=AES256

# Create portfolio-chatbot repository
aws ecr create-repository \
    --repository-name portfolio-chatbot \
    --region $AWS_REGION \
    --image-scanning-configuration scanOnPush=true \
    --encryption-configuration encryptionType=AES256

# Set lifecycle policy for frontend (keep last 10 images)
aws ecr put-lifecycle-policy \
    --repository-name portfolio-frontend \
    --region $AWS_REGION \
    --lifecycle-policy-text '{
        "rules": [{
            "rulePriority": 1,
            "description": "Keep only last 10 images",
            "selection": {
                "tagStatus": "any",
                "countType": "imageCountMoreThan",
                "countNumber": 10
            },
            "action": {"type": "expire"}
        }]
    }'

# Set lifecycle policy for chatbot (keep last 10 images)
aws ecr put-lifecycle-policy \
    --repository-name portfolio-chatbot \
    --region $AWS_REGION \
    --lifecycle-policy-text '{
        "rules": [{
            "rulePriority": 1,
            "description": "Keep only last 10 images",
            "selection": {
                "tagStatus": "any",
                "countType": "imageCountMoreThan",
                "countNumber": 10
            },
            "action": {"type": "expire"}
        }]
    }'
```

---

## Verification

### Check repositories were created:

```bash
# List ECR repositories
aws ecr describe-repositories --region ap-south-1

# Or list just the names
aws ecr describe-repositories \
    --region ap-south-1 \
    --query 'repositories[*].repositoryName' \
    --output table
```

**Expected output:**
```
--------------------------------
|   DescribeRepositories       |
+------------------------------+
|  portfolio-chatbot           |
|  portfolio-frontend          |
+------------------------------+
```

### Get repository URIs:

```bash
# Get frontend URI
aws ecr describe-repositories \
    --repository-names portfolio-frontend \
    --region ap-south-1 \
    --query 'repositories[0].repositoryUri' \
    --output text

# Get chatbot URI
aws ecr describe-repositories \
    --repository-names portfolio-chatbot \
    --region ap-south-1 \
    --query 'repositories[0].repositoryUri' \
    --output text
```

---

## GitHub Secrets Configuration

Ensure these secrets are configured in your GitHub repository:

1. Go to: **Settings → Secrets and variables → Actions**

2. Add these secrets:
   - `AWS_ACCOUNT_ID`: Your 12-digit AWS account ID
   - `AWS_ACCESS_KEY_ID`: IAM user access key
   - `AWS_SECRET_ACCESS_KEY`: IAM user secret key

3. Get your AWS Account ID:
   ```bash
   aws sts get-caller-identity --query Account --output text
   ```

---

## CI/CD Pipeline Flow

Once ECR repositories are created, the pipeline will:

1. ✅ Build Docker images for frontend and chatbot
2. ✅ Login to Amazon ECR
3. ✅ Tag images with branch name and git SHA
4. ✅ Push images to ECR repositories
5. ✅ Scan images with Trivy
6. ✅ Update Kubernetes manifests (on main branch)

---

## Cost Considerations

**ECR Pricing (ap-south-1):**
- Storage: $0.10 per GB per month
- Data transfer: Free to EC2/EKS in same region
- Lifecycle policy keeps only 10 images (saves costs)

**Estimated monthly cost:**
- 2 repositories × 5 images × 500 MB = ~5 GB
- Cost: ~$0.50/month

**Free Tier:**
- 500 MB storage/month for 12 months (new AWS accounts)

---

## Troubleshooting

### Error: "AWS credentials not configured"

**Solution:**
```bash
aws configure
# Enter your AWS Access Key ID
# Enter your AWS Secret Access Key
# Enter region: ap-south-1
# Enter output format: json
```

### Error: "Repository already exists"

**Solution:** This is fine! The script detects existing repositories and skips creation.

### Error: "AccessDenied when calling CreateRepository"

**Solution:** Your IAM user needs these permissions:
- `ecr:CreateRepository`
- `ecr:PutLifecyclePolicy`
- `ecr:PutImageScanningConfiguration`

Attach the **AmazonEC2ContainerRegistryFullAccess** managed policy to your IAM user.

### Error: Pipeline still fails after creating repos

**Check:**
1. Repositories exist in correct region (ap-south-1)
2. GitHub Secrets are configured correctly
3. AWS_ACCOUNT_ID matches your actual account ID

---

## Cleanup (Optional)

To delete repositories when no longer needed:

```bash
# Delete frontend repository (WARNING: deletes all images)
aws ecr delete-repository \
    --repository-name portfolio-frontend \
    --region ap-south-1 \
    --force

# Delete chatbot repository
aws ecr delete-repository \
    --repository-name portfolio-chatbot \
    --region ap-south-1 \
    --force
```

---

## Summary

✅ **Before first CI/CD run:**
1. Create ECR repositories (run `scripts/create-ecr-repos.sh`)
2. Configure GitHub Secrets (AWS credentials)
3. Push to develop/main branch

✅ **After setup:**
- CI/CD pipeline will automatically build and push images
- ECR will scan images for vulnerabilities
- Lifecycle policy will clean up old images

---

**Created:** February 13, 2026  
**Last Updated:** February 13, 2026  
**Status:** ✅ Ready to use
