/**
 * Minimal i18n mock for Storybook.
 *
 * This provides a simple `t()` function that returns the key itself,
 * so translated components render without errors in stories.
 * For stories that need specific translations, override via decorators.
 */
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Only initialize if not already initialized
if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    lng: "fr",
    fallbackLng: "fr",
    ns: ["common"],
    defaultNS: "common",
    interpolation: {
      escapeValue: false,
    },
    resources: {
      fr: {
        common: {},
      },
    },
  });
}

export default i18n;
