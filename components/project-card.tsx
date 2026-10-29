"use client"

import type { ReactNode } from "react"
import { useRef } from "react"
import { format } from "date-fns"
import type { Project } from "@/lib/data/projects"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getAvatarUrl } from "@/lib/assets/avatars"
import { Folder, CalendarBlank, Flag, User } from "@phosphor-icons/react/dist/ssr"
import { cn } from "@/lib/utils"
import { PriorityBadge } from "@/components/priority-badge"
import { ProjectProgress } from "@/components/project-progress"
import { useRouter } from "next/navigation"

type ProjectCardProps = {
  project: Project
  actions?: ReactNode
  variant?: "list" | "board"
}

function statusConfig(status: Project["status"]) {
  switch (status) {
    case "active":
      return {
        label: "Active",
        dot: "bg-teal-600 dark:bg-teal-400",
        pill: "text-teal-700 border-teal-200 bg-teal-50 dark:text-teal-100 dark:border-teal-500/40 dark:bg-teal-500/10",
      }
    case "planned":
      return {
        label: "Planned",
        dot: "bg-zinc-900 dark:bg-zinc-200",
        pill: "text-zinc-900 border-zinc-200 bg-zinc-50 dark:text-zinc-50 dark:border-zinc-600/60 dark:bg-zinc-600/20",
      }
    case "backlog":
      return {
        label: "Backlog",
        dot: "bg-orange-600 dark:bg-orange-400",
        pill: "text-orange-700 border-orange-200 bg-orange-50 dark:text-orange-100 dark:border-orange-500/40 dark:bg-orange-500/10",
      }
    case "completed":
      return {
        label: "Completed",
        dot: "bg-blue-600 dark:bg-blue-400",
        pill: "text-blue-700 border-blue-200 bg-blue-50 dark:text-blue-100 dark:border-blue-500/40 dark:bg-blue-500/10",
      }
    case "cancelled":
      return {
        label: "Cancelled",
        dot: "bg-rose-600 dark:bg-rose-400",
        pill: "text-rose-700 border-rose-200 bg-rose-50 dark:text-rose-100 dark:border-rose-500/40 dark:bg-rose-500/10",
      }
    default:
      return {
        label: status,
        dot: "bg-zinc-400 dark:bg-zinc-300",
        pill: "text-zinc-700 border-zinc-200 bg-zinc-50 dark:text-zinc-100 dark:border-zinc-600/60 dark:bg-zinc-600/20",
      }
  }
}

export function ProjectCard({ project, actions, variant = "list" }: ProjectCardProps) {
  const s = statusConfig(project.status)
  const assignee = project.members?.[0]
  const dueDate = project.endDate
  const avatarUrl = getAvatarUrl(assignee)
  const isBoard = variant === "board"
  const router = useRouter()
  const draggingRef = useRef(false)
  const startPosRef = useRef<{ x: number; y: number } | null>(null)

  const initials = assignee ? assignee.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase() : null

  const secondaryLine = (() => {
    const a = project.client
    const b = project.typeLabel
    const c = project.durationLabel
    if (a || b || c) {
      return [a, b, c].filter(Boolean).join(" • ")
    }
    if (project.tags && project.tags.length > 0) {
      return project.tags.join(" • ")
    }
    return ""
  })()

  const dueLabel = (() => {
    if (!dueDate) return "No due date"
    // Board view: dùng format ngắn gọn cho header
    return format(dueDate, "MMM d")
  })()

  const goToDetails = () => router.push(`/projects/${project.id}`)

  const onKeyNavigate: React.KeyboardEventHandler<HTMLDivElement> = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      goToDetails()
    }
  }

  const onMouseDown: React.MouseEventHandler<HTMLDivElement> = (e) => {
    if (!isBoard) return
    startPosRef.current = { x: e.clientX, y: e.clientY }
    draggingRef.current = false
  }

  const onMouseMove: React.MouseEventHandler<HTMLDivElement> = (e) => {
    if (!isBoard || !startPosRef.current) return
    const dx = Math.abs(e.clientX - startPosRef.current.x)
    const dy = Math.abs(e.clientY - startPosRef.current.y)
    if (dx > 5 || dy > 5) draggingRef.current = true
  }

  const onMouseUp: React.MouseEventHandler<HTMLDivElement> = () => {
    if (!isBoard) return
    startPosRef.current = null
  }

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`Open project ${project.name}`}
      onClick={() => {
        if (isBoard && draggingRef.current) {
          draggingRef.current = false
          return
        }
        goToDetails()
      }}
      onKeyDown={onKeyNavigate}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      className="rounded-2xl border border-border bg-background hover:shadow-lg/5 transition-shadow cursor-pointer focus:outline-none "
    >
      <div className="p-4">
        <div className="flex items-center justify-between">
          {isBoard ? (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Flag className="h-4 w-4" />
              <span>{dueLabel}</span>
            </div>
          ) : (
            <div className="text-muted-foreground">
              <Folder className="h-5 w-5" />
            </div>
          )}
          <div className="flex items-center gap-2">
            {!isBoard && (
              <div className={cn("flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium", s.pill)}>
                <span className={cn("inline-block size-1.5 rounded-full", s.dot)} />
                {s.label}
              </div>
            )}
            {isBoard && (
              <PriorityBadge level={project.priority} appearance="inline" />
            )}
            {actions ? (
              <div
                className="shrink-0"
                onClick={(e) => e.stopPropagation()}
                onKeyDown={(e) => e.stopPropagation()}
              >
                {actions}
              </div>
            ) : null}
          </div>
        </div>

        <div className="mt-3">
          <p className="text-[15px] font-semibold text-foreground leading-6">
            {project.name}
          </p>
          {isBoard
            ? secondaryLine && (
              <div className="mt-1 text-sm text-muted-foreground truncate">{secondaryLine}</div>
            )
            : secondaryLine && (
              <p className="mt-1 text-sm text-muted-foreground truncate">{secondaryLine}</p>
            )}
        </div>


        {!isBoard && (
          <div className="mt-2 flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <CalendarBlank className="h-4 w-4" />
              <span>{dueDate ? format(dueDate, "MMM d, yyyy") : "—"}</span>
            </div>
            <PriorityBadge level={project.priority} appearance="inline" />
          </div>
        )}

        <div className="mt-4 border-t border-border/60" />

        <div className="mt-3 flex items-center justify-between">
          <ProjectProgress project={project} size={isBoard ? 20 : 18} />
          <Avatar className="size-6 border border-border">
            <AvatarImage alt={assignee ?? ""} src={avatarUrl} />
            <AvatarFallback className="text-xs">
              {initials ? initials : <User className="h-4 w-4 text-muted-foreground" />}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </div>
  )
}
