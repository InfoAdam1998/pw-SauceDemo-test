import { test, expect } from '../fixtures/test-options';   // <- our file, NOT @playwright/test


const users = ['standard_user', 'problem_user', 'performance_glitch_user'];

for (const username of users) {
    test(`login as ${username}`, async ({ page, loginPage, inventoryPage }) => {
        if (username === 'problem_user') {
            test.fail();
        }
        await loginPage.goto();
        await loginPage.login(username, process.env.PASSWORD!);
        await expect(page).toHaveURL(/inventory\.html$/);

        await inventoryPage.sortBy('lohi');
        const lohiPrices = await inventoryPage.getAllPrices()
        expect(lohiPrices).toEqual([...lohiPrices].sort((a, b) => a - b));
    })
}