import type { Locator, Page } from "@playwright/test";

export class ResultsPage {
  constructor(private readonly page: Page) {}

  get rows(): Locator {
    return this.page.getByRole("row");
  }

  get cells(): Locator {
    return this.page.getByRole("cell");
  }

  debtRowFor(participant: string): Locator {
    return this.page.getByRole("row").filter({ hasText: participant });
  }

  get resetButton(): Locator {
    return this.page.getByRole("button", { name: "Начать занаво" });
  }

  async reset(): Promise<void> {
    await this.resetButton.click();
  }
}
