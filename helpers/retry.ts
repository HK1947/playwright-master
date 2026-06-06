// helpers/retry.ts
// Smart retry utilities for flaky operations

import { logger } from './logger';

interface RetryOptions {
    maxAttempts?: number;
    delayMs?: number;
    backoff?: 'linear' | 'exponential';
    onRetry?: (attempt: number, error: Error) => void;
}

const defaultOptions: Required<RetryOptions> = {
    maxAttempts: 3,
    delayMs: 1000,
    backoff: 'exponential',
    onRetry: () => {},
};

export async function retry<T>(
    operation: () => Promise<T>,
    options: RetryOptions = {},
): Promise<T> {
    const opts = { ...defaultOptions, ...options };
    let lastError: Error = new Error('Unknown error');

    for (let attempt = 1; attempt <= opts.maxAttempts; attempt++) {
        try {
            return await operation();
        } catch (error) {
            lastError = error instanceof Error ? error : new Error(String(error));

            if (attempt === opts.maxAttempts) {
                logger.error(`All ${opts.maxAttempts} attempts failed: ${lastError.message}`);
                throw lastError;
            }

            const delay =
                opts.backoff === 'exponential'
                    ? opts.delayMs * Math.pow(2, attempt - 1)
                    : opts.delayMs * attempt;

            logger.warn(`Attempt ${attempt} failed, retrying in ${delay}ms...`);
            opts.onRetry(attempt, lastError);

            await sleep(delay);
        }
    }

    throw lastError;
}

export async function retryUntil<T>(
    operation: () => Promise<T>,
    condition: (result: T) => boolean,
    options: RetryOptions & { timeoutMs?: number } = {},
): Promise<T> {
    const timeoutMs = options.timeoutMs || 30000;
    const startTime = Date.now();

    while (Date.now() - startTime < timeoutMs) {
        const result = await operation();
        if (condition(result)) {
            return result;
        }
        await sleep(options.delayMs || 1000);
    }

    throw new Error(`Condition not met within ${timeoutMs}ms`);
}

export function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function poll<T>(
    fn: () => Promise<T>,
    options: {
        interval?: number;
        timeout?: number;
        message?: string;
    } = {},
): Promise<T> {
    const { interval = 500, timeout = 30000, message = 'Polling condition' } = options;
    const startTime = Date.now();

    while (Date.now() - startTime < timeout) {
        try {
            return await fn();
        } catch {
            if (Date.now() - startTime + interval >= timeout) {
                throw new Error(`${message} timed out after ${timeout}ms`);
            }
            await sleep(interval);
        }
    }

    throw new Error(`${message} timed out after ${timeout}ms`);
}
