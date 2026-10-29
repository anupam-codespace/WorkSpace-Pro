"use client"

import { useEffect, useState } from "react"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ClientStatusBadge } from "@/components/clients/ClientStatusBadge"
import { getClientById, getProjectCountForClient, clients, type Client } from "@/lib/data/clients"
import { projects } from "@/lib/data/projects"
import { ClientWizard } from "@/components/clients/ClientWizard"
import Link from "next/link"

type ClientDetailsPageProps = {
  clientId: string
}

type LoadState = { status: "loading" } | { status: "ready"; client: Client }

export function ClientDetailsPage({ clientId }: ClientDetailsPageProps) {
  const [state, setState] = useState<LoadState>({ status: "loading" })
  const [isWizardOpen, setIsWizardOpen] = useState(false)

  useEffect(() => {
    setState({ status: "loading" })
    const t = setTimeout(() => {
      const client = getClientById(clientId) ?? clients[0]
      setState({ status: "ready", client })
    }, 400)
    return () => clearTimeout(t)
  }, [clientId])

  if (state.status === "loading") {
    return <ClientDetailsSkeleton />
  }

  const client = state.client
  const relatedProjects = projects.filter((p) => p.client === client.name)
  const projectCount = getProjectCountForClient(client.name)
  const displayName = client.primaryContactName ?? client.name
  const email = client.primaryContactEmail
  const initials = displayName
    .split(" ")
    .map((part) => part.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase()

  return (
    <div className="flex flex-1 flex-col min-w-0 m-2 border border-border rounded-lg">
      <div className="flex items-center justify-between gap-4 px-4 py-4">
        <div className="flex items-center gap-3">
          <SidebarTrigger className="h-8 w-8 rounded-lg hover:bg-accent text-muted-foreground" />
          <div className="flex items-center gap-3 min-w-0">
            <Avatar className="h-11 w-11">
              <AvatarFallback className="text-sm font-semibold">{initials}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-0.5 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-base font-medium text-foreground truncate">{displayName}</p>
                <ClientStatusBadge status={client.status} />
              </div>
              {email && (
                <p className="text-xs text-muted-foreground truncate">{email}</p>
              )}
              <p className="text-xs text-muted-foreground truncate">
                {client.name} · {projectCount} project{projectCount === 1 ? "" : "s"}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => setIsWizardOpen(true)}>
            Edit client
          </Button>
          <Button size="sm">
            New project
          </Button>
        </div>
      </div>

      <div className="flex flex-1 flex-col bg-background px-2 my-0 rounded-b-lg min-w-0 border-t">
        <div className="px-4">
          <div className="mx-auto w-full max-w-7xl">
            <div className="mt-0 grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,2fr)_minmax(0,320px)]">
              <div className="space-y-6 pt-4">
                <Tabs defaultValue="overview">
                  <TabsList className="w-full gap-6">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="projects">Projects</TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview">
                    <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                      <div className="rounded-lg border border-border bg-card/80 p-4 space-y-2">
                        <p className="text-xs font-medium text-muted-foreground">Primary contact</p>
                        {client.primaryContactName ? (
                          <div className="space-y-0.5">
                            <p className="text-sm font-medium text-foreground">{client.primaryContactName}</p>
                            {client.primaryContactEmail && (
                              <p className="text-xs text-muted-foreground">{client.primaryContactEmail}</p>
                            )}
                          </div>
                        ) : (
                          <p className="text-xs text-muted-foreground">No primary contact set.</p>
                        )}
                      </div>

                      <div className="rounded-lg border border-border bg-card/80 p-4 space-y-2">
                        <p className="text-xs font-medium text-muted-foreground">Company info</p>
                        <div className="space-y-1 text-xs text-muted-foreground">
                          {client.industry && <p>Industry: {client.industry}</p>}
                          {client.location && <p>Location: {client.location}</p>}
                          {client.website && (
                            <p>
                              Website: <a href={client.website} className="underline underline-offset-2" target="_blank" rel="noreferrer">{client.website}</a>
                            </p>
                          )}
                          {!client.industry && !client.location && !client.website && (
                            <p>No company info yet.</p>
                          )}
                        </div>
                      </div>

                      <div className="rounded-lg border border-border bg-card/80 p-4 space-y-2">
                        <p className="text-xs font-medium text-muted-foreground">Owner</p>
                        <p className="text-sm text-foreground">{client.owner ?? "Unassigned"}</p>
                      </div>
                    </div>

                    {client.notes && (
                      <div className="mt-6 rounded-lg border border-border bg-card/80 p-4">
                        <p className="text-xs font-medium text-muted-foreground mb-1">Notes</p>
                        <p className="text-sm text-foreground whitespace-pre-line">{client.notes}</p>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="projects">
                    <div className="mt-6">
                      {relatedProjects.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center border border-dashed border-border/60 rounded-lg bg-muted/30">
                          <p className="text-sm font-medium text-foreground">No projects for this client yet</p>
                          <p className="mt-1 text-xs text-muted-foreground">Create the first project and link it to this client.</p>
                          <Button className="mt-4 h-8 px-3 text-xs rounded-lg">
                            New project
                          </Button>
                        </div>
                      ) : (
                        <div className="rounded-lg border border-border bg-card/80 overflow-hidden">
                          <div className="divide-y divide-border/80">
                            {relatedProjects.map((p) => (
                              <Link
                                key={p.id}
                                href={`/projects/${p.id}`}
                                className="flex items-center justify-between px-4 py-3 hover:bg-muted/80"
                              >
                                <div className="flex flex-col">
                                  <p className="text-sm font-medium text-foreground">{p.name}</p>
                                  <p className="text-[11px] text-muted-foreground">
                                    {p.status.charAt(0).toUpperCase() + p.status.slice(1)} · {p.priority.charAt(0).toUpperCase() + p.priority.slice(1)} priority
                                  </p>
                                </div>
                                <span className="text-[11px] text-muted-foreground">View project</span>
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </div>

              <div className="hidden lg:block lg:border-l lg:border-border lg:pl-6 pt-4">
                <div className="space-y-4">
                  <div className="rounded-lg border border-border bg-card/80 p-4 space-y-2">
                    <p className="text-xs font-medium text-muted-foreground">Summary</p>
                    <p className="text-sm text-foreground">
                      {client.name} currently has {projectCount} linked project{projectCount === 1 ? "" : "s"}.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Separator className="mt-auto" />
      </div>
      {isWizardOpen && (
        <ClientWizard
          mode="edit"
          initialClient={client}
          onClose={() => setIsWizardOpen(false)}
        />
      )}
    </div>
  )
}

function ClientDetailsSkeleton() {
  return (
    <div className="flex flex-1 flex-col bg-background mx-2 my-2 border border-border rounded-lg min-w-0">
      <div className="p-6">
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-48" />
        </div>

        <div className="mt-4">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="mt-3 h-8 w-[360px]" />
          <Skeleton className="mt-3 h-5 w-[520px]" />
          <Skeleton className="mt-5 h-px w-full" />
          <Skeleton className="mt-5 h-16 w-full" />
        </div>

        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_320px]">
          <div className="space-y-8">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-28 w-full" />
            <Skeleton className="h-28 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>

          <div className="space-y-4">
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-52 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </div>
    </div>
  )
}
