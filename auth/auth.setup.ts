// auth/auth.setup.ts
//
// PURPOSE: Login ONCE and save session cookies.
// All test projects load these cookies — skip login in every test.

import { test as setup } from '@playwright/test';

setup('login and save state', async ({ page }) => {
    // Navigate to login page
    await page.goto('/bank');

    // Fill credentials from environment variables
    await page.getByTestId('username-input').fill(process.env.BANK_USERNAME!);
    await page.getByTestId('password-input').fill(process.env.BANK_PASSWORD!);

    // Click login
    await page.getByTestId('login-button').click();

    // Wait for dashboard to confirm login success
    await page.waitForLoadState('domcontentloaded');
    await page.getByTestId('quick-add-account').waitFor({
        state: 'visible',
    });

    // Save cookies to JSON file
    await page.context().storageState({ path: './auth/login-state.json' });
});