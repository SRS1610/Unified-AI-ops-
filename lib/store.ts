"use client"

import { useCallback, useEffect, useState } from "react"
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

function read(): AppState {
  if (typeof window === "undefined") return DEFAULT_STATE
  try {
    const raw = window.localStorage.getItem(KEY)
    if (!raw) return DEFAULT_STATE
    return { ...DEFAULT_STATE, ...JSON.parse(raw) }
  } catch {
    return DEFAULT_STATE
  }
}

function write(state: AppState) {
  if (typeof window === "undefined") return
  window.localStorage.setItem(KEY, JSON.stringify(state))
  window.dispatchEvent(new CustomEvent("unifyops:state"))
}

export function useAppState() {
  const [state, setState] = useState<AppState>(DEFAULT_STATE)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    setState(read())
    setHydrated(true)
    const onChange = () => setState(read())
    window.addEventListener("unifyops:state", onChange)
    window.addEventListener("storage", onChange)
    return () => {
      window.removeEventListener("unifyops:state", onChange)
      window.removeEventListener("storage", onChange)
    }
  }, [])

  const update = useCallback((patch: Partial<AppState>) => {
    setState((prev) => {
      const next = { ...prev, ...patch }
      write(next)
      return next
    })
  }, [])

  const toggleConnector = useCallback((id: ConnectorId) => {
    setState((prev) => {
      const has = prev.connectedConnectors.includes(id)
      const next: AppState = {
        ...prev,
        connectedConnectors: has
          ? prev.connectedConnectors.filter((c) => c !== id)
          : [...prev.connectedConnectors, id],
      }
      write(next)
      return next
    })
  }, [])

  const reset = useCallback(() => {
    write(DEFAULT_STATE)
    setState(DEFAULT_STATE)
  }, [])

  return { state, hydrated, update, toggleConnector, reset }
}
