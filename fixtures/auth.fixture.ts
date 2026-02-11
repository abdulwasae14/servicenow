import { test as base, Page } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

type AuthFixtures = {
  authenticatedPage: Page;
};

export const test = base.extend<AuthFixtures>({
  authenticatedPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    const username = process.env.SERVICENOW_USERNAME || 'admin';
    const password = process.env.SERVICENOW_PASSWORD || 'password';
    await loginPage.login(username, password);
    await page.waitForLoadState('networkidle');
    await use(page);
  },
});

export async function loginWithCredentials(page: Page, username: string, password: string) {
  const loginPage = new LoginPage(page);
  await loginPage.login(username, password);
  await page.waitForLoadState('networkidle');
}
