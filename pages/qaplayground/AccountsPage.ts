// pages/qaplayground/AccountsPage.ts
import { Page, Locator } from '@playwright/test';
import { BasePage } from '../BasePage';

export class AccountsPage extends BasePage {
    readonly searchInput: Locator;
    readonly filterTypeSelect: Locator;
    readonly sortBySelect: Locator;
    readonly resetFiltersButton: Locator;

    constructor(page: Page) {
        super(page);
        this.searchInput = page.getByTestId('search-input');
        this.filterTypeSelect = page.getByTestId('filter-type-select');
        this.sortBySelect = page.getByTestId('sort-by-select');
        this.resetFiltersButton = page.getByTestId('reset-filters-button');
    }

    async goTo(): Promise<void> {
        await this.page.getByTestId('nav-accounts').click();
        await this.waitForPageLoad();
    }

    async searchAccount(searchText: string): Promise<void> {
        await this.searchInput.fill(searchText);
    }

    async clearSearch(): Promise<void> {
        await this.searchInput.fill('');
    }

    async filterByType(accountType: string): Promise<void> {
        await this.filterTypeSelect.click();
        await this.page.getByRole('option', { name: accountType }).click();
    }

    async sortBy(sortOption: string): Promise<void> {
        await this.sortBySelect.click();
        await this.page.getByRole('option', { name: sortOption }).click();
    }

    async resetFilters(): Promise<void> {
        await this.resetFiltersButton.click();
    }

    async isAccountsPageVisible(): Promise<boolean> {
        return await this.searchInput.isVisible();
    }
}
