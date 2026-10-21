import { Locator, Page } from "@playwright/test";

export class PersonalizationModal {
  constructor(private readonly page: Page) {}

  get ageInput(): Locator {
    return this.page.getByRole("spinbutton", { name: "Возраст" });
  }

  get heightInput(): Locator {
    return this.page.getByRole("spinbutton", { name: "Рост" });
  }

  get weightInput(): Locator {
    return this.page.getByRole("spinbutton", { name: "Вес" });
  }

  get genderMale(): Locator {
    return this.page.getByRole("radio", { name: "М" });
  }

  get genderFemale(): Locator {
    return this.page.getByRole("radio", { name: "Ж" });
  }

  get levelActivity(): Locator {
    return this.page.locator(".mdi-menu-down");
  }

  get lowLevelActivity(): Locator {
    return this.page.getByText("Слабый уровень активности");
  }

  get okButton(): Locator {
    return this.page.getByRole("button", { name: "Ok" });
  }
}
