import type { TFunction } from "i18next"
import { z } from "zod"

import { sarAmount } from "@/schemas/common"

export function buildExpenseMonthFormSchema(t: TFunction) {
  return z.object({
    year: z.coerce
      .number({ error: t("validation.yearRequired") })
      .int(t("validation.yearRequired"))
      .min(2000, t("validation.yearRequired"))
      .max(2100, t("validation.yearRequired")),
    month: z.coerce
      .number({ error: t("validation.monthRequired") })
      .int(t("validation.monthRequired"))
      .min(1, t("validation.monthRequired"))
      .max(12, t("validation.monthRequired")),
  })
}

export type ExpenseMonthFormInput = z.input<
  ReturnType<typeof buildExpenseMonthFormSchema>
>
export type ExpenseMonthFormValues = z.output<
  ReturnType<typeof buildExpenseMonthFormSchema>
>

export type ExpenseMonth = ExpenseMonthFormValues & {
  id: string
  createdAt: string
  updatedAt: string
}

export function buildExpenseEntryFormSchema(t: TFunction, monthKey: string) {
  return z.object({
    statement: z
      .string()
      .trim()
      .min(2, t("validation.statementMin"))
      .max(120, t("validation.statementMax")),
    date: z
      .string()
      .min(1, t("validation.expenseDateRequired"))
      .refine((value) => !Number.isNaN(Date.parse(value)), {
        message: t("validation.expenseDateInvalid"),
      })
      .refine((value) => value.slice(0, 7) === monthKey, {
        message: t("validation.expenseDateOutOfMonth"),
      }),
    amountDisbursed: sarAmount(t, "amountDisbursed"),
  })
}

export type ExpenseEntryFormInput = z.input<
  ReturnType<typeof buildExpenseEntryFormSchema>
>
export type ExpenseEntryFormValues = z.output<
  ReturnType<typeof buildExpenseEntryFormSchema>
>

export type ExpenseEntry = ExpenseEntryFormValues & {
  id: string
  createdAt: string
  updatedAt: string
}
