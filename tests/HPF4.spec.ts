import { test, expect } from '@playwright/test';

test.describe('Flujo de Compra en SauceDemo', () => {
    
    // =================================================================
    // CASO HPF-004: ORDENAR PRODUCTOS POR PRECIO (DE MENOR A MAYOR)
    // =================================================================
    test('HPF-004: Los productos se reordenan correctamente por precio (menor a mayor)', async ({ page }) => {

        test.setTimeout(75000); // Timeout elevado para máxima estabilidad

        await test.step('GIVEN: El usuario ha iniciado sesión y está en el inventario', async () => {
            
            // 1. Navegar y Login
            await page.goto('https://www.saucedemo.com/v1/', { waitUntil: 'networkidle' });
            await page.locator('#user-name').fill('standard_user');
            await page.locator('#password').fill('secret_sauce');
            await page.locator('#login-button').click();
            
            // 2. Espera a que cargue el inventario y estabiliza la página
            await page.waitForURL('**/inventory.html');
            await page.waitForSelector('.inventory_item', { state: 'visible', timeout: 15000 }); 
        });

        await test.step('WHEN: Seleccionar la opción "Price (low to high)" del menú Sort', async () => {
            
            // 1. Localizar el menú desplegable de ordenamiento (Sort)
            const sortDropdown = page.locator('.product_sort_container');
            
            // 2. Seleccionar la opción 'Price (low to high)' cuyo valor es 'lohi'
            //
            await sortDropdown.selectOption('lohi');
        });

        await test.step('THEN: Verificar que el producto más barato es el primero de la lista', async () => {
            
            // 1. Verificar el nombre del primer producto
            const firstItemName = page.locator('.inventory_item_name').first();
            await expect(firstItemName).toHaveText('Sauce Labs Onesie'); // El producto más barato es el Onesie
            
            // 2. Verificar el precio del primer producto
            const firstItemPrice = page.locator('.inventory_item_price').first();
            await expect(firstItemPrice).toHaveText('$7.99'); // Su precio es $7.99
            
            // Opcional: Verificar que el segundo producto es más caro que el primero.
            // Para mayor robustez, se recomienda verificar que el título y precio
            // del primer elemento coincidan con el valor más bajo conocido.
        });
    });
});