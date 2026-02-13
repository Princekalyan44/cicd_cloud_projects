# Dockerfile for AI Chatbot Service
# Based on jasonacox/chatbot with custom configurations

# ============================================
# Use official chatbot image as base
# ============================================
FROM jasonacox/chatbot:latest

# Set working directory
WORKDIR /app

# ============================================
# Install additional dependencies
# ============================================
# Add PostgreSQL client for database connectivity
# Add Python libraries for RAG implementation
RUN apt-get update && apt-get install -y \
    postgresql-client \
    python3-pip \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install Python packages for RAG
# pgvector: PostgreSQL vector database client
# sentence-transformers: For generating embeddings
# langchain: RAG framework
RUN pip3 install --no-cache-dir \
    pgvector==0.2.4 \
    sentence-transformers==2.3.1 \
    langchain==0.1.6 \
    psycopg2-binary==2.9.9 \
    python-dotenv==1.0.0

# ============================================
# Copy custom configuration and scripts
# ============================================
# Copy entrypoint script if it exists
#COPY --from=builder --chown=nextjs:nodejs /app/public ./public 2>/dev/null || true
RUN chmod +x /app/entrypoint.sh

# ============================================
# Environment variables
# ============================================
# These will be overridden by Kubernetes secrets
ENV DATABASE_URL=postgresql://user:pass@postgres:5432/portfolio
ENV PGVECTOR_ENABLED=true
ENV EMBEDDING_MODEL=sentence-transformers/all-MiniLM-L6-v2
ENV MAX_CONTEXT_LENGTH=2000
ENV TEMPERATURE=0.7
ENV PORT=8080

# ============================================
# Health check
# ============================================
# Check if chatbot service is responding
HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
  CMD curl -f http://localhost:8080/health || curl -f http://localhost:8080/ || exit 1

# Expose port
EXPOSE 8080

# Run entrypoint script
# This script:
# 1. Waits for database to be ready (if configured)
# 2. Runs data seeding if needed (if configured)
# 3. Starts chatbot service
ENTRYPOINT ["/app/entrypoint.sh"]
