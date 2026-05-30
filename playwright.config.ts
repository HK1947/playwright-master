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
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
        },
        {
            name: 'firefox',
            use: { ...devices['Desktop Firefox'] },
        },
        {
            name: 'mobile-chrome',
            use: { ...devices['Pixel 7'] },
        },
    ],
});
