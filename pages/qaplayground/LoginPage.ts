// pages/qaplayground/LoginPage.ts
import { Page, Locator } from '@playwright/test';
import { BasePage } from '../BasePage';
import { BankCredentials } from '../../types';

export class LoginPage extends BasePage {
    // readonly = can't reassign after constructor
    // Locator = Playwright's element finder type
    // These are LAZY — element found only when .fill()/.click() is called
    readonly usernameField: Locator;
    readonly passwordField: Locator;
    readonly loginButton: Locator;
    readonly errorMessage: Locator;
    readonly pageHeading: Locator;

    constructor(page: Page) {
        super(page);
        // All locators defined in ONE place — easy to find and maintain
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
        // NO () after locator names — they're properties, not methods
        await this.usernameField.fill(credentials.username);
        await this.passwordField.fill(credentials.password);
        await this.loginButton.click();
    }

    async getErrorText(): Promise<string> {
        const text = await this.errorMessage.textContent();
        return text ?? '';
    }

    async isErrorVisible(): Promise<boolean> {
        return await this.errorMessage.isVisible();
    }

    async getPageHeading(): Promise<string> {
        const text = await this.pageHeading.textContent();
        return text ?? '';
    }
}