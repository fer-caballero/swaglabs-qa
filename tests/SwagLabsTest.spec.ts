import { test, expect } from '@playwright/test';
import{ Login } from './Pages/Login';


test('has title', async ({ page }) => {

  const loginPage = new Login(page);

  await page.goto('https://www.saucedemo.com/v1/index.html');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle("Swag Labs");


  await test.step('Rellenar usuario', async () => {
    expect(loginPage.usernameTxt).toBeVisible();
    await loginPage.fillUsername('standard_user');
    expect(loginPage.usernameTxt).toHaveValue('standard_user');
  })
  
  await test.step('Rellenar contraseña', async () => {
    expect(loginPage.passwordTxt).toBeVisible();
    await loginPage.fillPassword('secret_sauce');
    expect(loginPage.passwordTxt).toHaveValue('secret_sauce');
  })
  
  
  await test.step('Click en boton login', async () => {
    expect(loginPage.loginBtn).toBeVisible();
    await loginPage.clickLogin();
  })
});




