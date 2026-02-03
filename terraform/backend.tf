# Terraform Backend Configuration
# S3 backend for remote state management with DynamoDB for state locking
# NOTE: Backend configuration CANNOT use variables or interpolation
# Values must be provided via:
#   1. backend-config.hcl file
#   2. Command line: terraform init -backend-config="key=value"
#   3. Environment variables: TF_CLI_ARGS_init

terraform {
  backend "s3" {
    # These values should be provided during 'terraform init'
    # Example: terraform init -backend-config=backend-config.hcl
    
    # Uncomment and set these values OR provide via backend-config.hcl
    # bucket         = "portfolio-terraform-state-ACCOUNT_ID"
    # key            = "portfolio/terraform.tfstate"
    # region         = "ap-south-1"
    # encrypt        = true
    # dynamodb_table = "portfolio-terraform-locks"
    
    # Note: Backend configuration is commented to allow flexible initialization
    # Recommended: Use backend-config.hcl (see backend-config.hcl.example)
  }
}
