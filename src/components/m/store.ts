"use client"

import { useSyncExternalStore } from "react"

/** Mockup state shared across pages for this visit: which items have been handled. */
const done = new Set<string>()
let version = 0
const listeners = new Set<() => void>()

export function markDone(id: string) {
  done.add(id)
  version++
  listeners.forEach((l) => l())
}

export function undoDone(id: string) {
  done.delete(id)
  version++
  listeners.forEach((l) => l())
}

function subscribe(l: () => void) {
  listeners.add(l)
  return () => listeners.delete(l)
}

/** Re-renders when anything is marked done. Returns a checker. */
export function useDone() {
  useSyncExternalStore(subscribe, () => version, () => 0)
  return (id: string) => done.has(id)
}
