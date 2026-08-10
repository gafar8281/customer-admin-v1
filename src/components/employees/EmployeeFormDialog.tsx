import { useEffect, useMemo } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"

import { Button } from "@/components/ui/button"
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox"
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
import { NATIONALITY_CODES, type NationalityCode } from "@/lib/nationalities"
import {
  buildEmployeeFormSchema,
  type Employee,
  type EmployeeFormInput,
  type EmployeeFormValues,
} from "@/schemas/employee"

const EMPTY_VALUES: EmployeeFormInput = {
  employeeName: "",
  nationalId: "",
  nationality: "" as NationalityCode,
  laborExpense: 0,
  saudization: 0,
  occupationalHazards: 0,
  saudiSalaries: 0,
}

interface NationalityOption {
  value: NationalityCode
  label: string
}

export function EmployeeFormDialog({
  open,
  onOpenChange,
  employee,
  onSubmit,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  employee?: Employee
  onSubmit: (values: EmployeeFormValues) => Promise<void>
}) {
  const { t } = useTranslation()
  const schema = useMemo(() => buildEmployeeFormSchema(t), [t])
  const nationalityOptions = useMemo<NationalityOption[]>(
    () =>
      NATIONALITY_CODES.map((code) => ({
        value: code,
        label: t(`nationality.${code}`),
      })),
    [t]
  )

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EmployeeFormInput, unknown, EmployeeFormValues>({
    resolver: zodResolver(schema),
    defaultValues: EMPTY_VALUES,
  })

  useEffect(() => {
    if (open) {
      reset(employee ?? EMPTY_VALUES)
    }
  }, [open, employee, reset])

  const isEdit = !!employee

  async function handleFormSubmit(values: EmployeeFormValues) {
    await onSubmit(values)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" closeLabel={t("common.close")}>
        <DialogHeader>
          <DialogTitle>
            {isEdit ? t("employees.form.editTitle") : t("employees.form.addTitle")}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? t("employees.form.editDescription")
              : t("employees.form.addDescription")}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)} noValidate>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="employeeName">
                {t("employees.form.employeeName")}
              </FieldLabel>
              <Input
                id="employeeName"
                aria-invalid={!!errors.employeeName}
                {...register("employeeName")}
              />
              <FieldError errors={[errors.employeeName]} />
            </Field>

            <Field>
              <FieldLabel htmlFor="nationalId">
                {t("employees.form.nationalId")}
              </FieldLabel>
              <Input
                id="nationalId"
                inputMode="numeric"
                aria-invalid={!!errors.nationalId}
                {...register("nationalId")}
              />
              <FieldError errors={[errors.nationalId]} />
            </Field>

            <Controller
              control={control}
              name="nationality"
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel htmlFor="nationality">
                    {t("employees.form.nationality")}
                  </FieldLabel>
                  <Combobox
                    items={nationalityOptions}
                    itemToStringLabel={(item: NationalityOption) => item.label}
                    value={
                      nationalityOptions.find(
                        (option) => option.value === field.value
                      ) ?? null
                    }
                    onValueChange={(value: NationalityOption | null) =>
                      field.onChange(value?.value ?? "")
                    }
                  >
                    <ComboboxInput
                      id="nationality"
                      placeholder={t("employees.form.selectNationality")}
                      aria-invalid={!!fieldState.error}
                    />
                    <ComboboxContent>
                      <ComboboxEmpty>
                        {t("employees.form.noNationalityFound")}
                      </ComboboxEmpty>
                      <ComboboxList>
                        {(item: NationalityOption) => (
                          <ComboboxItem key={item.value} value={item}>
                            {item.label}
                          </ComboboxItem>
                        )}
                      </ComboboxList>
                    </ComboboxContent>
                  </Combobox>
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />

            <div className="grid grid-cols-2 gap-3">
              <Field>
                <FieldLabel htmlFor="laborExpense">
                  {t("employees.form.laborExpense")}
                </FieldLabel>
                <Input
                  id="laborExpense"
                  type="number"
                  inputMode="decimal"
                  step="0.01"
                  min="0"
                  aria-invalid={!!errors.laborExpense}
                  {...register("laborExpense")}
                />
                <FieldError errors={[errors.laborExpense]} />
              </Field>

              <Field>
                <FieldLabel htmlFor="saudization">
                  {t("employees.form.saudization")}
                </FieldLabel>
                <Input
                  id="saudization"
                  type="number"
                  inputMode="decimal"
                  step="0.01"
                  min="0"
                  aria-invalid={!!errors.saudization}
                  {...register("saudization")}
                />
                <FieldError errors={[errors.saudization]} />
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Field>
                <FieldLabel htmlFor="occupationalHazards">
                  {t("employees.form.occupationalHazards")}
                </FieldLabel>
                <Input
                  id="occupationalHazards"
                  type="number"
                  inputMode="numeric"
                  step="1"
                  min="0"
                  aria-invalid={!!errors.occupationalHazards}
                  {...register("occupationalHazards")}
                />
                <FieldError errors={[errors.occupationalHazards]} />
              </Field>

              <Field>
                <FieldLabel htmlFor="saudiSalaries">
                  {t("employees.form.saudiSalaries")}
                </FieldLabel>
                <Input
                  id="saudiSalaries"
                  type="number"
                  inputMode="numeric"
                  step="1"
                  min="0"
                  aria-invalid={!!errors.saudiSalaries}
                  {...register("saudiSalaries")}
                />
                <FieldError errors={[errors.saudiSalaries]} />
              </Field>
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
                  : t("employees.form.submitAdd")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
