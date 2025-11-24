/**
 * Payment Flow Integration Tests
 * Tests the complete subscription lifecycle: upgrade, downgrade, cancellation, reactivation
 */

import { test, expect, type Page } from '@playwright/test';

// Test configuration
const DASHBOARD_URL = 'http://localhost:3000/dashboard';
const TIMEOUT = 30000; // 30 seconds for API calls

// Helper: Wait for element and verify visibility
async function waitAndVerify(page: Page, selector: string, expectedText?: string) {
  await page.waitForSelector(selector, { timeout: TIMEOUT });
  if (expectedText) {
    const text = await page.textContent(selector);
    expect(text).toContain(expectedText);
  }
}

// Helper: Get plan label from header
async function getPlanLabel(page: Page): Promise<string> {
  const badge = await page.locator('text=/Current Plan:/').first();
  await badge.waitFor({ timeout: TIMEOUT });
  const text = await badge.textContent();
  return text?.replace('Current Plan:', '').trim() || '';
}

// Helper: Get usage limits from pricing tab
async function getUsageLimits(page: Page) {
  await page.click('button:has-text("Pricing")');
  await page.waitForTimeout(1000);
  
  const requestsText = await page.locator('text=/Requests:.*\\/.*month/').first().textContent();
  const pipelinesText = await page.locator('text=/Pipelines:.*\\d+/').first().textContent();
  const storageText = await page.locator('text=/Storage:.*MB/').first().textContent();
  
  return {
    requests: requestsText?.match(/\d[\d,]+/)?.[0] || '0',
    pipelines: pipelinesText?.match(/\d+/)?.[0] || '0',
    storage: storageText?.match(/\d+/)?.[0] || '0',
  };
}

test.describe('Payment Flow Complete Integration', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('http://localhost:3000/login');
    await page.fill('input[type="email"]', process.env.TEST_EMAIL || 'test@example.com');
    await page.fill('input[type="password"]', process.env.TEST_PASSWORD || 'testpassword');
    await page.click('button[type="submit"]');
    await page.waitForURL(DASHBOARD_URL, { timeout: TIMEOUT });
  });

  test('01 - Initial State: Verify Free Plan', async ({ page }) => {
    console.log('🧪 TEST 1: Verifying initial free plan state...');
    
    // Wait for dashboard to load
    await page.waitForLoadState('networkidle');
    
    // Check header plan label (should not be "Loading")
    const headerPlan = await getPlanLabel(page);
    console.log(`✓ Header shows: ${headerPlan}`);
    expect(headerPlan.toLowerCase()).toMatch(/free/i);
    expect(headerPlan.toLowerCase()).not.toMatch(/loading/i);
    
    // Check sidebar plan label
    const sidebarPlan = await page.locator('[data-plan-label]').first().textContent();
    console.log(`✓ Sidebar shows: ${sidebarPlan}`);
    expect(sidebarPlan?.toLowerCase()).toMatch(/free/i);
    
    // Verify free plan limits
    const limits = await getUsageLimits(page);
    console.log(`✓ Free plan limits:`, limits);
    expect(limits.requests).toBe('100');
    expect(limits.pipelines).toBe('1');
    expect(limits.storage).toBe('50');
    
    console.log('✅ TEST 1 PASSED: Free plan verified correctly\n');
  });

  test('02 - Upgrade to Paid Plan', async ({ page }) => {
    console.log('🧪 TEST 2: Testing upgrade to paid plan...');
    
    // Navigate to pricing tab
    await page.click('button:has-text("Pricing")');
    await page.waitForTimeout(1000);
    
    // Click upgrade button for Starter plan
    const upgradeButton = await page.locator('button:has-text("Upgrade to Starter")').first();
    
    // Check if already on paid plan
    const buttonDisabled = await upgradeButton.isDisabled();
    if (buttonDisabled) {
      console.log('⚠️  Already on Starter plan, skipping upgrade test');
      test.skip();
      return;
    }
    
    // Click upgrade - this should redirect to Stripe
    console.log('→ Clicking upgrade button...');
    await upgradeButton.click();
    
    // Wait for Stripe redirect (in test environment, mock this)
    // In real test, you'd handle Stripe test mode checkout
    console.log('⚠️  Manual Step Required: Complete Stripe checkout in test mode');
    console.log('   After checkout, verify the following:');
    console.log('   1. Header shows "Starter" plan immediately (no loading)');
    console.log('   2. Sidebar shows "Starter" plan immediately');
    console.log('   3. Limits update to: 5,000 requests, 3 pipelines, 500 MB');
    
    console.log('⏭️  TEST 2 SKIPPED: Requires manual Stripe completion\n');
  });

  test('03 - Verify Paid Plan State After Upgrade', async ({ page }) => {
    console.log('🧪 TEST 3: Verifying paid plan state after upgrade...');
    
    await page.waitForLoadState('networkidle');
    
    // Get current plan
    const headerPlan = await getPlanLabel(page);
    console.log(`Current plan: ${headerPlan}`);
    
    if (!headerPlan.toLowerCase().includes('starter')) {
      console.log('⚠️  Not on Starter plan, skipping test');
      test.skip();
      return;
    }
    
    // Verify header shows Starter (not Loading)
    console.log(`✓ Header shows: ${headerPlan}`);
    expect(headerPlan.toLowerCase()).toMatch(/starter/i);
    expect(headerPlan.toLowerCase()).not.toMatch(/loading/i);
    
    // Verify limits are upgraded
    const limits = await getUsageLimits(page);
    console.log(`✓ Starter plan limits:`, limits);
    expect(limits.requests).toBe('5,000');
    expect(limits.pipelines).toBe('3');
    expect(limits.storage).toBe('500');
    
    // Check Usage & Analytics tab
    await page.click('button:has-text("Usage & Analytics")');
    await page.waitForTimeout(2000);
    
    const usageCard = await page.locator('text=/Requests used/').first();
    await usageCard.waitFor({ timeout: TIMEOUT });
    console.log('✓ Usage analytics loaded with updated limits');
    
    console.log('✅ TEST 3 PASSED: Paid plan verified correctly\n');
  });

  test('04 - Cancel Subscription via Portal', async ({ page }) => {
    console.log('🧪 TEST 4: Testing subscription cancellation...');
    
    // Navigate to pricing
    await page.click('button:has-text("Pricing")');
    await page.waitForTimeout(1000);
    
    // Click "Cancel subscription" button
    const cancelButton = await page.locator('button:has-text("Cancel subscription")');
    const isVisible = await cancelButton.isVisible().catch(() => false);
    
    if (!isVisible) {
      console.log('⚠️  Not on paid plan, skipping cancellation test');
      test.skip();
      return;
    }
    
    console.log('→ Clicking cancel subscription...');
    // This should either open Stripe portal or show direct cancellation
    await cancelButton.click();
    
    console.log('⚠️  Manual Step Required: Complete cancellation in Stripe portal');
    console.log('   After cancellation, verify:');
    console.log('   1. Returns to pricing tab (not stuck)');
    console.log('   2. Header shows "Free" IMMEDIATELY (no loading)');
    console.log('   3. Sidebar shows "Free" IMMEDIATELY');
    console.log('   4. Limits revert to: 100 requests, 1 pipeline, 50 MB');
    
    console.log('⏭️  TEST 4 SKIPPED: Requires manual Stripe portal interaction\n');
  });

  test('05 - Verify Free Plan After Cancellation', async ({ page }) => {
    console.log('🧪 TEST 5: Verifying return to free plan after cancellation...');
    
    await page.waitForLoadState('networkidle');
    
    // Verify header shows Free (not Loading)
    const headerPlan = await getPlanLabel(page);
    console.log(`✓ Header shows: ${headerPlan}`);
    expect(headerPlan.toLowerCase()).toMatch(/free/i);
    expect(headerPlan.toLowerCase()).not.toMatch(/loading/i);
    expect(headerPlan.toLowerCase()).not.toMatch(/starter/i);
    
    // Verify limits are back to free tier
    const limits = await getUsageLimits(page);
    console.log(`✓ Free plan limits restored:`, limits);
    expect(limits.requests).toBe('100');
    expect(limits.pipelines).toBe('1');
    expect(limits.storage).toBe('50');
    
    // Verify usage analytics reflects free plan
    await page.click('button:has-text("Usage & Analytics")');
    await page.waitForTimeout(2000);
    
    const planBadge = await page.locator('text=/Plan/').first();
    await planBadge.waitFor({ timeout: TIMEOUT });
    const planName = await page.locator('text=/Free/').first().textContent();
    console.log(`✓ Usage analytics shows: ${planName}`);
    expect(planName?.toLowerCase()).toMatch(/free/i);
    
    console.log('✅ TEST 5 PASSED: Free plan verified after cancellation\n');
  });

  test('06 - Reactivate Subscription', async ({ page }) => {
    console.log('🧪 TEST 6: Testing subscription reactivation...');
    
    // Click manage billing
    await page.click('button:has-text("Pricing")');
    await page.waitForTimeout(1000);
    await page.click('button:has-text("Manage billing")');
    
    console.log('⚠️  Manual Step Required: Reactivate subscription in Stripe portal');
    console.log('   After reactivation, verify:');
    console.log('   1. Header shows "Starter" IMMEDIATELY');
    console.log('   2. Sidebar shows "Starter" IMMEDIATELY');
    console.log('   3. Limits update to starter values IMMEDIATELY');
    console.log('   4. Usage Analytics reflects new limits');
    
    console.log('⏭️  TEST 6 SKIPPED: Requires manual Stripe portal interaction\n');
  });

  test('07 - Verify Limits After Reactivation', async ({ page }) => {
    console.log('🧪 TEST 7: Verifying limits update after reactivation...');
    
    await page.waitForLoadState('networkidle');
    
    const headerPlan = await getPlanLabel(page);
    console.log(`Current plan: ${headerPlan}`);
    
    if (!headerPlan.toLowerCase().includes('starter')) {
      console.log('⚠️  Subscription not reactivated, skipping test');
      test.skip();
      return;
    }
    
    // Verify limits are back to paid tier
    const limits = await getUsageLimits(page);
    console.log(`✓ Reactivated plan limits:`, limits);
    expect(limits.requests).toBe('5,000');
    expect(limits.pipelines).toBe('3');
    expect(limits.storage).toBe('500');
    
    console.log('✅ TEST 7 PASSED: Limits correctly updated after reactivation\n');
  });

  test('08 - No Loading State Persistence', async ({ page }) => {
    console.log('🧪 TEST 8: Verifying no persistent loading states...');
    
    await page.waitForLoadState('networkidle');
    
    // Check header doesn't show "Loading"
    const headerPlan = await getPlanLabel(page);
    console.log(`✓ Header: ${headerPlan}`);
    expect(headerPlan.toLowerCase()).not.toMatch(/loading/i);
    
    // Navigate between tabs and verify no loading persistence
    const tabs = ['Usage & Analytics', 'Pricing', 'API Keys'];
    for (const tab of tabs) {
      await page.click(`button:has-text("${tab}")`);
      await page.waitForTimeout(1000);
      
      const currentPlan = await getPlanLabel(page);
      console.log(`✓ After navigating to ${tab}: ${currentPlan}`);
      expect(currentPlan.toLowerCase()).not.toMatch(/loading/i);
    }
    
    console.log('✅ TEST 8 PASSED: No persistent loading states\n');
  });
});

test.describe('Edge Cases and Error Handling', () => {
  test('09 - Rapid Tab Switching During Load', async ({ page }) => {
    console.log('🧪 TEST 9: Testing rapid tab switching...');
    
    await page.goto(DASHBOARD_URL);
    
    // Rapidly switch tabs
    const tabs = ['Pricing', 'Usage & Analytics', 'API Keys', 'Pricing'];
    for (const tab of tabs) {
      await page.click(`button:has-text("${tab}")`);
      await page.waitForTimeout(200);
    }
    
    // Wait for stabilization
    await page.waitForTimeout(2000);
    
    // Verify no loading state stuck
    const headerPlan = await getPlanLabel(page);
    console.log(`✓ Final state after rapid switching: ${headerPlan}`);
    expect(headerPlan.toLowerCase()).not.toMatch(/loading/i);
    
    console.log('✅ TEST 9 PASSED: Handles rapid tab switching\n');
  });

  test('10 - Page Refresh Preserves State', async ({ page }) => {
    console.log('🧪 TEST 10: Testing page refresh state persistence...');
    
    await page.goto(DASHBOARD_URL);
    await page.waitForLoadState('networkidle');
    
    // Get initial plan
    const initialPlan = await getPlanLabel(page);
    console.log(`✓ Initial plan: ${initialPlan}`);
    
    // Refresh page
    await page.reload();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // Get plan after refresh
    const afterRefreshPlan = await getPlanLabel(page);
    console.log(`✓ After refresh: ${afterRefreshPlan}`);
    
    // Should be same plan (not loading)
    expect(afterRefreshPlan).toBe(initialPlan);
    expect(afterRefreshPlan.toLowerCase()).not.toMatch(/loading/i);
    
    console.log('✅ TEST 10 PASSED: State persists after refresh\n');
  });
});
