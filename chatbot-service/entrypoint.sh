#!/bin/bash
# Entrypoint script for chatbot service
# This ensures database is ready before starting the service

set -e

echo "================================================"
echo "Starting Portfolio Chatbot Service"
echo "================================================"

# ============================================
# Wait for PostgreSQL to be ready
# ============================================
echo "Waiting for PostgreSQL to be ready..."

until pg_isready -h "${DB_HOST:-postgres}" -p "${DB_PORT:-5432}" -U "${DB_USER:-dbadmin}"; do
  echo "PostgreSQL is unavailable - sleeping"
  sleep 2
done

echo "PostgreSQL is ready!"

# ============================================
# Check if pgvector extension is installed
# ============================================
echo "Checking pgvector extension..."

PGPASSWORD="${DB_PASSWORD}" psql \
  -h "${DB_HOST:-postgres}" \
  -U "${DB_USER:-dbadmin}" \
  -d "${DB_NAME:-portfolio}" \
  -c "CREATE EXTENSION IF NOT EXISTS vector;"

echo "pgvector extension verified"

# ============================================
# Run database migrations (create tables)
# ============================================
echo "Running database migrations..."

python3 /app/scripts/init_db.py

echo "Database initialized"

# ============================================
# Seed knowledge base (if empty)
# ============================================
echo "Checking knowledge base..."

python3 /app/scripts/seed_knowledge.py

echo "Knowledge base ready"

# ============================================
# Start the chatbot service
# ============================================
echo "Starting chatbot service on port ${PORT:-8080}..."
echo "================================================"

# Execute the original chatbot command
exec python3 -m chatbot.main
