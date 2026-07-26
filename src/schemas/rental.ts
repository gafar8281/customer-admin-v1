import { z } from "zod"

import { sarAmount } from "@/schemas/common"

export const rentalFormSchema = z
  .object({
    apartmentNumber: z
      .string()
      .trim()
      .min(1, "Apartment number is required")
      .max(20, "Apartment number must be at most 20 characters"),
    tenantName: z
      .string()
      .trim()
      .min(2, "Tenant name must be at least 2 characters")
      .max(80, "Tenant name must be at most 80 characters"),
    leaseExpiryDate: z
      .string()
      .min(1, "Lease expiry date is required")
      .refine((value) => !Number.isNaN(Date.parse(value)), {
        message: "Lease expiry date must be a valid date",
      }),
    totalAmount: sarAmount("Total amount"),
    paidAmount: sarAmount("Paid amount"),
  })
  .refine((values) => values.paidAmount <= values.totalAmount, {
    message: "Paid amount cannot exceed the total amount",
    path: ["paidAmount"],
  })

export type RentalFormInput = z.input<typeof rentalFormSchema>
export type RentalFormValues = z.output<typeof rentalFormSchema>

export type Rental = RentalFormValues & {
  id: string
  createdAt: string
  updatedAt: string
}
