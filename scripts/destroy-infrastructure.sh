#!/bin/bash
# Script to destroy Terraform infrastructure

set -e

cd terraform

echo "WARNING: This will destroy all infrastructure!"
echo "This action cannot be undone."
echo ""
read -p "Are you sure you want to continue? Type 'destroy' to confirm: " CONFIRM

if [ "$CONFIRM" = "destroy" ]; then
    echo "Planning destruction..."
    terraform plan -destroy -out=destroy-plan
    
    echo ""
    read -p "Proceed with destruction? (yes/no): " FINAL_CONFIRM
    
    if [ "$FINAL_CONFIRM" = "yes" ]; then
        echo "Destroying infrastructure..."
        terraform apply destroy-plan
        echo "Infrastructure destroyed"
    else
        echo "Destruction cancelled"
        rm -f destroy-plan
    fi
else
    echo "Destruction cancelled"
fi
