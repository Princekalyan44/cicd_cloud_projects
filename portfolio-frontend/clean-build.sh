#!/bin/bash

# Clean Build Script for Portfolio Frontend
# Use this after updating package.json to ensure clean Docker builds

set -e  # Exit on error

echo "🧹 Cleaning build artifacts..."

# Remove node_modules and package-lock.json
if [ -d "node_modules" ]; then
    echo "   Removing node_modules/"
    rm -rf node_modules
fi

if [ -f "package-lock.json" ]; then
    echo "   Removing package-lock.json"
    rm -f package-lock.json
fi

echo "✅ Clean complete!"
echo ""
echo "🐳 Building Docker image..."
echo ""

# Build Docker image
IMAGE_NAME="${1:-kalyanace44/portfolio-frontend:v1}"

docker build -t "$IMAGE_NAME" .

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Docker build successful!"
    echo "   Image: $IMAGE_NAME"
    echo ""
    echo "🚀 To run the container:"
    echo "   docker run -p 3000:3000 $IMAGE_NAME"
else
    echo ""
    echo "❌ Docker build failed!"
    exit 1
fi
