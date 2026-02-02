# Global Variables

variable "aws_region" {
  description = "AWS region for resources"
  type        = string
  default     = "ap-south-1"  # Mumbai region (closest to Bangalore)
}

variable "aws_account_id" {
  description = "AWS Account ID"
  type        = string
  sensitive   = true
}

variable "environment" {
  description = "Environment name"
  type        = string
  default     = "production"
  validation {
    condition     = contains(["development", "staging", "production"], var.environment)
    error_message = "Environment must be development, staging, or production."
  }
}

variable "project_name" {
  description = "Project name used for resource naming"
  type        = string
  default     = "portfolio"
}

# VPC Variables
variable "vpc_cidr" {
  description = "CIDR block for VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "availability_zones" {
  description = "Availability zones for multi-AZ deployment"
  type        = list(string)
  default     = ["ap-south-1a", "ap-south-1b", "ap-south-1c"]
}

variable "private_subnet_cidrs" {
  description = "CIDR blocks for private subnets"
  type        = list(string)
  default     = ["10.0.1.0/24", "10.0.2.0/24", "10.0.3.0/24"]
}

variable "public_subnet_cidrs" {
  description = "CIDR blocks for public subnets"
  type        = list(string)
  default     = ["10.0.101.0/24", "10.0.102.0/24", "10.0.103.0/24"]
}

variable "database_subnet_cidrs" {
  description = "CIDR blocks for database subnets"
  type        = list(string)
  default     = ["10.0.201.0/24", "10.0.202.0/24", "10.0.203.0/24"]
}

# EKS Variables
variable "eks_cluster_version" {
  description = "Kubernetes version for EKS cluster"
  type        = string
  default     = "1.28"
}

variable "eks_cluster_name" {
  description = "Name of the EKS cluster"
  type        = string
  default     = "portfolio-eks-cluster"
}

variable "enable_cluster_autoscaler" {
  description = "Enable Kubernetes cluster autoscaler"
  type        = bool
  default     = true
}

variable "enable_metrics_server" {
  description = "Enable Kubernetes metrics server"
  type        = bool
  default     = true
}

# Node Group Variables
variable "node_group_general_instance_types" {
  description = "Instance types for general purpose node group"
  type        = list(string)
  default     = ["t3.medium", "t3a.medium"]
}

variable "node_group_general_desired_size" {
  description = "Desired number of nodes in general node group"
  type        = number
  default     = 2
}

variable "node_group_general_min_size" {
  description = "Minimum number of nodes in general node group"
  type        = number
  default     = 1
}

variable "node_group_general_max_size" {
  description = "Maximum number of nodes in general node group"
  type        = number
  default     = 4
}

variable "node_group_gpu_instance_types" {
  description = "Instance types for GPU node group"
  type        = list(string)
  default     = ["g4dn.xlarge"]  # Cost-effective GPU instances
}

variable "node_group_gpu_desired_size" {
  description = "Desired number of nodes in GPU node group"
  type        = number
  default     = 1
}

variable "node_group_gpu_min_size" {
  description = "Minimum number of nodes in GPU node group"
  type        = number
  default     = 0  # Can scale to zero to save costs
}

variable "node_group_gpu_max_size" {
  description = "Maximum number of nodes in GPU node group"
  type        = number
  default     = 2
}

# RDS Variables
variable "db_instance_class" {
  description = "RDS instance class"
  type        = string
  default     = "db.t3.micro"  # Free tier eligible
}

variable "db_engine_version" {
  description = "PostgreSQL engine version"
  type        = string
  default     = "15.4"
}

variable "db_allocated_storage" {
  description = "Allocated storage for RDS in GB"
  type        = number
  default     = 20
}

variable "db_name" {
  description = "Name of the database"
  type        = string
  default     = "portfolio"
}

variable "db_username" {
  description = "Master username for database"
  type        = string
  default     = "dbadmin"
  sensitive   = true
}

variable "db_backup_retention_period" {
  description = "Backup retention period in days"
  type        = number
  default     = 7
}

variable "enable_db_multi_az" {
  description = "Enable Multi-AZ for RDS"
  type        = bool
  default     = false  # Set true for production
}

# ECR Variables
variable "ecr_repositories" {
  description = "List of ECR repositories to create"
  type        = list(string)
  default     = [
    "portfolio-frontend",
    "portfolio-chatbot",
    "llm-log-analyzer"
  ]
}

variable "ecr_image_retention_count" {
  description = "Number of images to retain in ECR"
  type        = number
  default     = 10
}

# Domain Variables
variable "domain_name" {
  description = "Domain name for the portfolio (if available)"
  type        = string
  default     = ""  # Leave empty if no domain
}

variable "create_route53_zone" {
  description = "Create Route53 hosted zone"
  type        = bool
  default     = false
}

# WAF Variables
variable "enable_waf" {
  description = "Enable AWS WAF"
  type        = bool
  default     = true
}

variable "waf_rate_limit" {
  description = "Rate limit for WAF (requests per 5 minutes)"
  type        = number
  default     = 2000
}

# Tags
variable "additional_tags" {
  description = "Additional tags to apply to all resources"
  type        = map(string)
  default     = {}
}
