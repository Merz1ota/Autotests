import { Locator, Page } from "@playwright/test";

export class PersonalizationInfo {
  constructor(private readonly page: Page) {}

  get cardContainer(): Locator {
    return this.page.locator(".v-card-text");
  }

  get age(): Locator {
    const ageRow = this.cardContainer
      .locator(".v-row")
      .filter({ hasText: "Возраст" });
    return ageRow.locator(".v-col").nth(1);
  }

  get height(): Locator {
    const heightRow = this.cardContainer
      .locator(".v-row")
      .filter({ hasText: "Рост" });
    return heightRow.locator(".v-col").nth(1);
  }

  get weight(): Locator {
    const weightRow = this.cardContainer
      .locator(".v-row")
      .filter({ hasText: "Вес" });
    return weightRow.locator(".v-col").nth(1);
  }

  get calorieNorm(): Locator {
    const calorieNormRow = this.cardContainer
      .locator(".v-row")
      .filter({ hasText: "Дневная норма калорий" });
    return calorieNormRow.locator(".v-col").nth(1);
  }

  get activity(): Locator {
    const activity = this.cardContainer
      .locator(".v-row")
      .filter({ hasText: "Активность" });
    return activity.locator(".v-col").nth(1);
  }
}
