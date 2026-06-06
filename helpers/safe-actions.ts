// helpers/safe-actions.ts

// DESIGN PATTERN: Facade
// Hides complex try/catch logic behind simple methods
// Tests call: safeActions.safeClick(locator)
// Instead of: writing try/catch in every test

import { Locator } from '@playwright/test';
import { logger } from './logger';

export class SafeActions {
    // Lesson 13: try/catch — attempt action, handle failure gracefully
    // Lesson 26: Generic <T> — return type depends on what action returns
    static async safeClick(locator: Locator, description: string = 'element'): Promise<void> {
        try {
            logger.info(`Clicking: ${description}`);
            await locator.click();
            logger.info(`Clicked: ${description}`);
        } catch (error) {
            // Lesson 13: instanceof checks error type
            const message = error instanceof Error ? error.message : String(error);
            logger.error(`Failed to click ${description}: ${message}`);
            throw error;
            // throw = re-throw so test still FAILS (we just logged the error)
        }
    }

    static async safeFill(
        locator: Locator,
        value: string,
        description: string = 'field',
    ): Promise<void> {
        try {
            logger.info(`Filling ${description} with: ${value}`);
            await locator.fill(value);
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            logger.error(`Failed to fill ${description}: ${message}`);
            throw error;
        }
    }

    // Get text with fallback
    static async safeGetText(locator: Locator, description: string = 'element'): Promise<string> {
        try {
            const text = await locator.textContent();
            logger.info(`Got text from ${description}: ${text}`);
            return text ?? '';
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            logger.error(`Failed to get text from ${description}: ${message}`);
            return '';
        }
    }

    // Wait for element with logging
    static async safeWaitFor(
        locator: Locator,
        state: 'visible' | 'hidden' = 'visible',
        description: string = 'element',
    ): Promise<void> {
        try {
            logger.info(`Waiting for ${description} to be ${state}`);
            await locator.waitFor({ state });
            logger.info(`${description} is ${state}`);
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            logger.error(`Timeout waiting for ${description}: ${message}`);
            throw error;
        }
    }
}
