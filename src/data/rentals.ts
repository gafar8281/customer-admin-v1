import { createCollection } from "@/data/store"
import { createRentalSeed } from "@/mock/rentals"
import type { Rental, RentalFormValues } from "@/schemas/rental"

const rentals = createCollection<Rental, RentalFormValues>(
  "cas.rentals",
  createRentalSeed
)

export function getRentals() {
  return rentals.list()
}

export function createRental(input: RentalFormValues) {
  return rentals.create(input)
}

export function updateRental(id: string, input: RentalFormValues) {
  return rentals.update(id, input)
}

export function deleteRental(id: string) {
  return rentals.remove(id)
}

export function resetRentals() {
  return rentals.reset()
}
