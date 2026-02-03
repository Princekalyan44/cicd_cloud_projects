#!/bin/bash
# Terraform Validation Script
# Runs multiple validation checks on Terraform code
# Use in CI/CD or pre-commit hooks

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

ERROR_COUNT=0

echo -e "${GREEN}=== Terraform Validation ===${NC}"
echo ""

# Check if terraform is installed
if ! command -v terraform &> /dev/null; then
    echo -e "${RED}Error: Terraform is not installed${NC}"
    exit 1
fi

TERRAFORM_VERSION=$(terraform version -json | jq -r '.terraform_version')
echo -e "${GREEN}Terraform version: ${TERRAFORM_VERSION}${NC}"
echo ""

# 1. Terraform Format Check
echo -e "${YELLOW}1. Running terraform fmt...${NC}"
if terraform fmt -check -recursive; then
    echo -e "${GREEN}✓ Format check passed${NC}"
else
    echo -e "${RED}✗ Format check failed. Run: terraform fmt -recursive${NC}"
    ((ERROR_COUNT++))
fi
echo ""

# 2. Terraform Init
echo -e "${YELLOW}2. Running terraform init...${NC}"
if terraform init -backend=false > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Init successful${NC}"
else
    echo -e "${RED}✗ Init failed${NC}"
    ((ERROR_COUNT++))
fi
echo ""

# 3. Terraform Validate
echo -e "${YELLOW}3. Running terraform validate...${NC}"
if terraform validate; then
    echo -e "${GREEN}✓ Validation passed${NC}"
else
    echo -e "${RED}✗ Validation failed${NC}"
    ((ERROR_COUNT++))
fi
echo ""

# 4. TFLint (if installed)
if command -v tflint &> /dev/null; then
    echo -e "${YELLOW}4. Running tflint...${NC}"
    if tflint --init && tflint; then
        echo -e "${GREEN}✓ TFLint passed${NC}"
    else
        echo -e "${RED}✗ TFLint found issues${NC}"
        ((ERROR_COUNT++))
    fi
    echo ""
else
    echo -e "${YELLOW}4. TFLint not installed (skipping)${NC}"
    echo "   Install: https://github.com/terraform-linters/tflint"
    echo ""
fi

# 5. Terraform Security Scan with tfsec (if installed)
if command -v tfsec &> /dev/null; then
    echo -e "${YELLOW}5. Running tfsec...${NC}"
    if tfsec . --soft-fail; then
        echo -e "${GREEN}✓ Security scan passed${NC}"
    else
        echo -e "${YELLOW}⚠ Security issues found (soft-fail)${NC}"
    fi
    echo ""
else
    echo -e "${YELLOW}5. tfsec not installed (skipping)${NC}"
    echo "   Install: https://github.com/aquasecurity/tfsec"
    echo ""
fi

# 6. Checkov scan (if installed)
if command -v checkov &> /dev/null; then
    echo -e "${YELLOW}6. Running checkov...${NC}"
    if checkov -d . --framework terraform --soft-fail; then
        echo -e "${GREEN}✓ Checkov scan passed${NC}"
    else
        echo -e "${YELLOW}⚠ Security issues found (soft-fail)${NC}"
    fi
    echo ""
else
    echo -e "${YELLOW}6. Checkov not installed (skipping)${NC}"
    echo "   Install: pip install checkov"
    echo ""
fi

# Summary
echo ""
echo -e "${GREEN}=== Validation Complete ===${NC}"
if [ $ERROR_COUNT -eq 0 ]; then
    echo -e "${GREEN}✓ All checks passed!${NC}"
    exit 0
else
    echo -e "${RED}✗ ${ERROR_COUNT} check(s) failed${NC}"
    exit 1
fi
