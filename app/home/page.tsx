"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { ArrowRight } from "lucide-react"
import { ChatInterface } from "@/components/chat-interface"
import { AgentActionCard } from "@/components/agent-action-card"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AGENTS, getAgent } from "@/lib/mock-data"
import { api } from "@/lib/mock-api"
import { useAppState } from "@/lib/store"
import { cn } from "@/lib/utils"
import type { AgentAction } from "@/lib/types"

export default function HomePage() {
  const { state } = useAppState()
  const primary = state.primaryUseCase ? getAgent(state.primaryUseCase) : undefined
  const [activity, setActivity] = useState<AgentAction[]>([])
  const [pendingCount, setPendingCount] = useState(0)

  useEffect(() => {
    api.listRecentActivity().then(setActivity)
    api.listPendingActions().then((a) => setPendingCount(a.length))
  }, [])

  const suggestions = useMemo(
    () => primary?.samplePrompts ?? AGENTS[0].samplePrompts,
    [primary],
  )

  const connectedAgents = useMemo(() => {
    if (primary) return [primary, ...AGENTS.filter((a) => a.id !== primary.id).slice(0, 3)]
    return AGENTS.slice(0, 4)
  }, [primary])

  const placeholder = primary
    ? `Ask ${primary.name.replace(" Agent", "")} — or any agent — anything…`
    : "Ask about your tickets, leads, or team…"

  return (
    <div className="mx-auto flex h-screen max-w-7xl flex-col gap-6 px-6 py-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Good to see you{primary ? `, let's move ${primary.name.split(" ")[0].toLowerCase()} forward.` : "."}
          </h1>
          <p className="text-sm text-muted-foreground">
            Ask any of your agents a question. They&apos;ll propose actions — nothing runs without your approval.
          </p>
        </div>
        {pendingCount > 0 && (
          <Link href="/approvals">
            <Button variant="outline" size="sm">
              {pendingCount} pending approval{pendingCount === 1 ? "" : "s"}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        )}
      </header>

      <div className="grid min-h-0 flex-1 grid-cols-1 gap-6 lg:grid-cols-[1fr,340px]">
        <div className="min-h-[520px]">
          <ChatInterface
            threadId="home"
            placeholder={placeholder}
            suggestions={suggestions}
            size="hero"
            title="Ask anything"
          />
        </div>

        <aside className="flex min-h-0 flex-col gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Your agents
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2">
                {connectedAgents.map((a) => (
                  <Link
                    key={a.id}
                    href={`/agents/${a.id}`}
                    className="flex items-center gap-2 rounded-lg border bg-white p-2.5 transition hover:border-primary/40 hover:bg-accent/40"
                  >
                    <span
                      className={cn(
                        "flex h-8 w-8 items-center justify-center rounded-md text-base",
                        a.color,
                      )}
                    >
                      {a.emoji}
                    </span>
                    <div className="min-w-0">
                      <div className="truncate text-sm font-medium">
                        {a.name.replace(" Agent", "")}
                      </div>
                      <div className="truncate text-xs text-muted-foreground">
                        {a.tagline}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="flex-1 min-h-0 overflow-hidden rounded-2xl border bg-white">
            <div className="flex items-center justify-between border-b px-4 py-3">
              <div className="text-sm font-semibold">Recent activity</div>
              <Link href="/audit-log" className="text-xs text-primary hover:underline">
                See all
              </Link>
            </div>
            <div className="max-h-full space-y-3 overflow-y-auto p-4">
              {activity.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  Nothing yet — as your agents act, updates land here.
                </p>
              )}
              {activity.map((a) => (
                <AgentActionCard key={a.id} action={a} mode="activity" />
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
