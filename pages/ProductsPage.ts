import type { Locator, Page } from "@playwright/test";
import type { ProductInput } from "@/pages/types";

export class ProductsPage {
  constructor(private readonly page: Page) {}

  get addButton(): Locator {
    return this.page.getByRole("button", { name: "Добавить позицию" });
  }

  get nameInputs(): Locator {
    return this.page.getByRole("textbox", { name: "Название" });
  }

  get priceInputs(): Locator {
    return this.page.getByRole("spinbutton", { name: "Цена" });
  }

  get continueButton(): Locator {
    return this.page.getByRole("button", { name: "Перейти к результатам" });
  }

  get removeButtons(): Locator {
    return this.page.locator("button", {
      has: this.page.locator(".mdi-window-close"),
    });
  }

  totalText(amount: number): Locator {
    return this.page.getByText(`Общий счет: ${amount}`);
  }

  async addBlankProduct(): Promise<void> {
    await this.addButton.click();
  }

  async fillProductFields(
    index: number,
    name: string,
    price: string,
  ): Promise<void> {
    console.log(name);

    await this.nameInputs.nth(index).fill(name);
    await this.priceInputs.nth(index).fill(price);
  }

  async addProduct(product: ProductInput): Promise<void> {
    await this.addBlankProduct();
    const index = (await this.nameInputs.count()) - 1;
    await this.fillProductFields(index, product.name, String(product.price));
    await this.page
      .getByRole("button")
      .filter({ has: this.page.locator(".mdi-chevron-down") })
      .last()
      .click();

    await this.page.getByRole("combobox").last().click();
    await this.page
      .getByRole("option", { name: product.payer, exact: true })
      .click();

    for (const eater of product.eaters) {
      await this.page
        .getByRole("checkbox", { name: eater, exact: true })
        .last()
        .check();
    }
  }

  async removeProductByIdx(index: number): Promise<void> {
    await this.removeButtons.nth(index).click();
  }

  async continueToResults(): Promise<void> {
    await this.continueButton.click();
  }
}
