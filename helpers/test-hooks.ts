// helpers/test-hooks.ts
// Reusable test hooks for setup/teardown operations

import { Page, TestInfo } from '@playwright/test';
import { logger } from './logger';

interface TestContext {
    page: Page;
    testInfo: TestInfo;
}

type HookFunction = (context: TestContext) => Promise<void>;

class TestHooks {
    private beforeEachHooks: HookFunction[] = [];
    private afterEachHooks: HookFunction[] = [];

    registerBeforeEach(hook: HookFunction): void {
        this.beforeEachHooks.push(hook);
    }

    registerAfterEach(hook: HookFunction): void {
        this.afterEachHooks.push(hook);
    }

    async runBeforeEach(context: TestContext): Promise<void> {
        for (const hook of this.beforeEachHooks) {
            await hook(context);
        }
    }

    async runAfterEach(context: TestContext): Promise<void> {
        for (const hook of this.afterEachHooks) {
            try {
                await hook(context);
            } catch (error) {
                const message = error instanceof Error ? error.message : 'Unknown error';
                logger.error(`AfterEach hook failed: ${message}`);
            }
        }
    }
}

export const testHooks = new TestHooks();

// Pre-built hooks

export async function clearBrowserStorage(context: TestContext): Promise<void> {
    const { page } = context;
    await page.evaluate(() => {
        localStorage.clear();
        sessionStorage.clear();
    });
    logger.info('Browser storage cleared');
}

export function logTestStart(context: TestContext): void {
    const { testInfo } = context;
    logger.info(`▶️ Starting: ${testInfo.title}`);
    logger.info(`   Project: ${testInfo.project.name}`);
    logger.info(`   File: ${testInfo.file}`);
}

export function logTestEnd(context: TestContext): void {
    const { testInfo } = context;
    const duration = testInfo.duration;
    const status = testInfo.status;

    const icon = status === 'passed' ? '✅' : status === 'failed' ? '❌' : '⏭️';
    logger.info(`${icon} Finished: ${testInfo.title} (${duration}ms)`);
}

export async function captureConsoleLogs(context: TestContext): Promise<void> {
    const { page, testInfo } = context;
    const logs: string[] = [];

    page.on('console', (msg) => {
        logs.push(`[${msg.type()}] ${msg.text()}`);
    });

    page.on('pageerror', (error) => {
        logs.push(`[ERROR] ${error.message}`);
    });

    // Attach logs to test on failure
    if (testInfo.status !== 'passed' && logs.length > 0) {
        await testInfo.attach('console-logs', {
            body: logs.join('\n'),
            contentType: 'text/plain',
        });
    }
}

export async function injectSessionStorage(context: TestContext): Promise<void> {
    const { page } = context;
    const cachedSession = process.env.CACHED_SESSION_STORAGE;

    if (cachedSession) {
        await page.addInitScript((storage: string) => {
            const data = JSON.parse(storage) as Record<string, string>;
            for (const [key, value] of Object.entries(data)) {
                sessionStorage.setItem(key, value);
            }
        }, cachedSession);
        logger.info('Session storage injected from cache');
    }
}
