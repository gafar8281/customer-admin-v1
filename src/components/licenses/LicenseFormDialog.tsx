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
import {
  buildLicenseFormSchema,
  type License,
  type LicenseFormInput,
  type LicenseFormValues,
} from "@/schemas/license"

const EMPTY_VALUES: LicenseFormInput = {
  facilities: "",
  unifiedNumber: "",
  expiryDate: "",
}

export function LicenseFormDialog({
  open,
  onOpenChange,
  license,
  onSubmit,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  license?: License
  onSubmit: (values: LicenseFormValues) => Promise<void>
}) {
  const { t } = useTranslation()
  const schema = useMemo(() => buildLicenseFormSchema(t), [t])

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<LicenseFormInput, unknown, LicenseFormValues>({
    resolver: zodResolver(schema),
    defaultValues: EMPTY_VALUES,
  })

  useEffect(() => {
    if (open) {
      reset(license ?? EMPTY_VALUES)
    }
  }, [open, license, reset])

  const isEdit = !!license

  async function handleFormSubmit(values: LicenseFormValues) {
    await onSubmit(values)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" closeLabel={t("common.close")}>
        <DialogHeader>
          <DialogTitle>
            {isEdit ? t("licenses.form.editTitle") : t("licenses.form.addTitle")}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? t("licenses.form.editDescription")
              : t("licenses.form.addDescription")}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)} noValidate>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="facilities">
                {t("licenses.form.facilities")}
              </FieldLabel>
              <Input
                id="facilities"
                aria-invalid={!!errors.facilities}
                {...register("facilities")}
              />
              <FieldError errors={[errors.facilities]} />
            </Field>

            <Field>
              <FieldLabel htmlFor="unifiedNumber">
                {t("licenses.form.unifiedNumber")}
              </FieldLabel>
              <Input
                id="unifiedNumber"
                inputMode="numeric"
                aria-invalid={!!errors.unifiedNumber}
                {...register("unifiedNumber")}
              />
              <FieldError errors={[errors.unifiedNumber]} />
            </Field>

            <Field>
              <FieldLabel htmlFor="expiryDate">
                {t("licenses.form.expiryDate")}
              </FieldLabel>
              <Input
                id="expiryDate"
                type="date"
                aria-invalid={!!errors.expiryDate}
                {...register("expiryDate")}
              />
              <FieldError errors={[errors.expiryDate]} />
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
                  : t("licenses.form.submitAdd")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
