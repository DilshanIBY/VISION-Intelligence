#!/bin/bash
#
# Run GitHub Actions workflows locally using act (Docker-based)
# Requires Docker to be running.

set -e

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
NC='\033[0m'

success() { echo -e "${GREEN}✓ $1${NC}"; }
error() { echo -e "${RED}✗ $1${NC}"; }
info() { echo -e "${CYAN}→ $1${NC}"; }
header() { echo -e "\n${YELLOW}═══ $1 ═══${NC}"; }

header "APPAREL Local CI/CD Runner"

# Check Docker
info "Checking Docker..."
if ! docker info > /dev/null 2>&1; then
    error "Docker is not running. Please start Docker and try again."
    exit 1
fi
success "Docker is running"

# Check/Install act
info "Checking act..."
if ! command -v act &> /dev/null; then
    info "Installing act..."
    if command -v brew &> /dev/null; then
        brew install act
    elif command -v curl &> /dev/null; then
        curl -s https://raw.githubusercontent.com/nektos/act/master/install.sh | sudo bash
    else
        error "Cannot install act. Please install manually: https://github.com/nektos/act"
        exit 1
    fi
fi
success "act is available"

# Navigate to project root
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
cd "$PROJECT_ROOT"

header "Running CI Workflow"
info "This will run: lint, type-check, format:check, build"
echo ""

# Run act with the CI workflow
act push -W .github/workflows/ci.yml --container-architecture linux/amd64 -P ubuntu-latest=catthehacker/ubuntu:act-latest

if [ $? -eq 0 ]; then
    echo ""
    header "ALL CHECKS PASSED"
    success "Safe to push!"
    exit 0
else
    echo ""
    header "CHECKS FAILED"
    error "Please fix the issues above before pushing."
    exit 1
fi
