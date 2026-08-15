import type { TFunction } from "i18next"
import { z } from "zod"

export function buildLicenseFormSchema(t: TFunction) {
  return z.object({
    facilities: z
      .string()
      .trim()
      .min(2, t("validation.facilitiesMin"))
      .max(80, t("validation.facilitiesMax")),
    unifiedNumber: z
      .string()
      .trim()
      .min(1, t("validation.unifiedNumberRequired"))
      .max(40, t("validation.unifiedNumberMax")),
    expiryDate: z
      .string()
      .min(1, t("validation.expiryDateRequired"))
      .refine((value) => !Number.isNaN(Date.parse(value)), {
        message: t("validation.expiryDateInvalid"),
      }),
  })
}

export type LicenseFormInput = z.input<ReturnType<typeof buildLicenseFormSchema>>
export type LicenseFormValues = z.output<ReturnType<typeof buildLicenseFormSchema>>

export type License = LicenseFormValues & {
  id: string
  createdAt: string
  updatedAt: string
}
