import { resetApplication } from "@common";
import { addProduct } from "@split-bill-cafe/utils";
import { test, expect } from "@split-bill-cafe/fixtures";

test(
  "Проходит полный сценарий разделения счета",
  {
    tag: ["@smoke", "@critical"],
  },
  async ({ usersPage, productsPage, resultsPage, page }) => {
    await resetApplication(page);

    await usersPage.addParticipant("Илья");
    await usersPage.addParticipant("Лиза");
    await usersPage.saveParticipants();
    await expect(page).toHaveURL(/\/products$/);

    await addProduct(page, {
      name: "Пицца",
      price: 900,
      payer: "Илья",
      eaters: ["Илья", "Лиза"],
    });
    await expect(productsPage.totalText(900)).toBeVisible();
    await productsPage.continueToResults();

    await expect(resultsPage.debtRowFor("Лиза")).toContainText("Илья");
    await expect(resultsPage.debtRowFor("Лиза")).toContainText("450");
  },
);
