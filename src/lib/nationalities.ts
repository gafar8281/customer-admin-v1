export const NATIONALITY_CODES = [
  "SA",
  "IN",
  "PK",
  "EG",
  "PH",
  "BD",
  "SD",
  "YE",
  "JO",
  "SY",
  "NP",
  "LK",
  "AE",
  "KW",
  "QA",
  "BH",
  "OM",
  "LB",
  "MA",
  "ID",
] as const

export type NationalityCode = (typeof NATIONALITY_CODES)[number]
