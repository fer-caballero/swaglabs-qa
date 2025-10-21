import { test, expect } from '@playwright/test';

test.describe('Flujo de Compra en SauceDemo', () => {

    // Datos de ejemplo para el checkout
    const USER_DATA = {
        firstName: 'Tester',
        lastName: 'Playwright',
        zipCode: '5000'
    };

    // =================================================================
    // CASO HPF-001: COMPRA EXITOSA (MÁXIMA ESTABILIDAD POR CONTENEDOR)
    // =================================================================
    test('HPF-001: Compra exitosa de dos productos hasta la confirmación de la orden', async ({ page }) => {

        test.setTimeout(75000); // Timeout global de 75 segundos

        await test.step('GIVEN: Iniciar Sesión exitosamente', async () => {
            // Navegar y esperar la carga completa de la página de login
            await page.goto('https://www.saucedemo.com/v1/', { waitUntil: 'networkidle' });

            // Login directo
            await page.locator('#user-name').fill('standard_user');
            await page.locator('#password').fill('secret_sauce');
            await page.locator('#login-button').click();

            // Espera CLAVE: Esperamos la URL de inventario y el elemento principal del inventario
            await page.waitForURL('**/inventory.html');
            await page.waitForSelector('.inventory_item', { state: 'visible', timeout: 15000 });
        });

        await test.step('WHEN: Agregar productos y navegar al Checkout', async () => {
            
            // --- Interacciones en Inventario (TODAS USAN LOCALIZACIÓN POR CONTENEDOR) ---
            
            // 1. Agregar Producto 1: Sauce Labs Bolt T-Shirt
            const tShirtName = 'Sauce Labs Bolt T-Shirt';
            const tShirtContainer = page.locator('.inventory_item', { hasText: tShirtName }); 
            const tShirtButton = tShirtContainer.locator('button:has-text("ADD TO CART")');
            
            await tShirtContainer.scrollIntoViewIfNeeded({ timeout: 10000 });
            await tShirtButton.click({ timeout: 10000 });

            // 2. Agregar Producto 2: Sauce Labs Fleece Jacket
            const jacketName = 'Sauce Labs Fleece Jacket';
            const jacketContainer = page.locator('.inventory_item', { hasText: jacketName }); 
            const jacketButton = jacketContainer.locator('button:has-text("ADD TO CART")');
            
            await jacketContainer.scrollIntoViewIfNeeded({ timeout: 10000 }); 
            await jacketButton.click({ timeout: 10000 });
            
            // 3. Verificar contador
            await expect(page.locator('.shopping_cart_badge')).toHaveText('2');

            // --- Navegación y Checkout ---

            // 4. Navega al carrito
            await page.locator('#shopping_cart_container').click();

            // 5. Checkout (navegar al paso 1)
            await page.waitForURL('**/cart.html');
            await page.getByRole('link', { name: 'CHECKOUT' }).click();
            await page.waitForURL('**/checkout-step-one.html');

            // 6. Completa el formulario de envío
            await page.locator('#first-name').fill(USER_DATA.firstName);
            await page.locator('#last-name').fill(USER_DATA.lastName);
            await page.locator('#postal-code').fill(USER_DATA.zipCode);

            // 7. Clic en Continuar (navegar al paso 2)
            await page.locator('input[type="submit"]').click();
            await page.waitForURL('**/checkout-step-two.html');
            
            // 8. Clic en Finalizar
            await page.locator('.btn_action.cart_button').click();
        });

        await test.step('THEN: Verificar la confirmación de la compra', async () => {
            // 1. Verificar la URL final
            await expect(page).toHaveURL(/checkout-complete.html/);

            // 2. Verificar el mensaje de confirmación
            await expect(page.locator('.complete-header')).toHaveText('THANK YOU FOR YOUR ORDER');
        });
    });
});