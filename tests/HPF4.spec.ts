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

        // --- PASO CLAVE: Capturar los precios ANTES de ordenar (para tener una referencia) ---
        // Aunque el WHEN aplica el ordenamiento, capturamos los precios justo antes de verificar.
        let actualPrices: number[] = [];

        await test.step('WHEN: Seleccionar la opción "Price (low to high)" del menú Sort', async () => {
            
            // 1. Localizar el menú desplegable de ordenamiento (Sort)
            const sortDropdown = page.locator('.product_sort_container');
            
            // 2. Seleccionar la opción 'Price (low to high)' cuyo valor es 'lohi'
            await sortDropdown.selectOption('lohi');
            
            // Damos un breve tiempo extra para que el DOM se actualice después del select.
            await page.waitForTimeout(500); 
        });

        await test.step('THEN: Verificar que la lista de precios está ordenada de forma ascendente', async () => {
            
            // 1. Leer TODOS los precios que se muestran en la página DESPUÉS de ordenar
            const priceElements = await page.locator('.inventory_item_price').all();
            
            // 2. Extraer el texto de cada elemento, limpiar el símbolo '$', y convertirlo a número
            for (const priceElement of priceElements) {
                const priceText = await priceElement.innerText();
                // Elimina '$' y convierte a punto flotante (e.g., "$29.99" -> 29.99)
                const priceValue = parseFloat(priceText.replace('$', ''));
                actualPrices.push(priceValue);
            }
            
            // 3. Crear la lista ESPERADA (ordenando la lista capturada de forma ascendente)
            // Hacemos una copia (.slice()) y la ordenamos
            const expectedPrices = actualPrices.slice().sort((a, b) => a - b); 
            
            // 4. AFIRMACIÓN CLAVE: Comprobar que la lista leída de la página (actualPrices) 
            //    es idéntica a la lista que debería estar ordenada (expectedPrices)
            await expect(actualPrices).toEqual(expectedPrices);

            // Opcional: Para verificar que NO está fallando por un error del sitio, 
            // también puedes verificar el primer y último elemento.
            console.log(`Precios en página (ascendente): ${actualPrices.join(', ')}`);
        });
    });
});