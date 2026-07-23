import {test, expect} from '../fixtures/test-options';

test.beforeEach(async ({loginPage}) => {
    await loginPage.goto();
})

test('standard user logs in successfully', async ({ page, loginPage}) => {
    await loginPage.login(process.env.STANDARD_USER!, process.env.PASSWORD!);
    await expect(page).toHaveURL(/inventory\.html$/);
    await expect(page.getByText('Products')).toBeVisible();
});

test('locked out user sees the correct error', async ({loginPage}) => {
    await loginPage.login(process.env.LOCKED_OUT_USER!, process.env.PASSWORD!);
    await loginPage.expectErrorMessage(/locked out/i);
});

test('invalid password shows credentials error', async ({loginPage}) => {
    await loginPage.login(process.env.STANDARD_USER!, 'wrong password');
    await loginPage.expectErrorMessage(/do not match/i);
});

test('missing username shows required error', async ({loginPage}) => {
    await loginPage.login('', process.env.PASSWORD!);
    await loginPage.expectErrorMessage(/Username is required/i);
});

test('missing password shows required error', async ({loginPage}) => {
    await loginPage.login(process.env.STANDARD_USER!, '');
    await loginPage.expectErrorMessage(/Password is required/i);
});