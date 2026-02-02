#!/bin/bash
# Script to deploy Terraform infrastructure

set -e

cd terraform

echo "Initializing Terraform..."
terraform init

echo ""
echo "Validating configuration..."
terraform validate

echo ""
echo "Planning infrastructure changes..."
terraform plan -out=tfplan

echo ""
read -p "Do you want to apply these changes? (yes/no): " CONFIRM

if [ "$CONFIRM" = "yes" ]; then
    echo "Applying infrastructure..."
    terraform apply tfplan
    
    echo ""
    echo "Deployment complete!"
    echo ""
    echo "To configure kubectl:"
    terraform output -raw configure_kubectl
    echo ""
    echo ""
    echo "ECR login command:"
    terraform output -raw ecr_login_command
    echo ""
else
    echo "Deployment cancelled"
    rm -f tfplan
fi
