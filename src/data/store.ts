import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore"

import { db } from "@/lib/firebase"

type WithMeta = {
  id: string
  createdAt: string
  updatedAt: string
}

interface CollectionApi<T extends WithMeta, Input extends Record<string, unknown>> {
  subscribe(onData: (items: T[]) => void, onError: (error: Error) => void): () => void
  create(input: Input): Promise<T>
  update(id: string, input: Input): Promise<T>
  remove(id: string): Promise<void>
}

export function createCollection<
  T extends WithMeta,
  Input extends Record<string, unknown> = Omit<T, keyof WithMeta>,
>(collectionName: string): CollectionApi<T, Input> {
  const ref = collection(db, collectionName)

  return {
    subscribe(onData, onError) {
      const q = query(ref, orderBy("createdAt"))
      return onSnapshot(
        q,
        (snapshot) => {
          const items = snapshot.docs.map(
            (docSnapshot) => ({ id: docSnapshot.id, ...docSnapshot.data() }) as T
          )
          onData(items)
        },
        onError
      )
    },

    async create(input) {
      const now = new Date().toISOString()
      const data = { ...input, createdAt: now, updatedAt: now }
      const docRef = await addDoc(ref, data)
      return { ...data, id: docRef.id } as unknown as T
    },

    async update(id, input) {
      const now = new Date().toISOString()
      const data = { ...input, updatedAt: now }
      await updateDoc(doc(ref, id), data)
      return { ...data, id } as unknown as T
    },

    async remove(id) {
      await deleteDoc(doc(ref, id))
    },
  }
}
