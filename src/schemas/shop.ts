import type { TFunction } from "i18next"
import { z } from "zod"

import { PAYMENT_OPTIONS, sarAmount } from "@/schemas/common"

export function buildShopFormSchema(t: TFunction) {
  return z.object({
    shopName: z
      .string()
      .trim()
      .min(2, t("validation.shopNameMin"))
      .max(80, t("validation.shopNameMax")),
    amount: sarAmount(t, "amount"),
    shopLeaseExpiryDate: z
      .string()
      .min(1, t("validation.leaseExpiryRequired"))
      .refine((value) => !Number.isNaN(Date.parse(value)), {
        message: t("validation.leaseExpiryInvalid"),
      }),
    rentAmount: sarAmount(t, "rentAmount"),
    payment: z.enum(PAYMENT_OPTIONS, { error: t("validation.paymentRequired") }),
  })
}

export type ShopFormInput = z.input<ReturnType<typeof buildShopFormSchema>>
export type ShopFormValues = z.output<ReturnType<typeof buildShopFormSchema>>

export type Shop = ShopFormValues & {
  id: string
  createdAt: string
  updatedAt: string
}
