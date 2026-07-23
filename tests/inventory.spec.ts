import { test, expect } from '../fixtures/test-options';   // <- our file, NOT @playwright/test


test('adding and removing items updates the badge and button', async ({ page, inventoryPage }) => {
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
});

test('removing an item from inside the cart empties it', async ({ page, inventoryPage, cartPage, loggedInPage }) => {
    // 3b — next
    await page.goto('/inventory.html');
    await expect(page).toHaveURL(/inventory\.html$/);

    await inventoryPage.addItemToCart('sauce-labs-backpack');
    await inventoryPage.expectCartCount('1');
    await expect(page.getByTestId('remove-sauce-labs-backpack')).toBeVisible();

    await inventoryPage.goToCart();
    await expect(page).toHaveURL(/cart\.html$/);
    await cartPage.expectItemVisible('Sauce Labs Backpack');

    await cartPage.removeItemFromCart('sauce-labs-backpack');
    await expect(page.getByText('Sauce Labs Backpack')).not.toBeVisible();
    await expect(page.getByTestId('shopping-cart-badge')).not.toBeVisible();
});

test('items sort correctly by price and name', async ({ page, inventoryPage, loggedInPage }) => {
    // 3c
    await page.goto('/inventory.html');
    await expect(page).toHaveURL(/inventory\.html$/);
    
    await inventoryPage.sortBy('lohi');
    const lohiPrices = await inventoryPage.getAllPrices()
    expect(lohiPrices).toEqual([...lohiPrices].sort((a, b) => a - b));

    // price high to low
    await inventoryPage.sortBy('hilo');
    const hiloPrices = await inventoryPage.getAllPrices()
    expect(hiloPrices).toEqual([...hiloPrices].sort((a, b) => b - a));

    // name A to Z
    await inventoryPage.sortBy('az');
    const azNameTexts = await inventoryPage.getAllNames()
    expect(azNameTexts).toEqual([...azNameTexts].sort());

});