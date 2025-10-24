import { test as base } from '@playwright/test';
import type { Page } from '@playwright/test';
import { Login } from '../Pages/Login';

// 1. Definimos los tipos de nuestros nuevos fixtures
type LoginFixtures = {
  loginPage: Login;
  loggedInPage: Page; // Queremos un fixture que devuelva un objeto 'Page' ya logueado
};

// 2. Extendemos el "test" base con nuestros nuevos fixtures
export const test = base.extend<LoginFixtures>({

  // Fixture para instanciar el Page Object 'Login'
  // Depende del fixture 'page' integrado
  loginPage: async ({ page }, use) => {
    // Creamos la instancia y la entregamos al 'use'
    await use(new Login(page));
  },

  // Fixture para tener una página ya logueada
  // Depende de 'page' (integrado) y de nuestro 'loginPage' (arriba)
  loggedInPage: async ({ page, loginPage }, use) => {
    
    // --- FASE DE SETUP (Configuración) ---
    // Esto es lo que antes hacías en tus steps "Dado" y "Cuando"
    await page.goto('https://www.saucedemo.com/v1/index.html');
    await loginPage.fillUsername('standard_user');
    await loginPage.fillPassword('secret_sauce');
    await loginPage.clickLogin();

    // Importante: Esperar a que la página de destino cargue
    // Esto confirma que el login fue exitoso antes de pasar a la prueba
    await page.waitForURL('https://www.saucedemo.com/v1/inventory.html');

    // --- EJECUCIÓN DE LA PRUEBA ---
    // 'use()' pasa el control a la prueba.
    // Le pasamos el objeto 'page' que ya está autenticado.
    await use(page);

    // --- FASE DE TEARDOWN (Limpieza) ---
    // Opcional: Código que se ejecuta DESPUÉS de la prueba
    // (ej. hacer logout, limpiar cookies, etc.)
    // console.log('Prueba terminada, limpiando sesión...');
  },
});

// 3. Exportamos 'expect' para conveniencia
export { expect } from '@playwright/test';