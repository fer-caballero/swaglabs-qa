import { type Locator, type Page } from '@playwright/test';

export class Inventory {
    readonly page: Page;
    readonly title: Locator;
    readonly bikeLightAddButton: Locator;
    readonly labsAddButton: Locator;
    readonly addlogoToCartButton: Locator;
    readonly bikelightPrice: Locator;
    readonly bikelightTitle: Locator;
    readonly labsPrice: Locator;
    readonly labsTitle: Locator;
    readonly orderSelect: Locator;

    constructor(page: Page) {
        this.page = page;
        this.title = page.getByText('Products');
        this.bikeLightAddButton = page.getByRole('button', { name: 'ADD TO CART' }).nth(1);
        this.labsAddButton = page.getByRole('button', { name: 'ADD TO CART' }).nth(4);
        this.addlogoToCartButton = page.locator('#shopping_cart_container').getByRole('link');
        this.bikelightPrice = page.getByText('$9.99');
        this.bikelightTitle = page.getByRole('link', { name: 'Sauce Labs Bike Light' });
        this.labsPrice = page.getByText('$7.99');
        this.labsTitle = page.getByRole('link', { name: 'Sauce Labs Onesie' });
        this.orderSelect = page.getByRole('combobox');
    }
    
}