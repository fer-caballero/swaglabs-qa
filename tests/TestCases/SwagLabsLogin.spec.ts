import { test, expect } from '@playwright/test';
import { Login } from '../Pages/Login';
import { Inventory } from '../Pages/Inventory';

let loginPage: Login;
let inventoryPage: Inventory;

test.beforeEach(async ({ page }) => {
  loginPage = new Login(page);
  inventoryPage = new Inventory(page);
});

test('HPF-001 - Login Exitoso', async ({ page }) => {

  await test.step('Dado que me encuentro en la página de Login de Swaglabs', async () => {
    await page.goto('https://www.saucedemo.com/v1/index.html');
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

  await test.step('Entonces verifico Ingreso al Hompage de Swaglabs', async () => {
    await page.waitForURL('https://www.saucedemo.com/v1/inventory.html');
    await expect(inventoryPage.title).toContainText('Products');
  });
});

test('UPF-002 - Usuario bloqueado', async ({ page }) => {
  await test.step('Dado que me encuentro en la página de Login de Swaglabs', async () => {
    await page.goto('https://www.saucedemo.com/v1/index.html');
    await expect(page).toHaveTitle("Swag Labs");
  });

  await test.step('Cuando ingreso usario: locked_out_user y contraseña: secret_sauce hago click en login', async () => {
    expect(loginPage.usernameTxt).toBeVisible();
    await loginPage.fillUsername('locked_out_user');
    expect(loginPage.usernameTxt).toHaveValue('locked_out_user');
    expect(loginPage.passwordTxt).toBeVisible();
    await loginPage.fillPassword('secret_sauce');
    expect(loginPage.passwordTxt).toHaveValue('secret_sauce');
    expect(loginPage.loginBtn).toBeVisible();
    await loginPage.clickLogin();
  });

  await test.step('Entonces usuario recibe mensaje "Epic sadface: Sorry, this user has been locked out."', async () => {
    await expect(loginPage.errorMsg).toContainText('Epic sadface: Sorry, this user has been locked out.');
  });
});

test('HPF-003 - Login Usuario con problemas ', async ({ page }) => {

  await test.step('Dado que me encuentro en la página de Login de Swaglabs', async () => {
    await page.goto('https://www.saucedemo.com/v1/index.html');
    await expect(page).toHaveTitle("Swag Labs");
  });

  await test.step('Cuando ingreso usario: problem_user y contraseña: secret_sauce hago click en login', async () => {
    expect(loginPage.usernameTxt).toBeVisible();
    await loginPage.fillUsername('problem_user');
    expect(loginPage.usernameTxt).toHaveValue('problem_user');
    expect(loginPage.passwordTxt).toBeVisible();
    await loginPage.fillPassword('secret_sauce');
    expect(loginPage.passwordTxt).toHaveValue('secret_sauce');
    expect(loginPage.loginBtn).toBeVisible();
    await loginPage.clickLogin();
  });

  await test.step('Entonces verifico Ingreso al Hompage de Swaglabs', async () => {
    await page.waitForURL('https://www.saucedemo.com/v1/inventory.html');
    await expect(inventoryPage.title).toContainText('Products');
  });
});

test('UPF-004 - Invalid Login', async ({ page }) => {
  await test.step('Dado que me encuentro en la página de Login de Swaglabs', async () => {
    await page.goto('https://www.saucedemo.com/v1/index.html');
    await expect(page).toHaveTitle("Swag Labs");
  });

  await test.step('Cuando hago click en login', async () => {
    expect(loginPage.loginBtn).toBeVisible();
    await loginPage.clickLogin();
  });

  await test.step('Entonces usuario recibe mensaje "Epic sadface: Username is required"', async () => {
    await expect(loginPage.errorMsg).toContainText('Epic sadface: Username is required');
  });
});

test('UPF-005 - Invalid Login', async ({ page }) => {
  await test.step('Dado que me encuentro en la página de Login de Swaglabs', async () => {
    await page.goto('https://www.saucedemo.com/v1/index.html');
    await expect(page).toHaveTitle("Swag Labs");
  });

  await test.step('Cuando ingreso usuario y hago click en login', async () => {
    expect(loginPage.usernameTxt).toBeVisible();
    await loginPage.fillUsername('standard_user');
    expect(loginPage.usernameTxt).toHaveValue('standard_user');
    expect(loginPage.loginBtn).toBeVisible();
    await loginPage.clickLogin();
  });

  await test.step('Entonces usuario recibe mensaje "Epic sadface: Password is required"', async () => {
    await expect(loginPage.errorMsg).toContainText('Epic sadface: Password is required');
  });
});

test('UPF-006 - Invalid Login', async ({ page }) => {
  await test.step('Dado que me encuentro en la página de Login de Swaglabs', async () => {
    await page.goto('https://www.saucedemo.com/v1/index.html');
    await expect(page).toHaveTitle("Swag Labs");
  });

  await test.step('Cuando ingreso usuario y hago click en login', async () => {
    expect(loginPage.usernameTxt).toBeVisible();
    await loginPage.fillUsername('test_user');
    expect(loginPage.usernameTxt).toHaveValue('test_user');
    expect(loginPage.passwordTxt).toBeVisible();
    await loginPage.fillPassword('sauce');
    expect(loginPage.passwordTxt).toHaveValue('sauce');
    expect(loginPage.loginBtn).toBeVisible();
    await loginPage.clickLogin();
  });

  await test.step('Entonces usuario recibe mensaje "Epic sadface: Username and password do not match any user in this service"', async () => {
    await expect(loginPage.errorMsg).toContainText('Epic sadface: Username and password do not match any user in this service');
  });
});
