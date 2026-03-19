// pages/TaskListPage.js
// Page Object Model for the Task List area on the Todo App dashboard
// URL: https://keval-todo-list.netlify.app/index.html

class TaskListPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page     = page;
    this.taskList = page.locator('main > div').last();
  }

  // ── Queries ────────────────────────────────────────────────────

  /**
   * Get a task card element by its title text
   * @param {string} title
   */
  getTaskCardByTitle(title) {
    return this.page.locator(`h4:has-text("${title}")`).locator('../..');
  }

  // ── Assertions ─────────────────────────────────────────────────

  /**
   * Assert that a task with given title is visible in the list
   * @param {string} title
   */
  async expectTaskVisible(title) {
    await this.page
      .locator(`h4:has-text("${title}")`)
      .waitFor({ state: 'visible', timeout: 8000 });
  }

  /**
   * Assert that a task with given title is NOT in the list
   * @param {string} title
   */
  async expectTaskNotVisible(title) {
    await this.page
      .locator(`h4:has-text("${title}")`)
      .waitFor({ state: 'hidden', timeout: 5000 });
  }

  // ── Actions ────────────────────────────────────────────────────

  /**
   * Click the 'Edit' button on the first task whose title matches
   * @param {string} title
   */
  async clickEditOnTask(title) {
    const card = this.getTaskCardByTitle(title);
    await card.getByRole('button', { name: 'Edit' }).click();
  }

  /**
   * Click the 'Edit' button on the first task in the list
   */
  async clickEditOnFirstTask() {
    await this.page.getByRole('button', { name: 'Edit' }).first().click();
  }

  /**
   * Get the status text shown on a task card by title
   * @param {string} title
   * @returns {Promise<string|null>}
   */
  async getTaskStatus(title) {
    const card    = this.getTaskCardByTitle(title);
    const metaText = await card.locator('p, small, [class*="meta"]').last().innerText();
    const match   = metaText.match(/Status:\s*(\S+)/);
    return match ? match[1] : null;
  }
}

module.exports = { TaskListPage };
