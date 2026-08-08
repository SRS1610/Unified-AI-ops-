"use client"

import { useEffect, useState } from "react"
import { Sidebar } from "./sidebar"
import { OnboardingGate } from "./onboarding-gate"
import { api } from "@/lib/mock-api"

export function AppShell({ children }: { children: React.ReactNode }) {
  const [approvalsCount, setApprovalsCount] = useState(0)

  useEffect(() => {
    api.listPendingActions().then((a) => setApprovalsCount(a.length))
  }, [])

  return (
    <OnboardingGate>
      <div className="flex min-h-screen bg-gradient-to-b from-white to-muted/40">
        <Sidebar approvalsCount={approvalsCount} />
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </OnboardingGate>
  )
}
