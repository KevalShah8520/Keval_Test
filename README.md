# Keval Todo App — Playwright Automation Suite

Automated E2E tests for the **Add Task** and **Edit Task** modules of the
[Keval Todo App](https://keval-todo-list.netlify.app).

Test cases are sourced directly from the **"Task Test Cases"** Google Sheet tab.

---

## 📁 Project Structure

```
keval_test/
├── pages/                  ← Page Object Models (POM)
│   ├── LoginPage.js        ← Login page interactions
│   ├── AddTaskPage.js      ← New Task form interactions
│   ├── EditTaskPage.js     ← Edit Task panel interactions
│   ├── TaskListPage.js     ← Task list helpers
│   └── DashboardPage.js    ← Main dashboard / task list interactions
│
├── tests/                  ← Test Spec files
│   ├── addTask.spec.js     ← 5 test cases for Add Task (TC_ADD_01–05)
│   └── editTask.spec.js    ← 5 test cases for Edit Task (TC_EDIT_01–05)
│
├── test-data/
│   └── taskData.js         ← Centralised test data (from Google Sheet)
│
├── utils/
│   └── helpers.js          ← Shared utilities (login, dialog capture, etc.)
│
├── reports/                ← Auto-generated test reports (gitignored)
│   ├── html/               ← Playwright HTML report
│   ├── json/               ← JSON results
│   └── artifacts/          ← Screenshots / videos on failure
│
├── screenshots/            ← Failure screenshots (gitignored)
├── playwright.config.js    ← Playwright configuration
├── package.json
├── .gitignore
└── README.md
```

---

## 🚀 Setup & Installation

```bash
# 1. Clone the repository
git clone https://github.com/KevalShah8520/Keval_Test.git
cd Keval_Test

# 2. Install dependencies
npm install

# 3. Install Playwright browsers
npx playwright install
```

---

## ▶️ Running Tests

| Command | Description |
|---------|-------------|
| `npm test` | Run all tests (headless) |
| `npm run test:headed` | Run all tests in headed (visible) browser |
| `npm run test:add` | Run only Add Task tests |
| `npm run test:edit` | Run only Edit Task tests |
| `npm run test:debug` | Run in Playwright debug/step mode |
| `npm run test:report` | Open the last HTML report |

---

## 🧪 Test Case Summary

### Add Task Module (`tests/addTask.spec.js`)

| TC ID | Test Case Title | Status |
|-------|----------------|--------|
| TC_ADD_01 | Add a task with all valid required fields | ✅ PASS |
| TC_ADD_02 | Add a task with all fields (Title, Description, Due Date, Status) | ✅ PASS |
| TC_ADD_03 | Attempt to add a task with Title field empty (mandatory validation) | ✅ PASS |
| TC_ADD_04 | Attempt to add a task with Due Date field empty (mandatory validation) | ✅ PASS |
| TC_ADD_05 | Reset the Add Task form clears all entered data | ❌ FAIL |

### Edit Task Module (`tests/editTask.spec.js`)

| TC ID | Test Case Title | Status |
|-------|----------------|--------|
| TC_EDIT_01 | Edit an existing task's title and save successfully | ✅ PASS |
| TC_EDIT_02 | Edit task description and due date and save | ✅ PASS |
| TC_EDIT_03 | Change task status from TODO to Completed via Edit panel | ✅ PASS |
| TC_EDIT_04 | Attempt to save edit with Title field cleared (mandatory validation) | ✅ PASS |
| TC_EDIT_05 | Discard changes in Edit panel reverts to original task data | ✅ PASS |

---

## 🐛 Known Bug — TC_ADD_05

- **Severity:** High
- **Location:** `script.js:151` inside `resetForm()` function on the app
- **Error:** `TypeError: Cannot set properties of undefined (setting 'textContent')`
- **Root Cause:** `refs.formTitle` DOM reference becomes `undefined` after page re-renders task cards. The Reset handler tries to set `refs.formTitle.textContent` on a stale reference.
- **Impact:** Reset button is completely non-functional — all form fields remain populated.
- **Fix Suggested:** Re-query `refs.formTitle` inside `resetForm()` instead of using a cached reference.

---

## ⚙️ Configuration

- **Base URL:** `https://keval-todo-list.netlify.app`
- **Browser:** Chromium (Firefox & WebKit available — uncomment in `playwright.config.js`)
- **Retries:** 1 retry on failure
- **Reports:** HTML + JSON
- **Artifacts:** Screenshots & videos saved on failure

---

## 🔐 Credentials

Demo credentials are stored in `test-data/taskData.js`:

```
Username: demo@todo.test
Password: Demo@123
```

---

## 📊 Test Results Source

Test cases and execution results are tracked in the Google Sheet:
**Sheet ID:** `1eMrLEnUlbPhS7D7-cayoFTD3txCaTv44CzWkN5yMZSk`
**Tab:** `Task Test Cases`
