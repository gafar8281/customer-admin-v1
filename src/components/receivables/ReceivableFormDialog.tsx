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
  buildReceivableFormSchema,
  type Receivable,
  type ReceivableFormInput,
  type ReceivableFormValues,
} from "@/schemas/receivable"

const EMPTY_VALUES: ReceivableFormInput = {
  customer: "",
  note: "",
  debtOwedToUs: 0,
}

export function ReceivableFormDialog({
  open,
  onOpenChange,
  receivable,
  onSubmit,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  receivable?: Receivable
  onSubmit: (values: ReceivableFormValues) => Promise<void>
}) {
  const { t } = useTranslation()
  const schema = useMemo(() => buildReceivableFormSchema(t), [t])

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ReceivableFormInput, unknown, ReceivableFormValues>({
    resolver: zodResolver(schema),
    defaultValues: EMPTY_VALUES,
  })

  useEffect(() => {
    if (open) {
      reset(receivable ?? EMPTY_VALUES)
    }
  }, [open, receivable, reset])

  const isEdit = !!receivable

  async function handleFormSubmit(values: ReceivableFormValues) {
    await onSubmit(values)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" closeLabel={t("common.close")}>
        <DialogHeader>
          <DialogTitle>
            {isEdit
              ? t("receivables.form.editTitle")
              : t("receivables.form.addTitle")}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? t("receivables.form.editDescription")
              : t("receivables.form.addDescription")}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)} noValidate>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="customer">
                {t("receivables.form.customer")}
              </FieldLabel>
              <Input
                id="customer"
                aria-invalid={!!errors.customer}
                {...register("customer")}
              />
              <FieldError errors={[errors.customer]} />
            </Field>

            <Field>
              <FieldLabel htmlFor="note">
                {t("receivables.form.note")}
              </FieldLabel>
              <Textarea
                id="note"
                rows={2}
                aria-invalid={!!errors.note}
                {...register("note")}
              />
              <FieldError errors={[errors.note]} />
            </Field>

            <Field>
              <FieldLabel htmlFor="debtOwedToUs">
                {t("receivables.form.debtOwedToUs")}
              </FieldLabel>
              <Input
                id="debtOwedToUs"
                type="number"
                inputMode="decimal"
                step="0.01"
                min="0"
                aria-invalid={!!errors.debtOwedToUs}
                {...register("debtOwedToUs")}
              />
              <FieldError errors={[errors.debtOwedToUs]} />
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
                  : t("receivables.form.submitAdd")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
