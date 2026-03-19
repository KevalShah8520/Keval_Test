// utils/helpers.js
// ─────────────────────────────────────────────────────────────────────────────
// Shared utility functions used across all test suites
// ─────────────────────────────────────────────────────────────────────────────

const { LoginPage }   = require('../pages/LoginPage');
const { CREDENTIALS } = require('../test-data/taskData');

/**
 * Login to the Todo App using demo credentials and wait for the dashboard.
 * Call this inside test.beforeEach() to ensure every test starts authenticated.
 *
 * @param {import('@playwright/test').Page} page
 */
async function loginToDashboard(page) {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(CREDENTIALS.username, CREDENTIALS.password);
  // Wait until the dashboard is fully loaded
  await page.waitForURL('**/index.html');
  await page.getByRole('heading', { name: 'Todo List' }).waitFor({ state: 'visible' });
}

/**
 * Register a one-time dialog listener and return its message text.
 * Resolves with null if no dialog appears within the timeout.
 * The dialog is auto-accepted so it never blocks the test flow.
 *
 * @param {import('@playwright/test').Page} page
 * @param {number} [timeout=3000] - ms to wait before resolving null
 * @returns {Promise<string|null>}
 */
function captureDialogMessage(page, timeout = 3000) {
  return new Promise((resolve) => {
    const timer = setTimeout(() => resolve(null), timeout);

    page.once('dialog', async (dialog) => {
      clearTimeout(timer);
      const message = dialog.message();
      await dialog.accept();
      resolve(message);
    });
  });
}

/**
 * Generate a unique task title using a timestamp suffix.
 * Prevents title collisions when multiple tests create tasks.
 *
 * @param {string} [prefix='Task'] - Human-readable prefix
 * @returns {string}  e.g. "EditTest_1713000000000"
 */
function uniqueTitle(prefix = 'Task') {
  return `${prefix}_${Date.now()}`;
}

module.exports = { loginToDashboard, captureDialogMessage, uniqueTitle };
