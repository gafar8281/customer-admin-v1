import { useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, useWatch } from "react-hook-form"

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
import { formatSAR } from "@/lib/format"
import { getRemainingBalance } from "@/lib/rental"
import {
  rentalFormSchema,
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
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<RentalFormInput, unknown, RentalFormValues>({
    resolver: zodResolver(rentalFormSchema),
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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Rental" : "Add Rental"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update this tenant's lease and payment details."
              : "Enter the details for the new rental."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)} noValidate>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="tenantName">Tenant Name</FieldLabel>
              <Input
                id="tenantName"
                aria-invalid={!!errors.tenantName}
                {...register("tenantName")}
              />
              <FieldError errors={[errors.tenantName]} />
            </Field>

            <Field>
              <FieldLabel htmlFor="apartmentNumber">
                Apartment Number
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
                Lease Expiry Date
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
                  Total Amount (SAR)
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
                  Amount Paid (SAR)
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
                Remaining Balance
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
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving…" : isEdit ? "Save changes" : "Add rental"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
