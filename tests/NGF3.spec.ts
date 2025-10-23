import { test, expect } from '@playwright/test';

test.describe('Flujo de Checkout (Casos Negativos)', () => {

    // Datos de ejemplo para el checkout
    const USER_DATA = {
        firstName: 'Tester',
        lastName: 'Playwright',
        zipCode: '5000'
    };
    
    // =================================================================
    // CASO NGF-003: CANCELAR EL PROCESO DE CHECKOUT EN EL PASO 2 - CORREGIDO
    // =================================================================
    test('NGF-003: Debería cancelar el checkout en el resumen y volver al inventario con productos en el carrito', async ({ page }) => {

        test.setTimeout(75000); 
        const productName = 'Sauce Labs Backpack';

        await test.step('GIVEN: El usuario ha llegado a la página de Resumen (checkout-step-two.html)', async () => {
            
            // Flujo de preparación (login y agregar producto estable)
            await page.goto('https://www.saucedemo.com/v1/', { waitUntil: 'networkidle' });
            await page.locator('#user-name').fill('standard_user');
            await page.locator('#password').fill('secret_sauce');
            await page.locator('#login-button').click();
            
            await page.waitForURL('**/inventory.html');
            await page.waitForSelector('.inventory_item', { state: 'visible', timeout: 15000 }); 
            const productContainer = page.locator('.inventory_item', { hasText: productName }); 
            const productButton = productContainer.locator('button:has-text("ADD TO CART")');
            await productContainer.scrollIntoViewIfNeeded({ timeout: 10000 });
            await productButton.click({ timeout: 10000 }); 
            
            // Navegar al Checkout (Paso 1)
            await page.locator('#shopping_cart_container').click();
            await page.waitForURL('**/cart.html');
            await page.getByRole('link', { name: 'CHECKOUT' }).click();
            await page.waitForURL('**/checkout-step-one.html');
            
            // Completar datos de envío y avanzar a Resumen (Paso 2)
            await page.locator('#first-name').fill(USER_DATA.firstName);
            await page.locator('#last-name').fill(USER_DATA.lastName);
            await page.locator('#postal-code').fill(USER_DATA.zipCode);
            await page.locator('input[type="submit"]').click();
            
            // Verificar que estamos en la página de resumen
            await page.waitForURL('**/checkout-step-two.html');
        });

        await test.step('WHEN: Hace clic en el botón "Cancel"', async () => {
            
            // Clic en el botón Cancelar
            await page.getByRole('link', { name: 'CANCEL' }).click({ timeout: 10000 });
        });

        await test.step('THEN: El sistema redirige a la página del INVENTARIO y el producto se mantiene en el carrito', async () => {
            
            // 1. **VERIFICACIÓN CORREGIDA:** Verifica la redirección a la URL del INVENTARIO
            await expect(page).toHaveURL('https://www.saucedemo.com/v1/inventory.html');
            
            // 2. Verifica que el contador del carrito siga siendo 1
            await expect(page.locator('.shopping_cart_badge')).toHaveText('1');

            // 3. Verifica que el botón para el producto sea 'REMOVE' (indicando que sigue en el carrito)
            const productContainer = page.locator('.inventory_item', { hasText: productName }); 
            const removeButton = productContainer.locator('button:has-text("REMOVE")');
            await expect(removeButton).toBeVisible();
        });
    });
});