import { test, expect } from '@playwright/test';

test.describe('Flujo de Checkout (Casos Negativos)', () => {

    // Datos de ejemplo para el checkout
    const USER_DATA = {
        firstName: 'Tester',
        // lastName: 'Playwright', -> Este campo se omite en el WHEN para probar el error
        zipCode: '5000'
    };
    
    // =================================================================
    // CASO NGF-005: CAMPO LAST NAME VACÍO
    // =================================================================
    test('NGF-005: Debería mostrar error si el campo Last Name se deja vacío en Checkout', async ({ page }) => {

        test.setTimeout(75000); 
        const productName = 'Sauce Labs Backpack';

        await test.step('GIVEN: El usuario ha iniciado el proceso de Checkout (checkout-step-one.html)', async () => {
            
            // 1. Navegar, Login y Agregar producto (flujo de preparación estable)
            await page.goto('https://www.saucedemo.com/v1/', { waitUntil: 'networkidle' });
            await page.locator('#user-name').fill('standard_user');
            await page.locator('#password').fill('secret_sauce');
            await page.locator('#login-button').click();
            
            // Esperar inventario y agregar un producto (solución de estabilidad por contenedor)
            await page.waitForURL('**/inventory.html');
            await page.waitForSelector('.inventory_item', { state: 'visible', timeout: 15000 }); 
            const productContainer = page.locator('.inventory_item', { hasText: productName }); 
            const productButton = productContainer.locator('button:has-text("ADD TO CART")');
            await productContainer.scrollIntoViewIfNeeded({ timeout: 10000 });
            await productButton.click({ timeout: 10000 }); 
            
            // 2. Navegar al Checkout (llega a checkout-step-one.html)
            await page.locator('#shopping_cart_container').click();
            await page.waitForURL('**/cart.html');
            await page.getByRole('link', { name: 'CHECKOUT' }).click();
            await page.waitForURL('**/checkout-step-one.html');
        });

        await test.step('WHEN: Deja Last Name vacío, completa el resto y hace clic en CONTINUE', async () => {
            
            // 1. Completa First Name y Zip Code con datos válidos
            await page.locator('#first-name').fill(USER_DATA.firstName);
            await page.locator('#postal-code').fill(USER_DATA.zipCode);
            // 2. Deja el campo Last Name VACÍO
            
            // 3. Hace clic en CONTINUE
            await page.locator('input[type="submit"]').click();
        });

        await test.step('THEN: El sistema muestra el mensaje de error "Error: Last Name is required"', async () => {
            
            // 1. Localiza el contenedor del mensaje de error (rojo)
            const errorMessage = page.locator('h3[data-test="error"]');
            
            // 2. Verifica que el mensaje de error esté visible
            await expect(errorMessage).toBeVisible();
            
            // 3. Verifica el texto exacto del mensaje de error
            await expect(errorMessage).toHaveText('Error: Last Name is required');

            // 4. Verifica que la URL NO haya cambiado (sigue en step-one)
            await expect(page).toHaveURL(/checkout-step-one\.html/);
        });
    });
});