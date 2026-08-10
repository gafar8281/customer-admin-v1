import type { TFunction } from "i18next"
import { z } from "zod"

import { sarAmount } from "@/schemas/common"

export function buildRentalFormSchema(t: TFunction) {
  return z
    .object({
      apartmentNumber: z
        .string()
        .trim()
        .min(1, t("validation.apartmentNumberRequired"))
        .max(20, t("validation.apartmentNumberMax")),
      tenantName: z
        .string()
        .trim()
        .min(2, t("validation.tenantNameMin"))
        .max(80, t("validation.tenantNameMax")),
      leaseExpiryDate: z
        .string()
        .min(1, t("validation.leaseExpiryRequired"))
        .refine((value) => !Number.isNaN(Date.parse(value)), {
          message: t("validation.leaseExpiryInvalid"),
        }),
      totalAmount: sarAmount(t, "totalAmount"),
      paidAmount: sarAmount(t, "paidAmount"),
    })
    .refine((values) => values.paidAmount <= values.totalAmount, {
      message: t("validation.paidExceedsTotal"),
      path: ["paidAmount"],
    })
}

export type RentalFormInput = z.input<ReturnType<typeof buildRentalFormSchema>>
export type RentalFormValues = z.output<ReturnType<typeof buildRentalFormSchema>>

export type Rental = RentalFormValues & {
  id: string
  createdAt: string
  updatedAt: string
}
