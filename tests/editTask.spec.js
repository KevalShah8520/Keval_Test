// tests/editTask.spec.js
// ─────────────────────────────────────────────────────────────────────────────
// Test Suite  : Edit Task Module
// Module      : Edit Task Slide-in Panel
// Source      : Google Sheet – "Task Test Cases" tab (TC_EDIT_01 to TC_EDIT_05)
// Application : https://keval-todo-list.netlify.app
// ─────────────────────────────────────────────────────────────────────────────

const { test, expect }  = require('@playwright/test');
const { AddTaskPage }   = require('../pages/AddTaskPage');
const { EditTaskPage }  = require('../pages/EditTaskPage');
const { DashboardPage } = require('../pages/DashboardPage');
const { loginToDashboard, captureDialogMessage, uniqueTitle } = require('../utils/helpers');
const { EDIT_TASK_DATA } = require('../test-data/taskData');

// ── Shared seed-task config ───────────────────────────────────────────────────
// Each edit test creates its own isolated seed task via createSeedTask()
// to avoid cross-test dependency on pre-existing data.

const SEED = {
  dueDate:     '2026-06-15T10:00',
  description: 'Original description',
  status:      'TODO',
};

// ── Hooks ─────────────────────────────────────────────────────────────────────

test.beforeEach(async ({ page }) => {
  await loginToDashboard(page);
});

// ── Shared helper ─────────────────────────────────────────────────────────────

/**
 * Create a fresh uniquely-titled seed task and return its title.
 * @param {import('@playwright/test').Page} page
 * @returns {Promise<string>}
 */
async function createSeedTask(page) {
  const addPage = new AddTaskPage(page);
  const title   = uniqueTitle('EditTest');

  await addPage.fillTitle(title);
  await addPage.fillDescription(SEED.description);
  await addPage.fillDueDate(SEED.dueDate);
  await addPage.selectStatus(SEED.status);
  await addPage.clickAddTask();

  // Wait for the task card to appear before proceeding
  await expect(page.locator('h4').filter({ hasText: title })).toBeVisible();
  return title;
}

// ── Test Cases ────────────────────────────────────────────────────────────────

/**
 * TC_EDIT_01
 * Title  : Edit an existing task's title and save successfully
 * Steps  : Click Edit → Clear title → Enter new title → Click Save
 * Expect : Task card shows updated title; original title is gone
 */
test('TC_EDIT_01 - Edit task title and save successfully', async ({ page }) => {
  const editPage  = new EditTaskPage(page);
  const dashboard = new DashboardPage(page);
  const data      = EDIT_TASK_DATA.TC_EDIT_01;

  // Precondition: create isolated seed task
  const originalTitle = await createSeedTask(page);

  // Step 1 — Open Edit panel
  await editPage.openEditForTask(originalTitle);
  await expect(editPage.editHeading).toBeVisible();

  // Step 2 — Update title
  await editPage.updateTitle(data.newTitle);

  // Step 3 — Save
  await editPage.clickSave();

  // Assert: updated title visible in task list
  await expect(page.locator('h4').filter({ hasText: data.newTitle })).toBeVisible();

  // Assert: original title no longer visible
  await expect(page.locator('h4').filter({ hasText: originalTitle })).not.toBeVisible();

  // Cleanup
  await dashboard.deleteTask(data.newTitle);
});

/**
 * TC_EDIT_02
 * Title  : Edit task description and due date and save
 * Steps  : Click Edit → Update description + due date → Click Save
 * Expect : Task card reflects updated description and due date
 */
test('TC_EDIT_02 - Edit task description and due date and save', async ({ page }) => {
  const editPage  = new EditTaskPage(page);
  const dashboard = new DashboardPage(page);
  const data      = EDIT_TASK_DATA.TC_EDIT_02;

  // Precondition: create isolated seed task
  const taskTitle = await createSeedTask(page);

  // Step 1 — Open Edit panel
  await editPage.openEditForTask(taskTitle);
  await expect(editPage.editHeading).toBeVisible();

  // Steps 2 & 3 — Update description and due date
  await editPage.updateDescription(data.newDescription);
  await editPage.updateDueDate(data.newDueDate);

  // Step 4 — Save
  await editPage.clickSave();

  // Assert: updated description is visible in the task card
  const taskCard = dashboard.getTaskCard(taskTitle);
  await expect(taskCard).toContainText(data.newDescription);

  // Cleanup
  await dashboard.deleteTask(taskTitle);
});

/**
 * TC_EDIT_03
 * Title  : Change task status from TODO to Completed via Edit panel
 * Steps  : Click Edit → Change status to Completed → Click Save
 * Expect : Task card status shows "Completed" OR task moves to Archive
 */
test('TC_EDIT_03 - Change task status from TODO to Completed via Edit panel', async ({ page }) => {
  const editPage  = new EditTaskPage(page);
  const dashboard = new DashboardPage(page);
  const data      = EDIT_TASK_DATA.TC_EDIT_03;

  // Precondition: create isolated TODO seed task
  const taskTitle = await createSeedTask(page);

  // Step 1 — Open Edit panel
  await editPage.openEditForTask(taskTitle);
  await expect(editPage.editHeading).toBeVisible();

  // Step 2 — Change status to Completed
  await editPage.selectStatus(data.newStatus);

  // Step 3 — Save
  await editPage.clickSave();

  // Assert: either task shows "Completed" in Active view OR moved to Archive
  const completedInActiveView = await page
    .locator('h4').filter({ hasText: taskTitle })
    .isVisible().catch(() => false);

  if (completedInActiveView) {
    // Task still visible — verify status text updated
    const taskCard = dashboard.getTaskCard(taskTitle);
    await expect(taskCard).toContainText('Completed');
  } else {
    // Task removed from Active view — switch to Archive to confirm
    await dashboard.archiveTab.click();
    await expect(page.locator('h4').filter({ hasText: taskTitle })).toBeVisible();
  }
});

/**
 * TC_EDIT_04
 * Title  : Attempt to save edit with Title field cleared (mandatory validation)
 * Steps  : Click Edit → Clear title completely → Click Save
 * Expect : Save is blocked; validation fires; task NOT updated
 */
test('TC_EDIT_04 - Save edit blocked when Title is cleared (validation)', async ({ page }) => {
  const editPage = new EditTaskPage(page);
  const data     = EDIT_TASK_DATA.TC_EDIT_04;

  // Precondition: create isolated seed task
  const originalTitle = await createSeedTask(page);

  // Step 1 — Open Edit panel
  await editPage.openEditForTask(originalTitle);
  await expect(editPage.editHeading).toBeVisible();

  // Capture any alert dialog that may fire on save
  const dialogPromise = captureDialogMessage(page);

  // Step 2 — Clear the title
  await editPage.updateTitle(data.newTitle); // empty string

  // Step 3 — Attempt to Save
  await editPage.clickSave();

  const dialogMsg = await dialogPromise;

  // Assert: native HTML5 validation prevented save
  const isTitleInvalid = await editPage.titleInput.evaluate(
    (el) => !el.validity.valid
  );

  // Assert: alert was triggered OR browser validation blocked it
  const alertShown = dialogMsg !== null;
  expect(isTitleInvalid || alertShown).toBeTruthy();

  // Discard to close panel cleanly
  await editPage.clickDiscard();

  // Assert: original title still intact in task list
  await expect(page.locator('h4').filter({ hasText: originalTitle })).toBeVisible();

  // Cleanup
  const dashboard = new DashboardPage(page);
  await dashboard.deleteTask(originalTitle);
});

/**
 * TC_EDIT_05
 * Title  : Discard changes in Edit panel reverts to original task data
 * Steps  : Click Edit → Modify title & description → Click Discard
 * Expect : Panel closes; task card retains original data; changes NOT saved
 */
test('TC_EDIT_05 - Discard changes reverts to original task data', async ({ page }) => {
  const editPage  = new EditTaskPage(page);
  const dashboard = new DashboardPage(page);
  const data      = EDIT_TASK_DATA.TC_EDIT_05;

  // Precondition: create isolated seed task
  const originalTitle = await createSeedTask(page);

  // Step 1 — Open Edit panel
  await editPage.openEditForTask(originalTitle);
  await expect(editPage.editHeading).toBeVisible();

  // Step 2 — Modify title and description (intentionally — will be discarded)
  await editPage.updateTitle(data.modifiedTitle);
  await editPage.updateDescription(data.modifiedDescription);

  // Step 3 — Click Discard (app shows "Discard changes?" confirm dialog)
  await editPage.clickDiscard();

  // Handle the confirm dialog if it appears
  page.on('dialog', async (dialog) => await dialog.accept());

  // Assert: edit panel is closed (original data preserved)
  await expect(page.locator('h4').filter({ hasText: originalTitle })).toBeVisible();

  // Assert: modified title was NOT saved to the task list
  await expect(page.locator('h4').filter({ hasText: data.modifiedTitle })).not.toBeVisible();

  // Cleanup
  await dashboard.deleteTask(originalTitle);
});
