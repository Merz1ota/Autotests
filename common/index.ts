import type { Page } from "@playwright/test";

export const resetApplication = async (page: Page): Promise<void> => {
  await page.goto("");
  await page.evaluate(() => localStorage.clear());
  await page.reload();
};
