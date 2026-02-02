# Terraform Backend Configuration
# S3 backend for remote state management with DynamoDB for state locking

terraform {
  backend "s3" {
    bucket         = "portfolio-terraform-state-${var.aws_account_id}"
    key            = "portfolio/terraform.tfstate"
    region         = var.aws_region
    encrypt        = true
    dynamodb_table = "portfolio-terraform-locks"
    
    # Enable versioning for state file recovery
    versioning = true
  }

  required_version = ">= 1.5.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "~> 2.23"
    }
    helm = {
      source  = "hashicorp/helm"
      version = "~> 2.11"
    }
    kubectl = {
      source  = "gavinbunney/kubectl"
      version = "~> 1.14"
    }
  }
}
