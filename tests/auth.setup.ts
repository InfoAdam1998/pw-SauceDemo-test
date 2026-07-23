import {test as setup} from '@playwright/test';

const authFile = '.auth/user.json';

setup('setup auth', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('username').fill(process.env.STANDARD_USER!);
    await page.getByTestId('password').fill(process.env.PASSWORD!);
    await page.getByTestId('login-button').click();
    await page.waitForURL(/inventory\.html$/);

    await page.context().storageState({ path: authFile });
})