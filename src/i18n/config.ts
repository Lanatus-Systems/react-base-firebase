import i18n from "i18next";
import englishPhrases from "./en/translation.json";
import frenchPhrases from "./fr/translation.json";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { ENGLISH, FRENCH } from "./languages";

export const resources = {
  [ENGLISH]: {
    phrases: englishPhrases,
  },
  [FRENCH]: {
    phrases: frenchPhrases,
  },
} as const;

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    ns: ["phrases"],
    fallbackLng: ENGLISH,
    whitelist: [ENGLISH, FRENCH],
    interpolation: {
      escapeValue: false,
    },
    resources,
  });
