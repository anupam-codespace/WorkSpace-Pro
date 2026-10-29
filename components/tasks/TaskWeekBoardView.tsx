"use client"

import { useEffect, useMemo, useState } from "react"
import { startOfWeek, addWeeks, addDays, isSameDay, format } from "date-fns"
import { CaretLeft, CaretRight, CalendarBlank, Plus } from "@phosphor-icons/react/dist/ssr"
import {
  DndContext,
  type DragEndEvent,
  DragOverlay,
  MouseSensor,
  TouchSensor,
  useDroppable,
  useSensor,
  useSensors,
  closestCorners,
} from "@dnd-kit/core"
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

import { Button } from "@/components/ui/button"
import type { ProjectTask } from "@/lib/data/project-details"
import { TaskBoardCard } from "@/components/tasks/TaskBoardCard"
import type { CreateTaskContext } from "@/components/tasks/TaskQuickCreateModal"
import { cn } from "@/lib/utils"

type DayColumn = {
  date: Date
  tasks: ProjectTask[]
  total: number
  done: number
}

type TaskWeekBoardViewProps = {
  tasks: ProjectTask[]
  onAddTask?: (context?: CreateTaskContext) => void
  onToggleTask?: (taskId: string) => void
  onChangeTag?: (taskId: string, tagLabel?: string) => void
  onMoveTaskDate?: (taskId: string, newDate: Date) => void
  onOpenTask?: (task: ProjectTask) => void
}

export function TaskWeekBoardView({ tasks, onAddTask, onToggleTask, onChangeTag, onMoveTaskDate, onOpenTask }: TaskWeekBoardViewProps) {
  const [currentWeekStart, setCurrentWeekStart] = useState(() =>
    startOfWeek(new Date(), { weekStartsOn: 1 }) // Monday
  )
  const [showWeekend, setShowWeekend] = useState(false)

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: { distance: 4 },
    }),
    useSensor(TouchSensor, {
      activationConstraint: { distance: 8 },
    }),
  )

  const today = useMemo(() => new Date(), [])

  const getDayKey = (date: Date) => format(date, "yyyy-MM-dd")

  const weekColumns = useMemo(() => {
    const columns: DayColumn[] = []
    const daysToShow = showWeekend ? 7 : 5 // Mon–Sun when true, Mon–Fri when false

    for (let i = 0; i < daysToShow; i++) {
      const date = addDays(currentWeekStart, i)
      const dayTasks = tasks.filter((task) =>
        task.startDate && isSameDay(task.startDate, date)
      )
      const total = dayTasks.length
      const done = dayTasks.filter((t) => t.status === "done").length

      columns.push({
        date,
        tasks: dayTasks,
        total,
        done,
      })
    }

    return columns
  }, [tasks, currentWeekStart, showWeekend])

  const weekRangeLabel = useMemo(() => {
    const start = currentWeekStart
    const end = addDays(start, 6) // Sunday
    return `${format(start, "MMM d")} – ${format(end, "MMM d, yyyy")}`
  }, [currentWeekStart])

  const handlePrevWeek = () => {
    setCurrentWeekStart((prev) => addWeeks(prev, -1))
  }

  const handleNextWeek = () => {
    setCurrentWeekStart((prev) => addWeeks(prev, 1))
  }

  const handleToday = () => {
    setCurrentWeekStart(startOfWeek(new Date(), { weekStartsOn: 1 }))
  }

  const handleToggleWeekend = () => {
    setShowWeekend((prev) => !prev)
  }

  // Local order within each column: dayKey -> task ids
  const [columnOrder, setColumnOrder] = useState<Record<string, string[]>>({})

  const dayKeys = useMemo(() => weekColumns.map((c) => getDayKey(c.date)), [weekColumns])

  const [activeTask, setActiveTask] = useState<ProjectTask | undefined>(undefined)

  useEffect(() => {
    setColumnOrder((prev) => {
      const next: Record<string, string[]> = {}

      for (const column of weekColumns) {
        const key = getDayKey(column.date)
        const existing = prev[key] ?? []
        const taskIds = column.tasks.map((t) => t.id)

        const idSet = new Set(taskIds)
        const ordered: string[] = [
          ...existing.filter((id) => idSet.has(id)),
          ...taskIds.filter((id) => !existing.includes(id)),
        ]

        next[key] = ordered
      }

      return next
    })
  }, [weekColumns])

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveTask(undefined)
    if (!over) return

    const activeId = String(active.id)
    const overId = String(over.id)

    const activeDay = active.data.current?.dayKey as string | undefined
    let overDay = over.data.current?.dayKey as string | undefined
    if (!overDay && dayKeys.includes(overId)) {
      overDay = overId
    }

    if (!activeDay || !overDay) return

    if (activeDay === overDay) {
      // Reorder within the same column (local only)
      setColumnOrder((prev) => {
        const current = prev[activeDay] ?? []
        const oldIndex = current.indexOf(activeId)
        const newIndex = current.indexOf(overId)
        if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) return prev
        return {
          ...prev,
          [activeDay]: arrayMove(current, oldIndex, newIndex),
        }
      })
      return
    }

    // Move to different day: update local order and bubble new date up
    const targetColumn = weekColumns.find((col) => getDayKey(col.date) === overDay)
    if (!targetColumn) return

    setColumnOrder((prev) => {
      const source = prev[activeDay] ?? []
      const target = prev[overDay] ?? []

      const nextSource = source.filter((id) => id !== activeId)
      const nextTarget = target.includes(activeId) ? target : [...target, activeId]

      return {
        ...prev,
        [activeDay]: nextSource,
        [overDay!]: nextTarget,
      }
    })

    onMoveTaskDate?.(activeId, targetColumn.date)
  }

  return (
    <div className="flex flex-col h-full space-y-6">
      {/* Board Header */}
      <div className="flex items-center justify-between px-4 flex-shrink-0">
        <div className="flex items-center gap-2">
          <CalendarBlank className="h-4 w-4" />
          <span className="text-sm font-medium">
            {weekRangeLabel}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 rounded-md"
            onClick={handlePrevWeek}
            aria-label="Previous week"
          >
            <CaretLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-8 px-3"
            onClick={handleToday}
          >
            Today
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 rounded-md"
            onClick={handleNextWeek}
            aria-label="Next week"
          >
            <CaretRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-8 px-3"
            onClick={handleToggleWeekend}
          >
            {showWeekend ? "Hide weekend" : "Show weekend"}
          </Button>
        </div>
      </div>

      {/* Columns */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={({ active }) => {
          const id = String(active.id)
          const map = new Map(tasks.map((t) => [t.id, t]))
          setActiveTask(map.get(id))
        }}
        onDragEnd={handleDragEnd}
      >
        <div className="overflow-x-auto flex-1 min-h-0">
          <div className="flex gap-4 px-4 pb-4 min-w-max">
            {weekColumns.map((column) => {
              const dayKey = getDayKey(column.date)
              const orderedIds = columnOrder[dayKey] ?? column.tasks.map((t) => t.id)
              const taskMap = new Map(column.tasks.map((t) => [t.id, t]))
              const orderedTasks = orderedIds
                .map((id) => taskMap.get(id))
                .filter((t): t is ProjectTask => Boolean(t))

              return (
                <DayColumnDroppable
                  key={column.date.getTime()}
                  dayKey={dayKey}
                  date={column.date}
                  today={today}
                  done={column.done}
                  total={column.total}
                  orderedIds={orderedIds}
                  orderedTasks={orderedTasks}
                  onAddTask={onAddTask}
                  onToggleTask={onToggleTask}
                  onOpenTask={onOpenTask}
                  onChangeTag={onChangeTag}
                />
              )
            })}
          </div>
        </div>

        <DragOverlay>
          {activeTask ? (
            <TaskBoardCard
              task={activeTask}
              variant={activeTask.status === "done" ? "completed" : "default"}
              onToggle={() => onToggleTask?.(activeTask.id)}
              onOpen={() => onOpenTask?.(activeTask)}
              onChangeTag={(tagLabel) => onChangeTag?.(activeTask.id, tagLabel)}
            />
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  )
}

type DayColumnDroppableProps = {
  dayKey: string
  date: Date
  today: Date
  done: number
  total: number
  orderedIds: string[]
  orderedTasks: ProjectTask[]
  onAddTask?: (context?: CreateTaskContext) => void
  onToggleTask?: (taskId: string) => void
  onOpenTask?: (task: ProjectTask) => void
  onChangeTag?: (taskId: string, tagLabel?: string) => void
}

function DayColumnDroppable({
  dayKey,
  date,
  today,
  done,
  total,
  orderedIds,
  orderedTasks,
  onAddTask,
  onToggleTask,
  onOpenTask,
  onChangeTag,
}: DayColumnDroppableProps) {
  const { isOver, setNodeRef } = useDroppable({
    id: dayKey,
    data: { dayKey },
  })

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "flex-shrink-0 rounded-2xl border border-muted bg-muted p-3 space-y-3 min-h-[400px] w-80 transition-colors",
        isSameDay(date, today) && "border-primary bg-muted",
        isOver && "border-primary/80 bg-muted",
      )}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between">
        <span
          className={cn(
            "text-sm font-medium",
            isSameDay(date, today) && "text-primary",
          )}
        >
          {format(date, "d EEE").toUpperCase()}
        </span>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            {done}/{total}
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 rounded-lg"
            onClick={() => onAddTask?.({ /* TODO: add date context */ })}
            aria-label="Add task"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Column Content */}
      <SortableContext items={orderedIds} strategy={verticalListSortingStrategy}>
        <div className="space-y-3">
          {orderedTasks.length === 0 ? (
            <TaskBoardCard variant="empty" />
          ) : (
            orderedTasks.map((task) => (
              <SortableTaskCard
                key={task.id}
                task={task}
                dayKey={dayKey}
                onToggle={onToggleTask}
                onOpen={onOpenTask}
                onChangeTag={onChangeTag}
              />
            ))
          )}
          {/* Add task button at bottom */}
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start"
            onClick={() => onAddTask?.({ /* TODO: add date context */ })}
          >
            <Plus className="mr-1 h-4 w-4" />
            Add task
          </Button>
        </div>
      </SortableContext>
    </div>
  )
}

type SortableTaskCardProps = {
  task: ProjectTask
  dayKey: string
  onToggle?: (taskId: string) => void
  onOpen?: (task: ProjectTask) => void
  onChangeTag?: (taskId: string, tagLabel?: string) => void
}

function SortableTaskCard({ task, dayKey, onToggle, onOpen, onChangeTag }: SortableTaskCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: task.id,
    data: { dayKey },
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <TaskBoardCard
        task={task}
        variant={task.status === "done" ? "completed" : "default"}
        onToggle={() => onToggle?.(task.id)}
        onOpen={() => onOpen?.(task)}
        onChangeTag={(tagLabel) => onChangeTag?.(task.id, tagLabel)}
      />
    </div>
  )
}
