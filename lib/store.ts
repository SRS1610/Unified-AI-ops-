"use client"

import { useCallback, useSyncExternalStore } from "react"
import type { ConnectorId, UseCaseId } from "./types"

const KEY = "unifyops:v1"

interface AppState {
  onboardingComplete: boolean
  primaryUseCase: UseCaseId | null
  connectedConnectors: ConnectorId[]
}

const DEFAULT_STATE: AppState = {
  onboardingComplete: false,
  primaryUseCase: null,
  connectedConnectors: [],
}

let cache: { raw: string | null; state: AppState } | null = null

function read(): AppState {
  if (typeof window === "undefined") return DEFAULT_STATE
  const raw = window.localStorage.getItem(KEY)
  if (cache && cache.raw === raw) return cache.state
  let state = DEFAULT_STATE
  if (raw) {
    try {
      state = { ...DEFAULT_STATE, ...JSON.parse(raw) }
    } catch {
      state = DEFAULT_STATE
    }
  }
  cache = { raw, state }
  return state
}

function write(state: AppState) {
  if (typeof window === "undefined") return
  window.localStorage.setItem(KEY, JSON.stringify(state))
  window.dispatchEvent(new CustomEvent("unifyops:state"))
}

function subscribe(callback: () => void) {
  window.addEventListener("unifyops:state", callback)
  window.addEventListener("storage", callback)
  return () => {
    window.removeEventListener("unifyops:state", callback)
    window.removeEventListener("storage", callback)
  }
}

function subscribeOnce() {
  return () => {}
}

export function useAppState() {
  const state = useSyncExternalStore(subscribe, read, () => DEFAULT_STATE)
  const hydrated = useSyncExternalStore(
    subscribeOnce,
    () => true,
    () => false,
  )

  const update = useCallback((patch: Partial<AppState>) => {
    write({ ...read(), ...patch })
  }, [])

  const toggleConnector = useCallback((id: ConnectorId) => {
    const prev = read()
    const has = prev.connectedConnectors.includes(id)
    write({
      ...prev,
      connectedConnectors: has
        ? prev.connectedConnectors.filter((c) => c !== id)
        : [...prev.connectedConnectors, id],
    })
  }, [])

  const reset = useCallback(() => {
    write(DEFAULT_STATE)
  }, [])

  return { state, hydrated, update, toggleConnector, reset }
}
