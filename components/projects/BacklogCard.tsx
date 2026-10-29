import Link from "next/link"
import { Tag, UsersThree, UserCircle, SquaresFour } from "@phosphor-icons/react/dist/ssr"
import { CircleDashed, Cube, User, Users } from "@phosphor-icons/react/dist/ssr"

import type { BacklogSummary } from "@/lib/data/project-details"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { StatRow } from "@/components/projects/StatRow"
import { PriorityGlyphIcon } from "@/components/priority-badge"
import { AvatarGroup } from "@/components/projects/AvatarGroup"

type BacklogCardProps = {
  backlog: BacklogSummary
}

function statusStyles(status: BacklogSummary["statusLabel"]) {
  if (status === "Active") return "bg-blue-100 text-blue-700 border-none dark:bg-blue-500/15 dark:text-blue-100"
  if (status === "Backlog")
    return "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-500/15 dark:text-orange-100 dark:border-orange-500/30"
  if (status === "Planned")
    return "bg-zinc-50 text-zinc-900 border-zinc-200 dark:bg-zinc-600/20 dark:text-zinc-50 dark:border-zinc-500/40"
  if (status === "Completed") return "bg-blue-50 text-blue-700 border-none dark:bg-blue-500/15 dark:text-blue-100"
  if (status === "Cancelled") return "bg-rose-50 text-rose-700 border-none dark:bg-rose-500/15 dark:text-rose-100"
  return "bg-muted text-muted-foreground border-border dark:bg-muted/30 dark:text-muted-foreground dark:border-muted/40"
}

export function BacklogCard({ backlog }: BacklogCardProps) {
  return (
    <div>
      <div className="pb-6">
        <div className="text-base font-medium">Backlog</div>
      </div>
      <div className="space-y-5">
        <StatRow
          label="Status"
          value={<Badge variant="outline" className={statusStyles(backlog.statusLabel)}>{backlog.statusLabel}</Badge>}
          icon={<CircleDashed className="h-4 w-4" />}
        />
        <StatRow label="Group" value={<span className="px-2">{backlog.groupLabel}</span>} icon={<Cube className="h-4 w-4" />} />
        <StatRow label="Priority" value={<span className="px-2">{backlog.priorityLabel}</span>} icon={<PriorityGlyphIcon level={backlog.priorityLabel.toLowerCase() as any} size="sm" />} />
        <StatRow label="Label" value={<Badge variant="secondary" className="border border-border">{backlog.labelBadge}</Badge>} icon={<Tag className="h-4 w-4" />} />
        <StatRow label="PIC" value={<div className="px-2"><AvatarGroup users={backlog.picUsers} /></div>} icon={<User className="h-4 w-4" />} />
        {backlog.supportUsers && backlog.supportUsers.length ? (
          <StatRow label="Support" value={<div className="px-2"><AvatarGroup users={backlog.supportUsers} /></div>} icon={<Users className="h-4 w-4" />} />
        ) : null}
      </div>
    </div>
  )
}
