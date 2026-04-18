#!/bin/bash
# PerksNest Test Commands Reference
# Copy commands from this file to run specific tests

# ============================================================================
# BACKEND TESTS
# ============================================================================

# Run ALL backend tests
cd backend && npm test

# Run specific test suites
npm run test:auth                                    # Authentication tests
npm run test:deals                                   # Deals tests
npm run test:user                                    # User management tests
npm run test:referrals                               # Referral system tests
npm run test:integration                             # End-to-end integration tests
npm run test -- __tests__/google-oauth.test.js      # Google OAuth tests (20+ scenarios)

# Run tests with coverage report
npm run test:coverage

# Run tests in watch mode
npm run test:watch

# Run specific test by name pattern
npm test -- -t "should register a new user"
npm test -- -t "should login with Google"
npm test -- -t "referral"

# Run with verbose output
npm test -- --verbose

# Run single test file with debugging
node --inspect-brk node_modules/.bin/jest --runInBand __tests__/google-oauth.test.js

# ============================================================================
# FRONTEND E2E TESTS
# ============================================================================

cd frontend

# Run ALL E2E tests
npm run test:e2e

# Run specific browser
npm run test:e2e:chromium                            # Chromium only
npm run test:e2e:firefox                             # Firefox only
npm run test:e2e:webkit                              # WebKit (Safari) only

# Run specific test file
npm run test:e2e -- src/tests/e2e/google-oauth.spec.ts
npm run test:e2e -- src/tests/e2e/main.spec.ts

# Debug mode (shows UI with step-by-step execution)
npm run test:e2e:debug

# Interactive UI mode
npm run test:e2e:ui

# Run with specific browser and debug
npx playwright test src/tests/e2e/google-oauth.spec.ts --project=chromium --debug

# Run unit tests
npm run test

# Run unit tests in watch mode
npm run test:watch

# ============================================================================
# COMPLETE TEST SUITES
# ============================================================================

# From project root, run all tests
cd ..
bash run-tests.sh              # Linux/Mac
run-tests.bat                  # Windows

# ============================================================================
# GOOGLE OAUTH SPECIFIC TESTS
# ============================================================================

cd backend

# All Google OAuth tests
npm run test -- __tests__/google-oauth.test.js

# Specific Google OAuth test
npm run test -- __tests__/google-oauth.test.js -t "should handle Google OAuth token successfully"
npm run test -- __tests__/google-oauth.test.js -t "should create new user"
npm run test -- __tests__/google-oauth.test.js -t "should login existing user"
npm run test -- __tests__/google-oauth.test.js -t "referral"
npm run test -- __tests__/google-oauth.test.js -t "error handling"

cd ../frontend

# Google OAuth E2E tests
npm run test:e2e -- src/tests/e2e/google-oauth.spec.ts

# Specific scenario
npm run test:e2e -- -g "Complete Google OAuth flow"
npm run test:e2e -- -g "Google user can update preferences"

# ============================================================================
# CONTINUOUS INTEGRATION COMMANDS
# ============================================================================

# Full CI test suite
cd backend && npm test -- --coverage && cd ../frontend && npm run test:e2e

# With junit output for CI systems
npm test -- --reporters=default --reporters=jest-junit

# Generate coverage report for SonarQube
npm test -- --coverage --collectCoverageFrom="src/**/*.js"

# ============================================================================
# TESTING RESULTS & REPORTS
# ============================================================================

# View backend coverage report
open backend/coverage/lcov-report/index.html          # macOS
xdg-open backend/coverage/lcov-report/index.html      # Linux
start backend\coverage\lcov-report\index.html         # Windows

# View Playwright HTML report
open frontend/playwright-report/index.html
xdg-open frontend/playwright-report/index.html
start frontend\playwright-report\index.html

# View JUnit XML report (for CI)
cat test-results/junit.xml

# ============================================================================
# SETUP & INSTALLATION
# ============================================================================

# Install backend dependencies
cd backend && npm install

# Install frontend dependencies
cd frontend && npm install

# Install Playwright browsers
npx playwright install

# Create test environment
cd backend && cp .env.test.example .env.test

# ============================================================================
# DEBUGGING COMMANDS
# ============================================================================

# Backend with debug logging
DEBUG=perksnest:* npm test

# Frontend with detailed error output
npm run test:e2e -- --reporter=verbose

# Frontend with screenshots on failure
npm run test:e2e -- --screenshot=only-on-failure

# Frontend with video recording
npm run test:e2e -- --video=on

# Check Playwright health
npx playwright --version
npx playwright diagnostics

# ============================================================================
# PERFORMANCE & PROFILING
# ============================================================================

# Time test execution
time npm test

# Run with performance profiling (backend)
node --prof node_modules/.bin/jest

# Memory usage tracking
npm test -- --forceExit --detectOpenHandles

# ============================================================================
# FILTERING & SELECTION
# ============================================================================

# Run tests by name pattern
npm test -- -t "Google"                              # All "Google" related tests
npm test -- -t "claim"                               # All "claim" related tests
npm test -- -t "workflow"                            # All "workflow" related tests

# Run excluding certain tests
npm test -- --testNamePattern="^(?!.*network)"       # Exclude network tests

# Run only changed tests
npm test -- --onlyChanged

# ============================================================================
# EXAMPLE WORKFLOWS
# ============================================================================

# Complete test for new feature
echo "1. Running backend API tests..."
cd backend && npm test
echo "2. Running frontend E2E tests..."
cd ../frontend && npm run test:e2e
echo "3. Generating reports..."
echo "Done! Check reports in coverage/ and playwright-report/"

# Quick smoke test
npm run test:e2e:chromium --project=chromium

# Full regression before deployment
bash run-tests.sh

# Google OAuth validation only
cd backend && npm run test -- __tests__/google-oauth.test.js && \
cd ../frontend && npm run test:e2e -- google-oauth.spec.ts

# ============================================================================
# TROUBLESHOOTING COMMANDS
# ============================================================================

# Clear Jest cache
npm test -- --clearCache

# Reinstall Playwright
npx playwright install --with-deps

# Clear npm cache
npm cache clean --force

# Check for open ports
lsof -i :3000      # macOS/Linux
netstat -ano | findstr :3000  # Windows

# Kill process on port 3000
kill -9 $(lsof -t -i:3000)   # macOS/Linux
taskkill /PID <PID> /F       # Windows

# ============================================================================
# EXAMPLE OUTPUT INTERPRETATION
# ============================================================================

# Successful test output:
# PASS  __tests__/auth.test.js
# ✓ User can register with email and password (234 ms)
# ✓ User can login with email and password (145 ms)
# ✓ User can login with Google authentication (567 ms)
# Tests: 3 passed, 3 total
# Time: 2.456 s

# Failed test output:
# FAIL  __tests__/auth.test.js
# ✕ User can login with invalid credentials (345 ms)
# ● User can login with invalid credentials
#   Expected: error message
#   Received: null
# Tests: 1 failed, 2 passed, 3 total
# Time: 1.234 s

# ============================================================================
# IMPORTANT NOTES
# ============================================================================

# Before running tests:
# 1. Ensure backend and frontend are not running (or will auto-start)
# 2. Check that .env.test is properly configured
# 3. Verify Supabase credentials are valid
# 4. Ensure port 3000 and 5173 are available

# Common issues:
# - Tests timeout: Increase timeout in config files
# - Port already in use: Kill process or change port
# - Playwright issues: Run npx playwright install
# - Google OAuth fails: Check test credentials

# Performance tips:
# - Run tests in parallel (but not for some integration tests)
# - Use --maxWorkers=4 to limit parallelization
# - Run unit tests before E2E tests
# - Skip slow tests in local development with --onlyChanged

# Generated files:
# - backend/coverage/              # Code coverage reports
# - frontend/playwright-report/    # E2E test results
# - test-results/junit.xml         # CI/CD compatible format
# - test-results/videos/           # Video recordings of failures
# - test-results/traces/           # Playwright traces

# ============================================================================
