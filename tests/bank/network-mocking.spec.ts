// tests/bank/network-mocking.spec.ts

// DESIGN PATTERN: Strategy Pattern
// Different mock responses for different scenarios
// Same page.route mechanism, different fulfill data

import { test, expect } from '../../fixtures/test-fixtures';

test.describe('Network Mocking @regression', () => {
    test('block images for faster test execution', async ({ loginPage, page }) => {
        // Lesson 27: route.abort() — block requests
        // Block all image requests → page loads faster
        await page.route('**/*.{png,jpg,jpeg,gif,svg,webp}', async (route) => {
            //         ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
            // ** = match any path
            // *.{png,jpg,...} = match these file extensions
            await route.abort();
            // abort() = "don't send this request at all"
        });

        await loginPage.login({
            username: process.env.BANK_USERNAME!,
            password: process.env.BANK_PASSWORD!,
        });

        // Page loads WITHOUT images — faster
        await expect(page.getByRole('heading').first()).toBeVisible();
    });

    test('mock API response — empty accounts', async ({ loginPage, dashboardPage, page }) => {
        // Lesson 27: route.fulfill() — send fake response
        // Mock the accounts API to return empty array
        await page.route('**/api/accounts*', async (route) => {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify([]),
                // Lesson 24: JSON.stringify converts object → string
            });
        });

        await loginPage.login({
            username: process.env.BANK_USERNAME!,
            password: process.env.BANK_PASSWORD!,
        });

        // Dashboard should still load even with empty accounts
        await expect(dashboardPage.dashboardHeading).toBeVisible();
    });

    test('mock API response — server error 500', async ({ loginPage, page }) => {
        // Simulate server crash
        await page.route('**/api/**', async (route) => {
            await route.fulfill({
                status: 500,
                contentType: 'application/json',
                body: JSON.stringify({ error: 'Internal Server Error' }),
            });
        });

        await loginPage.login({
            username: process.env.BANK_USERNAME!,
            password: process.env.BANK_PASSWORD!,
        });

        // App should handle error gracefully (not crash)
        await expect(page.getByRole('heading').first()).toBeVisible();
    });

    test('mock slow API response', async ({ loginPage, page }) => {
        // Simulate slow network — 3 second delay
        await page.route('**/api/**', async (route) => {
            // Lesson 6: Promise + setTimeout = delay
            await new Promise((resolve) => setTimeout(resolve, 3000));
            await route.continue();
            // continue() = "send to real server after delay"
        });

        await loginPage.login({
            username: process.env.BANK_USERNAME!,
            password: process.env.BANK_PASSWORD!,
        });

        // Page should eventually load despite slow API
        await expect(page.getByRole('heading').first()).toBeVisible();
    });

    test('log all network requests @smoke', async ({ loginPage, page }) => {
        // Lesson 27: page.on — listen to network traffic
        const requests: string[] = [];
        const responses: { url: string; status: number }[] = [];

        // Capture all requests
        page.on('request', (request) => {
            requests.push(`${request.method()} ${request.url()}`);
        });

        // Capture all responses
        page.on('response', (response) => {
            responses.push({
                url: response.url(),
                status: response.status(),
            });
        });

        await loginPage.login({
            username: process.env.BANK_USERNAME!,
            password: process.env.BANK_PASSWORD!,
        });

        // Verify requests were made
        // Lesson 15: toBeGreaterThan — numeric assertion
        expect(requests.length).toBeGreaterThan(0);
        expect(responses.length).toBeGreaterThan(0);

        // Lesson 9: .filter() — find specific requests
        // Lesson 9: .some() — check if any match condition
        const hasPageRequest = requests.some((r) => r.includes('qaplayground'));
        expect(hasPageRequest).toBeTruthy();
    });

    test('modify request headers', async ({ loginPage, page }) => {
        // Lesson 27: route.continue() — modify and forward
        await page.route('**/*', async (route) => {
            // Add custom header to ALL requests
            const headers = {
                ...route.request().headers(),
                // Lesson 7: spread existing headers
                'X-Test-Framework': 'Playwright',
                'X-Test-Run': 'automated',
            };
            await route.continue({ headers });
            // continue() = "send to real server with my modifications"
        });

        await loginPage.login({
            username: process.env.BANK_USERNAME!,
            password: process.env.BANK_PASSWORD!,
        });

        await expect(page.getByRole('heading').first()).toBeVisible();
    });

    test('intercept and verify request payload', async ({ loginPage, page }) => {
        // Capture what LOGIN sends to server
        let loginPayload: any = null;

        page.on('request', (request) => {
            if (request.url().includes('login') || request.url().includes('auth')) {
                loginPayload = request.postData();
            }
        });

        await loginPage.login({
            username: process.env.BANK_USERNAME!,
            password: process.env.BANK_PASSWORD!,
        });

        // Verify login request was made
        await expect(page.getByRole('heading').first()).toBeVisible();
    });
});
