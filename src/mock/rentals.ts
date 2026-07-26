import type { Rental } from "@/schemas/rental"

const SEED_TIMESTAMP = "2026-01-01T00:00:00.000Z"

function daysFromNow(days: number) {
  const date = new Date()
  date.setHours(0, 0, 0, 0)
  date.setDate(date.getDate() + days)
  return date.toISOString().slice(0, 10)
}

export function createRentalSeed(): Rental[] {
  return [
    {
      id: "rental-1",
      apartmentNumber: "A-204",
      tenantName: "Ahmed Al-Otaibi",
      leaseExpiryDate: daysFromNow(-25),
      totalAmount: 48000,
      paidAmount: 24000,
      createdAt: SEED_TIMESTAMP,
      updatedAt: SEED_TIMESTAMP,
    },
    {
      id: "rental-2",
      apartmentNumber: "B-112",
      tenantName: "Fatima Al-Zahrani",
      leaseExpiryDate: daysFromNow(12),
      totalAmount: 36000,
      paidAmount: 36000,
      createdAt: SEED_TIMESTAMP,
      updatedAt: SEED_TIMESTAMP,
    },
    {
      id: "rental-3",
      apartmentNumber: "C-305",
      tenantName: "Mohammed bin Rashid",
      leaseExpiryDate: daysFromNow(180),
      totalAmount: 60000,
      paidAmount: 15000,
      createdAt: SEED_TIMESTAMP,
      updatedAt: SEED_TIMESTAMP,
    },
    {
      id: "rental-4",
      apartmentNumber: "A-118",
      tenantName: "Sara Al-Ghamdi",
      leaseExpiryDate: daysFromNow(300),
      totalAmount: 42000,
      paidAmount: 0,
      createdAt: SEED_TIMESTAMP,
      updatedAt: SEED_TIMESTAMP,
    },
    {
      id: "rental-5",
      apartmentNumber: "D-410",
      tenantName: "Khalid Al-Dosari",
      leaseExpiryDate: daysFromNow(500),
      totalAmount: 54000,
      paidAmount: 27000,
      createdAt: SEED_TIMESTAMP,
      updatedAt: SEED_TIMESTAMP,
    },
    {
      id: "rental-6",
      apartmentNumber: "B-207",
      tenantName: "Layla Al-Harbi",
      leaseExpiryDate: daysFromNow(90),
      totalAmount: 39000,
      paidAmount: 39000,
      createdAt: SEED_TIMESTAMP,
      updatedAt: SEED_TIMESTAMP,
    },
  ]
}
