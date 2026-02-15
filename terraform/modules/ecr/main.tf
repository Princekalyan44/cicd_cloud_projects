# ECR Module

variable "repository_name" { type = string }
variable "image_tag_mutability" { type = string }
variable "scan_on_push" { type = bool }
variable "lifecycle_policy" { type = string }
variable "tags" { type = map(string) }

resource "aws_ecr_repository" "main" {
  name                 = var.repository_name
  image_tag_mutability = var.image_tag_mutability

  image_scanning_configuration {
    scan_on_push = var.scan_on_push
  }

  tags = var.tags
}

resource "aws_ecr_lifecycle_policy" "main" {
  repository = aws_ecr_repository.main.name
  policy     = var.lifecycle_policy
}

output "repository_url" { value = aws_ecr_repository.main.repository_url }
output "repository_arn" { value = aws_ecr_repository.main.arn }
output "repository_name" { value = aws_ecr_repository.main.name }
