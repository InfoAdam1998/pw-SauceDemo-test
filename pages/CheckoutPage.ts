import { Page, Locator, expect } from '@playwright/test';
import {parsePrice} from '../utils/parsers';

export class CheckoutPage {
    private readonly page: Page;
    private readonly firstName: Locator;
    private readonly lastName: Locator;
    private readonly postalCode: Locator;
    private readonly continueButton: Locator;
    private readonly finishButton: Locator;
    private readonly subtotalLabel: Locator;
    private readonly taxLabel: Locator;
    private readonly totalLabel: Locator;
    private readonly completeHeader: Locator;
    private readonly errorMessage: Locator;

    constructor(page: Page) {
        this.page = page;
        this.firstName = page.getByTestId('firstName');
        this.lastName = page.getByTestId('lastName');
        this.postalCode = page.getByTestId('postalCode');
        this.continueButton = page.getByTestId('continue');
        this.finishButton = page.getByTestId('finish');
        this.subtotalLabel = page.getByTestId('subtotal-label');
        this.taxLabel = page.getByTestId('tax-label');
        this.totalLabel = page.getByTestId('total-label');
        this.completeHeader = page.getByTestId('complete-header');
        this.errorMessage = page.getByTestId('error');
    }

    async fillDetails(firstName: string, lastName: string, postalCode: string) {
        await this.firstName.fill(firstName);
        await this.lastName.fill(lastName);
        await this.postalCode.fill(postalCode);
        await this.continueButton.click();
    }

    private async parseMoney(locator: Locator): Promise<number> {
        const text = await locator.textContent();
        return parsePrice(text!);
    }

    async expectTotalAddUp() {
        const itemTotal = await this.parseMoney(this.subtotalLabel);
        const tax = await this.parseMoney(this.taxLabel);
        const total = await this.parseMoney(this.totalLabel);
        expect(itemTotal + tax).toBeCloseTo(total, 2);
    }

    async finish() {
        await this.finishButton.click();
    }

    async errorMessageContains(expectedText: string) {
        await expect(this.errorMessage).toContainText(expectedText);
    }

    async expectOrderComplete() {
        await expect(this.completeHeader).toContainText('Thank you for your order!');
    }
}