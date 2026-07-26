import { z } from "zod"

import { PAYMENT_OPTIONS, sarAmount } from "@/schemas/common"

export const shopFormSchema = z.object({
  shopName: z
    .string()
    .trim()
    .min(2, "Shop name must be at least 2 characters")
    .max(80, "Shop name must be at most 80 characters"),
  amount: sarAmount("Total contract value"),
  shopLeaseExpiryDate: z
    .string()
    .min(1, "Lease expiry date is required")
    .refine((value) => !Number.isNaN(Date.parse(value)), {
      message: "Lease expiry date must be a valid date",
    }),
  rentAmount: sarAmount("Rent amount"),
  payment: z.enum(PAYMENT_OPTIONS, { error: "Select a billing cycle" }),
})

export type ShopFormInput = z.input<typeof shopFormSchema>
export type ShopFormValues = z.output<typeof shopFormSchema>

export type Shop = ShopFormValues & {
  id: string
  createdAt: string
  updatedAt: string
}
