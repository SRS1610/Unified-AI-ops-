"use client"

import { useEffect, useMemo, useState } from "react"
import { Download, Search } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { AGENTS, getAgent } from "@/lib/mock-data"
import { api } from "@/lib/mock-api"
import { formatDateTime } from "@/lib/utils"
import type { AuditEntry } from "@/lib/types"

export default function AuditLogPage() {
  const [entries, setEntries] = useState<AuditEntry[]>([])
  const [query, setQuery] = useState("")
  const [agentFilter, setAgentFilter] = useState<string>("all")
  const [resultFilter, setResultFilter] = useState<string>("all")

  useEffect(() => {
    api.listAudit().then(setEntries)
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return entries.filter((e) => {
      if (agentFilter !== "all" && e.agentId !== agentFilter) return false
      if (resultFilter !== "all" && e.result !== resultFilter) return false
      if (!q) return true
      return (
        e.action.toLowerCase().includes(q) ||
        e.target.toLowerCase().includes(q) ||
        e.approver.toLowerCase().includes(q)
      )
    })
  }, [entries, query, agentFilter, resultFilter])

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <header className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Audit log</h1>
          <p className="text-sm text-muted-foreground">
            Every agent action, every approval, every change — searchable and exportable.
          </p>
        </div>
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
      </header>

      <div className="mb-4 flex flex-wrap items-center gap-3 rounded-xl border bg-white p-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search actions, targets, approvers…"
            className="pl-9"
          />
        </div>
        <Select value={agentFilter} onValueChange={setAgentFilter}>
          <SelectTrigger className="w-44">
            <SelectValue placeholder="Agent" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All agents</SelectItem>
            {AGENTS.map((a) => (
              <SelectItem key={a.id} value={a.id}>
                {a.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={resultFilter} onValueChange={setResultFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Result" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All results</SelectItem>
            <SelectItem value="success">Success</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-xl border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[210px]">Timestamp</TableHead>
              <TableHead>Agent</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Target</TableHead>
              <TableHead>Approver</TableHead>
              <TableHead className="w-[110px]">Result</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((e) => {
              const agent = getAgent(e.agentId)
              return (
                <TableRow key={e.id}>
                  <TableCell className="whitespace-nowrap font-mono text-xs text-muted-foreground">
                    {formatDateTime(e.timestamp)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="text-base leading-none">{agent?.emoji}</span>
                      <span className="text-sm">{agent?.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">{e.action}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{e.target}</TableCell>
                  <TableCell className="text-sm">
                    {e.approver === "auto" ? (
                      <Badge variant="muted">auto</Badge>
                    ) : (
                      <span className="font-mono text-xs">{e.approver}</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <ResultBadge result={e.result} />
                  </TableCell>
                </TableRow>
              )
            })}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="py-10 text-center text-sm text-muted-foreground">
                  No entries match your filters.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

function ResultBadge({ result }: { result: AuditEntry["result"] }) {
  if (result === "success") return <Badge variant="success">Success</Badge>
  if (result === "rejected") return <Badge variant="warning">Rejected</Badge>
  return <Badge variant="destructive">Failed</Badge>
}
