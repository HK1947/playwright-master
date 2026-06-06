// global-setup.ts
// Runs ONCE before all tests — environment validation, data seeding, auth tokens

import { chromium, FullConfig } from '@playwright/test';
import dotenv from 'dotenv';

const environment = process.env.ENV || 'qa';
dotenv.config({ path: `.env.${environment}` });

// Use process.stdout for setup logs (ESLint allows this for CLI tools)
const log = (msg: string) => process.stdout.write(`${msg}\n`);

async function globalSetup(config: FullConfig) {
    log('\n🚀 Global Setup Starting...\n');

    // 1. Validate required environment variables
    const requiredVars = ['QA_PLAYGROUND_URL', 'BANK_USERNAME', 'BANK_PASSWORD'];
    const missing = requiredVars.filter((v) => !process.env[v]);
    if (missing.length > 0) {
        throw new Error(`❌ Missing required env vars: ${missing.join(', ')}`);
    }
    log('✅ Environment variables validated');

    // 2. Verify target application is reachable
    const browser = await chromium.launch();
    const context = await browser.newContext();
    const page = await context.newPage();

    try {
        const response = await page.goto(process.env.QA_PLAYGROUND_URL!, {
            timeout: 30000,
        });
        if (!response || !response.ok()) {
            throw new Error(`❌ App not reachable: ${response?.status()}`);
        }
        log('✅ Application is reachable');
    } catch (error) {
        await browser.close();
        const message = error instanceof Error ? error.message : 'Unknown error';
        const newError = new Error(
            `❌ Cannot connect to ${process.env.QA_PLAYGROUND_URL}: ${message}`,
        );
        if (error instanceof Error) {
            newError.cause = error;
        }
        throw newError;
    }

    // 3. Pre-authenticate and save session (for tests that need it)
    try {
        await page.goto(`${process.env.QA_PLAYGROUND_URL}/bank`);
        await page.getByTestId('username-input').fill(process.env.BANK_USERNAME!);
        await page.getByTestId('password-input').fill(process.env.BANK_PASSWORD!);
        await page.getByTestId('login-button').click();
        await page.waitForURL('**/dashboard', { timeout: 10000 });

        // Capture sessionStorage for reuse
        const sessionStorage: string = await page.evaluate(() => JSON.stringify(sessionStorage));
        process.env.CACHED_SESSION_STORAGE = sessionStorage;
        log('✅ Auth session cached for reuse');
    } catch {
        log('⚠️ Auth caching skipped (non-critical)');
    }

    await browser.close();

    // 4. Log test configuration
    log(`\n📋 Test Configuration:`);
    log(`   Environment: ${environment}`);
    log(`   Workers: ${config.workers}`);
    log(`   Projects: ${config.projects.map((p) => p.name).join(', ')}`);
    log(`   Base URL: ${process.env.QA_PLAYGROUND_URL}`);

    log('\n✅ Global Setup Complete\n');
}

export default globalSetup;
