import { type Locator, type Page } from '@playwright/test';

export class Login {
    readonly page: Page;
    readonly usernameTxt: Locator;
    readonly passwordTxt: Locator;
    readonly loginBtn: Locator;

    constructor(page: Page) {
        this.page = page;
        this.usernameTxt = page.locator('[data-test="username"]');
        this.passwordTxt = page.locator('[data-test="password"]');
        this.loginBtn = page.getByRole('button', { name: 'LOGIN' });
    }

    async fillUsername(username: string) {
        await this.usernameTxt.fill(username);
    }

    async fillPassword(password: string) {
        await this.passwordTxt.fill(password);
    }

    async clickLogin() {
        await this.loginBtn.click();
    }

}

