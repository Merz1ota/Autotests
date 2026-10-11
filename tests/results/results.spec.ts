import { expect, test } from "@playwright/test";
import {
  addParticipants,
  addProduct,
  openResults,
  resetApplication,
} from "@/utils";

test.beforeEach(async ({ page }) => {
  await resetApplication(page);
  await addParticipants(page);
});

test("делит общую позицию между участниками и сбрасывает счет", async ({
  page,
}) => {
  await addProduct(page, {
    name: "Пицца",
    price: 900,
    payer: "Илья",
    eaters: ["Илья", "Лиза"],
  });
  await openResults(page);

  const debtRow = page.getByRole("row").filter({ hasText: "Лиза" });
  await expect(debtRow).toContainText("Илья");
  await expect(debtRow).toContainText("450");

  await page.getByRole("button", { name: "Начать занаво" }).click();
  await expect(page).toHaveURL(/\/split_bill_cafe\/$/);
  await expect(page.getByText("Список пуст...")).toBeVisible();
});

test("не создает долг, если позицию оплатил единственный участник, который ее ел", async ({
  page,
}) => {
  await addProduct(page, {
    name: "Кофе",
    price: 250,
    payer: "Илья",
    eaters: ["Илья"],
  });
  await openResults(page);
  await expect(page.getByRole("cell")).toHaveCount(0);
});

test("взаимно засчитывает долги участников", async ({ page }) => {
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

  const netDebtRow = page
    .getByRole("row")
    .filter({ hasText: "Лиза" })
    .filter({ hasText: "30" });
  await expect(netDebtRow).toContainText("Илья");
  await expect(netDebtRow).toContainText("30");
  const cancelledDebtRow = page
    .getByRole("row")
    .filter({ hasText: "Илья" })
    .filter({ hasText: "Лиза" })
    .filter({ has: page.getByRole("cell", { name: "0", exact: true }) });
  await expect(cancelledDebtRow).toHaveCount(1);
});
