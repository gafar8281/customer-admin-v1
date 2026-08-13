import { createCollection } from "@/data/store"
import type { Rental, RentalFormValues } from "@/schemas/rental"

const rentals = createCollection<Rental, RentalFormValues>("rentals")

export function subscribeRentals(
  onData: (items: Rental[]) => void,
  onError: (error: Error) => void
) {
  return rentals.subscribe(onData, onError)
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
