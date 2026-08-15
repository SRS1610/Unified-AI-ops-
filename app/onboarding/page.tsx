"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowRight, Check, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { AGENTS, CONNECTORS, getAgent } from "@/lib/mock-data"
import { useAppState } from "@/lib/store"
import type { ConnectorId, UseCaseId } from "@/lib/types"

const STEPS = ["Use case", "Connect data", "Try it"] as const

export default function OnboardingPage() {
  const router = useRouter()
  const { state, update, toggleConnector } = useAppState()
  const [step, setStep] = useState(0)
  const [useCase, setUseCase] = useState<UseCaseId | null>(state.primaryUseCase)

  const agent = useCase ? getAgent(useCase) : undefined
  const connected = state.connectedConnectors
  const canNext = useMemo(() => {
    if (step === 0) return !!useCase
    if (step === 1) return connected.length >= 1
    return true
  }, [step, useCase, connected.length])

  function finish() {
    update({ onboardingComplete: true, primaryUseCase: useCase })
    router.replace("/home")
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-3xl flex-col px-6 py-10">
      <header className="mb-10 flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Sparkles className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-lg font-semibold">Welcome to UnifyOps AI</h1>
          <p className="text-sm text-muted-foreground">Three quick steps, then you&apos;re in.</p>
        </div>
      </header>

      <Stepper current={step} />

      <div className="mt-8 flex-1">
        {step === 0 && (
          <StepCard
            title="What do you want your first agent to help with?"
            description="Pick the area you spend the most time on. You can always add more agents later."
          >
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {AGENTS.map((a) => {
                const active = useCase === a.id
                return (
                  <button
                    key={a.id}
                    type="button"
                    onClick={() => setUseCase(a.id)}
                    className={cn(
                      "flex flex-col items-start gap-3 rounded-xl border bg-white p-4 text-left transition hover:border-primary/50 hover:shadow-sm",
                      active && "border-primary ring-2 ring-primary/20",
                    )}
                  >
                    <div className={cn("flex h-10 w-10 items-center justify-center rounded-lg text-xl", a.color)}>
                      {a.emoji}
                    </div>
                    <div>
                      <div className="text-sm font-semibold">{a.name.replace(" Agent", "")}</div>
                      <div className="mt-1 text-xs text-muted-foreground">{a.tagline}</div>
                    </div>
                  </button>
                )
              })}
            </div>
          </StepCard>
        )}

        {step === 1 && (
          <StepCard
            title="Connect one data source"
            description="Your agent gets useful the moment it has real data to draw from. Connect at least one to continue — you can add more later."
          >
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {CONNECTORS.slice(0, 4).map((c) => {
                const isConnected = connected.includes(c.id as ConnectorId)
                return (
                  <div
                    key={c.id}
                    className="flex items-center justify-between rounded-xl border bg-white p-4"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-10 w-10 flex-none items-center justify-center rounded-lg bg-muted text-xl">
                        {c.emoji}
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-semibold">{c.name}</div>
                        <div className="truncate text-xs text-muted-foreground">
                          {c.description}
                        </div>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant={isConnected ? "secondary" : "default"}
                      onClick={() => toggleConnector(c.id as ConnectorId)}
                    >
                      {isConnected ? (
                        <>
                          <Check className="h-4 w-4" /> Connected
                        </>
                      ) : (
                        "Connect"
                      )}
                    </Button>
                  </div>
                )
              })}
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              Prototype note: connections are simulated — nothing leaves your browser.
            </p>
          </StepCard>
        )}

        {step === 2 && agent && (
          <StepCard
            title="Try your first prompt"
            description={`Your ${agent.name} is ready. Here's a good first question to try.`}
          >
            <Card className="border-primary/30 bg-accent/40">
              <CardContent className="flex flex-col gap-4 p-6">
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-lg text-xl",
                      agent.color,
                    )}
                  >
                    {agent.emoji}
                  </div>
                  <div>
                    <div className="text-sm font-semibold">{agent.name}</div>
                    <div className="text-xs text-muted-foreground">{agent.tagline}</div>
                  </div>
                </div>
                <div className="rounded-lg border bg-white p-4">
                  <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Try asking
                  </div>
                  <div className="mt-1 text-base font-medium text-foreground">
                    &ldquo;{agent.samplePrompts[0]}&rdquo;
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {agent.samplePrompts.slice(1).map((p) => (
                    <Badge key={p} variant="muted" className="rounded-md px-2 py-1 text-xs">
                      {p}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </StepCard>
        )}
      </div>

      <div className="mt-8 flex items-center justify-between border-t pt-6">
        <Button
          variant="ghost"
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
        >
          Back
        </Button>
        {step < STEPS.length - 1 ? (
          <Button
            onClick={() => {
              if (step === 0 && useCase) update({ primaryUseCase: useCase })
              setStep((s) => s + 1)
            }}
            disabled={!canNext}
          >
            Continue
            <ArrowRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button onClick={finish} disabled={!useCase}>
            Enter workspace
            <ArrowRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  )
}

function Stepper({ current }: { current: number }) {
  return (
    <ol className="flex items-center gap-3 text-xs">
      {STEPS.map((label, i) => {
        const done = i < current
        const active = i === current
        return (
          <li key={label} className="flex items-center gap-3">
            <div
              className={cn(
                "flex h-6 w-6 items-center justify-center rounded-full border text-[11px] font-semibold",
                done && "border-primary bg-primary text-primary-foreground",
                active && "border-primary text-primary",
                !done && !active && "border-muted-foreground/30 text-muted-foreground",
              )}
            >
              {done ? <Check className="h-3.5 w-3.5" /> : i + 1}
            </div>
            <span className={cn(active ? "font-medium text-foreground" : "text-muted-foreground")}>
              {label}
            </span>
            {i < STEPS.length - 1 && <span className="mx-2 h-px w-8 bg-border" />}
          </li>
        )
      })}
    </ol>
  )
}

function StepCard({
  title,
  description,
  children,
}: {
  title: string
  description: string
  children: React.ReactNode
}) {
  return (
    <div>
      <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
      <p className="mt-1 max-w-xl text-sm text-muted-foreground">{description}</p>
      <div className="mt-6">{children}</div>
    </div>
  )
}
