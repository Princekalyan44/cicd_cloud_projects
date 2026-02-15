# Docker Compose Guide - Portfolio Application

Complete guide for running the portfolio application using Docker Compose.

## 📋 Table of Contents

- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Service Details](#service-details)
- [Common Commands](#common-commands)
- [Configuration](#configuration)
- [Troubleshooting](#troubleshooting)

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────┐
│         Docker Compose Stack            │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │   portfolio-frontend:3000       │   │
│  │   (Next.js Application)         │   │
│  │                                 │   │
│  │   - Serves web UI               │   │
│  │   - Handles routing             │   │
│  │   - Connects to chatbot         │   │
│  └──────────┬──────────────────────┘   │
│             │                           │
│             │ HTTP Requests             │
│             ↓                           │
│  ┌─────────────────────────────────┐   │
│  │   chatbot-service:8080          │   │
│  │   (Python FastAPI Backend)      │   │
│  │                                 │   │
│  │   - AI-powered responses        │   │
│  │   - Portfolio Q&A               │   │
│  │   - RAG implementation          │   │
│  └─────────────────────────────────┘   │
│                                         │
│         portfolio-network (bridge)      │
└─────────────────────────────────────────┘
          ↓
    Host: localhost:3000
```

---

## ✅ Prerequisites

### Required Software

```bash
# Docker Desktop (includes Docker Compose)
# macOS/Windows: https://www.docker.com/products/docker-desktop

# Linux:
sudo apt-get update
sudo apt-get install docker.io docker-compose
```

### Verify Installation

```bash
# Check Docker version
docker --version
# Expected: Docker version 24.0.0 or higher

# Check Docker Compose version
docker-compose --version
# Expected: Docker Compose version 2.20.0 or higher
```

### Pre-built Images

Ensure you have built both images:

```bash
# Frontend image
docker images | grep portfolio-frontend
# kalyanace44/portfolio-frontend:v1

# Chatbot image
docker images | grep portfolio-chatbot
# kalyanace44/portfolio-chatbot:v1
```

---

## 🚀 Quick Start

### 1. Clone and Navigate

```bash
git clone https://github.com/Princekalyan44/cicd_cloud_projects.git
cd cicd_cloud_projects
```

### 2. Start All Services

```bash
# Start services in detached mode
docker-compose up -d

# Or with logs visible
docker-compose up
```

**Expected output:**
```
Creating network "portfolio-network" ... done
Creating portfolio-chatbot   ... done
Creating portfolio-frontend  ... done
```

### 3. Verify Services

```bash
# Check running containers
docker-compose ps

# Expected output:
NAME                  STATUS    PORTS
portfolio-frontend    Up        0.0.0.0:3000->3000/tcp
portfolio-chatbot     Up        8080/tcp
```

### 4. Access the Application

```bash
# Open in browser
open http://localhost:3000

# Or curl
curl http://localhost:3000
```

---

## 📦 Service Details

### Portfolio Frontend

| Property | Value |
|----------|-------|
| **Image** | `kalyanace44/portfolio-frontend:v1` |
| **Port** | `3000` (exposed to host) |
| **Technology** | Next.js 14 |
| **CPU Limit** | 1.0 cores |
| **Memory Limit** | 512 MB |
| **Health Check** | `http://localhost:3000` |

**Environment Variables:**
- `NODE_ENV=production`
- `CHATBOT_API_URL=http://chatbot-service:8080`

### Chatbot Service

| Property | Value |
|----------|-------|
| **Image** | `kalyanace44/portfolio-chatbot:v1` |
| **Port** | `8080` (internal only) |
| **Technology** | Python FastAPI |
| **CPU Limit** | 1.0 cores |
| **Memory Limit** | 1 GB |
| **Health Check** | `http://localhost:8080/health` |

**Environment Variables:**
- `ENVIRONMENT=production`
- `PORT=8080`
- `LOG_LEVEL=info`

---

## 🛠️ Common Commands

### Starting Services

```bash
# Start all services
docker-compose up -d

# Start specific service
docker-compose up -d portfolio-frontend

# Start with build (if source changed)
docker-compose up -d --build

# View logs while starting
docker-compose up
```

### Stopping Services

```bash
# Stop all services
docker-compose stop

# Stop specific service
docker-compose stop portfolio-frontend

# Stop and remove containers
docker-compose down

# Stop, remove containers, networks, and volumes
docker-compose down -v
```

### Viewing Logs

```bash
# View logs from all services
docker-compose logs

# Follow logs (real-time)
docker-compose logs -f

# View logs from specific service
docker-compose logs portfolio-frontend
docker-compose logs chatbot-service

# Last 50 lines
docker-compose logs --tail=50
```

### Container Management

```bash
# List running services
docker-compose ps

# Restart services
docker-compose restart

# Restart specific service
docker-compose restart portfolio-frontend

# Execute command in container
docker-compose exec portfolio-frontend sh
docker-compose exec chatbot-service bash
```

### Health Checks

```bash
# Check service health
docker-compose ps

# Manual health check - frontend
curl http://localhost:3000

# Manual health check - chatbot (if exposed)
curl http://localhost:8080/health
```

### Resource Monitoring

```bash
# View resource usage
docker stats

# Specific service
docker stats portfolio-frontend portfolio-chatbot
```

---

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the project root:

```bash
# .env file

# Frontend Configuration
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1

# Chatbot Configuration
ENVIRONMENT=production
PORT=8080
LOG_LEVEL=info

# Optional: AI Service API Keys
# OPENAI_API_KEY=sk-...
# ANTHROPIC_API_KEY=...
```

### Using Custom Images

Edit `docker-compose.yml`:

```yaml
services:
  portfolio-frontend:
    image: your-registry/portfolio-frontend:custom-tag
    # ...
```

### Exposing Chatbot Port

To access chatbot API directly, uncomment in `docker-compose.yml`:

```yaml
chatbot-service:
  ports:
    - "8080:8080"  # Uncomment this line
```

Then restart:
```bash
docker-compose down
docker-compose up -d
curl http://localhost:8080/health
```

### Custom Network

Change network name in `docker-compose.yml`:

```yaml
networks:
  portfolio-network:
    driver: bridge
    name: custom-network-name
```

---

## 🐛 Troubleshooting

### Services Won't Start

**Issue:** `ERROR: for portfolio-frontend  Cannot start service`

**Solution:**
```bash
# Check if images exist
docker images | grep portfolio

# If missing, build them
cd portfolio-frontend
docker build -t kalyanace44/portfolio-frontend:v1 .

cd ../chatbot-service
docker build -t kalyanace44/portfolio-chatbot:v1 .

# Retry
cd ..
docker-compose up -d
```

### Port Already in Use

**Issue:** `bind: address already in use`

**Solution:**
```bash
# Find process using port 3000
lsof -i :3000

# Kill the process
kill -9 <PID>

# Or change port in docker-compose.yml
ports:
  - "3001:3000"  # Use different host port
```

### Service Unhealthy

**Issue:** Service shows as "unhealthy" in `docker-compose ps`

**Solution:**
```bash
# Check logs
docker-compose logs chatbot-service

# Check health endpoint manually
docker-compose exec chatbot-service curl http://localhost:8080/health

# Restart service
docker-compose restart chatbot-service
```

### Frontend Can't Connect to Chatbot

**Issue:** Chatbot API calls fail from frontend

**Solution:**
```bash
# Verify both services are on same network
docker network inspect portfolio-network

# Check chatbot is running
docker-compose ps chatbot-service

# Test connectivity from frontend container
docker-compose exec portfolio-frontend wget -O- http://chatbot-service:8080/health
```

### Out of Memory

**Issue:** Container crashes with OOM error

**Solution:**
```yaml
# Increase memory limits in docker-compose.yml
deploy:
  resources:
    limits:
      memory: 2G  # Increase from 1G
```

### Rebuild Everything

**Nuclear option** - clean slate:

```bash
# Stop and remove everything
docker-compose down -v

# Remove images
docker rmi kalyanace44/portfolio-frontend:v1
docker rmi kalyanace44/portfolio-chatbot:v1

# Rebuild
cd portfolio-frontend
docker build -t kalyanace44/portfolio-frontend:v1 .

cd ../chatbot-service
docker build -t kalyanace44/portfolio-chatbot:v1 .

# Start fresh
cd ..
docker-compose up -d
```

---

## 📊 Production Deployment

### Docker Swarm (Single Node)

```bash
# Initialize swarm
docker swarm init

# Deploy stack
docker stack deploy -c docker-compose.yml portfolio

# Check services
docker stack services portfolio
```

### Kubernetes (via Kompose)

```bash
# Install kompose
curl -L https://github.com/kubernetes/kompose/releases/download/v1.31.2/kompose-linux-amd64 -o kompose
chmod +x kompose
sudo mv kompose /usr/local/bin/

# Convert to Kubernetes manifests
kompose convert

# Deploy to Kubernetes
kubectl apply -f .
```

---

## 🎯 Testing

### Integration Test

```bash
#!/bin/bash
# test-stack.sh

echo "🧪 Testing Portfolio Stack..."

# Start services
docker-compose up -d
sleep 10

# Test frontend
echo "Testing frontend..."
FRONTEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000)
if [ "$FRONTEND_STATUS" == "200" ]; then
    echo "✅ Frontend OK"
else
    echo "❌ Frontend FAIL (HTTP $FRONTEND_STATUS)"
    exit 1
fi

# Test chatbot (if exposed)
# echo "Testing chatbot..."
# CHATBOT_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8080/health)
# if [ "$CHATBOT_STATUS" == "200" ]; then
#     echo "✅ Chatbot OK"
# else
#     echo "❌ Chatbot FAIL (HTTP $CHATBOT_STATUS)"
#     exit 1
# fi

echo "🎉 All tests passed!"
```

---

## 📝 Summary

**Start Application:**
```bash
docker-compose up -d
```

**Access:**
- Frontend: http://localhost:3000
- Chatbot: Internal only (via frontend)

**Stop Application:**
```bash
docker-compose down
```

**View Logs:**
```bash
docker-compose logs -f
```

---

**Created:** February 15, 2026  
**Version:** 1.0.0  
**Status:** ✅ Production Ready
