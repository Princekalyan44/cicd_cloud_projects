# S3 Bucket Module

variable "bucket_name" { type = string }
variable "versioning_enabled" { type = bool }
variable "server_side_encryption_configuration" { type = any }
variable "block_public_acls" { type = bool }
variable "block_public_policy" { type = bool }
variable "ignore_public_acls" { type = bool }
variable "restrict_public_buckets" { type = bool }
variable "lifecycle_rules" { type = list(any) }
variable "tags" { type = map(string) }

resource "aws_s3_bucket" "main" {
  bucket = var.bucket_name
  tags   = var.tags
}

resource "aws_s3_bucket_versioning" "main" {
  bucket = aws_s3_bucket.main.id

  versioning_configuration {
    status = var.versioning_enabled ? "Enabled" : "Suspended"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "main" {
  bucket = aws_s3_bucket.main.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = var.server_side_encryption_configuration.rule.apply_server_side_encryption_by_default.sse_algorithm
    }
  }
}

resource "aws_s3_bucket_public_access_block" "main" {
  bucket = aws_s3_bucket.main.id

  block_public_acls       = var.block_public_acls
  block_public_policy     = var.block_public_policy
  ignore_public_acls      = var.ignore_public_acls
  restrict_public_buckets = var.restrict_public_buckets
}

resource "aws_s3_bucket_lifecycle_configuration" "main" {
  count  = length(var.lifecycle_rules) > 0 ? 1 : 0
  bucket = aws_s3_bucket.main.id

  dynamic "rule" {
    for_each = var.lifecycle_rules
    content {
      id     = rule.value.id
      status = rule.value.enabled ? "Enabled" : "Disabled"

      # Filter is required - apply to all objects if not specified
      filter {}

      dynamic "expiration" {
        for_each = try([rule.value.expiration], [])
        content {
          days = expiration.value.days
        }
      }
    }
  }
}

output "bucket_id" { value = aws_s3_bucket.main.id }
output "bucket_arn" { value = aws_s3_bucket.main.arn }
