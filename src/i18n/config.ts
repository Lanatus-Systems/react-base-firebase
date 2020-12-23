import i18n from "i18next";
import englishPhrases from "./en/translation.json";
import frenchPhrases from "./fr/translation.json";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

export const resources = {
  en: {
    phrases: englishPhrases,
  },
  fr: {
    phrases: frenchPhrases,
  },
} as const;

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    ns: ["phrases"],
    fallbackLng: "en",
    whitelist: ["en", "fr"],
    interpolation: {
      escapeValue: false,
    },
    resources,
  });
