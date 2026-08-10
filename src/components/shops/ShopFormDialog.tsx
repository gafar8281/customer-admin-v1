import { useEffect, useMemo } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { PAYMENT_OPTIONS } from "@/schemas/common"
import {
  buildShopFormSchema,
  type Shop,
  type ShopFormInput,
  type ShopFormValues,
} from "@/schemas/shop"

const EMPTY_VALUES: ShopFormInput = {
  shopName: "",
  amount: 0,
  shopLeaseExpiryDate: "",
  rentAmount: 0,
  payment: "monthly",
}

export function ShopFormDialog({
  open,
  onOpenChange,
  shop,
  onSubmit,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  shop?: Shop
  onSubmit: (values: ShopFormValues) => Promise<void>
}) {
  const { t } = useTranslation()
  const schema = useMemo(() => buildShopFormSchema(t), [t])

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ShopFormInput, unknown, ShopFormValues>({
    resolver: zodResolver(schema),
    defaultValues: EMPTY_VALUES,
  })

  useEffect(() => {
    if (open) {
      reset(shop ?? EMPTY_VALUES)
    }
  }, [open, shop, reset])

  const isEdit = !!shop

  async function handleFormSubmit(values: ShopFormValues) {
    await onSubmit(values)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" closeLabel={t("common.close")}>
        <DialogHeader>
          <DialogTitle>
            {isEdit ? t("shops.form.editTitle") : t("shops.form.addTitle")}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? t("shops.form.editDescription")
              : t("shops.form.addDescription")}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)} noValidate>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="shopName">
                {t("shops.form.shopName")}
              </FieldLabel>
              <Input
                id="shopName"
                aria-invalid={!!errors.shopName}
                {...register("shopName")}
              />
              <FieldError errors={[errors.shopName]} />
            </Field>

            <Field>
              <FieldLabel htmlFor="amount">{t("shops.form.amount")}</FieldLabel>
              <Input
                id="amount"
                type="number"
                inputMode="decimal"
                step="0.01"
                min="0"
                aria-invalid={!!errors.amount}
                {...register("amount")}
              />
              <FieldError errors={[errors.amount]} />
            </Field>

            <div className="grid grid-cols-2 gap-3">
              <Field>
                <FieldLabel htmlFor="rentAmount">
                  {t("shops.form.rentAmount")}
                </FieldLabel>
                <Input
                  id="rentAmount"
                  type="number"
                  inputMode="decimal"
                  step="0.01"
                  min="0"
                  aria-invalid={!!errors.rentAmount}
                  {...register("rentAmount")}
                />
                <FieldError errors={[errors.rentAmount]} />
              </Field>

              <Controller
                control={control}
                name="payment"
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel htmlFor="payment">
                      {t("shops.form.payment")}
                    </FieldLabel>
                    <Select
                      value={field.value}
                      onValueChange={(value) => field.onChange(value)}
                    >
                      <SelectTrigger
                        id="payment"
                        className="w-full"
                        aria-invalid={!!fieldState.error}
                      >
                        <SelectValue
                          placeholder={t("shops.form.selectBillingCycle")}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {PAYMENT_OPTIONS.map((option) => (
                          <SelectItem key={option} value={option}>
                            {t(`payment.${option}`)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FieldError errors={[fieldState.error]} />
                  </Field>
                )}
              />
            </div>

            <Field>
              <FieldLabel htmlFor="shopLeaseExpiryDate">
                {t("shops.form.shopLeaseExpiryDate")}
              </FieldLabel>
              <Input
                id="shopLeaseExpiryDate"
                type="date"
                aria-invalid={!!errors.shopLeaseExpiryDate}
                {...register("shopLeaseExpiryDate")}
              />
              <FieldError errors={[errors.shopLeaseExpiryDate]} />
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
                  : t("shops.form.submitAdd")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
