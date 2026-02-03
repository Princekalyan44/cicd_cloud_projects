# TFLint Configuration
# Linter for Terraform code to catch errors and enforce best practices
# Install: https://github.com/terraform-linters/tflint
# Run: tflint

plugin "aws" {
  enabled = true
  version = "0.27.0"
  source  = "github.com/terraform-linters/tflint-ruleset-aws"
}

config {
  # Enable all rules by default
  module = true
  force  = false
}

# Enforce module pinning
rule "terraform_module_pinned_source" {
  enabled = true
  style   = "semver"  # Enforce semantic versioning
}

# Require variable descriptions
rule "terraform_documented_variables" {
  enabled = true
}

# Require output descriptions
rule "terraform_documented_outputs" {
  enabled = true
}

# Enforce naming conventions
rule "terraform_naming_convention" {
  enabled = true
  
  variable {
    format = "snake_case"
  }
  
  output {
    format = "snake_case"
  }
  
  resource {
    format = "snake_case"
  }
}

# Require type constraints on variables
rule "terraform_typed_variables" {
  enabled = true
}

# Warn about unused declarations
rule "terraform_unused_declarations" {
  enabled = true
}

# Require version constraints in modules
rule "terraform_required_version" {
  enabled = true
}

# Require provider versions
rule "terraform_required_providers" {
  enabled = true
}

# AWS-specific rules
rule "aws_resource_missing_tags" {
  enabled = true
  tags = ["Environment", "Project", "ManagedBy"]
}
