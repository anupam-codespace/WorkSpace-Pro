"use client"

import { cn } from "@/lib/utils"
import { differenceInCalendarDays } from "date-fns"

interface TimelineBarProps {
  startDate: Date
  endDate: Date
  dates: Date[]
  cellWidth: number
  label: string
  progress?: number
  variant: "project" | "task"
  status?: "done" | "todo" | "in-progress"
}

export function TimelineBar({ startDate, endDate, dates, cellWidth, label, progress, variant, status }: TimelineBarProps) {
  const firstDate = dates[0]
  const lastDate = dates[dates.length - 1]
  const totalDays = differenceInCalendarDays(lastDate, firstDate) + 1

  const startOffset = differenceInCalendarDays(startDate, firstDate)
  const duration = differenceInCalendarDays(endDate, startDate) + 1

  const visibleStart = Math.max(0, startOffset)
  const visibleEnd = Math.min(totalDays, startOffset + duration)
  const visibleDays = visibleEnd - visibleStart

  if (visibleDays <= 0) return null

  const leftPx = visibleStart * cellWidth
  const widthPx = visibleDays * cellWidth

  // Format date range
  const formatDateShort = (date: Date) => {
    return `${date.getDate()}/${date.getMonth() + 1}`
  }

  const dateRange = `${formatDateShort(startDate)} - ${formatDateShort(endDate)}`

  const getStatusColor = () => {
    if (variant === "project") {
      return "bg-muted border text-foreground"
    }
    switch (status) {
      case "done":
        return "bg-teal-500/15 border-teal-500/40 text-teal-600"
      case "in-progress":
        return "bg-primary/15 border-primary/40 text-primary"
      default:
        return "bg-primary/10 border-primary/30 text-primary"
    }
  }

  return (
    <div className="relative w-full h-8">
      <div
        className={cn(
          "absolute top-0 h-full rounded-md border flex items-center px-3 transition-all",
          getStatusColor(),
        )}
        title={`${dateRange}: ${label}`}
        style={{
          left: leftPx,
          width: widthPx,
        }}
      >
        <span className="text-xs font-medium truncate">
          {dateRange}: {label}
        </span>
        {progress !== undefined && variant === "project" && (
          <span className="ml-auto text-xs font-medium text-muted-foreground pl-2">{progress}%</span>
        )}
      </div>
    </div>
  )
}
