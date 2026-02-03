# Data Sources
# Query existing AWS resources and information
# Best practice: Separate data sources from resource definitions

# Get current AWS account ID
data "aws_caller_identity" "current" {}

# Get current AWS region
data "aws_region" "current" {}

# Get available AZs in the region
data "aws_availability_zones" "available" {
  state = "available"
  
  filter {
    name   = "opt-in-status"
    values = ["opt-in-not-required"]
  }
}

# Get the latest Amazon Linux 2 AMI for EKS nodes
data "aws_ami" "eks_default" {
  most_recent = true
  owners      = ["amazon"]
  
  filter {
    name   = "name"
    values = ["amazon-eks-node-${var.eks_cluster_version}-v*"]
  }
  
  filter {
    name   = "architecture"
    values = ["x86_64"]
  }
}

# Get AWS partition (aws, aws-cn, aws-us-gov)
data "aws_partition" "current" {}

# Get EKS cluster OIDC provider thumbprint
data "tls_certificate" "eks" {
  count = 1  # Only if EKS module is used
  url   = try(module.eks.cluster_oidc_issuer_url, "")
}

# IAM policy document for EKS cluster assume role
data "aws_iam_policy_document" "eks_assume_role" {
  statement {
    effect = "Allow"
    
    principals {
      type        = "Service"
      identifiers = ["eks.amazonaws.com"]
    }
    
    actions = ["sts:AssumeRole"]
  }
}

# IAM policy document for EKS node group assume role
data "aws_iam_policy_document" "eks_node_assume_role" {
  statement {
    effect = "Allow"
    
    principals {
      type        = "Service"
      identifiers = ["ec2.amazonaws.com"]
    }
    
    actions = ["sts:AssumeRole"]
  }
}

# Get latest EKS optimized AMI for GPU instances
data "aws_ami" "eks_gpu" {
  most_recent = true
  owners      = ["amazon"]
  
  filter {
    name   = "name"
    values = ["amazon-eks-gpu-node-${var.eks_cluster_version}-v*"]
  }
  
  filter {
    name   = "architecture"
    values = ["x86_64"]
  }
}
