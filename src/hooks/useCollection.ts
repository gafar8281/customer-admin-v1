import { useEffect, useState } from "react"

interface CollectionOperations<T extends { id: string }, Input> {
  subscribe: (
    onData: (items: T[]) => void,
    onError: (error: Error) => void
  ) => () => void
  create: (input: Input) => Promise<T>
  update: (id: string, input: Input) => Promise<T>
  remove: (id: string) => Promise<void>
}

export function useCollection<T extends { id: string }, Input>({
  subscribe,
  create,
  update,
  remove,
}: CollectionOperations<T, Input>) {
  const [items, setItems] = useState<T[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Resets loading/error synchronously during render when `subscribe` changes,
  // rather than in the effect body — avoids an extra cascading render.
  const [prevSubscribe, setPrevSubscribe] = useState(() => subscribe)
  if (subscribe !== prevSubscribe) {
    setPrevSubscribe(() => subscribe)
    setLoading(true)
    setError(null)
  }

  useEffect(() => {
    const unsubscribe = subscribe(
      (data) => {
        setItems(data)
        setLoading(false)
      },
      () => {
        setError("load_failed")
        setLoading(false)
      }
    )

    return unsubscribe
  }, [subscribe])

  return { items, loading, error, create, update, remove }
}
