import { useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"

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
import { NATIONALITIES } from "@/lib/nationalities"
import {
  employeeFormSchema,
  type Employee,
  type EmployeeFormInput,
  type EmployeeFormValues,
} from "@/schemas/employee"

const EMPTY_VALUES: EmployeeFormInput = {
  employeeName: "",
  nationalId: "",
  nationality: "",
  laborExpense: 0,
  saudization: 0,
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
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EmployeeFormInput, unknown, EmployeeFormValues>({
    resolver: zodResolver(employeeFormSchema),
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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Employee" : "Add Employee"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update this employee's details."
              : "Enter the details for the new employee."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)} noValidate>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="employeeName">Employee Name</FieldLabel>
              <Input
                id="employeeName"
                aria-invalid={!!errors.employeeName}
                {...register("employeeName")}
              />
              <FieldError errors={[errors.employeeName]} />
            </Field>

            <Field>
              <FieldLabel htmlFor="nationalId">National ID / Iqama</FieldLabel>
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
                  <FieldLabel htmlFor="nationality">Nationality</FieldLabel>
                  <Combobox
                    items={NATIONALITIES}
                    value={field.value || null}
                    onValueChange={(value) => field.onChange(value ?? "")}
                  >
                    <ComboboxInput
                      id="nationality"
                      placeholder="Select nationality"
                      aria-invalid={!!fieldState.error}
                    />
                    <ComboboxContent>
                      <ComboboxEmpty>No nationality found.</ComboboxEmpty>
                      <ComboboxList>
                        {(item: string) => (
                          <ComboboxItem key={item} value={item}>
                            {item}
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
                  Labor Expense (SAR)
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
                <FieldLabel htmlFor="saudization">Saudization (SAR)</FieldLabel>
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
          </FieldGroup>

          <DialogFooter className="mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? "Saving…"
                : isEdit
                  ? "Save changes"
                  : "Add employee"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
