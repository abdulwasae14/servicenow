import { Page, Locator } from '@playwright/test';

export class Sidebar {
  readonly page: Page;
  readonly menuItems: Locator;
  readonly incidentsLink: Locator;
  readonly dashboardLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.menuItems = page.locator('[role="menuitem"]');
    this.incidentsLink = page.locator('a:has-text("Incidents")');
    this.dashboardLink = page.locator('a:has-text("Dashboard")');
  }

  async navigateToIncidents() {
    await this.incidentsLink.click();
  }

  async navigateToDashboard() {
    await this.dashboardLink.click();
  }
}
