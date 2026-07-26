import { z } from "zod"

export function sarAmount(label: string) {
  return z.preprocess(
    (value) => (value === "" || value === null ? undefined : value),
    z
      .coerce.number({ error: `${label} is required` })
      .nonnegative(`${label} cannot be negative`)
  )
}

export const PAYMENT_OPTIONS = ["Monthly", "Half yearly", "Yearly"] as const

export type Payment = (typeof PAYMENT_OPTIONS)[number]
