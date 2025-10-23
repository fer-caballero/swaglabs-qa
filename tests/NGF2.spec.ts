import { test, expect } from '@playwright/test';

test.describe('Flujo de Checkout (Casos Negativos)', () => {

    // =================================================================
    // CASO NGF-002: CHECKOUT CON CARRITO VACÍO
    // =================================================================
    test('NGF-002: Debería impedir el Checkout si el carrito está vacío', async ({ page }) => {

        test.setTimeout(75000); 

        await test.step('GIVEN: El usuario ha iniciado sesión pero su carrito está vacío', async () => {
            
            // 1. Navegar y Login
            await page.goto('https://www.saucedemo.com/v1/', { waitUntil: 'networkidle' });
            await page.locator('#user-name').fill('standard_user');
            await page.locator('#password').fill('secret_sauce');
            await page.locator('#login-button').click();
            
            // 2. Esperar inventario (El carrito comienza vacío tras el login)
            await page.waitForURL('**/inventory.html');
            await page.waitForSelector('.inventory_item', { state: 'visible', timeout: 15000 }); 
        });

        await test.step('WHEN: Navega a la página del carrito y hace clic en CHECKOUT', async () => {
            
            // 1. Navega al carrito (la URL /cart.html)
            await page.locator('#shopping_cart_container').click();
            await page.waitForURL('**/cart.html');
            
            // 2. Verifica que el carrito está realmente vacío (opcional, pero buena práctica)
            await expect(page.locator('.cart_item')).toHaveCount(0); 

            // 3. Hace clic en el botón CHECKOUT
            await page.getByRole('link', { name: 'CHECKOUT' }).click();
        });

        await test.step('THEN: El sistema redirige al usuario de vuelta a la página del inventario (/inventory.html)', async () => {
            
            // Verifica que la URL final es la del inventario, impidiendo la navegación al checkout
            await expect(page).toHaveURL('https://www.saucedemo.com/v1/inventory.html');
            
            // Opcional: Verifica que estamos en la página de productos
            await expect(page.locator('.product_label')).toHaveText('Products');
        });
    });
});