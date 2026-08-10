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

    return {
      formatSAR: (amount: number) => sarFormatter.format(amount),
      formatDate: (iso: string) => dateFormatter.format(new Date(iso)),
    }
  }, [language])
}
