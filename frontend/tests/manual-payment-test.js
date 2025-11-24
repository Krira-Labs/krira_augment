#!/usr/bin/env node

/**
 * Manual Payment Flow Test Script
 * This script provides a step-by-step guide to manually test the payment flow
 * Run this while performing the actual actions in the browser
 */

const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const testResults = {
    passed: [],
    failed: [],
    skipped: []
};

function ask(question) {
    return new Promise((resolve) => {
        rl.question(question, (answer) => {
            resolve(answer.trim().toLowerCase());
        });
    });
}

function logSuccess(message) {
    console.log(`\x1b[32m✅ ${message}\x1b[0m`);
}

function logError(message) {
    console.log(`\x1b[31m❌ ${message}\x1b[0m`);
}

function logInfo(message) {
    console.log(`\x1b[36mℹ️  ${message}\x1b[0m`);
}

function logStep(number, message) {
    console.log(`\n\x1b[33m📋 STEP ${number}: ${message}\x1b[0m\n`);
}

async function runTest(testName, callback) {
    console.log(`\n${'='.repeat(70)}`);
    console.log(`🧪 TEST: ${testName}`);
    console.log(`${'='.repeat(70)}\n`);

    try {
        const result = await callback();
        if (result === 'skip') {
            testResults.skipped.push(testName);
            logInfo(`Test skipped`);
        } else if (result) {
            testResults.passed.push(testName);
            logSuccess(`Test PASSED`);
        } else {
            testResults.failed.push(testName);
            logError(`Test FAILED`);
        }
    } catch (error) {
        testResults.failed.push(testName);
        logError(`Test FAILED with error: ${error.message}`);
    }
}

async function main() {
    console.log('\n\x1b[1m🚀 PAYMENT FLOW MANUAL TEST SUITE\x1b[0m\n');
    console.log('This script will guide you through testing the complete payment flow.\n');
    console.log('Have your browser open at: http://localhost:3000/dashboard\n');

    const ready = await ask('Are you ready to begin? (yes/no): ');
    if (ready !== 'yes' && ready !== 'y') {
        console.log('Test cancelled.');
        process.exit(0);
    }

    // TEST 1: Initial Free Plan State
    await runTest('01 - Verify Initial Free Plan State', async () => {
        logStep(1, 'Check Header Plan Label');
        logInfo('Look at the top right of the dashboard header');
        logInfo('There should be a badge showing "Current Plan: Free"');

        const header = await ask('Does the header show "Free" (NOT "Loading")? (yes/no): ');
        if (header !== 'yes' && header !== 'y') {
            logError('Header is showing Loading or incorrect plan!');
            return false;
        }

        logStep(2, 'Check Sidebar Plan Label');
        logInfo('Look at the bottom of the left sidebar');
        logInfo('The plan badge should show "Free"');

        const sidebar = await ask('Does the sidebar show "Free"? (yes/no): ');
        if (sidebar !== 'yes' && sidebar !== 'y') {
            logError('Sidebar is showing incorrect plan!');
            return false;
        }

        logStep(3, 'Verify Free Plan Limits');
        logInfo('Navigate to the Pricing tab');
        logInfo('Check the "Current plan" card shows:');
        logInfo('  - Requests: 100 / month');
        logInfo('  - Pipelines: 1');
        logInfo('  - Storage: 50 MB / pipeline');

        const limits = await ask('Are the limits correct? (yes/no): ');
        if (limits !== 'yes' && limits !== 'y') {
            logError('Free plan limits are incorrect!');
            return false;
        }

        return true;
    });

    // TEST 2: Upgrade to Paid Plan
    await runTest('02 - Upgrade to Starter Plan', async () => {
        logStep(1, 'Navigate to Pricing Tab');
        logInfo('Make sure you are on the Pricing tab');

        await ask('Press Enter when ready to upgrade...');

        logStep(2, 'Click "Upgrade to Starter" button');
        logInfo('Click the "Upgrade to Starter" button on the Starter plan card');
        logInfo('This will redirect you to Stripe Checkout');

        await ask('Press Enter after clicking upgrade...');

        logStep(3, 'Complete Stripe Checkout (Test Mode)');
        logInfo('Use Stripe test card: 4242 4242 4242 4242');
        logInfo('Any future expiry date and CVC will work');

        await ask('Press Enter after completing payment...');

        logStep(4, 'Verify Immediate UI Update');
        logInfo('After returning to dashboard, check IMMEDIATELY:');
        logInfo('  1. Header should show "Starter" (NOT "Loading")');
        logInfo('  2. Sidebar should show "Starter"');
        logInfo('  3. NO page refresh should be needed');

        const immediateUpdate = await ask('Did everything update IMMEDIATELY without refresh? (yes/no): ');
        if (immediateUpdate !== 'yes' && immediateUpdate !== 'y') {
            logError('UI did not update immediately!');
            return false;
        }

        logStep(5, 'Verify Starter Plan Limits');
        logInfo('Check the "Current plan" card shows:');
        logInfo('  - Requests: 5,000 / month');
        logInfo('  - Pipelines: 3');
        logInfo('  - Storage: 500 MB / pipeline');

        const starterLimits = await ask('Are the Starter limits showing? (yes/no): ');
        if (starterLimits !== 'yes' && starterLimits !== 'y') {
            logError('Starter plan limits not showing!');
            return false;
        }

        logStep(6, 'Verify Usage Analytics');
        logInfo('Navigate to "Usage & Analytics" tab');
        logInfo('Check that the limit cards show the Starter plan limits');

        const analytics = await ask('Does Usage Analytics show Starter limits? (yes/no): ');
        if (analytics !== 'yes' && analytics !== 'y') {
            logError('Usage Analytics not updated!');
            return false;
        }

        return true;
    });

    // TEST 3: Cancel Subscription
    await runTest('03 - Cancel Subscription via Portal', async () => {
        logStep(1, 'Navigate Back to Pricing');
        logInfo('Go to the Pricing tab');

        await ask('Press Enter when on Pricing tab...');

        logStep(2, 'Click "Cancel subscription" button');
        logInfo('Click the red "Cancel subscription" button');
        logInfo('This will open the Stripe Customer Portal');

        await ask('Press Enter after clicking cancel...');

        logStep(3, 'Cancel in Stripe Portal');
        logInfo('In the Stripe portal, find your subscription');
        logInfo('Click "Cancel plan" and confirm cancellation');

        await ask('Press Enter after confirming cancellation in portal...');

        logStep(4, 'Return to Dashboard');
        logInfo('The portal should redirect you back to the dashboard');

        const navigation = await ask('Did it navigate back to the Pricing tab? (yes/no): ');
        if (navigation !== 'yes' && navigation !== 'y') {
            logError('Navigation after cancellation failed!');
            return false;
        }

        logStep(5, 'Verify Immediate Downgrade');
        logInfo('Check IMMEDIATELY (without refresh):');
        logInfo('  1. Header shows "Free" (NOT "Loading", NOT "Starter")');
        logInfo('  2. Sidebar shows "Free"');
        logInfo('  3. Limits revert to: 100 requests, 1 pipeline, 50 MB');

        const immediateDowngrade = await ask('Did everything downgrade IMMEDIATELY? (yes/no): ');
        if (immediateDowngrade !== 'yes' && immediateDowngrade !== 'y') {
            logError('Downgrade did not happen immediately!');
            return false;
        }

        logStep(6, 'Verify Free Limits in Usage Analytics');
        logInfo('Navigate to "Usage & Analytics" tab');
        logInfo('Verify the limits show free tier values');

        const freeAnalytics = await ask('Does Usage Analytics show Free limits? (yes/no): ');
        if (freeAnalytics !== 'yes' && freeAnalytics !== 'y') {
            logError('Usage Analytics not downgraded!');
            return false;
        }

        return true;
    });

    // TEST 4: Reactivate Subscription
    await runTest('04 - Reactivate Subscription', async () => {
        logStep(1, 'Open Billing Portal Again');
        logInfo('Go to Pricing tab');
        logInfo('Click "Manage billing" button');

        await ask('Press Enter after opening portal...');

        logStep(2, 'Reactivate Subscription');
        logInfo('In the Stripe portal, reactivate your subscription');
        logInfo('OR subscribe to the Starter plan again');

        await ask('Press Enter after reactivating...');

        logStep(3, 'Verify Immediate Upgrade');
        logInfo('After portal returns to dashboard:');
        logInfo('  1. Header shows "Starter" IMMEDIATELY');
        logInfo('  2. Sidebar shows "Starter"');
        logInfo('  3. Limits update to starter values');

        const immediateReactivate = await ask('Did everything upgrade IMMEDIATELY? (yes/no): ');
        if (immediateReactivate !== 'yes' && immediateReactivate !== 'y') {
            logError('Reactivation did not reflect immediately!');
            return false;
        }

        logStep(4, 'Verify Starter Limits Restored');
        logInfo('Check that all limits are back to Starter tier:');
        logInfo('  - Requests: 5,000 / month');
        logInfo('  - Pipelines: 3');
        logInfo('  - Storage: 500 MB / pipeline');

        const limitsRestored = await ask('Are Starter limits restored? (yes/no): ');
        if (limitsRestored !== 'yes' && limitsRestored !== 'y') {
            logError('Limits not restored after reactivation!');
            return false;
        }

        return true;
    });

    // TEST 5: No Loading State Persistence
    await runTest('05 - Verify No "Loading" State Persistence', async () => {
        logStep(1, 'Rapid Tab Switching');
        logInfo('Quickly switch between tabs:');
        logInfo('  Pricing → Usage & Analytics → API Keys → Pricing');

        await ask('Press Enter after switching tabs...');

        const noLoading = await ask('Did the header NEVER show "Loading..."? (yes/no): ');
        if (noLoading !== 'yes' && noLoading !== 'y') {
            logError('Loading state persisted during tab switching!');
            return false;
        }

        logStep(2, 'Page Refresh');
        logInfo('Refresh the page (F5 or Cmd+R)');

        await ask('Press Enter after refresh...');

        const afterRefresh = await ask('Does it show your plan correctly (not Loading)? (yes/no): ');
        if (afterRefresh !== 'yes' && afterRefresh !== 'y') {
            logError('Loading state after refresh!');
            return false;
        }

        return true;
    });

    // Print results
    console.log('\n\n' + '='.repeat(70));
    console.log('📊 TEST RESULTS SUMMARY');
    console.log('='.repeat(70) + '\n');

    console.log(`\x1b[32m✅ Passed: ${testResults.passed.length}\x1b[0m`);
    testResults.passed.forEach(test => console.log(`   - ${test}`));

    if (testResults.failed.length > 0) {
        console.log(`\n\x1b[31m❌ Failed: ${testResults.failed.length}\x1b[0m`);
        testResults.failed.forEach(test => console.log(`   - ${test}`));
    }

    if (testResults.skipped.length > 0) {
        console.log(`\n\x1b[33m⏭️  Skipped: ${testResults.skipped.length}\x1b[0m`);
        testResults.skipped.forEach(test => console.log(`   - ${test}`));
    }

    const totalTests = testResults.passed.length + testResults.failed.length + testResults.skipped.length;
    const passRate = totalTests > 0 ? ((testResults.passed.length / totalTests) * 100).toFixed(1) : 0;

    console.log(`\n\x1b[1mPass Rate: ${passRate}%\x1b[0m`);

    if (testResults.failed.length === 0) {
        console.log('\n\x1b[32m\x1b[1m🎉 ALL TESTS PASSED! Payment flow is working correctly.\x1b[0m\n');
    } else {
        console.log('\n\x1b[31m\x1b[1m⚠️  SOME TESTS FAILED. Please review and fix issues.\x1b[0m\n');
    }

    rl.close();
}

main().catch(console.error);
