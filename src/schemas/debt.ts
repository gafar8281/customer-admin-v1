import type { TFunction } from "i18next"
import { z } from "zod"

import { sarAmount } from "@/schemas/common"

export function buildDebtFormSchema(t: TFunction) {
  return z.object({
    customer: z
      .string()
      .trim()
      .min(2, t("validation.customerNameMin"))
      .max(80, t("validation.customerNameMax")),
    note: z.string().trim().max(200, t("validation.noteMax")).optional(),
    debtWeOwe: sarAmount(t, "debtWeOwe"),
  })
}

export type DebtFormInput = z.input<ReturnType<typeof buildDebtFormSchema>>
export type DebtFormValues = z.output<ReturnType<typeof buildDebtFormSchema>>

export type Debt = DebtFormValues & {
  id: string
  createdAt: string
  updatedAt: string
}
