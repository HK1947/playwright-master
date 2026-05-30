// pages/qaplayground/DashboardPage.ts
import { Page, Locator } from '@playwright/test';
import { BasePage } from '../BasePage';
import { BankAccount } from '../../types';

export class DashboardPage extends BasePage {
    // Navigation locators
    readonly accountsNav: Locator;
    readonly logoutButton: Locator;

    // Add account form locators
    readonly quickAddButton: Locator;
    readonly accountNameInput: Locator;
    readonly accountTypeSelect: Locator;
    readonly initialBalanceInput: Locator;
    readonly overdraftCheckbox: Locator;
    readonly saveAccountButton: Locator;

    // Dashboard content
    readonly dashboardHeading: Locator;

    constructor(page: Page) {
        super(page);
        this.accountsNav = page.getByTestId('nav-accounts');
        this.logoutButton = page.getByTestId('logout-button');
        this.quickAddButton = page.getByTestId('quick-add-account');
        this.accountNameInput = page.getByTestId('account-name-input');
        this.accountTypeSelect = page.getByTestId('account-type-select');
        this.initialBalanceInput = page.getByTestId('initial-balance-input');
        this.overdraftCheckbox = page.getByTestId('overdraft-checkbox');
        this.saveAccountButton = page.getByTestId('save-account-button');
        this.dashboardHeading = page.getByRole('heading').first();
    }

    async goToAccounts(): Promise<void> {
        await this.accountsNav.click();
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

    // Facade pattern — 6 steps behind 1 method
    async addAccount(accountDetails: BankAccount): Promise<void> {
        await this.quickAddButton.click();
        await this.accountNameInput.fill(accountDetails.accountName);
        await this.accountTypeSelect.click();
        await this.page.getByRole('option', { name: accountDetails.accountType }).click();
        await this.initialBalanceInput.fill(accountDetails.balance.toString());
        if (accountDetails.enableOverdraft) {
            await this.overdraftCheckbox.check();
        }
        await this.saveAccountButton.click();
    }

    async isDashboardVisible(): Promise<boolean> {
        return await this.quickAddButton.isVisible();
    }

    async getDashboardHeading(): Promise<string> {
        const text = await this.dashboardHeading.textContent();
        return text ?? '';
    }
}
