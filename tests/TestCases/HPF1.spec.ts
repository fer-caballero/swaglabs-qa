import { test, expect } from './test-base'; // Ajusta la ruta a tu archivo de fixtures

test.describe('Flujo de Compra en SauceDemo', () => {

    // Datos de ejemplo para el checkout
    const USER_DATA = {
        firstName: 'Tester',
        lastName: 'Playwright',
        zipCode: '5000'
    };

    // 2. Pedimos 'loggedInPage' en lugar de 'page'
    test('HPF-001: Compra exitosa de dos productos hasta la confirmación de la orden', async ({ loggedInPage }) => {

        await test.step('', async () => {
            
        })
        
        // 4. Renombramos todas las instancias de 'page' a 'loggedInPage'
        await test.step('WHEN: Agregar productos y navegar al Checkout', async () => {

            // 1. Agregar Producto 1: Sauce Labs Bolt T-Shirt
            const tShirtName = 'Sauce Labs Bolt T-Shirt';
            const tShirtContainer = loggedInPage.locator('.inventory_item', { hasText: tShirtName });
            const tShirtButton = tShirtContainer.locator('button:has-text("ADD TO CART")');

            await tShirtContainer.scrollIntoViewIfNeeded({ timeout: 10000 });
            await tShirtButton.click({ timeout: 10000 });

            // 2. Agregar Producto 2: Sauce Labs Fleece Jacket
            const jacketName = 'Sauce Labs Fleece Jacket';
            const jacketContainer = loggedInPage.locator('.inventory_item', { hasText: jacketName });
            const jacketButton = jacketContainer.locator('button:has-text("ADD TO CART")');

            await jacketContainer.scrollIntoViewIfNeeded({ timeout: 10000 });
            await jacketButton.click({ timeout: 10000 });

            // 3. Verificar contador
            await expect(loggedInPage.locator('.shopping_cart_badge')).toHaveText('2');

            // --- Navegación y Checkout ---

            // 4. Navega al carrito
            await loggedInPage.locator('#shopping_cart_container').click();

            // 5. Checkout (navegar al paso 1)
            await loggedInPage.waitForURL('**/cart.html');
            await loggedInPage.getByRole('link', { name: 'CHECKOUT' }).click();
            await loggedInPage.waitForURL('**/checkout-step-one.html');

            // 6. Completa el formulario de envío
            await loggedInPage.locator('#first-name').fill(USER_DATA.firstName);
            await loggedInPage.locator('#last-name').fill(USER_DATA.lastName);
            await loggedInPage.locator('#postal-code').fill(USER_DATA.zipCode);

            // 7. Clic en Continuar (navegar al paso 2)
            await loggedInPage.locator('input[type="submit"]').click();
            await loggedInPage.waitForURL('**/checkout-step-two.html');

            // 8. Clic en Finalizar
            await loggedInPage.locator('.btn_action.cart_button').click();
        });

        await test.step('THEN: Verificar la confirmación de la compra', async () => {
            // 1. Verificar la URL final
            await expect(loggedInPage).toHaveURL(/checkout-complete.html/);

            // 2. Verificar el mensaje de confirmación
            await expect(loggedInPage.locator('.complete-header')).toHaveText('THANK YOU FOR YOUR ORDER');
        });
    });
});