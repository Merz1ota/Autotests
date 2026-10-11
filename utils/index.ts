import { expect } from "@playwright/test";
import type { Page } from "@playwright/test";

export type StoredUser = {
  id: number;
  name: string;
};

export type StoredProduct = {
  id: number;
  name: string;
  price: string;
  userPayer: string;
  usersAte: StoredUser[];
};

export type ProductInput = {
  name: string;
  price: number;
  payer: string;
  eaters: string[];
};

export const resetApplication = async (page: Page): Promise<void> => {
  await page.goto("");
  await page.evaluate(() => localStorage.clear());
  await page.reload();
};

export const addUser = async (page: Page, name: string): Promise<void> => {
  await page.getByRole("button", { name: "Добавить пользователя" }).click();
  await page.getByRole("textbox", { name: /Имя/ }).last().fill(name);
};

export const addParticipants = async (page: Page): Promise<void> => {
  await addUser(page, "Илья");
  await addUser(page, "Лиза");
  await page.getByRole("button", { name: "Сохранить" }).click();
  await expect(page).toHaveURL(/\/products$/);
};

export const addProduct = async (
  page: Page,
  product: ProductInput,
): Promise<void> => {
  await page.getByRole("button", { name: "Добавить позицию" }).click();
  await page
    .getByRole("textbox", { name: /Название/ })
    .last()
    .fill(product.name);
  await page
    .getByRole("spinbutton", { name: /Цена/ })
    .last()
    .fill(String(product.price));

  await page
    .getByRole("button")
    .filter({ has: page.locator(".mdi-chevron-down") })
    .last()
    .click();

  await page.getByRole("combobox").last().click();
  await page.getByRole("option", { name: product.payer, exact: true }).click();

  for (const eater of product.eaters) {
    await page
      .getByRole("checkbox", { name: eater, exact: true })
      .last()
      .check();
  }
};

export const readStoredUsers = (page: Page): Promise<StoredUser[] | null> =>
  page.evaluate((): StoredUser[] | null =>
    JSON.parse(localStorage.getItem("users") ?? "null"),
  );

export const readStoredProducts = (
  page: Page,
): Promise<StoredProduct[] | null> =>
  page.evaluate((): StoredProduct[] | null =>
    JSON.parse(localStorage.getItem("products") ?? "null"),
  );

export const openResults = async (page: Page): Promise<void> => {
  await page.getByRole("button", { name: "Перейти к результатам" }).click();
  await expect(page).toHaveURL(/\/results$/);
};
