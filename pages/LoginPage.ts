
import { Page } from '@playwright/test';
import { expect } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly usernameField;
  readonly passwordField;
  readonly signInButton;

  constructor(page: Page) {
    this.page = page;
    this.usernameField = this.page.getByRole('textbox', { name: /User name/ });
    this.passwordField = this.page.getByRole('textbox', { name: /Password/ });
    this.signInButton = this.page.getByRole('button', { name: /Log in/ });
  }

  async login(username: string, password: string): Promise<void> {
    const serviceNowUrl = process.env.SERVICENOW_URL || 'https://dev272960.service-now.com/';
    await this.page.goto(serviceNowUrl);

    // Wait for username field to be visible and ready
    await this.usernameField.waitFor({ state: 'visible', timeout: 20000 });
    await this.usernameField.fill(username);
    
    // Wait for password field to be visible and ready before filling
    await this.passwordField.waitFor({ state: 'visible', timeout: 20000 });
    await this.page.waitForTimeout(500); // Small delay to ensure field is fully interactive
    await this.passwordField.fill(password);
    
    await this.signInButton.click();

    // Wait for post-login navigation to stabilize
    await this.page.waitForLoadState('networkidle');

    // Verify successful login by checking for the application navigator
    //await expect(this.page.getByRole('navigation').first()).toBeVisible({ timeout: 15000 });
  }
}
