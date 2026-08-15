import {
  AGENTS,
  CONNECTORS,
  SEED_ACTIONS,
  SEED_ACTIVITY,
  SEED_AUDIT,
  SEED_MESSAGES,
  SEED_TEAM,
  getAgent,
  getConnector,
} from "./mock-data"
import type {
  AgentAction,
  AgentMeta,
  AuditEntry,
  ChatMessage,
  ConnectorMeta,
  ConnectorState,
  TeamMember,
} from "./types"

const delay = (ms = 120) => new Promise((r) => setTimeout(r, ms))

export const api = {
  async listAgents(): Promise<AgentMeta[]> {
    await delay()
    return AGENTS
  },
  async getAgent(id: string): Promise<AgentMeta | undefined> {
    await delay()
    return getAgent(id)
  },
  async listConnectors(): Promise<ConnectorMeta[]> {
    await delay()
    return CONNECTORS
  },
  async getConnector(id: string): Promise<ConnectorMeta | undefined> {
    await delay()
    return getConnector(id)
  },
  async listPendingActions(): Promise<AgentAction[]> {
    await delay()
    return SEED_ACTIONS
  },
  async listRecentActivity(): Promise<AgentAction[]> {
    await delay()
    return SEED_ACTIVITY
  },
  async listMessages(threadId: string): Promise<ChatMessage[]> {
    await delay()
    return SEED_MESSAGES[threadId] ?? []
  },
  async listAudit(): Promise<AuditEntry[]> {
    await delay()
    return SEED_AUDIT
  },
  async listTeam(): Promise<TeamMember[]> {
    await delay()
    return SEED_TEAM
  },
}

export function draftReply(prompt: string, agent?: AgentMeta): ChatMessage {
  const name = agent?.name ?? "UnifyOps"
  const opener = agent
    ? `Here's what I found from your ${agent.tagline.toLowerCase()}`
    : "Here's a first pass"
  return {
    id: `msg_${Math.random().toString(36).slice(2, 8)}`,
    role: "agent",
    agentId: agent?.id,
    content: `${opener}:\n\n> "${prompt}"\n\nI can turn this into a draft action for your approval — or answer it inline. Which do you want?`,
    createdAt: new Date().toISOString(),
    citations: [
      { source: `${name} knowledge base`, snippet: "Matched 3 related documents." },
      { source: "Recent activity", snippet: "2 related actions in the last 24h." },
    ],
  }
}
