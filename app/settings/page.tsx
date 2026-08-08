"use client"

import { useEffect, useState } from "react"
import { CreditCard, Globe, RefreshCcw } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { api } from "@/lib/mock-api"
import { AGENTS } from "@/lib/mock-data"
import { useAppState } from "@/lib/store"
import type { TeamMember } from "@/lib/types"

export default function SettingsPage() {
  const { reset } = useAppState()
  const [team, setTeam] = useState<TeamMember[]>([])
  const [residency, setResidency] = useState<"us" | "eu">("us")

  useEffect(() => {
    api.listTeam().then(setTeam)
  }, [])

  return (
    <div className="mx-auto max-w-5xl px-6 py-8">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground">
          Team, approval rules, data residency, and billing.
        </p>
      </header>

      <Tabs defaultValue="team">
        <TabsList>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="rules">Approval rules</TabsTrigger>
          <TabsTrigger value="data">Data residency</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
        </TabsList>

        <TabsContent value="team">
          <Card>
            <CardContent className="p-0">
              <div className="flex items-center justify-between border-b p-5">
                <div>
                  <div className="text-base font-semibold">Team members</div>
                  <div className="text-sm text-muted-foreground">
                    Invite teammates and control what agents they can approve for.
                  </div>
                </div>
                <Button size="sm">Invite</Button>
              </div>
              <ul className="divide-y">
                {team.map((m) => (
                  <li key={m.id} className="flex items-center justify-between px-5 py-4">
                    <div>
                      <div className="text-sm font-medium">{m.name}</div>
                      <div className="text-xs text-muted-foreground">{m.email}</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant={m.role === "admin" ? "default" : "muted"}>{m.role}</Badge>
                      <Button size="sm" variant="ghost">Manage</Button>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rules">
          <Card>
            <CardContent className="space-y-5 p-5">
              <div>
                <div className="text-base font-semibold">Approval rules per agent</div>
                <div className="text-sm text-muted-foreground">
                  Low-risk defaults are shown. Override any agent from its own workspace.
                </div>
              </div>
              <Separator />
              <div className="space-y-4">
                {AGENTS.map((a) => (
                  <div key={a.id} className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{a.emoji}</span>
                      <div>
                        <div className="text-sm font-medium">{a.name}</div>
                        <div className="text-xs text-muted-foreground">
                          Auto-approve low-risk actions
                        </div>
                      </div>
                    </div>
                    <Switch defaultChecked={a.id !== "compliance"} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="data">
          <Card>
            <CardContent className="p-5">
              <div className="flex items-start justify-between gap-6">
                <div>
                  <div className="flex items-center gap-2 text-base font-semibold">
                    <Globe className="h-4 w-4" />
                    Data residency
                  </div>
                  <p className="mt-1 max-w-md text-sm text-muted-foreground">
                    Choose where your indexed data and model activity are stored. Changing this
                    triggers a re-index of connected sources.
                  </p>
                </div>
                <div className="w-56">
                  <Label className="text-xs text-muted-foreground">Region</Label>
                  <Select value={residency} onValueChange={(v) => setResidency(v as "us" | "eu")}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="us">United States (us-east-1)</SelectItem>
                      <SelectItem value="eu">European Union (eu-west-1)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing">
          <Card>
            <CardContent className="p-5">
              <div className="flex items-start justify-between gap-6">
                <div>
                  <div className="flex items-center gap-2 text-base font-semibold">
                    <CreditCard className="h-4 w-4" />
                    Billing
                  </div>
                  <p className="mt-1 max-w-md text-sm text-muted-foreground">
                    You're on the Business plan trial. Add a payment method to keep going after
                    Aug 30.
                  </p>
                </div>
                <Button variant="outline">Add payment method</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="mt-10 flex items-center justify-between rounded-xl border border-dashed p-4">
        <div className="text-xs text-muted-foreground">
          Prototype tools · reset local onboarding and clear connected sources
        </div>
        <Button size="sm" variant="ghost" onClick={reset}>
          <RefreshCcw className="h-4 w-4" />
          Reset workspace
        </Button>
      </div>
    </div>
  )
}
