import { useMemo } from "react"

import { useDirection } from "@/i18n/useDirection"

const CURRENCY_LOCALES: Record<string, string> = {
  en: "en-SA",
  ar: "ar-SA-u-nu-latn",
}

const DATE_LOCALES: Record<string, string> = {
  en: "en-GB",
  ar: "ar-SA-u-nu-latn",
}

// Forces the Gregorian calendar — plain "ar-SA" implies the Umm al-Qura (Hijri)
// calendar in Intl.DateTimeFormat, which would render month names like "ذو القعدة".
const MONTH_LOCALES: Record<string, string> = {
  en: "en-GB",
  ar: "ar-SA-u-nu-latn-ca-gregory",
}

export function useFormat() {
  const { language } = useDirection()

  return useMemo(() => {
    const sarFormatter = new Intl.NumberFormat(CURRENCY_LOCALES[language], {
      style: "currency",
      currency: "SAR",
      maximumFractionDigits: 2,
    })

    const dateFormatter = new Intl.DateTimeFormat(DATE_LOCALES[language], {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })

    const monthYearFormatter = new Intl.DateTimeFormat(
      MONTH_LOCALES[language],
      { month: "long", year: "numeric", timeZone: "UTC" }
    )

    const monthNameFormatter = new Intl.DateTimeFormat(
      MONTH_LOCALES[language],
      { month: "long", timeZone: "UTC" }
    )

    return {
      formatSAR: (amount: number) => sarFormatter.format(amount),
      formatDate: (iso: string) => dateFormatter.format(new Date(iso)),
      formatMonth: (year: number, month: number) =>
        monthYearFormatter.format(new Date(Date.UTC(year, month - 1, 1))),
      formatMonthName: (month: number) =>
        monthNameFormatter.format(new Date(Date.UTC(2000, month - 1, 1))),
    }
  }, [language])
}
