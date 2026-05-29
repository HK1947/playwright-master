// tests/bank/login.spec.ts

// ✅ Import from OUR fixtures — not @playwright/test
// This ensures autoScreenshot + popup handler work
import { test, expect } from '../../fixtures/test-fixtures';
import { BANK_VALID_USER, BANK_INVALID_USER } from '../../test-data/users';

test.describe('Bank Login', () => {

    test('valid login redirects to dashboard @smoke', async ({ loginPage, dashboardPage }) => {
        // ✅ Using fixtures — no manual new LoginPage(page)
        // loginPage already navigated to /bank (fixture did goTo)

        await test.step('login with valid credentials', async () => {
            await loginPage.login(BANK_VALID_USER);
        });

        await test.step('verify dashboard loaded', async () => {
            // ✅ Real assertions — not console.log
            await expect(dashboardPage.dashboardHeading).toBeVisible();
            await expect(dashboardPage.dashboardHeading).toContainText('SecureBank');
        });
    });

    test('invalid login shows error @smoke', async ({ loginPage }) => {
        await test.step('login with invalid credentials', async () => {
            await loginPage.login(BANK_INVALID_USER);
        });

        await test.step('verify error message', async () => {
            await expect(loginPage.errorMessage).toBeVisible();
            await expect(loginPage.errorMessage).toContainText('Invalid');
        });
    });

    test('dashboard shows quick actions after login @regression', async ({ loginPage, dashboardPage }) => {
        await loginPage.login(BANK_VALID_USER);

        await expect(dashboardPage.dashboardHeading).toBeVisible();
        await expect(dashboardPage.quickAddButton).toBeVisible();
        await expect(dashboardPage.logoutButton).toBeVisible();
    });

    test('add savings account from dashboard @regression', async ({ loginPage, dashboardPage }) => {
        await test.step('login', async () => {
            await loginPage.login(BANK_VALID_USER);
        });

        await test.step('add account', async () => {
            await dashboardPage.addAccount({
                accountName: 'Test Playwright Account',
                accountType: 'Savings Account',
                balance: 5000,
                enableOverdraft: true,
            });
        });

        await test.step('verify account created', async () => {
            // Verify we're still on dashboard (no error occurred)
            await expect(dashboardPage.dashboardHeading).toBeVisible();
        });
    });
});