# RDS Parameter Group Module

variable "name" { type = string }
variable "family" { type = string }
variable "description" { type = string }
variable "parameters" { type = list(map(string)) }
variable "tags" { type = map(string) }

resource "aws_db_parameter_group" "main" {
  name        = var.name
  family      = var.family
  description = var.description

  dynamic "parameter" {
    for_each = var.parameters
    content {
      name  = parameter.value.name
      value = parameter.value.value
    }
  }

  tags = var.tags
}

output "name" { value = aws_db_parameter_group.main.name }
output "arn" { value = aws_db_parameter_group.main.arn }
