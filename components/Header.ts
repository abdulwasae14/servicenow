import { Page, Locator } from '@playwright/test';

export class Header {
  readonly page: Page;
  readonly logo: Locator;
  readonly userMenu: Locator;
  readonly logoutButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.logo = page.locator('img[alt="Logo"]');
    this.userMenu = page.locator('[role="button"]:has-text("User")');
    this.logoutButton = page.locator('button:has-text("Logout")');
  }

  async logout() {
    await this.userMenu.click();
    await this.logoutButton.click();
  }
}
