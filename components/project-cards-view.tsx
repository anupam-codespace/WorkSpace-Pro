"use client"

import type { Project } from "@/lib/data/projects"
import { ProjectCard } from "@/components/project-card"
import { Plus, FolderOpen } from "@phosphor-icons/react/dist/ssr"
import { Skeleton } from "@/components/ui/skeleton"

type ProjectCardsViewProps = {
  projects: Project[]
  loading?: boolean
  onCreateProject?: () => void
}

export function ProjectCardsView({ projects, loading = false, onCreateProject }: ProjectCardsViewProps) {
  const isEmpty = !loading && projects.length === 0

  return (
    <div className="p-4">
      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-40 rounded-2xl" />
          ))}
        </div>
      ) : isEmpty ? (
        <div className="flex h-60 flex-col items-center justify-center text-center">
          <div className="p-3 bg-muted rounded-md mb-4">
            <FolderOpen className="h-6 w-6 text-foreground" />
          </div>
          <h3 className="mb-2 text-lg font-semibold text-foreground">No projects yet</h3>
          <p className="mb-6 text-sm text-muted-foreground">Create your first project to get started</p>
          <button
            className="rounded-lg border border-border bg-background px-4 py-2 text-sm hover:bg-accent transition-colors cursor-pointer"
            onClick={onCreateProject}
          >
            <Plus className="mr-2 inline h-4 w-4" />
            Create new project
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {projects.map((p) => (
            <ProjectCard key={p.id} project={p} />
          ))}
          <button
            className="rounded-2xl border border-dashed border-border/60 bg-background p-6 text-center text-sm text-muted-foreground hover:border-solid hover:border-border/80 hover:text-foreground transition-colors min-h-[180px] flex flex-col items-center justify-center cursor-pointer"
            onClick={onCreateProject}
          >
            <Plus className="mb-2 h-5 w-5" />
            Create new project
          </button>
        </div>
      )}
    </div>
  )
}
