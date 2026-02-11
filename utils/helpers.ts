import { Page } from '@playwright/test';

export async function waitForElement(page: Page, selector: string, timeout: number = 5000) {
  await page.waitForSelector(selector, { timeout });
}

export async function fillForm(page: Page, formData: Record<string, string>) {
  for (const [field, value] of Object.entries(formData)) {
    const input = page.locator(`input[name="${field}"], textarea[name="${field}"]`);
    await input.fill(value);
  }
}

export async function getTableData(page: Page) {
  return page.locator('table tbody tr').allTextContents();
}

export async function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
