# Terraform and Provider Version Constraints
# Separating version requirements for better maintainability
# Following best practice: https://www.terraform.io/docs/language/settings/index.html

terraform {
  # Require Terraform 1.5.0 or newer
  # Using exact version constraint for production stability
  required_version = ">= 1.5.0"

  # Required provider versions
  # Using pessimistic constraint (~>) to allow patch updates but not breaking changes
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"  # Allow 5.x versions, but not 6.0
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
    
    random = {
      source  = "hashicorp/random"
      version = "~> 3.5"
    }
    
    tls = {
      source  = "hashicorp/tls"
      version = "~> 4.0"
    }
  }
}
