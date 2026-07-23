import { Page, Locator, expect } from '@playwright/test';


export class CartPage {
    private readonly page: Page;
    private readonly checkoutButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.checkoutButton = page.getByTestId('checkout');
    }

    async expectItemVisible(ItemName: string) {
        await expect(this.page.getByText(ItemName)).toBeVisible();
    }

    async removeItemFromCart(ItemId: string){
        await this.page.getByTestId(`remove-${ItemId}`).click();
    }

    async goToCheckout(){
        await this.checkoutButton.click();
    }
}