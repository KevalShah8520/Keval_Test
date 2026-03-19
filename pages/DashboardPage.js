// pages/DashboardPage.js
// Page Object Model for the main Todo App Dashboard
// URL: https://keval-todo-list.netlify.app/index.html

class DashboardPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;

    // ── Header ─────────────────────────────────────────────────────
    this.heading      = page.getByRole('heading', { name: 'Todo List' });
    this.activeTab    = page.getByRole('button', { name: 'Active' });
    this.archiveTab   = page.getByRole('button', { name: 'Archive' });
    this.logoutButton = page.getByRole('button', { name: 'Logout' });

    // ── Task List ──────────────────────────────────────────────────
    this.taskListArea = page.locator('main > div').last();
  }

  // ── Actions ────────────────────────────────────────────────────

  /** Navigate directly to the dashboard */
  async goto() {
    await this.page.goto('/index.html');
  }

  /** Logout from the application */
  async logout() {
    await this.logoutButton.click();
  }

  // ── Task Card Helpers ──────────────────────────────────────────

  /**
   * Get a task card by its title heading
   * @param {string} title
   */
  getTaskCard(title) {
    return this.page.locator('h4').filter({ hasText: title }).locator('../../..');
  }

  /**
   * Check if a task with the given title is visible in the list
   * @param {string} title
   * @returns {Promise<boolean>}
   */
  async isTaskVisible(title) {
    return await this.page.locator('h4').filter({ hasText: title }).isVisible();
  }

  /**
   * Get the info line text (status, dates) of a task card
   * @param {string} title
   * @returns {Promise<string>}
   */
  async getTaskInfoText(title) {
    const card = this.getTaskCard(title);
    return await card.locator('p, small, [class*="info"], [class*="meta"]').last().innerText();
  }

  /**
   * Click the Delete button on the first task card that matches a title
   * @param {string} title
   */
  async deleteTask(title) {
    const card = this.getTaskCard(title);
    await card.getByRole('button', { name: 'Delete' }).click();
  }

  /**
   * Click the Archive button on a task card that matches a title
   * @param {string} title
   */
  async archiveTask(title) {
    const card = this.getTaskCard(title);
    await card.getByRole('button', { name: 'Archive' }).click();
  }

  /**
   * Count total visible task cards
   * @returns {Promise<number>}
   */
  async getTaskCount() {
    return await this.page.locator('h4').count();
  }
}

module.exports = { DashboardPage };
