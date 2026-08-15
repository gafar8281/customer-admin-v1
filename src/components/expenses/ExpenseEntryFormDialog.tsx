import { useEffect, useMemo } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, type DefaultValues } from "react-hook-form"
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
import { monthDateBounds } from "@/lib/expense"
import {
  buildExpenseEntryFormSchema,
  type ExpenseEntry,
  type ExpenseEntryFormInput,
  type ExpenseEntryFormValues,
} from "@/schemas/expense"

export function ExpenseEntryFormDialog({
  open,
  onOpenChange,
  monthId,
  entry,
  onSubmit,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  monthId: string
  entry?: ExpenseEntry
  onSubmit: (values: ExpenseEntryFormValues) => Promise<void>
}) {
  const { t } = useTranslation()
  const schema = useMemo(
    () => buildExpenseEntryFormSchema(t, monthId),
    [t, monthId]
  )
  const bounds = monthDateBounds(monthId)

  const emptyValues: DefaultValues<ExpenseEntryFormInput> = useMemo(
    () => ({
      statement: "",
      date: bounds?.min ?? "",
      amountDisbursed: 0,
    }),
    [bounds?.min]
  )

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ExpenseEntryFormInput, unknown, ExpenseEntryFormValues>({
    resolver: zodResolver(schema),
    defaultValues: emptyValues,
  })

  useEffect(() => {
    if (open) {
      reset(entry ?? emptyValues)
    }
  }, [open, entry, emptyValues, reset])

  const isEdit = !!entry

  async function handleFormSubmit(values: ExpenseEntryFormValues) {
    await onSubmit(values)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" closeLabel={t("common.close")}>
        <DialogHeader>
          <DialogTitle>
            {isEdit
              ? t("expenses.form.editTitle")
              : t("expenses.form.addTitle")}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? t("expenses.form.editDescription")
              : t("expenses.form.addDescription")}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)} noValidate>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="statement">
                {t("expenses.form.statement")}
              </FieldLabel>
              <Input
                id="statement"
                aria-invalid={!!errors.statement}
                {...register("statement")}
              />
              <FieldError errors={[errors.statement]} />
            </Field>

            <Field>
              <FieldLabel htmlFor="date">{t("expenses.form.date")}</FieldLabel>
              <Input
                id="date"
                type="date"
                min={bounds?.min}
                max={bounds?.max}
                aria-invalid={!!errors.date}
                {...register("date")}
              />
              <FieldError errors={[errors.date]} />
            </Field>

            <Field>
              <FieldLabel htmlFor="amountDisbursed">
                {t("expenses.form.amountDisbursed")}
              </FieldLabel>
              <Input
                id="amountDisbursed"
                type="number"
                inputMode="decimal"
                step="0.01"
                min="0"
                aria-invalid={!!errors.amountDisbursed}
                {...register("amountDisbursed")}
              />
              <FieldError errors={[errors.amountDisbursed]} />
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
                  : t("expenses.form.submitAdd")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
