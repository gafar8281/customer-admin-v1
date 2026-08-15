import { createCollection } from "@/data/store"
import type { ShopLicense, ShopLicenseFormValues } from "@/schemas/shop-license"

const shopLicenses = createCollection<ShopLicense, ShopLicenseFormValues>("shop_licenses")

export function subscribeShopLicenses(
  onData: (items: ShopLicense[]) => void,
  onError: (error: Error) => void
) {
  return shopLicenses.subscribe(onData, onError)
}

export function createShopLicense(input: ShopLicenseFormValues) {
  return shopLicenses.create(input)
}

export function updateShopLicense(id: string, input: ShopLicenseFormValues) {
  return shopLicenses.update(id, input)
}

export function deleteShopLicense(id: string) {
  return shopLicenses.remove(id)
}
