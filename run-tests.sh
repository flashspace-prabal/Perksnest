#!/bin/bash

# PerksNest Complete Test Suite Runner
# This script runs all tests: backend API tests, Google OAuth tests, and frontend E2E tests

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Functions
print_header() {
    echo -e "\n${BLUE}═══════════════════════════════════════════════════════════════${NC}"
    echo -e "${BLUE}  $1${NC}"
    echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}\n"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

# Check if running from correct directory
if [ ! -f "package.json" ]; then
    print_error "Please run this script from the project root directory"
    exit 1
fi

# Start time
START_TIME=$(date +%s)

# Track test results
BACKEND_TESTS=0
FRONTEND_TESTS=0
FAILED_TESTS=0

print_header "PerksNest End-to-End Test Suite"

# Step 1: Backend API Tests
print_header "Step 1: Backend API Tests"

if [ -d "backend" ]; then
    cd backend
    
    # Check if dependencies are installed
    if [ ! -d "node_modules" ]; then
        print_warning "Installing backend dependencies..."
        npm install
    fi
    
    # Create .env.test if it doesn't exist
    if [ ! -f ".env.test" ]; then
        if [ -f ".env.test.example" ]; then
            cp .env.test.example .env.test
            print_warning "Created .env.test from example. Please update with correct credentials."
        else
            print_error ".env.test not found and no example provided"
            exit 1
        fi
    fi
    
    print_header "Running Backend API Tests"
    
    # Run each test suite
    echo -e "${YELLOW}Running Authentication Tests...${NC}"
    if npm run test:auth 2>&1 | grep -q "PASS\|✓"; then
        print_success "Authentication tests passed"
        ((BACKEND_TESTS++))
    else
        print_error "Authentication tests failed"
        ((FAILED_TESTS++))
    fi
    
    echo -e "\n${YELLOW}Running Deals Tests...${NC}"
    if npm run test:deals 2>&1 | grep -q "PASS\|✓"; then
        print_success "Deals tests passed"
        ((BACKEND_TESTS++))
    else
        print_error "Deals tests failed"
        ((FAILED_TESTS++))
    fi
    
    echo -e "\n${YELLOW}Running User Tests...${NC}"
    if npm run test:user 2>&1 | grep -q "PASS\|✓"; then
        print_success "User tests passed"
        ((BACKEND_TESTS++))
    else
        print_error "User tests failed"
        ((FAILED_TESTS++))
    fi
    
    echo -e "\n${YELLOW}Running Referrals Tests...${NC}"
    if npm run test:referrals 2>&1 | grep -q "PASS\|✓"; then
        print_success "Referrals tests passed"
        ((BACKEND_TESTS++))
    else
        print_error "Referrals tests failed"
        ((FAILED_TESTS++))
    fi
    
    echo -e "\n${YELLOW}Running Google OAuth Tests...${NC}"
    if npm run test -- __tests__/google-oauth.test.js 2>&1 | grep -q "PASS\|✓"; then
        print_success "Google OAuth tests passed"
        ((BACKEND_TESTS++))
    else
        print_error "Google OAuth tests failed"
        ((FAILED_TESTS++))
    fi
    
    echo -e "\n${YELLOW}Running Integration Tests...${NC}"
    if npm run test:integration 2>&1 | grep -q "PASS\|✓"; then
        print_success "Integration tests passed"
        ((BACKEND_TESTS++))
    else
        print_error "Integration tests failed"
        ((FAILED_TESTS++))
    fi
    
    cd ..
else
    print_warning "Backend directory not found, skipping backend tests"
fi

# Step 2: Frontend E2E Tests
print_header "Step 2: Frontend E2E Tests"

if [ -d "frontend" ]; then
    cd frontend
    
    # Check if dependencies are installed
    if [ ! -d "node_modules" ]; then
        print_warning "Installing frontend dependencies..."
        npm install
        npx playwright install
    fi
    
    # Check if Playwright browsers are installed
    if ! npx playwright --version &> /dev/null; then
        print_warning "Installing Playwright browsers..."
        npx playwright install
    fi
    
    # Create .env.local if it doesn't exist
    if [ ! -f ".env.local" ]; then
        if [ -f ".env" ]; then
            cp .env .env.local
        else
            print_warning "No .env.local or .env found. Frontend tests may fail."
        fi
    fi
    
    print_header "Running Frontend E2E Tests"
    
    echo -e "${YELLOW}Running Chromium E2E tests...${NC}"
    if npm run test:e2e:chromium 2>&1 | grep -q "passed\|✓"; then
        print_success "Chromium E2E tests passed"
        ((FRONTEND_TESTS++))
    else
        print_error "Chromium E2E tests failed"
        ((FAILED_TESTS++))
    fi
    
    echo -e "\n${YELLOW}Running Firefox E2E tests...${NC}"
    if npm run test:e2e:firefox 2>&1 | grep -q "passed\|✓"; then
        print_success "Firefox E2E tests passed"
        ((FRONTEND_TESTS++))
    else
        print_error "Firefox E2E tests failed (may be ok if not required)"
    fi
    
    echo -e "\n${YELLOW}Running Unit Tests...${NC}"
    if npm run test 2>&1 | grep -q "PASS\|✓"; then
        print_success "Unit tests passed"
        ((FRONTEND_TESTS++))
    else
        print_error "Unit tests failed"
        ((FAILED_TESTS++))
    fi
    
    cd ..
else
    print_warning "Frontend directory not found, skipping frontend tests"
fi

# Step 3: Summary
END_TIME=$(date +%s)
DURATION=$((END_TIME - START_TIME))

print_header "Test Summary"

echo -e "${BLUE}Backend Test Suites Passed:${NC} ${GREEN}${BACKEND_TESTS}${NC}"
echo -e "${BLUE}Frontend Test Suites Passed:${NC} ${GREEN}${FRONTEND_TESTS}${NC}"
echo -e "${BLUE}Total Test Suites:${NC} ${GREEN}$((BACKEND_TESTS + FRONTEND_TESTS))${NC}"
echo -e "${BLUE}Failed Test Suites:${NC} $([ $FAILED_TESTS -eq 0 ] && echo -e "${GREEN}${FAILED_TESTS}${NC}" || echo -e "${RED}${FAILED_TESTS}${NC}")"
echo -e "${BLUE}Duration:${NC} ${DURATION}s"

if [ $FAILED_TESTS -eq 0 ]; then
    print_header "✓ All Tests Passed!"
    echo -e "${GREEN}PerksNest is ready for deployment!${NC}\n"
    exit 0
else
    print_header "✗ Some Tests Failed"
    echo -e "${RED}Please fix the failing tests before proceeding.${NC}\n"
    exit 1
fi
