# Security Group Module

variable "name" { type = string }
variable "description" { type = string }
variable "vpc_id" { type = string }
variable "ingress_with_source_security_group_id" {
  type    = list(map(string))
  default = []
}
variable "ingress_cidr_blocks" {
  type    = list(string)
  default = []
}
variable "ingress_rules" {
  type    = list(string)
  default = []
}
variable "egress_rules" {
  type    = list(string)
  default = []
}
variable "tags" { type = map(string) }

resource "aws_security_group" "main" {
  name        = var.name
  description = var.description
  vpc_id      = var.vpc_id

  tags = var.tags
}

# Ingress rules with source security group
resource "aws_security_group_rule" "ingress_with_sg" {
  count = length(var.ingress_with_source_security_group_id)

  type                     = "ingress"
  from_port                = var.ingress_with_source_security_group_id[count.index].from_port
  to_port                  = var.ingress_with_source_security_group_id[count.index].to_port
  protocol                 = var.ingress_with_source_security_group_id[count.index].protocol
  source_security_group_id = var.ingress_with_source_security_group_id[count.index].source_security_group_id
  description              = try(var.ingress_with_source_security_group_id[count.index].description, "")

  security_group_id = aws_security_group.main.id
}

# Common ingress rules
locals {
  rules = {
    "http-80-tcp"   = [80, 80, "tcp", "HTTP"]
    "https-443-tcp" = [443, 443, "tcp", "HTTPS"]
    "all-all"       = [-1, -1, "-1", "All protocols"]
  }
}

resource "aws_security_group_rule" "ingress" {
  count = length(var.ingress_rules)

  type        = "ingress"
  from_port   = local.rules[var.ingress_rules[count.index]][0]
  to_port     = local.rules[var.ingress_rules[count.index]][1]
  protocol    = local.rules[var.ingress_rules[count.index]][2]
  description = local.rules[var.ingress_rules[count.index]][3]
  cidr_blocks = var.ingress_cidr_blocks

  security_group_id = aws_security_group.main.id
}

resource "aws_security_group_rule" "egress" {
  count = length(var.egress_rules)

  type        = "egress"
  from_port   = local.rules[var.egress_rules[count.index]][0]
  to_port     = local.rules[var.egress_rules[count.index]][1]
  protocol    = local.rules[var.egress_rules[count.index]][2]
  description = local.rules[var.egress_rules[count.index]][3]
  cidr_blocks = ["0.0.0.0/0"]

  security_group_id = aws_security_group.main.id
}

output "security_group_id" { value = aws_security_group.main.id }
output "security_group_arn" { value = aws_security_group.main.arn }
