import { test as base } from "@playwright/test";
import { ProductsPage } from "@split-bill-cafe/pages/ProductsPage";
import { ResultsPage } from "@split-bill-cafe/pages/ResultsPage";
import { UsersPage } from "@split-bill-cafe/pages/UsersPage";

interface PageFixtures {
  productsPage: ProductsPage;
  resultsPage: ResultsPage;
  usersPage: UsersPage;
}

export const test = base.extend<PageFixtures>({
  productsPage: async ({ page }, use) => {
    await use(new ProductsPage(page));
  },
  resultsPage: async ({ page }, use) => {
    await use(new ResultsPage(page));
  },
  usersPage: async ({ page }, use) => {
    await use(new UsersPage(page));
  },
});

export { expect } from "@playwright/test";
