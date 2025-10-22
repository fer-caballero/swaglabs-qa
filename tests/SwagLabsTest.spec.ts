import { test, expect } from '@playwright/test';
import{ Login } from './Pages/Login';

test('regression', async ({ page }) => {
  const loginPage = new Login(page);
  await test.step('Dado que me encuentro en la página de Login de Swaglabs', async () => {
  await page.goto('https://www.saucedemo.com/v1/index.html');
  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle("Swag Labs");  
  });
  
await test.step('Cuando ingreso usario: standard_user y contraseña: secret_sauce hago click en login', async () => {
  expect(loginPage.usernameTxt).toBeVisible();
  await loginPage.fillUsername('standard_user');
  expect(loginPage.usernameTxt).toHaveValue('standard_user');
  expect(loginPage.passwordTxt).toBeVisible();
  await loginPage.fillPassword('secret_sauce');
  expect(loginPage.passwordTxt).toHaveValue('secret_sauce');
  expect(loginPage.loginBtn).toBeVisible();
  await loginPage.clickLogin();
});

  await test.step('Entonces verifico Ingreso al Hompage de Swaglabs', async () => {});
});