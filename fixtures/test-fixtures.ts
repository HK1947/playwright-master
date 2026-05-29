// fixtures/test-fixtures.ts
//
// DESIGN PATTERNS:
// 1. Dependency Injection — tests receive ready-to-use objects
// 2. Factory — fixtures CREATE objects for tests
// 3. Inversion of Control — framework controls creation, not test
// 4. Override — customize built-in page for all tests

import { test as base, Page } from '@playwright/test';
import {
    LoginPage,
    DashboardPage,
    AccountsPage,
    TransactionsPage,
} from '../pages/qaplayground';
import { BANK_VALID_USER } from '../test-data/users';


type MyFixtures = {
    page: Page;
    loginPage: LoginPage;
    dashboardPage: DashboardPage;
    accountsPage: AccountsPage;
    transactionsPage: TransactionsPage;
    loggedInPage: {
    
        dashboardPage: DashboardPage;
        accountsPage: AccountsPage;
        transactionsPage: TransactionsPage;
    };
    autoScreenshot: void;
};

export const test = base.extend<MyFixtures>({
    // Override built-in page — add popup handler
    page: async ({ page }, use) => {
        await page.addLocatorHandler(
            page.getByRole('button', { name: 'Accept' }),
            async () => {
                await page.getByRole('button', { name: 'Accept' }).click();
            },
        );
        await use(page);
    },

    // LoginPage — created + navigated to /bank
    loginPage: async ({ page }, use) => {
       
        const loginPage = new LoginPage(page);

        
        await loginPage.goTo();

        
        await use(loginPage);
        // PAUSED HERE — test is running


    },

    // DashboardPage — created (no navigation — needs login first)
    dashboardPage: async ({ page }, use) => {
        const dashboardPage = new DashboardPage(page);
        await use(dashboardPage);
    },

    // AccountsPage — created (no navigation)
    accountsPage: async ({ page }, use) => {
        const accountsPage = new AccountsPage(page);
        await use(accountsPage);
    },

    // TransactionsPage — created (no navigation)
    transactionsPage: async ({ page }, use) => {
        const transactionsPage = new TransactionsPage(page);
        await use(transactionsPage);
    },

    // LoggedInPage — performs login and provides authenticated page objects
    loggedInPage: async (
        { page, loginPage, dashboardPage, accountsPage, transactionsPage },
        use,
    ) => {
        // loginPage fixture already navigated to /bank — just login
        await loginPage.login(BANK_VALID_USER);
        // Wait for dashboard element to confirm login success
        await page.getByTestId('quick-add-account').waitFor({ state: 'visible' });
        await use({ dashboardPage, accountsPage, transactionsPage });
    },

    // Auto screenshot on failure — runs for ALL tests
    autoScreenshot: [
        async ({ page }, use, testInfo) => {
            await use();
            if (testInfo.status !== testInfo.expectedStatus) {
                const screenshotPath = `screenshots/${testInfo.title.replace(/\s+/g, '-')}.png`;
                await page.screenshot({ path: screenshotPath, fullPage: true });
            }
        },
        { auto: true },
    ],
});

export { expect } from '@playwright/test';