// pages/LoginPage.js
// Page Object Model for the Login page
// URL: https://keval-todo-list.netlify.app/login.html

class LoginPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;

    // ── Locators ──────────────────────────────────────────────────
    this.usernameInput      = page.getByPlaceholder('Enter username');
    this.passwordInput      = page.getByPlaceholder('Enter password');
    this.togglePasswordBtn  = page.getByRole('button', { name: 'Toggle password visibility' });
    this.rememberMeCheckbox = page.getByRole('checkbox', { name: 'Remember me' });
    this.loginButton        = page.getByRole('button', { name: 'Login' });
    this.clearButton        = page.getByRole('button', { name: 'Clear' });
    this.pageHeading        = page.getByRole('heading', { name: 'Login' });
  }

  // ── Actions ────────────────────────────────────────────────────

  /** Navigate to the login page */
  async goto() {
    await this.page.goto('/login.html');
  }

  /**
   * Perform a full login
   * @param {string} username
   * @param {string} password
   */
  async login(username, password) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  /** Login with demo credentials */
  async loginWithDemoCredentials() {
    await this.login('demo@todo.test', 'Demo@123');
  }

  /** Clear the login form */
  async clearForm() {
    await this.clearButton.click();
  }
}

module.exports = { LoginPage };
