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
import { Textarea } from "@/components/ui/textarea"
import {
  buildDebtFormSchema,
  type Debt,
  type DebtFormInput,
  type DebtFormValues,
} from "@/schemas/debt"

const EMPTY_VALUES: DebtFormInput = {
  customer: "",
  note: "",
  debtWeOwe: 0,
}

export function DebtFormDialog({
  open,
  onOpenChange,
  debt,
  onSubmit,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  debt?: Debt
  onSubmit: (values: DebtFormValues) => Promise<void>
}) {
  const { t } = useTranslation()
  const schema = useMemo(() => buildDebtFormSchema(t), [t])

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<DebtFormInput, unknown, DebtFormValues>({
    resolver: zodResolver(schema),
    defaultValues: EMPTY_VALUES,
  })

  useEffect(() => {
    if (open) {
      reset(debt ?? EMPTY_VALUES)
    }
  }, [open, debt, reset])

  const isEdit = !!debt

  async function handleFormSubmit(values: DebtFormValues) {
    await onSubmit(values)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" closeLabel={t("common.close")}>
        <DialogHeader>
          <DialogTitle>
            {isEdit ? t("debts.form.editTitle") : t("debts.form.addTitle")}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? t("debts.form.editDescription")
              : t("debts.form.addDescription")}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)} noValidate>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="customer">
                {t("debts.form.customer")}
              </FieldLabel>
              <Input
                id="customer"
                aria-invalid={!!errors.customer}
                {...register("customer")}
              />
              <FieldError errors={[errors.customer]} />
            </Field>

            <Field>
              <FieldLabel htmlFor="note">{t("debts.form.note")}</FieldLabel>
              <Textarea
                id="note"
                rows={2}
                aria-invalid={!!errors.note}
                {...register("note")}
              />
              <FieldError errors={[errors.note]} />
            </Field>

            <Field>
              <FieldLabel htmlFor="debtWeOwe">
                {t("debts.form.debtWeOwe")}
              </FieldLabel>
              <Input
                id="debtWeOwe"
                type="number"
                inputMode="decimal"
                step="0.01"
                min="0"
                aria-invalid={!!errors.debtWeOwe}
                {...register("debtWeOwe")}
              />
              <FieldError errors={[errors.debtWeOwe]} />
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
                  : t("debts.form.submitAdd")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
