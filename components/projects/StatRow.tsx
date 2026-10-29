import * as React from "react"
import { cn } from "@/lib/utils"

type StatRowProps = {
  label: string
  value: React.ReactNode
  icon?: React.ReactNode
  className?: string
}

export function StatRow({ label, value, icon, className }: StatRowProps) {
  return (
    <div className={cn("flex items-center gap-4", className)}>
      <div className="flex items-center gap-2 text-sm text-muted-foreground w-30 shrink-0">
        {icon ? <span className="shrink-0">{icon}</span> : null}
        <span>{label}</span>
      </div>
      <div className="text-sm font-medium text-foreground flex-1 text-left">{value}</div>
    </div>
  )
}
