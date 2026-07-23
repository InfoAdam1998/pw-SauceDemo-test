import { test, expect } from '../fixtures/test-options';   // <- our file, NOT @playwright/test


test('standard user completes a purchase', async ({ page, inventoryPage, cartPage, checkoutPage }) => {
    await page.goto('/inventory.html');
    await expect(page).toHaveURL(/inventory\.html$/);

    // Add backpack and check cart count is 1
    await inventoryPage.addItemToCart('sauce-labs-backpack');
    await inventoryPage.expectCartCount('1');
    await expect(page.getByTestId('remove-sauce-labs-backpack')).toBeVisible();

    // Add bike light and check cart count is 2
    await inventoryPage.addItemToCart('sauce-labs-bike-light');
    await inventoryPage.expectCartCount('2');
    await expect(page.getByTestId('remove-sauce-labs-bike-light')).toBeVisible();

    // Remove bike light and check cart count is 1
    await inventoryPage.removeItemFromCart('sauce-labs-bike-light')
    await expect(page.getByTestId('add-to-cart-sauce-labs-bike-light')).toBeVisible();
    await inventoryPage.expectCartCount('1');

    await inventoryPage.goToCart();
    await expect(page).toHaveURL(/cart\.html$/);

    await cartPage.expectItemVisible('Sauce Labs Backpack');
    await cartPage.goToCheckout();
    await expect(page).toHaveURL(/checkout-step-one\.html$/);

    await checkoutPage.fillDetails('Eva', 'B', '12345');
    await expect(page).toHaveURL(/checkout-step-two\.html$/);

    await checkoutPage.expectTotalAddUp();

    await checkoutPage.finish();
    await expect(page).toHaveURL(/checkout-complete\.html$/);
    await checkoutPage.expectOrderComplete();
});