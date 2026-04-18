@echo off
REM PerksNest Complete Test Suite Runner (Windows)
REM This script runs all tests: backend API tests, Google OAuth tests, and frontend E2E tests

setlocal enabledelayedexpansion

REM Colors (Windows doesn't support ANSI colors natively, we'll use text instead)
set "HEADER======================================================="
set "SUCCESS=OK"
set "ERROR=FAIL"
set "WARNING=WARN"

echo.
echo %HEADER%
echo.  PerksNest End-to-End Test Suite
echo %HEADER%
echo.

REM Check if running from correct directory
if not exist "package.json" (
    echo ERROR: Please run this script from the project root directory
    exit /b 1
)

set BACKEND_TESTS=0
set FRONTEND_TESTS=0
set FAILED_TESTS=0

REM Step 1: Backend API Tests
echo.
echo %HEADER%
echo. Step 1: Backend API Tests
echo %HEADER%
echo.

if exist "backend" (
    cd backend
    
    REM Check if dependencies are installed
    if not exist "node_modules" (
        echo %WARNING%: Installing backend dependencies...
        call npm install
    )
    
    REM Create .env.test if it doesn't exist
    if not exist ".env.test" (
        if exist ".env.test.example" (
            copy .env.test.example .env.test >nul
            echo %WARNING%: Created .env.test from example. Please update with correct credentials.
        ) else (
            echo %ERROR%: .env.test not found and no example provided
            exit /b 1
        )
    )
    
    echo.
    echo %HEADER%
    echo. Running Backend API Tests
    echo %HEADER%
    echo.
    
    echo Running Authentication Tests...
    call npm run test:auth >nul 2>&1
    if !errorlevel! equ 0 (
        echo [%SUCCESS%] Authentication tests passed
        set /a BACKEND_TESTS+=1
    ) else (
        echo [%ERROR%] Authentication tests failed
        set /a FAILED_TESTS+=1
    )
    
    echo Running Deals Tests...
    call npm run test:deals >nul 2>&1
    if !errorlevel! equ 0 (
        echo [%SUCCESS%] Deals tests passed
        set /a BACKEND_TESTS+=1
    ) else (
        echo [%ERROR%] Deals tests failed
        set /a FAILED_TESTS+=1
    )
    
    echo Running User Tests...
    call npm run test:user >nul 2>&1
    if !errorlevel! equ 0 (
        echo [%SUCCESS%] User tests passed
        set /a BACKEND_TESTS+=1
    ) else (
        echo [%ERROR%] User tests failed
        set /a FAILED_TESTS+=1
    )
    
    echo Running Referrals Tests...
    call npm run test:referrals >nul 2>&1
    if !errorlevel! equ 0 (
        echo [%SUCCESS%] Referrals tests passed
        set /a BACKEND_TESTS+=1
    ) else (
        echo [%ERROR%] Referrals tests failed
        set /a FAILED_TESTS+=1
    )
    
    echo Running Google OAuth Tests...
    call npm run test -- __tests__/google-oauth.test.js >nul 2>&1
    if !errorlevel! equ 0 (
        echo [%SUCCESS%] Google OAuth tests passed
        set /a BACKEND_TESTS+=1
    ) else (
        echo [%ERROR%] Google OAuth tests failed
        set /a FAILED_TESTS+=1
    )
    
    echo Running Integration Tests...
    call npm run test:integration >nul 2>&1
    if !errorlevel! equ 0 (
        echo [%SUCCESS%] Integration tests passed
        set /a BACKEND_TESTS+=1
    ) else (
        echo [%ERROR%] Integration tests failed
        set /a FAILED_TESTS+=1
    )
    
    cd ..
) else (
    echo %WARNING%: Backend directory not found, skipping backend tests
)

REM Step 2: Frontend E2E Tests
echo.
echo %HEADER%
echo. Step 2: Frontend E2E Tests
echo %HEADER%
echo.

if exist "frontend" (
    cd frontend
    
    REM Check if dependencies are installed
    if not exist "node_modules" (
        echo %WARNING%: Installing frontend dependencies...
        call npm install
        call npx playwright install
    )
    
    REM Check if Playwright browsers are installed
    call npx playwright --version >nul 2>&1
    if !errorlevel! neq 0 (
        echo %WARNING%: Installing Playwright browsers...
        call npx playwright install
    )
    
    REM Create .env.local if it doesn't exist
    if not exist ".env.local" (
        if exist ".env" (
            copy .env .env.local >nul
        ) else (
            echo %WARNING%: No .env.local or .env found. Frontend tests may fail.
        )
    )
    
    echo.
    echo %HEADER%
    echo. Running Frontend E2E Tests
    echo %HEADER%
    echo.
    
    echo Running Chromium E2E tests...
    call npm run test:e2e:chromium >nul 2>&1
    if !errorlevel! equ 0 (
        echo [%SUCCESS%] Chromium E2E tests passed
        set /a FRONTEND_TESTS+=1
    ) else (
        echo [%ERROR%] Chromium E2E tests failed
        set /a FAILED_TESTS+=1
    )
    
    echo Running Unit Tests...
    call npm run test >nul 2>&1
    if !errorlevel! equ 0 (
        echo [%SUCCESS%] Unit tests passed
        set /a FRONTEND_TESTS+=1
    ) else (
        echo [%ERROR%] Unit tests failed
        set /a FAILED_TESTS+=1
    )
    
    cd ..
) else (
    echo %WARNING%: Frontend directory not found, skipping frontend tests
)

REM Step 3: Summary
echo.
echo %HEADER%
echo. Test Summary
echo %HEADER%
echo.

echo Backend Test Suites Passed: %BACKEND_TESTS%
echo Frontend Test Suites Passed: %FRONTEND_TESTS%
echo Total Test Suites: %BACKEND_TESTS% + %FRONTEND_TESTS%
echo Failed Test Suites: %FAILED_TESTS%

if %FAILED_TESTS% equ 0 (
    echo.
    echo %HEADER%
    echo. All Tests Passed!
    echo %HEADER%
    echo.
    echo PerksNest is ready for deployment!
    echo.
    exit /b 0
) else (
    echo.
    echo %HEADER%
    echo. Some Tests Failed
    echo %HEADER%
    echo.
    echo Please fix the failing tests before proceeding.
    echo.
    exit /b 1
)
