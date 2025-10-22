import { test, expect } from '@playwright/test';

test.describe('Flujo de Gestión de Carrito en SauceDemo', () => {
    
    // =================================================================
    // CASO HPF-002 (ELIMINAR DEL CARRITO) - Versión Final y Estable
    // =================================================================
    test('HPF-002: Debería permitir eliminar un producto y actualizar el carrito', async ({ page }) => {
        
        test.setTimeout(60000); // Timeout a 60s
        
        // GIVEN: El usuario ha iniciado sesión y tiene dos productos en el carrito.
        await test.step('GIVEN: Iniciar Sesión y Añadir dos productos', async () => {
            
            // 1. Navegar al login y esperar al estado 'networkidle' para máxima estabilidad.
            await page.goto('https://www.saucedemo.com/v1/', { waitUntil: 'networkidle' });
            await page.locator('#user-name').waitFor({ state: 'visible', timeout: 10000 }); 

            // 2. Ejecutar Login
            await page.locator('#user-name').fill('standard_user');
            await page.locator('#password').fill('secret_sauce');
            await page.locator('#login-button').click();
            
            // 3. Espera a que cargue el inventario
            await page.waitForURL('**/inventory.html');
            await page.locator('.product_label').waitFor({ state: 'visible', timeout: 10000 });
            await page.waitForLoadState('networkidle', { timeout: 15000 }); 
            
            // --- Interacción con productos (Solución por Contenedor) ---
            
            // 4. Agregar Producto 1: Sauce Labs Bike Light 
            const bikeLightButton = page.getByRole('button', { name: 'ADD TO CART' }).nth(1);
            await bikeLightButton.click({ force: true, timeout: 10000 }); 

            // 5. Agregar Producto 2: Sauce Labs Onesie (Método Robusto por Contenedor)
            const onesieName = 'Sauce Labs Onesie';
            
            // Localiza el contenedor principal del producto por su nombre
            const onesieContainer = page.locator('.inventory_item', { hasText: onesieName }); 
            
            // Dentro del contenedor, localiza el botón 'ADD TO CART'
            const onesieButton = onesieContainer.locator('button:has-text("ADD TO CART")');
            
            // Forzamos scroll y clic
            await onesieContainer.scrollIntoViewIfNeeded({ timeout: 10000 }); // Scroll en el contenedor
            await onesieButton.click({ force: true, timeout: 10000 });
            
            // Verificar que el contador sea '2'
            await expect(page.locator('.shopping_cart_badge')).toHaveText('2'); 
        });

        // WHEN: Navega a la página del carrito y hace clic en el botón 'Remove' de uno de los ítems.
        await test.step('WHEN: Eliminar un ítem del carrito', async () => {
            
            // 1. Navegar al carrito
            await page.locator('#shopping_cart_container').click();
            await page.waitForURL('**/cart.html');
            
            // 2. Definir el ítem a eliminar (Onesie)
            const itemToRemoveName = 'Sauce Labs Onesie'; 
            
            // 3. Localizar el botón 'REMOVE' específico asociado al ítem
            const itemToRemoveContainer = page.locator('.cart_item', { hasText: itemToRemoveName });
            const removeButton = itemToRemoveContainer.locator('button:has-text("REMOVE")');

            // 4. Hacer clic en REMOVE 
            await removeButton.click(); 
        });

        // THEN: El contador del carrito disminuye a 1 y el ítem eliminado desaparece de la lista del carrito.
        await test.step('THEN: Verificar el carrito actualizado', async () => {
            
            // 1. Verificar que el contador del carrito disminuye a 1
            const cartBadge = page.locator('.shopping_cart_badge');
            await expect(cartBadge).toHaveText('1');
            
            // 2. Verificar que solo queda un ítem
            await expect(page.locator('.cart_item')).toHaveCount(1);

            // 3. Verificar que el ítem eliminado NO esté visible
            const itemRemoved = page.locator('.inventory_item_name:has-text("Sauce Labs Onesie")');
            await expect(itemRemoved).not.toBeVisible();
        });
    });
});