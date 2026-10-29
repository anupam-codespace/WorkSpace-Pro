"use client"

import { format } from "date-fns"
import { ChartBar, DotsSixVertical, FolderSimple, Plus } from "@phosphor-icons/react/dist/ssr"
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

import type { Project, FilterCounts } from "@/lib/data/projects"
import type { ProjectTask } from "@/lib/data/project-details"
import { TaskRowBase } from "@/components/tasks/TaskRowBase"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ProgressCircle } from "@/components/progress-circle"
import { cn } from "@/lib/utils"
import type { FilterChip as FilterChipType } from "@/lib/view-options"
import type { CreateTaskContext } from "@/components/tasks/TaskQuickCreateModal"

export type ProjectTaskGroup = {
  project: Project
  tasks: ProjectTask[]
}

export function filterTasksByChips(tasks: ProjectTask[], chips: FilterChipType[]): ProjectTask[] {
  if (!chips.length) return tasks

  const memberValues = chips
    .filter((chip) => chip.key.toLowerCase().startsWith("member") || chip.key.toLowerCase() === "pic")
    .map((chip) => chip.value.toLowerCase())

  if (!memberValues.length) return tasks

  return tasks.filter((task) => {
    const name = task.assignee?.name.toLowerCase() ?? ""

    for (const value of memberValues) {
      if (value === "no member" && !task.assignee) return true
      if (value === "current member" && task.assignee) return true
      if (value && name.includes(value)) return true
    }

    return false
  })
}

export function computeTaskFilterCounts(tasks: ProjectTask[]): FilterCounts {
  const counts: FilterCounts = {
    members: {
      "no-member": 0,
      current: 0,
      anupam: 0,
    },
  }

  for (const task of tasks) {
    if (!task.assignee) {
      counts.members!["no-member"] = (counts.members!["no-member"] || 0) + 1
    } else {
      counts.members!.current = (counts.members!.current || 0) + 1

      const name = task.assignee.name.toLowerCase()
      if (name.includes("anupam")) {
        counts.members!.anupam = (counts.members!.anupam || 0) + 1
      }
    }
  }

  return counts
}

export function getTaskDescriptionSnippet(task: ProjectTask): string {
  if (!task.description) return ""
  const plain = task.description.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim()
  return plain
}

export type ProjectTasksSectionProps = {
  group: ProjectTaskGroup
  onToggleTask: (taskId: string) => void
  onAddTask: (context: CreateTaskContext) => void
}

export function ProjectTasksSection({ group, onToggleTask, onAddTask }: ProjectTasksSectionProps) {
  const { project, tasks } = group
  const total = tasks.length
  const done = tasks.filter((t) => t.status === "done").length
  const percent = total ? Math.round((done / total) * 100) : 0

  return (
    <section className="max-w-6xl mx-auto rounded-3xl border border-border bg-muted shadow-[var(--shadow-workstream)] p-3 space-y-2">
      <header className="flex items-center justify-between gap-4 px-0 py-1">
        <div className="flex size-10 items-center justify-center rounded-xl border border-border bg-background text-muted-foreground">
          <FolderSimple className="h-5 w-5" weight="regular" />
        </div>
        <div className="flex-1 space-y-1">
          <span className="text-sm font-semibold leading-tight">{project.name}</span>
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <ChartBar className="h-3 w-3" weight="regular" />
              <span className="font-medium">{capitalize(project.priority)}</span>
            </span>
            <div className="h-4 w-px bg-border/70 hidden sm:inline" />
            {project.typeLabel && project.durationLabel && (
              <>
                <span className="rounded-full bg-muted px-2 py-0.5 font-medium hidden sm:inline">
                  {project.typeLabel} {project.durationLabel}
                </span>
                <div className="h-4 w-px bg-border/70 hidden sm:inline" />
              </>
            )}
            <span className="rounded-full bg-muted px-2 py-0.5 font-medium hidden sm:inline">
              {getProjectStatusLabel(project.status)}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="font-medium">
            {done}/{total}
          </span>
          <ProgressCircle progress={percent} color="var(--chart-2)" size={18} />
          <div className="h-4 w-px bg-border/80" />
          <Button
            type="button"
            size="icon-sm"
            variant="ghost"
            className="size-7 rounded-full text-muted-foreground hover:bg-transparent"
            aria-label="Add task"
            onClick={() =>
              onAddTask({
                projectId: project.id,
                workstreamName: tasks[0]?.workstreamName,
              })
            }
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </header>

      <div className="space-y-1 px-2 py-3 bg-background rounded-2xl border border-border">
        <SortableContext items={tasks.map((task) => task.id)} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <TaskRowDnD
              key={task.id}
              task={task}
              onToggle={() => onToggleTask(task.id)}
            />
          ))}
        </SortableContext>
      </div>
    </section>
  )
}

export type TaskBadgesProps = {
  workstreamName?: string
  className?: string
}

export function TaskBadges({ workstreamName, className }: TaskBadgesProps) {
  if (!workstreamName) return null

  return (
    <Badge variant="muted" className={cn("whitespace-nowrap text-[11px]", className)}>
      {workstreamName}
    </Badge>
  )
}

export type TaskStatusProps = {
  status: ProjectTask["status"]
}

export function TaskStatus({ status }: TaskStatusProps) {
  const label = getStatusLabel(status)
  const color = getStatusColor(status)

  return <span className={cn("font-medium", color)}>{label}</span>
}

function getStatusLabel(status: ProjectTask["status"]): string {
  switch (status) {
    case "done":
      return "Done"
    case "in-progress":
      return "In Progress"
    default:
      return "To do"
  }
}

function getStatusColor(status: ProjectTask["status"]): string {
  switch (status) {
    case "done":
      return "text-emerald-500"
    case "in-progress":
      return "text-amber-500"
    default:
      return "text-muted-foreground"
  }
}

function getProjectStatusLabel(status: Project["status"]): string {
  switch (status) {
    case "active":
      return "In Progress"
    case "planned":
      return "Planned"
    case "backlog":
      return "Backlog"
    case "completed":
      return "Completed"
    case "cancelled":
      return "Cancelled"
    default:
      return capitalize(status)
  }
}

function capitalize(value: string): string {
  if (!value) return value
  return value.charAt(0).toUpperCase() + value.slice(1)
}

export type TaskPriorityProps = {
  priority: NonNullable<ProjectTask["priority"]>
  className?: string
}

export function TaskPriority({ priority, className }: TaskPriorityProps) {
  const label = getPriorityLabel(priority)

  return (
    <span className={cn("rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground", className)}>
      {label}
    </span>
  )
}

function getPriorityLabel(priority: NonNullable<ProjectTask["priority"]>): string {
  switch (priority) {
    case "high":
      return "High"
    case "medium":
      return "Medium"
    case "low":
      return "Low"
    case "urgent":
      return "Urgent"
    default:
      return "No priority"
  }
}

export type TaskRowDnDProps = {
  task: ProjectTask
  onToggle: () => void
}

export function TaskRowDnD({ task, onToggle }: TaskRowDnDProps) {
  const isDone = task.status === "done"

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div ref={setNodeRef} style={style}>
      <TaskRowBase
        checked={isDone}
        title={task.name}
        onCheckedChange={onToggle}
        titleAriaLabel={task.name}
        titleSuffix={<TaskBadges workstreamName={task.workstreamName} className="hidden sm:inline" />}
        subtitle={<div className="hidden sm:inline">{getTaskDescriptionSnippet(task)}</div>}
        meta={
          <>
            <TaskStatus status={task.status} />
            {task.startDate && (
              <span className="text-muted-foreground hidden sm:inline">
                Start: {format(task.startDate, "dd/MM")}
              </span>
            )}
            {task.dueLabel && (
              <span className="text-muted-foreground hidden sm:inline">{task.dueLabel}</span>
            )}
            {task.priority && <TaskPriority priority={task.priority} className="hidden sm:inline" />}
            {task.tag && (
              <Badge variant="outline" className="whitespace-nowrap text-[11px] hidden sm:inline">
                {task.tag}
              </Badge>
            )}
            {task.assignee && (
              <Avatar className="size-6">
                {task.assignee.avatarUrl && (
                  <AvatarImage src={task.assignee.avatarUrl} alt={task.assignee.name} />
                )}
                <AvatarFallback>{task.assignee.name.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
            )}
            <Button
              type="button"
              size="icon-sm"
              variant="ghost"
              className="size-7 rounded-md text-muted-foreground cursor-grab active:cursor-grabbing"
              aria-label="Reorder task"
              {...attributes}
              {...listeners}
            >
              <DotsSixVertical className="h-4 w-4" weight="regular" />
            </Button>
          </>
        }
        className={isDragging ? "opacity-60" : ""}
      />
    </div>
  )
}

export type ProjectTaskListViewProps = {
  groups: ProjectTaskGroup[]
  onToggleTask: (taskId: string) => void
  onAddTask: (context: CreateTaskContext) => void
}

export function ProjectTaskListView({ groups, onToggleTask, onAddTask }: ProjectTaskListViewProps) {
  return (
    <>
      {groups.map((group) => (
        <ProjectTasksSection
          key={group.project.id}
          group={group}
          onToggleTask={onToggleTask}
          onAddTask={onAddTask}
        />
      ))}
    </>
  )
}
