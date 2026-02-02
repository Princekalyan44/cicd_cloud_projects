# ALB Module

variable "name" { type = string }
variable "vpc_id" { type = string }
variable "subnets" { type = list(string) }
variable "security_groups" { type = list(string) }
variable "enable_deletion_protection" { type = bool }
variable "enable_http2" { type = bool }
variable "enable_cross_zone_load_balancing" { type = bool }
variable "access_logs" { type = map(any) }
variable "tags" { type = map(string) }

resource "aws_lb" "main" {
  name               = var.name
  internal           = false
  load_balancer_type = "application"
  security_groups    = var.security_groups
  subnets            = var.subnets

  enable_deletion_protection       = var.enable_deletion_protection
  enable_http2                     = var.enable_http2
  enable_cross_zone_load_balancing = var.enable_cross_zone_load_balancing

  access_logs {
    bucket  = var.access_logs.bucket
    prefix  = var.access_logs.prefix
    enabled = var.access_logs.enabled
  }

  tags = var.tags
}

output "lb_arn" { value = aws_lb.main.arn }
output "lb_dns_name" { value = aws_lb.main.dns_name }
output "lb_zone_id" { value = aws_lb.main.zone_id }
