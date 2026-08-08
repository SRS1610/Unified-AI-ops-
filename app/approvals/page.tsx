"use client"

import { useEffect, useMemo, useState } from "react"
import { CheckCheck } from "lucide-react"
import { AgentActionCard } from "@/components/agent-action-card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { api } from "@/lib/mock-api"
import type { AgentAction } from "@/lib/types"

export default function ApprovalsPage() {
  const [actions, setActions] = useState<AgentAction[]>([])
  const [tab, setTab] = useState("all")

  useEffect(() => {
    api.listPendingActions().then(setActions)
  }, [])

  const filtered = useMemo(() => {
    if (tab === "all") return actions
    return actions.filter((a) => a.risk === tab)
  }, [actions, tab])

  function handleApprove(id: string) {
    setActions((prev) => prev.filter((a) => a.id !== id))
  }
  function handleReject(id: string) {
    setActions((prev) => prev.filter((a) => a.id !== id))
  }
  function handleEdit(id: string) {
    console.info("edit", id)
  }
  function bulkApproveLowRisk() {
    setActions((prev) => prev.filter((a) => a.risk !== "low"))
  }

  const lowRiskCount = actions.filter((a) => a.risk === "low").length

  return (
    <div className="mx-auto max-w-4xl px-6 py-8">
      <header className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Approvals</h1>
          <p className="text-sm text-muted-foreground">
            Review what your agents want to do. Every write action lands here first.
          </p>
        </div>
        {lowRiskCount > 0 && (
          <Button variant="outline" size="sm" onClick={bulkApproveLowRisk}>
            <CheckCheck className="h-4 w-4" />
            Approve {lowRiskCount} low-risk
          </Button>
        )}
      </header>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="all">All · {actions.length}</TabsTrigger>
          <TabsTrigger value="low">Low</TabsTrigger>
          <TabsTrigger value="medium">Medium</TabsTrigger>
          <TabsTrigger value="high">High</TabsTrigger>
        </TabsList>
        <TabsContent value={tab} className="space-y-4">
          {filtered.length === 0 && (
            <div className="rounded-xl border border-dashed bg-muted/20 p-10 text-center">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                <CheckCheck className="h-5 w-5" />
              </div>
              <h2 className="mt-3 text-lg font-semibold">You're all clear</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Nothing waiting for approval. Great work.
              </p>
            </div>
          )}
          {filtered.map((a) => (
            <AgentActionCard
              key={a.id}
              action={a}
              mode="approval"
              onApprove={handleApprove}
              onReject={handleReject}
              onEdit={handleEdit}
            />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}
