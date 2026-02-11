import { Page } from '@playwright/test';
import { expect } from '@playwright/test';

export class HomePage {
  readonly page: Page;
  readonly appNavSearch;

  constructor(page: Page) {
    this.page = page;
    this.appNavSearch = this.page.getByPlaceholder(/search applications/i).first();
  }

  async navigateToIncidentsViaMenu(): Promise<void> {
    // Click on the "All" menu item to open the menu
    await this.page.getByRole('menuitem', { name: /all/i }).click();
    
    // Click on Incidents link (not Watched Incidents) using aria-label
    await this.page.getByRole('link', { name: /^Incidents \d+ of/i }).click({ timeout: 20000 });
    
    await this.page.waitForLoadState('networkidle');
    //await expect(this.page.getByRole('button', { name: /submit/i })).toBeVisible({ timeout: 10000 });
  }
}
