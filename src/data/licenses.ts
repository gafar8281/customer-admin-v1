import { createCollection } from "@/data/store"
import type { License, LicenseFormValues } from "@/schemas/license"

const licenses = createCollection<License, LicenseFormValues>("commercial_licenses")

export function subscribeLicenses(
  onData: (items: License[]) => void,
  onError: (error: Error) => void
) {
  return licenses.subscribe(onData, onError)
}

export function createLicense(input: LicenseFormValues) {
  return licenses.create(input)
}

export function updateLicense(id: string, input: LicenseFormValues) {
  return licenses.update(id, input)
}

export function deleteLicense(id: string) {
  return licenses.remove(id)
}
