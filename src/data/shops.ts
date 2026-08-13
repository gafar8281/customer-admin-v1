import { createCollection } from "@/data/store"
import type { Shop, ShopFormValues } from "@/schemas/shop"

const shops = createCollection<Shop, ShopFormValues>("shops")

export function subscribeShops(
  onData: (items: Shop[]) => void,
  onError: (error: Error) => void
) {
  return shops.subscribe(onData, onError)
}

export function createShop(input: ShopFormValues) {
  return shops.create(input)
}

export function updateShop(id: string, input: ShopFormValues) {
  return shops.update(id, input)
}

export function deleteShop(id: string) {
  return shops.remove(id)
}
