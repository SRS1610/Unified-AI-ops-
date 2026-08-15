"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAppState } from "@/lib/store"

export default function IndexPage() {
  const router = useRouter()
  const { state, hydrated } = useAppState()

  useEffect(() => {
    if (!hydrated) return
    router.replace(state.onboardingComplete ? "/home" : "/onboarding")
  }, [hydrated, state.onboardingComplete, router])

  return (
    <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">
      Loading UnifyOps…
    </div>
  )
}
