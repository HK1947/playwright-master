// tests/bank/accounts.spec.ts

import { test, expect } from '../../fixtures/test-fixtures';
import { DataFactory } from '../../helpers';
// Lesson 12: imported from barrel file helpers/index.ts

test.describe('Account Management @regression', () => {
    test('create savings account with random data', async ({ loginPage, dashboardPage }) => {
        // Lesson Factory Pattern: DataFactory generates random but valid data
        const account = DataFactory.createSavingsAccount();

        await test.step('login', async () => {
            await loginPage.login({
                username: process.env.BANK_USERNAME!,
                password: process.env.BANK_PASSWORD!,
            });
        });

        await test.step(`add account: ${account.accountName}`, async () => {
            await dashboardPage.addAccount(account);
        });

        await test.step('verify account created', async () => {
            await expect(dashboardPage.dashboardHeading).toBeVisible();
        });
    });

    test('create multiple accounts with factory data', async ({ loginPage, dashboardPage }) => {
        // Lesson 9: Array.from creates array of N items
        const accounts = DataFactory.createAccounts(3);

        await loginPage.login({
            username: process.env.BANK_USERNAME!,
            password: process.env.BANK_PASSWORD!,
        });

        // Lesson 10: for...of loop — create each account
        for (const account of accounts) {
            await test.step(`add account: ${account.accountName}`, async () => {
                await dashboardPage.navigate('/bank/dashboard');
                await dashboardPage.addAccount(account);
            });
        }

        await expect(dashboardPage.dashboardHeading).toBeVisible();
    });

    test('create account with specific balance', async ({ loginPage, dashboardPage }) => {
        // Lesson 7: Spread override — random data but specific balance
        const account = DataFactory.createAccount({ balance: 50_000 });

        await loginPage.login({
            username: process.env.BANK_USERNAME!,
            password: process.env.BANK_PASSWORD!,
        });

        await dashboardPage.addAccount(account);
        await expect(dashboardPage.dashboardHeading).toBeVisible();
    });

    test('navigate to accounts page via NavBar', async ({
        loginPage,
        dashboardPage,
        accountsPage,
    }) => {
        await loginPage.login({
            username: process.env.BANK_USERNAME!,
            password: process.env.BANK_PASSWORD!,
        });

        // Uses NavBar component
        await test.step('navigate via NavBar', async () => {
            await dashboardPage.goToAccounts();
        });

        await test.step('verify accounts page loaded', async () => {
            await expect(accountsPage.searchInput).toBeVisible();
        });
    });

    test('search accounts', async ({ loginPage, dashboardPage, accountsPage }) => {
        await loginPage.login({
            username: process.env.BANK_USERNAME!,
            password: process.env.BANK_PASSWORD!,
        });

        await dashboardPage.goToAccounts();

        await test.step('search for savings', async () => {
            await accountsPage.searchAccount('Savings');
        });

        await test.step('clear search', async () => {
            await accountsPage.clearSearch();
        });

        await expect(accountsPage.searchInput).toBeVisible();
    });

    test('filter accounts by type', async ({ loginPage, dashboardPage, accountsPage }) => {
        await loginPage.login({
            username: process.env.BANK_USERNAME!,
            password: process.env.BANK_PASSWORD!,
        });

        await dashboardPage.goToAccounts();

        await test.step('filter by Savings', async () => {
            await accountsPage.filterByType('Savings');
        });

        await test.step('reset filters', async () => {
            await accountsPage.resetFilters();
        });

        await expect(accountsPage.resetFiltersButton).toBeVisible();
    });
});
