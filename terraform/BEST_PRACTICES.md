# Terraform Best Practices Applied

This document outlines the Terraform best practices implemented in this project.

## 1. File Organization

### ✅ Implemented Structure
```
terraform/
├── versions.tf          # Version constraints
├── provider.tf          # Provider configurations
├── backend.tf           # Backend configuration
├── variables.tf         # Input variables
├── locals.tf            # Local computed values
├── data.tf              # Data sources
├── main.tf              # Main resources
├── outputs.tf           # Output values
├── .terraform-version   # Pin Terraform version
├── .tflint.hcl         # Linting configuration
└── .pre-commit-config.yaml  # Pre-commit hooks
```

### Benefits
- **Separation of concerns**: Each file has a specific purpose
- **Easier navigation**: Find what you need quickly
- **Better collaboration**: Team members know where to look
- **Maintainability**: Changes are isolated to relevant files

---

## 2. Version Constraints

### ✅ versions.tf
```hcl
terraform {
  required_version = ">= 1.5.0"
  
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"  # Pessimistic constraint
    }
  }
}
```

### Benefits
- **Reproducibility**: Same versions across environments
- **Stability**: Prevent breaking changes
- **Documentation**: Clear version requirements

### Constraint Operators
- `>=` : Greater than or equal
- `~>` : Pessimistic (allows patch updates only)
- `=` : Exact version (not recommended)

---

## 3. Backend Configuration

### ✅ Proper Backend Setup

**Problem**: Backend blocks cannot use variables
```hcl
# ❌ WRONG - This doesn't work
backend "s3" {
  bucket = var.bucket_name  # ERROR!
}
```

**Solution**: Use backend config file
```hcl
# ✅ CORRECT
terraform init -backend-config=backend-config.hcl
```

### Setup Process
1. Run `scripts/setup-backend.sh` to create S3 bucket and DynamoDB table
2. Script generates `backend-config.hcl` with your values
3. Initialize: `terraform init -backend-config=backend-config.hcl`

### Benefits
- **Security**: Config file not committed to git
- **Flexibility**: Different backends per environment
- **State locking**: DynamoDB prevents concurrent modifications

---

## 4. Local Values (locals.tf)

### ✅ DRY Principle
```hcl
locals {
  name_prefix = "${var.project_name}-${var.environment}"
  
  common_tags = merge(
    {
      Project     = var.project_name
      Environment = var.environment
      ManagedBy   = "Terraform"
    },
    var.additional_tags
  )
}
```

### Benefits
- **No repetition**: Define once, use everywhere
- **Computed values**: Derive from other variables
- **Consistency**: Same naming across resources

---

## 5. Data Sources (data.tf)

### ✅ Query Existing Resources
```hcl
data "aws_caller_identity" "current" {}
data "aws_region" "current" {}
data "aws_availability_zones" "available" {}
```

### Benefits
- **Discover resources**: Get current account, region, AZs
- **Reference existing**: Use existing VPCs, subnets, etc.
- **Dynamic**: Adapt to environment automatically

---

## 6. Variable Best Practices

### ✅ Complete Variable Definitions
```hcl
variable "environment" {
  description = "Environment name"  # Required!
  type        = string              # Always specify type
  default     = "production"
  
  # Validation
  validation {
    condition     = contains(["dev", "staging", "prod"], var.environment)
    error_message = "Must be dev, staging, or prod."
  }
  
  # Sensitive data
  sensitive   = true  # Hide in logs
}
```

### Key Points
- Always add `description`
- Always specify `type`
- Use `validation` blocks for constraints
- Mark sensitive variables with `sensitive = true`
- Provide sensible defaults where appropriate

---

## 7. Tagging Strategy

### ✅ Default Tags in Provider
```hcl
provider "aws" {
  region = var.aws_region
  
  default_tags {
    tags = {
      Project     = "Portfolio"
      ManagedBy   = "Terraform"
      Environment = var.environment
    }
  }
}
```

### Benefits
- **Automatic tagging**: All resources get default tags
- **Cost tracking**: Track spending by project/environment
- **Resource management**: Easy filtering and searching
- **Compliance**: Meet organizational requirements

---

## 8. Security Best Practices

### ✅ Implemented Security

1. **State File Encryption**
   - S3 bucket encryption enabled (AES-256)
   - Versioning enabled for recovery
   - Public access blocked

2. **Secrets Management**
   - No hardcoded credentials
   - Sensitive variables marked
   - Use AWS Secrets Manager for passwords

3. **Least Privilege**
   - IAM roles with minimal permissions
   - IRSA for pod-level permissions
   - No hardcoded access keys

4. **Security Scanning**
   - tfsec in CI/CD pipeline
   - Checkov for policy checks
   - Pre-commit hooks

---

## 9. Code Quality

### ✅ Linting and Formatting

**TFLint Configuration** (.tflint.hcl)
- Enforces naming conventions
- Requires variable descriptions
- Checks for unused declarations
- AWS-specific rules

**Pre-commit Hooks**
```bash
# Install
pip install pre-commit
pre-commit install

# Runs automatically on git commit
# Or run manually
pre-commit run --all-files
```

### Formatting
```bash
# Format all files
terraform fmt -recursive

# Check format
terraform fmt -check -recursive
```

---

## 10. Module Best Practices

### ✅ Using Official Modules

**Prefer official/verified modules**:
```hcl
module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "~> 5.0"  # Pin version!
  
  # Configuration...
}
```

### Benefits
- **Tested**: Community-vetted code
- **Maintained**: Regular updates
- **Best practices**: Follow AWS recommendations
- **Time-saving**: Don't reinvent the wheel

### Custom Modules
- Keep them simple and focused
- Version your modules
- Document inputs/outputs
- Write examples

---

## 11. State Management

### ✅ Remote State Best Practices

1. **Always use remote state** (S3 + DynamoDB)
2. **Enable versioning** for rollback capability
3. **Encrypt at rest** for security
4. **Use state locking** to prevent conflicts
5. **Separate states** for different environments

### State Commands
```bash
# List resources in state
terraform state list

# Show resource details
terraform state show aws_vpc.main

# Remove resource from state (not AWS!)
terraform state rm aws_instance.example

# Import existing resource
terraform import aws_instance.example i-1234567890abcdef0
```

---

## 12. Workspace Strategy

### ✅ Environment Separation

**Option 1: Workspaces**
```bash
terraform workspace new dev
terraform workspace new staging
terraform workspace new production
```

**Option 2: Separate State Files** (Recommended)
```hcl
key = "portfolio/${var.environment}/terraform.tfstate"
```

### Benefits
- Isolated states per environment
- Prevent accidental changes to production
- Different variable values per environment

---

## 13. CI/CD Integration

### ✅ GitHub Actions Workflow

1. **Validation**
   - `terraform fmt -check`
   - `terraform validate`
   - Security scans (tfsec, Checkov)

2. **Planning**
   - `terraform plan -out=tfplan`
   - Review plan before apply

3. **Apply**
   - Manual approval required
   - `terraform apply tfplan`

---

## 14. Documentation

### ✅ Auto-generated Docs

**terraform-docs** generates documentation from code:
```bash
# Install
brew install terraform-docs

# Generate
terraform-docs markdown table --output-file README.md .
```

### Benefits
- Always up-to-date
- Shows inputs, outputs, resources
- Reduces manual documentation burden

---

## 15. Testing

### Validation Levels

1. **Syntax** (terraform validate)
2. **Linting** (tflint)
3. **Security** (tfsec, Checkov)
4. **Plan review** (manual)
5. **Apply to dev** (automated)
6. **Integration tests** (Terratest)

---

## Quick Start Checklist

- [ ] Install prerequisites (Terraform, AWS CLI, tflint, tfsec)
- [ ] Run `scripts/setup-backend.sh`
- [ ] Copy `terraform.tfvars.example` to `terraform.tfvars`
- [ ] Update `terraform.tfvars` with your values
- [ ] Run `terraform init -backend-config=backend-config.hcl`
- [ ] Run `scripts/validate-terraform.sh`
- [ ] Run `terraform plan`
- [ ] Review plan carefully
- [ ] Run `terraform apply`
- [ ] Install pre-commit hooks: `pre-commit install`

---

## Resources

- [Terraform Best Practices](https://www.terraform-best-practices.com/)
- [AWS Provider Documentation](https://registry.terraform.io/providers/hashicorp/aws/latest/docs)
- [Terraform Style Guide](https://www.terraform.io/docs/language/syntax/style.html)
- [tflint Rules](https://github.com/terraform-linters/tflint-ruleset-aws/blob/master/docs/rules/README.md)
- [tfsec Checks](https://aquasecurity.github.io/tfsec/)
