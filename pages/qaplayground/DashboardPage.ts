// pages/qaplayground/DashboardPage.ts
import { Page, Locator } from '@playwright/test';
import { BasePage } from '../BasePage';
import { BankAccount } from '../../types';
import { NavBar } from '../components/NavBar';

export class DashboardPage extends BasePage {
    // COMPOSITION — DashboardPage HAS a NavBar (not IS a NavBar)
    readonly navBar: NavBar;

    // Dashboard-specific locators
    readonly quickAddButton: Locator;
    readonly accountNameInput: Locator;
    readonly accountTypeSelect: Locator;
    readonly initialBalanceInput: Locator;
    readonly overdraftCheckbox: Locator;
    readonly saveAccountButton: Locator;
    readonly dashboardHeading: Locator;

    constructor(page: Page) {
        super(page);
        // NavBar composed into DashboardPage
        this.navBar = new NavBar(page);

        this.quickAddButton = page.getByTestId('quick-add-account');
        this.accountNameInput = page.getByTestId('account-name-input');
        this.accountTypeSelect = page.getByTestId('account-type-select');
        this.initialBalanceInput = page.getByTestId('initial-balance-input');
        this.overdraftCheckbox = page.getByTestId('overdraft-checkbox');
        this.saveAccountButton = page.getByTestId('save-account-button');
        this.dashboardHeading = page.getByRole('heading').first();
    }

    // Navigation now goes THROUGH navBar
    async goToAccounts(): Promise<void> {
        await this.navBar.goToAccounts();
    }

    async logout(confirm: boolean = true): Promise<void> {
        await this.navBar.logout(confirm);
    }

    async addAccount(accountDetails: BankAccount): Promise<void> {
        await this.quickAddButton.click();
        await this.accountNameInput.fill(accountDetails.accountName);
        await this.accountTypeSelect.click();
        await this.page
            .getByRole('listbox')
            .getByRole('option', { name: accountDetails.accountType })
            .click();
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
