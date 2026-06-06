// tests/bank/transactions.spec.ts

import { test, expect } from '../../fixtures/test-fixtures';

test.describe('Transactions @regression', () => {
    test('navigate to transactions page', async ({
        loginPage,
        dashboardPage,
        transactionsPage,
    }) => {
        await loginPage.login({
            username: process.env.BANK_USERNAME!,
            password: process.env.BANK_PASSWORD!,
        });

        await test.step('go to transactions via NavBar', async () => {
            await dashboardPage.navBar.goToTransactions();
        });

        await test.step('verify transactions page', async () => {
            await expect(transactionsPage.applyFiltersButton).toBeVisible();
        });
    });

    test('filter transactions by account', async ({
        loginPage,
        dashboardPage,
        transactionsPage,
    }) => {
        await loginPage.login({
            username: process.env.BANK_USERNAME!,
            password: process.env.BANK_PASSWORD!,
        });

        await dashboardPage.navBar.goToTransactions();

        await test.step('filter by account', async () => {
            await transactionsPage.filterByAccount('Checking Account');
        });

        await test.step('apply filters', async () => {
            await transactionsPage.applyFilters();
        });

        await expect(transactionsPage.applyFiltersButton).toBeVisible();
    });

    test('reset transaction filters', async ({ loginPage, dashboardPage, transactionsPage }) => {
        await loginPage.login({
            username: process.env.BANK_USERNAME!,
            password: process.env.BANK_PASSWORD!,
        });

        await dashboardPage.navBar.goToTransactions();
        await transactionsPage.filterByType('Deposit');
        await transactionsPage.applyFilters();

        await test.step('reset all filters', async () => {
            await transactionsPage.resetFilters();
        });

        await expect(transactionsPage.resetFiltersButton).toBeVisible();
    });

    test('logout with confirm dialog @smoke', async ({ loginPage, dashboardPage }) => {
        await loginPage.login({
            username: process.env.BANK_USERNAME!,
            password: process.env.BANK_PASSWORD!,
        });

        await test.step('logout and confirm', async () => {
            await dashboardPage.logout(true);
        });

        await test.step('verify back on login page', async () => {
            await expect(loginPage.loginButton).toBeVisible();
        });
    });
});
