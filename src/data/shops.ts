import { createCollection } from "@/data/store"
import { createShopSeed } from "@/mock/shops"
import type { Shop, ShopFormValues } from "@/schemas/shop"

const shops = createCollection<Shop, ShopFormValues>(
  "cas.shops.v2",
  createShopSeed
)

export function getShops() {
  return shops.list()
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

export function resetShops() {
  return shops.reset()
}
