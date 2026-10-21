import { test, expect } from "@healthy-lifestyle/fixtures";
import { resetApplication } from "@common";

test(
  "Заполнение персональными данными при первой загрузке страницы",
  { tag: "@smoke" },
  async ({ personalizationModal, personalizationInfo, page }) => {
    await resetApplication(page);
    await expect(page.getByText("Персонализация")).toBeVisible();

    await personalizationModal.ageInput.fill("25");
    await personalizationModal.heightInput.fill("187");
    await personalizationModal.weightInput.fill("65");
    await personalizationModal.genderMale.click();
    await personalizationModal.levelActivity.click();
    await personalizationModal.lowLevelActivity.click();

    await expect(personalizationModal.okButton).toBeEnabled();
    await personalizationModal.okButton.click();

    await expect(personalizationInfo.age).toHaveText("25");
    await expect(personalizationInfo.height).toHaveText("187 см");
    await expect(personalizationInfo.weight).toHaveText("65 кг");
    await expect(personalizationInfo.calorieNorm).toHaveText("2336 кКал");
    await expect(personalizationInfo.activity).toHaveText(
      "Слабый уровень активности",
    );
  },
);
