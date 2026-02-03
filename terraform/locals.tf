# Local Values
# Computed values used throughout the configuration
# Best practice: Use locals for derived values and to avoid repetition

locals {
  # Common name prefix for resources
  name_prefix = "${var.project_name}-${var.environment}"
  
  # Common tags applied to all resources
  common_tags = merge(
    {
      Project     = var.project_name
      Environment = var.environment
      ManagedBy   = "Terraform"
      Owner       = "Kalyan"
      CostCenter  = "DevOps"
      Repository  = "cicd_cloud_projects"
    },
    var.additional_tags
  )
  
  # Cluster name with standardized naming
  cluster_name = "${local.name_prefix}-eks"
  
  # RDS instance identifier
  db_identifier = "${local.name_prefix}-postgres"
  
  # ECR repository names with prefix
  ecr_repositories = {
    for repo in var.ecr_repositories :
    repo => "${local.name_prefix}-${repo}"
  }
  
  # VPC name
  vpc_name = "${local.name_prefix}-vpc"
  
  # Determine if domain is configured
  has_domain = var.domain_name != ""
  
  # Subnet groups
  private_subnets = {
    for idx, cidr in var.private_subnet_cidrs :
    var.availability_zones[idx] => cidr
  }
  
  public_subnets = {
    for idx, cidr in var.public_subnet_cidrs :
    var.availability_zones[idx] => cidr
  }
  
  database_subnets = {
    for idx, cidr in var.database_subnet_cidrs :
    var.availability_zones[idx] => cidr
  }
  
  # EKS add-ons configuration
  eks_addons = {
    coredns = {
      most_recent = true
    }
    kube-proxy = {
      most_recent = true
    }
    vpc-cni = {
      most_recent = true
      configuration_values = jsonencode({
        env = {
          ENABLE_PREFIX_DELEGATION = "true"
          ENABLE_POD_ENI           = "true"
          POD_SECURITY_GROUP_ENFORCING_MODE = "standard"
        }
      })
    }
    aws-ebs-csi-driver = {
      most_recent = true
    }
  }
  
  # Node group configurations
  node_groups = {
    general = {
      name           = "${local.cluster_name}-general"
      instance_types = var.node_group_general_instance_types
      desired_size   = var.node_group_general_desired_size
      min_size       = var.node_group_general_min_size
      max_size       = var.node_group_general_max_size
      capacity_type  = "ON_DEMAND"
      labels = {
        workload = "general"
      }
      taints = []
    }
    
    gpu = {
      name           = "${local.cluster_name}-gpu"
      instance_types = var.node_group_gpu_instance_types
      desired_size   = var.node_group_gpu_desired_size
      min_size       = var.node_group_gpu_min_size
      max_size       = var.node_group_gpu_max_size
      capacity_type  = "ON_DEMAND"
      labels = {
        workload = "gpu"
        "nvidia.com/gpu" = "true"
      }
      taints = [
        {
          key    = "nvidia.com/gpu"
          value  = "true"
          effect = "NoSchedule"
        }
      ]
    }
  }
}
