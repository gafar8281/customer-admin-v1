import type { TFunction } from "i18next"
import { z } from "zod"

import { integerCount, sarAmount } from "@/schemas/common"
import { NATIONALITY_CODES } from "@/lib/nationalities"

export function buildEmployeeFormSchema(t: TFunction) {
  return z.object({
    employeeName: z
      .string()
      .trim()
      .min(2, t("validation.employeeNameMin"))
      .max(80, t("validation.employeeNameMax")),
    nationalId: z
      .string()
      .trim()
      .regex(/^\d{10}$/, t("validation.nationalIdFormat")),
    nationality: z.enum(NATIONALITY_CODES, {
      error: t("validation.nationalityRequired"),
    }),
    laborExpense: sarAmount(t, "laborExpense"),
    saudization: sarAmount(t, "saudization"),
    occupationalHazards: integerCount(t, "occupationalHazards"),
    saudiSalaries: integerCount(t, "saudiSalaries"),
  })
}

export type EmployeeFormInput = z.input<ReturnType<typeof buildEmployeeFormSchema>>
export type EmployeeFormValues = z.output<
  ReturnType<typeof buildEmployeeFormSchema>
>

export type Employee = EmployeeFormValues & {
  id: string
  createdAt: string
  updatedAt: string
}
