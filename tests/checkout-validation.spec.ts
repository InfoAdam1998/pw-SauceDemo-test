import { test, expect } from '../fixtures/test-options';   // <- our file, NOT @playwright/test

test.beforeEach(async ({ page, inventoryPage, cartPage }) => {
    await page.goto('/inventory.html');
    await inventoryPage.addItemToCart('sauce-labs-backpack');
    await inventoryPage.expectCartCount('1');
    await inventoryPage.goToCart();
    await cartPage.expectItemVisible('Sauce Labs Backpack');
    await cartPage.goToCheckout();
})


test('checkout shows error when first name is missing', async ({ page, checkoutPage }) => {
    await expect(page).toHaveURL(/checkout-step-one\.html$/);
    await checkoutPage.fillDetails('','B','12345');
    await checkoutPage.errorMessageContains('Error: First Name is required');
});


test('checkout shows error when last name is missing', async ({ page, checkoutPage }) => {
    await expect(page).toHaveURL(/checkout-step-one\.html$/);
    await checkoutPage.fillDetails('Adam','','12345');
    await checkoutPage.errorMessageContains('Error: Last Name is required');
});


test('checkout shows error when postal code is missing', async ({ page, checkoutPage }) => {
    await expect(page).toHaveURL(/checkout-step-one\.html$/);
    await checkoutPage.fillDetails('Adam','B','');
    await checkoutPage.errorMessageContains('Error: Postal Code is required');
});