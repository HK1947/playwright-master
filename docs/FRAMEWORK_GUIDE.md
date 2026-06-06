# 🎭 Playwright Enterprise Framework - Complete Technical Guide

> **Version:** 2.0  
> **Author:** Harsha Kumar  
> **Last Updated:** June 2026  
> **Purpose:** Complete technical documentation for interview preparation, team onboarding, and framework mastery

---

## 📑 Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Architecture Overview](#2-architecture-overview)
3. [Object-Oriented Programming Concepts](#3-object-oriented-programming-concepts)
4. [Design Patterns Implemented](#4-design-patterns-implemented)
5. [TypeScript Concepts & Interfaces](#5-typescript-concepts--interfaces)
6. [Project Structure Deep Dive](#6-project-structure-deep-dive)
7. [Page Object Model (POM)](#7-page-object-model-pom)
8. [Fixtures & Dependency Injection](#8-fixtures--dependency-injection)
9. [Configuration Management](#9-configuration-management)
10. [Parallel Testing & Sharding](#10-parallel-testing--sharding)
11. [Test Data Management](#11-test-data-management)
12. [Error Handling & Custom Errors](#12-error-handling--custom-errors)
13. [Retry Mechanisms](#13-retry-mechanisms)
14. [Reporting & Logging](#14-reporting--logging)
15. [CI/CD Pipeline](#15-cicd-pipeline)
16. [API Testing](#16-api-testing)
17. [Network Mocking](#17-network-mocking)
18. [Code Quality & Linting](#18-code-quality--linting)
19. [Commands Reference](#19-commands-reference)
20. [Interview Q&A](#20-interview-qa)
21. [Glossary](#21-glossary)

---

# 1. Executive Summary

## What is This Framework?

This is an **enterprise-grade test automation framework** built with:
- **Playwright** - Modern browser automation
- **TypeScript** - Type-safe JavaScript
- **Page Object Model** - Maintainable test architecture
- **Dependency Injection** - Loose coupling via fixtures

## Key Capabilities

```
┌─────────────────────────────────────────────────────────────┐
│                    FRAMEWORK CAPABILITIES                    │
├─────────────────────────────────────────────────────────────┤
│  ✅ Cross-Browser Testing (Chrome, Firefox, Safari, Mobile) │
│  ✅ API Testing (REST)                                       │
│  ✅ Parallel Execution with Sharding                         │
│  ✅ Network Mocking & Interception                           │
│  ✅ Multiple Reporters (HTML, Allure, JUnit, JSON)           │
│  ✅ CI/CD Integration (GitHub Actions)                       │
│  ✅ Environment-based Configuration                          │
│  ✅ Smart Retry Mechanisms                                   │
│  ✅ Custom Error Handling                                    │
│  ✅ Slack Notifications                                      │
└─────────────────────────────────────────────────────────────┘
```

## Technology Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| Test Runner | Playwright Test | Execution engine |
| Language | TypeScript 5.x | Type safety |
| Assertions | Playwright Expect | Built-in matchers |
| Reporting | Allure, HTML, JUnit | Test reports |
| Logging | Winston | Structured logs |
| Data Generation | Faker.js | Random test data |
| CI/CD | GitHub Actions | Automation |
| Code Quality | ESLint, Prettier, Husky | Standards |

---

# 2. Architecture Overview

## High-Level Architecture Diagram

```
┌──────────────────────────────────────────────────────────────────────────┐
│                           TEST EXECUTION LAYER                            │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐      │
│  │   Smoke     │  │ Regression  │  │    API      │  │  Network    │      │
│  │   Tests     │  │   Tests     │  │   Tests     │  │  Mocking    │      │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘      │
└─────────┼────────────────┼────────────────┼────────────────┼─────────────┘
          │                │                │                │
          ▼                ▼                ▼                ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                           FIXTURES LAYER (DI)                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐      │
│  │  loginPage  │  │ dashboardPg │  │ accountsPage│  │loggedInPage │      │
│  │  (fixture)  │  │  (fixture)  │  │  (fixture)  │  │  (fixture)  │      │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘      │
└─────────┼────────────────┼────────────────┼────────────────┼─────────────┘
          │                │                │                │
          ▼                ▼                ▼                ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                         PAGE OBJECT LAYER                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐      │
│  │  LoginPage  │  │ DashboardPg │  │ AccountsPage│  │   NavBar    │      │
│  │   (class)   │  │   (class)   │  │   (class)   │  │ (component) │      │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘      │
│         │                │                │                │             │
│         └────────────────┴────────────────┴────────────────┘             │
│                                   │                                       │
│                                   ▼                                       │
│                          ┌─────────────┐                                  │
│                          │  BasePage   │                                  │
│                          │   (class)   │                                  │
│                          └─────────────┘                                  │
└──────────────────────────────────────────────────────────────────────────┘
          │
          ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                           HELPERS LAYER                                   │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐             │
│  │   Logger   │ │DataFactory │ │SafeActions │ │   Retry    │             │
│  │ (singleton)│ │ (factory)  │ │  (facade)  │ │ (utility)  │             │
│  └────────────┘ └────────────┘ └────────────┘ └────────────┘             │
│  ┌────────────┐ ┌────────────┐                                           │
│  │   Errors   │ │ TestHooks  │                                           │
│  │  (custom)  │ │  (hooks)   │                                           │
│  └────────────┘ └────────────┘                                           │
└──────────────────────────────────────────────────────────────────────────┘
          │
          ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                        CONFIGURATION LAYER                                │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐              │
│  │playwright.config│  │   .env.qa      │  │  .env.staging  │              │
│  │     (.ts)      │  │  (env vars)    │  │   (env vars)   │              │
│  └────────────────┘  └────────────────┘  └────────────────┘              │
└──────────────────────────────────────────────────────────────────────────┘
          │
          ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                         PLAYWRIGHT ENGINE                                 │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌────────────┐          │
│  │  Chromium  │  │  Firefox   │  │   WebKit   │  │   Mobile   │          │
│  │  Browser   │  │  Browser   │  │  Browser   │  │  Emulation │          │
│  └────────────┘  └────────────┘  └────────────┘  └────────────┘          │
└──────────────────────────────────────────────────────────────────────────┘
```

## Test Execution Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        TEST EXECUTION FLOW                               │
└─────────────────────────────────────────────────────────────────────────┘

     ┌──────────────┐
     │  npm test    │
     └──────┬───────┘
            │
            ▼
     ┌──────────────┐
     │ Load Config  │◄─── playwright.config.ts
     │  & Env Vars  │◄─── .env.qa / .env.staging
     └──────┬───────┘
            │
            ▼
     ┌──────────────┐
     │ Global Setup │◄─── Validate env, health check, cache auth
     └──────┬───────┘
            │
            ▼
     ┌──────────────┐
     │ Create Worker│◄─── Parallel workers based on config
     │    Pool      │
     └──────┬───────┘
            │
            ▼
    ┌───────┴───────┐
    │  For Each     │
    │    Test       │
    │               │
    │  ┌──────────┐ │
    │  │ Before   │ │◄─── Create fixtures (loginPage, etc.)
    │  │ Hooks    │ │
    │  └────┬─────┘ │
    │       │       │
    │       ▼       │
    │  ┌──────────┐ │
    │  │  Test    │ │◄─── Execute test steps
    │  │ Execution│ │
    │  └────┬─────┘ │
    │       │       │
    │       ▼       │
    │  ┌──────────┐ │
    │  │  After   │ │◄─── Cleanup, screenshots on failure
    │  │  Hooks   │ │
    │  └──────────┘ │
    │               │
    └───────┬───────┘
            │
            ▼
     ┌──────────────┐
     │Global Teardn │◄─── Cleanup, generate reports
     └──────┬───────┘
            │
            ▼
     ┌──────────────┐
     │   Generate   │◄─── HTML, Allure, JUnit, JSON
     │   Reports    │
     └──────────────┘
```

---

# 3. Object-Oriented Programming Concepts

## 3.1 Classes

A **class** is a blueprint for creating objects with predefined properties and methods.

```typescript
// Example: BasePage class
export class BasePage {
    // Property
    protected page: Page;
    
    // Constructor - initializes the object
    constructor(page: Page) {
        this.page = page;
    }
    
    // Method
    async navigate(path: string): Promise<void> {
        await this.page.goto(path);
    }
}
```

**Interview Answer:**
> "A class is a blueprint that defines the structure and behavior of objects. In our framework, `BasePage` is the foundational class that encapsulates common page functionality like navigation and waiting. All page objects inherit from it, promoting code reuse and consistency."

## 3.2 Inheritance

**Inheritance** allows a class to inherit properties and methods from another class.

```typescript
// Parent class
export class BasePage {
    constructor(protected page: Page) {}
    
    async navigate(path: string): Promise<void> {
        await this.page.goto(path);
    }
}

// Child class - inherits from BasePage
export class LoginPage extends BasePage {
    readonly usernameField: Locator;
    
    constructor(page: Page) {
        super(page);  // Call parent constructor
        this.usernameField = page.getByTestId('username-input');
    }
    
    // LoginPage-specific method
    async login(credentials: BankCredentials): Promise<void> {
        await this.usernameField.fill(credentials.username);
        // ... more login logic
    }
}
```

**Inheritance Hierarchy:**
```
         BasePage
            │
    ┌───────┼───────┬───────────┐
    │       │       │           │
LoginPage DashboardPage AccountsPage TransactionsPage
```

**Interview Answer:**
> "We use inheritance to avoid code duplication. `BasePage` contains common functionality like `navigate()`, `waitForPageLoad()`, and `takeScreenshot()`. All page objects extend `BasePage`, inheriting these methods while adding page-specific locators and actions."

## 3.3 Encapsulation

**Encapsulation** hides internal implementation details and exposes only necessary interfaces.

```typescript
export class LoginPage extends BasePage {
    // PRIVATE - only accessible within this class
    private async validateCredentials(creds: BankCredentials): boolean {
        return creds.username.length > 0 && creds.password.length > 0;
    }
    
    // PROTECTED - accessible in this class and child classes
    protected page: Page;
    
    // PUBLIC - accessible from anywhere (default)
    async login(credentials: BankCredentials): Promise<void> {
        if (!this.validateCredentials(credentials)) {
            throw new Error('Invalid credentials');
        }
        // ... login logic
    }
    
    // READONLY - can only be set in constructor
    readonly usernameField: Locator;
}
```

**Access Modifiers:**
| Modifier | Class | Subclass | Outside |
|----------|-------|----------|---------|
| `private` | ✅ | ❌ | ❌ |
| `protected` | ✅ | ✅ | ❌ |
| `public` | ✅ | ✅ | ✅ |
| `readonly` | ✅ (init only) | ✅ (read) | ✅ (read) |

**Interview Answer:**
> "Encapsulation protects internal state and exposes clean interfaces. In our page objects, locators are `readonly` to prevent accidental reassignment, `page` is `protected` so child classes can access it, and validation methods are `private` to hide implementation details."

## 3.4 Polymorphism

**Polymorphism** allows objects of different classes to be treated through a common interface.

```typescript
// Interface defining common behavior
interface Navigable {
    goTo(): Promise<void>;
}

// Multiple classes implementing the same interface
class LoginPage extends BasePage implements Navigable {
    async goTo(): Promise<void> {
        await this.navigate('/bank');
    }
}

class AccountsPage extends BasePage implements Navigable {
    async goTo(): Promise<void> {
        await this.navigate('/bank/accounts');
    }
}

// Polymorphic usage - same method, different behaviors
async function navigateToPage(page: Navigable): Promise<void> {
    await page.goTo();  // Calls the appropriate implementation
}

// Usage
await navigateToPage(new LoginPage(page));    // Goes to /bank
await navigateToPage(new AccountsPage(page)); // Goes to /bank/accounts
```

**Interview Answer:**
> "Polymorphism enables us to write flexible code that works with any page implementing a common interface. For example, any page implementing `Navigable` can be passed to a generic navigation function. This is useful for creating reusable test utilities."

## 3.5 Abstraction

**Abstraction** hides complexity by showing only essential features.

```typescript
// Abstract class - cannot be instantiated directly
abstract class BasePage {
    constructor(protected page: Page) {}
    
    // Concrete method - has implementation
    async waitForPageLoad(): Promise<void> {
        await this.page.waitForLoadState('domcontentloaded');
    }
    
    // Abstract method - MUST be implemented by child classes
    abstract getPageIdentifier(): Locator;
}

// Concrete implementation
class LoginPage extends BasePage {
    // MUST implement abstract method
    getPageIdentifier(): Locator {
        return this.page.getByRole('heading', { name: 'Welcome to SecureBank' });
    }
}
```

**Interview Answer:**
> "Abstraction lets us define a contract (what methods must exist) without specifying implementation. Our `BasePage` could be abstract, forcing each page object to implement `getPageIdentifier()` - ensuring every page has a way to verify it loaded correctly."

## 3.6 Composition vs Inheritance

**Composition** - "HAS-A" relationship (preferred over inheritance in many cases)

```typescript
// NavBar is a COMPONENT used by multiple pages
export class NavBar {
    constructor(private page: Page) {}
    
    async goToAccounts(): Promise<void> {
        await this.page.getByTestId('nav-accounts').click();
    }
    
    async logout(): Promise<void> {
        await this.page.getByTestId('logout-button').click();
    }
}

// DashboardPage HAS-A NavBar (composition)
export class DashboardPage extends BasePage {
    readonly navBar: NavBar;  // Composition
    
    constructor(page: Page) {
        super(page);
        this.navBar = new NavBar(page);  // Create NavBar instance
    }
    
    async goToAccounts(): Promise<void> {
        await this.navBar.goToAccounts();  // Delegate to NavBar
    }
}
```

**Composition Diagram:**
```
┌─────────────────────────────────────┐
│           DashboardPage             │
│  ┌─────────────────────────────┐    │
│  │         NavBar              │    │  ◄── DashboardPage HAS-A NavBar
│  │  - goToAccounts()           │    │
│  │  - goToTransactions()       │    │
│  │  - logout()                 │    │
│  └─────────────────────────────┘    │
│                                     │
│  - quickAddButton                   │
│  - addAccount()                     │
└─────────────────────────────────────┘
```

**Interview Answer:**
> "We use composition over inheritance when functionality is shared across unrelated classes. `NavBar` appears on Dashboard, Accounts, and Transactions pages. Instead of creating a complex inheritance hierarchy, each page HAS-A NavBar instance. This is more flexible - we can add/remove NavBar without changing the inheritance chain."

---

# 4. Design Patterns Implemented

## 4.1 Page Object Model (POM)

**What:** Encapsulate page elements and actions in dedicated classes.

**Why:** Maintainability - if UI changes, update one place.

```typescript
// WITHOUT POM (Bad) ❌
test('login test', async ({ page }) => {
    await page.getByTestId('username-input').fill('admin');
    await page.getByTestId('password-input').fill('admin123');
    await page.getByTestId('login-button').click();
});

// WITH POM (Good) ✅
test('login test', async ({ loginPage }) => {
    await loginPage.login({ username: 'admin', password: 'admin123' });
});
```

**Pattern Diagram:**
```
┌─────────────────┐         ┌─────────────────┐
│      Test       │         │    LoginPage    │
│                 │         │                 │
│ loginPage.login │───────► │ - usernameField │
│                 │         │ - passwordField │
│                 │         │ - loginButton   │
│                 │         │ + login()       │
└─────────────────┘         └─────────────────┘
```

## 4.2 Singleton Pattern

**What:** Ensure only one instance of a class exists.

**Why:** Shared resources like loggers should have one instance.

```typescript
// helpers/logger.ts
class Logger {
    // Static instance - shared across all imports
    private static instance: winston.Logger;
    
    // Private constructor - prevents new Logger()
    private constructor() {}
    
    // Only way to get the logger
    static getInstance(): winston.Logger {
        if (!Logger.instance) {
            Logger.instance = winston.createLogger({
                // ... configuration
            });
        }
        return Logger.instance;
    }
}

// Export singleton instance
export const logger = Logger.getInstance();

// Usage in any file
import { logger } from './helpers';
logger.info('All logs go to the same file');
```

**Singleton Diagram:**
```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Test 1     │     │   Test 2     │     │   Test 3     │
└──────┬───────┘     └──────┬───────┘     └──────┬───────┘
       │                    │                    │
       │   getInstance()    │   getInstance()    │   getInstance()
       │                    │                    │
       └────────────────────┼────────────────────┘
                            │
                            ▼
                   ┌─────────────────┐
                   │  SAME Logger    │
                   │   Instance      │
                   │                 │
                   │ logs/test.log   │
                   └─────────────────┘
```

## 4.3 Factory Pattern

**What:** Create objects without specifying exact class.

**Why:** Generate test data with random but valid values.

```typescript
// helpers/data-factory.ts
export class DataFactory {
    // Factory method - creates BankAccount objects
    static createAccount(overrides?: Partial<BankAccount>): BankAccount {
        return {
            accountName: faker.finance.accountName(),
            accountType: faker.helpers.arrayElement(['Savings', 'Checking']),
            balance: faker.number.int({ min: 100, max: 10000 }),
            enableOverdraft: faker.datatype.boolean(),
            ...overrides,  // Allow customization
        };
    }
    
    // Create multiple accounts
    static createAccounts(count: number): BankAccount[] {
        return Array.from({ length: count }, () => this.createAccount());
    }
    
    // Specialized factory method
    static createSavingsAccount(): BankAccount {
        return this.createAccount({ accountType: 'Savings' });
    }
}

// Usage
const account = DataFactory.createAccount();                    // Random
const savings = DataFactory.createSavingsAccount();             // Savings type
const rich = DataFactory.createAccount({ balance: 1000000 });   // Custom balance
const batch = DataFactory.createAccounts(5);                    // Multiple
```

**Factory Pattern Diagram:**
```
┌─────────────────────────────────────────────────────────────┐
│                      DataFactory                             │
│                                                              │
│  ┌─────────────────┐  ┌─────────────────┐  ┌──────────────┐ │
│  │ createAccount() │  │createSavings()  │  │createAccounts│ │
│  └────────┬────────┘  └────────┬────────┘  └──────┬───────┘ │
└───────────┼────────────────────┼─────────────────┼──────────┘
            │                    │                 │
            ▼                    ▼                 ▼
     ┌─────────────┐      ┌─────────────┐   ┌─────────────┐
     │ BankAccount │      │ BankAccount │   │[BankAccount]│
     │ (random)    │      │ (savings)   │   │  (array)    │
     └─────────────┘      └─────────────┘   └─────────────┘
```

## 4.4 Facade Pattern

**What:** Provide simplified interface to complex subsystem.

**Why:** Hide try/catch complexity, add logging automatically.

```typescript
// helpers/safe-actions.ts
export class SafeActions {
    // Complex error handling hidden behind simple interface
    static async safeClick(locator: Locator, description: string): Promise<void> {
        try {
            logger.info(`Clicking: ${description}`);
            await locator.click();
            logger.info(`Clicked: ${description}`);
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            logger.error(`Failed to click ${description}: ${message}`);
            throw error;
        }
    }
    
    static async safeFill(locator: Locator, value: string, description: string): Promise<void> {
        try {
            logger.info(`Filling ${description} with: ${value}`);
            await locator.fill(value);
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            logger.error(`Failed to fill ${description}: ${message}`);
            throw error;
        }
    }
}

// Usage - simple interface, complex behavior
await SafeActions.safeClick(submitButton, 'Submit Button');
await SafeActions.safeFill(emailField, 'test@example.com', 'Email Field');
```

## 4.5 Dependency Injection (via Fixtures)

**What:** Provide dependencies from outside rather than creating inside.

**Why:** Loose coupling, easier testing, configurable behavior.

```typescript
// WITHOUT DI (Bad) ❌ - tight coupling
test('login test', async ({ page }) => {
    const loginPage = new LoginPage(page);  // Test creates dependency
    await loginPage.goTo();
    await loginPage.login(credentials);
});

// WITH DI (Good) ✅ - loose coupling
test('login test', async ({ loginPage }) => {  // Dependency injected
    await loginPage.login(credentials);         // Already navigated
});

// Fixture provides the dependency
export const test = base.extend<MyFixtures>({
    loginPage: async ({ page }, use) => {
        const loginPage = new LoginPage(page);
        await loginPage.goTo();  // Setup done in fixture
        await use(loginPage);    // Inject into test
    },
});
```

**DI Diagram:**
```
┌─────────────────────────────────────────────────────────────┐
│                      Fixture System                          │
│                                                              │
│   ┌─────────────┐      ┌─────────────┐                      │
│   │   page      │─────►│  loginPage  │                      │
│   │ (built-in)  │      │  (custom)   │                      │
│   └─────────────┘      └──────┬──────┘                      │
│                               │                              │
│                               │ INJECT                       │
│                               ▼                              │
│                      ┌─────────────────┐                    │
│                      │      Test       │                    │
│                      │                 │                    │
│                      │ async ({ login- │                    │
│                      │   Page }) => {} │                    │
│                      └─────────────────┘                    │
└─────────────────────────────────────────────────────────────┘
```

## 4.6 Strategy Pattern

**What:** Define family of algorithms, make them interchangeable.

**Why:** Different mock responses for different scenarios.

```typescript
// Network mocking with different strategies
test.describe('Network Mocking', () => {
    // Strategy 1: Empty response
    test('mock empty accounts', async ({ page }) => {
        await page.route('**/api/accounts*', async (route) => {
            await route.fulfill({
                status: 200,
                body: JSON.stringify([]),
            });
        });
    });
    
    // Strategy 2: Error response
    test('mock server error', async ({ page }) => {
        await page.route('**/api/**', async (route) => {
            await route.fulfill({
                status: 500,
                body: JSON.stringify({ error: 'Server Error' }),
            });
        });
    });
    
    // Strategy 3: Slow response
    test('mock slow API', async ({ page }) => {
        await page.route('**/api/**', async (route) => {
            await new Promise(resolve => setTimeout(resolve, 3000));
            await route.continue();
        });
    });
});
```

---

# 5. TypeScript Concepts & Interfaces

## 5.1 Interfaces

**What:** Define the shape/contract of an object.

**Why:** Type safety, IDE autocomplete, documentation.

```typescript
// types/index.ts

// Simple interface
interface BankCredentials {
    username: string;
    password: string;
}

// Interface with optional properties
interface BankAccount {
    accountName: string;
    accountType: string;
    balance: number;
    enableOverdraft?: boolean;  // Optional (?)
}

// Interface with readonly properties
interface User {
    readonly id: string;        // Cannot be modified after creation
    name: string;
    email: string;
}

// Interface extending another interface
interface AdminUser extends User {
    permissions: string[];
    accessLevel: number;
}
```

## 5.2 Type Aliases

```typescript
// Type alias for union types
type AccountType = 'Savings' | 'Checking' | 'Current';

// Type alias for function signature
type ClickHandler = (locator: Locator) => Promise<void>;

// Type alias for complex types
type TestStatus = 'passed' | 'failed' | 'skipped' | 'timedOut';
```

## 5.3 Generics

**What:** Create reusable components that work with any type.

```typescript
// Generic retry function
async function retry<T>(
    operation: () => Promise<T>,
    maxAttempts: number = 3
): Promise<T> {
    let lastError: Error;
    
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
            return await operation();  // Returns type T
        } catch (error) {
            lastError = error as Error;
        }
    }
    
    throw lastError;
}

// Usage with different types
const user = await retry<User>(() => api.getUser(id));
const accounts = await retry<Account[]>(() => api.getAccounts());
const count = await retry<number>(() => api.getCount());
```

## 5.4 Partial, Pick, Omit

```typescript
interface BankAccount {
    accountName: string;
    accountType: string;
    balance: number;
    enableOverdraft: boolean;
}

// Partial<T> - all properties optional
type PartialAccount = Partial<BankAccount>;
// { accountName?: string; accountType?: string; balance?: number; enableOverdraft?: boolean; }

// Pick<T, K> - select specific properties
type AccountBalance = Pick<BankAccount, 'accountName' | 'balance'>;
// { accountName: string; balance: number; }

// Omit<T, K> - exclude specific properties
type NewAccount = Omit<BankAccount, 'balance'>;
// { accountName: string; accountType: string; enableOverdraft: boolean; }

// Practical usage in DataFactory
static createAccount(overrides?: Partial<BankAccount>): BankAccount {
    return {
        accountName: faker.finance.accountName(),
        accountType: 'Savings',
        balance: 1000,
        enableOverdraft: false,
        ...overrides,  // Override any property
    };
}
```

## 5.5 Type Guards

```typescript
// Type guard function
function isError(value: unknown): value is Error {
    return value instanceof Error;
}

// Usage
try {
    await someOperation();
} catch (error) {
    if (isError(error)) {
        logger.error(error.message);  // TypeScript knows it's Error
    } else {
        logger.error(String(error));
    }
}

// Custom type guard
interface ApiResponse {
    data: unknown;
    status: number;
}

interface SuccessResponse extends ApiResponse {
    status: 200;
    data: { id: string; name: string };
}

function isSuccessResponse(response: ApiResponse): response is SuccessResponse {
    return response.status === 200 && response.data !== null;
}
```

---

# 6. Project Structure Deep Dive

```
playwright-framework/
│
├── 📁 fixtures/                    # Dependency Injection Layer
│   └── test-fixtures.ts            # Custom Playwright fixtures
│
├── 📁 helpers/                     # Utility Layer
│   ├── index.ts                    # Barrel export file
│   ├── data-factory.ts             # Test data generation (Factory Pattern)
│   ├── errors.ts                   # Custom error types
│   ├── logger.ts                   # Winston logger (Singleton Pattern)
│   ├── retry.ts                    # Retry utilities
│   ├── safe-actions.ts             # Error-handled actions (Facade Pattern)
│   └── test-hooks.ts               # Reusable test hooks
│
├── 📁 pages/                       # Page Object Layer
│   ├── BasePage.ts                 # Base class for all pages
│   ├── 📁 components/              # Reusable UI components
│   │   └── NavBar.ts               # Navigation bar component
│   └── 📁 qaplayground/            # Domain-specific pages
│       ├── index.ts                # Barrel export
│       ├── LoginPage.ts
│       ├── DashboardPage.ts
│       ├── AccountsPage.ts
│       └── TransactionsPage.ts
│
├── 📁 tests/                       # Test Layer
│   ├── 📁 api/                     # API tests
│   │   └── users.api.spec.ts
│   └── 📁 bank/                    # UI tests
│       ├── login.spec.ts
│       ├── login-data-driven.spec.ts
│       ├── accounts.spec.ts
│       ├── transactions.spec.ts
│       └── network-mocking.spec.ts
│
├── 📁 test-data/                   # Static Test Data
│   └── users.ts                    # User credentials
│
├── 📁 types/                       # TypeScript Types
│   └── index.ts                    # Shared interfaces
│
├── 📁 .github/workflows/           # CI/CD
│   └── playwright.yml              # GitHub Actions workflow
│
├── 📄 playwright.config.ts         # Playwright configuration
├── 📄 global-setup.ts              # Pre-test setup
├── 📄 global-teardown.ts           # Post-test cleanup
├── 📄 tsconfig.json                # TypeScript configuration
├── 📄 eslint.config.mjs            # ESLint configuration
├── 📄 .env.qa                      # QA environment variables
└── 📄 .env.staging                 # Staging environment variables
```

### Layer Responsibilities

| Layer | Responsibility | Examples |
|-------|---------------|----------|
| **Tests** | Test logic, assertions | `login.spec.ts` |
| **Fixtures** | Object creation, DI | `test-fixtures.ts` |
| **Pages** | UI elements, actions | `LoginPage.ts` |
| **Helpers** | Utilities, cross-cutting | `logger.ts`, `retry.ts` |
| **Types** | Type definitions | `BankAccount` interface |
| **Config** | Settings, environments | `playwright.config.ts` |

---

# 7. Page Object Model (POM)

## 7.1 BasePage Implementation

```typescript
// pages/BasePage.ts
import { Page } from '@playwright/test';

export class BasePage {
    // Protected - accessible by child classes
    constructor(protected page: Page) {}
    
    // Common navigation method
    async navigate(path: string): Promise<void> {
        await this.page.goto(path);
        await this.waitForPageLoad();
    }
    
    // Wait for page to be ready
    async waitForPageLoad(): Promise<void> {
        await this.page.waitForLoadState('domcontentloaded');
    }
    
    // Get current URL
    getCurrentURL(): string {
        return this.page.url();
    }
    
    // Get page title
    async getTitle(): Promise<string> {
        return await this.page.title();
    }
    
    // Take screenshot
    async takeScreenshot(fileName: string): Promise<void> {
        await this.page.screenshot({
            path: `screenshots/${fileName}.png`,
            fullPage: true,
        });
    }
}
```

## 7.2 Page Object Implementation

```typescript
// pages/qaplayground/LoginPage.ts
import { Page, Locator } from '@playwright/test';
import { BasePage } from '../BasePage';
import { BankCredentials } from '../../types';

export class LoginPage extends BasePage {
    // Locators - defined once, reused everywhere
    readonly usernameField: Locator;
    readonly passwordField: Locator;
    readonly loginButton: Locator;
    readonly errorMessage: Locator;
    readonly usernameError: Locator;
    readonly passwordError: Locator;
    
    constructor(page: Page) {
        super(page);  // Call BasePage constructor
        
        // Initialize locators - lazy evaluation
        this.usernameField = page.getByTestId('username-input');
        this.passwordField = page.getByTestId('password-input');
        this.loginButton = page.getByTestId('login-button');
        this.errorMessage = page.getByTestId('login-alert');
        this.usernameError = page.getByText('Username is required');
        this.passwordError = page.getByText('Password is required');
    }
    
    // Navigation - uses BasePage method
    async goTo(): Promise<void> {
        await this.navigate('/bank');
    }
    
    // Business action - encapsulates login flow
    async login(credentials: BankCredentials): Promise<void> {
        await this.usernameField.fill(credentials.username);
        await this.passwordField.fill(credentials.password);
        await this.loginButton.click();
    }
    
    // Getter methods
    async getErrorText(): Promise<string> {
        const text = await this.errorMessage.textContent();
        return text ?? '';
    }
    
    async isErrorVisible(): Promise<boolean> {
        return await this.errorMessage.isVisible();
    }
}
```

## 7.3 Component Pattern (Composition)

```typescript
// pages/components/NavBar.ts
import { Page, Locator } from '@playwright/test';

export class NavBar {
    readonly accountsLink: Locator;
    readonly transactionsLink: Locator;
    readonly logoutButton: Locator;
    
    constructor(private page: Page) {
        this.accountsLink = page.getByTestId('nav-accounts');
        this.transactionsLink = page.getByTestId('nav-transactions');
        this.logoutButton = page.getByTestId('logout-button');
    }
    
    async goToAccounts(): Promise<void> {
        await this.accountsLink.click();
    }
    
    async goToTransactions(): Promise<void> {
        await this.transactionsLink.click();
    }
    
    async logout(confirm: boolean = true): Promise<void> {
        this.page.once('dialog', async (dialog) => {
            if (confirm) {
                await dialog.accept();
            } else {
                await dialog.dismiss();
            }
        });
        await this.logoutButton.click();
    }
}

// pages/qaplayground/DashboardPage.ts
export class DashboardPage extends BasePage {
    readonly navBar: NavBar;  // Composition - HAS-A relationship
    
    constructor(page: Page) {
        super(page);
        this.navBar = new NavBar(page);  // Create NavBar instance
    }
    
    // Delegate to NavBar
    async goToAccounts(): Promise<void> {
        await this.navBar.goToAccounts();
    }
    
    async logout(confirm: boolean = true): Promise<void> {
        await this.navBar.logout(confirm);
    }
}
```

## 7.4 POM Best Practices

| Practice | Why | Example |
|----------|-----|---------|
| Locators in constructor | Single source of truth | `this.loginButton = page.getByTestId('login')` |
| Use `readonly` | Prevent accidental reassignment | `readonly loginButton: Locator` |
| Business methods | Abstract UI details | `login()` instead of `fillUsername()` + `fillPassword()` + `clickSubmit()` |
| Return page objects | Enable chaining | `login(): DashboardPage` |
| No assertions in POM | Keep pages reusable | Assertions belong in tests |

---

# 8. Fixtures & Dependency Injection

## 8.1 What Are Fixtures?

Fixtures are Playwright's way of providing **dependency injection**. They:
- Create objects that tests need
- Handle setup and teardown automatically
- Enable code reuse across tests
- Provide isolation between tests

## 8.2 Built-in Fixtures

```typescript
// Playwright provides these automatically
test('example', async ({ 
    page,           // Browser page
    context,        // Browser context
    browser,        // Browser instance
    request,        // API request context
    browserName,    // 'chromium' | 'firefox' | 'webkit'
}) => {
    // Use fixtures
});
```

## 8.3 Custom Fixtures

```typescript
// fixtures/test-fixtures.ts
import { test as base, Page } from '@playwright/test';
import { LoginPage, DashboardPage, AccountsPage } from '../pages/qaplayground';

// Define fixture types
type MyFixtures = {
    page: Page;
    loginPage: LoginPage;
    dashboardPage: DashboardPage;
    accountsPage: AccountsPage;
    loggedInPage: {
        dashboardPage: DashboardPage;
        accountsPage: AccountsPage;
    };
    autoScreenshot: void;
};

// Extend base test with custom fixtures
export const test = base.extend<MyFixtures>({
    
    // Override built-in page fixture
    page: async ({ page }, use) => {
        // Add popup handler for cookie consent
        await page.addLocatorHandler(
            page.getByRole('button', { name: 'Accept' }),
            async () => {
                await page.getByRole('button', { name: 'Accept' }).click();
            }
        );
        await use(page);  // Provide to test
    },
    
    // LoginPage fixture - creates and navigates
    loginPage: async ({ page }, use) => {
        const loginPage = new LoginPage(page);
        await loginPage.goTo();  // Setup
        await use(loginPage);    // Test runs here
        // Teardown (if needed) goes here
    },
    
    // DashboardPage fixture - just creates (no navigation)
    dashboardPage: async ({ page }, use) => {
        const dashboardPage = new DashboardPage(page);
        await use(dashboardPage);
    },
    
    // Composite fixture - provides authenticated state
    loggedInPage: async (
        { page, loginPage, dashboardPage, accountsPage },
        use
    ) => {
        // Login using credentials from env
        await loginPage.login({
            username: process.env.BANK_USERNAME!,
            password: process.env.BANK_PASSWORD!,
        });
        
        // Wait for dashboard to load
        await page.getByTestId('quick-add-account').waitFor({ state: 'visible' });
        
        // Provide authenticated page objects
        await use({ dashboardPage, accountsPage });
    },
    
    // Auto-fixture - runs for every test automatically
    autoScreenshot: [
        async ({ page }, use, testInfo) => {
            await use();  // Test runs
            
            // After test - take screenshot on failure
            if (testInfo.status !== testInfo.expectedStatus) {
                const screenshotPath = `screenshots/${testInfo.title}.png`;
                await page.screenshot({ path: screenshotPath, fullPage: true });
            }
        },
        { auto: true },  // Auto-run for all tests
    ],
});

// Re-export expect
export { expect } from '@playwright/test';
```

## 8.4 Fixture Flow Diagram

```
┌────────────────────────────────────────────────────────────────────┐
│                        FIXTURE LIFECYCLE                            │
└────────────────────────────────────────────────────────────────────┘

Test Request: async ({ loginPage, dashboardPage }) => { ... }
                           │
                           ▼
┌────────────────────────────────────────────────────────────────────┐
│ 1. RESOLVE DEPENDENCIES                                             │
│                                                                      │
│    loginPage needs: page                                             │
│    dashboardPage needs: page                                         │
│    page (built-in) needs: context                                    │
│    context (built-in) needs: browser                                 │
└────────────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────────────────┐
│ 2. CREATE FIXTURES (Bottom-up)                                       │
│                                                                      │
│    browser ──► context ──► page ──┬──► loginPage                    │
│                                   │                                  │
│                                   └──► dashboardPage                │
└────────────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────────────────┐
│ 3. SETUP PHASE (Before test)                                         │
│                                                                      │
│    page: Add locator handlers                                        │
│    loginPage: Navigate to /bank                                      │
│    dashboardPage: (no setup needed)                                  │
└────────────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────────────────┐
│ 4. TEST EXECUTION                                                    │
│                                                                      │
│    await use(fixture) ◄── TEST CODE RUNS HERE                       │
└────────────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────────────────┐
│ 5. TEARDOWN PHASE (After test)                                       │
│                                                                      │
│    autoScreenshot: Screenshot on failure                             │
│    dashboardPage: (no teardown)                                      │
│    loginPage: (no teardown)                                          │
│    page: Close page                                                  │
│    context: Close context                                            │
└────────────────────────────────────────────────────────────────────┘
```

## 8.5 Using Fixtures in Tests

```typescript
// tests/bank/login.spec.ts
import { test, expect } from '../../fixtures/test-fixtures';

test.describe('Bank Login', () => {
    // Use loginPage fixture
    test('valid login redirects to dashboard', async ({ loginPage, dashboardPage }) => {
        await loginPage.login({
            username: process.env.BANK_USERNAME!,
            password: process.env.BANK_PASSWORD!,
        });
        
        await expect(dashboardPage.dashboardHeading).toBeVisible();
    });
    
    // Use loggedInPage fixture (already authenticated)
    test('dashboard shows accounts', async ({ loggedInPage }) => {
        const { dashboardPage } = loggedInPage;
        
        // Already logged in!
        await expect(dashboardPage.quickAddButton).toBeVisible();
    });
});
```

---

# 9. Configuration Management

## 9.1 Playwright Configuration

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

// Load environment-specific variables
const environment = process.env.ENV || 'qa';
dotenv.config({ path: `.env.${environment}` });

export default defineConfig({
    // ═══════════════════════════════════════════════════════════════
    // TEST DISCOVERY
    // ═══════════════════════════════════════════════════════════════
    testDir: './tests',                    // Where to find tests
    testMatch: '**/*.spec.ts',             // Test file pattern
    
    // ═══════════════════════════════════════════════════════════════
    // TIMEOUTS
    // ═══════════════════════════════════════════════════════════════
    timeout: 60_000,                       // Per-test timeout (60s)
    expect: { timeout: 10_000 },           // Assertion timeout (10s)
    
    // ═══════════════════════════════════════════════════════════════
    // GLOBAL SETUP/TEARDOWN
    // ═══════════════════════════════════════════════════════════════
    globalSetup: require.resolve('./global-setup'),
    globalTeardown: require.resolve('./global-teardown'),
    
    // ═══════════════════════════════════════════════════════════════
    // PARALLELIZATION
    // ═══════════════════════════════════════════════════════════════
    fullyParallel: true,                   // Run tests in parallel
    workers: process.env.CI ? '50%' : undefined,  // Worker count
    
    // ═══════════════════════════════════════════════════════════════
    // RETRIES
    // ═══════════════════════════════════════════════════════════════
    retries: process.env.CI ? 2 : 1,       // Retry failed tests
    
    // ═══════════════════════════════════════════════════════════════
    // CI-SPECIFIC
    // ═══════════════════════════════════════════════════════════════
    forbidOnly: !!process.env.CI,          // Fail if test.only in CI
    
    // ═══════════════════════════════════════════════════════════════
    // OUTPUT
    // ═══════════════════════════════════════════════════════════════
    outputDir: 'test-results',             // Test artifacts location
    
    // ═══════════════════════════════════════════════════════════════
    // REPORTERS
    // ═══════════════════════════════════════════════════════════════
    reporter: [
        ['list'],                                                    // Console output
        ['html', { open: 'never', outputFolder: 'playwright-report' }], // HTML report
        ['junit', { outputFile: 'results/junit-results.xml' }],      // CI integration
        ['allure-playwright'],                                       // Allure report
        ['json', { outputFile: 'results/test-results.json' }],       // Custom dashboards
    ],
    
    // ═══════════════════════════════════════════════════════════════
    // SHARED SETTINGS (All projects inherit these)
    // ═══════════════════════════════════════════════════════════════
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
    
    // ═══════════════════════════════════════════════════════════════
    // PROJECTS (Browser/Device configurations)
    // ═══════════════════════════════════════════════════════════════
    projects: [
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
```

## 9.2 Environment Variables

```bash
# .env.qa
QA_PLAYGROUND_URL=https://qaplayground.com
BANK_USERNAME=admin
BANK_PASSWORD=admin123
API_BASE_URL=https://reqres.in/api
REQRES_API_KEY=your-api-key-here

# .env.staging
QA_PLAYGROUND_URL=https://staging.qaplayground.com
BANK_USERNAME=staging_admin
BANK_PASSWORD=staging_pass123
API_BASE_URL=https://staging-api.reqres.in/api
REQRES_API_KEY=staging-api-key
```

## 9.3 Configuration Inheritance Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                     CONFIGURATION INHERITANCE                        │
└─────────────────────────────────────────────────────────────────────┘

                    ┌─────────────────────────┐
                    │   playwright.config.ts  │
                    │                         │
                    │   use: {                │
                    │     baseURL: '...',     │◄── Shared by ALL projects
                    │     headless: true,     │
                    │     viewport: {...},    │
                    │   }                     │
                    └───────────┬─────────────┘
                                │
            ┌───────────────────┼───────────────────┐
            │                   │                   │
            ▼                   ▼                   ▼
   ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
   │    chromium     │ │    firefox      │ │      api        │
   │                 │ │                 │ │                 │
   │ use: {          │ │ use: {          │ │ use: {          │
   │   ...devices    │ │   ...devices    │ │   baseURL: API, │◄── Override
   │   ['Desktop     │ │   ['Desktop     │ │   extraHTTP...  │
   │    Chrome']     │ │    Firefox']    │ │ }               │
   │ }               │ │ }               │ │                 │
   └─────────────────┘ └─────────────────┘ └─────────────────┘
            │                   │                   │
            │    MERGE          │    MERGE          │    MERGE
            ▼                   ▼                   ▼
   ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
   │  Final Config   │ │  Final Config   │ │  Final Config   │
   │                 │ │                 │ │                 │
   │ baseURL: QA_URL │ │ baseURL: QA_URL │ │ baseURL: API_URL│
   │ headless: true  │ │ headless: true  │ │ headless: true  │
   │ viewport: {...} │ │ viewport: {...} │ │ extraHTTP: {...}│
   │ channel: chrome │ │ browser: ff     │ │                 │
   └─────────────────┘ └─────────────────┘ └─────────────────┘
```

---

# 10. Parallel Testing & Sharding

## 10.1 Parallelization Levels

```
┌─────────────────────────────────────────────────────────────────────┐
│                    PARALLELIZATION LEVELS                            │
└─────────────────────────────────────────────────────────────────────┘

Level 1: WORKER PARALLELISM (Within a Machine)
─────────────────────────────────────────────
                    ┌───────────────┐
                    │  Test Suite   │
                    │   50 tests    │
                    └───────┬───────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
        ▼                   ▼                   ▼
   ┌─────────┐         ┌─────────┐         ┌─────────┐
   │ Worker 1│         │ Worker 2│         │ Worker 3│
   │ 17 tests│         │ 17 tests│         │ 16 tests│
   └─────────┘         └─────────┘         └─────────┘


Level 2: SHARDING (Across Machines)
───────────────────────────────────
                    ┌───────────────┐
                    │  Test Suite   │
                    │   50 tests    │
                    └───────┬───────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
        ▼                   ▼                   ▼
   ┌─────────┐         ┌─────────┐         ┌─────────┐
   │ Shard 1 │         │ Shard 2 │         │ Shard 3 │
   │ Machine │         │ Machine │         │ Machine │
   │ 17 tests│         │ 17 tests│         │ 16 tests│
   └────┬────┘         └────┬────┘         └────┬────┘
        │                   │                   │
   ┌────┴────┐         ┌────┴────┐         ┌────┴────┐
   │Workers  │         │Workers  │         │Workers  │
   └─────────┘         └─────────┘         └─────────┘
```

## 10.2 Worker Configuration

```typescript
// playwright.config.ts
export default defineConfig({
    // Option 1: Fixed number of workers
    workers: 4,
    
    // Option 2: Percentage of CPU cores
    workers: '50%',  // Half of available cores
    
    // Option 3: Environment-based
    workers: process.env.CI ? 1 : undefined,  // 1 in CI, auto locally
    
    // Enable full parallelism
    fullyParallel: true,
});
```

## 10.3 Sharding Commands

```bash
# Split tests across 4 shards
npx playwright test --shard=1/4  # Run on machine 1
npx playwright test --shard=2/4  # Run on machine 2
npx playwright test --shard=3/4  # Run on machine 3
npx playwright test --shard=4/4  # Run on machine 4

# In GitHub Actions
jobs:
  test:
    strategy:
      matrix:
        shard: [1/4, 2/4, 3/4, 4/4]
    steps:
      - run: npx playwright test --shard ${{ matrix.shard }}
```

## 10.4 Test Isolation

```typescript
// Each test gets fresh context - ISOLATED
test('test 1', async ({ page }) => {
    // Fresh browser context
    // No cookies from other tests
    // No localStorage from other tests
});

test('test 2', async ({ page }) => {
    // Completely independent
});

// Shared within describe block (if needed)
test.describe('shared context', () => {
    test.describe.configure({ mode: 'serial' });  // Run in order
    
    let sharedData: string;
    
    test('first', async ({ page }) => {
        sharedData = 'from test 1';
    });
    
    test('second', async ({ page }) => {
        console.log(sharedData);  // 'from test 1'
    });
});
```

## 10.5 Parallel Execution Diagram

```
┌──────────────────────────────────────────────────────────────────────┐
│                    CI PARALLEL EXECUTION                              │
└──────────────────────────────────────────────────────────────────────┘

GitHub Actions Matrix:
                                        
     ┌───────────────────────────────────────────────────┐
     │                  workflow.yml                      │
     │                                                    │
     │  strategy:                                         │
     │    matrix:                                         │
     │      browser: [chromium, firefox, webkit]          │
     │      shard: [1/2, 2/2]                             │
     └────────────────────────┬──────────────────────────┘
                              │
      ┌───────────────────────┼───────────────────────┐
      │           Creates 6 parallel jobs:            │
      │                                               │
      ▼           ▼           ▼           ▼           ▼           ▼
┌──────────┐┌──────────┐┌──────────┐┌──────────┐┌──────────┐┌──────────┐
│chromium  ││chromium  ││ firefox  ││ firefox  ││ webkit   ││ webkit   │
│shard 1/2 ││shard 2/2 ││shard 1/2 ││shard 2/2 ││shard 1/2 ││shard 2/2 │
│          ││          ││          ││          ││          ││          │
│ 10 tests ││ 10 tests ││ 10 tests ││ 10 tests ││ 10 tests ││ 10 tests │
└──────────┘└──────────┘└──────────┘└──────────┘└──────────┘└──────────┘
     │           │           │           │           │           │
     │           │           │           │           │           │
     └───────────┴───────────┴─────┬─────┴───────────┴───────────┘
                                   │
                                   ▼
                          ┌──────────────┐
                          │ Merge Reports│
                          └──────────────┘

Total: 60 tests across 6 parallel runners
Time: ~5 min (vs ~30 min sequential)
```

---

# 11. Test Data Management

## 11.1 Static Test Data

```typescript
// test-data/users.ts
import { BankCredentials } from '../types';

// Valid credentials from environment
export const BANK_VALID_USER: BankCredentials = {
    username: process.env.BANK_USERNAME!,
    password: process.env.BANK_PASSWORD!,
};

// Invalid credentials (hardcoded - intentionally wrong)
export const BANK_INVALID_USER: BankCredentials = {
    username: 'wronguser',
    password: 'wrongpass',
};

// Multiple users for data-driven tests
export const ALL_BANK_USERS: BankCredentials[] = [
    BANK_VALID_USER,
    BANK_INVALID_USER,
    { username: 'admin', password: 'wrongpass' },
    { username: '', password: '' },
];
```

## 11.2 Dynamic Test Data (Factory Pattern)

```typescript
// helpers/data-factory.ts
import { faker } from '@faker-js/faker';
import { BankAccount, BankCredentials } from '../types';

export class DataFactory {
    // Generate random account
    static createAccount(overrides?: Partial<BankAccount>): BankAccount {
        return {
            accountName: faker.finance.accountName(),
            accountType: faker.helpers.arrayElement(['Savings', 'Checking']),
            balance: faker.number.int({ min: 100, max: 10_000 }),
            enableOverdraft: faker.datatype.boolean(),
            ...overrides,  // Override any property
        };
    }
    
    // Generate multiple accounts
    static createAccounts(count: number): BankAccount[] {
        return Array.from({ length: count }, () => this.createAccount());
    }
    
    // Specialized factory methods
    static createSavingsAccount(overrides?: Partial<BankAccount>): BankAccount {
        return this.createAccount({ accountType: 'Savings', ...overrides });
    }
    
    static createHighBalanceAccount(): BankAccount {
        return this.createAccount({ balance: faker.number.int({ min: 50_000, max: 100_000 }) });
    }
    
    // Generate random credentials
    static createCredentials(overrides?: Partial<BankCredentials>): BankCredentials {
        return {
            username: faker.internet.username().toLowerCase(),
            password: faker.internet.password({ length: 12 }),
            ...overrides,
        };
    }
}
```

## 11.3 Data-Driven Testing

```typescript
// tests/bank/login-data-driven.spec.ts
import { test, expect } from '../../fixtures/test-fixtures';

const loginTestCases = [
    {
        description: 'valid admin login',
        credentials: { username: process.env.BANK_USERNAME!, password: process.env.BANK_PASSWORD! },
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

// Generate test for each data set
for (const testCase of loginTestCases) {
    test(`login — ${testCase.description} ${testCase.tag}`, async ({ loginPage, dashboardPage }) => {
        await test.step('attempt login', async () => {
            await loginPage.login(testCase.credentials);
        });
        
        await test.step('verify result', async () => {
            if (testCase.shouldPass) {
                await expect(dashboardPage.dashboardHeading).toBeVisible();
            } else if (testCase.isValidationError) {
                await expect(loginPage.usernameError).toBeVisible();
            } else {
                await expect(loginPage.errorMessage).toBeVisible();
            }
        });
    });
}
```

---

# 12. Error Handling & Custom Errors

## 12.1 Custom Error Types

```typescript
// helpers/errors.ts

// Base error for framework
export class TestFrameworkError extends Error {
    constructor(
        message: string,
        public readonly context?: Record<string, unknown>,
    ) {
        super(message);
        this.name = 'TestFrameworkError';
    }
}

// Element not found
export class ElementNotFoundError extends TestFrameworkError {
    constructor(selector: string, public readonly timeout: number) {
        super(`Element not found: ${selector} (timeout: ${timeout}ms)`, { selector, timeout });
        this.name = 'ElementNotFoundError';
    }
}

// Navigation failed
export class NavigationError extends TestFrameworkError {
    constructor(url: string, public readonly statusCode?: number) {
        super(`Navigation failed: ${url} (status: ${statusCode || 'unknown'})`, { url, statusCode });
        this.name = 'NavigationError';
    }
}

// Authentication failed
export class AuthenticationError extends TestFrameworkError {
    constructor(message: string = 'Authentication failed', public readonly username?: string) {
        super(message, { username });
        this.name = 'AuthenticationError';
    }
}

// API error
export class ApiError extends TestFrameworkError {
    constructor(
        endpoint: string,
        public readonly statusCode: number,
        public readonly responseBody?: unknown,
    ) {
        super(`API error: ${endpoint} returned ${statusCode}`, { endpoint, statusCode, responseBody });
        this.name = 'ApiError';
    }
}
```

## 12.2 Error Handling in Practice

```typescript
// Using custom errors in page objects
async login(credentials: BankCredentials): Promise<void> {
    try {
        await this.usernameField.fill(credentials.username);
        await this.passwordField.fill(credentials.password);
        await this.loginButton.click();
    } catch (error) {
        throw new AuthenticationError(
            `Login failed for user: ${credentials.username}`,
            credentials.username,
        );
    }
}

// Using custom errors in tests
test('login with invalid credentials', async ({ loginPage }) => {
    try {
        await loginPage.login({ username: 'invalid', password: 'invalid' });
        await expect(loginPage.errorMessage).toBeVisible();
    } catch (error) {
        if (error instanceof AuthenticationError) {
            console.log(`Auth error for user: ${error.username}`);
        }
        throw error;
    }
});
```

---

# 13. Retry Mechanisms

## 13.1 Built-in Retries (Config)

```typescript
// playwright.config.ts
export default defineConfig({
    retries: process.env.CI ? 2 : 1,  // Retry failed tests
});
```

## 13.2 Custom Retry Utilities

```typescript
// helpers/retry.ts

interface RetryOptions {
    maxAttempts?: number;
    delayMs?: number;
    backoff?: 'linear' | 'exponential';
    onRetry?: (attempt: number, error: Error) => void;
}

export async function retry<T>(
    operation: () => Promise<T>,
    options: RetryOptions = {},
): Promise<T> {
    const { maxAttempts = 3, delayMs = 1000, backoff = 'exponential' } = options;
    let lastError: Error;
    
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
            return await operation();
        } catch (error) {
            lastError = error instanceof Error ? error : new Error(String(error));
            
            if (attempt === maxAttempts) throw lastError;
            
            const delay = backoff === 'exponential' 
                ? delayMs * Math.pow(2, attempt - 1) 
                : delayMs * attempt;
            
            await sleep(delay);
        }
    }
    
    throw lastError!;
}

// Usage
const user = await retry(
    () => api.createUser(data),
    { maxAttempts: 3, backoff: 'exponential' }
);
```

## 13.3 Retry Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                    EXPONENTIAL BACKOFF RETRY                         │
└─────────────────────────────────────────────────────────────────────┘

Attempt 1 ────► Operation ────► Success? ──Yes──► Return Result
                   │
                   No (Error)
                   │
                   ▼
              Wait 1000ms
                   │
                   ▼
Attempt 2 ────► Operation ────► Success? ──Yes──► Return Result
                   │
                   No (Error)
                   │
                   ▼
              Wait 2000ms
                   │
                   ▼
Attempt 3 ────► Operation ────► Success? ──Yes──► Return Result
                   │
                   No (Error)
                   │
                   ▼
              Throw Error (Max attempts reached)
```

---

# 14. Reporting & Logging

## 14.1 Available Reporters

| Reporter | Output | Use Case |
|----------|--------|----------|
| `list` | Console | Development |
| `html` | `playwright-report/` | Local review |
| `allure-playwright` | `allure-results/` | Beautiful reports |
| `junit` | `results/junit-results.xml` | CI integration |
| `json` | `results/test-results.json` | Custom dashboards |

## 14.2 Winston Logger

```typescript
// helpers/logger.ts
import winston from 'winston';

class Logger {
    private static instance: winston.Logger;
    
    private constructor() {}
    
    static getInstance(): winston.Logger {
        if (!Logger.instance) {
            Logger.instance = winston.createLogger({
                level: 'info',
                format: winston.format.combine(
                    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
                    winston.format.printf((info) => {
                        return `${info.timestamp} [${info.level.toUpperCase()}] ${info.message}`;
                    }),
                ),
                transports: [
                    new winston.transports.File({
                        filename: 'logs/test-run.log',
                        maxsize: 5242880,
                        maxFiles: 3,
                    }),
                    new winston.transports.Console({
                        format: winston.format.combine(
                            winston.format.colorize(),
                            winston.format.simple(),
                        ),
                    }),
                ],
            });
        }
        return Logger.instance;
    }
}

export const logger = Logger.getInstance();
```

## 14.3 Viewing Reports

```bash
# HTML Report
npx playwright show-report

# Allure Report
npm run report:allure
# or
npx allure generate allure-results --clean && npx allure open
```

---

# 15. CI/CD Pipeline

## 15.1 Pipeline Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                    CI/CD PIPELINE FLOW                               │
└─────────────────────────────────────────────────────────────────────┘

                         ┌──────────────┐
                         │   git push   │
                         └──────┬───────┘
                                │
                                ▼
                         ┌──────────────┐
                         │    LINT      │ ◄── ESLint + TypeScript check
                         └──────┬───────┘
                                │
               ┌────────────────┼────────────────┐
               │                │                │
               ▼                ▼                ▼
        ┌──────────────┐ ┌──────────────┐ (wait)
        │    SMOKE     │ │  API TESTS   │
        │   (Chrome)   │ │ (no browser) │
        └──────┬───────┘ └──────┬───────┘
               │                │
               └────────┬───────┘
                        │
                        ▼ (both must pass)
        ┌───────────────────────────────────────────┐
        │              REGRESSION                    │
        │                                            │
        │  ┌─────────┐ ┌─────────┐ ┌─────────┐      │
        │  │chromium │ │ firefox │ │ webkit  │      │
        │  │ shard 1 │ │ shard 1 │ │ shard 1 │      │
        │  └─────────┘ └─────────┘ └─────────┘      │
        │  ┌─────────┐ ┌─────────┐ ┌─────────┐      │
        │  │chromium │ │ firefox │ │ webkit  │      │
        │  │ shard 2 │ │ shard 2 │ │ shard 2 │      │
        │  └─────────┘ └─────────┘ └─────────┘      │
        └───────────────────────────────────────────┘
                        │
                        ▼
                 ┌──────────────┐
                 │MERGE REPORTS │
                 └──────┬───────┘
                        │
                        ▼
                 ┌──────────────┐
                 │    NOTIFY    │ ◄── Slack notification
                 │   (Slack)    │
                 └──────────────┘
```

## 15.2 GitHub Actions Workflow

```yaml
# .github/workflows/playwright.yml
name: Playwright Tests

on:
  push:
    branches: [main, master]
  pull_request:
    branches: [main, master]
  workflow_dispatch:

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
      - run: npm ci
      - run: npm run lint
      - run: npx tsc --noEmit

  smoke:
    needs: lint
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npx playwright install --with-deps chromium
      - run: npx playwright test --grep @smoke --project=chromium
      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: smoke-report
          path: playwright-report/

  regression:
    needs: smoke
    runs-on: ubuntu-latest
    strategy:
      fail-fast: false
      matrix:
        browser: [chromium, firefox, webkit]
        shard: [1/2, 2/2]
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npx playwright install --with-deps ${{ matrix.browser }}
      - run: npx playwright test --project=${{ matrix.browser }} --shard ${{ matrix.shard }}
      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: report-${{ matrix.browser }}-${{ strategy.job-index }}
          path: playwright-report/
```

---

# 16. API Testing

## 16.1 API Test Structure

```typescript
// tests/api/users.api.spec.ts
import { test, expect } from '@playwright/test';

// Type definitions for API responses
interface User {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
}

interface UsersListResponse {
    page: number;
    data: User[];
}

test.describe('API Testing — Users CRUD @api', () => {
    
    test('GET — list all users @smoke', async ({ request }) => {
        const response = await request.get('users?page=1');
        
        expect(response.status()).toBe(200);
        expect(response.ok()).toBeTruthy();
        
        const body = (await response.json()) as UsersListResponse;
        expect(body.data.length).toBeGreaterThan(0);
    });
    
    test('POST — create user @smoke', async ({ request }) => {
        const response = await request.post('users', {
            data: {
                name: 'Harsha Kumar',
                job: 'QA Lead',
            },
        });
        
        expect(response.status()).toBe(201);
        
        const body = await response.json();
        expect(body.name).toBe('Harsha Kumar');
        expect(body.id).toBeTruthy();
    });
    
    test('PUT — update user @regression', async ({ request }) => {
        const response = await request.put('users/2', {
            data: {
                name: 'Updated Name',
                job: 'Senior QA',
            },
        });
        
        expect(response.status()).toBe(200);
    });
    
    test('DELETE — remove user @regression', async ({ request }) => {
        const response = await request.delete('users/2');
        expect(response.status()).toBe(204);
    });
});
```

## 16.2 API Project Configuration

```typescript
// playwright.config.ts
projects: [
    {
        name: 'api',
        testMatch: /.*\.api\.spec\.ts/,
        use: {
            baseURL: process.env.API_BASE_URL?.replace(/\/?$/, '/'),
            extraHTTPHeaders: {
                'x-api-key': process.env.REQRES_API_KEY || '',
                'Content-Type': 'application/json',
            },
        },
    },
],
```

---

# 17. Network Mocking

## 17.1 Mocking Strategies

```typescript
// tests/bank/network-mocking.spec.ts

test.describe('Network Mocking @regression', () => {
    
    // Block requests (images for faster tests)
    test('block images', async ({ page }) => {
        await page.route('**/*.{png,jpg,jpeg,gif,svg}', route => route.abort());
        await page.goto('/bank');
    });
    
    // Mock empty response
    test('mock empty accounts', async ({ page }) => {
        await page.route('**/api/accounts*', route => {
            route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify([]),
            });
        });
    });
    
    // Mock error response
    test('mock server error', async ({ page }) => {
        await page.route('**/api/**', route => {
            route.fulfill({
                status: 500,
                body: JSON.stringify({ error: 'Internal Server Error' }),
            });
        });
    });
    
    // Mock slow response
    test('mock slow API', async ({ page }) => {
        await page.route('**/api/**', async route => {
            await new Promise(r => setTimeout(r, 3000));  // 3s delay
            await route.continue();
        });
    });
    
    // Modify request headers
    test('add custom headers', async ({ page }) => {
        await page.route('**/*', route => {
            route.continue({
                headers: {
                    ...route.request().headers(),
                    'X-Custom-Header': 'test-value',
                },
            });
        });
    });
    
    // Intercept and log requests
    test('log network traffic', async ({ page }) => {
        const requests: string[] = [];
        
        page.on('request', req => requests.push(req.url()));
        page.on('response', res => console.log(res.status(), res.url()));
        
        await page.goto('/bank');
        console.log('Total requests:', requests.length);
    });
});
```

---

# 18. Code Quality & Linting

## 18.1 ESLint Configuration

```javascript
// eslint.config.mjs
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-plugin-prettier/recommended';

export default [
    eslint.configs.recommended,
    ...tseslint.configs.recommendedTypeChecked,
    prettier,
    {
        files: ['**/*.ts'],
        languageOptions: {
            parserOptions: {
                projectService: true,
                tsconfigRootDir: import.meta.dirname,
            },
        },
        rules: {
            '@typescript-eslint/no-floating-promises': 'error',
            '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
            '@typescript-eslint/no-explicit-any': 'warn',
            'prefer-const': 'warn',
            'no-var': 'error',
            'no-console': 'warn',
        },
    },
    {
        ignores: ['node_modules/**', 'playwright-report/**', 'test-results/**'],
    },
];
```

## 18.2 Pre-commit Hooks

```json
// package.json
{
    "lint-staged": {
        "*.ts": [
            "eslint --fix",
            "prettier --write"
        ]
    }
}
```

```bash
# .husky/pre-commit
npm run lint-staged
```

---

# 19. Commands Reference

## 19.1 Test Execution Commands

```bash
# ═══════════════════════════════════════════════════════════════════
# BASIC COMMANDS
# ═══════════════════════════════════════════════════════════════════

# Run all tests
npm test
npx playwright test

# Run specific test file
npx playwright test tests/bank/login.spec.ts

# Run tests matching pattern
npx playwright test login

# ═══════════════════════════════════════════════════════════════════
# BROWSER SELECTION
# ═══════════════════════════════════════════════════════════════════

# Run on specific browser
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit

# Run on multiple browsers
npx playwright test --project=chromium --project=firefox

# ═══════════════════════════════════════════════════════════════════
# TAG-BASED EXECUTION
# ═══════════════════════════════════════════════════════════════════

# Run smoke tests
npm run test:smoke
npx playwright test --grep @smoke

# Run regression tests
npm run test:regression
npx playwright test --grep @regression

# Run API tests
npx playwright test --project=api

# Exclude tag
npx playwright test --grep-invert @smoke

# ═══════════════════════════════════════════════════════════════════
# DEBUG & HEADED MODE
# ═══════════════════════════════════════════════════════════════════

# Run with visible browser
npm run test:headed
npx playwright test --headed

# Debug mode (step through)
npm run test:debug
npx playwright test --debug

# UI mode (interactive)
npx playwright test --ui

# ═══════════════════════════════════════════════════════════════════
# PARALLEL EXECUTION
# ═══════════════════════════════════════════════════════════════════

# Run with specific worker count
npx playwright test --workers=4
npx playwright test --workers=50%

# Run sequentially
npx playwright test --workers=1

# Sharding
npx playwright test --shard=1/4
npx playwright test --shard=2/4

# ═══════════════════════════════════════════════════════════════════
# REPORTING
# ═══════════════════════════════════════════════════════════════════

# Open HTML report
npm run report
npx playwright show-report

# Generate Allure report
npm run report:allure

# ═══════════════════════════════════════════════════════════════════
# UTILITIES
# ═══════════════════════════════════════════════════════════════════

# Generate tests interactively
npx playwright codegen https://qaplayground.com/bank

# Install browsers
npx playwright install
npx playwright install chromium

# Show test list (dry run)
npx playwright test --list

# Update snapshots
npx playwright test --update-snapshots
```

## 19.2 Quick Reference Table

| Task | Command |
|------|---------|
| Run all tests | `npm test` |
| Run smoke tests | `npm run test:smoke` |
| Run regression | `npm run test:regression` |
| Run on Chrome | `npx playwright test --project=chromium` |
| Run API tests | `npx playwright test --project=api` |
| Debug mode | `npx playwright test --debug` |
| Headed mode | `npx playwright test --headed` |
| UI mode | `npx playwright test --ui` |
| View report | `npm run report` |
| Lint code | `npm run lint` |
| Fix lint | `npm run lint:fix` |
| Format code | `npm run format` |

---

# 20. Interview Q&A

## Architecture & Design

**Q: Why did you choose Page Object Model?**
> "POM provides a clean separation between test logic and UI implementation. If a locator changes, I update ONE file instead of 50 tests. It also makes tests more readable — `loginPage.login()` is clearer than raw Playwright commands."

**Q: Explain the difference between Composition and Inheritance in your framework.**
> "We use inheritance for IS-A relationships — LoginPage IS A page, so it extends BasePage. We use composition for HAS-A relationships — DashboardPage HAS A NavBar. NavBar appears on multiple pages, so embedding it via composition avoids a complex inheritance hierarchy."

**Q: Why use Fixtures instead of beforeEach?**
> "Fixtures provide dependency injection with automatic cleanup. They're more flexible — a test only gets fixtures it declares, reducing overhead. They also handle complex dependencies automatically — if loginPage needs page, Playwright creates page first."

**Q: How do you handle test data?**
> "Static data for known scenarios lives in test-data/. Dynamic data uses our DataFactory with Faker.js — it generates realistic random data with the ability to override specific fields. This catches more bugs than hardcoded values."

## Technical Questions

**Q: How does parallel execution work?**
> "Playwright creates multiple worker processes, each running tests independently with isolated browser contexts. We can scale horizontally with sharding — splitting tests across CI machines. Our config uses 50% of CPU cores in CI."

**Q: Explain your retry mechanism.**
> "Three levels: 1) Playwright's built-in `retries` config for flaky tests, 2) Our `retry()` helper with exponential backoff for API calls, 3) Auto-waiting built into Playwright locators. This handles network issues and race conditions."

**Q: How do you manage multiple environments?**
> "Environment-specific .env files (.env.qa, .env.staging) loaded via dotenv. The ENV variable selects which file to load. Sensitive data stays in CI secrets, never in code."

**Q: Describe your CI/CD pipeline.**
> "Lint → Smoke (fast critical path) → API Tests → Full Regression (3 browsers × 2 shards). Smoke gate fails fast. Regression runs in parallel matrix. Reports are merged and Slack notifies on completion."

## Scenario Questions

**Q: How would you add a new page to the framework?**
> "1) Create PageName.ts extending BasePage, 2) Define locators as readonly properties, 3) Add business methods, 4) Export from barrel file, 5) Create fixture if needed, 6) Write tests."

**Q: A test is flaky. How do you debug it?**
> "1) Run with `--debug` to step through, 2) Check trace file for timing, 3) Look for race conditions — missing waits, 4) Check network — mock slow/failing APIs, 5) Add explicit waits if needed, 6) If truly flaky, add to quarantine."

**Q: How do you handle authentication?**
> "Our app uses sessionStorage which Playwright can't persist via storageState. So we login per-test via the loggedInPage fixture. For optimization, global-setup pre-authenticates and caches sessionStorage for injection."

---

# 21. Glossary

| Term | Definition |
|------|------------|
| **Assertion** | Verification that a condition is true |
| **Barrel File** | index.ts that re-exports multiple modules |
| **Base URL** | Root URL prepended to relative paths |
| **CI/CD** | Continuous Integration / Continuous Deployment |
| **Composition** | Object containing another object (HAS-A) |
| **DI** | Dependency Injection — providing dependencies from outside |
| **Encapsulation** | Hiding internal implementation details |
| **Factory** | Pattern for creating objects without specifying exact class |
| **Fixture** | Setup/teardown mechanism with dependency injection |
| **Flaky Test** | Test that passes/fails inconsistently |
| **Global Setup** | Code that runs once before all tests |
| **Headless** | Browser without visible UI |
| **Inheritance** | Class extending another class (IS-A) |
| **Interface** | TypeScript contract defining object shape |
| **Locator** | Playwright's element finder (lazy evaluation) |
| **POM** | Page Object Model — pattern for organizing page interactions |
| **Polymorphism** | Same method, different implementations |
| **Project** | Playwright configuration for specific browser/device |
| **Reporter** | Tool that generates test results in specific format |
| **Retry** | Re-executing failed operation |
| **Sharding** | Splitting tests across multiple machines |
| **Singleton** | Pattern ensuring only one instance exists |
| **Test Step** | Named sub-section within a test |
| **Worker** | Parallel process executing tests |

---

# Appendix A: Architecture Decision Records

## ADR-001: Page Object Model over Raw Playwright

**Status:** Accepted

**Context:** Need maintainable test code as UI changes frequently.

**Decision:** Implement Page Object Model with BasePage inheritance.

**Consequences:** 
- (+) Single source of truth for locators
- (+) Readable test code
- (-) More initial setup

## ADR-002: Fixtures over Global Setup

**Status:** Accepted

**Context:** Need to provide test dependencies cleanly.

**Decision:** Use Playwright fixtures for dependency injection.

**Consequences:**
- (+) Automatic cleanup
- (+) Only instantiate what's needed
- (+) Better isolation

## ADR-003: TypeScript over JavaScript

**Status:** Accepted

**Context:** Need type safety for large codebase.

**Decision:** Use TypeScript with strict mode.

**Consequences:**
- (+) Catch errors at compile time
- (+) Better IDE support
- (-) Learning curve for JS developers

---

**Document Version:** 2.0  
**Last Updated:** June 2026  
**Author:** Harsha Kumar

---

*This document is the complete technical reference for the Playwright Enterprise Framework. For questions or contributions, contact the QA Platform team.*
