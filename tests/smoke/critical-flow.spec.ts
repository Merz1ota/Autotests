import { expect, test } from "@playwright/test";
import { ProductsPage } from "@/pages/ProductsPage";
import { ResultsPage } from "@/pages/ResultsPage";
import { UsersPage } from "@/pages/UsersPage";
import { addProduct, resetApplication } from "@/utils";

test(
  "Проходит полный сценарий разделения счета",
  {
    tag: ["@smoke", "@critical"],
  },
  async ({ page }) => {
    await resetApplication(page);

    const usersPage = new UsersPage(page);
    await usersPage.addParticipant("Илья");
    await usersPage.addParticipant("Лиза");
    await usersPage.saveParticipants();
    await expect(page).toHaveURL(/\/products$/);

    const productsPage = new ProductsPage(page);
    await addProduct(page, {
      name: "Пицца",
      price: 900,
      payer: "Илья",
      eaters: ["Илья", "Лиза"],
    });
    await expect(productsPage.totalText(900)).toBeVisible();
    await productsPage.continueToResults();

    const resultsPage = new ResultsPage(page);
    await expect(resultsPage.debtRowFor("Лиза")).toContainText("Илья");
    await expect(resultsPage.debtRowFor("Лиза")).toContainText("450");
  },
);
