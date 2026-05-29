// pages/BasePage.ts
import { Page, Locator } from '@playwright/test';
//             ^^^^^^^ ADD — needed for child class readonly types

export class BasePage {

    constructor(protected page: Page) { }

    async getTitle(): Promise<string> {
        return await this.page.title();
    }

    getCurrentURL(): string {
        return this.page.url();
    }

    async waitForPageLoad(): Promise<void> {
        await this.page.waitForLoadState('domcontentloaded');
    }

    async navigate(path: string): Promise<void> {
        await this.page.goto(path);
        await this.waitForPageLoad();
    }

    async takeScreenshot(fileName: string): Promise<void> {
        await this.page.screenshot({
            path: `screenshots/${fileName}.png`,
            fullPage: true,
        });
    }
}