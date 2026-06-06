import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

const environment = process.env.ENV || 'qa';
dotenv.config({ path: `.env.${environment}` });

export default defineConfig({
    testDir: './tests',
    timeout: 60_000,
    expect: { timeout: 10_000 },

    // Global setup/teardown for environment validation and cleanup
    globalSetup: require.resolve('./global-setup'),
    globalTeardown: require.resolve('./global-teardown'),

    fullyParallel: true,
    forbidOnly: !!process.env.CI,

    // Smart retry strategy: more retries in CI, with exponential backoff
    retries: process.env.CI ? 2 : 1,
    workers: process.env.CI ? '50%' : undefined,

    // Output directories
    outputDir: 'test-results',

    reporter: [
        ['list'],
        ['html', { open: 'never', outputFolder: 'playwright-report' }],
        ['junit', { outputFile: 'results/junit-results.xml' }],
        ['allure-playwright'],
        // JSON reporter for custom dashboards
        ['json', { outputFile: 'results/test-results.json' }],
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

    // NOTE on authentication:
    // There is intentionally NO `setup` project / `storageState` here.
    // SecureBank keeps its auth token ("currentUser") in sessionStorage, and
    // Playwright's storageState only persists cookies + localStorage — never
    // sessionStorage. A saved storageState therefore cannot re-authenticate,
    // so tests that need a session log in per-test via the `loggedInPage`
    // fixture (see fixtures/test-fixtures.ts). For a larger suite this can be
    // optimized to login-once by capturing/restoring sessionStorage via
    // page.addInitScript — tracked in the README roadmap.
    projects: [
        // Browser Projects — UI Tests
        {
            name: 'chromium',
            testIgnore: /.*\.api\.spec\.ts/,
            use: { ...devices['Desktop Chrome'] },
        },
        {
            name: 'firefox',
            testIgnore: /.*\.api\.spec\.ts/,
            use: { ...devices['Desktop Firefox'] },
        },
        {
            name: 'webkit',
            testIgnore: /.*\.api\.spec\.ts/,
            use: { ...devices['Desktop Safari'] },
        },
        {
            name: 'mobile-chrome',
            testIgnore: /.*\.api\.spec\.ts/,
            use: { ...devices['Pixel 7'] },
        },
        {
            name: 'mobile-safari',
            testIgnore: /.*\.api\.spec\.ts/,
            use: { ...devices['iPhone 14'] },
        },

        // API Project — No browser needed
        {
            name: 'api',
            testMatch: /.*\.api\.spec\.ts/,
            use: {
                baseURL: process.env.API_BASE_URL?.replace(/\/?$/, '/'),
                extraHTTPHeaders: {
                    'x-api-key': process.env.REQRES_API_KEY || '',
                },
            },
        },
    ],
});
