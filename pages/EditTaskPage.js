// pages/EditTaskPage.js
// Page Object Model for the "Edit Task" slide-in panel
// URL: https://keval-todo-list.netlify.app/index.html

class EditTaskPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;

    // ── Edit Panel Locators ────────────────────────────────────────
    this.editPanel        = page.locator('aside').last();
    this.editHeading      = page.getByRole('heading', { name: 'Edit Task' });
    this.titleInput       = page.locator('aside').last().locator('input').first();
    this.descriptionInput = page.locator('aside').last().locator('textarea');
    this.dueDateInput     = page.locator('aside').last().locator('input[type="datetime-local"]').first();
    this.createdDateInput = page.locator('aside').last().locator('input[type="datetime-local"]').last();
    this.statusDropdown   = page.locator('aside').last().getByRole('combobox');
    this.saveButton       = page.locator('aside').last().getByRole('button', { name: 'Save' });
    this.discardButton    = page.locator('aside').last().getByRole('button', { name: 'Discard' });
  }

  // ── Actions ────────────────────────────────────────────────────

  /**
   * Open the Edit panel for a task by its title
   * @param {string} taskTitle
   */
  async openEditForTask(taskTitle) {
    const taskCard = this.page
      .locator('h4')
      .filter({ hasText: taskTitle })
      .locator('../../..');
    await taskCard.getByRole('button', { name: 'Edit' }).click();
  }

  /**
   * Open the Edit panel for the first task in the list
   */
  async openEditForFirstTask() {
    await this.page.getByRole('button', { name: 'Edit' }).first().click();
  }

  /**
   * Update the Title field
   * @param {string} title
   */
  async updateTitle(title) {
    await this.titleInput.clear();
    await this.titleInput.fill(title);
  }

  /**
   * Update the Description field
   * @param {string} description
   */
  async updateDescription(description) {
    await this.descriptionInput.clear();
    await this.descriptionInput.fill(description);
  }

  /**
   * Update the Due Date field (format: YYYY-MM-DDTHH:MM)
   * @param {string} dateTime
   */
  async updateDueDate(dateTime) {
    await this.dueDateInput.fill(dateTime);
  }

  /**
   * Select a Status
   * @param {string} status  e.g. "TODO" | "In Progress" | "Completed"
   */
  async selectStatus(status) {
    await this.statusDropdown.selectOption({ label: status });
  }

  /** Click the Save button */
  async clickSave() {
    await this.saveButton.click();
  }

  /** Click the Discard button */
  async clickDiscard() {
    await this.discardButton.click();
  }

  // ── Queries ────────────────────────────────────────────────────

  /** Get the current value of the Title input in edit panel */
  async getTitleValue() {
    return await this.titleInput.inputValue();
  }

  /** Check if the edit panel is visible */
  async isPanelVisible() {
    return await this.editPanel.isVisible();
  }
}

module.exports = { EditTaskPage };
