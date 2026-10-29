import type { ProjectDetails } from "@/lib/data/project-details"
import { TimeCard } from "@/components/projects/TimeCard"
import { BacklogCard } from "@/components/projects/BacklogCard"
import { QuickLinksCard } from "@/components/projects/QuickLinksCard"
import { Separator } from "@/components/ui/separator"
import { ClientCard } from "@/components/projects/ClientCard"
import { getClientByName } from "@/lib/data/clients"

type RightMetaPanelProps = {
  project: ProjectDetails
}

export function RightMetaPanel({ project }: RightMetaPanelProps) {
  const clientName = project.source?.client
  const client = clientName ? getClientByName(clientName) : undefined

  return (
    <aside className="flex flex-col gap-10 p-4 pt-8 lg:sticky lg:self-start">
      <TimeCard time={project.time} />
      <Separator />
      <BacklogCard backlog={project.backlog} />
      {client && (
        <>
          <Separator />
          <ClientCard client={client} />
        </>
      )}
      <Separator />
      <QuickLinksCard links={project.quickLinks} />
    </aside>
  )
}
