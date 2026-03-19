// pages/AddTaskPage.js
// Page Object Model for the "New Task" (Add Task) panel
// URL: https://keval-todo-list.netlify.app/index.html

class AddTaskPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;

    // ── New Task Form Locators ─────────────────────────────────────
    this.newTaskHeading   = page.getByRole('heading', { name: 'New Task' });
    this.titleInput       = page.locator('aside').first().getByRole('textbox').first();
    this.descriptionInput = page.locator('aside').first().locator('textarea, input').nth(1);
    this.dueDateInput     = page.locator('aside').first().locator('input[type="datetime-local"]');
    this.statusDropdown   = page.locator('aside').first().getByRole('combobox');
    this.addTaskButton    = page.getByRole('button', { name: 'Add Task' });
    this.resetButton      = page.getByRole('button', { name: 'Reset' });

    // ── Task List Area ─────────────────────────────────────────────
    this.taskList = page.locator('main > div').last();
  }

  // ── Actions ────────────────────────────────────────────────────

  /**
   * Fill in the Title field
   * @param {string} title
   */
  async fillTitle(title) {
    await this.titleInput.clear();
    await this.titleInput.fill(title);
  }

  /**
   * Fill in the Description field
   * @param {string} description
   */
  async fillDescription(description) {
    await this.descriptionInput.clear();
    await this.descriptionInput.fill(description);
  }

  /**
   * Fill in the Due Date field (expects format: YYYY-MM-DDTHH:MM)
   * @param {string} dateTime  e.g. "2026-04-25T10:00"
   */
  async fillDueDate(dateTime) {
    await this.dueDateInput.fill(dateTime);
  }

  /**
   * Select a status from the dropdown
   * @param {string} status  e.g. "TODO" | "In Progress" | "Completed"
   */
  async selectStatus(status) {
    await this.statusDropdown.selectOption({ label: status });
  }

  /** Click the Add Task button */
  async clickAddTask() {
    await this.addTaskButton.click();
  }

  /** Click the Reset button */
  async clickReset() {
    await this.resetButton.click();
  }

  /**
   * Fill all fields and submit
   * @param {{ title: string, description?: string, dueDate: string, status?: string }} taskData
   */
  async addTask({ title, description = '', dueDate, status = 'TODO' }) {
    await this.fillTitle(title);
    if (description) await this.fillDescription(description);
    await this.fillDueDate(dueDate);
    await this.selectStatus(status);
    await this.clickAddTask();
  }

  // ── Queries ────────────────────────────────────────────────────

  /**
   * Returns a task card locator by title text
   * @param {string} title
   */
  getTaskCardByTitle(title) {
    return this.page.locator('h4').filter({ hasText: title }).locator('../..');
  }

  /** Get current value of the Title input */
  async getTitleValue() {
    return await this.titleInput.inputValue();
  }

  /** Get current value of the Description input */
  async getDescriptionValue() {
    return await this.descriptionInput.inputValue();
  }

  /** Get current value of the Due Date input */
  async getDueDateValue() {
    return await this.dueDateInput.inputValue();
  }

  /** Get current selected value of Status dropdown */
  async getStatusValue() {
    return await this.statusDropdown.inputValue();
  }
}

module.exports = { AddTaskPage };
