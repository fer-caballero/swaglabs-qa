import { test, expect } from '@playwright/test';

test.describe('Flujo de Compra en SauceDemo', () => {
    
    // ... (Aquí iría el código del HPF-001 y HPF-002 si los tienes en el mismo archivo) ...

    // =================================================================
    // CASO HPF-003: CONTINUAR COMPRANDO (USABILIDAD) - MÁXIMA ESTABILIDAD
    // =================================================================
    test('HPF-003: Debería permitir al usuario continuar comprando desde el carrito', async ({ page }) => {

        test.setTimeout(75000); // Timeout elevado para máxima estabilidad

        // GIVEN: El usuario ha iniciado sesión y ha agregado productos al carrito.
        await test.step('GIVEN: Iniciar Sesión y Añadir un producto', async () => {
            
            // 1. Navegar y Login
            await page.goto('https://www.saucedemo.com/v1/', { waitUntil: 'networkidle' });
            await page.locator('#user-name').fill('standard_user');
            await page.locator('#password').fill('secret_sauce');
            await page.locator('#login-button').click();
            
            // 2. Espera a que cargue el inventario y estabiliza la página
            await page.waitForURL('**/inventory.html');
            await page.waitForSelector('.inventory_item', { state: 'visible', timeout: 15000 }); 
            
            // 3. Agrega un producto: Sauce Labs Backpack (Usando Localización por Contenedor)
            const productName = 'Sauce Labs Backpack';
            const productContainer = page.locator('.inventory_item', { hasText: productName }); 
            const productButton = productContainer.locator('button:has-text("ADD TO CART")');

            await productContainer.scrollIntoViewIfNeeded({ timeout: 10000 });
            await productButton.click({ timeout: 10000 }); 
            
            // 4. Navega al carrito
            await page.locator('#shopping_cart_container').click();
            await page.waitForURL('**/cart.html');
            
            // Verificación: Carrito visible y contador en 1
            await expect(page.locator('.cart_list')).toBeVisible();
            await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
        });

        // WHEN: El usuario hace clic en el botón "Continue Shopping"
        await test.step('WHEN: Hace clic en "Continue Shopping"', async () => {
            
            // Localiza y hace clic en el botón "Continue Shopping" (es un link)
            await page.getByRole('link', { name: 'Continue Shopping' }).click();
        });

        // THEN: El sistema redirige al usuario de vuelta a la página del inventario.
        await test.step('THEN: Verificar la redirección al inventario', async () => {
            
            // 1. La URL debe ser la página de inventario
            await expect(page).toHaveURL('https://www.saucedemo.com/v1/inventory.html');
            
            // 2. El título de la página de productos debe ser visible (Verificación de contenido)
            await expect(page.locator('.product_label')).toHaveText('Products');
        });
    });
});