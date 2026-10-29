"use client"

import type { ReactNode } from "react"
import { format } from "date-fns"
import { CaretDown, FolderSimple, CalendarBlank, Tag as TagIcon } from "@phosphor-icons/react/dist/ssr"

import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"
import type { ProjectTask } from "@/lib/data/project-details"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { TAG_OPTIONS } from "@/components/tasks/TaskQuickCreateModal"

type TaskBoardCardVariant = "default" | "completed" | "empty"

type TaskBoardCardProps = {
  task?: ProjectTask
  variant?: TaskBoardCardVariant
  onToggle?: () => void
  onOpen?: () => void
  /**
   * Called when the tag is changed from the inline dropdown.
   * The value is the tag label (e.g. "Feature") or undefined for no tag.
   */
  onChangeTag?: (tagLabel?: string) => void
}

export function TaskBoardCard({ task, variant = "default", onToggle, onOpen, onChangeTag }: TaskBoardCardProps) {
  const isDefault = variant === "default" && task
  const isCompleted = variant === "completed" && task
  const isEmpty = variant === "empty"

  if (isEmpty) {
    return (
      <div className="border border-dashed border-border min-h-40 items-center justify-center p-4 rounded-2xl flex flex-col gap-3">
        <p className="text-muted-foreground text-sm">No tasks</p>
      </div>
    )
  }

  if (!task) return null

  const isDone = task.status === "done"
  const badgeText = task.workstreamName || task.projectName
  const projectName = task.projectName
  const dateText = task.startDate ? format(task.startDate, "MMM d") : "No date"
  const typeText = task.tag || "Task"

  return (
    <div
      className={cn(
        "border border-border bg-card hover:shadow-lg/5 transition-shadow cursor-pointer focus:outline-none rounded-2xl p-4 flex flex-col gap-3",
        isCompleted && "opacity-70"
      )}
      onClick={onOpen}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          onOpen?.()
        }
      }}
      tabIndex={0}
      role="button"
      aria-label={`Open task ${task.name}`}
    >
      {/* Top row: badge + avatar */}
      <div className="flex items-center justify-between">
        <Badge
          variant="secondary"
          className="text-xs max-w-[160px] truncate whitespace-nowrap bg-background px-0 text-muted-foreground"
        >
          {badgeText}
        </Badge>
        <Avatar className="size-6 border border-border">
          {task.assignee?.avatarUrl ? (
            <AvatarImage src={task.assignee.avatarUrl} alt={task.assignee.name} />
          ) : (
            <AvatarFallback className="text-xs">
              {task.assignee ? task.assignee.name.charAt(0).toUpperCase() : <FolderSimple className="h-4 w-4 text-muted-foreground" />}
            </AvatarFallback>
          )}
        </Avatar>
      </div>

      {/* Middle row: checkbox + title */}
      <div className="flex items-start gap-3">
        <Checkbox
          checked={isDone}
          onCheckedChange={onToggle}
          onClick={(e) => {
            // Don't let checkbox clicks bubble and trigger card onOpen
            e.stopPropagation()
          }}
          onKeyDown={(e) => {
            // Prevent Enter/Space on checkbox from triggering card keyboard handler
            e.stopPropagation()
          }}
          className="rounded-full border-border bg-background data-[state=checked]:border-teal-600 data-[state=checked]:bg-teal-600 hover:cursor-pointer mt-0.5"
          aria-label={`Mark ${task.name} as ${isDone ? "todo" : "done"}`}
        />
        <div className="flex-1 min-w-0">
          <p className={cn(
            "text-sm font-medium leading-5 truncate",
            isDone && "line-through text-muted-foreground"
          )}>
            {task.name}
          </p>
        </div>
      </div>

      {/* Bottom row: chips */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* Project chip */}
        <div className="bg-background border border-border rounded-md px-2 py-1 flex items-center gap-1">
          <FolderSimple className="h-3 w-3 text-muted-foreground" />
          <span className="text-xs text-muted-foreground truncate max-w-[80px]">
            {projectName}
          </span>
        </div>

        {/* Date chip */}
        <div className="bg-background border border-border rounded-md px-2 py-1 flex items-center gap-1">
          <CalendarBlank className="h-3 w-3 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">
            {dateText}
          </span>
        </div>

        {/* Type chip with inline tag selector */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="bg-background border border-border rounded-md px-2 py-1 flex items-center gap-1 text-xs text-muted-foreground hover:bg-background/70"
            >
              <TagIcon className="h-3 w-3" />
              <span>{typeText}</span>
              <CaretDown className="h-3 w-3 opacity-60" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="min-w-[120px]">
            <DropdownMenuItem onClick={() => onChangeTag?.(undefined)}>
              <span className="text-xs">No tag</span>
            </DropdownMenuItem>
            {TAG_OPTIONS.map((opt) => (
              <DropdownMenuItem key={opt.id} onClick={() => onChangeTag?.(opt.label)}>
                <span className="text-xs">{opt.label}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
