import type {
  AgentAction,
  AgentMeta,
  AuditEntry,
  ChatMessage,
  ConnectorMeta,
  ConnectorState,
  TeamMember,
} from "./types"

export const AGENTS: AgentMeta[] = [
  {
    id: "support",
    name: "Support Agent",
    tagline: "Triage tickets and draft replies.",
    emoji: "🎧",
    color: "bg-sky-100 text-sky-700",
    samplePrompts: [
      "Summarize my open support tickets",
      "Draft a reply to the top escalation",
      "Which customers are churn risks this week?",
    ],
  },
  {
    id: "sales",
    name: "Sales Agent",
    tagline: "Follow up on leads and update the CRM.",
    emoji: "💼",
    color: "bg-emerald-100 text-emerald-700",
    samplePrompts: [
      "Show me leads that went cold this week",
      "Draft a follow-up email to Acme Corp",
      "Which opportunities need forecasting updates?",
    ],
  },
  {
    id: "hr",
    name: "HR Agent",
    tagline: "Answer policy questions and manage requests.",
    emoji: "🧑‍💼",
    color: "bg-violet-100 text-violet-700",
    samplePrompts: [
      "How many PTO days do I have left?",
      "Draft an offer letter for the Staff Eng role",
      "Summarize open interview loops",
    ],
  },
  {
    id: "compliance",
    name: "Compliance Agent",
    tagline: "Monitor policies and flag risky activity.",
    emoji: "🛡️",
    color: "bg-amber-100 text-amber-700",
    samplePrompts: [
      "Any SOC 2 controls due this month?",
      "Flag documents with PII shared externally",
      "Summarize the last audit findings",
    ],
  },
  {
    id: "ops",
    name: "Ops Agent",
    tagline: "Automate runbooks and incident response.",
    emoji: "⚙️",
    color: "bg-rose-100 text-rose-700",
    samplePrompts: [
      "What's the current incident status?",
      "Kick off the weekly backup runbook",
      "Which vendors have contracts renewing?",
    ],
  },
  {
    id: "engineering",
    name: "Engineering Agent",
    tagline: "Review PRs and summarize sprint progress.",
    emoji: "👨‍💻",
    color: "bg-indigo-100 text-indigo-700",
    samplePrompts: [
      "What broke in CI overnight?",
      "Summarize open PRs assigned to me",
      "Draft release notes for v2.4",
    ],
  },
]

export const CONNECTORS: ConnectorMeta[] = [
  { id: "gmail", name: "Gmail", category: "Email", description: "Index inbox threads and drafts.", emoji: "✉️" },
  { id: "slack", name: "Slack", category: "Messaging", description: "Search channels and DMs.", emoji: "💬" },
  { id: "salesforce", name: "Salesforce", category: "CRM", description: "Read and update leads and opportunities.", emoji: "☁️" },
  { id: "zendesk", name: "Zendesk", category: "Support", description: "Triage tickets and draft replies.", emoji: "🎫" },
  { id: "jira", name: "Jira", category: "Project", description: "Sync issues and sprints.", emoji: "📋" },
  { id: "notion", name: "Notion", category: "Docs", description: "Index company wiki content.", emoji: "📓" },
  { id: "github", name: "GitHub", category: "Engineering", description: "Watch PRs, issues, and CI runs.", emoji: "🐙" },
  { id: "workday", name: "Workday", category: "HR", description: "People data and PTO balances.", emoji: "🧾" },
]

export const INITIAL_CONNECTOR_STATE: ConnectorState[] = CONNECTORS.map((c) => ({
  id: c.id,
  connected: false,
}))

const iso = (mins: number) => new Date(Date.now() - mins * 60_000).toISOString()

export const SEED_ACTIONS: AgentAction[] = [
  {
    id: "act_1",
    agentId: "support",
    title: "Draft 3 replies to escalated tickets",
    summary: "Support Agent has drafted responses for tickets #4821, #4830, #4844.",
    reason: "These tickets have waited more than 24h and match your reply templates.",
    preview:
      "Hi Alex,\n\nThanks for flagging the invoice discrepancy. I've reviewed your account and confirmed the credit will apply to next month's cycle...",
    risk: "low",
    status: "pending",
    createdAt: iso(12),
    target: "Zendesk · 3 tickets",
    citations: [
      { source: "Zendesk ticket #4821", snippet: "Customer reports duplicate charge on July invoice." },
      { source: "Playbook: Billing disputes", snippet: "Offer prorated credit within 1 billing cycle." },
    ],
  },
  {
    id: "act_2",
    agentId: "sales",
    title: "Update 2 CRM opportunities",
    summary: "Move Acme Corp to Stage 4 and set Contoso close date to Aug 30.",
    reason: "Both accounts had verbal commitment on the last call transcript.",
    preview:
      "Acme Corp — Stage: Negotiation → Proposal Accepted\nContoso — Close date: Sep 15 → Aug 30",
    risk: "medium",
    status: "pending",
    createdAt: iso(38),
    target: "Salesforce · 2 records",
  },
  {
    id: "act_3",
    agentId: "engineering",
    title: "Post daily standup summary to #eng-standup",
    summary: "Auto-generated summary of yesterday's PRs, merges, and incident notes.",
    reason: "Scheduled daily digest, matches your approved template.",
    preview:
      "Yesterday: 12 PRs merged, 1 incident (SEV-3, resolved in 42m). Top movers: @rachel, @sam.",
    risk: "low",
    status: "pending",
    createdAt: iso(90),
    target: "Slack · #eng-standup",
  },
  {
    id: "act_4",
    agentId: "hr",
    title: "Approve PTO request from Priya Shah",
    summary: "5 days requested, Aug 18–22. Balance covers request.",
    reason: "Policy: within 30-day notice window and enough balance.",
    preview: "Approve PTO: Priya Shah · Aug 18–22 · Reason: Family trip",
    risk: "medium",
    status: "pending",
    createdAt: iso(180),
    target: "Workday · PTO request #331",
  },
]

export const SEED_ACTIVITY: AgentAction[] = [
  {
    id: "act_done_1",
    agentId: "support",
    title: "Auto-tagged 14 tickets as billing",
    summary: "Applied billing label to matching tickets.",
    reason: "Auto-approved: label-only, low risk.",
    preview: "14 tickets updated.",
    risk: "low",
    status: "auto",
    createdAt: iso(320),
    target: "Zendesk",
  },
  {
    id: "act_done_2",
    agentId: "sales",
    title: "Logged call notes for 4 opportunities",
    summary: "Transcripts summarized and appended to Salesforce activity feed.",
    reason: "Auto-approved: notes only, no field changes.",
    preview: "Acme, Contoso, Globex, Initech updated.",
    risk: "low",
    status: "auto",
    createdAt: iso(720),
    target: "Salesforce",
  },
]

export const SEED_MESSAGES: Record<string, ChatMessage[]> = {
  home: [],
  support: [
    {
      id: "m1",
      role: "agent",
      agentId: "support",
      content:
        "Good morning. There are 7 open tickets in your queue. 3 are waiting >24h — want me to draft replies?",
      createdAt: iso(60),
    },
  ],
  sales: [
    {
      id: "m2",
      role: "agent",
      agentId: "sales",
      content:
        "Acme Corp responded positively to your Tuesday email. Want me to draft a follow-up with pricing?",
      createdAt: iso(45),
    },
  ],
  hr: [],
  compliance: [],
  ops: [],
  engineering: [],
}

export const SEED_AUDIT: AuditEntry[] = [
  {
    id: "a1",
    timestamp: iso(5),
    agentId: "support",
    action: "Draft reply",
    target: "Zendesk ticket #4821",
    approver: "sri.bng@gmail.com",
    result: "success",
  },
  {
    id: "a2",
    timestamp: iso(45),
    agentId: "sales",
    action: "Update opportunity stage",
    target: "Salesforce · Acme Corp",
    approver: "sri.bng@gmail.com",
    result: "success",
  },
  {
    id: "a3",
    timestamp: iso(180),
    agentId: "support",
    action: "Auto-tag tickets",
    target: "Zendesk · 14 tickets",
    approver: "auto",
    result: "success",
  },
  {
    id: "a4",
    timestamp: iso(240),
    agentId: "compliance",
    action: "Flag PII in shared doc",
    target: "Notion · Q3 planning",
    approver: "auto",
    result: "success",
  },
  {
    id: "a5",
    timestamp: iso(360),
    agentId: "hr",
    action: "Draft offer letter",
    target: "Greenhouse · req 88",
    approver: "priya@unifyops.ai",
    result: "success",
  },
  {
    id: "a6",
    timestamp: iso(720),
    agentId: "engineering",
    action: "Post standup digest",
    target: "Slack · #eng-standup",
    approver: "auto",
    result: "success",
  },
  {
    id: "a7",
    timestamp: iso(1440),
    agentId: "ops",
    action: "Restart staging worker",
    target: "AWS · worker-2",
    approver: "sri.bng@gmail.com",
    result: "success",
  },
  {
    id: "a8",
    timestamp: iso(1800),
    agentId: "sales",
    action: "Draft cold outreach",
    target: "Gmail · 6 recipients",
    approver: "sri.bng@gmail.com",
    result: "rejected",
  },
]

export const SEED_TEAM: TeamMember[] = [
  { id: "u1", name: "Sri B.", email: "sri.bng@gmail.com", role: "admin" },
  { id: "u2", name: "Priya Shah", email: "priya@unifyops.ai", role: "operator" },
  { id: "u3", name: "Alex Chen", email: "alex@unifyops.ai", role: "operator" },
  { id: "u4", name: "Dana Kim", email: "dana@unifyops.ai", role: "viewer" },
]

export function getAgent(id: string): AgentMeta | undefined {
  return AGENTS.find((a) => a.id === id)
}

export function getConnector(id: string): ConnectorMeta | undefined {
  return CONNECTORS.find((c) => c.id === id)
}
