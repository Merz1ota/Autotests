import { expect, test } from "@/fixtures/splitBillCafe";

import {
  addParticipants,
  addProduct,
  openResults,
  resetApplication,
} from "@/utils";

test.describe("Regression - Results", { tag: "@regression" }, () => {
  test.beforeEach(async ({ page }) => {
    await resetApplication(page);
    await addParticipants(page);
  });

  test("делит общую позицию между участниками и сбрасывает счет", async ({
    resultsPage,
    page,
  }) => {
    await addProduct(page, {
      name: "Пицца",
      price: 900,
      payer: "Илья",
      eaters: ["Илья", "Лиза"],
    });
    await openResults(page);

    const debtRow = resultsPage.debtRowFor("Лиза");
    await expect(debtRow).toContainText("Илья");
    await expect(debtRow).toContainText("450");

    await resultsPage.reset();
    await expect(page).toHaveURL(/\/split_bill_cafe\/$/);
    await expect(page.getByText("Список пуст...")).toBeVisible();
  });

  test("не создает долг, если позицию оплатил единственный участник, который ее ел", async ({
    resultsPage,
    page,
  }) => {
    await addProduct(page, {
      name: "Кофе",
      price: 250,
      payer: "Илья",
      eaters: ["Илья"],
    });
    await openResults(page);
    await expect(resultsPage.cells).toHaveCount(0);
  });

  test("округляет долю 5,045 до 5,0", async ({ resultsPage, page }) => {
    await addProduct(page, {
      name: "Пицца",
      price: 10.09,
      payer: "Илья",
      eaters: ["Илья", "Лиза"],
    });
    await openResults(page);

    await expect(
      resultsPage.debtRowFor("Лиза").getByRole("cell").nth(2),
    ).toHaveText("5");
  });

  test("округляет половину десятой вверх: доля 5,05 отображается как 5,1", async ({
    resultsPage,
    page,
  }) => {
    await addProduct(page, {
      name: "Пицца",
      price: 10.1,
      payer: "Илья",
      eaters: ["Илья", "Лиза"],
    });
    await openResults(page);

    await expect(
      resultsPage.debtRowFor("Лиза").getByRole("cell").nth(2),
    ).toHaveText("5.1");
  });

  test("взаимно засчитывает долги участников", async ({
    resultsPage,
    page,
  }) => {
    await addProduct(page, {
      name: "Пицца",
      price: 100,
      payer: "Илья",
      eaters: ["Илья", "Лиза"],
    });
    await addProduct(page, {
      name: "Десерт",
      price: 40,
      payer: "Лиза",
      eaters: ["Илья", "Лиза"],
    });
    await openResults(page);

    const netDebtRow = resultsPage.debtRowFor("Лиза").filter({ hasText: "30" });
    await expect(netDebtRow).toContainText("Илья");
    await expect(netDebtRow).toContainText("30");
  });

  test("BUG-001: скрывает нулевую строку после взаимозачета", async ({
    resultsPage,
    page,
  }) => {
    test.fail(true, "BUG-001: приложение отображает строку с нулевым долгом");
    await addProduct(page, {
      name: "Пицца",
      price: 100,
      payer: "Илья",
      eaters: ["Илья", "Лиза"],
    });
    await addProduct(page, {
      name: "Десерт",
      price: 40,
      payer: "Лиза",
      eaters: ["Илья", "Лиза"],
    });
    await openResults(page);

    // Заголовок таблицы + одна строка с ненулевым остатком.
    await expect(resultsPage.rows).toHaveCount(2);
  });
});
