import type { TFunction } from "i18next"
import { z } from "zod"

export function sarAmount(t: TFunction, fieldKey: string) {
  const field = t(`validation.fields.${fieldKey}`)
  return z.preprocess(
    (value) => (value === "" || value === null ? undefined : value),
    z
      .coerce.number({ error: t("validation.amountRequired", { field }) })
      .nonnegative(t("validation.amountNegative", { field }))
  )
}

export function integerCount(t: TFunction, fieldKey: string) {
  const field = t(`validation.fields.${fieldKey}`)
  return z.preprocess(
    (value) => (value === "" || value === null ? undefined : value),
    z
      .coerce.number({ error: t("validation.amountRequired", { field }) })
      .int(t("validation.amountInteger", { field }))
      .nonnegative(t("validation.amountNegative", { field }))
  )
}

export const PAYMENT_OPTIONS = ["monthly", "quarterly", "half_yearly", "yearly"] as const

export type Payment = (typeof PAYMENT_OPTIONS)[number]
