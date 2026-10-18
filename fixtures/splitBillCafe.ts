import { test as base } from "@playwright/test";
import { ProductsPage } from "../pages/ProductsPage";
import { ResultsPage } from "../pages/ResultsPage";
import { UsersPage } from "../pages/UsersPage";

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
