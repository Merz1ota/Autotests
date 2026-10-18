import { defineConfig, devices } from "@playwright/test";

const SITES = {
  splitBillCafe: "https://merz1ota.github.io/split_bill_cafe/",
} as const;

export default defineConfig({
  testDir: "./tests",
  tsconfig: "./tsconfig.json",
  testMatch: ["**/smoke/**/*.spec.ts", "**/regression/**/*.spec.ts"],
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: [
    ["list"],
    ["html", { outputFolder: "playwright-report", open: "never" }],
  ],
  use: {
    trace: "retain-on-failure",
    ...devices["Desktop Chrome"],
  },

  projects: Object.entries(SITES).map(([siteName, siteUrl]) => ({
    name: siteName,
    use: {
      baseURL: siteUrl,
      ...devices["Desktop Chrome"],
    },
  })),
});
