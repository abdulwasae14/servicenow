import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { HomePage } from '../pages/HomePage';
import { IncidentListPage } from '../pages/IncidentListPage';
import { IncidentFormPage } from '../pages/IncidentFormPage';

test.describe('ServiceNow Incident Management', () => {
  test('Complete incident lifecycle: create, update, and delete', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const homePage = new HomePage(page);
    const incidentListPage = new IncidentListPage(page);
    const incidentFormPage = new IncidentFormPage(page);
    let createdIncidentNumber: string;

    const username = process.env.SERVICENOW_USERNAME || 'admin';
    const password = process.env.SERVICENOW_PASSWORD || 'AE6YZ=veny+8';
    const timestamp = new Date().getTime();
    const shortDescription = `Automation Test Incident ${timestamp}`;
    const description = 'This is an automated test incident for QE training evaluation.';

    await test.step('Login to ServiceNow', async () => {
      await loginPage.login(username, password);
    });

    // Step 2: Navigate to Incident List
    await test.step('Navigate to Incident list', async () => {
      await homePage.navigateToIncidentsViaMenu();
    });

    // Step 3: Create Incident
    await test.step('Create a new incident', async () => {
      await incidentListPage.clickNewButton();
      createdIncidentNumber = await incidentFormPage.createIncident(
        shortDescription,
        description
      );
      expect(createdIncidentNumber).toBeTruthy();
    });
/*
    // Step 4: Verify Incident Creation
    await test.step('Verify incident was created', async () => {
      await homePage.navigateToIncidentsViaMenu();
      await incidentListPage.searchIncidentByNumber(createdIncidentNumber);
      //const frame = page.frameLocator('iframe[name="gsft_main"], iframe#gsft_main');
      //await expect(frame.getByRole('cell', { name: createdIncidentNumber })).toBeVisible();
    });
*/
    // Step 5: Update Incident State
    await test.step('Update incident state', async () => {
      await incidentListPage.selectIncidentFromTable(createdIncidentNumber);
      await incidentFormPage.updateIncidentState('In Progress');
      //const frame = page.frameLocator('iframe[name="gsft_main"], iframe#gsft_main');
      //await expect(frame.getByLabel(/state/i)).toHaveValue('In Progress');
      //insert 1min timeout 
      await page.waitForTimeout(3000);
    });

    // Step 6: Update Incident Priority
    await test.step('Update incident priority', async () => {
      await incidentListPage.selectIncidentFromTable(createdIncidentNumber);
      await incidentFormPage.updateIncidentPriority('2');
      //const frame = page.frameLocator('iframe[name="gsft_main"], iframe#gsft_main');
      //await expect(frame.getByLabel(/priority/i)).toHaveValue('2');
      await page.waitForTimeout(3000);

    });

    // Step 7: Resolve Incident (open the incident again, then click Resolve)
    await test.step('Resolve the incident', async () => {
      await incidentListPage.searchIncidentByNumber(createdIncidentNumber);
      await incidentListPage.selectIncidentFromTable(createdIncidentNumber);
      await incidentFormPage.resolveIncident();
      const frame = page.frameLocator('iframe[name="gsft_main"], iframe#gsft_main');
      //await expect(frame.getByLabel(/state/i)).toHaveValue('Resolved');
    });
  });


});
