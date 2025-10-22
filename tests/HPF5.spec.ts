import { test, expect } from '@playwright/test';

test.describe('Flujo de Compra en SauceDemo', () => {
    
    // ... (Aquí irían los códigos de HPF-001, HPF-002, HPF-003 y HPF-004 si están en el mismo archivo) ...

    // =================================================================
    // CASO HPF-005: AÑADIR AL CARRITO DESDE PÁGINA DE DETALLE
    // =================================================================
    test('HPF-005: Debería añadir un ítem al carrito desde la página de detalle del producto', async ({ page }) => {

        test.setTimeout(75000); // Timeout elevado para máxima estabilidad
        const productName = 'Sauce Labs Backpack';

        // GIVEN: El usuario ha iniciado sesión y está en la página de inventario.
        await test.step('GIVEN: Iniciar Sesión y en Inventario', async () => {
            
            // 1. Navegar y Login
            await page.goto('https://www.saucedemo.com/v1/', { waitUntil: 'networkidle' });
            await page.locator('#user-name').fill('standard_user');
            await page.locator('#password').fill('secret_sauce');
            await page.locator('#login-button').click();
            
            // 2. Espera a que cargue el inventario y estabiliza la página
            await page.waitForURL('**/inventory.html');
            await page.waitForSelector('.inventory_item', { state: 'visible', timeout: 15000 }); 
        });

        await test.step('WHEN: Navegar a detalle, añadir producto y volver', async () => {
            
            // 1. Hace clic en el nombre del producto (ej. Sauce Labs Backpack) para ir a detalle
            await page.locator('.inventory_item_name:has-text("' + productName + '")').click();
            
            // Esperar que la URL cambie a la página de detalle
            await page.waitForURL(/inventory-item\.html\?id=\d+/);
            
            // 2. En la página de detalle, hace clic en el botón 'ADD TO CART'
            const addToCartButton = page.locator('button:has-text("ADD TO CART")');
            await addToCartButton.click({ timeout: 10000 });
            
            // 3. Hace clic en el botón 'BACK TO PRODUCTS'
            await page.locator('.inventory_details_back_button').click();
        });

        await test.step('THEN: Verificar el estado del carrito y del botón en la página de detalle', async () => {
            
            // 1. Verificar que la URL es la del inventario (Regresamos correctamente)
            await expect(page).toHaveURL('https://www.saucedemo.com/v1/inventory.html');
            
            // 2. El contador del carrito (badge) muestra el número 1.
            const cartBadge = page.locator('.shopping_cart_badge');
            await expect(cartBadge).toHaveText('1');

            // 3. El botón en la página de detalle del producto (ahora en la página de inventario) 
            //    cambia de 'ADD TO CART' a 'REMOVE'.
            //    Usamos la localización por contenedor para el botón REMOVE.
            const productContainer = page.locator('.inventory_item', { hasText: productName }); 
            const removeButton = productContainer.locator('button:has-text("REMOVE")');

            await expect(removeButton).toBeVisible();
        });
    });
});