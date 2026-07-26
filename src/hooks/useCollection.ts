import { useCallback, useEffect, useState } from "react"

interface CollectionOperations<T extends { id: string }, Input> {
  list: () => Promise<T[]>
  create: (input: Input) => Promise<T>
  update: (id: string, input: Input) => Promise<T>
  remove: (id: string) => Promise<void>
  reset: () => Promise<T[]>
}

export function useCollection<T extends { id: string }, Input>({
  list,
  create: createItem,
  update: updateItem,
  remove: removeItem,
  reset: resetItems,
}: CollectionOperations<T, Input>) {
  const [items, setItems] = useState<T[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      setError(null)
      try {
        const data = await list()
        if (!cancelled) setItems(data)
      } catch {
        if (!cancelled) setError("Failed to load data.")
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()

    return () => {
      cancelled = true
    }
  }, [list])

  const create = useCallback(
    async (input: Input) => {
      const record = await createItem(input)
      setItems((prev) => [...prev, record])
      return record
    },
    [createItem]
  )

  const update = useCallback(
    async (id: string, input: Input) => {
      const record = await updateItem(id, input)
      setItems((prev) => prev.map((item) => (item.id === id ? record : item)))
      return record
    },
    [updateItem]
  )

  const remove = useCallback(
    async (id: string) => {
      await removeItem(id)
      setItems((prev) => prev.filter((item) => item.id !== id))
    },
    [removeItem]
  )

  const reset = useCallback(async () => {
    const seeded = await resetItems()
    setItems(seeded)
    return seeded
  }, [resetItems])

  return { items, loading, error, create, update, remove, reset }
}
