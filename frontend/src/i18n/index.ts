import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import common from "./common";

const defaultLanguage = import.meta.env.VITE_DEFAULT_LANGUAGE || "en";

const resources = {
  de: { translation: { ...common.de.translation } },
  en: { translation: { ...common.en.translation } },
  fr: { translation: { ...common.fr.translation } },
};

i18n.use(initReactI18next).init({
  lng: defaultLanguage,
  fallbackLng: defaultLanguage,
  debug: true,
  interpolation: { escapeValue: false },
  resources,
});

export default i18n;
