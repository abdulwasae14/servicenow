# ServiceNow Incident Management - Playwright Test Automation

A professional test automation framework for ServiceNow Incident Management using **Playwright**, **TypeScript**, and the **Page Object Model (POM)** pattern.

## Project Structure

```
servicenow/
├── pages/                    # Page Object Model classes
│   ├── LoginPage.ts         # Handles ServiceNow authentication
│   ├── HomePage.ts          # Post-login navigation
│   ├── IncidentListPage.ts  # Incident list view operations
│   └── IncidentFormPage.ts  # Incident creation and updates
├── tests/
│   └── incident.spec.ts     # Comprehensive incident lifecycle tests
├── fixtures/
│   └── auth.fixture.ts      # Authentication fixtures (optional)
├── utils/
│   ├── testData.ts          # Test data and test user definitions
│   └── helpers.ts           # Utility helper functions
├── playwright.config.ts     # Playwright configuration
├── package.json             # Project dependencies
├── .env.example             # Environment variables template
└── README.md                # This file
```

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env` and update with your ServiceNow instance details:

```bash
cp .env.example .env
```

Edit `.env`:
```
SERVICENOW_URL=https://your-instance.service-now.com
SERVICENOW_USERNAME=your_username
SERVICENOW_PASSWORD=your_password
```

### 3. Run Tests

```bash
# Run all tests
npm test

# Run in headed mode (see browser)
npm run test:headed

# Run in debug mode
npm run test:debug

# Run and generate HTML report
npm run test:report
```

## Test Coverage

### Main Test Scenario: Complete Incident Lifecycle

The **`Complete incident lifecycle: create, update, and delete`** test demonstrates:

1. **Login** - Authenticate to ServiceNow using credentials from environment variables
2. **Navigate** - Access the Incident list via the application navigator
3. **Create** - Create a new incident with unique test data (timestamp-based short description)
4. **Verify Creation** - Search for and verify the incident was created successfully
5. **Update State** - Change incident state from "New" to "In Progress"
6. **Update Priority** - Change incident priority to "2"
7. **Delete** - Remove the incident from the system
8. **Verify Deletion** - Confirm the incident no longer exists in the list

### Additional Test

**`Verify short description is mandatory for incident creation`** - Validates that the short description field is required for creating incidents.

## Page Object Model Architecture

### LoginPage
- **Responsibility**: Authentication only
- **Key Methods**:
  - `login(username, password)` - Authenticates and waits for post-login stability
- **Features**: Uses environment variables for credentials, semantic locators, and network idle waits

### HomePage
- **Responsibility**: Post-login navigation
- **Key Methods**:
  - `navigateToIncidentList()` - Navigates to Incident → All using the application navigator
- **Features**: Waits for incident list page to fully load

### IncidentListPage
- **Responsibility**: Incident list view operations
- **Key Methods**:
  - `clickNewButton()` - Opens the incident creation form
  - `searchIncidentByNumber(incidentNumber)` - Searches for an incident by its number
  - `selectIncidentFromTable(incidentNumber)` - Opens an incident from the table
  - `deleteIncident()` - Deletes the current incident with confirmation
- **Features**: No assertions, only actions; explicit state-based waits

### IncidentFormPage
- **Responsibility**: Incident creation and updates
- **Key Methods**:
  - `createIncident(shortDescription, description?)` - Creates a new incident and returns the incident number
  - `updateIncidentState(newState)` - Updates the incident state
  - `updateIncidentPriority(newPriority)` - Updates the incident priority
  - `getIncidentNumber()` - Returns the current incident number
- **Features**: Supports optional description, returns incident number for tracking

## Key Design Principles

✅ **Semantic Locators** - Uses `getByRole()`, `getByLabel()`, and visible text matching  
✅ **State-Based Waits** - Uses `await expect()` and `waitForLoadState()` instead of hard timeouts  
✅ **No Hardcoded Data** - Credentials and URLs read from environment variables  
✅ **Unique Test Data** - Test data includes timestamps to avoid conflicts  
✅ **Clean Test Code** - Tests read like business workflows, not UI scripts  
✅ **Encapsulation** - All UI interactions encapsulated in Page Objects  
✅ **Easy to Explain** - Clear step-by-step test flows with `test.step()` annotations  

## Locator Preferences

This framework prioritizes accessibility-based locators in this order:

1. **Semantic Locators**: `getByRole()`, `getByLabel()`
2. **Text Matching**: `getByText()`, visible text in links
3. **Flexible Patterns**: Case-insensitive regex patterns for robustness
4. **Avoid**: Hard-coded XPath, CSS selectors with data attributes, generic `locator()`

## Running Tests in CI/CD

The framework is configured for CI/CD environments:

```bash
# Single worker, retries enabled (playwright.config.ts)
SERVICENOW_URL=... SERVICENOW_USERNAME=... SERVICENOW_PASSWORD=... npm test
```

## Test Execution Flow (Visual Explanation)

```
┌─────────────────────────────────────────────────────┐
│ 1. Login to ServiceNow                             │
│    - Navigate to SERVICENOW_URL                    │
│    - Enter username and password from env vars     │
│    - Wait for post-login app navigator             │
└────────────────┬──────────────────────────────────┘
                 │
┌────────────────▼──────────────────────────────────┐
│ 2. Navigate to Incident List                      │
│    - Open application navigator search            │
│    - Type "incident"                              │
│    - Click "All Incident"                          │
│    - Wait for list page to load                   │
└────────────────┬──────────────────────────────────┘
                 │
┌────────────────▼──────────────────────────────────┐
│ 3. Create Incident                                │
│    - Click "New" button                           │
│    - Fill Short Description (with timestamp)      │
│    - Fill Description (optional)                  │
│    - Submit form → Returns incident number       │
└────────────────┬──────────────────────────────────┘
                 │
┌────────────────▼──────────────────────────────────┐
│ 4. Verify Creation                                │
│    - Search for incident by number               │
│    - Assert incident is visible in table         │
└────────────────┬──────────────────────────────────┘
                 │
┌────────────────▼──────────────────────────────────┐
│ 5. Update Incident                                │
│    - Select incident from table                  │
│    - Change state to "In Progress"               │
│    - Change priority to "2"                      │
│    - Assert updates applied                      │
└────────────────┬──────────────────────────────────┘
                 │
┌────────────────▼──────────────────────────────────┐
│ 6. Delete Incident                                │
│    - Click delete button                         │
│    - Confirm deletion in dialog                  │
│    - Wait for page to stabilize                  │
└────────────────┬──────────────────────────────────┘
                 │
┌────────────────▼──────────────────────────────────┐
│ 7. Verify Deletion                                │
│    - Navigate back to incident list              │
│    - Search for deleted incident                 │
│    - Assert incident no longer exists            │
└─────────────────────────────────────────────────────┘
```

## Troubleshooting

**Issue**: Tests timeout waiting for login page
- **Solution**: Verify `SERVICENOW_URL` is correct and the instance is accessible

**Issue**: Incident form not submitting
- **Solution**: Verify all mandatory fields (short description) are filled before submission

**Issue**: Incident not found after creation
- **Solution**: Check if the instance requires administrator approval before incidents appear in the list

**Issue**: Tests fail on CI/CD
- **Solution**: Ensure environment variables are properly set in your CI/CD pipeline:
  ```bash
  export SERVICENOW_URL=...
  export SERVICENOW_USERNAME=...
  export SERVICENOW_PASSWORD=...
  npm test
  ```

## Technology Stack

- **Playwright** (v1.58.2) - Cross-browser test automation
- **TypeScript** - Type-safe test code
- **Node.js** - JavaScript runtime
- **Page Object Model** - Design pattern for maintainability

## Best Practices Demonstrated

1. ✅ Separation of concerns (Page Objects handle UI, tests handle business logic)
2. ✅ DRY principle (reusable Page Object methods)
3. ✅ Explicit waits over implicit waits
4. ✅ Meaningful test step names for reporting
5. ✅ Unique test data per execution
6. ✅ Automatic test data cleanup
7. ✅ Environment variable configuration
8. ✅ Accessibility-first locator strategy
9. ✅ Comments for clarity and training purposes
10. ✅ Simple, readable, maintainable code

## References

- [Playwright Documentation](https://playwright.dev/)
- [Page Object Model Pattern](https://playwright.dev/docs/pom)
- [Best Practices](https://playwright.dev/docs/best-practices)
- [ServiceNow Developer Instance](https://developer.servicenow.com/)

---

**Created for QE Training Evaluation**

This framework demonstrates professional test automation practices including all SOLID principles, clean code, and enterprise-grade architecture patterns suitable for real-world projects.
