// tests/addTask.spec.js
// ─────────────────────────────────────────────────────────────────────────────
// Test Suite  : Add Task Module
// Module      : New Task Form
// Source      : Google Sheet – "Task Test Cases" tab (TC_ADD_01 to TC_ADD_05)
// Application : https://keval-todo-list.netlify.app
// ─────────────────────────────────────────────────────────────────────────────

const { test, expect } = require('@playwright/test');
const { LoginPage }     = require('../pages/LoginPage');
const { AddTaskPage }   = require('../pages/AddTaskPage');
const { DashboardPage } = require('../pages/DashboardPage');
const { loginToDashboard, captureDialogMessage } = require('../utils/helpers');
const { ADD_TASK_DATA } = require('../test-data/taskData');

// ── Hooks ─────────────────────────────────────────────────────────────────────

test.beforeEach(async ({ page }) => {
  // Login once before every test
  await loginToDashboard(page);
});

// ── Test Cases ────────────────────────────────────────────────────────────────

/**
 * TC_ADD_01
 * Title  : Add a task with all valid required fields
 * Steps  : Enter title → Enter due date → Leave status as TODO → Click Add Task
 * Expect : Task 'Buy Milk' appears in task list with status TODO
 */
test('TC_ADD_01 - Add a task with all valid required fields', async ({ page }) => {
  const addPage   = new AddTaskPage(page);
  const dashboard = new DashboardPage(page);
  const data      = ADD_TASK_DATA.TC_ADD_01;

  // Fill required fields only
  await addPage.fillTitle(data.title);
  await addPage.fillDueDate(data.dueDate);
  // Status left as default TODO

  // Submit
  await addPage.clickAddTask();

  // Assert: task card appears in the list
  await expect(page.locator('h4').filter({ hasText: data.title })).toBeVisible();

  // Assert: status label shown in the task info line
  const taskCard = dashboard.getTaskCard(data.title);
  await expect(taskCard).toContainText(data.expectedStatusText);

  // Cleanup: delete created task so it doesn't affect other tests
  await dashboard.deleteTask(data.title);
});

/**
 * TC_ADD_02
 * Title  : Add a task with all fields (Title, Description, Due Date, Status)
 * Steps  : Fill all fields → Select "In Progress" → Click Add Task
 * Expect : Task created with all details visible including description & status
 */
test('TC_ADD_02 - Add a task with all fields including description and status', async ({ page }) => {
  const addPage   = new AddTaskPage(page);
  const dashboard = new DashboardPage(page);
  const data      = ADD_TASK_DATA.TC_ADD_02;

  // Fill all fields
  await addPage.fillTitle(data.title);
  await addPage.fillDescription(data.description);
  await addPage.fillDueDate(data.dueDate);
  await addPage.selectStatus(data.status);

  // Submit
  await addPage.clickAddTask();

  // Assert: task title visible
  await expect(page.locator('h4').filter({ hasText: data.title })).toBeVisible();

  // Assert: description visible on task card
  const taskCard = dashboard.getTaskCard(data.title);
  await expect(taskCard).toContainText(data.description);

  // Assert: status shown correctly
  await expect(taskCard).toContainText(data.expectedStatusText);

  // Cleanup
  await dashboard.deleteTask(data.title);
});

/**
 * TC_ADD_03
 * Title  : Attempt to add a task with Title field empty (mandatory validation)
 * Steps  : Leave Title empty → Enter due date → Click Add Task
 * Expect : Task NOT created; validation error / alert shown for required Title
 */
test('TC_ADD_03 - Add task fails when Title is empty (validation)', async ({ page }) => {
  const addPage = new AddTaskPage(page);
  const data    = ADD_TASK_DATA.TC_ADD_03;

  // Capture any dialog (alert) that may appear
  const dialogPromise = captureDialogMessage(page);

  // Leave title empty, fill due date only
  await addPage.fillDueDate(data.dueDate);
  await addPage.clickAddTask();

  const dialogMsg = await dialogPromise;

  // Approach A: browser native validation (title input marked invalid)
  const isTitleInvalid = await page
    .locator('aside').first()
    .locator('input').first()
    .evaluate((el) => !el.validity.valid);

  // Approach B: JS alert was shown
  const alertShown = dialogMsg !== null;

  // At least one validation mechanism must have triggered
  expect(isTitleInvalid || alertShown).toBeTruthy();

  // Assert: no task card with empty/blank title was added
  const blankTaskHeadings = await page.locator('h4').filter({ hasText: /^\s*$/ }).count();
  expect(blankTaskHeadings).toBe(0);
});

/**
 * TC_ADD_04
 * Title  : Attempt to add a task with Due Date field empty (mandatory validation)
 * Steps  : Enter valid title → Leave due date empty → Click Add Task
 * Expect : Task NOT created; validation error / alert shown for required Due Date
 */
test('TC_ADD_04 - Add task fails when Due Date is empty (validation)', async ({ page }) => {
  const addPage = new AddTaskPage(page);
  const data    = ADD_TASK_DATA.TC_ADD_04;

  // Capture any dialog (alert) that may appear
  const dialogPromise = captureDialogMessage(page);

  // Fill title only, leave due date empty
  await addPage.fillTitle(data.title);
  await addPage.clickAddTask();

  const dialogMsg = await dialogPromise;

  // Approach A: browser native validation (due date input marked invalid)
  const isDueDateInvalid = await page
    .locator('aside').first()
    .locator('input[type="datetime-local"]')
    .evaluate((el) => !el.validity.valid);

  // Approach B: JS alert was shown
  const alertShown = dialogMsg !== null;

  // At least one validation mechanism must have triggered
  expect(isDueDateInvalid || alertShown).toBeTruthy();

  // Assert: task titled 'Test Task' was NOT added to the list
  const taskExists = await page.locator('h4').filter({ hasText: data.title }).count();
  expect(taskExists).toBe(0);
});

/**
 * TC_ADD_05
 * Title  : Reset the Add Task form clears all entered data
 * Steps  : Fill all fields → Click Reset → Check all fields are cleared
 * Expect : Title blank, Description blank, Due Date blank, Status = TODO
 * NOTE   : This test documents a known BUG in the application.
 *          resetForm() throws TypeError on script.js:151 — refs.formTitle is undefined.
 *          The test is marked as expected-to-fail until the bug is fixed.
 */
test('TC_ADD_05 - Reset button clears all Add Task form fields', async ({ page }) => {
  const addPage = new AddTaskPage(page);
  const data    = ADD_TASK_DATA.TC_ADD_05;

  // Fill all fields with test data
  await addPage.fillTitle(data.title);
  await addPage.fillDescription(data.description);
  await addPage.fillDueDate(data.dueDate);
  await addPage.selectStatus(data.status);

  // Click Reset
  await addPage.clickReset();

  // Assert all fields are cleared / reset to defaults
  // BUG: The following assertions will FAIL due to script.js:151 TypeError
  // refs.formTitle becomes undefined after DOM re-renders task cards.
  expect(await addPage.getTitleValue()).toBe('');
  expect(await addPage.getDescriptionValue()).toBe('');
  expect(await addPage.getDueDateValue()).toBe('');

  // Status should revert to TODO (value "TODO")
  const statusValue = await addPage.getStatusValue();
  expect(statusValue).toBe('TODO');
});
