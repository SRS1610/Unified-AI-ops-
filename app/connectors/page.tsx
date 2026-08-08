"use client"

import { useMemo, useState } from "react"
import { Check, Database, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CONNECTORS } from "@/lib/mock-data"
import { useAppState } from "@/lib/store"
import { cn, formatRelative } from "@/lib/utils"
import type { ConnectorId } from "@/lib/types"

const FAKE_SYNC_DETAILS: Record<
  ConnectorId,
  { items: number; dataTypes: string[]; lastSync: string }
> = {
  gmail: { items: 1240, dataTypes: ["Threads", "Drafts", "Labels"], lastSync: iso(15) },
  slack: { items: 3891, dataTypes: ["Public channels", "DMs"], lastSync: iso(6) },
  salesforce: { items: 512, dataTypes: ["Leads", "Opportunities", "Accounts"], lastSync: iso(45) },
  zendesk: { items: 214, dataTypes: ["Tickets", "Views"], lastSync: iso(9) },
  jira: { items: 802, dataTypes: ["Issues", "Sprints"], lastSync: iso(60) },
  notion: { items: 328, dataTypes: ["Docs", "Databases"], lastSync: iso(120) },
  github: { items: 74, dataTypes: ["PRs", "Issues", "Actions"], lastSync: iso(3) },
  workday: { items: 96, dataTypes: ["People", "PTO", "Reviews"], lastSync: iso(240) },
}

function iso(mins: number) {
  return new Date(Date.now() - mins * 60_000).toISOString()
}

export default function ConnectorsPage() {
  const { state, toggleConnector } = useAppState()
  const [openId, setOpenId] = useState<ConnectorId | null>(null)

  const connectedSet = useMemo(() => new Set(state.connectedConnectors), [state.connectedConnectors])

  return (
    <div className="mx-auto max-w-5xl px-6 py-8">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Connectors</h1>
        <p className="text-sm text-muted-foreground">
          Connect the tools your team already uses. Your agents get smarter with every source.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CONNECTORS.map((c) => {
          const isConnected = connectedSet.has(c.id as ConnectorId)
          const detail = FAKE_SYNC_DETAILS[c.id as ConnectorId]
          const open = openId === c.id
          return (
            <Card
              key={c.id}
              className={cn(
                "flex flex-col transition",
                isConnected && "border-primary/40",
              )}
            >
              <CardContent className="flex flex-1 flex-col gap-4 p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-xl">
                      {c.emoji}
                    </div>
                    <div>
                      <div className="text-base font-semibold">{c.name}</div>
                      <div className="text-xs text-muted-foreground">{c.category}</div>
                    </div>
                  </div>
                  <StatusDot connected={isConnected} />
                </div>

                <p className="text-sm text-muted-foreground">{c.description}</p>

                {isConnected && open && (
                  <>
                    <Separator />
                    <div className="space-y-2 text-xs">
                      <div className="flex items-center gap-2">
                        <Database className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="text-muted-foreground">
                          Indexing{" "}
                          <span className="font-medium text-foreground">
                            {detail.items.toLocaleString()}
                          </span>{" "}
                          items
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {detail.dataTypes.map((t) => (
                          <Badge key={t} variant="muted">
                            {t}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <RefreshCw className="h-3.5 w-3.5" />
                        Last sync {formatRelative(detail.lastSync)}
                      </div>
                    </div>
                  </>
                )}

                <div className="mt-auto flex items-center justify-between">
                  {isConnected ? (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setOpenId(open ? null : (c.id as ConnectorId))}
                    >
                      {open ? "Hide details" : "View details"}
                    </Button>
                  ) : (
                    <span className="text-xs text-muted-foreground">Not connected</span>
                  )}
                  <Button
                    size="sm"
                    variant={isConnected ? "outline" : "default"}
                    onClick={() => toggleConnector(c.id as ConnectorId)}
                  >
                    {isConnected ? "Disconnect" : "Connect"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

function StatusDot({ connected }: { connected: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-medium",
        connected ? "bg-emerald-100 text-emerald-700" : "bg-muted text-muted-foreground",
      )}
    >
      <span
        className={cn(
          "h-1.5 w-1.5 rounded-full",
          connected ? "bg-emerald-500" : "bg-muted-foreground/50",
        )}
      />
      {connected ? (
        <>
          <Check className="h-3 w-3" /> Connected
        </>
      ) : (
        "Available"
      )}
    </span>
  )
}
