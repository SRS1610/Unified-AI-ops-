"use client"

import { Check, Pencil, X, Sparkles, Shield, AlertTriangle } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { getAgent } from "@/lib/mock-data"
import { cn, formatRelative } from "@/lib/utils"
import type { AgentAction } from "@/lib/types"

type Mode = "approval" | "activity"

interface AgentActionCardProps {
  action: AgentAction
  mode?: Mode
  onApprove?: (id: string) => void
  onReject?: (id: string) => void
  onEdit?: (id: string) => void
}

const riskVariant = {
  low: "success",
  medium: "warning",
  high: "destructive",
} as const

const statusLabel: Record<AgentAction["status"], string> = {
  pending: "Awaiting approval",
  approved: "Approved",
  rejected: "Rejected",
  auto: "Auto-approved",
}

export function AgentActionCard({
  action,
  mode = "approval",
  onApprove,
  onReject,
  onEdit,
}: AgentActionCardProps) {
  const agent = getAgent(action.agentId)

  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0 pb-3">
        <div className="flex min-w-0 items-start gap-3">
          <div
            className={cn(
              "flex h-10 w-10 flex-none items-center justify-center rounded-lg text-lg",
              agent?.color ?? "bg-muted",
            )}
            aria-hidden
          >
            {agent?.emoji ?? "✨"}
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {agent?.name ?? "Agent"}
              </span>
              <span className="text-xs text-muted-foreground">· {formatRelative(action.createdAt)}</span>
            </div>
            <h3 className="mt-1 line-clamp-2 text-base font-semibold text-foreground">
              {action.title}
            </h3>
            <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{action.summary}</p>
          </div>
        </div>
        <div className="flex flex-none flex-col items-end gap-2">
          <Badge variant={riskVariant[action.risk]}>{action.risk} risk</Badge>
          {mode === "activity" && (
            <span className="text-xs text-muted-foreground">{statusLabel[action.status]}</span>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-lg border bg-muted/40 p-3">
          <div className="mb-1 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5" />
            Preview
          </div>
          <pre className="whitespace-pre-wrap font-sans text-sm text-foreground">{action.preview}</pre>
        </div>

        <div className="grid grid-cols-1 gap-2 text-xs text-muted-foreground sm:grid-cols-2">
          <div className="flex items-start gap-2">
            <Shield className="mt-0.5 h-3.5 w-3.5 flex-none" />
            <span>
              <span className="font-medium text-foreground">Why: </span>
              {action.reason}
            </span>
          </div>
          {action.target && (
            <div className="flex items-start gap-2">
              <AlertTriangle className="mt-0.5 h-3.5 w-3.5 flex-none" />
              <span>
                <span className="font-medium text-foreground">Target: </span>
                {action.target}
              </span>
            </div>
          )}
        </div>

        {mode === "approval" && (
          <>
            <Separator />
            <div className="flex flex-wrap gap-2">
              <Button size="sm" onClick={() => onApprove?.(action.id)}>
                <Check className="h-4 w-4" />
                Approve
              </Button>
              <Button size="sm" variant="outline" onClick={() => onEdit?.(action.id)}>
                <Pencil className="h-4 w-4" />
                Edit
              </Button>
              <Button size="sm" variant="ghost" onClick={() => onReject?.(action.id)}>
                <X className="h-4 w-4" />
                Reject
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
