import { useEffect, useMemo } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import {
  buildShopLicenseFormSchema,
  type ShopLicense,
  type ShopLicenseFormInput,
  type ShopLicenseFormValues,
} from "@/schemas/shop-license"

const EMPTY_VALUES: ShopLicenseFormInput = {
  shop: "",
  municipalLicense: "",
  licenseExpiryDate: "",
  refundInvoiceNumber: "",
  supplierName: "",
  refund: "",
}

export function ShopLicenseFormDialog({
  open,
  onOpenChange,
  shopLicense,
  onSubmit,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  shopLicense?: ShopLicense
  onSubmit: (values: ShopLicenseFormValues) => Promise<void>
}) {
  const { t } = useTranslation()
  const schema = useMemo(() => buildShopLicenseFormSchema(t), [t])

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ShopLicenseFormInput, unknown, ShopLicenseFormValues>({
    resolver: zodResolver(schema),
    defaultValues: EMPTY_VALUES,
  })

  useEffect(() => {
    if (open) {
      reset(
        shopLicense
          ? { ...shopLicense, refund: shopLicense.refund ?? "" }
          : EMPTY_VALUES
      )
    }
  }, [open, shopLicense, reset])

  const isEdit = !!shopLicense

  async function handleFormSubmit(values: ShopLicenseFormValues) {
    await onSubmit(values)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" closeLabel={t("common.close")}>
        <DialogHeader>
          <DialogTitle>
            {isEdit
              ? t("shopLicenses.form.editTitle")
              : t("shopLicenses.form.addTitle")}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? t("shopLicenses.form.editDescription")
              : t("shopLicenses.form.addDescription")}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)} noValidate>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="shop">{t("shopLicenses.form.shop")}</FieldLabel>
              <Input id="shop" aria-invalid={!!errors.shop} {...register("shop")} />
              <FieldError errors={[errors.shop]} />
            </Field>

            <Field>
              <FieldLabel htmlFor="municipalLicense">
                {t("shopLicenses.form.municipalLicense")}
              </FieldLabel>
              <Input
                id="municipalLicense"
                aria-invalid={!!errors.municipalLicense}
                {...register("municipalLicense")}
              />
              <FieldError errors={[errors.municipalLicense]} />
            </Field>

            <Field>
              <FieldLabel htmlFor="licenseExpiryDate">
                {t("shopLicenses.form.licenseExpiryDate")}
              </FieldLabel>
              <Input
                id="licenseExpiryDate"
                type="date"
                aria-invalid={!!errors.licenseExpiryDate}
                {...register("licenseExpiryDate")}
              />
              <FieldError errors={[errors.licenseExpiryDate]} />
            </Field>

            <Separator />

            <Field>
              <FieldLabel htmlFor="refundInvoiceNumber">
                {t("shopLicenses.form.refundInvoiceNumber")}
              </FieldLabel>
              <Input
                id="refundInvoiceNumber"
                aria-invalid={!!errors.refundInvoiceNumber}
                {...register("refundInvoiceNumber")}
              />
              <FieldError errors={[errors.refundInvoiceNumber]} />
            </Field>

            <Field>
              <FieldLabel htmlFor="supplierName">
                {t("shopLicenses.form.supplierName")}
              </FieldLabel>
              <Input
                id="supplierName"
                aria-invalid={!!errors.supplierName}
                {...register("supplierName")}
              />
              <FieldError errors={[errors.supplierName]} />
            </Field>

            <Field>
              <FieldLabel htmlFor="refund">{t("shopLicenses.form.refund")}</FieldLabel>
              <Input
                id="refund"
                type="number"
                inputMode="decimal"
                step="0.01"
                min="0"
                aria-invalid={!!errors.refund}
                {...register("refund")}
              />
              <FieldError errors={[errors.refund]} />
            </Field>
          </FieldGroup>

          <DialogFooter className="mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              {t("common.cancel")}
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? t("common.saving")
                : isEdit
                  ? t("common.saveChanges")
                  : t("shopLicenses.form.submitAdd")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
