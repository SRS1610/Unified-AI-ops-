"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { AGENTS } from "@/lib/mock-data"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export default function AgentsIndex() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-8">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Agents</h1>
        <p className="text-sm text-muted-foreground">
          Each agent has its own workspace and its own approval rules.
        </p>
      </header>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {AGENTS.map((a) => (
          <Link key={a.id} href={`/agents/${a.id}`}>
            <Card className="h-full transition hover:border-primary/40 hover:shadow-md">
              <CardContent className="flex h-full flex-col gap-3 p-5">
                <div className="flex items-center justify-between">
                  <span
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-lg text-xl",
                      a.color,
                    )}
                  >
                    {a.emoji}
                  </span>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <div className="text-base font-semibold">{a.name}</div>
                  <div className="mt-1 text-sm text-muted-foreground">{a.tagline}</div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
