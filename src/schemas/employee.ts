import { z } from "zod"

import { sarAmount } from "@/schemas/common"

export const employeeFormSchema = z.object({
  employeeName: z
    .string()
    .trim()
    .min(2, "Employee name must be at least 2 characters")
    .max(80, "Employee name must be at most 80 characters"),
  nationalId: z
    .string()
    .trim()
    .regex(/^\d{10}$/, "National ID / Iqama must be exactly 10 digits"),
  nationality: z.string().trim().min(1, "Nationality is required"),
  laborExpense: sarAmount("Labor expense"),
  saudization: sarAmount("Saudization"),
})

export type EmployeeFormInput = z.input<typeof employeeFormSchema>
export type EmployeeFormValues = z.output<typeof employeeFormSchema>

export type Employee = EmployeeFormValues & {
  id: string
  createdAt: string
  updatedAt: string
}
