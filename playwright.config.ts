import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  tsconfig: "./tsconfig.json",
  testMatch: [
    "**/users/**/*.spec.ts",
    "**/products/**/*.spec.ts",
    "**/results/**/*.spec.ts",
  ],
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: [
    ["list"],
    ["html", { outputFolder: "playwright-report", open: "never" }],
  ],
  use: {
    baseURL: "https://merz1ota.github.io/split_bill_cafe/",
    trace: "retain-on-failure",
    ...devices["Desktop Chrome"],
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
});
