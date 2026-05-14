import { useCallback, useEffect, useState } from 'react'

import type { GeneratedKeyPair } from '../crypto/keygen'

/** A generated key pair, persisted with a user-editable label. */
export interface StoredKeyPair extends GeneratedKeyPair {
  id: string
  name: string
  createdAt: number
}

export interface KeyPairStore {
  keyPairs: StoredKeyPair[]
  addKeyPair: (pair: GeneratedKeyPair, name?: string) => StoredKeyPair
  removeKeyPair: (id: string) => void
  renameKeyPair: (id: string, name: string) => void
}

const STORAGE_KEY = 'gllg-keypairs'

function loadStored(): StoredKeyPair[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter(
      (kp): kp is StoredKeyPair =>
        !!kp &&
        typeof kp.id === 'string' &&
        typeof kp.name === 'string' &&
        typeof kp.privateKeyPem === 'string' &&
        typeof kp.publicKeyPem === 'string',
    )
  } catch {
    return []
  }
}

/**
 * Manage the list of generated RSA key pairs. They are kept in React state and
 * mirrored to localStorage so they survive page reloads.
 */
export function useKeyPairs(): KeyPairStore {
  const [keyPairs, setKeyPairs] = useState<StoredKeyPair[]>(loadStored)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(keyPairs))
    } catch {
      // localStorage may be unavailable (private mode / quota) — non-fatal.
    }
  }, [keyPairs])

  const addKeyPair = useCallback((pair: GeneratedKeyPair, name?: string): StoredKeyPair => {
    const stored: StoredKeyPair = {
      ...pair,
      id: crypto.randomUUID(),
      name: name?.trim() || new Date().toLocaleString(),
      createdAt: Date.now(),
    }
    setKeyPairs((prev) => [...prev, stored])
    return stored
  }, [])

  const removeKeyPair = useCallback((id: string) => {
    setKeyPairs((prev) => prev.filter((kp) => kp.id !== id))
  }, [])

  const renameKeyPair = useCallback((id: string, name: string) => {
    setKeyPairs((prev) =>
      prev.map((kp) => (kp.id === id ? { ...kp, name: name.trim() || kp.name } : kp)),
    )
  }, [])

  return { keyPairs, addKeyPair, removeKeyPair, renameKeyPair }
}
