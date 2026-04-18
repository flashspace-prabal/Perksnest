# PerksNest End-to-End Testing Guide

## Overview

This document provides comprehensive instructions for running end-to-end tests across the PerksNest platform, including API testing, frontend E2E testing, and workflow validation.

## Test Structure

### Backend Testing (Jest)
- **Location**: `backend/__tests__/`
- **Framework**: Jest + Supertest
- **Coverage**:
  - Authentication (registration, login, Google OAuth, email verification)
  - Deals (browsing, claiming, reviews)
  - User operations (profile, bookmarks, claims)
  - Referral system
  - Integration workflows
  - Support tickets

### Frontend Testing (Playwright)
- **Location**: `frontend/src/tests/e2e/`
- **Framework**: Playwright (Chromium, Firefox, WebKit)
- **Coverage**:
  - Authentication flows (email/password, Google OAuth)
  - Deal browsing and filtering
  - Deal claiming and bookmarking
  - User dashboard and profile
  - Referral system
  - Responsive design (mobile, tablet, desktop)
  - Error handling

## Setup Instructions

### Backend Setup

1. **Install dependencies**:
   ```bash
   cd backend
   npm install
   ```

2. **Create `.env.test` file**:
   ```bash
   cp .env .env.test
   ```

3. **Configure test environment**:
   ```
   NODE_ENV=test
   SUPABASE_URL=https://test.supabase.co
   SUPABASE_ANON_KEY=test-anon-key
   SUPABASE_SERVICE_KEY=test-service-key
   JWT_SECRET=test-jwt-secret
   BACKEND_URL=http://localhost:3000
   ```

### Frontend Setup

1. **Install dependencies**:
   ```bash
   cd frontend
   npm install
   npx playwright install
   ```

2. **Create `.env.test` file**:
   ```bash
   cp .env .env.local
   ```

3. **Configure test environment**:
   ```
   VITE_SUPABASE_URL=https://test.supabase.co
   VITE_SUPABASE_ANON_KEY=test-anon-key
   VITE_API_BASE_URL=http://localhost:3000
   FRONTEND_URL=http://localhost:5173
   ```

## Running Tests

### Backend Tests

#### Run All Tests
```bash
cd backend
npm test
```

#### Run Specific Test Suite
```bash
# Authentication tests
npm run test:auth

# Deals tests
npm run test:deals

# User tests
npm run test:user

# Referrals tests
npm run test:referrals

# Integration tests
npm run test:integration
```

#### Watch Mode
```bash
npm run test:watch
```

#### With Coverage
```bash
npm run test:coverage
```

### Frontend Tests

#### Run All E2E Tests
```bash
cd frontend
npm run test:e2e
```

#### Run Tests in Specific Browser
```bash
# Chromium only
npm run test:e2e:chromium

# Firefox only
npm run test:e2e:firefox

# WebKit only
npm run test:e2e:webkit
```

#### Debug Mode
```bash
npm run test:e2e:debug
```

#### UI Mode (Interactive)
```bash
npm run test:e2e:ui
```

#### Watch Mode
```bash
npm run test:e2e -- --watch
```

## Test Workflows Covered

### 1. Authentication & Login
- ✅ Email/password registration
- ✅ Email/password login
- ✅ Google OAuth login
- ✅ Email verification
- ✅ Password reset
- ✅ Token refresh
- ✅ Logout

### 2. Deal Discovery
- ✅ Browse all deals
- ✅ Filter by category
- ✅ Search deals
- ✅ View deal details
- ✅ Read reviews
- ✅ Pagination

### 3. Deal Claiming
- ✅ Claim deals
- ✅ View claimed deals
- ✅ Prevent duplicate claims
- ✅ Submit reviews

### 4. Bookmarks
- ✅ Bookmark deals
- ✅ View bookmarks
- ✅ Remove bookmarks

### 5. Referral System
- ✅ Get referral code
- ✅ Copy referral link
- ✅ Send invitations
- ✅ Track clicks
- ✅ Record conversions
- ✅ View earnings

### 6. User Profile
- ✅ View profile
- ✅ Update profile
- ✅ View dashboard stats
- ✅ Password management

### 7. Support
- ✅ Create support ticket
- ✅ Add replies to ticket
- ✅ View ticket history

### 8. Error Handling
- ✅ Invalid credentials
- ✅ Network failures
- ✅ 404 errors
- ✅ Validation errors

## API Endpoints Tested

### Authentication
- POST `/auth/register` - Create new account
- POST `/auth/login` - Login with credentials
- POST `/auth/google` - Google OAuth login
- POST `/auth/verify-email` - Verify email address
- POST `/auth/refresh` - Refresh JWT token
- POST `/auth/logout` - Logout user
- POST `/auth/upgrade-plan` - Upgrade subscription

### Deals
- GET `/deals` - List all deals
- GET `/deals/:id` - Get deal details
- POST `/deals/claim` - Claim a deal
- GET `/deals/reviews/:dealId` - Get deal reviews
- POST `/deals/review` - Submit review

### User
- GET `/user/profile` - Get user profile
- PUT `/user/profile` - Update profile
- GET `/user/claims` - Get claimed deals
- GET `/user/bookmarks` - Get bookmarked deals
- POST `/user/bookmarks` - Bookmark deal
- DELETE `/user/bookmarks/:dealId` - Remove bookmark
- GET `/user/referrals` - Get referral info
- POST `/user/password-reset` - Request password reset

### Referrals
- GET `/referrals/info` - Program information
- GET `/referrals/tracking` - Track clicks
- POST `/referrals/track-click` - Record click
- POST `/referrals/convert` - Record conversion
- GET `/referrals/earnings` - Get earnings
- GET `/referrals/invites` - Get invitations sent
- POST `/referrals/send-invite` - Send invitation

### Support
- POST `/support/tickets` - Create ticket
- POST `/support/tickets/:id/replies` - Add reply

## CI/CD Integration

### GitHub Actions Example
```yaml
name: Tests

on: [push, pull_request]

jobs:
  backend-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: cd backend && npm install && npm test

  frontend-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: cd frontend && npm install && npm run test:e2e
```

## Test Credentials

For testing purposes, use:
- **Email**: test@example.com
- **Password**: TestPassword123!

## Troubleshooting

### Backend Tests Fail
1. Ensure `.env.test` is properly configured
2. Check if Supabase credentials are valid
3. Run: `npm run test:integration --verbose`

### Frontend Tests Fail
1. Ensure frontend dev server is running
2. Check if Playwright browsers are installed: `npx playwright install`
3. Run: `npm run test:e2e:debug` for debugging

### Timeout Issues
- Increase timeout in `jest.config.js` for backend
- Increase timeout in `playwright.config.ts` for frontend

### Network Errors
- Verify backend is running on correct port
- Check CORS configuration
- Ensure test API URLs match actual URLs

## Performance Benchmarks

- **Backend API tests**: ~5-10 seconds per suite
- **Frontend E2E tests**: ~2-3 minutes per browser
- **Full test suite**: ~5-10 minutes

## Coverage Goals

- **Backend**: 80%+ coverage of API endpoints
- **Frontend**: 75%+ coverage of user workflows
- **E2E**: All critical user journeys covered

## Continuous Monitoring

Monitor test results using:
- Jest coverage reports: `coverage/`
- Playwright HTML reports: `playwright-report/`
- JUnit XML reports: `test-results/`

## Best Practices

1. **Isolation**: Each test is independent and can run in any order
2. **Cleanup**: Tests clean up after themselves
3. **Mocking**: External services are mocked
4. **Assertions**: Clear and descriptive assertions
5. **Readability**: Tests read like documentation

## Contributing

When adding new features:
1. Add backend API tests first
2. Add frontend E2E tests
3. Ensure all tests pass
4. Add integration test if needed
5. Update this documentation

## Support

For issues or questions:
- Check test output for specific errors
- Review test code comments
- Check Jest/Playwright documentation
- Open GitHub issue with test logs
