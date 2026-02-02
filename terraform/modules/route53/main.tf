# Route53 Module

variable "zone_name" { type = string }
variable "records" { type = list(any) }
variable "tags" { type = map(string) }

resource "aws_route53_zone" "main" {
  name = var.zone_name
  tags = var.tags
}

resource "aws_route53_record" "main" {
  for_each = { for idx, record in var.records : idx => record }

  zone_id = aws_route53_zone.main.zone_id
  name    = each.value.name
  type    = each.value.type

  dynamic "alias" {
    for_each = try([each.value.alias], [])
    content {
      name                   = alias.value.name
      zone_id                = alias.value.zone_id
      evaluate_target_health = alias.value.evaluate_target_health
    }
  }
}

output "zone_id" { value = aws_route53_zone.main.zone_id }
output "name_servers" { value = aws_route53_zone.main.name_servers }
