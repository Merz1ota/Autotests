import { expect, test } from "@playwright/test";
import {
  addParticipants,
  addProduct,
  readStoredProducts,
  resetApplication,
} from "@/utils";

test.beforeEach(async ({ page }) => {
  await resetApplication(page);
  await addParticipants(page);
});

test("проверяет обязательные поля и запрещает дубли названий продуктов", async ({
  page,
}) => {
  await page.getByRole("button", { name: "Добавить позицию" }).click();
  const nextButton = page.getByRole("button", {
    name: "Перейти к результатам",
  });
  await expect(nextButton).toBeDisabled();

  await page.getByRole("textbox", { name: "Название" }).fill("Пицца");
  await page.getByRole("spinbutton", { name: "Цена" }).fill("0");
  await expect(nextButton).toBeDisabled();

  await page.getByRole("spinbutton", { name: "Цена" }).fill("900");
  await expect(nextButton).toBeEnabled();
  await page.getByRole("button", { name: "Добавить позицию" }).click();
  await page.getByRole("textbox", { name: "Название" }).nth(1).fill("пицца");
  await page.getByRole("spinbutton", { name: "Цена" }).nth(1).fill("100");
  await expect(nextButton).toBeDisabled();
});

test("считает общую сумму с сохранением плательщика и потребителей позиций продуктов (кто что ел)", async ({
  page,
}) => {
  await addProduct(page, {
    name: "Пицца",
    price: 900,
    payer: "Илья",
    eaters: ["Илья", "Лиза"],
  });

  await expect(page.getByText("Общий счет: 900")).toBeVisible();
  await page.getByRole("button", { name: "Перейти к результатам" }).click();
  await expect
    .poll(() => readStoredProducts(page))
    .toEqual([
      {
        id: 1,
        name: "Пицца",
        price: "900",
        userPayer: "Илья",
        usersAte: [
          { id: 1, name: "Илья" },
          { id: 2, name: "Лиза" },
        ],
      },
    ]);
});

test("удаляет продукт из списка и пересчитывает общий счет", async ({
  page,
}) => {
  await addProduct(page, {
    name: "Кофе",
    price: 250,
    payer: "Лиза",
    eaters: ["Лиза"],
  });
  await expect(page.getByText("Общий счет: 250")).toBeVisible();

  await page
    .locator("button", { has: page.locator(".mdi-window-close") })
    .click();

  await expect(page.getByText("Общий счет: 0")).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Перейти к результатам" }),
  ).toHaveCount(0);
});
