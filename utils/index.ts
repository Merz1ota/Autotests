import { expect } from "@playwright/test";
import type { Page } from "@playwright/test";
import { ProductsPage } from "@/pages/ProductsPage";
import { UsersPage } from "@/pages/UsersPage";
import type { ProductInput } from "@/pages/types";

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

export const resetApplication = async (page: Page): Promise<void> => {
  await page.goto("");
  await page.evaluate(() => localStorage.clear());
  await page.reload();
};

export const addUser = async (page: Page, name: string): Promise<void> => {
  await new UsersPage(page).addParticipant(name);
};

export const addParticipants = async (page: Page): Promise<void> => {
  const usersPage = new UsersPage(page);
  await usersPage.addParticipant("Илья");
  await usersPage.addParticipant("Лиза");
  await usersPage.saveParticipants();
  await expect(page).toHaveURL(/\/products$/);
};

export const addProduct = async (
  page: Page,
  product: ProductInput,
): Promise<void> => {
  await new ProductsPage(page).addProduct(product);
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
  await new ProductsPage(page).continueToResults();
  await expect(page).toHaveURL(/\/results$/);
};
