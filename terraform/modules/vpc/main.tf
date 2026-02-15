# VPC Module
# Creates VPC with public, private, and database subnets across multiple AZs

variable "name" { type = string }
variable "cidr" { type = string }
variable "azs" { type = list(string) }
variable "private_subnets" { type = list(string) }
variable "public_subnets" { type = list(string) }
variable "database_subnets" { type = list(string) }
variable "enable_nat_gateway" { type = bool }
variable "single_nat_gateway" { type = bool }
variable "enable_dns_hostnames" { type = bool }
variable "enable_dns_support" { type = bool }
variable "enable_flow_log" { type = bool }
variable "create_flow_log_cloudwatch_iam_role" { type = bool }
variable "create_flow_log_cloudwatch_log_group" { type = bool }
variable "public_subnet_tags" { type = map(string) }
variable "private_subnet_tags" { type = map(string) }
variable "tags" { type = map(string) }

resource "aws_vpc" "main" {
  cidr_block           = var.cidr
  enable_dns_hostnames = var.enable_dns_hostnames
  enable_dns_support   = var.enable_dns_support

  tags = merge(var.tags, { Name = var.name })
}

# Public Subnets
resource "aws_subnet" "public" {
  count = length(var.public_subnets)

  vpc_id                  = aws_vpc.main.id
  cidr_block              = var.public_subnets[count.index]
  availability_zone       = var.azs[count.index]
  map_public_ip_on_launch = true

  tags = merge(
    var.tags,
    var.public_subnet_tags,
    { Name = "${var.name}-public-${var.azs[count.index]}" }
  )
}

# Private Subnets
resource "aws_subnet" "private" {
  count = length(var.private_subnets)

  vpc_id            = aws_vpc.main.id
  cidr_block        = var.private_subnets[count.index]
  availability_zone = var.azs[count.index]

  tags = merge(
    var.tags,
    var.private_subnet_tags,
    { Name = "${var.name}-private-${var.azs[count.index]}" }
  )
}

# Database Subnets
resource "aws_subnet" "database" {
  count = length(var.database_subnets)

  vpc_id            = aws_vpc.main.id
  cidr_block        = var.database_subnets[count.index]
  availability_zone = var.azs[count.index]

  tags = merge(
    var.tags,
    { Name = "${var.name}-database-${var.azs[count.index]}" }
  )
}

# Internet Gateway
resource "aws_internet_gateway" "main" {
  vpc_id = aws_vpc.main.id

  tags = merge(var.tags, { Name = "${var.name}-igw" })
}

# Elastic IPs for NAT Gateways
resource "aws_eip" "nat" {
  count = var.enable_nat_gateway ? (var.single_nat_gateway ? 1 : length(var.azs)) : 0
  domain = "vpc"

  tags = merge(var.tags, { Name = "${var.name}-nat-eip-${count.index + 1}" })
}

# NAT Gateways
resource "aws_nat_gateway" "main" {
  count = var.enable_nat_gateway ? (var.single_nat_gateway ? 1 : length(var.azs)) : 0

  allocation_id = aws_eip.nat[count.index].id
  subnet_id     = aws_subnet.public[count.index].id

  tags = merge(var.tags, { Name = "${var.name}-nat-${count.index + 1}" })

  depends_on = [aws_internet_gateway.main]
}

# Public Route Table
resource "aws_route_table" "public" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.main.id
  }

  tags = merge(var.tags, { Name = "${var.name}-public-rt" })
}

# Private Route Tables
resource "aws_route_table" "private" {
  count = var.single_nat_gateway ? 1 : length(var.azs)

  vpc_id = aws_vpc.main.id

  route {
    cidr_block     = "0.0.0.0/0"
    nat_gateway_id = aws_nat_gateway.main[count.index].id
  }

  tags = merge(var.tags, { Name = "${var.name}-private-rt-${count.index + 1}" })
}

# Database Route Table
resource "aws_route_table" "database" {
  vpc_id = aws_vpc.main.id
  tags = merge(var.tags, { Name = "${var.name}-database-rt" })
}

# Route Table Associations - Public
resource "aws_route_table_association" "public" {
  count = length(var.public_subnets)

  subnet_id      = aws_subnet.public[count.index].id
  route_table_id = aws_route_table.public.id
}

# Route Table Associations - Private
resource "aws_route_table_association" "private" {
  count = length(var.private_subnets)

  subnet_id      = aws_subnet.private[count.index].id
  route_table_id = aws_route_table.private[var.single_nat_gateway ? 0 : count.index].id
}

# Route Table Associations - Database
resource "aws_route_table_association" "database" {
  count = length(var.database_subnets)

  subnet_id      = aws_subnet.database[count.index].id
  route_table_id = aws_route_table.database.id
}

# Database Subnet Group
resource "aws_db_subnet_group" "database" {
  name       = "${var.name}-db-subnet-group"
  subnet_ids = aws_subnet.database[*].id

  tags = merge(var.tags, { Name = "${var.name}-db-subnet-group" })
}

# VPC Flow Logs
resource "aws_flow_log" "main" {
  count = var.enable_flow_log ? 1 : 0

  iam_role_arn    = var.create_flow_log_cloudwatch_iam_role ? aws_iam_role.flow_log[0].arn : null
  log_destination = var.create_flow_log_cloudwatch_log_group ? aws_cloudwatch_log_group.flow_log[0].arn : null
  traffic_type    = "ALL"
  vpc_id          = aws_vpc.main.id

  tags = merge(var.tags, { Name = "${var.name}-flow-log" })
}

resource "aws_cloudwatch_log_group" "flow_log" {
  count = var.create_flow_log_cloudwatch_log_group ? 1 : 0

  name              = "/aws/vpc/${var.name}"
  retention_in_days = 30

  tags = merge(var.tags, { Name = "${var.name}-flow-log" })
}

resource "aws_iam_role" "flow_log" {
  count = var.create_flow_log_cloudwatch_iam_role ? 1 : 0

  name = "${var.name}-flow-log-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "vpc-flow-logs.amazonaws.com"
        }
      }
    ]
  })

  tags = var.tags
}

resource "aws_iam_role_policy" "flow_log" {
  count = var.create_flow_log_cloudwatch_iam_role ? 1 : 0

  name = "${var.name}-flow-log-policy"
  role = aws_iam_role.flow_log[0].id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents",
          "logs:DescribeLogGroups",
          "logs:DescribeLogStreams"
        ]
        Effect   = "Allow"
        Resource = "*"
      }
    ]
  })
}

# Outputs
output "vpc_id" { value = aws_vpc.main.id }
output "vpc_cidr_block" { value = aws_vpc.main.cidr_block }
output "private_subnets" { value = aws_subnet.private[*].id }
output "public_subnets" { value = aws_subnet.public[*].id }
output "database_subnets" { value = aws_subnet.database[*].id }
output "database_subnet_group_name" { value = aws_db_subnet_group.database.name }
output "nat_gateway_ids" { value = aws_nat_gateway.main[*].id }
