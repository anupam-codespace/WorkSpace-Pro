import * as React from "react"

import type { User } from "@/lib/data/project-details"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

type AvatarGroupProps = {
  users: User[]
  max?: number
  className?: string
}

export function AvatarGroup({ users, max = 2, className }: AvatarGroupProps) {
  const visible = users.slice(0, max)
  const remaining = users.length - visible.length

  return (
    <div className={cn("flex items-center", className)}>
      {visible.map((u, idx) => {
        const initials = u.name
          .split(" ")
          .filter(Boolean)
          .map((p) => p[0])
          .join("")
          .slice(0, 2)
          .toUpperCase()

        return (
          <Tooltip key={u.id}>
            <TooltipTrigger asChild>
              <div className={cn(idx === 0 ? "" : "-ml-2")}> 
                <Avatar className="size-7 border border-border bg-background">
                  <AvatarImage alt={u.name} src={u.avatarUrl} />
                  <AvatarFallback className="text-[10px]">{initials}</AvatarFallback>
                </Avatar>
              </div>
            </TooltipTrigger>
            <TooltipContent>{u.name}</TooltipContent>
          </Tooltip>
        )
      })}

      {remaining > 0 ? (
        <div className="-ml-2">
          <div className="size-7 rounded-full border border-border bg-muted flex items-center justify-center text-[10px] font-medium text-muted-foreground">
            +{remaining}
          </div>
        </div>
      ) : null}
    </div>
  )
}
