"use client"

import { useState } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { TimelineBar } from "@/components/timeline-bar"
import { CaretDown, CaretRight, Folder, ChartBar } from "@phosphor-icons/react/dist/ssr"
import { cn } from "@/lib/utils"
import type { Project } from "@/lib/data/projects"

interface ProjectRowProps {
  project: Project
  isExpanded: boolean
  onToggle: () => void
  dates: Date[]
  cellWidth: number
}

export function ProjectRow({ project, isExpanded, onToggle, dates, cellWidth }: ProjectRowProps) {
  const timelineWidth = dates.length * cellWidth

  return (
    <div className="border-b border-border/30">
      {/* Project Row */}
      <div className="group flex cursor-pointer hover:bg-accent/30 transition-colors" onClick={onToggle}>
        {/* Project Info */}
        <div className="w-[280px] lg:w-[320px] shrink-0 flex items-center gap-2 px-4 py-3 bg-background sticky left-0 z-10 border-r border-border/40 border-l">
          <button className="p-0.5 rounded hover:bg-accent">
            {isExpanded ? (
              <CaretDown className="h-4 w-4 text-muted-foreground" />
            ) : (
              <CaretRight className="h-4 w-4 text-muted-foreground" />
            )}
          </button>
          <Folder className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium text-sm truncate">{project.name}</span>
          <span className="ml-1 text-xs text-muted-foreground bg-muted rounded px-1.5 py-0.5 shrink-0">
            {project.taskCount}
          </span>
        </div>

        {/* Project Timeline */}
        <div className="relative py-3 pr-4 pt-4 pb-4 shrink-0" style={{ width: timelineWidth }}>
          <TimelineBar
            startDate={project.startDate}
            endDate={project.endDate}
            dates={dates}
            cellWidth={cellWidth}
            label={project.name}
            progress={project.progress}
            variant="project"
          />
        </div>
      </div>

      {/* Task Rows */}
      <div className={cn("overflow-hidden transition-all duration-200", isExpanded ? "max-h-[500px]" : "max-h-0")}>
        {project.tasks.map((task) => (
          <TaskRow key={task.id} task={task} dates={dates} cellWidth={cellWidth} />
        ))}
      </div>
    </div>
  )
}

interface TaskRowProps {
  task: Project["tasks"][number]
  dates: Date[]
  cellWidth: number
}

function TaskRow({ task, dates, cellWidth }: TaskRowProps) {
  const [checked, setChecked] = useState(task.status === "done")

  const getStatusColor = (status: string) => {
    switch (status) {
      case "done":
        return "text-emerald-600"
      case "in-progress":
        return "text-primary"
      default:
        return "text-muted-foreground"
    }
  }

  return (
    <div className="group flex hover:bg-accent/20 transition-colors">
      {/* Task Info */}
      <div className="w-[280px] lg:w-[320px] shrink-0 flex items-center gap-2 pl-10 pr-4 py-2.5 bg-background sticky left-0 z-10 border-r border-border/40">
        <Checkbox
          checked={checked}
          onCheckedChange={(c) => setChecked(c as boolean)}
          className={cn("h-4 w-4 rounded-sm", checked && "bg-teal-500 border-teal-500")}
        />
        <div className="flex flex-col flex-1 min-w-0">
          <span className={cn("text-sm truncate", checked && "line-through text-muted-foreground")}>{task.name}</span>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>{task.assignee}</span>
            <ChartBar className="h-3 w-3" />
            <span className={getStatusColor(task.status)}>
              {task.status === "done" ? "Done" : task.status === "in-progress" ? "In progress" : "Todo"}
            </span>
          </div>
        </div>
      </div>

      {/* Task Timeline */}
      <div className="relative py-2.5 pr-4 shrink-0" style={{ width: dates.length * cellWidth }}>
        <TimelineBar
          startDate={task.startDate}
          endDate={task.endDate}
          dates={dates}
          cellWidth={cellWidth}
          label={task.name}
          variant="task"
          status={task.status}
        />
      </div>
    </div>
  )
}
