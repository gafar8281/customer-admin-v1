import type { TFunction } from "i18next"
import { z } from "zod"

import { sarAmount } from "@/schemas/common"

export function buildReceivableFormSchema(t: TFunction) {
  return z.object({
    customer: z
      .string()
      .trim()
      .min(2, t("validation.customerNameMin"))
      .max(80, t("validation.customerNameMax")),
    note: z.string().trim().max(200, t("validation.noteMax")).optional(),
    debtOwedToUs: sarAmount(t, "debtOwedToUs"),
  })
}

export type ReceivableFormInput = z.input<
  ReturnType<typeof buildReceivableFormSchema>
>
export type ReceivableFormValues = z.output<
  ReturnType<typeof buildReceivableFormSchema>
>

export type Receivable = ReceivableFormValues & {
  id: string
  createdAt: string
  updatedAt: string
}
