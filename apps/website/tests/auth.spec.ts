import { test, expect } from '@playwright/test';

test.describe('Authentication Pages', () => {
  test('should show registration page with all form fields', async ({ page }) => {
    await page.goto('/register');

    // Check heading
    await expect(page.locator('h1')).toContainText('Create Account');

    // Check for all registration form fields
    await expect(page.locator('input[name="fullName"]')).toBeVisible();
    await expect(page.locator('input[name="companyName"]')).toBeVisible();
    await expect(page.locator('input[name="phone"]')).toBeVisible();
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
    await expect(page.locator('input[name="confirmPassword"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toContainText('Create Account');
  });

  test('should show login page with email and password fields', async ({ page }) => {
    await page.goto('/login');

    // Check heading
    await expect(page.locator('h1')).toContainText('Sign In');

    // Check for login form fields
    await expect(page.locator('input#email')).toBeVisible();
    await expect(page.locator('input#password')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toContainText('Sign In');
  });

  test('login page has link to register', async ({ page }) => {
    await page.goto('/login');

    const registerLink = page.locator('a[href="/register"]');
    await expect(registerLink).toBeVisible();
    await expect(registerLink).toContainText('Sign up');
  });

  test('register page has link to login', async ({ page }) => {
    await page.goto('/register');

    const loginLink = page.locator('a[href="/login"]');
    await expect(loginLink).toBeVisible();
    await expect(loginLink).toContainText('Sign in');
  });

  test('register page shows password mismatch error', async ({ page }) => {
    await page.goto('/register');

    // Fill form with mismatched passwords
    await page.locator('input[name="fullName"]').fill('Test User');
    await page.locator('input[name="companyName"]').fill('Test Company');
    await page.locator('input[name="email"]').fill('test@example.com');
    await page.locator('input[name="password"]').fill('password123');
    await page.locator('input[name="confirmPassword"]').fill('different123');
    await page.locator('button[type="submit"]').click();

    // Should show password mismatch error
    await expect(page.locator('text=Passwords do not match')).toBeVisible();
  });

  test('register page shows short password error', async ({ page }) => {
    await page.goto('/register');

    // Fill form with short password
    await page.locator('input[name="fullName"]').fill('Test User');
    await page.locator('input[name="companyName"]').fill('Test Company');
    await page.locator('input[name="email"]').fill('test@example.com');
    await page.locator('input[name="password"]').fill('12345');
    await page.locator('input[name="confirmPassword"]').fill('12345');
    await page.locator('button[type="submit"]').click();

    // Should show min length error
    await expect(page.locator('text=Password must be at least 6 characters')).toBeVisible();
  });
});

test.describe('Page Content', () => {
  test('homepage should load with correct heading', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toContainText('Professional Live Draws');
  });

  test('homepage has navigation', async ({ page }) => {
    await page.goto('/');
    // Navigation should be present
    await expect(page.locator('nav')).toBeVisible();
  });

  test('contact page should load', async ({ page }) => {
    const response = await page.goto('/contact');
    expect(response?.status()).toBeLessThan(400);
  });

  test('privacy page should load', async ({ page }) => {
    const response = await page.goto('/privacy');
    expect(response?.status()).toBeLessThan(400);
  });
});
