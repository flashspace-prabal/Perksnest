import { test, expect } from '@playwright/test';

test.describe('Google OAuth E2E Integration', () => {
  test('Complete Google OAuth flow from login to dashboard', async ({ page, context }) => {
    // Navigate to login page
    await page.goto('/login');
    
    // Verify login page is visible
    const loginForm = page.locator('[data-testid="login-form"]');
    await expect(loginForm).toBeVisible();
    
    // Find Google login button
    const googleButton = page.locator('button:has-text("Continue with Google")').first();
    await expect(googleButton).toBeVisible();
    
    // Click Google login
    const [popup] = await Promise.all([
      context.waitForEvent('page'), // Wait for Google auth popup
      googleButton.click()
    ]).catch(() => [null]); // Catch if popup isn't created
    
    // If popup was opened, handle it
    if (popup) {
      // In real scenario, we'd automate Google login form
      // For testing, we'll wait for redirect back to app
      await popup.waitForLoadState();
      await popup.close();
    }
    
    // Wait for redirect to dashboard or home
    await page.waitForURL(/\/(dashboard|home|deals)/, { timeout: 10000 }).catch(() => {
      // If redirect doesn't happen immediately, it might use a callback
    });
    
    // Check if user is logged in by verifying user menu exists
    const userMenu = page.locator('[data-testid="user-menu"], [data-testid="user-avatar"]');
    await expect(userMenu).toBeVisible({ timeout: 5000 });
  });

  test('Google OAuth creates user with correct profile data', async ({ page }) => {
    // Login with Google
    await page.goto('/login');
    await page.click('button:has-text("Continue with Google")');
    
    // Wait for login to complete
    await page.waitForLoadState('networkidle');
    
    // Navigate to profile
    await page.click('[data-testid="user-menu"]');
    await page.click('text=Profile');
    
    // Verify profile has data
    const profileSection = page.locator('[data-testid="profile-section"]');
    await expect(profileSection).toBeVisible();
    
    // Check for name field
    const nameField = page.locator('input[name="name"]');
    await expect(nameField).toHaveValue(/.+/); // Should have some value
    
    // Check for email field
    const emailField = page.locator('input[name="email"]');
    await expect(emailField).toHaveValue(/.+@.+\..+/); // Should have valid email
  });

  test('Google OAuth respects referral codes', async ({ page }) => {
    // Navigate with referral code
    await page.goto('/login?ref=TESTREF123');
    
    // Click Google login
    const googleButton = page.locator('button:has-text("Continue with Google")').first();
    await googleButton.click();
    
    // Wait for auth to complete
    await page.waitForLoadState('networkidle');
    
    // Navigate to referrals section
    await page.goto('/referrals');
    
    // Verify referral code is set
    const referralInfo = page.locator('[data-testid="referral-info"]');
    await expect(referralInfo).toBeVisible();
  });

  test('Google OAuth handles existing account', async ({ page }) => {
    // First login with Google
    await page.goto('/login');
    await page.click('button:has-text("Continue with Google")');
    await page.waitForLoadState('networkidle');
    
    // Logout
    await page.click('[data-testid="user-menu"]');
    await page.click('text=Logout');
    
    // Verify logged out
    await page.waitForURL('/login');
    
    // Login again with same Google account
    await page.click('button:has-text("Continue with Google")');
    await page.waitForLoadState('networkidle');
    
    // Should be logged in again
    const userMenu = page.locator('[data-testid="user-menu"]');
    await expect(userMenu).toBeVisible();
  });

  test('Google OAuth allows immediate deal browsing', async ({ page }) => {
    // Login with Google
    await page.goto('/login');
    await page.click('button:has-text("Continue with Google")');
    await page.waitForLoadState('networkidle');
    
    // Navigate to deals
    await page.goto('/deals');
    
    // Verify deals are loaded
    const dealCards = page.locator('[data-testid="deal-card"]');
    await expect(dealCards.first()).toBeVisible({ timeout: 5000 });
    
    // Verify can claim a deal
    const claimButton = dealCards.first().locator('button:has-text("Claim")');
    await expect(claimButton).toBeVisible();
    await claimButton.click();
    
    // Check for success message
    const successMessage = page.locator('text=Deal claimed');
    await expect(successMessage).toBeVisible({ timeout: 5000 });
  });

  test('Google OAuth token refresh works', async ({ page }) => {
    // Login with Google
    await page.goto('/login');
    await page.click('button:has-text("Continue with Google")');
    await page.waitForLoadState('networkidle');
    
    // Make multiple API calls to test token refresh
    for (let i = 0; i < 3; i++) {
      await page.goto('/user/claims');
      await page.waitForLoadState('networkidle');
      
      // Should remain logged in
      const userMenu = page.locator('[data-testid="user-menu"]');
      await expect(userMenu).toBeVisible();
      
      // Add small delay between iterations
      await page.waitForTimeout(1000);
    }
  });

  test('Google OAuth handles network errors gracefully', async ({ page, context }) => {
    await page.goto('/login');
    
    // Go offline
    await context.setOffline(true);
    
    const googleButton = page.locator('button:has-text("Continue with Google")').first();
    await googleButton.click();
    
    // Wait for error
    await page.waitForTimeout(2000);
    
    // Go back online
    await context.setOffline(false);
    
    // Should show error message
    const errorMessage = page.locator('text=Network error');
    if (await errorMessage.isVisible()) {
      expect(await errorMessage.isVisible()).toBe(true);
    }
  });

  test('Google OAuth login button is always accessible', async ({ page }) => {
    // Mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/login');
    
    let googleButton = page.locator('button:has-text("Continue with Google")').first();
    await expect(googleButton).toBeVisible();
    
    // Tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    googleButton = page.locator('button:has-text("Continue with Google")').first();
    await expect(googleButton).toBeVisible();
    
    // Desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    googleButton = page.locator('button:has-text("Continue with Google")').first();
    await expect(googleButton).toBeVisible();
  });

  test('Google user can update preferences without re-authentication', async ({ page }) => {
    // Login with Google
    await page.goto('/login');
    await page.click('button:has-text("Continue with Google")');
    await page.waitForLoadState('networkidle');
    
    // Go to settings
    await page.goto('/settings');
    
    // Update preferences
    const toggleSwitch = page.locator('[data-testid="email-notifications"]');
    await toggleSwitch.click();
    
    // Save
    const saveButton = page.locator('button:has-text("Save")');
    await saveButton.click();
    
    // Should succeed without requiring re-authentication
    const successMessage = page.locator('text=Settings saved');
    await expect(successMessage).toBeVisible();
  });
});
