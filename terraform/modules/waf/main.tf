# WAF Module

variable "name" { type = string }
variable "scope" { type = string }
variable "web_acl_association" { type = map(string) }
variable "rules" { type = list(any) }
variable "tags" { type = map(string) }

resource "aws_wafv2_web_acl" "main" {
  name  = var.name
  scope = var.scope

  default_action {
    allow {}
  }

  dynamic "rule" {
    for_each = var.rules
    content {
      name     = rule.value.name
      priority = rule.value.priority

      override_action {
        none {}
      }

      statement {
        dynamic "rate_based_statement" {
          for_each = try([rule.value.rate_based_statement], [])
          content {
            limit              = rate_based_statement.value.limit
            aggregate_key_type = rate_based_statement.value.aggregate_key_type
          }
        }

        dynamic "managed_rule_group_statement" {
          for_each = try([rule.value.managed_rule_group_statement], [])
          content {
            vendor_name = managed_rule_group_statement.value.vendor_name
            name        = managed_rule_group_statement.value.name
          }
        }
      }

      visibility_config {
        cloudwatch_metrics_enabled = true
        metric_name                = rule.value.name
        sampled_requests_enabled   = true
      }
    }
  }

  visibility_config {
    cloudwatch_metrics_enabled = true
    metric_name                = var.name
    sampled_requests_enabled   = true
  }

  tags = var.tags
}

resource "aws_wafv2_web_acl_association" "main" {
  resource_arn = var.web_acl_association.resource_arn
  web_acl_arn  = aws_wafv2_web_acl.main.arn
}

output "web_acl_id" { value = aws_wafv2_web_acl.main.id }
output "web_acl_arn" { value = aws_wafv2_web_acl.main.arn }
