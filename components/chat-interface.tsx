"use client"

import { useEffect, useId, useMemo, useRef, useState } from "react"
import { Send, Sparkles, PanelRightOpen, PanelRightClose } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { api, draftReply } from "@/lib/mock-api"
import { getAgent } from "@/lib/mock-data"
import { cn, formatRelative } from "@/lib/utils"
import type { AgentId, ChatMessage } from "@/lib/types"

interface ChatInterfaceProps {
  threadId: string
  agentId?: AgentId
  title?: string
  placeholder?: string
  suggestions?: string[]
  showContextPanel?: boolean
  size?: "hero" | "compact"
}

export function ChatInterface({
  threadId,
  agentId,
  title,
  placeholder,
  suggestions = [],
  showContextPanel = true,
  size = "compact",
}: ChatInterfaceProps) {
  const agent = agentId ? getAgent(agentId) : undefined
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState("")
  const [thinking, setThinking] = useState(false)
  const [panelOpen, setPanelOpen] = useState(false)
  const scrollRef = useRef<HTMLDivElement | null>(null)
  const idPrefix = useId()
  const messageCounter = useRef(0)

  useEffect(() => {
    api.listMessages(threadId).then(setMessages)
  }, [threadId])

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" })
  }, [messages.length, thinking])

  const lastAgent = useMemo(
    () => [...messages].reverse().find((m) => m.role === "agent"),
    [messages],
  )

  async function send(text: string) {
    const trimmed = text.trim()
    if (!trimmed) return
    messageCounter.current += 1
    const userMsg: ChatMessage = {
      id: `${idPrefix}-${messageCounter.current}`,
      role: "user",
      content: trimmed,
      createdAt: new Date().toISOString(),
    }
    setMessages((m) => [...m, userMsg])
    setInput("")
    setThinking(true)
    setTimeout(() => {
      setMessages((m) => [...m, draftReply(trimmed, agent)])
      setThinking(false)
    }, 700)
  }

  const inputPlaceholder =
    placeholder ??
    (agent
      ? `Ask ${agent.name.replace(" Agent", "")} anything…`
      : "Ask about your tickets, leads, or team…")

  return (
    <div className="flex h-full min-h-0 gap-4">
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden rounded-2xl border bg-white shadow-sm">
        {title && (
          <div className="flex items-center justify-between border-b px-5 py-3">
            <div className="flex items-center gap-2">
              {agent ? (
                <span
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-md text-base",
                    agent.color,
                  )}
                >
                  {agent.emoji}
                </span>
              ) : (
                <span className="flex h-8 w-8 items-center justify-center rounded-md bg-accent text-accent-foreground">
                  <Sparkles className="h-4 w-4" />
                </span>
              )}
              <div>
                <div className="text-sm font-semibold">{title}</div>
                {agent && (
                  <div className="text-xs text-muted-foreground">{agent.tagline}</div>
                )}
              </div>
            </div>
            {showContextPanel && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setPanelOpen((p) => !p)}
                className="hidden lg:inline-flex"
              >
                {panelOpen ? (
                  <>
                    <PanelRightClose className="h-4 w-4" />
                    Hide sources
                  </>
                ) : (
                  <>
                    <PanelRightOpen className="h-4 w-4" />
                    Show sources
                  </>
                )}
              </Button>
            )}
          </div>
        )}

        <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto px-5 py-6">
          {messages.length === 0 && (
            <EmptyState
              size={size}
              agentEmoji={agent?.emoji ?? "✨"}
              headline={
                agent
                  ? `Start a conversation with ${agent.name}.`
                  : "What do you want to get done today?"
              }
              suggestions={suggestions}
              onPick={(s) => send(s)}
            />
          )}

          {messages.map((m) => (
            <MessageBubble key={m.id} message={m} />
          ))}

          {thinking && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="inline-flex h-2 w-2 animate-pulse rounded-full bg-primary" />
              Thinking…
            </div>
          )}
        </div>

        <div className="border-t bg-muted/30 p-3">
          <form
            className="flex items-end gap-2"
            onSubmit={(e) => {
              e.preventDefault()
              send(input)
            }}
          >
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={inputPlaceholder}
              className={cn(
                "min-h-[56px] resize-none border-transparent bg-white text-base shadow-sm focus-visible:ring-1",
                size === "hero" && "min-h-[80px] text-lg",
              )}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  send(input)
                }
              }}
            />
            <Button type="submit" size={size === "hero" ? "xl" : "lg"} disabled={!input.trim()}>
              <Send className="h-4 w-4" />
              Send
            </Button>
          </form>
          {suggestions.length > 0 && messages.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {suggestions.slice(0, 3).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => send(s)}
                  className="rounded-full border bg-white px-3 py-1 text-xs text-muted-foreground transition hover:bg-accent hover:text-accent-foreground"
                >
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {showContextPanel && panelOpen && (
        <aside className="hidden w-72 flex-none rounded-2xl border bg-white p-4 shadow-sm lg:block">
          <div className="mb-3 flex items-center justify-between">
            <div className="text-sm font-semibold">Sources</div>
            <Badge variant="muted">Transparency</Badge>
          </div>
          {lastAgent?.citations && lastAgent.citations.length > 0 ? (
            <ul className="space-y-3">
              {lastAgent.citations.map((c, i) => (
                <li key={i} className="rounded-md border bg-muted/40 p-3">
                  <div className="text-xs font-medium text-foreground">{c.source}</div>
                  <div className="mt-1 text-xs text-muted-foreground">{c.snippet}</div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-muted-foreground">
              When an agent uses data or documents to answer, its sources appear here.
            </p>
          )}
          <Separator className="my-4" />
          <div className="text-xs text-muted-foreground">
            Every write action from any agent gets previewed before it runs. You approve, edit, or
            reject.
          </div>
        </aside>
      )}
    </div>
  )
}

function MessageBubble({ message }: { message: ChatMessage }) {
  const agent = message.agentId ? getAgent(message.agentId) : undefined
  const isUser = message.role === "user"
  return (
    <div className={cn("flex gap-3", isUser ? "justify-end" : "justify-start")}>
      {!isUser && (
        <div
          className={cn(
            "flex h-8 w-8 flex-none items-center justify-center rounded-md text-sm",
            agent?.color ?? "bg-accent text-accent-foreground",
          )}
        >
          {agent?.emoji ?? "✨"}
        </div>
      )}
      <div
        className={cn(
          "max-w-[75%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm",
          isUser
            ? "rounded-br-sm bg-primary text-primary-foreground"
            : "rounded-bl-sm bg-muted text-foreground",
        )}
      >
        <div className="whitespace-pre-wrap">{message.content}</div>
        <div
          className={cn(
            "mt-1 text-[10px] uppercase tracking-wide",
            isUser ? "text-primary-foreground/70" : "text-muted-foreground",
          )}
        >
          {isUser ? "You" : agent?.name ?? "Agent"} · {formatRelative(message.createdAt)}
        </div>
      </div>
    </div>
  )
}

function EmptyState({
  size,
  agentEmoji,
  headline,
  suggestions,
  onPick,
}: {
  size: "hero" | "compact"
  agentEmoji: string
  headline: string
  suggestions: string[]
  onPick: (s: string) => void
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-xl border border-dashed bg-muted/20 px-6 py-10 text-center",
        size === "hero" && "py-16",
      )}
    >
      <div className="mb-4 text-3xl" aria-hidden>
        {agentEmoji}
      </div>
      <h2 className={cn("text-xl font-semibold", size === "hero" && "text-2xl")}>{headline}</h2>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        Ask a question or give an instruction. The agent will propose an action; nothing gets sent
        without your approval.
      </p>
      {suggestions.length > 0 && (
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {suggestions.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => onPick(s)}
              className="rounded-full border bg-white px-4 py-1.5 text-sm text-foreground transition hover:bg-accent hover:text-accent-foreground"
            >
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
