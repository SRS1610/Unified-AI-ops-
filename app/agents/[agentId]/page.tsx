"use client"

import { notFound } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { ChatInterface } from "@/components/chat-interface"
import { AgentActionCard } from "@/components/agent-action-card"
import { Card, CardContent } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { getAgent } from "@/lib/mock-data"
import { api } from "@/lib/mock-api"
import { cn } from "@/lib/utils"
import type { AgentAction, AgentId } from "@/lib/types"

const KNOWN_IDS: AgentId[] = [
  "support",
  "sales",
  "hr",
  "compliance",
  "ops",
  "engineering",
]

export default function AgentDetailPage({ params }: { params: { agentId: string } }) {
  const agent = getAgent(params.agentId)
  if (!agent || !KNOWN_IDS.includes(params.agentId as AgentId)) notFound()

  const [activity, setActivity] = useState<AgentAction[]>([])
  const [autoApproveLow, setAutoApproveLow] = useState(true)
  const [autoDraftReplies, setAutoDraftReplies] = useState(true)
  const [dailyDigest, setDailyDigest] = useState(false)

  useEffect(() => {
    Promise.all([api.listPendingActions(), api.listRecentActivity()]).then(([p, r]) => {
      setActivity([...p, ...r].filter((a) => a.agentId === params.agentId))
    })
  }, [params.agentId])

  return (
    <div className="mx-auto flex h-screen max-w-7xl flex-col gap-6 px-6 py-6">
      <header className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <Link
            href="/agents"
            className="mt-2 text-muted-foreground hover:text-foreground"
            aria-label="Back to agents"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div
            className={cn(
              "flex h-12 w-12 items-center justify-center rounded-xl text-2xl",
              agent.color,
            )}
          >
            {agent.emoji}
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">{agent.name}</h1>
            <p className="text-sm text-muted-foreground">{agent.tagline}</p>
          </div>
        </div>
      </header>

      <div className="grid min-h-0 flex-1 grid-cols-1 gap-6 lg:grid-cols-[1fr,340px]">
        <div className="min-h-[520px]">
          <ChatInterface
            threadId={agent.id}
            agentId={agent.id}
            title={`Chat with ${agent.name}`}
            suggestions={agent.samplePrompts}
            showContextPanel
          />
        </div>

        <aside className="flex min-h-0 flex-col gap-4 overflow-y-auto">
          <Card>
            <CardContent className="p-4">
              <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Auto-approve rules
              </div>
              <div className="mt-3 space-y-3">
                <ToggleRow
                  label="Auto-approve low-risk actions"
                  description="Labels, tags, and read-only summaries."
                  checked={autoApproveLow}
                  onChange={setAutoApproveLow}
                />
                <ToggleRow
                  label="Auto-draft replies"
                  description="Draft messages appear in Approvals instead of sending directly."
                  checked={autoDraftReplies}
                  onChange={setAutoDraftReplies}
                />
                <ToggleRow
                  label="Post daily digest"
                  description="Summarize this agent's day to your primary channel."
                  checked={dailyDigest}
                  onChange={setDailyDigest}
                />
              </div>
              <Separator className="my-4" />
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Scope</span>
                <Badge variant="muted">{agent.name} only</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="mb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Recent activity
              </div>
              <div className="space-y-3">
                {activity.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    Nothing yet. Ask a question above to get started.
                  </p>
                )}
                {activity.map((a) => (
                  <AgentActionCard key={a.id} action={a} mode="activity" />
                ))}
              </div>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  )
}

function ToggleRow({
  label,
  description,
  checked,
  onChange,
}: {
  label: string
  description: string
  checked: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0">
        <Label className="text-sm">{label}</Label>
        <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
      </div>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  )
}
