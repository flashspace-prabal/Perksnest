import { test, expect } from '@playwright/test';

test.describe('Authentication & Login', () => {
  test('User can register with email and password', async ({ page }) => {
    await page.goto('/login');
    
    // Click on register tab or link
    await page.click('text=Create account');
    
    // Fill registration form
    const email = `test-${Date.now()}@example.com`;
    await page.fill('input[name="email"]', email);
    await page.fill('input[name="password"]', 'SecurePassword123!');
    await page.fill('input[name="name"]', 'Test User');
    
    // Submit form
    await page.click('button[type="submit"]');
    
    // Wait for success message or redirect
    await expect(page).toHaveURL(/\/(dashboard|home|deals)/);
  });

  test('User can login with email and password', async ({ page }) => {
    await page.goto('/login');
    
    // Fill login form
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'TestPassword123!');
    
    // Submit form
    await page.click('button[type="submit"]');
    
    // Wait for redirect to dashboard
    await page.waitForURL(/\/(dashboard|home|deals)/);
    await expect(page).toHaveURL(/\/(dashboard|home|deals)/);
  });

  test('User can login with Google authentication', async ({ page, context }) => {
    await page.goto('/login');
    
    // Click Google login button
    const googleButton = page.locator('button:has-text("Google")').first();
    await expect(googleButton).toBeVisible();
    await googleButton.click();
    
    // Wait for redirect (in real test, would handle OAuth popup)
    await page.waitForLoadState('networkidle');
    
    // Should be logged in (check for user menu or dashboard)
    const userMenu = page.locator('[data-testid="user-menu"]');
    await expect(userMenu).toBeVisible({ timeout: 10000 });
  });

  test('User receives error for invalid login credentials', async ({ page }) => {
    await page.goto('/login');
    
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'WrongPassword123!');
    await page.click('button[type="submit"]');
    
    // Check for error message
    const errorMessage = page.locator('text=Invalid credentials');
    await expect(errorMessage).toBeVisible();
  });

  test('User can logout', async ({ page, context }) => {
    // First login
    await page.goto('/login');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'TestPassword123!');
    await page.click('button[type="submit"]');
    
    // Wait for dashboard
    await page.waitForURL(/\/(dashboard|home|deals)/);
    
    // Click user menu
    await page.click('[data-testid="user-menu"]');
    
    // Click logout
    await page.click('text=Logout');
    
    // Should redirect to home or login
    await page.waitForURL(/\/(login|home|index)/);
  });

  test('Password reset workflow', async ({ page }) => {
    await page.goto('/login');
    
    // Click forgot password
    await page.click('text=Forgot password');
    
    // Fill email
    await page.fill('input[name="email"]', 'test@example.com');
    await page.click('button[type="submit"]');
    
    // Check for success message
    const successMessage = page.locator('text=Check your email');
    await expect(successMessage).toBeVisible();
  });
});

test.describe('Deals Browsing & Claiming', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/login');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'TestPassword123!');
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/(dashboard|home|deals)/);
  });

  test('User can browse all deals', async ({ page }) => {
    await page.goto('/deals');
    
    // Check if deals are displayed
    const dealCards = page.locator('[data-testid="deal-card"]');
    await expect(dealCards.first()).toBeVisible();
  });

  test('User can filter deals by category', async ({ page }) => {
    await page.goto('/deals');
    
    // Click AI category
    await page.click('text=AI');
    
    // Wait for filtering
    await page.waitForLoadState('networkidle');
    
    // Verify category is active
    const activeCategory = page.locator('[data-testid="category-ai"][aria-selected="true"]');
    await expect(activeCategory).toBeVisible();
  });

  test('User can search for deals', async ({ page }) => {
    await page.goto('/deals');
    
    // Type search query
    await page.fill('input[placeholder*="Search"]', 'OpenAI');
    
    // Wait for results
    await page.waitForLoadState('networkidle');
    
    // Check if results contain search term
    const dealNames = page.locator('[data-testid="deal-name"]');
    const firstDeal = await dealNames.first().textContent();
    expect(firstDeal?.toLowerCase()).toContain('openai');
  });

  test('User can view deal details', async ({ page }) => {
    await page.goto('/deals');
    
    // Click first deal card
    const dealCard = page.locator('[data-testid="deal-card"]').first();
    await dealCard.click();
    
    // Should navigate to deal details page
    await page.waitForURL(/\/deals\/.+/);
    
    // Check for deal details
    const dealTitle = page.locator('h1');
    await expect(dealTitle).toBeVisible();
    
    const dealDescription = page.locator('[data-testid="deal-description"]');
    await expect(dealDescription).toBeVisible();
  });

  test('User can claim a deal', async ({ page }) => {
    await page.goto('/deals');
    
    // Click first deal
    await page.locator('[data-testid="deal-card"]').first().click();
    
    // Click claim button
    await page.click('button:has-text("Claim Deal")');
    
    // Check for success message
    const successMessage = page.locator('text=Deal claimed successfully');
    await expect(successMessage).toBeVisible();
  });

  test('User can bookmark a deal', async ({ page }) => {
    await page.goto('/deals');
    
    // Click bookmark icon on first deal
    const bookmarkButton = page.locator('[data-testid="deal-card"]').first().locator('[data-testid="bookmark-button"]');
    await bookmarkButton.click();
    
    // Check if bookmarked (icon should change)
    await expect(bookmarkButton.locator('[aria-checked="true"]')).toBeVisible();
  });

  test('User can view deal reviews', async ({ page }) => {
    await page.goto('/deals');
    
    // Click first deal
    await page.locator('[data-testid="deal-card"]').first().click();
    
    // Scroll to reviews section
    const reviewsSection = page.locator('[data-testid="reviews-section"]');
    await reviewsSection.scrollIntoViewIfNeeded();
    
    // Check for reviews
    const reviewItems = page.locator('[data-testid="review-item"]');
    if (await reviewItems.count() > 0) {
      await expect(reviewItems.first()).toBeVisible();
    }
  });
});

test.describe('User Profile & Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/login');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'TestPassword123!');
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/(dashboard|home|deals)/);
  });

  test('User can view profile page', async ({ page }) => {
    // Click user menu
    await page.click('[data-testid="user-menu"]');
    
    // Click profile
    await page.click('text=Profile');
    
    // Wait for profile page
    await page.waitForURL(/\/profile/);
    
    const profileTitle = page.locator('h1:has-text("Profile")');
    await expect(profileTitle).toBeVisible();
  });

  test('User can update profile information', async ({ page }) => {
    await page.goto('/profile');
    
    // Update name
    await page.fill('input[name="name"]', 'Updated Name');
    
    // Update bio
    await page.fill('textarea[name="bio"]', 'My updated bio');
    
    // Save changes
    await page.click('button:has-text("Save")');
    
    // Check for success message
    const successMessage = page.locator('text=Profile updated');
    await expect(successMessage).toBeVisible();
  });

  test('User can view claimed deals', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Click claims section or tab
    await page.click('[data-testid="claims-tab"]');
    
    // Check if claimed deals are listed
    const claimsList = page.locator('[data-testid="claims-list"]');
    await expect(claimsList).toBeVisible();
  });

  test('User can view bookmarked deals', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Click bookmarks section or tab
    await page.click('[data-testid="bookmarks-tab"]');
    
    // Check if bookmarked deals are listed
    const bookmarksList = page.locator('[data-testid="bookmarks-list"]');
    await expect(bookmarksList).toBeVisible();
  });
});

test.describe('Referrals System', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/login');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'TestPassword123!');
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/(dashboard|home|deals)/);
  });

  test('User can view referral code', async ({ page }) => {
    await page.goto('/referrals');
    
    // Check for referral code display
    const referralCode = page.locator('[data-testid="referral-code"]');
    await expect(referralCode).toBeVisible();
  });

  test('User can copy referral link', async ({ page }) => {
    await page.goto('/referrals');
    
    // Click copy button
    await page.click('[data-testid="copy-referral-button"]');
    
    // Check for success message
    const successMessage = page.locator('text=Copied to clipboard');
    await expect(successMessage).toBeVisible();
  });

  test('User can send referral invites', async ({ page }) => {
    await page.goto('/referrals');
    
    // Fill friend email
    await page.fill('input[name="friendEmail"]', 'friend@example.com');
    
    // Add message
    await page.fill('textarea[name="message"]', 'Check out this amazing deals platform!');
    
    // Send invite
    await page.click('button:has-text("Send Invite")');
    
    // Check for success message
    const successMessage = page.locator('text=Invite sent');
    await expect(successMessage).toBeVisible();
  });

  test('User can view referral earnings', async ({ page }) => {
    await page.goto('/referrals');
    
    // Check for earnings section
    const earningsSection = page.locator('[data-testid="earnings-section"]');
    await expect(earningsSection).toBeVisible();
    
    // Check for earnings display
    const totalEarnings = page.locator('[data-testid="total-earnings"]');
    await expect(totalEarnings).toBeVisible();
  });
});

test.describe('Responsive Design', () => {
  test('Mobile view renders correctly', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.goto('/deals');
    
    // Check if mobile menu is visible
    const mobileMenu = page.locator('[data-testid="mobile-menu"]');
    await expect(mobileMenu).toBeVisible();
    
    // Check if deals are still visible
    const dealCards = page.locator('[data-testid="deal-card"]');
    await expect(dealCards.first()).toBeVisible();
  });

  test('Tablet view renders correctly', async ({ page }) => {
    // Set tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    
    await page.goto('/deals');
    
    // Check if content is visible
    const dealCards = page.locator('[data-testid="deal-card"]');
    await expect(dealCards.first()).toBeVisible();
  });

  test('Desktop view renders correctly', async ({ page }) => {
    // Set desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    
    await page.goto('/deals');
    
    // Check if sidebar is visible
    const sidebar = page.locator('[data-testid="category-sidebar"]');
    await expect(sidebar).toBeVisible();
  });
});

test.describe('Error Handling', () => {
  test('Displays error on network failure', async ({ page, context }) => {
    // Go offline
    await context.setOffline(true);
    
    await page.goto('/deals', { waitUntil: 'domcontentloaded' });
    
    // Should show error message
    const errorMessage = page.locator('text=Unable to load deals');
    await expect(errorMessage).toBeVisible();
    
    // Go back online
    await context.setOffline(false);
  });

  test('Handles 404 gracefully', async ({ page }) => {
    await page.goto('/deals/non-existent-deal-id');
    
    // Should show 404 message or redirect
    const notFoundMessage = page.locator('text=Not found');
    const dashboardLink = page.locator('a:has-text("Back to deals")');
    
    expect(await Promise.race([
      notFoundMessage.isVisible(),
      dashboardLink.isVisible(),
    ])).toBe(true);
  });
});
