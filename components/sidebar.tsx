"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  MessageSquare,
  ShieldCheck,
  Plug,
  ScrollText,
  Settings,
  Sparkles,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

interface SidebarProps {
  approvalsCount?: number
}

const NAV = [
  { href: "/home", label: "Home", icon: MessageSquare },
  { href: "/approvals", label: "Approvals", icon: ShieldCheck, badgeKey: "approvals" },
  { href: "/connectors", label: "Connectors", icon: Plug },
  { href: "/audit-log", label: "Audit log", icon: ScrollText },
  { href: "/settings", label: "Settings", icon: Settings },
]

export function Sidebar({ approvalsCount = 0 }: SidebarProps) {
  const pathname = usePathname()

  return (
    <aside className="hidden md:flex md:w-60 md:flex-col md:border-r md:bg-white/60 md:backdrop-blur">
      <div className="flex h-16 items-center gap-2 border-b px-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
          <Sparkles className="h-4 w-4" />
        </div>
        <div>
          <div className="text-sm font-semibold leading-none">UnifyOps AI</div>
          <div className="mt-0.5 text-xs text-muted-foreground">One workspace, every agent</div>
        </div>
      </div>
      <nav className="flex-1 space-y-1 p-3">
        {NAV.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/")
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <Icon className="h-4 w-4" />
              <span className="flex-1">{item.label}</span>
              {item.badgeKey === "approvals" && approvalsCount > 0 && (
                <Badge variant="default" className="h-5 min-w-[20px] justify-center px-1.5">
                  {approvalsCount}
                </Badge>
              )}
            </Link>
          )
        })}
      </nav>
      <div className="border-t p-3 text-xs text-muted-foreground">
        <div className="rounded-md bg-muted/50 p-3">
          <div className="font-medium text-foreground">Prototype</div>
          <div className="mt-1 leading-snug">
            Every write action is previewed before it runs. Nothing here touches real systems.
          </div>
        </div>
      </div>
    </aside>
  )
}
