import type { TFunction } from "i18next"
import { z } from "zod"

import { optionalSarAmount } from "@/schemas/common"

export function buildShopLicenseFormSchema(t: TFunction) {
  return z.object({
    shop: z
      .string()
      .trim()
      .min(2, t("validation.shopMin"))
      .max(80, t("validation.shopMax")),
    municipalLicense: z
      .string()
      .trim()
      .min(1, t("validation.municipalLicenseRequired"))
      .max(40, t("validation.municipalLicenseMax")),
    licenseExpiryDate: z
      .string()
      .min(1, t("validation.expiryDateRequired"))
      .refine((value) => !Number.isNaN(Date.parse(value)), {
        message: t("validation.expiryDateInvalid"),
      }),
    refundInvoiceNumber: z
      .string()
      .trim()
      .max(40, t("validation.refundInvoiceNumberMax"))
      .optional(),
    supplierName: z
      .string()
      .trim()
      .max(80, t("validation.supplierNameMax"))
      .optional(),
    refund: optionalSarAmount(t, "refund"),
  })
}

export type ShopLicenseFormInput = z.input<ReturnType<typeof buildShopLicenseFormSchema>>
export type ShopLicenseFormValues = z.output<ReturnType<typeof buildShopLicenseFormSchema>>

export type ShopLicense = ShopLicenseFormValues & {
  id: string
  createdAt: string
  updatedAt: string
}
