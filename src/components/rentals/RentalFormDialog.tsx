import { useEffect, useMemo } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, useWatch } from "react-hook-form"
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
import { useFormat } from "@/i18n/useFormat"
import { getRemainingBalance } from "@/lib/rental"
import {
  buildRentalFormSchema,
  type Rental,
  type RentalFormInput,
  type RentalFormValues,
} from "@/schemas/rental"

const EMPTY_VALUES: RentalFormInput = {
  apartmentNumber: "",
  tenantName: "",
  leaseExpiryDate: "",
  totalAmount: 0,
  paidAmount: 0,
}

export function RentalFormDialog({
  open,
  onOpenChange,
  rental,
  onSubmit,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  rental?: Rental
  onSubmit: (values: RentalFormValues) => Promise<void>
}) {
  const { t } = useTranslation()
  const { formatSAR } = useFormat()
  const schema = useMemo(() => buildRentalFormSchema(t), [t])

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<RentalFormInput, unknown, RentalFormValues>({
    resolver: zodResolver(schema),
    defaultValues: EMPTY_VALUES,
  })

  useEffect(() => {
    if (open) {
      reset(rental ?? EMPTY_VALUES)
    }
  }, [open, rental, reset])

  const isEdit = !!rental

  const totalAmount = useWatch({ control, name: "totalAmount" })
  const paidAmount = useWatch({ control, name: "paidAmount" })
  const remaining = getRemainingBalance(
    Number(totalAmount) || 0,
    Number(paidAmount) || 0
  )

  async function handleFormSubmit(values: RentalFormValues) {
    await onSubmit(values)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" closeLabel={t("common.close")}>
        <DialogHeader>
          <DialogTitle>
            {isEdit ? t("rentals.form.editTitle") : t("rentals.form.addTitle")}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? t("rentals.form.editDescription")
              : t("rentals.form.addDescription")}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)} noValidate>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="tenantName">
                {t("rentals.form.tenantName")}
              </FieldLabel>
              <Input
                id="tenantName"
                aria-invalid={!!errors.tenantName}
                {...register("tenantName")}
              />
              <FieldError errors={[errors.tenantName]} />
            </Field>

            <Field>
              <FieldLabel htmlFor="apartmentNumber">
                {t("rentals.form.apartmentNumber")}
              </FieldLabel>
              <Input
                id="apartmentNumber"
                aria-invalid={!!errors.apartmentNumber}
                {...register("apartmentNumber")}
              />
              <FieldError errors={[errors.apartmentNumber]} />
            </Field>

            <Field>
              <FieldLabel htmlFor="leaseExpiryDate">
                {t("rentals.form.leaseExpiryDate")}
              </FieldLabel>
              <Input
                id="leaseExpiryDate"
                type="date"
                aria-invalid={!!errors.leaseExpiryDate}
                {...register("leaseExpiryDate")}
              />
              <FieldError errors={[errors.leaseExpiryDate]} />
            </Field>

            <div className="grid grid-cols-2 gap-3">
              <Field>
                <FieldLabel htmlFor="totalAmount">
                  {t("rentals.form.totalAmount")}
                </FieldLabel>
                <Input
                  id="totalAmount"
                  type="number"
                  inputMode="decimal"
                  step="0.01"
                  min="0"
                  aria-invalid={!!errors.totalAmount}
                  {...register("totalAmount")}
                />
                <FieldError errors={[errors.totalAmount]} />
              </Field>

              <Field>
                <FieldLabel htmlFor="paidAmount">
                  {t("rentals.form.paidAmount")}
                </FieldLabel>
                <Input
                  id="paidAmount"
                  type="number"
                  inputMode="decimal"
                  step="0.01"
                  min="0"
                  aria-invalid={!!errors.paidAmount}
                  {...register("paidAmount")}
                />
                <FieldError errors={[errors.paidAmount]} />
              </Field>
            </div>

            <div className="flex items-center justify-between rounded-lg border bg-muted/40 px-3 py-2">
              <span className="text-sm text-muted-foreground">
                {t("rentals.remainingBalance")}
              </span>
              <span className="text-sm font-semibold tabular-nums">
                {formatSAR(remaining)}
              </span>
            </div>
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
                  : t("rentals.form.submitAdd")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
