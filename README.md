# UnifyOps AI — Front-end Prototype

Chat-first workspace where business users interact with AI agents (Support,
Sales, HR, Compliance, Ops, Engineering) through one simple, conversational UI
backed by a shared knowledge layer.

This repo is the front-end scaffold: Next.js 14 (App Router), TypeScript,
Tailwind CSS, and a mock API layer that's easy to swap for a real backend.

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000. On first visit you'll be routed through onboarding;
once complete, you land on `/home`.

Prototype state (onboarding completion, primary use case, connected connectors)
is persisted in `localStorage`. Reset it any time from **Settings → Reset
workspace**.

## Pages

| Route              | What it is                                                   |
| ------------------ | ------------------------------------------------------------ |
| `/onboarding`      | Three-step guided setup: pick use case → connect one data source → try a suggested prompt. Gates first entry to `/home`. |
| `/home`            | Chat-first main surface. Large chat input, recent-activity feed, quick agent switcher, optional right-side sources panel. |
| `/approvals`       | Queue of pending agent actions with Approve / Edit / Reject on every card. Bulk-approve for low-risk actions. |
| `/agents`          | Grid of every agent.                                         |
| `/agents/[id]`     | Focused agent workspace: its own chat thread, its own activity feed, and per-agent auto-approve rules. |
| `/connectors`      | Grid of integrations with status dots, one-click connect/disconnect, and details for connected sources. |
| `/audit-log`       | Searchable, filterable enterprise-grade table of every action taken, who approved it, and its result. |
| `/settings`        | Team & roles, per-agent approval rules, data residency (US/EU), billing placeholder. |

## Design principles applied

1. **Chat-first home** — the home screen is a conversation, not a dashboard.
2. **Progressive disclosure** — first-time users see onboarding; advanced
   surfaces (audit log, admin, connectors) live behind clearly labelled nav
   items in the sidebar.
3. **Universal action pattern** — every agent-initiated write goes through
   `AgentActionCard`: preview → Approve / Edit / Reject → logged. Nothing
   silent.
4. **Minimal palette, generous whitespace** — one accent (indigo), muted
   surfaces, clear type hierarchy.
5. **Understandable without a tutorial** — every screen leads with a short
   sentence saying what it is.

## Key components

- `components/chat-interface.tsx` — reusable `<ChatInterface />` used on both
  `/home` (hero size) and `/agents/[id]` (compact). Includes optional
  right-side citations panel for transparency.
- `components/agent-action-card.tsx` — reusable `<AgentActionCard />` used on
  both `/home` (activity mode) and `/approvals` (approval mode). Same visual
  language; different actions.
- `components/sidebar.tsx` / `components/app-shell.tsx` — persistent nav
  scaffold with an approvals badge.
- `components/onboarding-gate.tsx` — client-side gate that redirects
  unfinished users to `/onboarding`.

## Mock API

All data comes from `lib/mock-api.ts` (backed by fixtures in
`lib/mock-data.ts`). Every function is `async` and returns typed data — swap
these for real fetch calls when the backend is ready.

## Tech

- Next.js 14 · App Router · TypeScript
- Tailwind CSS · shadcn/ui primitives (button, card, badge, tabs, table, select,
  switch, separator, textarea, label) inlined under `components/ui/*`
- lucide-react icons
- Radix UI primitives (via shadcn recipes)

## Scripts

```bash
npm run dev        # start dev server on :3000
npm run build      # production build
npm run start      # serve production build
npm run typecheck  # tsc --noEmit
npm run lint       # next lint
```
