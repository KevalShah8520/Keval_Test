// test-data/taskData.js
// ─────────────────────────────────────────────────────────────────────────────
// Centralised test data for Add Task & Edit Task test suites.
// All values are sourced directly from the Google Sheet:
//   Spreadsheet ID : 1eMrLEnUlbPhS7D7-cayoFTD3txCaTv44CzWkN5yMZSk
//   Tab            : "Task Test Cases"
// ─────────────────────────────────────────────────────────────────────────────

// ── Credentials ───────────────────────────────────────────────────────────────

const CREDENTIALS = {
  username: 'demo@todo.test',
  password: 'Demo@123',
};

// ── Add Task Test Data ────────────────────────────────────────────────────────

const ADD_TASK_DATA = {

  /**
   * TC_ADD_01 — Add task with valid required fields only
   * Steps : Enter title → Enter due date → Leave status as TODO → Click Add Task
   */
  TC_ADD_01: {
    title:              'Buy Milk',
    dueDate:            '2026-04-25T10:00',
    status:             'TODO',
    expectedStatusText: 'TODO',
  },

  /**
   * TC_ADD_02 — Add task with all fields filled
   * Steps : Enter all fields including description and In Progress status
   */
  TC_ADD_02: {
    title:              'Write Report',
    description:        'Q1 report draft',
    dueDate:            '2026-04-30T09:00',
    status:             'In Progress',
    expectedStatusText: 'In Progress',
  },

  /**
   * TC_ADD_03 — Validation: empty Title
   * Steps : Leave Title empty → Enter due date → Click Add Task
   */
  TC_ADD_03: {
    title:   '',
    dueDate: '2026-04-25T10:00',
    status:  'TODO',
  },

  /**
   * TC_ADD_04 — Validation: empty Due Date
   * Steps : Enter title → Leave Due Date empty → Click Add Task
   */
  TC_ADD_04: {
    title:   'Test Task',
    dueDate: '',
    status:  'TODO',
  },

  /**
   * TC_ADD_05 — Reset form clears all fields
   * Steps : Fill all fields → Click Reset
   * NOTE  : KNOWN BUG — Reset throws TypeError on script.js:151.
   *         Fields are NOT cleared. Test is expected to FAIL until bug is fixed.
   */
  TC_ADD_05: {
    title:       'Sample',
    description: 'Test desc',
    dueDate:     '2026-04-20T10:00',
    status:      'In Progress',
  },
};

// ── Edit Task Test Data ───────────────────────────────────────────────────────

const EDIT_TASK_DATA = {

  /**
   * TC_EDIT_01 — Update task title and save
   */
  TC_EDIT_01: {
    newTitle: 'Updated Grocery List',
  },

  /**
   * TC_EDIT_02 — Update description and due date and save
   */
  TC_EDIT_02: {
    newDescription: 'Updated description text',
    newDueDate:     '2026-05-01T11:00',
  },

  /**
   * TC_EDIT_03 — Change task status to Completed
   */
  TC_EDIT_03: {
    newStatus: 'Completed',
  },

  /**
   * TC_EDIT_04 — Attempt to save with Title cleared (validation)
   * newTitle is intentionally empty to trigger required-field validation
   */
  TC_EDIT_04: {
    newTitle: '',
  },

  /**
   * TC_EDIT_05 — Discard changes reverts to original data
   * These values are entered but discarded — must NOT appear in the task list
   */
  TC_EDIT_05: {
    modifiedTitle:       'Discarded Title',
    modifiedDescription: 'Should not save',
  },
};

module.exports = { CREDENTIALS, ADD_TASK_DATA, EDIT_TASK_DATA };
