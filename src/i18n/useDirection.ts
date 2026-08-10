import { useTranslation } from "react-i18next"

import { storeLanguage, type SupportedLanguage } from "@/i18n"

const RTL_LANGUAGES: readonly SupportedLanguage[] = ["ar"]

type Direction = "ltr" | "rtl"

export function useDirection() {
  const { i18n } = useTranslation()
  const language = i18n.language as SupportedLanguage
  const isRtl = RTL_LANGUAGES.includes(language)
  const dir: Direction = isRtl ? "rtl" : "ltr"

  function setLanguage(next: SupportedLanguage) {
    storeLanguage(next)
    void i18n.changeLanguage(next)
  }

  return { language, dir, isRtl, setLanguage }
}
