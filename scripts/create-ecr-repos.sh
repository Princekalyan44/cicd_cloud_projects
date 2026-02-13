#!/bin/bash

# Script to create ECR repositories for the CI/CD pipeline
# Run this before running the CI/CD pipeline for the first time

set -e

# Configuration
AWS_REGION="${AWS_REGION:-ap-south-1}"
REPO_NAMES=("portfolio-frontend" "portfolio-chatbot")

echo "========================================"
echo "Creating ECR Repositories"
echo "Region: $AWS_REGION"
echo "========================================"
echo ""

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo "Error: AWS CLI is not installed"
    echo "Install it from: https://aws.amazon.com/cli/"
    exit 1
fi

# Check AWS credentials
if ! aws sts get-caller-identity &> /dev/null; then
    echo "Error: AWS credentials not configured"
    echo "Run: aws configure"
    exit 1
fi

echo "✓ AWS CLI configured"
AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
echo "✓ AWS Account ID: $AWS_ACCOUNT_ID"
echo ""

# Function to create ECR repository
create_ecr_repo() {
    local repo_name=$1
    
    echo "Creating repository: $repo_name"
    
    # Check if repository already exists
    if aws ecr describe-repositories --repository-names "$repo_name" --region "$AWS_REGION" &> /dev/null; then
        echo "  ℹ Repository '$repo_name' already exists"
        echo "  ✓ URI: $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$repo_name"
    else
        # Create repository
        aws ecr create-repository \
            --repository-name "$repo_name" \
            --region "$AWS_REGION" \
            --image-scanning-configuration scanOnPush=true \
            --encryption-configuration encryptionType=AES256 \
            --tags Key=Project,Value=portfolio Key=ManagedBy,Value=script \
            --output json > /dev/null
        
        echo "  ✓ Repository created successfully"
        echo "  ✓ URI: $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$repo_name"
        
        # Set lifecycle policy to keep only last 10 images
        echo "  → Setting lifecycle policy (keep last 10 images)..."
        aws ecr put-lifecycle-policy \
            --repository-name "$repo_name" \
            --region "$AWS_REGION" \
            --lifecycle-policy-text '{
                "rules": [
                    {
                        "rulePriority": 1,
                        "description": "Keep only last 10 images",
                        "selection": {
                            "tagStatus": "any",
                            "countType": "imageCountMoreThan",
                            "countNumber": 10
                        },
                        "action": {
                            "type": "expire"
                        }
                    }
                ]
            }' > /dev/null
        
        echo "  ✓ Lifecycle policy set"
    fi
    echo ""
}

# Create all repositories
for repo in "${REPO_NAMES[@]}"; do
    create_ecr_repo "$repo"
done

echo "========================================"
echo "✅ All ECR repositories are ready!"
echo "========================================"
echo ""
echo "Repository URIs:"
for repo in "${REPO_NAMES[@]}"; do
    echo "  - $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$repo"
done
echo ""
echo "Next steps:"
echo "  1. Ensure GitHub Secrets are configured:"
echo "     - AWS_ACCOUNT_ID: $AWS_ACCOUNT_ID"
echo "     - AWS_ACCESS_KEY_ID: <your-access-key>"
echo "     - AWS_SECRET_ACCESS_KEY: <your-secret-key>"
echo "  2. Push to develop/main branch to trigger CI/CD pipeline"
echo "  3. Check GitHub Actions: https://github.com/<your-org>/<your-repo>/actions"
echo ""
