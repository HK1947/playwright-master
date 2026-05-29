import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

const environment = process.env.ENV || 'qa';
dotenv.config({ path: `.env.${environment}` });

export default defineConfig({
    testDir: './tests',
    timeout: 60_000,
    expect: { timeout: 10_000 },

    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 1 : undefined,

    reporter: [
        ['list'],
        ['html', { open: 'never', outputFolder: 'playwright-report' }],
        ['junit', { outputFile: 'results/junit-results.xml' }],
    ],

    use: {
        baseURL: process.env.QA_PLAYGROUND_URL,
        headless: !!process.env.CI,
        viewport: { width: 1920, height: 1080 },
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
        trace: 'retain-on-failure',
        actionTimeout: 15_000,
        navigationTimeout: 30_000,
        testIdAttribute: 'data-testid',
        ignoreHTTPSErrors: true,
    },

    projects: [
        {
            name: 'setup',
            testDir: './auth',
            testMatch: /auth\.setup\.ts/,
            use: {
            baseURL: process.env.QA_PLAYGROUND_URL,
                 },
        },
        {
            name: 'chromium',
            use: {
                ...devices['Desktop Chrome'],
                storageState: './auth/login-state.json',
            },
            dependencies: ['setup'],
        },
        {
            name: 'firefox',
            use: {
                ...devices['Desktop Firefox'],
                storageState: './auth/login-state.json',
            },
            dependencies: ['setup'],
        },
        {
            name: 'mobile-chrome',
            use: {
                ...devices['Pixel 7'],
                storageState: './auth/login-state.json',
            },
            dependencies: ['setup'],
        },
    ],
});