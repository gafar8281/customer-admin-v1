import { useEffect, useMemo } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm, type DefaultValues } from "react-hook-form"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { MonthExistsError } from "@/data/expenses"
import { useFormat } from "@/i18n/useFormat"
import { MONTH_NUMBERS } from "@/lib/expense"
import {
  buildExpenseMonthFormSchema,
  type ExpenseMonthFormInput,
  type ExpenseMonthFormValues,
} from "@/schemas/expense"

const now = new Date()
const CURRENT_YEAR = now.getFullYear()
const YEAR_OPTIONS = Array.from({ length: 6 }, (_, i) => CURRENT_YEAR - 2 + i)

const EMPTY_VALUES: DefaultValues<ExpenseMonthFormInput> = {
  year: CURRENT_YEAR,
  month: now.getMonth() + 1,
}

export function MonthFormDialog({
  open,
  onOpenChange,
  onSubmit,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (values: ExpenseMonthFormValues) => Promise<void>
}) {
  const { t } = useTranslation()
  const { formatMonthName } = useFormat()
  const schema = useMemo(() => buildExpenseMonthFormSchema(t), [t])

  const {
    control,
    handleSubmit,
    reset,
    setError,
    formState: { isSubmitting },
  } = useForm<ExpenseMonthFormInput, unknown, ExpenseMonthFormValues>({
    resolver: zodResolver(schema),
    defaultValues: EMPTY_VALUES,
  })

  useEffect(() => {
    if (open) {
      reset(EMPTY_VALUES)
    }
  }, [open, reset])

  async function handleFormSubmit(values: ExpenseMonthFormValues) {
    try {
      await onSubmit(values)
      onOpenChange(false)
    } catch (error) {
      if (error instanceof MonthExistsError) {
        setError("month", { message: t("expenses.monthExists") })
        return
      }
      throw error
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" closeLabel={t("common.close")}>
        <DialogHeader>
          <DialogTitle>{t("expenses.form.addMonthTitle")}</DialogTitle>
          <DialogDescription>
            {t("expenses.form.addMonthDescription")}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)} noValidate>
          <FieldGroup>
            <div className="grid grid-cols-2 gap-3">
              <Controller
                control={control}
                name="month"
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel htmlFor="month">
                      {t("expenses.form.month")}
                    </FieldLabel>
                    <Select
                      value={String(field.value)}
                      onValueChange={(value) => field.onChange(Number(value))}
                    >
                      <SelectTrigger
                        id="month"
                        className="w-full"
                        aria-invalid={!!fieldState.error}
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {MONTH_NUMBERS.map((option) => (
                          <SelectItem key={option} value={String(option)}>
                            {formatMonthName(option)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FieldError errors={[fieldState.error]} />
                  </Field>
                )}
              />

              <Controller
                control={control}
                name="year"
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel htmlFor="year">
                      {t("expenses.form.year")}
                    </FieldLabel>
                    <Select
                      value={String(field.value)}
                      onValueChange={(value) => field.onChange(Number(value))}
                    >
                      <SelectTrigger
                        id="year"
                        className="w-full"
                        aria-invalid={!!fieldState.error}
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {YEAR_OPTIONS.map((option) => (
                          <SelectItem key={option} value={String(option)}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FieldError errors={[fieldState.error]} />
                  </Field>
                )}
              />
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
                : t("expenses.form.submitAddMonth")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
