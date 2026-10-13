import type { Locator, Page } from "@playwright/test";

export class UsersPage {
  constructor(private readonly page: Page) {}

  get addButton(): Locator {
    return this.page.getByRole("button", { name: "Добавить пользователя" });
  }

  get nameInputs(): Locator {
    return this.page.getByRole("textbox", { name: "Имя" });
  }

  get saveButton(): Locator {
    return this.page.getByRole("button", { name: "Сохранить" });
  }

  get removeButtons(): Locator {
    return this.page.locator("button", {
      has: this.page.locator(".mdi-window-close"),
    });
  }

  async openHome(): Promise<void> {
    await this.page.goto("");
  }

  async addParticipant(name?: string): Promise<void> {
    await this.addButton.click();
    if (name !== undefined) {
      await this.nameInputs.last().fill(name);
    }
  }

  async fillParticipantName(index: number, name: string): Promise<void> {
    await this.nameInputs.nth(index).fill(name);
  }

  async removeParticipantAt(index: number): Promise<void> {
    await this.removeButtons.nth(index).click();
  }

  async saveParticipants(): Promise<void> {
    await this.saveButton.click();
  }
}
