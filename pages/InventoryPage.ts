import { Page, Locator, expect } from '@playwright/test';
import { parsePrice } from '../utils/parsers';


export class InventoryPage {
    private readonly page: Page;
    private readonly cartBadge: Locator;
    private readonly cartLink: Locator;

    constructor(page: Page) {
        this.page = page;
        this.cartBadge = page.getByTestId('shopping-cart-badge');
        this.cartLink = page.getByTestId('shopping-cart-link');
    }

    async addItemToCart(itemTestId: string) {
        await this.page.getByTestId(`add-to-cart-${itemTestId}`).click();
    }

    async removeItemFromCart(itemTestId: string) {
        await this.page.getByTestId(`remove-${itemTestId}`).click();
    }

    async expectCartCount(expectedCount: string) {
        await expect(this.cartBadge).toHaveText(expectedCount);
    }

    async sortBy(option: string) {
        await this.page.getByTestId('product-sort-container').selectOption(option);
    }

    async getAllPrices(): Promise<number[]> {
        const priceText = await this.page.getByTestId('inventory-item-price').allTextContents()
        return priceText.map(parsePrice);
    }

    async getAllNames(): Promise<string[]> {
        return await this.page.getByTestId('inventory-item-name').allTextContents(); 
    }

    async goToCart() {
        await this.cartLink.click();
    }
}