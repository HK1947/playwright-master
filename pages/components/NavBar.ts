// pages/components/NavBar.ts

// DESIGN PATTERN: Component Object
// NavBar appears on EVERY page after login
// Instead of duplicating locators in 3 page objects → ONE component

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
