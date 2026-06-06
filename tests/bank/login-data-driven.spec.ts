// tests/bank/login-data-driven.spec.ts

import { test, expect } from '../../fixtures/test-fixtures';
import { BankCredentials } from '../../types';

// Lesson 24: Data-driven — array of test cases
// Lesson 9: Array of objects
// Each object = one test case
const loginTestCases: {
    description: string;
    credentials: BankCredentials;
    shouldPass: boolean;
    isValidationError?: boolean;
    tag: string;
}[] = [
    {
        description: 'valid admin login',
        credentials: {
            username: process.env.BANK_USERNAME!,
            password: process.env.BANK_PASSWORD!,
        },
        shouldPass: true,
        tag: '@smoke',
    },
    {
        description: 'invalid username',
        credentials: { username: 'wronguser', password: 'admin123' },
        shouldPass: false,
        tag: '@regression',
    },
    {
        description: 'invalid password',
        credentials: { username: 'admin', password: 'wrongpass' },
        shouldPass: false,
        tag: '@regression',
    },
    {
        description: 'empty credentials',
        credentials: { username: '', password: '' },
        shouldPass: false,
        isValidationError: true,
        tag: '@regression',
    },
];

// Lesson 10: for...of loop creates SEPARATE test for each data set
// Lesson 4: Template literal builds unique test name
for (const testCase of loginTestCases) {
    test(`login — ${testCase.description} ${testCase.tag}`, async ({
        loginPage,
        dashboardPage,
    }) => {
        await test.step('attempt login', async () => {
            await loginPage.login(testCase.credentials);
        });

        await test.step('verify result', async () => {
            if (testCase.shouldPass) {
                await expect(dashboardPage.dashboardHeading).toBeVisible();
                await expect(dashboardPage.dashboardHeading).toContainText('SecureBank');
            } else if (testCase.isValidationError) {
                await expect(loginPage.usernameError).toBeVisible();
                await expect(loginPage.passwordError).toBeVisible();
            } else {
                await expect(loginPage.errorMessage).toBeVisible();
            }
        });
    });
}
