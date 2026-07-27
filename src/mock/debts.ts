import type { Debt } from "@/schemas/debt"

const SEED_TIMESTAMP = "2026-01-01T00:00:00.000Z"

export function createDebtSeed(): Debt[] {
  return [
    {
      id: "debt-1",
      customer: "Al-Rajhi Trading Est.",
      note: "Q2 supply invoice overpayment refund",
      debtWeOwe: 42500,
      createdAt: SEED_TIMESTAMP,
      updatedAt: SEED_TIMESTAMP,
    },
    {
      id: "debt-2",
      customer: "Noor Facility Management",
      note: "Cleaning contract deposit refund",
      debtWeOwe: 8900,
      createdAt: SEED_TIMESTAMP,
      updatedAt: SEED_TIMESTAMP,
    },
    {
      id: "debt-3",
      customer: "Gulf Supplies Co.",
      note: "Returned equipment credit",
      debtWeOwe: 128750.5,
      createdAt: SEED_TIMESTAMP,
      updatedAt: SEED_TIMESTAMP,
    },
    {
      id: "debt-4",
      customer: "Yasmin Al-Qahtani",
      note: undefined,
      debtWeOwe: 650,
      createdAt: SEED_TIMESTAMP,
      updatedAt: SEED_TIMESTAMP,
    },
    {
      id: "debt-5",
      customer: "Bin Zayed Holdings",
      note: "Settled in full",
      debtWeOwe: 0,
      createdAt: SEED_TIMESTAMP,
      updatedAt: SEED_TIMESTAMP,
    },
    {
      id: "debt-6",
      customer: "Al-Faisaliah Trading",
      note: undefined,
      debtWeOwe: 15250,
      createdAt: SEED_TIMESTAMP,
      updatedAt: SEED_TIMESTAMP,
    },
    {
      id: "debt-7",
      customer: "Reem Al-Mutairi",
      note: "Damaged goods compensation",
      debtWeOwe: 3200.75,
      createdAt: SEED_TIMESTAMP,
      updatedAt: SEED_TIMESTAMP,
    },
  ]
}
