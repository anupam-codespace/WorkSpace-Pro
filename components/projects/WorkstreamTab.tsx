"use client"

import { useMemo, useState } from "react"
import { CaretDown, DotsSixVertical, Plus } from "@phosphor-icons/react/dist/ssr"
import {
  DndContext,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
  DragOverlay,
  PointerSensor,
  closestCorners,
  useDroppable,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

import type { WorkstreamGroup, WorkstreamTask } from "@/lib/data/project-details"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { ProgressCircle } from "@/components/progress-circle"
import { cn } from "@/lib/utils"
import { TaskRowBase } from "@/components/tasks/TaskRowBase"

type WorkstreamTabProps = {
  workstreams: WorkstreamGroup[] | undefined
}

export function WorkstreamTab({ workstreams }: WorkstreamTabProps) {
  const [state, setState] = useState<WorkstreamGroup[]>(() => workstreams ?? [])
  const [openValues, setOpenValues] = useState<string[]>(() =>
    workstreams && workstreams.length ? [workstreams[0].id] : [],
  )
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null)
  const [overTaskId, setOverTaskId] = useState<string | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
  )

  const allIds = useMemo(() => state.map((group) => group.id), [state])

  const findTaskById = (taskId: string | null): WorkstreamTask | null => {
    if (!taskId) return null
    for (const group of state) {
      const found = group.tasks.find((task) => task.id === taskId)
      if (found) return found
    }
    return null
  }

  const activeTask = findTaskById(activeTaskId)

  const toggleTask = (groupId: string, taskId: string) => {
    setState((prev) =>
      prev.map((group) =>
        group.id === groupId
          ? {
            ...group,
            tasks: group.tasks.map((task) =>
              task.id === taskId
                ? {
                  ...task,
                  status: task.status === "done" ? "todo" : "done",
                }
                : task,
            ),
          }
          : group,
      ),
    )
  }

  const handleDragStart = (event: DragStartEvent) => {
    const id = event.active.id
    if (typeof id === "string") {
      setActiveTaskId(id)
    }
  }

  const handleDragOver = (event: DragOverEvent) => {
    const overId = event.over?.id
    if (typeof overId === "string" && !overId.startsWith("group:")) {
      // only track task ids for per-row drop indicator
      setOverTaskId(overId)
    } else {
      setOverTaskId(null)
    }
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveTaskId(null)
    setOverTaskId(null)

    if (!over) return
    if (active.id === over.id) return

    const activeId = String(active.id)
    const overId = String(over.id)

    setState((prev) => {
      let sourceGroupIndex = -1
      let sourceTaskIndex = -1
      let targetGroupIndex = -1
      let targetTaskIndex = -1

      prev.forEach((group, groupIndex) => {
        const aIndex = group.tasks.findIndex((task) => task.id === activeId)
        if (aIndex !== -1) {
          sourceGroupIndex = groupIndex
          sourceTaskIndex = aIndex
        }

        const oIndex = group.tasks.findIndex((task) => task.id === overId)
        if (oIndex !== -1) {
          targetGroupIndex = groupIndex
          targetTaskIndex = oIndex
        }
      })

      // If we didn't land on a task but on a group container, allow dropping into empty lists
      if (targetGroupIndex === -1 && overId.startsWith("group:")) {
        const groupId = overId.slice("group:".length)
        targetGroupIndex = prev.findIndex((group) => group.id === groupId)
        if (targetGroupIndex !== -1) {
          targetTaskIndex = prev[targetGroupIndex].tasks.length
        }
      }

      if (sourceGroupIndex === -1 || targetGroupIndex === -1) return prev

      const next = [...prev]
      const sourceGroup = next[sourceGroupIndex]
      const targetGroup = next[targetGroupIndex]

      // Reorder within the same workstream
      if (sourceGroupIndex === targetGroupIndex) {
        const reordered = arrayMove(sourceGroup.tasks, sourceTaskIndex, targetTaskIndex)
        next[sourceGroupIndex] = { ...sourceGroup, tasks: reordered }
        return next
      }

      // Move across workstreams
      const sourceTasks = [...sourceGroup.tasks]
      const [moved] = sourceTasks.splice(sourceTaskIndex, 1)
      if (!moved) return prev

      const targetTasks = [...targetGroup.tasks]
      targetTasks.splice(targetTaskIndex, 0, moved)

      next[sourceGroupIndex] = { ...sourceGroup, tasks: sourceTasks }
      next[targetGroupIndex] = { ...targetGroup, tasks: targetTasks }

      return next
    })
  }

  const handleDragCancel = () => {
    setActiveTaskId(null)
    setOverTaskId(null)
  }

  if (!state.length) {
    return (
      <section>
        <h2 className="text-sm font-semibold tracking-normal text-foreground uppercase">
          WORKSTEAM BREAKDOWN
        </h2>
        <div className="mt-4 rounded-lg border border-dashed border-border/70 p-6 text-sm text-muted-foreground">
          No workstreams defined yet.
        </div>
      </section>
    )
  }

  return (
    <section className="rounded-2xl border border-border bg-muted shadow-[var(--shadow-workstream)] p-3 space-y-3">
      <div className="flex items-center justify-between gap-3 px-2">
        <h2 className="flex-1 min-w-0 truncate text-sm font-semibold tracking-normal text-foreground uppercase">
          WORKSTEAM BREAKDOWN
        </h2>
        <div className="flex items-center gap-1 opacity-60 shrink-0">
          <Button
            variant="ghost"
            size="icon-sm"
            className="rounded-lg hover:cursor-pointer"
            aria-label="Collapse all"
            onClick={() => setOpenValues([])}
            disabled={!allIds.length}
          >
            <CaretDown className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            className="rounded-lg hover:cursor-pointer"
            aria-label="Expand all"
            onClick={() => setOpenValues(allIds)}
            disabled={!allIds.length}
          >
            <CaretDown className="h-4 w-4 rotate-180" />
          </Button>
        </div>
      </div>

      <div className="px-1">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
          onDragCancel={handleDragCancel}
        >
          <Accordion
            type="multiple"
            value={openValues}
            onValueChange={(values) =>
              setOpenValues(Array.isArray(values) ? values : values ? [values] : [])
            }
          >
            {state.map((group) => (
              <AccordionItem
                key={group.id}
                value={group.id}
                className="mb-2 overflow-hidden rounded-xl border border-border bg-background last:mb-0"
              >
                <AccordionTrigger className="bg-background">
                  <div className="flex w-full items-center justify-between gap-2">
                    <div className="flex items-center gap-3 min-w-0">
                      <CaretDown className="h-4 w-4 text-muted-foreground hover:cursor-pointer" aria-hidden="true" />
                      <span className="flex-1 truncate text-left text-sm font-medium text-foreground hover:cursor-pointer">
                        {group.name}
                      </span>
                    </div>
                    <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground shrink-0">
                      <Button asChild size="icon-sm" variant="ghost" className="size-6 rounded-md">
                        <span
                          role="button"
                          aria-label="Add task"
                          onClick={(event) => {
                            // Prevent toggling the accordion when clicking the add icon.
                            event.stopPropagation()
                          }}
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </span>
                      </Button>
                      <Separator orientation="vertical" className="h-4" />
                      <GroupSummary group={group} />
                    </div>
                  </div>
                </AccordionTrigger>

                <WorkstreamTasks
                  group={group}
                  activeTaskId={activeTaskId}
                  overTaskId={overTaskId}
                  onToggleTask={(taskId) => toggleTask(group.id, taskId)}
                />
              </AccordionItem>
            ))}
          </Accordion>

          <DragOverlay>
            {activeTask ? (
              <div className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm bg-background shadow-md">
                <span className="flex-1 truncate text-left">{activeTask.name}</span>
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>
    </section>
  )
}

type GroupSummaryProps = {
  group: WorkstreamGroup
}

function GroupSummary({ group }: GroupSummaryProps) {
  const total = group.tasks.length
  const done = group.tasks.filter((t) => t.status === "done").length
  const percent = total ? Math.round((done / total) * 100) : 0
  const color = getWorkstreamProgressColor(percent)

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-muted-foreground">
        {done}/{total}
      </span>
      <ProgressCircle progress={percent} color={color} size={18} />
    </div>
  )
}

function getWorkstreamProgressColor(percent: number): string {
  if (percent >= 80) return "var(--chart-3)"
  if (percent >= 50) return "var(--chart-4)"
  if (percent > 0) return "var(--chart-5)"
  return "var(--chart-2)"
}

type WorkstreamTasksProps = {
  group: WorkstreamGroup
  activeTaskId: string | null
  overTaskId: string | null
  onToggleTask: (taskId: string) => void
}

function WorkstreamTasks({ group, activeTaskId, overTaskId, onToggleTask }: WorkstreamTasksProps) {
  const { setNodeRef } = useDroppable({ id: `group:${group.id}` })

  return (
    <AccordionContent className="border-t border-border bg-background/60 px-1.5">
      <SortableContext items={group.tasks.map((task) => task.id)} strategy={verticalListSortingStrategy}>
        <div ref={setNodeRef} className="space-y-1 py-2">
          {group.tasks.map((task) => (
            <TaskRow
              key={task.id}
              task={task}
              onToggle={() => onToggleTask(task.id)}
              activeTaskId={activeTaskId}
              overTaskId={overTaskId}
            />
          ))}
        </div>
      </SortableContext>
    </AccordionContent>
  )
}

type TaskRowProps = {
  task: WorkstreamTask
  onToggle: () => void
  activeTaskId: string | null
  overTaskId: string | null
}

function TaskRow({ task, onToggle, activeTaskId, overTaskId }: TaskRowProps) {
  const isDone = task.status === "done"

  const { attributes, listeners, setNodeRef, transform, transition, isDragging, isOver } = useSortable({
    id: task.id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const showDropLine = !isDragging && (isOver || overTaskId === task.id)

  return (
    <div ref={setNodeRef} style={style} className="space-y-1">
      {showDropLine && <div className="h-px w-full rounded-full bg-primary" />}
      <TaskRowBase
        checked={isDone}
        title={task.name}
        onCheckedChange={onToggle}
        titleAriaLabel={task.name}
        meta={
          <>
            {task.dueLabel && (
              <span
                className={cn(
                  "text-muted-foreground",
                  task.dueTone === "danger" && "text-red-500",
                  task.dueTone === "warning" && "text-amber-500",
                )}
              >
                {task.dueLabel}
              </span>
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
        className={cn(isDragging && "opacity-60")}
      />
    </div>
  )
}
