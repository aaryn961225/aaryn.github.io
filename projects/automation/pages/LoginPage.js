class LoginPage {
  constructor(page) {
    this.page = page;
    this.userIdInput = page.getByLabel('帳號');
    this.passwordInput = page.getByLabel('密碼');
    this.loginButton = page.getByRole('button', { name: '登入' });
    this.loginStatus = page.getByRole('status').first();
  }

  async login(user) {
    await this.userIdInput.fill(user.userId);
    await this.passwordInput.fill(user.password);
    await this.loginButton.click();
  }
}

module.exports = { LoginPage };
