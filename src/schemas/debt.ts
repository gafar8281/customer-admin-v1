import { z } from "zod"

import { sarAmount } from "@/schemas/common"

export const debtFormSchema = z.object({
  customer: z
    .string()
    .trim()
    .min(2, "Customer name must be at least 2 characters")
    .max(80, "Customer name must be at most 80 characters"),
  note: z
    .string()
    .trim()
    .max(200, "Note must be at most 200 characters")
    .optional(),
  debtWeOwe: sarAmount("Debt amount"),
})

export type DebtFormInput = z.input<typeof debtFormSchema>
export type DebtFormValues = z.output<typeof debtFormSchema>

export type Debt = DebtFormValues & {
  id: string
  createdAt: string
  updatedAt: string
}
