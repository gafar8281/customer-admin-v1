const SIMULATED_DELAY_MS = 250

type WithMeta = {
  id: string
  createdAt: string
  updatedAt: string
}

interface CollectionApi<T extends WithMeta, Input extends Record<string, unknown>> {
  list(): Promise<T[]>
  create(input: Input): Promise<T>
  update(id: string, input: Input): Promise<T>
  remove(id: string): Promise<void>
  reset(): Promise<T[]>
}

function delay<T>(value: T): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(value), SIMULATED_DELAY_MS)
  })
}

function readFromStorage<T>(key: string): T[] | null {
  try {
    const raw = window.localStorage.getItem(key)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? (parsed as T[]) : null
  } catch {
    return null
  }
}

function writeToStorage<T>(key: string, items: T[]) {
  window.localStorage.setItem(key, JSON.stringify(items))
}

export function createCollection<
  T extends WithMeta,
  Input extends Record<string, unknown> = Omit<T, keyof WithMeta>,
>(key: string, seed: () => T[]): CollectionApi<T, Input> {
  function readAll(): T[] {
    const stored = readFromStorage<T>(key)
    if (stored) return stored
    const seeded = seed()
    writeToStorage(key, seeded)
    return seeded
  }

  return {
    async list() {
      return delay(readAll())
    },

    async create(input) {
      const items = readAll()
      const now = new Date().toISOString()
      const record = {
        ...input,
        id: crypto.randomUUID(),
        createdAt: now,
        updatedAt: now,
      } as unknown as T

      writeToStorage(key, [...items, record])
      return delay(record)
    },

    async update(id, input) {
      const items = readAll()
      const now = new Date().toISOString()
      let updated: T | undefined

      const next = items.map((item) => {
        if (item.id !== id) return item
        updated = { ...item, ...input, updatedAt: now }
        return updated
      })

      if (!updated) {
        throw new Error(`Record with id "${id}" was not found in "${key}"`)
      }

      writeToStorage(key, next)
      return delay(updated)
    },

    async remove(id) {
      const items = readAll()
      writeToStorage(
        key,
        items.filter((item) => item.id !== id)
      )
      return delay(undefined)
    },

    async reset() {
      const seeded = seed()
      writeToStorage(key, seeded)
      return delay(seeded)
    },
  }
}
