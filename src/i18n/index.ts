import i18next from "i18next"
import { initReactI18next } from "react-i18next"

import ar from "@/i18n/locales/ar.json"
import en from "@/i18n/locales/en.json"

const LANGUAGE_STORAGE_KEY = "cas.lang"

export const SUPPORTED_LANGUAGES = ["en", "ar"] as const
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number]

function isSupportedLanguage(value: string | null): value is SupportedLanguage {
  return SUPPORTED_LANGUAGES.includes(value as SupportedLanguage)
}

function readStoredLanguage(): SupportedLanguage {
  try {
    const raw = window.localStorage.getItem(LANGUAGE_STORAGE_KEY)
    return isSupportedLanguage(raw) ? raw : "en"
  } catch {
    window.localStorage.removeItem(LANGUAGE_STORAGE_KEY)
    return "en"
  }
}

export function storeLanguage(language: SupportedLanguage) {
  window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language)
}

void i18next.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    ar: { translation: ar },
  },
  lng: readStoredLanguage(),
  fallbackLng: "en",
  interpolation: { escapeValue: false },
})

export default i18next
