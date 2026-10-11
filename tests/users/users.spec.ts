import { expect, test } from "@playwright/test";
import { addUser, readStoredUsers, resetApplication } from "@/utils";

test.beforeEach(async ({ page }) => {
  await resetApplication(page);
});

test("сохраняет участников и восстанавливает их после перехода на главную страницу", async ({
  page,
}) => {
  await addUser(page, "Илья");
  await addUser(page, "Лиза");
  await page.getByRole("button", { name: "Сохранить" }).click();
  await expect(page).toHaveURL(/\/products$/);

  await expect
    .poll(() => readStoredUsers(page))
    .toEqual([
      { id: 1, name: "Илья" },
      { id: 2, name: "Лиза" },
    ]);

  await page.goto("");
  await expect(page.getByRole("textbox", { name: "Имя" }).nth(0)).toHaveValue(
    "Илья",
  );
  await expect(page.getByRole("textbox", { name: "Имя" }).nth(1)).toHaveValue(
    "Лиза",
  );
});

test("запрещает пустые и повторяющиеся имена без учета регистра", async ({
  page,
}) => {
  await page.getByRole("button", { name: "Добавить пользователя" }).click();
  await expect(page.getByRole("button", { name: "Сохранить" })).toBeDisabled();

  await page.getByRole("textbox", { name: "Имя" }).last().fill("Илья");
  await page.getByRole("button", { name: "Добавить пользователя" }).click();
  await page.getByRole("textbox", { name: "Имя" }).last().fill("Илья");
  await expect(page.getByRole("button", { name: "Сохранить" })).toBeDisabled();
});

test("удаляет участника из списка перед тем как продолжить", async ({
  page,
}) => {
  await addUser(page, "Илья");
  await addUser(page, "Лиза");

  await page
    .locator("button", { has: page.locator(".mdi-window-close") })
    .first()
    .click();

  await expect(page.getByRole("textbox", { name: "Имя" })).toHaveCount(1);
  await expect(page.getByRole("textbox", { name: "Имя" }).first()).toHaveValue(
    "Лиза",
  );
  await expect(page.getByRole("button", { name: "Сохранить" })).toBeEnabled();
});
