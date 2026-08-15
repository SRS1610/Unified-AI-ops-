"use client"

import { useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { useAppState } from "@/lib/store"

export function OnboardingGate({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const { state, hydrated } = useAppState()

  useEffect(() => {
    if (!hydrated) return
    if (!state.onboardingComplete && pathname !== "/onboarding") {
      router.replace("/onboarding")
    }
  }, [hydrated, state.onboardingComplete, pathname, router])

  if (!hydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">
        Loading workspace…
      </div>
    )
  }

  return <>{children}</>
}
