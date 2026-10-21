import { defineConfig, devices } from "@playwright/test";

const SITES = {
  splitBillCafe: "https://merz1ota.github.io/split_bill_cafe/",
  healthyLifestyle: "https://merz1ota.github.io/Healthy_lifestyle/",
} as const;

export default defineConfig({
  testDir: "./projects",
  tsconfig: "./tsconfig.json",
  // testMatch: ["**/smoke/**/*.spec.ts", "**/regression/**/*.spec.ts"],
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
    // ...devices["Desktop Chrome"],
  },

  projects: [
    {
      name: "splitBillCafe",
      use: {
        baseURL: SITES.splitBillCafe,
        ...devices["Desktop Chrome"],
      },
      testMatch: /projects\/split_bill_cafe\/.*\.spec\.ts/,
    },
    {
      name: "healthyLifestyle",
      use: {
        baseURL: SITES.healthyLifestyle,
        ...devices["Desktop Chrome"],
      },
      testMatch: /projects\/healthy_lifestyle\/.*\.spec\.ts/,
    },
  ],
});
