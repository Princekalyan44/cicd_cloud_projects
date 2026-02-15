#!/bin/bash
# Script to create S3 backend and DynamoDB table for Terraform state

set -e

REGION="ap-south-1"
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
BUCKET_NAME="portfolio-terraform-state-${ACCOUNT_ID}"
DYNAMODB_TABLE="portfolio-terraform-locks"

echo "Setting up Terraform backend..."
echo "Region: $REGION"
echo "Bucket: $BUCKET_NAME"
echo "DynamoDB Table: $DYNAMODB_TABLE"

# Create S3 bucket
echo "Creating S3 bucket..."
if aws s3 ls "s3://${BUCKET_NAME}" 2>&1 | grep -q 'NoSuchBucket'; then
    aws s3api create-bucket \
        --bucket "${BUCKET_NAME}" \
        --region "${REGION}" \
        --create-bucket-configuration LocationConstraint="${REGION}"
    echo "Bucket created successfully"
else
    echo "Bucket already exists"
fi

# Enable versioning
echo "Enabling bucket versioning..."
aws s3api put-bucket-versioning \
    --bucket "${BUCKET_NAME}" \
    --versioning-configuration Status=Enabled

# Enable encryption
echo "Enabling server-side encryption..."
aws s3api put-bucket-encryption \
    --bucket "${BUCKET_NAME}" \
    --server-side-encryption-configuration '{
        "Rules": [{
            "ApplyServerSideEncryptionByDefault": {
                "SSEAlgorithm": "AES256"
            }
        }]
    }'

# Block public access
echo "Blocking public access..."
aws s3api put-public-access-block \
    --bucket "${BUCKET_NAME}" \
    --public-access-block-configuration \
        "BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true"

# Create DynamoDB table for state locking
echo "Creating DynamoDB table..."
if aws dynamodb describe-table --table-name "${DYNAMODB_TABLE}" --region "${REGION}" 2>&1 | grep -q 'ResourceNotFoundException'; then
    aws dynamodb create-table \
        --table-name "${DYNAMODB_TABLE}" \
        --attribute-definitions AttributeName=LockID,AttributeType=S \
        --key-schema AttributeName=LockID,KeyType=HASH \
        --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5 \
        --region "${REGION}"
    
    echo "Waiting for table to be active..."
    aws dynamodb wait table-exists --table-name "${DYNAMODB_TABLE}" --region "${REGION}"
    echo "DynamoDB table created successfully"
else
    echo "DynamoDB table already exists"
fi

echo ""
echo "Backend setup complete!"
echo "Update your terraform/backend.tf with:"
echo "  bucket         = \"${BUCKET_NAME}\""
echo "  region         = \"${REGION}\""
echo "  dynamodb_table = \"${DYNAMODB_TABLE}\""
