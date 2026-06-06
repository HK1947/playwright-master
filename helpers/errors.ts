// helpers/errors.ts
// Custom error types for better debugging and error handling

export class TestFrameworkError extends Error {
    constructor(
        message: string,
        public readonly context?: Record<string, unknown>,
    ) {
        super(message);
        this.name = 'TestFrameworkError';
    }
}

export class ElementNotFoundError extends TestFrameworkError {
    constructor(
        selector: string,
        public readonly timeout: number,
    ) {
        super(`Element not found: ${selector} (timeout: ${timeout}ms)`, { selector, timeout });
        this.name = 'ElementNotFoundError';
    }
}

export class NavigationError extends TestFrameworkError {
    constructor(
        url: string,
        public readonly statusCode?: number,
    ) {
        super(`Navigation failed: ${url} (status: ${statusCode || 'unknown'})`, {
            url,
            statusCode,
        });
        this.name = 'NavigationError';
    }
}

export class AuthenticationError extends TestFrameworkError {
    constructor(
        message: string = 'Authentication failed',
        public readonly username?: string,
    ) {
        super(message, { username });
        this.name = 'AuthenticationError';
    }
}

export class ApiError extends TestFrameworkError {
    constructor(
        endpoint: string,
        public readonly statusCode: number,
        public readonly responseBody?: unknown,
    ) {
        super(`API error: ${endpoint} returned ${statusCode}`, {
            endpoint,
            statusCode,
            responseBody,
        });
        this.name = 'ApiError';
    }
}

export class DataFactoryError extends TestFrameworkError {
    constructor(
        operation: string,
        public readonly details?: unknown,
    ) {
        super(`Data factory error: ${operation}`, { operation, details });
        this.name = 'DataFactoryError';
    }
}

export class TimeoutError extends TestFrameworkError {
    constructor(operation: string, timeout: number) {
        super(`Operation timed out: ${operation} (${timeout}ms)`, { operation, timeout });
        this.name = 'TimeoutError';
    }
}
