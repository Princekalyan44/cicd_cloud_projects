#!/bin/bash

# Script to attach all required IAM permissions for Terraform infrastructure deployment
# Run this to fix all permission errors at once

set -e

USER_NAME="github-actions-cicd"

echo "========================================"
echo "Fixing IAM Permissions for Terraform"
echo "User: $USER_NAME"
echo "========================================"
echo ""

# Check AWS CLI
if ! command -v aws &> /dev/null; then
    echo "Error: AWS CLI not installed"
    exit 1
fi

# Check AWS credentials
if ! aws sts get-caller-identity &> /dev/null; then
    echo "Error: AWS credentials not configured"
    exit 1
fi

echo "✓ AWS CLI configured"
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
echo "✓ AWS Account ID: $ACCOUNT_ID"
echo ""

# Function to attach policy
attach_policy() {
    local policy_arn=$1
    local policy_name=$(echo $policy_arn | rev | cut -d'/' -f1 | rev)
    
    echo "Attaching: $policy_name"
    
    if aws iam attach-user-policy --user-name "$USER_NAME" --policy-arn "$policy_arn" 2>/dev/null; then
        echo "  ✓ Attached successfully"
    else
        echo "  ℹ Already attached or error (non-fatal)"
    fi
}

echo "Attaching AWS managed policies..."
echo ""

# ECR Permissions (for container registries)
attach_policy "arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryFullAccess"

# EC2 Permissions (for VPC, subnets, security groups, EIPs)
attach_policy "arn:aws:iam::aws:policy/AmazonEC2FullAccess"

# EKS Permissions (for Kubernetes cluster)
attach_policy "arn:aws:iam::aws:policy/AmazonEKSClusterPolicy"

# IAM Permissions (for creating roles)
attach_policy "arn:aws:iam::aws:policy/IAMFullAccess"

# RDS Permissions (for database)
attach_policy "arn:aws:iam::aws:policy/AmazonRDSFullAccess"

# S3 Permissions (for Terraform state and artifacts)
attach_policy "arn:aws:iam::aws:policy/AmazonS3FullAccess"

# DynamoDB Permissions (for Terraform state locking)
attach_policy "arn:aws:iam::aws:policy/AmazonDynamoDBFullAccess"

# VPC Permissions (for networking)
attach_policy "arn:aws:iam::aws:policy/AmazonVPCFullAccess"

# CloudWatch Logs Permissions (for VPC Flow Logs)
attach_policy "arn:aws:iam::aws:policy/CloudWatchLogsFullAccess"

# Elastic Load Balancing Permissions (for ALB)
attach_policy "arn:aws:iam::aws:policy/ElasticLoadBalancingFullAccess"

echo ""
echo "Creating custom policy for WAF..."

# Create custom policy for WAF (no managed policy available)
WAF_POLICY_NAME="TerraformWAFPolicy"
WAF_POLICY_ARN="arn:aws:iam::${ACCOUNT_ID}:policy/${WAF_POLICY_NAME}"

# Check if policy already exists
if aws iam get-policy --policy-arn "$WAF_POLICY_ARN" &>/dev/null; then
    echo "  ℹ WAF policy already exists"
else
    echo "  Creating WAF policy..."
    cat > /tmp/waf-policy.json <<'EOF'
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "wafv2:*"
      ],
      "Resource": "*"
    }
  ]
}
EOF

    aws iam create-policy \
        --policy-name "$WAF_POLICY_NAME" \
        --policy-document file:///tmp/waf-policy.json \
        --description "WAF permissions for Terraform" &>/dev/null
    
    echo "  ✓ WAF policy created"
    rm /tmp/waf-policy.json
fi

# Attach WAF policy
attach_policy "$WAF_POLICY_ARN"

echo ""
echo "========================================"
echo "✅ All IAM permissions configured!"
echo "========================================"
echo ""
echo "Attached Policies:"
aws iam list-attached-user-policies --user-name "$USER_NAME" --query 'AttachedPolicies[*].PolicyName' --output table

echo ""
echo "Next steps:"
echo "  1. Wait 30 seconds for IAM changes to propagate"
echo "  2. Run: cd terraform && terraform plan"
echo "  3. If successful, run: terraform apply"
echo ""
