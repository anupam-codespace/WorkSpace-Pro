"use client"

import { useState } from "react"
import type { PointerEvent as ReactPointerEvent } from "react"
import { addDays, differenceInCalendarDays, format } from "date-fns"

import type { Project } from "@/lib/data/projects"
import { cn } from "@/lib/utils"

export type TimelineBarItem = {
    id: string
    name: string
    startDate: Date
    endDate: Date
    status?: Project["tasks"][number]["status"]
    progress?: number
}

export type DraggableBarProps = {
    item: TimelineBarItem
    variant: "project" | "task"
    viewStartDate: Date
    cellWidth: number
    onUpdateStart: (id: string, newStart: Date) => void
    onUpdateDuration?: (id: string, newStart: Date, newEnd: Date) => void
    onDoubleClick?: () => void
}

export function DraggableBar({
    item,
    variant,
    viewStartDate,
    cellWidth,
    onUpdateStart,
    onUpdateDuration,
    onDoubleClick,
}: DraggableBarProps) {
    const durationDays = differenceInCalendarDays(item.endDate, item.startDate) + 1
    const offsetDays = differenceInCalendarDays(item.startDate, viewStartDate)
    const left = offsetDays * cellWidth
    const width = durationDays * cellWidth

    const [isDragging, setIsDragging] = useState(false)
    const [dragOffset, setDragOffset] = useState(0)
    const [dragType, setDragType] = useState<"move" | "resize-left" | "resize-right" | null>(null)

    const handlePointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragging(true)

        const rect = e.currentTarget.getBoundingClientRect()
        const offsetX = e.clientX - rect.left
        const dragKind = offsetX < 8 ? "resize-left" : offsetX > rect.width - 8 ? "resize-right" : "move"
        setDragType(dragKind)

        const startX = e.clientX
        document.body.style.cursor = dragKind === "move" ? "grabbing" : "col-resize"

        const handlePointerMove = (moveEvent: PointerEvent) => {
            setDragOffset(moveEvent.clientX - startX)
        }

        const handlePointerUp = (upEvent: PointerEvent) => {
            const deltaX = upEvent.clientX - startX
            const daysMoved = Math.round(deltaX / cellWidth)

            if (daysMoved !== 0) {
                if (dragKind === "move") {
                    onUpdateStart(item.id, addDays(item.startDate, daysMoved))
                } else if (dragKind === "resize-left" && onUpdateDuration) {
                    const newStartDate = addDays(item.startDate, daysMoved)
                    if (newStartDate < item.endDate) {
                        onUpdateDuration(item.id, newStartDate, item.endDate)
                    }
                } else if (dragKind === "resize-right" && onUpdateDuration) {
                    const newEndDate = addDays(item.endDate, daysMoved)
                    if (newEndDate > item.startDate) {
                        onUpdateDuration(item.id, item.startDate, newEndDate)
                    }
                }
            }

            setIsDragging(false)
            setDragOffset(0)
            setDragType(null)
            document.body.style.cursor = ""
            window.removeEventListener("pointermove", handlePointerMove)
            window.removeEventListener("pointerup", handlePointerUp)
        }

        window.addEventListener("pointermove", handlePointerMove)
        window.addEventListener("pointerup", handlePointerUp)
    }

    let visualLeft = left
    let visualWidth = width

    if (isDragging && dragType) {
        if (dragType === "move") {
            visualLeft = left + dragOffset
        } else if (dragType === "resize-right") {
            visualWidth = Math.max(cellWidth, width + dragOffset)
        } else if (dragType === "resize-left") {
            visualLeft = left + dragOffset
            visualWidth = Math.max(cellWidth, width - dragOffset)
        }
    }

    const dateLabel = `${format(item.startDate, "d/M")} - ${format(item.endDate, "d/M")}`

    const taskColors =
        item.status === "done"
            ? "bg-teal-500/15 border-teal-500/40 text-teal-600"
            : item.status === "in-progress"
                ? "bg-primary/10 border-primary/30 text-blue-800"
                : "bg-primary/10 border-primary/30 text-primary"

    return (
        <div
            onPointerDown={handlePointerDown}
            onDoubleClick={onDoubleClick}
            className={cn(
                "absolute h-[30px] top-[12px] rounded-md border flex items-center px-2 gap-2 select-none overflow-hidden cursor-grab active:cursor-grabbing group",
                variant === "project" ? "bg-muted border-border text-foreground" : taskColors,
                isDragging ? "shadow-lg z-30 opacity-90" : "",
            )}
            style={{
                left: `${visualLeft}px`,
                width: `${Math.max(visualWidth, 50)}px`,
                transition: isDragging ? "none" : "left 0.3s cubic-bezier(0.25, 1, 0.5, 1)",
            }}
        >
            {/* Resize handles */}
            <div
                className="absolute left-0 top-0 bottom-0 w-2 cursor-col-resize opacity-0 group-hover:opacity-100 bg-white/30 rounded-l-md"
            />
            <div
                className="absolute right-0 top-0 bottom-0 w-2 cursor-col-resize opacity-0 group-hover:opacity-100 bg-white/30 rounded-r-md"
            />

            {variant === "task" && <div className="w-0.5 h-4 bg-current/50 rounded-full shrink-0" />}
            <span className="text-sm font-medium tracking-[0.0923px] whitespace-nowrap overflow-hidden text-ellipsis flex-1 min-w-0">
                {dateLabel}: {item.name}
            </span>
            {variant === "task" && <div className="w-0.5 h-4 bg-current/50 rounded-full shrink-0 ml-auto" />}
        </div>
    )
}
