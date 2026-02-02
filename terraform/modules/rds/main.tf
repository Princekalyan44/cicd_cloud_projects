# RDS Module

variable "identifier" { type = string }
variable "engine" { type = string }
variable "engine_version" { type = string }
variable "instance_class" { type = string }
variable "allocated_storage" { type = number }
variable "storage_encrypted" { type = bool }
variable "storage_type" { type = string }
variable "db_name" { type = string }
variable "username" { type = string }
variable "port" { type = number }
variable "manage_master_user_password" { type = bool }
variable "vpc_security_group_ids" { type = list(string) }
variable "db_subnet_group_name" { type = string }
variable "multi_az" { type = bool }
variable "backup_retention_period" { type = number }
variable "backup_window" { type = string }
variable "maintenance_window" { type = string }
variable "deletion_protection" { type = bool }
variable "skip_final_snapshot" { type = bool }
variable "final_snapshot_identifier" { type = string }
variable "enabled_cloudwatch_logs_exports" { type = list(string) }
variable "performance_insights_enabled" { type = bool }
variable "parameter_group_name" { type = string }
variable "tags" { type = map(string) }

resource "aws_db_instance" "main" {
  identifier = var.identifier

  engine         = var.engine
  engine_version = var.engine_version
  instance_class = var.instance_class

  allocated_storage     = var.allocated_storage
  storage_type          = var.storage_type
  storage_encrypted     = var.storage_encrypted

  db_name  = var.db_name
  username = var.username
  port     = var.port
  manage_master_user_password = var.manage_master_user_password

  vpc_security_group_ids = var.vpc_security_group_ids
  db_subnet_group_name   = var.db_subnet_group_name

  multi_az               = var.multi_az
  publicly_accessible    = false

  backup_retention_period = var.backup_retention_period
  backup_window          = var.backup_window
  maintenance_window     = var.maintenance_window

  deletion_protection       = var.deletion_protection
  skip_final_snapshot       = var.skip_final_snapshot
  final_snapshot_identifier = var.skip_final_snapshot ? null : var.final_snapshot_identifier

  enabled_cloudwatch_logs_exports = var.enabled_cloudwatch_logs_exports
  performance_insights_enabled    = var.performance_insights_enabled

  parameter_group_name = var.parameter_group_name

  tags = var.tags
}

output "db_instance_endpoint" { value = aws_db_instance.main.endpoint }
output "db_instance_name" { value = aws_db_instance.main.db_name }
output "db_instance_port" { value = aws_db_instance.main.port }
output "db_instance_address" { value = aws_db_instance.main.address }
