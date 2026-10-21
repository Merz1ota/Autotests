import { test as base } from "@playwright/test";
import { MainPage } from "@healthy-lifestyle/pages/MainPage";
import { PersonalizationModal } from "./pages/components/PersonalizationModal";
import { PersonalizationInfo } from "./pages/components/PersonalizationInfo";

interface HealthyFuxtures {
  mainPage: MainPage;
  personalizationModal: PersonalizationModal;
  personalizationInfo: PersonalizationInfo;
}

export const test = base.extend<HealthyFuxtures>({
  mainPage: async ({ page }, use) => {
    await use(new MainPage(page));
  },
  personalizationModal: async ({ page }, use) => {
    await use(new PersonalizationModal(page));
  },
  personalizationInfo: async ({ page }, use) => {
    await use(new PersonalizationInfo(page));
  },
});

export { expect } from "@playwright/test";
