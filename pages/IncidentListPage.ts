import { Page, Locator } from '@playwright/test';

export class IncidentListPage {
  readonly page: Page;
  readonly newButton: Locator;
  readonly searchField: Locator;
  readonly table: Locator;

  constructor(page: Page) {
    this.page = page;
    this.newButton = this.page.locator('button[data-action-label="New"]');
    //this.searchField = this.page.getByPlaceholder(/search/i).first();
    this.searchField = this.page.locator(
      '//input[@type="search" and @aria-describedby=//span[contains(@class,"sr-only")]/@id]'
    );

    this.table = this.page.locator('table').first();
  }

  async clickNewButton(): Promise<void> {
    // Keep this simple: try main document first, then common ServiceNow frame
    // 1) Main document
    try {
      await this.page.locator('button[data-action-label="New"]').first().click({ timeout: 5000 });
      await this.page.waitForLoadState('networkidle');
      return;
    } catch {}

    // 2) Common ServiceNow content frame (gsft_main)
    try {
      await this.page
        .frameLocator('iframe[name="gsft_main"], iframe#gsft_main')
        .locator('button[data-action-label="New"]').first()
        .click({ timeout: 5000 });
      await this.page.waitForLoadState('networkidle');
      return;
    } catch {}

    throw new Error('Unable to click New button');
  }

  async searchIncidentByNumber(incidentNumber: string): Promise<void> {
    const frame = this.page.frameLocator('iframe[name="gsft_main"], iframe#gsft_main');

    // Ensure the column search row is visible, then type in the Number search box
    const searchToggle = frame.locator('button.list_header_search_toggle');
    const numberSearch = frame.locator('#incident_table_header_search_control');
    if (!(await numberSearch.isVisible().catch(() => false))) {
      await searchToggle.click({ timeout: 5000 }).catch(() => {});
    }

    await numberSearch.fill(incidentNumber);
    await numberSearch.press('Enter');

    // Wait until the table shows the record link with the matching number
    await frame
      .locator('table#incident_table a.linked.formlink', { hasText: incidentNumber })
      .first()
      .waitFor({ state: 'visible', timeout: 10000 });
  }

  async selectIncidentFromTable(incidentNumber: string): Promise<void> {
    const frame = this.page.frameLocator('iframe[name="gsft_main"], iframe#gsft_main');
    await frame
      .locator('table#incident_table a.linked.formlink', { hasText: incidentNumber })
      .first()
      .click({ timeout: 10000 });
    await this.page.waitForLoadState('networkidle');
  }

  async deleteIncident(): Promise<void> {
    // Click delete on opened incident form or list
    const frame = this.page.frameLocator('iframe[name="gsft_main"], iframe#gsft_main');
    const deleteBtn = frame.getByRole('button', { name: /delete|remove/i }).first();
    await deleteBtn.click();

    // Confirm deletion
    const confirm = frame.getByRole('button', { name: /delete|yes|confirm/i }).last();
    await confirm.click();
    await this.page.waitForLoadState('networkidle');
  }
}
