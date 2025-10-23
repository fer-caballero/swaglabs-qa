import { test, expect } from '@playwright/test';

test.describe('Flujo de Checkout (Casos Negativos)', () => {

    // Datos de ejemplo para el checkout
    const USER_DATA = {
        firstName: 'Tester',
        lastName: 'Playwright',
        zipCode: '5000'
    };
    
    // =================================================================
    // CASO NGF-001: CAMPO OBLIGATORIO VACÍO (FIRST NAME) - ESTABLE
    // =================================================================
    test('NGF-001: Debería mostrar error si el campo First Name se deja vacío en Checkout', async ({ page }) => {

        test.setTimeout(75000); // Timeout elevado para máxima estabilidad

        await test.step('GIVEN: El usuario ha iniciado el proceso de Checkout', async () => {
            
            // 1. Navegar y Login
            await page.goto('https://www.saucedemo.com/v1/', { waitUntil: 'networkidle' });
            await page.locator('#user-name').fill('standard_user');
            await page.locator('#password').fill('secret_sauce');
            await page.locator('#login-button').click();
            
            // 2. Esperar inventario y agregar un producto (Usando la solución de estabilidad)
            await page.waitForURL('**/inventory.html');
            await page.waitForSelector('.inventory_item', { state: 'visible', timeout: 15000 }); 
            
            const productName = 'Sauce Labs Backpack';
            // Localización por contenedor del producto
            const productContainer = page.locator('.inventory_item', { hasText: productName }); 
            // Botón dentro del contenedor
            const productButton = productContainer.locator('button:has-text("ADD TO CART")');

            // Scroll y clic con timeout
            await productContainer.scrollIntoViewIfNeeded({ timeout: 10000 });
            await productButton.click({ timeout: 10000 }); 
            
            // 3. Navega y Inicia Checkout (llega a checkout-step-one.html)
            await page.locator('#shopping_cart_container').click();
            await page.waitForURL('**/cart.html');
            await page.getByRole('link', { name: 'CHECKOUT' }).click();
            await page.waitForURL('**/checkout-step-one.html');
        });

        await test.step('WHEN: Deja First Name vacío, completa el resto y hace clic en CONTINUE', async () => {
            
            // 1. Deja el campo First Name VACÍO
            // 2. Completa los otros campos obligatorios
            await page.locator('#last-name').fill(USER_DATA.lastName);
            await page.locator('#postal-code').fill(USER_DATA.zipCode);

            // 3. Hace clic en CONTINUE
            await page.locator('input[type="submit"]').click();
        });

        await test.step('THEN: El sistema muestra el mensaje de error "Error: First Name is required"', async () => {
            
            // 1. Localiza el contenedor del mensaje de error
            const errorMessage = page.locator('h3[data-test="error"]');
            
            // 2. Verifica que el mensaje de error esté visible
            await expect(errorMessage).toBeVisible();
            
            // 3. Verifica el texto exacto del mensaje de error
            await expect(errorMessage).toHaveText('Error: First Name is required');

            // 4. Opcional: Verifica que la URL NO haya cambiado (sigue en step-one)
            await expect(page).toHaveURL(/checkout-step-one\.html/);
        });
    });
});