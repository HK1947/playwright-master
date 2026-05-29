# Framework Upgrade Guide — Path to Enterprise-Grade 10/10

**Companion to:** `README.md` (audit summary)
**Author:** Harsha Kumar K S
**Last Updated:** 2026-05-26
**Current Score:** 6.5/10 → **Target:** 10/10
**Estimated Effort:** ~3 weeks (13 engineer days)

---

## How to Use This Document

This is a **detailed, copy-paste-ready playbook** for every gap identified in the audit. Each section contains:

1. **What's missing** — the gap
2. **Why it matters** — business/technical justification
3. **How to implement** — step-by-step instructions
4. **Code examples** — complete, working code
5. **Verification** — how to confirm it works

Work through it sequentially or jump to the section you need.

---

## Table of Contents

### Phase 1 — Correctness (Days 1–2)
- [1.1 Add Real Assertions](#11-add-real-assertions-blocker)
- [1.2 Fix `headless: false`](#12-fix-headless-false-in-ci)
- [1.3 Remove Hardcoded URLs](#13-remove-hardcoded-urls)
- [1.4 Add JUnit Reporter](#14-add-junit-reporter)
- [1.5 Fix Fixture Type Drift](#15-fix-fixture-type-drift)
- [1.6 Move Credentials to Env](#16-move-credentials-to-env)

### Phase 2 — Standards Alignment (Days 3–5)
- [2.1 Convert Locators to `readonly` Properties](#21-convert-locators-to-readonly-properties)
- [2.2 Add Test Tagging](#22-add-test-tagging)
- [2.3 Multi-Browser Project Matrix](#23-multi-browser-project-matrix)
- [2.4 Standardize Fixture Imports](#24-standardize-fixture-imports)
- [2.5 Use `test.step()` for Reporting](#25-use-teststep-for-reporting)
- [2.6 Add Soft Assertions Where Needed](#26-add-soft-assertions-where-needed)
- [2.7 Component / Widget Page Objects](#27-component--widget-page-objects)

### Phase 3 — Enterprise Capabilities (Week 2)
- [3.1 API Testing Layer](#31-api-testing-layer)
- [3.2 Test Data Factories (Faker)](#32-test-data-factories-faker)
- [3.3 Builder Pattern for Test Data](#33-builder-pattern-for-test-data)
- [3.4 API-Driven Data Seeding](#34-api-driven-data-seeding)
- [3.5 Multi-Role Authentication](#35-multi-role-authentication)
- [3.6 API-Based Login](#36-api-based-login-faster-than-ui)
- [3.7 Visual Regression Testing](#37-visual-regression-testing)
- [3.8 Accessibility Testing (axe-core)](#38-accessibility-testing-axe-core)
- [3.9 Network Mocking](#39-network-mocking)
- [3.10 Allure Reporting](#310-allure-reporting)
- [3.11 Husky + lint-staged](#311-husky--lint-staged)
- [3.12 eslint-plugin-playwright](#312-eslint-plugin-playwright)

### Phase 4 — CI/CD Excellence (Week 2-3)
- [4.1 Test Sharding](#41-test-sharding)
- [4.2 Browser Caching in CI](#42-browser-caching-in-ci)
- [4.3 Matrix Builds (Browser × Env)](#43-matrix-builds-browser--env)
- [4.4 Smoke Test Gate](#44-smoke-test-gate)
- [4.5 Slack Notifications](#45-slack-notifications)
- [4.6 Branch Protection & CODEOWNERS](#46-branch-protection--codeowners)
- [4.7 Dependabot / Renovate](#47-dependabot--renovate)
- [4.8 Dockerfile](#48-dockerfile)

### Phase 5 — Governance & Docs (Week 3)
- [5.1 CONTRIBUTING.md](#51-contributingmd)
- [5.2 ARCHITECTURE.md](#52-architecturemd)
- [5.3 ADRs (Architecture Decision Records)](#53-adrs-architecture-decision-records)
- [5.4 PR / Issue Templates](#54-pr--issue-templates)
- [5.5 Onboarding Guide](#55-onboarding-guide)

### Phase 6 — Advanced (Ongoing)
- [6.1 Test Impact Analysis](#61-test-impact-analysis)
- [6.2 Flaky Test Detection & Quarantine](#62-flaky-test-detection--quarantine)
- [6.3 Lighthouse Performance Budgets](#63-lighthouse-performance-budgets)
- [6.4 Email Testing (Mailosaur)](#64-email-testing-mailosaur)
- [6.5 Custom Reporter](#65-custom-reporter)

---

# Phase 1 — Correctness (Days 1–2) 🔴

**Goal:** Stop lying about test results. Fix CI breakers. Without this, nothing else matters.

---

## 1.1 Add Real Assertions (BLOCKER)

### Problem
Your current `tests/bank/login.spec.ts` uses `console.log` everywhere — these tests **always pass**.

### Why It Matters
A test suite without assertions gives false confidence. CI shows green; production breaks.

### Implementation

**Before:**
```typescript
test('valid login goes to dashboard', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goTo();
    await loginPage.login(BANK_VALID_USER);
    const heading = await loginPage.getPageHeading();
    console.log(`Page heading: ${heading}`);   // ❌ Not an assertion
});
```

**After:**
```typescript
import { test, expect } from '../../fixtures/test-fixtures';
import { BANK_VALID_USER, BANK_INVALID_USER } from '../../test-data/users';

test.describe('Bank login', () => {
    test('valid login redirects to dashboard @smoke @critical', async ({
        loginPage,
        dashboardPage,
        page,
    }) => {
        await loginPage.login(BANK_VALID_USER);

        // Multiple web-first assertions — all auto-retry
        await expect(page).toHaveURL(/\/dashboard/);
        await expect(dashboardPage.dashboardHeading).toBeVisible();
        await expect(dashboardPage.dashboardHeading).toContainText('SecureBank');
        await expect(dashboardPage.logoutButton).toBeVisible();
    });

    test('invalid login shows error @regression', async ({ loginPage }) => {
        await loginPage.login(BANK_INVALID_USER);

        await expect(loginPage.errorMessage).toBeVisible();
        await expect(loginPage.errorMessage).toHaveText(/Invalid/i);
    });

    test('empty credentials show validation @regression', async ({ loginPage }) => {
        await loginPage.loginButton.click();

        await expect(loginPage.usernameField).toHaveAttribute('aria-invalid', 'true');
    });
});
```

### Web-First Assertion Cheat Sheet

```typescript
// Visibility & state
await expect(locator).toBeVisible();
await expect(locator).toBeHidden();
await expect(locator).toBeEnabled();
await expect(locator).toBeDisabled();
await expect(locator).toBeChecked();
await expect(locator).toBeFocused();
await expect(locator).toBeEditable();

// Text
await expect(locator).toHaveText('exact match');
await expect(locator).toContainText('partial');
await expect(locator).toHaveText(/regex/);

// Input value
await expect(locator).toHaveValue('value');
await expect(locator).toHaveValues(['a', 'b']);  // multi-select

// Attributes & CSS
await expect(locator).toHaveAttribute('disabled', '');
await expect(locator).toHaveClass(/active/);
await expect(locator).toHaveCSS('color', 'rgb(255, 0, 0)');

// Counts
await expect(locator).toHaveCount(5);

// Page-level
await expect(page).toHaveURL('/expected');
await expect(page).toHaveURL(/\/users\/\d+/);
await expect(page).toHaveTitle(/SecureBank/);

// Screenshot
await expect(page).toHaveScreenshot('home.png');
```

### Verification
- Run `npx playwright test` — tests should now actually pass/fail based on app behavior
- Intentionally break the login flow → tests should turn red

---

## 1.2 Fix `headless: false` in CI

### Problem
`playwright.config.ts:25` has `headless: false` — CI runners have no display server.

### Implementation

```typescript
// playwright.config.ts
export default defineConfig({
    use: {
        // headless: false,  // ❌ Remove
        headless: !!process.env.CI,  // ✅ Headless in CI, headed locally
        // OR omit entirely — Playwright defaults to headless
    },
});
```

### For local debugging:
```bash
HEADED=1 npx playwright test
# or
npx playwright test --headed
```

---

## 1.3 Remove Hardcoded URLs

### Problem
`auth/auth.setup.ts:10` has hardcoded `https://qaplayground.com/bank` — breaks multi-env.

### Implementation

```typescript
// auth/auth.setup.ts
import { test as setup } from '@playwright/test';

setup('login and save state', async ({ page }) => {
    await page.goto('/bank');  // ✅ Uses baseURL from config

    await page.getByTestId('username-input').fill(process.env.BANK_USERNAME!);
    await page.getByTestId('password-input').fill(process.env.BANK_PASSWORD!);
    await page.getByTestId('login-button').click();

    await page.getByRole('heading', { name: /SecureBank/ }).waitFor();
    await page.context().storageState({ path: './auth/login-state.json' });
});
```

```typescript
// playwright.config.ts
use: {
    baseURL: process.env.QA_PLAYGROUND_URL,  // ✅ Already set
}
```

### Multi-env support:
```bash
# .env.qa
QA_PLAYGROUND_URL=https://qaplayground.com

# .env.staging
QA_PLAYGROUND_URL=https://staging.qaplayground.com

# Run on staging
ENV=staging npx playwright test
```

---

## 1.4 Add JUnit Reporter

### Problem
`jenkinsFile:128-131` references `results/junit-results.xml` but no JUnit reporter exists.

### Implementation

```typescript
// playwright.config.ts
reporter: [
    ['html', { open: 'never', outputFolder: 'playwright-report' }],
    ['junit', { outputFile: 'results/junit-results.xml' }],        // ✅ Add
    ['json', { outputFile: 'results/results.json' }],              // ✅ Add
    process.env.CI ? ['github'] : ['list'],                        // ✅ Add
    ['blob', { outputDir: 'blob-report' }],                        // ✅ For sharding
],
```

### Verification
```bash
npx playwright test
ls results/junit-results.xml  # Should exist
```

---

## 1.5 Fix Fixture Type Drift

### Problem
`fixtures/test-fixtures.ts:24-29` — type and implementation are out of sync.

### Implementation

```typescript
// fixtures/test-fixtures.ts
type MyFixtures = {
    loginPage: LoginPage;
    dashboardPage: DashboardPage;
    accountsPage: AccountsPage;
    transactionsPage: TransactionsPage;
    loggedInPage: {
        dashboardPage: DashboardPage;
        accountsPage: AccountsPage;
        transactionsPage: TransactionsPage;
    };
    autoScreenshot: void;
};

// Make sure implementation matches the type exactly.
```

---

## 1.6 Move Credentials to Env

### Problem
`test-data/users.ts:3-7` — `admin/admin123` in source code.

### Implementation

```typescript
// test-data/users.ts
import { BankAccount, BankCredentials } from '../types';

// Validate env vars exist at module load time
const requiredEnvVars = ['BANK_USERNAME', 'BANK_PASSWORD'] as const;
for (const key of requiredEnvVars) {
    if (!process.env[key]) {
        throw new Error(`Missing required env var: ${key}`);
    }
}

export const BANK_VALID_USER: BankCredentials = {
    username: process.env.BANK_USERNAME!,
    password: process.env.BANK_PASSWORD!,
};

export const BANK_INVALID_USER: BankCredentials = {
    username: 'wronguser',
    password: 'wrongpass',
};
```

```bash
# .env.qa
BANK_USERNAME=admin
BANK_PASSWORD=admin123
```

---

# Phase 2 — Standards Alignment (Days 3–5) 🟡

**Goal:** Make the framework instantly recognizable to any Playwright engineer.

---

## 2.1 Convert Locators to `readonly` Properties

### Problem
Methods returning Locators is non-standard. ~90% of Playwright codebases use `readonly` properties.

### Implementation Pattern (Hybrid — Best Practice)

```typescript
import { Page, Locator } from '@playwright/test';
import { BasePage } from '../BasePage';
import { BankCredentials } from '../../types';

export class LoginPage extends BasePage {
    // STATIC locators → readonly properties
    readonly usernameField: Locator;
    readonly passwordField: Locator;
    readonly loginButton: Locator;
    readonly errorMessage: Locator;
    readonly pageHeading: Locator;

    // DYNAMIC locators (need parameters) → readonly arrow function
    readonly tabByName = (name: string): Locator =>
        this.page.getByRole('tab', { name });

    readonly accountRow = (accountName: string): Locator =>
        this.page.getByRole('row', { name: accountName });

    constructor(page: Page) {
        super(page);
        this.usernameField = page.getByTestId('username-input');
        this.passwordField = page.getByTestId('password-input');
        this.loginButton = page.getByTestId('login-button');
        this.errorMessage = page.getByTestId('login-alert');
        this.pageHeading = page.getByRole('heading').first();
    }

    async goTo(): Promise<void> {
        await this.navigate('/bank');
    }

    async login(credentials: BankCredentials): Promise<void> {
        await this.usernameField.fill(credentials.username);
        await this.passwordField.fill(credentials.password);
        await this.loginButton.click();
    }
}
```

### Apply to all 4 page objects:
- `LoginPage.ts`
- `DashboardPage.ts`
- `AccountsPage.ts`
- `TransactionsPage.ts`

---

## 2.2 Add Test Tagging

### Why Tag Tests?

```bash
npx playwright test --grep @smoke         # 2-min PR feedback
npx playwright test --grep @regression    # nightly full suite
npx playwright test --grep @critical      # production smoke
npx playwright test --grep "@p0|@p1"      # priority filter
```

### Tagging Strategy

| Tag           | Purpose                          | When Runs                |
| ------------- | -------------------------------- | ------------------------ |
| `@smoke`      | Core user journeys (5–10 tests)  | Every PR                 |
| `@critical`   | Revenue/auth/security paths      | Every PR + production    |
| `@regression` | Full regression suite            | Nightly                  |
| `@e2e`        | End-to-end user flows            | Pre-release              |
| `@api`        | API-only tests                   | API project              |
| `@visual`     | Screenshot diff tests            | Visual project           |
| `@a11y`       | Accessibility tests              | Accessibility project    |
| `@flaky`      | Known-flaky (auto-retry 3x)      | Filtered or quarantined  |
| `@slow`       | Tests over 30s                   | Excluded from PR runs    |
| `@p0`/`@p1`/`@p2` | Priority levels              | P0 every commit          |

### Implementation

```typescript
// Method 1: In test title (works everywhere)
test('valid login @smoke @critical @p0', async ({ loginPage }) => { ... });

// Method 2: tag option (Playwright 1.42+, cleaner)
test('valid login', { tag: ['@smoke', '@critical', '@p0'] }, async ({ loginPage }) => { ... });

// Method 3: describe block (applies to all tests within)
test.describe('Login', { tag: '@regression' }, () => {
    test('valid login @smoke', async ({ loginPage }) => { ... });
    test('invalid login', async ({ loginPage }) => { ... });
});
```

---

## 2.3 Multi-Browser Project Matrix

### Implementation

```typescript
// playwright.config.ts
projects: [
    // SETUP
    {
        name: 'setup',
        testDir: './auth',
        testMatch: /auth\.setup\.ts/,
    },

    // DESKTOP BROWSERS
    {
        name: 'chromium',
        use: { ...devices['Desktop Chrome'], storageState: './auth/login-state.json' },
        dependencies: ['setup'],
    },
    {
        name: 'firefox',
        use: { ...devices['Desktop Firefox'], storageState: './auth/login-state.json' },
        dependencies: ['setup'],
    },
    {
        name: 'webkit',
        use: { ...devices['Desktop Safari'], storageState: './auth/login-state.json' },
        dependencies: ['setup'],
    },

    // MOBILE
    {
        name: 'mobile-chrome',
        use: { ...devices['Pixel 7'], storageState: './auth/login-state.json' },
        dependencies: ['setup'],
    },
    {
        name: 'mobile-safari',
        use: { ...devices['iPhone 13'], storageState: './auth/login-state.json' },
        dependencies: ['setup'],
    },

    // SPECIAL PROJECTS
    {
        name: 'api',
        testMatch: /.*\.api\.spec\.ts/,
        use: { baseURL: process.env.API_BASE_URL },
    },
    {
        name: 'visual',
        testMatch: /.*\.visual\.spec\.ts/,
        use: { ...devices['Desktop Chrome'], storageState: './auth/login-state.json' },
        dependencies: ['setup'],
    },
    {
        name: 'a11y',
        testMatch: /.*\.a11y\.spec\.ts/,
        use: { ...devices['Desktop Chrome'], storageState: './auth/login-state.json' },
        dependencies: ['setup'],
    },
],
```

### Run specific project:
```bash
npx playwright test --project=chromium
npx playwright test --project=mobile-chrome
npx playwright test --project=api
```

---

## 2.4 Standardize Fixture Imports

### Rule
**Every spec file imports `test` from `fixtures/test-fixtures.ts`, never from `@playwright/test`.**

### Implementation

```typescript
// ❌ BAD
import { test, expect } from '@playwright/test';

// ✅ GOOD
import { test, expect } from '../../fixtures/test-fixtures';
```

### Enforce via ESLint:

```javascript
// eslint.config.mjs
rules: {
    'no-restricted-imports': ['error', {
        paths: [{
            name: '@playwright/test',
            importNames: ['test'],
            message: 'Import test from fixtures/test-fixtures, not @playwright/test',
        }],
    }],
},
```

---

## 2.5 Use `test.step()` for Reporting

### Why?
Groups actions into named steps in HTML report — gives non-technical stakeholders a readable test trace.

### Implementation

```typescript
test('transfer funds between accounts @smoke', async ({ loggedInPage }) => {
    const { dashboardPage, transactionsPage } = loggedInPage;

    await test.step('navigate to transactions', async () => {
        await dashboardPage.goToTransactions();
    });

    await test.step('filter by Savings account', async () => {
        await transactionsPage.filterByAccount('Savings Account');
        await transactionsPage.applyFilters();
    });

    await test.step('verify transactions loaded', async () => {
        await expect(transactionsPage.transactionList).toBeVisible();
        await expect(transactionsPage.transactionRow).toHaveCount(10);
    });
});
```

### In HTML report:
```
✓ transfer funds between accounts (3.2s)
  ├─ navigate to transactions (0.8s)
  ├─ filter by Savings account (1.1s)
  └─ verify transactions loaded (1.3s)
```

---

## 2.6 Add Soft Assertions Where Needed

### When to Use
Verifying multiple independent properties of the same state — you want to see ALL failures, not stop at first.

### Implementation

```typescript
test('dashboard renders all widgets', async ({ loggedInPage }) => {
    const { dashboardPage } = loggedInPage;

    // Soft — all run, all reported, test fails at end if any failed
    await expect.soft(dashboardPage.totalBalanceWidget).toBeVisible();
    await expect.soft(dashboardPage.recentTransactionsWidget).toBeVisible();
    await expect.soft(dashboardPage.accountsListWidget).toBeVisible();
    await expect.soft(dashboardPage.quickActionsWidget).toBeVisible();

    // Hard — stops here if balance is wrong
    await expect(dashboardPage.totalBalance).toContainText('$');
});
```

### Manual control:
```typescript
test.fail.expect(test.info().errors.length === 0, 'soft assertions failed');
```

---

## 2.7 Component / Widget Page Objects

### Why?
Shared UI components (nav, modal, datagrid) appear on multiple pages. Don't duplicate locators.

### Implementation

```typescript
// pages/components/NavBar.ts
import { Page, Locator } from '@playwright/test';

export class NavBar {
    readonly container: Locator;
    readonly accountsLink: Locator;
    readonly transactionsLink: Locator;
    readonly logoutButton: Locator;
    readonly userMenu: Locator;

    constructor(page: Page) {
        this.container = page.getByRole('navigation');
        this.accountsLink = this.container.getByTestId('nav-accounts');
        this.transactionsLink = this.container.getByTestId('nav-transactions');
        this.logoutButton = this.container.getByTestId('logout-button');
        this.userMenu = this.container.getByTestId('user-menu');
    }

    async goToAccounts(): Promise<void> {
        await this.accountsLink.click();
    }

    async logout(): Promise<void> {
        await this.userMenu.click();
        await this.logoutButton.click();
    }
}
```

```typescript
// pages/qaplayground/DashboardPage.ts
export class DashboardPage extends BasePage {
    readonly navBar: NavBar;
    readonly addAccountButton: Locator;

    constructor(page: Page) {
        super(page);
        this.navBar = new NavBar(page);  // ✅ Composition
        this.addAccountButton = page.getByTestId('quick-add-account');
    }
}
```

### Use in test:
```typescript
test('navigate via nav bar', async ({ loggedInPage }) => {
    await loggedInPage.dashboardPage.navBar.goToAccounts();
});
```

---

# Phase 3 — Enterprise Capabilities (Week 2) 🟢

---

## 3.1 API Testing Layer

### Why?
- 10x faster than UI tests
- Tests business logic independent of UI
- Used for data setup before UI tests

### Implementation

```typescript
// fixtures/api.fixtures.ts
import { test as base, APIRequestContext, request } from '@playwright/test';

type ApiFixtures = {
    apiContext: APIRequestContext;
    accountsApi: AccountsApi;
    transactionsApi: TransactionsApi;
};

export const test = base.extend<ApiFixtures>({
    apiContext: async ({}, use) => {
        const context = await request.newContext({
            baseURL: process.env.API_BASE_URL,
            extraHTTPHeaders: {
                Authorization: `Bearer ${process.env.API_TOKEN}`,
                'Content-Type': 'application/json',
            },
        });
        await use(context);
        await context.dispose();
    },

    accountsApi: async ({ apiContext }, use) => {
        await use(new AccountsApi(apiContext));
    },

    transactionsApi: async ({ apiContext }, use) => {
        await use(new TransactionsApi(apiContext));
    },
});
```

```typescript
// api/AccountsApi.ts
import { APIRequestContext, expect } from '@playwright/test';
import { BankAccount } from '../types';

export class AccountsApi {
    constructor(private request: APIRequestContext) {}

    async create(data: BankAccount): Promise<{ id: string } & BankAccount> {
        const response = await this.request.post('/api/accounts', { data });
        expect(response.ok()).toBeTruthy();
        return await response.json();
    }

    async getById(id: string) {
        const response = await this.request.get(`/api/accounts/${id}`);
        expect(response.ok()).toBeTruthy();
        return await response.json();
    }

    async delete(id: string): Promise<void> {
        const response = await this.request.delete(`/api/accounts/${id}`);
        expect(response.ok()).toBeTruthy();
    }

    async list() {
        const response = await this.request.get('/api/accounts');
        expect(response.ok()).toBeTruthy();
        return await response.json();
    }
}
```

```typescript
// tests/api/accounts.api.spec.ts
import { test, expect } from '../../fixtures/test-fixtures';
import { createBankAccount } from '../../test-data/factories/account.factory';

test.describe('Accounts API @api', () => {
    test('POST /accounts creates account', async ({ accountsApi }) => {
        const newAccount = createBankAccount();
        const result = await accountsApi.create(newAccount);

        expect(result.id).toBeDefined();
        expect(result.accountName).toBe(newAccount.accountName);
    });

    test('DELETE /accounts/:id removes account', async ({ accountsApi }) => {
        const account = await accountsApi.create(createBankAccount());

        await accountsApi.delete(account.id);

        const list = await accountsApi.list();
        expect(list.find((a: any) => a.id === account.id)).toBeUndefined();
    });
});
```

### Schema Validation with Zod

```bash
npm install --save-dev zod
```

```typescript
// schemas/account.schema.ts
import { z } from 'zod';

export const AccountSchema = z.object({
    id: z.string().uuid(),
    accountName: z.string().min(1),
    accountType: z.enum(['Savings Account', 'Current Account']),
    balance: z.number().nonnegative(),
    enableOverdraft: z.boolean().optional(),
    createdAt: z.string().datetime(),
});

export type Account = z.infer<typeof AccountSchema>;
```

```typescript
// api/AccountsApi.ts
async create(data: BankAccount): Promise<Account> {
    const response = await this.request.post('/api/accounts', { data });
    expect(response.ok()).toBeTruthy();
    return AccountSchema.parse(await response.json());  // ✅ Validates response
}
```

---

## 3.2 Test Data Factories (Faker)

### Why?
- Random data catches more edge cases
- No more `Test harsha` accounts polluting your test DB
- Deterministic with seed

### Implementation

```bash
npm install --save-dev @faker-js/faker
```

```typescript
// test-data/factories/account.factory.ts
import { faker } from '@faker-js/faker';
import { BankAccount } from '../../types';

export function createBankAccount(overrides?: Partial<BankAccount>): BankAccount {
    return {
        accountName: faker.finance.accountName(),
        accountType: faker.helpers.arrayElement([
            'Savings Account',
            'Current Account',
        ]),
        balance: faker.number.int({ min: 100, max: 10_000 }),
        enableOverdraft: faker.datatype.boolean(),
        ...overrides,
    };
}

export function createBulkAccounts(count: number): BankAccount[] {
    return Array.from({ length: count }, () => createBankAccount());
}
```

```typescript
// test-data/factories/user.factory.ts
import { faker } from '@faker-js/faker';
import { BankCredentials } from '../../types';

export function createUserCredentials(overrides?: Partial<BankCredentials>): BankCredentials {
    return {
        username: faker.internet.username().toLowerCase(),
        password: faker.internet.password({ length: 12, memorable: false }),
        ...overrides,
    };
}
```

### Deterministic for snapshot tests
```typescript
import { faker } from '@faker-js/faker';

test.beforeEach(() => {
    faker.seed(123);  // Same data every run
});
```

### Usage in tests
```typescript
test('add savings account', async ({ loggedInPage }) => {
    const account = createBankAccount({ accountType: 'Savings Account' });

    await loggedInPage.dashboardPage.addAccount(account);

    await expect(loggedInPage.accountsPage.accountList).toContainText(account.accountName);
});
```

---

## 3.3 Builder Pattern for Test Data

### Why?
Fluent, readable test data construction with type safety.

### Implementation

```typescript
// test-data/builders/account.builder.ts
import { BankAccount } from '../../types';
import { faker } from '@faker-js/faker';

export class AccountBuilder {
    private account: BankAccount;

    constructor() {
        this.account = {
            accountName: faker.finance.accountName(),
            accountType: 'Savings Account',
            balance: 1000,
            enableOverdraft: false,
        };
    }

    withName(name: string): this {
        this.account.accountName = name;
        return this;
    }

    withType(type: string): this {
        this.account.accountType = type;
        return this;
    }

    withBalance(balance: number): this {
        this.account.balance = balance;
        return this;
    }

    withOverdraft(enabled: boolean = true): this {
        this.account.enableOverdraft = enabled;
        return this;
    }

    asSavings(): this {
        return this.withType('Savings Account');
    }

    asCurrent(): this {
        return this.withType('Current Account');
    }

    asHighValue(): this {
        return this.withBalance(faker.number.int({ min: 100_000, max: 1_000_000 }));
    }

    build(): BankAccount {
        return { ...this.account };
    }
}
```

### Usage
```typescript
const account = new AccountBuilder()
    .asSavings()
    .withBalance(5000)
    .withOverdraft()
    .build();
```

---

## 3.4 API-Driven Data Seeding

### Why?
- UI test setup is slow and flaky
- Seed via API → fast, deterministic, isolated

### Implementation

```typescript
// fixtures/data.fixtures.ts
import { test as base } from './api.fixtures';
import { AccountsApi } from '../api/AccountsApi';
import { createBankAccount } from '../test-data/factories/account.factory';

type DataFixtures = {
    seededAccount: { id: string; accountName: string };
    seededAccounts: Array<{ id: string; accountName: string }>;
};

export const test = base.extend<DataFixtures>({
    seededAccount: async ({ accountsApi }, use) => {
        const account = await accountsApi.create(createBankAccount());

        await use(account);  // Test runs

        await accountsApi.delete(account.id);  // Cleanup
    },

    seededAccounts: async ({ accountsApi }, use) => {
        const accounts = await Promise.all([
            accountsApi.create(createBankAccount()),
            accountsApi.create(createBankAccount()),
            accountsApi.create(createBankAccount()),
        ]);

        await use(accounts);

        await Promise.all(accounts.map(a => accountsApi.delete(a.id)));
    },
});
```

### Usage
```typescript
test('view account details', async ({ seededAccount, page }) => {
    // Account already created via API — saves 10s vs UI setup
    await page.goto(`/accounts/${seededAccount.id}`);

    await expect(page.getByText(seededAccount.accountName)).toBeVisible();
});

test('filter accounts list', async ({ seededAccounts, page }) => {
    await page.goto('/accounts');

    await expect(page.getByRole('row')).toHaveCount(seededAccounts.length);
});
```

---

## 3.5 Multi-Role Authentication

### Why?
Test admin, viewer, regular user permissions independently.

### Implementation

```typescript
// auth/auth.setup.ts
import { test as setup } from '@playwright/test';

const USERS = [
    { role: 'admin', usernameEnv: 'ADMIN_USERNAME', passwordEnv: 'ADMIN_PASSWORD' },
    { role: 'user', usernameEnv: 'USER_USERNAME', passwordEnv: 'USER_PASSWORD' },
    { role: 'viewer', usernameEnv: 'VIEWER_USERNAME', passwordEnv: 'VIEWER_PASSWORD' },
] as const;

for (const { role, usernameEnv, passwordEnv } of USERS) {
    setup(`auth as ${role}`, async ({ page }) => {
        await page.goto('/bank');
        await page.getByTestId('username-input').fill(process.env[usernameEnv]!);
        await page.getByTestId('password-input').fill(process.env[passwordEnv]!);
        await page.getByTestId('login-button').click();

        await page.getByRole('heading', { name: /SecureBank/ }).waitFor();
        await page.context().storageState({ path: `./auth/${role}-state.json` });
    });
}
```

```typescript
// playwright.config.ts
projects: [
    { name: 'setup', testMatch: /auth\.setup\.ts/ },

    {
        name: 'admin-tests',
        testMatch: /.*admin.*\.spec\.ts/,
        use: { ...devices['Desktop Chrome'], storageState: './auth/admin-state.json' },
        dependencies: ['setup'],
    },
    {
        name: 'user-tests',
        testMatch: /.*\.spec\.ts/,
        testIgnore: /.*admin.*/,
        use: { ...devices['Desktop Chrome'], storageState: './auth/user-state.json' },
        dependencies: ['setup'],
    },
],
```

---

## 3.6 API-Based Login (Faster than UI)

### Why?
UI login: ~5 seconds. API login: ~200ms. Multiply by 100 tests = saves 8 minutes.

### Implementation

```typescript
// auth/auth.setup.ts
import { test as setup, expect } from '@playwright/test';

setup('login via API', async ({ request }) => {
    // 1. Login via API
    const response = await request.post(`${process.env.QA_PLAYGROUND_URL}/api/login`, {
        data: {
            username: process.env.BANK_USERNAME,
            password: process.env.BANK_PASSWORD,
        },
    });
    expect(response.ok()).toBeTruthy();
    const { token } = await response.json();

    // 2. Set cookie / localStorage manually
    await request.storageState({ path: './auth/login-state.json' });

    // OR for token-based auth, write directly:
    const fs = await import('fs/promises');
    await fs.writeFile(
        './auth/login-state.json',
        JSON.stringify({
            cookies: [],
            origins: [{
                origin: process.env.QA_PLAYGROUND_URL!,
                localStorage: [{ name: 'auth_token', value: token }],
            }],
        }),
    );
});
```

---

## 3.7 Visual Regression Testing

### Why?
Catches unintended UI changes (color, layout, spacing).

### Implementation

```typescript
// tests/visual/dashboard.visual.spec.ts
import { test, expect } from '../../fixtures/test-fixtures';

test.describe('Dashboard visuals @visual', () => {
    test('dashboard full page', async ({ loggedInPage, page }) => {
        await page.goto('/dashboard');
        await page.waitForLoadState('networkidle');

        await expect(page).toHaveScreenshot('dashboard.png', {
            fullPage: true,
            mask: [
                page.getByTestId('current-time'),       // Dynamic timestamp
                page.getByTestId('user-avatar'),        // User-specific
            ],
            maxDiffPixels: 100,                          // Tolerance
            animations: 'disabled',
        });
    });

    test('add account modal', async ({ loggedInPage, page }) => {
        await loggedInPage.dashboardPage.openAddAccountModal();
        await expect(loggedInPage.dashboardPage.modal).toHaveScreenshot('add-account-modal.png');
    });
});
```

### First run creates snapshots:
```bash
npx playwright test --grep @visual --update-snapshots
```

### Subsequent runs compare:
```bash
npx playwright test --grep @visual
```

### Best practices:
- Use `mask:` for dynamic content (dates, avatars)
- Set `maxDiffPixels` to allow font rendering differences
- Disable animations
- Use consistent viewport size
- Lock browser version in CI

---

## 3.8 Accessibility Testing (axe-core)

### Why?
WCAG compliance is legally required in many jurisdictions (EU, US gov contracts).

### Implementation

```bash
npm install --save-dev @axe-core/playwright
```

```typescript
// tests/a11y/login.a11y.spec.ts
import { test, expect } from '../../fixtures/test-fixtures';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility @a11y', () => {
    test('login page meets WCAG 2.1 AA', async ({ loginPage, page }) => {
        await loginPage.goTo();

        const results = await new AxeBuilder({ page })
            .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
            .analyze();

        expect(results.violations).toEqual([]);
    });

    test('dashboard is keyboard navigable', async ({ loggedInPage, page }) => {
        await page.goto('/dashboard');

        const results = await new AxeBuilder({ page })
            .withRules(['focus-order', 'keyboard'])
            .analyze();

        expect(results.violations).toEqual([]);
    });
});
```

### With detailed reporting:
```typescript
test('full a11y scan with report', async ({ page }) => {
    await page.goto('/');
    const results = await new AxeBuilder({ page }).analyze();

    if (results.violations.length > 0) {
        console.table(results.violations.map(v => ({
            id: v.id,
            impact: v.impact,
            nodes: v.nodes.length,
            description: v.description,
        })));
    }

    expect(results.violations).toEqual([]);
});
```

---

## 3.9 Network Mocking

### Why?
- Test edge cases (500 errors, slow responses, empty arrays)
- Decouple frontend tests from backend

### Implementation

```typescript
// tests/network/error-states.spec.ts
test('shows error when API fails', async ({ loginPage, page }) => {
    // Mock 500 response
    await page.route('**/api/login', (route) =>
        route.fulfill({
            status: 500,
            contentType: 'application/json',
            body: JSON.stringify({ error: 'Internal server error' }),
        }),
    );

    await loginPage.login({ username: 'a', password: 'b' });

    await expect(page.getByText('Something went wrong')).toBeVisible();
});

test('shows loading state during slow API', async ({ loginPage, page }) => {
    // Delay response by 2 seconds
    await page.route('**/api/login', async (route) => {
        await new Promise(r => setTimeout(r, 2000));
        await route.continue();
    });

    await loginPage.login(BANK_VALID_USER);
    await expect(page.getByTestId('loading-spinner')).toBeVisible();
});

test('handles empty accounts list', async ({ loggedInPage, page }) => {
    await page.route('**/api/accounts', (route) =>
        route.fulfill({ status: 200, body: JSON.stringify([]) }),
    );

    await page.goto('/accounts');
    await expect(page.getByText('No accounts found')).toBeVisible();
});
```

### Request assertions:
```typescript
test('correct payload sent to API', async ({ loginPage, page }) => {
    const requestPromise = page.waitForRequest('**/api/login');

    await loginPage.login(BANK_VALID_USER);

    const request = await requestPromise;
    expect(request.postDataJSON()).toEqual({
        username: BANK_VALID_USER.username,
        password: BANK_VALID_USER.password,
    });
});
```

---

## 3.10 Allure Reporting

### Why?
- Rich HTML reports with history, trends, attachments
- Industry standard for QA teams
- Steps, screenshots, videos, traces all in one view

### Implementation

```bash
npm install --save-dev allure-playwright allure-commandline
```

```typescript
// playwright.config.ts
reporter: [
    ['html'],
    ['junit', { outputFile: 'results/junit.xml' }],
    ['allure-playwright', {
        detail: true,
        outputFolder: 'allure-results',
        suiteTitle: false,
        environmentInfo: {
            framework: 'Playwright',
            language: 'TypeScript',
            node_version: process.version,
            os: process.platform,
        },
    }],
],
```

### Add Allure metadata to tests:
```typescript
import { allure } from 'allure-playwright';

test('valid login @smoke', async ({ loginPage }) => {
    await allure.epic('Authentication');
    await allure.feature('Login');
    await allure.story('Valid credentials');
    await allure.severity('critical');
    await allure.owner('@team-auth');
    await allure.tms('JIRA-1234');                        // Link to ticket
    await allure.issue('GH-456', 'Bug if fails');         // Link to issue

    await allure.step('attempt login', async () => {
        await loginPage.login(BANK_VALID_USER);
    });

    // ...assertions
});
```

### Generate report:
```bash
npx allure generate allure-results --clean
npx allure open
```

---

## 3.11 Husky + lint-staged

### Why?
Catch issues at commit time, not in CI.

### Implementation

```bash
npm install --save-dev husky lint-staged
npx husky init
```

```json
// package.json
{
    "scripts": {
        "prepare": "husky"
    },
    "lint-staged": {
        "*.ts": [
            "eslint --fix",
            "prettier --write"
        ],
        "*.{json,md,yml}": [
            "prettier --write"
        ]
    }
}
```

```bash
# .husky/pre-commit
npx lint-staged
npx tsc --noEmit
```

```bash
# .husky/commit-msg
npx --no -- commitlint --edit ${1}
```

```bash
npm install --save-dev @commitlint/cli @commitlint/config-conventional
```

```javascript
// commitlint.config.js
module.exports = {
    extends: ['@commitlint/config-conventional'],
    rules: {
        'type-enum': [2, 'always', [
            'feat', 'fix', 'docs', 'test', 'refactor', 'chore', 'ci', 'perf',
        ]],
    },
};
```

---

## 3.12 eslint-plugin-playwright

### Why?
Catches Playwright-specific bugs:
- `await page.waitForTimeout()` (anti-pattern)
- `test.only` left in code
- Missing `await` on Playwright calls
- Conditional assertions

### Implementation

```bash
npm install --save-dev eslint-plugin-playwright
```

```javascript
// eslint.config.mjs
import playwright from 'eslint-plugin-playwright';

export default [
    // ... existing config

    {
        ...playwright.configs['flat/recommended'],
        files: ['tests/**', 'fixtures/**'],
        rules: {
            ...playwright.configs['flat/recommended'].rules,
            'playwright/no-skipped-test': 'warn',
            'playwright/no-focused-test': 'error',
            'playwright/no-wait-for-timeout': 'error',
            'playwright/no-conditional-in-test': 'warn',
            'playwright/expect-expect': 'error',                // Catches no-assertion tests!
            'playwright/no-useless-not': 'warn',
            'playwright/prefer-web-first-assertions': 'error',
        },
    },
];
```

This catches the `console.log` instead of `expect` problem **before commit**.

---

# Phase 4 — CI/CD Excellence (Week 2-3) 🚀

---

## 4.1 Test Sharding

### Why?
Split 100 tests across 4 runners = 4x faster CI.

### Implementation

```yaml
# .github/workflows/playwright.yml
jobs:
    test:
        runs-on: ubuntu-latest
        strategy:
            fail-fast: false
            matrix:
                shard: [1/4, 2/4, 3/4, 4/4]
        steps:
            - uses: actions/checkout@v4
            - uses: actions/setup-node@v4
              with:
                  node-version: 20

            - run: npm ci

            - run: npx playwright install --with-deps

            - run: npx playwright test --shard ${{ matrix.shard }}

            - uses: actions/upload-artifact@v4
              if: always()
              with:
                  name: blob-report-${{ matrix.shard }}
                  path: blob-report/

    merge-reports:
        if: always()
        needs: [test]
        runs-on: ubuntu-latest
        steps:
            - uses: actions/checkout@v4
            - uses: actions/setup-node@v4
              with:
                  node-version: 20

            - run: npm ci

            - uses: actions/download-artifact@v4
              with:
                  path: all-blob-reports
                  pattern: blob-report-*
                  merge-multiple: true

            - run: npx playwright merge-reports --reporter html ./all-blob-reports

            - uses: actions/upload-artifact@v4
              with:
                  name: html-report
                  path: playwright-report
```

---

## 4.2 Browser Caching in CI

### Why?
Playwright browser download = ~150MB, ~30 seconds. Cache it.

### Implementation

```yaml
- name: Get Playwright version
  id: playwright-version
  run: echo "version=$(npm ls @playwright/test --json | jq -r '.dependencies["@playwright/test"].version')" >> $GITHUB_OUTPUT

- name: Cache Playwright browsers
  uses: actions/cache@v4
  id: playwright-cache
  with:
      path: ~/.cache/ms-playwright
      key: playwright-${{ runner.os }}-${{ steps.playwright-version.outputs.version }}

- name: Install Playwright browsers (cache miss only)
  run: npx playwright install --with-deps
  if: steps.playwright-cache.outputs.cache-hit != 'true'

- name: Install Playwright system deps (always needed)
  run: npx playwright install-deps
  if: steps.playwright-cache.outputs.cache-hit == 'true'
```

### Cache node_modules:
```yaml
- name: Cache node_modules
  uses: actions/cache@v4
  with:
      path: node_modules
      key: ${{ runner.os }}-node-${{ hashFiles('package-lock.json') }}

- name: Install dependencies
  run: npm ci
```

---

## 4.3 Matrix Builds (Browser × Env)

### Implementation

```yaml
strategy:
    fail-fast: false
    matrix:
        browser: [chromium, firefox, webkit]
        env: [qa, staging]
        shard: [1/4, 2/4, 3/4, 4/4]

steps:
    - run: |
          ENV=${{ matrix.env }} npx playwright test \
              --project=${{ matrix.browser }} \
              --shard ${{ matrix.shard }}
```

### Result: 24 parallel jobs (3 browsers × 2 envs × 4 shards) → completes in ~5 minutes vs 2 hours sequentially.

---

## 4.4 Smoke Test Gate

### Why?
Don't waste 1 hour running regression if smoke fails in 2 minutes.

### Implementation

```yaml
jobs:
    smoke:
        runs-on: ubuntu-latest
        steps:
            - uses: actions/checkout@v4
            - run: npm ci
            - run: npx playwright install --with-deps chromium
            - run: npx playwright test --grep @smoke --project=chromium

    regression:
        needs: smoke               # ✅ Blocks if smoke fails
        runs-on: ubuntu-latest
        strategy:
            matrix:
                shard: [1/4, 2/4, 3/4, 4/4]
        steps:
            - run: npx playwright test --grep @regression --shard ${{ matrix.shard }}
```

---

## 4.5 Slack Notifications

### Implementation

```yaml
- name: Notify Slack on failure
  if: failure()
  uses: 8398a7/action-slack@v3
  with:
      status: failure
      fields: repo,message,commit,author,action,ref,workflow
      mention: 'channel'
      if_mention: failure
  env:
      SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK }}

- name: Send rich failure summary
  if: failure()
  run: |
      cat > slack.json <<EOF
      {
          "blocks": [
              {
                  "type": "header",
                  "text": { "type": "plain_text", "text": "🔴 Playwright Tests Failed" }
              },
              {
                  "type": "section",
                  "fields": [
                      { "type": "mrkdwn", "text": "*Branch:*\n${{ github.ref_name }}" },
                      { "type": "mrkdwn", "text": "*Author:*\n${{ github.actor }}" },
                      { "type": "mrkdwn", "text": "*Commit:*\n${{ github.sha }}" },
                      { "type": "mrkdwn", "text": "*Run:*\n<${{ github.server_url }}/${{ github.repository }}/actions/runs/${{ github.run_id }}|View>" }
                  ]
              }
          ]
      }
      EOF
      curl -X POST -H 'Content-type: application/json' --data @slack.json ${{ secrets.SLACK_WEBHOOK }}
```

---

## 4.6 Branch Protection & CODEOWNERS

### Implementation

```bash
# .github/CODEOWNERS

# Global owners
*                           @harshakumar

# Test code
tests/                      @qa-team
fixtures/                   @qa-team
pages/                      @qa-team

# Config
playwright.config.ts        @qa-team @senior-engineers
.github/workflows/          @devops-team @qa-team

# Documentation
*.md                        @qa-team @tech-writers
```

### Branch protection (configure in GitHub Settings):
- Require PR review (1 approver)
- Require CODEOWNERS review
- Require status checks: `smoke`, `lint`, `type-check`
- Require branches to be up to date
- No force push to main

---

## 4.7 Dependabot / Renovate

### Implementation

```yaml
# .github/dependabot.yml
version: 2
updates:
    - package-ecosystem: 'npm'
      directory: '/'
      schedule:
          interval: 'weekly'
          day: 'monday'
      open-pull-requests-limit: 5
      reviewers:
          - 'harshakumar'
      labels:
          - 'dependencies'
      groups:
          playwright:
              patterns:
                  - '@playwright/*'
                  - 'playwright*'
          dev-tools:
              patterns:
                  - 'eslint*'
                  - 'prettier*'
                  - 'typescript'
                  - '@types/*'

    - package-ecosystem: 'github-actions'
      directory: '/'
      schedule:
          interval: 'weekly'
```

---

## 4.8 Dockerfile

### Why?
- "Works on my machine" → "works everywhere"
- CI and local use the same image
- Includes all system dependencies

### Implementation

```dockerfile
# Dockerfile
FROM mcr.microsoft.com/playwright:v1.60.0-jammy

WORKDIR /app

# Cache layer for dependencies
COPY package*.json ./
RUN npm ci

# Copy source
COPY . .

# Default command
CMD ["npx", "playwright", "test"]
```

```yaml
# docker-compose.yml
version: '3.8'
services:
    tests:
        build: .
        environment:
            - QA_PLAYGROUND_URL=https://qaplayground.com
            - BANK_USERNAME=${BANK_USERNAME}
            - BANK_PASSWORD=${BANK_PASSWORD}
            - CI=true
        volumes:
            - ./playwright-report:/app/playwright-report
            - ./test-results:/app/test-results
        command: npx playwright test --grep @smoke
```

### Usage:
```bash
docker compose up tests
# OR
docker build -t playwright-framework .
docker run --rm -v $(pwd)/playwright-report:/app/playwright-report playwright-framework
```

---

# Phase 5 — Governance & Docs (Week 3) 📚

---

## 5.1 CONTRIBUTING.md

```markdown
# Contributing to Playwright Framework

## Adding a New Test

1. Create file at `tests/<feature>/<scenario>.spec.ts`
2. Import from custom fixtures, never from `@playwright/test`
3. Use page objects — never inline locators
4. Tag every test (`@smoke`, `@regression`, `@critical`, etc.)
5. Add `test.step()` for multi-action tests
6. Use `expect()` — never `console.log` for verification

## Naming Conventions

- Spec files: `<feature>.spec.ts`
- API specs: `<feature>.api.spec.ts`
- Visual specs: `<feature>.visual.spec.ts`
- A11y specs: `<feature>.a11y.spec.ts`
- Page objects: `<PageName>Page.ts` (PascalCase)
- Test names: descriptive sentence, present tense
  - ✅ "valid login redirects to dashboard"
  - ❌ "Test login 1"

## Locator Strategy

Priority order:
1. `page.getByRole(...)` — accessibility first
2. `page.getByLabel(...)` — form inputs
3. `page.getByText(...)` — non-interactive
4. `page.getByPlaceholder(...)` — fallback
5. `page.getByTestId(...)` — when above fail

## Pull Request Checklist

- [ ] All tests pass locally
- [ ] Lint passes (`npm run lint`)
- [ ] Type-check passes (`npm run type-check`)
- [ ] New page objects extend `BasePage`
- [ ] Locators are `readonly` properties
- [ ] Tests have `@tag` annotations
- [ ] No `test.only` left in code
- [ ] No `waitForTimeout` used
- [ ] No hardcoded URLs (use `baseURL`)
- [ ] No credentials in source (use env vars)
```

---

## 5.2 ARCHITECTURE.md

```markdown
# Architecture Decisions

## Design Principles

1. **Single Responsibility** — Each page class handles one page
2. **Encapsulation** — Locators are private/readonly
3. **DRY** — Common utilities in BasePage
4. **Dependency Injection** — Via fixtures
5. **Inversion of Control** — Playwright controls lifecycle
6. **Facade** — Complex actions wrapped in single method

## Layer Diagram

[See README.md mermaid diagrams]

## Choices Justified

### Why Page Object Model?
- Separates test intent from page mechanics
- Locator changes localized to one file
- Industry standard, easy onboarding

### Why Fixtures over beforeEach?
- Dependency injection (test gets what it needs)
- Composable (loggedInPage = dashboard + accounts + transactions)
- Type-safe
- Auto-cleanup via use() pattern

### Why storageState?
- 100 tests × 5s UI login = 8 minutes
- 100 tests × 0s (cached cookies) = 0 minutes
- Login tested once in setup project

### Why both Jenkins & GitHub Actions?
- Jenkins: internal corporate runner with private network access
- GitHub Actions: PR-level fast feedback
- (If reading this and only one is used — remove the other)

### Why testid > getByRole?
- The QA Playground app doesn't have semantic labels
- For real apps, prefer getByRole
- ADR-003 has full reasoning
```

---

## 5.3 ADRs (Architecture Decision Records)

```markdown
<!-- docs/adrs/ADR-001-page-object-model.md -->
# ADR-001: Use Page Object Model

## Status
Accepted — 2026-05-26

## Context
Need a way to keep tests maintainable as the app grows.

## Decision
Use Page Object Model with one class per logical page or significant component.

## Consequences
- **Positive:** Locator changes localized; tests read like user stories
- **Negative:** Some boilerplate; learning curve for new engineers
- **Mitigation:** CONTRIBUTING.md documents the pattern

## Alternatives Considered
1. **Functional helpers** — rejected due to lack of encapsulation
2. **Screenplay pattern** — overkill for current team size
```

Create one ADR per major decision:
- ADR-001: Page Object Model
- ADR-002: Locator pattern (readonly properties + arrow functions for dynamic)
- ADR-003: testid-first selector strategy
- ADR-004: storageState authentication
- ADR-005: CI platform choice
- ADR-006: TypeScript strict mode
- ADR-007: Allure reporting

---

## 5.4 PR / Issue Templates

```markdown
<!-- .github/PULL_REQUEST_TEMPLATE.md -->
## Summary
<!-- 1-3 sentences on what & why -->

## Type
- [ ] New test
- [ ] Test refactor
- [ ] Framework feature
- [ ] Bug fix
- [ ] Documentation
- [ ] CI/CD

## Test Coverage
- [ ] Added/updated tests
- [ ] All existing tests pass
- [ ] Smoke tests pass
- [ ] Lint passes
- [ ] Type check passes

## Screenshots (if UI-related)

## Linked Issues
Fixes #
```

```markdown
<!-- .github/ISSUE_TEMPLATE/flaky-test.md -->
---
name: Flaky Test
about: Report an intermittently failing test
labels: flaky-test
---

## Test
**File:** `tests/...`
**Test name:** ``

## Failure Rate
Failed X out of last Y runs

## Failure Pattern
- [ ] Browser-specific: ___
- [ ] Time-of-day pattern: ___
- [ ] Load-dependent: ___
- [ ] Other: ___

## Error Message
```

## Trace Link
[Link to CI run]
```

---

## 5.5 Onboarding Guide

```markdown
<!-- docs/onboarding.md -->
# Day-One Onboarding

## Prerequisites
- Node.js 20+
- Git
- VS Code (recommended)

## Setup
\`\`\`bash
git clone <repo>
cd playwright-framework
npm ci
npx playwright install
cp .env.qa.example .env.qa  # Fill in credentials
\`\`\`

## Your First Test Run
\`\`\`bash
npm run test:smoke
\`\`\`

If green → setup complete.

## Your First Test Contribution

1. Pick a Jira ticket tagged `good-first-issue`
2. Create branch: `git checkout -b feat/your-test`
3. Add spec at `tests/<feature>/<scenario>.spec.ts`
4. Follow CONTRIBUTING.md
5. Open PR with template

## Where to Get Help
- Slack: #qa-automation
- Docs: this folder
- Pair with: your onboarding buddy
```

---

# Phase 6 — Advanced (Ongoing) ✨

---

## 6.1 Test Impact Analysis

### Why?
Don't run all 500 tests on every PR — run only tests affected by changes.

### Implementation (manual mapping):

```typescript
// scripts/test-impact.ts
import { execSync } from 'child_process';

const changedFiles = execSync('git diff --name-only origin/main')
    .toString()
    .split('\n')
    .filter(Boolean);

const impactMap: Record<string, string[]> = {
    'pages/qaplayground/LoginPage': ['tests/bank/login.spec.ts'],
    'pages/qaplayground/DashboardPage': ['tests/bank/dashboard.spec.ts'],
    'fixtures/test-fixtures.ts': ['tests/**'],     // All tests
};

const testsToRun = new Set<string>();
for (const file of changedFiles) {
    for (const [pattern, tests] of Object.entries(impactMap)) {
        if (file.includes(pattern)) tests.forEach(t => testsToRun.add(t));
    }
}

execSync(`npx playwright test ${[...testsToRun].join(' ')}`, { stdio: 'inherit' });
```

---

## 6.2 Flaky Test Detection & Quarantine

### Implementation

```typescript
// .github/workflows/flaky-detection.yml
- name: Detect flaky tests
  run: |
      npx playwright test --repeat-each=3 --max-failures=0
      # Tests that pass 2/3 = flaky → quarantine

- name: Open issue for flaky tests
  if: always()
  run: |
      # Parse results, open GitHub issues for new flaky tests
```

### Quarantine mechanism:

```typescript
// tests/quarantine/flaky.spec.ts — separate folder
test.describe('Quarantined flaky tests @flaky', () => {
    test.use({ retries: 3 });

    test('flaky transfer test - tracked in GH-123', async ({ page }) => {
        // ... test that's currently flaky
    });
});
```

```yaml
# Exclude from main suite, run separately
- run: npx playwright test --grep-invert @flaky    # Main suite
- run: npx playwright test --grep @flaky           # Flaky suite (don't block PR)
```

---

## 6.3 Lighthouse Performance Budgets

### Implementation

```bash
npm install --save-dev playwright-lighthouse
```

```typescript
import { test } from '../../fixtures/test-fixtures';
import { playAudit } from 'playwright-lighthouse';

test('dashboard meets performance budget @perf', async ({ page }) => {
    await page.goto('/dashboard');

    await playAudit({
        page,
        port: 9222,
        thresholds: {
            performance: 80,
            accessibility: 90,
            'best-practices': 85,
            seo: 90,
        },
        reports: {
            formats: { html: true, json: true },
            name: 'lighthouse-dashboard',
            directory: 'lighthouse-reports',
        },
    });
});
```

---

## 6.4 Email Testing (Mailosaur)

### Why?
Test password resets, email verification, signup flows.

### Implementation

```bash
npm install --save-dev mailosaur
```

```typescript
// fixtures/email.fixture.ts
import { test as base } from './data.fixtures';
import MailosaurClient from 'mailosaur';

type EmailFixtures = {
    mailbox: { client: MailosaurClient; serverId: string };
    testEmail: string;
};

export const test = base.extend<EmailFixtures>({
    mailbox: async ({}, use) => {
        const client = new MailosaurClient(process.env.MAILOSAUR_API_KEY!);
        await use({ client, serverId: process.env.MAILOSAUR_SERVER_ID! });
    },

    testEmail: async ({ mailbox }, use) => {
        const email = `test-${Date.now()}@${mailbox.serverId}.mailosaur.net`;
        await use(email);
    },
});
```

```typescript
test('signup sends verification email', async ({ page, mailbox, testEmail }) => {
    await page.goto('/signup');
    await page.getByLabel('Email').fill(testEmail);
    await page.getByRole('button', { name: 'Sign up' }).click();

    const message = await mailbox.client.messages.get(mailbox.serverId, {
        sentTo: testEmail,
    });

    expect(message.subject).toContain('Verify your email');
    const link = message.html?.links?.[0].href;
    expect(link).toContain('/verify-email');

    await page.goto(link!);
    await expect(page.getByText('Email verified')).toBeVisible();
});
```

---

## 6.5 Custom Reporter

### Implementation

```typescript
// reporters/SlackReporter.ts
import type { Reporter, TestCase, TestResult, FullResult } from '@playwright/test/reporter';
import axios from 'axios';

class SlackReporter implements Reporter {
    private results: TestResult[] = [];

    onTestEnd(test: TestCase, result: TestResult): void {
        this.results.push(result);
    }

    async onEnd(result: FullResult): Promise<void> {
        const passed = this.results.filter(r => r.status === 'passed').length;
        const failed = this.results.filter(r => r.status === 'failed').length;
        const flaky = this.results.filter(r => r.status === 'passed' && r.retry > 0).length;

        const color = failed > 0 ? '#ff0000' : '#36a64f';

        await axios.post(process.env.SLACK_WEBHOOK!, {
            attachments: [{
                color,
                title: 'Playwright Test Run',
                fields: [
                    { title: 'Passed', value: passed, short: true },
                    { title: 'Failed', value: failed, short: true },
                    { title: 'Flaky', value: flaky, short: true },
                    { title: 'Duration', value: `${(result.duration / 1000).toFixed(1)}s`, short: true },
                ],
            }],
        });
    }
}

export default SlackReporter;
```

```typescript
// playwright.config.ts
reporter: [
    ['./reporters/SlackReporter.ts'],
    // ... other reporters
],
```

---

# Final Verification — How to Confirm 10/10

Run these commands; all should pass:

```bash
# 1. Type checking
npm run type-check

# 2. Linting (with playwright-plugin)
npm run lint

# 3. Smoke tests (fast)
npm run test:smoke

# 4. All tests, sharded
npm run test

# 5. Visual regression
npm run test:visual

# 6. Accessibility
npm run test:a11y

# 7. API tests
npm run test:api

# 8. Build Docker image
docker build -t playwright-framework .
docker run --rm playwright-framework npx playwright test --grep @smoke

# 9. Report generation
npm run report:allure
```

### Health checks:
- [ ] No `console.log` in test files
- [ ] No `waitForTimeout` anywhere
- [ ] No `test.only` in committed code
- [ ] No hardcoded URLs
- [ ] No credentials in source
- [ ] All tests have at least one `expect()`
- [ ] All tests have at least one tag
- [ ] All locators are `readonly`
- [ ] All spec files import from `fixtures/test-fixtures`
- [ ] HTML report renders without errors
- [ ] JUnit report exists at `results/junit-results.xml`
- [ ] Allure report renders
- [ ] CI runs in < 15 minutes
- [ ] Pre-commit hooks block bad commits
- [ ] CODEOWNERS auto-assigns reviewers
- [ ] Dependabot opens PRs weekly
- [ ] Slack notifies on failure
- [ ] README, CONTRIBUTING, ARCHITECTURE all present

---

# Effort Summary

| Phase                            | Days     | Score Gain     |
| -------------------------------- | -------- | -------------- |
| 1 — Correctness                  | 2        | 6.5 → 8.0      |
| 2 — Standards alignment          | 3        | 8.0 → 9.0      |
| 3 — Enterprise capabilities      | 5        | 9.0 → 9.5      |
| 4 — CI/CD excellence             | 2        | 9.5 → 9.8      |
| 5 — Governance & docs            | 1        | 9.8 → 10.0     |
| 6 — Advanced (ongoing)           | Ongoing  | Polish         |
| **TOTAL**                        | **~13**  | **6.5 → 10.0** |

---

# Glossary

- **POM** — Page Object Model
- **storageState** — Saved cookies/localStorage for skipping login
- **Fixture** — Reusable test setup unit (Playwright's term for DI)
- **Shard** — Subset of tests run in parallel CI runner
- **Soft assertion** — `expect.soft()` — keeps test running on failure
- **Test step** — `test.step()` — labeled action group in report
- **Tag** — `@smoke`, `@regression` — for filtering test runs
- **ADR** — Architecture Decision Record
- **A11y** — Accessibility (numeronym: a + 11 letters + y)
- **Flake** — Test that intermittently fails

---

*This is a living document. Update sections as you complete them — check off items in `README.md`'s checklist as you go.*

*Last updated: 2026-05-26*
