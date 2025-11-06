#!/bin/bash

# Frontend Docker Build Script
# Builds the frontend Docker image, extracts build artifacts, and cleans up

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ENV_FILE="$SCRIPT_DIR/../.env"
DOCKERFILE="$SCRIPT_DIR/docker-prod/Dockerfile"
IMAGE_TAG="cookbook-frontend-build:temp"
CONTAINER_NAME="cookbook-frontend-build-temp"

# Load environment variables from prod.env
if [ ! -f "$ENV_FILE" ]; then
    echo -e "${RED}Error: prod.env file not found at $ENV_FILE${NC}"
    exit 1
fi

echo -e "${YELLOW}Loading environment variables from prod.env...${NC}"
source "$ENV_FILE"

# Check if FRONTEND_BUILD_OUTPUT_PATH is set
if [ -z "$FRONTEND_BUILD_OUTPUT_PATH" ]; then
    echo -e "${RED}Error: FRONTEND_BUILD_OUTPUT_PATH is not set in prod.env${NC}"
    exit 1
fi

# Create output directory if it doesn't exist
mkdir -p "$FRONTEND_BUILD_OUTPUT_PATH"

echo -e "${GREEN}Configuration:${NC}"
echo "  Build context: $SCRIPT_DIR"
echo "  Dockerfile: $DOCKERFILE"
echo "  Output path: $FRONTEND_BUILD_OUTPUT_PATH"
echo ""

# Build the Docker image
echo -e "${YELLOW}Building Docker image...${NC}"
docker build -t "$IMAGE_TAG" -f "$DOCKERFILE" "$SCRIPT_DIR"

if [ $? -ne 0 ]; then
    echo -e "${RED}Error: Docker build failed${NC}"
    exit 1
fi

echo -e "${GREEN}Docker image built successfully!${NC}"
echo ""

# Create a temporary container (without running it)
echo -e "${YELLOW}Creating temporary container...${NC}"
CONTAINER_ID=$(docker create "$IMAGE_TAG")

if [ $? -ne 0 ]; then
    echo -e "${RED}Error: Failed to create container${NC}"
    docker rmi "$IMAGE_TAG" 2>/dev/null
    exit 1
fi

echo -e "${GREEN}Container created: $CONTAINER_ID${NC}"
echo ""

# Copy build artifacts from container to host
echo -e "${YELLOW}Extracting build artifacts to $FRONTEND_BUILD_OUTPUT_PATH...${NC}"
docker cp "$CONTAINER_ID:/frontend/dist/." "$FRONTEND_BUILD_OUTPUT_PATH/"

if [ $? -ne 0 ]; then
    echo -e "${RED}Error: Failed to copy build artifacts${NC}"
    docker rm "$CONTAINER_ID" 2>/dev/null
    docker rmi "$IMAGE_TAG" 2>/dev/null
    exit 1
fi

echo -e "${GREEN}Build artifacts extracted successfully!${NC}"
echo ""

# Cleanup: Remove container
echo -e "${YELLOW}Cleaning up container...${NC}"
docker rm "$CONTAINER_ID"

if [ $? -eq 0 ]; then
    echo -e "${GREEN}Container removed${NC}"
else
    echo -e "${RED}Warning: Failed to remove container${NC}"
fi

# Cleanup: Remove image
echo -e "${YELLOW}Cleaning up Docker image...${NC}"
docker rmi "$IMAGE_TAG"

if [ $? -eq 0 ]; then
    echo -e "${GREEN}Docker image removed${NC}"
else
    echo -e "${RED}Warning: Failed to remove Docker image${NC}"
fi

echo ""
echo -e "${GREEN}✓ Build complete!${NC}"
echo -e "${GREEN}✓ Build artifacts are available at: $FRONTEND_BUILD_OUTPUT_PATH${NC}"



