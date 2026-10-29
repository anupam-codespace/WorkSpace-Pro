"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import {
  X,
  Folder,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Plus,
  FileText,
  Building2,
  Briefcase,
  MapPin,
  Globe2,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ClientStatusFilterPopover } from "@/components/clients/ClientStatusFilterPopover"
import { FileLinkRow } from "@/components/projects/FileLinkRow"
import { cn } from "@/lib/utils"
import {
  clients,
  getClientById,
  getProjectCountForClient,
  type Client,
} from "@/lib/data/clients"
import type { QuickLink } from "@/lib/data/project-details"
import { projects } from "@/lib/data/projects"
import { ClientWizard } from "@/components/clients/ClientWizard"
import { ProjectWizard } from "@/components/project-wizard/ProjectWizard"

interface ClientDetailsDrawerProps {
  clientId: string | null
  onClose: () => void
}

export function ClientDetailsDrawer({ clientId, onClose }: ClientDetailsDrawerProps) {
  const [isWizardOpen, setIsWizardOpen] = useState(false)
  const [isProjectWizardOpen, setIsProjectWizardOpen] = useState(false)
  const [notesOpen, setNotesOpen] = useState(true)
  const [sharedOpen, setSharedOpen] = useState(true)
  const [projectOffset, setProjectOffset] = useState(0)
  const projectsRowRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    setProjectOffset(0)
  }, [clientId])

  if (!clientId) return null

  const client: Client | undefined = getClientById(clientId) ?? clients[0]
  if (!client) return null

  const relatedProjects = projects.filter((p) => p.client === client.name)
  const projectCount = getProjectCountForClient(client.name)
  const projectsPerPage = 3
  const totalPages = Math.max(1, Math.ceil(relatedProjects.length / projectsPerPage))
  const canPrev = projectOffset > 0
  const canNext = projectOffset < totalPages - 1

  const displayName = client.primaryContactName ?? client.name
  const email = client.primaryContactEmail
  const initials = displayName
    .split(" ")
    .map((part) => part.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase()

  const companyInfoTiles = [
    {
      id: "company",
      label: "Company",
      value: client.name,
      icon: Building2,
    },
    {
      id: "industry",
      label: "Industry",
      value: client.industry,
      icon: Briefcase,
    },
    {
      id: "location",
      label: "Location",
      value: client.location,
      icon: MapPin,
    },
    {
      id: "website",
      label: "Website",
      value: client.website,
      icon: Globe2,
    },
  ] as const

  const sharedFiles: QuickLink[] = [
    {
      id: "proposal",
      name: "Proposal.pdf",
      type: "pdf",
      sizeMB: 13,
      url: "#",
    },
    {
      id: "wireframe-1",
      name: "Wireframe layout.fig",
      type: "fig",
      sizeMB: 13,
      url: "#",
    },
    {
      id: "wireframe-2",
      name: "Wireframe updates.fig",
      type: "fig",
      sizeMB: 13,
      url: "#",
    },
  ]

  return (
    <div className="fixed inset-0 z-40 flex justify-end">
      <button
        type="button"
        aria-label="Close client details"
        className="flex-1 bg-background/40 backdrop-blur-sm"
        onClick={onClose}
      />

      <aside
        className="flex h-full w-full max-w-2xl flex-col border-l border-border bg-background shadow-2xl"
      >
        <div className="px-5 pt-4 pb-3 space-y-2">
          <div className="flex items-start justify-between gap-3">
            <div className="flex flex-col gap-2 min-w-0 flex-1">
              <div className="flex items-center gap-3 min-w-0">
                <Avatar className="h-11 w-11">
                  <AvatarFallback className="text-sm font-semibold">{initials}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col gap-0.5 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{displayName}</p>
                  {email && (
                    <p className="text-xs text-muted-foreground truncate">{email}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="hidden sm:block">
                <ClientStatusFilterPopover initialStatus={client.status} />
              </div>
              <Button
                variant="ghost"
                size="icon-sm"
                className="h-7 w-7 rounded-full text-muted-foreground hover:text-foreground"
                onClick={onClose}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Mobile-only Stage row, full width of the header container */}
          <div className="w-full sm:hidden">
            <ClientStatusFilterPopover initialStatus={client.status} />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-5 pb-4 pt-0 sm:pt-4 space-y-8">
          <div className="rounded-2xl border border-border bg-card/80 px-5 py-4">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {companyInfoTiles.map((item) => {
                const Icon = item.icon
                return (
                  <div key={item.id} className="flex flex-col items-start gap-2 min-w-0">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted">
                      <Icon className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="space-y-0.5 min-w-0">
                      <p className="text-[11px] font-medium text-muted-foreground">{item.label}</p>
                      <p className="text-xs text-foreground truncate">
                        {item.value || "—"}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-foreground">Linked projects</p>
              {projectCount > 0 && (
                <p className="text-[11px] text-muted-foreground">{projectCount} linked</p>
              )}
            </div>
            {relatedProjects.length === 0 ? (
              <p className="text-xs text-muted-foreground">No projects linked to this client yet.</p>
            ) : (
              <div className="relative flex-1">
                <button
                  type="button"
                  className="absolute left-0 top-1/2 flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-background text-muted-foreground hover:bg-accent hover:text-foreground hover:shadow disabled:opacity-40 disabled:pointer-events-none disabled:bg-background cursor-pointer"
                  disabled={!canPrev}
                  onClick={() => {
                    if (!projectsRowRef.current || !canPrev) return
                    const container = projectsRowRef.current
                    const pageWidth = container.clientWidth
                    container.scrollBy({ left: -pageWidth, behavior: "smooth" })
                    setProjectOffset((prev) => Math.max(0, prev - 1))
                  }}
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <div
                  ref={projectsRowRef}
                  className="flex gap-3 overflow-x-auto scroll-smooth pb-1 no-scrollbar"
                >
                  {relatedProjects.map((p) => (
                    <Link
                      key={p.id}
                      href={`/projects/${p.id}`}
                      className="flex min-w-[220px] flex-col justify-between rounded-[24px] border border-border bg-muted px-4 py-4 shadow-[var(--shadow-workstream)] hover:bg-muted/80 sm:min-w-[240px]"
                    >
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background">
                        <Folder className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div className="mt-3 space-y-1 min-w-0">
                        <p className="text-sm font-medium text-foreground leading-snug truncate">{p.name}</p>
                        <p className="text-[11px] text-muted-foreground">
                          {p.status.charAt(0).toUpperCase() + p.status.slice(1)} · {p.priority.charAt(0).toUpperCase() + p.priority.slice(1)} priority
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
                <button
                  type="button"
                  className="absolute right-0 top-1/2 flex h-8 w-8 translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-background text-muted-foreground hover:bg-accent hover:text-foreground hover:shadow disabled:opacity-40 disabled:pointer-events-none disabled:bg-background cursor-pointer"
                  disabled={!canNext}
                  onClick={() => {
                    if (!projectsRowRef.current || !canNext) return
                    const container = projectsRowRef.current
                    const pageWidth = container.clientWidth
                    container.scrollBy({ left: pageWidth, behavior: "smooth" })
                    setProjectOffset((prev) => (prev < totalPages - 1 ? prev + 1 : prev))
                  }}
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}

            <button
              type="button"
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-border/70 bg-muted/40 px-3 py-2 text-xs text-muted-foreground hover:bg-muted cursor-pointer"
              onClick={() => setIsProjectWizardOpen(true)}
            >
              <Plus className="h-4 w-4" />
              <span>Add Project</span>
            </button>
          </div>

          {client.notes && (
            <div className="space-y-2 pt-1">
              <button
                type="button"
                className="flex w-full items-center justify-between cursor-pointer hover:text-foreground"
                onClick={() => setNotesOpen((open) => !open)}
              >
                <p className="text-sm font-medium text-foreground">Notes</p>
                <ChevronDown
                  className={cn(
                    "h-3.5 w-3.5 text-muted-foreground transition-transform",
                    notesOpen && "rotate-180",
                  )}
                />
              </button>
              {notesOpen && (
                <p className="text-sm text-foreground whitespace-pre-line">
                  {client.notes}
                </p>
              )}
            </div>
          )}

          <div className="h-px w-full bg-border/80" />

          <div className="space-y-3 pt-1">
            <button
              type="button"
              className="flex w-full items-center justify-between cursor-pointer hover:text-foreground"
              onClick={() => setSharedOpen((open) => !open)}
            >
              <p className="text-sm font-medium text-foreground">Shared file</p>
              <ChevronDown
                className={cn(
                  "h-3.5 w-3.5 text-muted-foreground transition-transform",
                  sharedOpen && "rotate-180",
                )}
              />
            </button>
            {sharedOpen && (
              <div className="grid gap-3 sm:grid-cols-2">
                {sharedFiles.map((file) => (
                  <div
                    key={file.id}
                    className="rounded-2xl border border-border bg-card/80 px-3 py-2"
                  >
                    <FileLinkRow file={file} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between bg-background px-5 py-3">
          <Button
            variant="outline"
            size="sm"
            className="text-xs"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            size="sm"
            className="text-xs"
            onClick={() => setIsWizardOpen(true)}
          >
            Edit client
          </Button>
        </div>

        {isWizardOpen && (
          <ClientWizard
            mode="edit"
            initialClient={client}
            onClose={() => setIsWizardOpen(false)}
          />
        )}

        {isProjectWizardOpen && (
          <ProjectWizard
            onClose={() => setIsProjectWizardOpen(false)}
            onCreate={() => setIsProjectWizardOpen(false)}
          />
        )}
      </aside>
    </div>
  )
}

