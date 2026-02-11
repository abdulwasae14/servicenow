import { Page } from '@playwright/test';
import { expect } from '@playwright/test';

export class IncidentFormPage {
  page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async createIncident(shortDescription: string, description?: string): Promise<string> {
    // Fill Short Description (mandatory)
    await this.page
      .frameLocator('iframe[name="gsft_main"], iframe#gsft_main')
      .locator('//input[@id="incident.short_description"]')
      .fill(shortDescription);
    await this.page.waitForTimeout(10000);

    // Fill Description (optional)
    if (description) {
      await this.page
        .frameLocator('iframe[name="gsft_main"], iframe#gsft_main')
        .locator('//textarea[@id="incident.comments"]')
        .fill(description);
      await this.page.waitForTimeout(5000);
    }

    const incidentNumber = await this.page
      .frameLocator('iframe[name="gsft_main"], iframe#gsft_main')
      .locator('//input[@id="incident.number"]')
      .inputValue();
    // Submit the form
    await this.page
      .frameLocator('iframe[name="gsft_main"], iframe#gsft_main')
      .locator('//button[@id="sysverb_insert"]')
      .click();
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(3000);

    // Extract and return the incident number from the form
    

    return incidentNumber;
  }

  async updateIncidentState(newState: string): Promise<void> {
    // Find and update the State field
    await this.page
      .frameLocator('iframe[name="gsft_main"], iframe#gsft_main')
      .locator('//select[@id="incident.state"]')
      .selectOption(newState);
    await this.page.waitForTimeout(10000);

    await this.page
      .frameLocator('iframe[name="gsft_main"], iframe#gsft_main')
      .locator('//button[@id="sysverb_update"]')
      .click();
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(3000);

  }

  async updateIncidentPriority(newPriority: string): Promise<void> {
    // Find and update the Priority field
    await this.page
      .frameLocator('iframe[name="gsft_main"], iframe#gsft_main')
      .locator('//select[@id="incident.urgency"]')
      .selectOption(newPriority);
    await this.page.waitForTimeout(10000);

    await this.page
      .frameLocator('iframe[name="gsft_main"], iframe#gsft_main')
      .locator('//button[@id="sysverb_update"]')
      .click();
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(3000);
  }

  async resolveIncident(): Promise<void> {
    // Click the Resolve button on the incident form
    await this.page.waitForTimeout(10000);
    await this.page
      .frameLocator('iframe[name="gsft_main"], iframe#gsft_main')
      .locator('#resolve_incident')
      .click();
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(3000);

  }

  async getIncidentNumber(): Promise<string> {
    return this.page
      .frameLocator('iframe[name="gsft_main"], iframe#gsft_main')
      .locator('//input[@id="incident.number"]')
      .inputValue();
  }
}
