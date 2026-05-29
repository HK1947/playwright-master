// pages/qaplayground/TransactionsPage.ts
import { Page, Locator } from '@playwright/test';
import { BasePage } from '../BasePage';

export class TransactionsPage extends BasePage {
    readonly filterAccountSelect: Locator;
    readonly filterTransactionTypeSelect: Locator;
    readonly dateFromInput: Locator;
    readonly dateToInput: Locator;
    readonly applyFiltersButton: Locator;
    readonly resetFiltersButton: Locator;
    readonly backButton: Locator;

    constructor(page: Page) {
        super(page);
        this.filterAccountSelect = page.getByTestId('filter-account-select');
        this.filterTransactionTypeSelect = page.getByTestId('filter-transaction-type-select');
        this.dateFromInput = page.getByTestId('date-from-input');
        this.dateToInput = page.getByTestId('date-to-input');
        this.applyFiltersButton = page.getByTestId('apply-filters-button');
        this.resetFiltersButton = page.getByTestId('reset-filters-button');
        this.backButton = page.getByTestId('back-button');
    }

    async goTo(): Promise<void> {
        await this.page.getByTestId('nav-transactions').click();
        await this.waitForPageLoad();
    }

    async filterByAccount(accountName: string): Promise<void> {
        await this.filterAccountSelect.click();
        await this.page.getByRole('option', { name: accountName }).click();
    }

    async filterByType(transactionType: string): Promise<void> {
        await this.filterTransactionTypeSelect.click();
        await this.page.getByRole('option', { name: transactionType }).click();
    }

    async selectFromDate(dateLabel: string): Promise<void> {
        await this.dateFromInput.click();
        await this.page.getByRole('button', { name: dateLabel }).click();
    }

    async selectToDate(dateLabel: string): Promise<void> {
        await this.dateToInput.click();
        await this.page.getByRole('button', { name: dateLabel }).click();
    }

    async applyFilters(): Promise<void> {
        await this.applyFiltersButton.click();
    }

    async resetFilters(): Promise<void> {
        await this.resetFiltersButton.click();
    }

    async filterTransactions(
        accountName?: string,
        transactionType?: string,
    ): Promise<void> {
        if (accountName) {
            await this.filterByAccount(accountName);
        }
        if (transactionType) {
            await this.filterByType(transactionType);
        }
        await this.applyFilters();
    }

    async goBack(): Promise<void> {
        await this.backButton.click();
    }

    async isTransactionsPageVisible(): Promise<boolean> {
        return await this.applyFiltersButton.isVisible();
    }
}