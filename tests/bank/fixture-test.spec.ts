// tests/bank/fixture-test.spec.ts
import { test, expect } from '../../fixtures/test-fixtures';

test('loggedInPage provides dashboard access @smoke', async ({ loggedInPage }) => {
    const { dashboardPage } = loggedInPage;
    await expect(dashboardPage.dashboardHeading).toBeVisible();
    await expect(dashboardPage.dashboardHeading).toContainText('Quick Actions');
});

test('loginPage fixture navigates to bank @regression', async ({ loginPage }) => {
    await expect(loginPage.loginButton).toBeVisible();
    await expect(loginPage.usernameField).toBeVisible();
    await expect(loginPage.passwordField).toBeVisible();
});
