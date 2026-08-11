import type { Shop } from "@/schemas/shop"

const SEED_TIMESTAMP = "2026-01-01T00:00:00.000Z"

function daysFromNow(days: number) {
  const date = new Date()
  date.setHours(0, 0, 0, 0)
  date.setDate(date.getDate() + days)
  return date.toISOString().slice(0, 10)
}

export function createShopSeed(): Shop[] {
  return [
    {
      id: "shop-1",
      shopName: "Downtown Plaza Unit 12",
      amount: 180000,
      shopLeaseExpiryDate: daysFromNow(-20),
      rentAmount: 15000,
      payment: "monthly",
      createdAt: SEED_TIMESTAMP,
      updatedAt: SEED_TIMESTAMP,
    },
    {
      id: "shop-2",
      shopName: "Al-Noor Mall Kiosk 4",
      amount: 42000,
      shopLeaseExpiryDate: daysFromNow(15),
      rentAmount: 3500,
      payment: "monthly",
      createdAt: SEED_TIMESTAMP,
      updatedAt: SEED_TIMESTAMP,
    },
    {
      id: "shop-3",
      shopName: "Riyadh Park Retail 8",
      amount: 260000,
      shopLeaseExpiryDate: daysFromNow(400),
      rentAmount: 21000,
      payment: "half_yearly",
      createdAt: SEED_TIMESTAMP,
      updatedAt: SEED_TIMESTAMP,
    },
    {
      id: "shop-4",
      shopName: "Jeddah Corniche Shop 3",
      amount: 95000,
      shopLeaseExpiryDate: daysFromNow(200),
      rentAmount: 8000,
      payment: "yearly",
      createdAt: SEED_TIMESTAMP,
      updatedAt: SEED_TIMESTAMP,
    },
    {
      id: "shop-5",
      shopName: "Dammam Business Center 2",
      amount: 310000,
      shopLeaseExpiryDate: daysFromNow(600),
      rentAmount: 26000,
      payment: "yearly",
      createdAt: SEED_TIMESTAMP,
      updatedAt: SEED_TIMESTAMP,
    },
    {
      id: "shop-6",
      shopName: "Al-Khobar Mall Unit 9",
      amount: 75000,
      shopLeaseExpiryDate: daysFromNow(120),
      rentAmount: 6200,
      payment: "quarterly",
      createdAt: SEED_TIMESTAMP,
      updatedAt: SEED_TIMESTAMP,
    },
  ]
}
