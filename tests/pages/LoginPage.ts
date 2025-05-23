export class LoginPage {
  constructor(private page: any) {}

  async login(username: string, password: string) {
    await this.page.fill('#LoginId', username);
    await this.page.fill('#password', password);
    await this.page.click('[type="submit"]');
  }
} 