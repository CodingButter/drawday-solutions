import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test('should show registration page', async ({ page }) => {
    await page.goto('http://localhost:3000/register');

    // Check for registration form elements
    await expect(page.locator('h2')).toContainText('Create your account');
    await expect(page.locator('input[name="firstName"]')).toBeVisible();
    await expect(page.locator('input[name="lastName"]')).toBeVisible();
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
    await expect(page.locator('input[name="confirmPassword"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toContainText('Sign up');
  });

  test('should show login page', async ({ page }) => {
    await page.goto('http://localhost:3000/login');

    // Check for login form elements
    await expect(page.locator('h2')).toContainText('Sign in to your account');
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toContainText('Sign in');
  });

  test('should redirect to login when accessing protected pages', async ({ page }) => {
    // Try to access dashboard without authentication
    await page.goto('http://localhost:3000/dashboard');
    await page.waitForLoadState('networkidle');

    // Should be redirected to login
    await expect(page).toHaveURL(/\/login/);
  });

  test('should navigate to configuration page from dashboard', async ({ page }) => {
    await page.goto('http://localhost:3000/dashboard');

    // This will redirect to login since we're not authenticated
    // But we can check if the configuration route exists
    const response = await page.goto('http://localhost:3000/configuration');
    expect(response?.status()).toBeLessThan(400); // Should not be 404
  });

  test('should navigate to live-spinner page from dashboard', async ({ page }) => {
    await page.goto('http://localhost:3000/dashboard');

    // This will redirect to login since we're not authenticated
    // But we can check if the spinner route exists
    const response = await page.goto('http://localhost:3000/live-spinner');
    expect(response?.status()).toBeLessThan(400); // Should not be 404
  });
});

test.describe('Page Content', () => {
  test('homepage should load', async ({ page }) => {
    await page.goto('http://localhost:3000/');
    await expect(page.locator('h1')).toContainText('DrawDay Spinner');
  });

  test('configuration page shows loading when not authenticated', async ({ page }) => {
    await page.goto('http://localhost:3000/configuration');

    // Should show loading initially
    const loadingText = page.locator('text=Loading');
    await expect(loadingText).toBeVisible();
  });

  test('live-spinner page shows loading when not authenticated', async ({ page }) => {
    await page.goto('http://localhost:3000/live-spinner');

    // Should show loading initially
    const loadingText = page.locator('text=Loading');
    await expect(loadingText).toBeVisible();
  });
});
