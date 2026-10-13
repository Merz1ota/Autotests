import { expect, test } from "@playwright/test";
import { ProductsPage } from "@/pages/ProductsPage";
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
  const productsPage = new ProductsPage(page);
  await productsPage.addBlankProduct();
  await expect(productsPage.continueButton).toBeDisabled();

  await productsPage.fillProductFields(0, "Пицца", "0");
  await expect(productsPage.continueButton).toBeDisabled();

  await productsPage.fillProductFields(0, "Пицца", "900");
  await expect(productsPage.continueButton).toBeEnabled();
  await productsPage.addBlankProduct();
  await productsPage.fillProductFields(1, "пицца", "100");
  await expect(productsPage.continueButton).toBeDisabled();
});

test("считает общую сумму с сохранением плательщика и потребителей продуктов", async ({
  page,
}) => {
  const productsPage = new ProductsPage(page);
  await addProduct(page, {
    name: "Пицца",
    price: 900,
    payer: "Илья",
    eaters: ["Илья", "Лиза"],
  });

  await expect(productsPage.totalText(900)).toBeVisible();
  await productsPage.continueToResults();
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
  const productsPage = new ProductsPage(page);
  await addProduct(page, {
    name: "Кофе",
    price: 250,
    payer: "Лиза",
    eaters: ["Лиза"],
  });
  await expect(productsPage.totalText(250)).toBeVisible();

  await productsPage.removeProductByIdx(0);

  await expect(productsPage.totalText(0)).toBeVisible();
  await expect(productsPage.continueButton).toHaveCount(0);
});
