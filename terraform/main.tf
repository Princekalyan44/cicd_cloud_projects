# Main Terraform Configuration
# This file orchestrates all modules to build the complete infrastructure

# VPC Module
module "vpc" {
  source = "./modules/vpc"

  name                = "${local.name_prefix}-vpc"
  cidr                = var.vpc_cidr
  azs                 = var.availability_zones
  private_subnets     = var.private_subnet_cidrs
  public_subnets      = var.public_subnet_cidrs
  database_subnets    = var.database_subnet_cidrs
  
  enable_nat_gateway   = true
  single_nat_gateway   = var.environment != "production"  # Use single NAT for dev/staging
  enable_dns_hostnames = true
  enable_dns_support   = true

  # Enable VPC Flow Logs
  enable_flow_log                      = true
  create_flow_log_cloudwatch_iam_role  = true
  create_flow_log_cloudwatch_log_group = true

  # Tags for Kubernetes
  public_subnet_tags = {
    "kubernetes.io/role/elb"                    = "1"
    "kubernetes.io/cluster/${var.eks_cluster_name}" = "shared"
  }

  private_subnet_tags = {
    "kubernetes.io/role/internal-elb"          = "1"
    "kubernetes.io/cluster/${var.eks_cluster_name}" = "shared"
    "karpenter.sh/discovery"                    = var.eks_cluster_name
  }

  tags = local.common_tags
}

# EKS Cluster Module
module "eks" {
  source = "./modules/eks"

  cluster_name    = var.eks_cluster_name
  cluster_version = var.eks_cluster_version

  vpc_id          = module.vpc.vpc_id
  subnet_ids      = module.vpc.private_subnets

  # Enable IRSA (IAM Roles for Service Accounts)
  enable_irsa = true

  # Cluster endpoint access
  cluster_endpoint_public_access  = true
  cluster_endpoint_private_access = true

  # Enable cluster add-ons
  cluster_addons = {
    coredns = {
      most_recent = true
    }
    kube-proxy = {
      most_recent = true
    }
    vpc-cni = {
      most_recent = true
    }
    aws-ebs-csi-driver = {
      most_recent = true
    }
  }

  # Node groups
  node_groups = {
    general = {
      name           = "${local.name_prefix}-general"
      instance_types = var.node_group_general_instance_types
      capacity_type  = "ON_DEMAND"
      
      min_size     = var.node_group_general_min_size
      max_size     = var.node_group_general_max_size
      desired_size = var.node_group_general_desired_size

      labels = {
        workload = "general"
      }

      taints = []

      update_config = {
        max_unavailable_percentage = 33
      }
    }

    gpu = {
      name           = "${local.name_prefix}-gpu"
      instance_types = var.node_group_gpu_instance_types
      capacity_type  = "ON_DEMAND"
      
      min_size     = var.node_group_gpu_min_size
      max_size     = var.node_group_gpu_max_size
      desired_size = var.node_group_gpu_desired_size

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

      # Install NVIDIA device plugin
      enable_nvidia_device_plugin = true
    }
  }

  # Cluster security group rules
  cluster_security_group_additional_rules = {
    ingress_nodes_ephemeral_ports_tcp = {
      description                = "Nodes on ephemeral ports"
      protocol                   = "tcp"
      from_port                  = 1025
      to_port                    = 65535
      type                       = "ingress"
      source_node_security_group = true
    }
  }

  # Node security group rules
  node_security_group_additional_rules = {
    ingress_self_all = {
      description = "Node to node all ports/protocols"
      protocol    = "-1"
      from_port   = 0
      to_port     = 0
      type        = "ingress"
      self        = true
    }
    ingress_cluster_all = {
      description                   = "Cluster to node all ports/protocols"
      protocol                      = "-1"
      from_port                     = 0
      to_port                       = 0
      type                          = "ingress"
      source_cluster_security_group = true
    }
    egress_all = {
      description      = "Node all egress"
      protocol         = "-1"
      from_port        = 0
      to_port          = 0
      type             = "egress"
      cidr_blocks      = ["0.0.0.0/0"]
      ipv6_cidr_blocks = ["::/0"]
    }
  }

  tags = local.common_tags
}

# RDS PostgreSQL Module with pgvector
module "rds" {
  source = "./modules/rds"

  identifier = "${local.name_prefix}-db"

  engine               = "postgres"
  engine_version       = var.db_engine_version
  instance_class       = var.db_instance_class
  allocated_storage    = var.db_allocated_storage
  storage_encrypted    = true
  storage_type         = "gp3"

  db_name  = var.db_name
  username = var.db_username
  port     = 5432

  # Generate random password and store in AWS Secrets Manager
  manage_master_user_password = true

  vpc_security_group_ids = [module.rds_security_group.security_group_id]
  db_subnet_group_name   = module.vpc.database_subnet_group_name

  multi_az               = var.enable_db_multi_az
  backup_retention_period = var.db_backup_retention_period
  backup_window          = "03:00-04:00"
  maintenance_window     = "mon:04:00-mon:05:00"

  deletion_protection = var.environment == "production"
  skip_final_snapshot = var.environment != "production"
  final_snapshot_identifier = "${local.name_prefix}-db-final-snapshot"

  # Enable performance insights
  enabled_cloudwatch_logs_exports = ["postgresql", "upgrade"]
  performance_insights_enabled    = true

  # Parameter group for pgvector
  parameter_group_name = module.rds_parameter_group.name

  tags = local.common_tags
}

# RDS Security Group
module "rds_security_group" {
  source = "./modules/security-group"

  name        = "${local.name_prefix}-rds-sg"
  description = "Security group for RDS PostgreSQL"
  vpc_id      = module.vpc.vpc_id

  ingress_with_source_security_group_id = [
    {
      from_port                = 5432
      to_port                  = 5432
      protocol                 = "tcp"
      description              = "PostgreSQL access from EKS nodes"
      source_security_group_id = module.eks.node_security_group_id
    }
  ]

  egress_rules = ["all-all"]

  tags = local.common_tags
}

# RDS Parameter Group for pgvector extension
module "rds_parameter_group" {
  source = "./modules/rds-parameter-group"

  name        = "${local.name_prefix}-postgres-pgvector"
  family      = "postgres15"
  description = "PostgreSQL parameter group with pgvector support"

  parameters = [
    {
      name  = "shared_preload_libraries"
      value = "pg_stat_statements,pgvector"
    },
    {
      name  = "max_connections"
      value = "100"
    },
    {
      name  = "shared_buffers"
      value = "{DBInstanceClassMemory/32768}"
    }
  ]

  tags = local.common_tags
}

# ECR Repositories
module "ecr" {
  source = "./modules/ecr"

  for_each = toset(var.ecr_repositories)

  repository_name = each.value
  
  image_tag_mutability = "MUTABLE"
  scan_on_push         = true
  
  # Lifecycle policy to keep last N images
  lifecycle_policy = jsonencode({
    rules = [
      {
        rulePriority = 1
        description  = "Keep last ${var.ecr_image_retention_count} images"
        selection = {
          tagStatus     = "any"
          countType     = "imageCountMoreThan"
          countNumber   = var.ecr_image_retention_count
        }
        action = {
          type = "expire"
        }
      }
    ]
  })

  tags = local.common_tags
}

# S3 Bucket for artifacts and assets
module "s3" {
  source = "./modules/s3"

  bucket_name = "${local.name_prefix}-artifacts"

  versioning_enabled = true
  
  # Enable encryption
  server_side_encryption_configuration = {
    rule = {
      apply_server_side_encryption_by_default = {
        sse_algorithm = "AES256"
      }
    }
  }

  # Block public access
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true

  # Lifecycle rules
  lifecycle_rules = [
    {
      id      = "delete-old-artifacts"
      enabled = true
      expiration = {
        days = 90
      }
    }
  ]

  tags = local.common_tags
}

# Application Load Balancer
module "alb" {
  source = "./modules/alb"

  name = "${local.name_prefix}-alb"

  vpc_id          = module.vpc.vpc_id
  subnets         = module.vpc.public_subnets
  security_groups = [module.alb_security_group.security_group_id]

  enable_deletion_protection = var.environment == "production"
  enable_http2              = true
  enable_cross_zone_load_balancing = true

  # Access logs
  access_logs = {
    bucket  = module.s3.bucket_id
    prefix  = "alb-logs"
    enabled = true
  }

  tags = local.common_tags
}

# ALB Security Group
module "alb_security_group" {
  source = "./modules/security-group"

  name        = "${local.name_prefix}-alb-sg"
  description = "Security group for Application Load Balancer"
  vpc_id      = module.vpc.vpc_id

  ingress_cidr_blocks = ["0.0.0.0/0"]
  ingress_rules       = ["http-80-tcp", "https-443-tcp"]
  
  egress_rules = ["all-all"]

  tags = local.common_tags
}

# AWS WAF for ALB
module "waf" {
  count  = var.enable_waf ? 1 : 0
  source = "./modules/waf"

  name  = "${local.name_prefix}-waf"
  scope = "REGIONAL"

  # Associate with ALB
  web_acl_association = {
    resource_arn = module.alb.lb_arn
  }

  # WAF Rules
  rules = [
    {
      name     = "RateLimitRule"
      priority = 1
      action   = "block"
      
      rate_based_statement = {
        limit              = var.waf_rate_limit
        aggregate_key_type = "IP"
      }
    },
    {
      name     = "AWSManagedRulesCommonRuleSet"
      priority = 2
      
      managed_rule_group_statement = {
        vendor_name = "AWS"
        name        = "AWSManagedRulesCommonRuleSet"
      }
    },
    {
      name     = "AWSManagedRulesKnownBadInputsRuleSet"
      priority = 3
      
      managed_rule_group_statement = {
        vendor_name = "AWS"
        name        = "AWSManagedRulesKnownBadInputsRuleSet"
      }
    }
  ]

  tags = local.common_tags
}

# Route53 (if domain configured)
module "route53" {
  count  = var.create_route53_zone ? 1 : 0
  source = "./modules/route53"

  zone_name = var.domain_name

  # Create A record pointing to ALB
  records = [
    {
      name = ""
      type = "A"
      alias = {
        name                   = module.alb.lb_dns_name
        zone_id                = module.alb.lb_zone_id
        evaluate_target_health = true
      }
    },
    {
      name = "www"
      type = "A"
      alias = {
        name                   = module.alb.lb_dns_name
        zone_id                = module.alb.lb_zone_id
        evaluate_target_health = true
      }
    }
  ]

  tags = local.common_tags
}
