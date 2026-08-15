export type AgentId =
  | "support"
  | "sales"
  | "hr"
  | "compliance"
  | "ops"
  | "engineering"

export type UseCaseId = AgentId

export interface AgentMeta {
  id: AgentId
  name: string
  tagline: string
  emoji: string
  color: string
  samplePrompts: string[]
}

export type ConnectorId =
  | "gmail"
  | "slack"
  | "salesforce"
  | "zendesk"
  | "jira"
  | "notion"
  | "github"
  | "workday"

export interface ConnectorMeta {
  id: ConnectorId
  name: string
  category: string
  description: string
  emoji: string
}

export interface ConnectorState {
  id: ConnectorId
  connected: boolean
  lastSync?: string
  indexedItems?: number
  dataTypes?: string[]
}

export type ActionRisk = "low" | "medium" | "high"

export type ActionStatus = "pending" | "approved" | "rejected" | "auto"

export interface AgentAction {
  id: string
  agentId: AgentId
  title: string
  summary: string
  reason: string
  preview: string
  risk: ActionRisk
  status: ActionStatus
  createdAt: string
  actor?: string
  target?: string
  citations?: { source: string; snippet: string }[]
}

export interface ChatMessage {
  id: string
  role: "user" | "agent" | "system"
  agentId?: AgentId
  content: string
  createdAt: string
  citations?: { source: string; snippet: string }[]
}

export interface AuditEntry {
  id: string
  timestamp: string
  agentId: AgentId
  action: string
  target: string
  approver: string
  result: "success" | "rejected" | "failed"
}

export interface TeamMember {
  id: string
  name: string
  email: string
  role: "admin" | "operator" | "viewer"
}
