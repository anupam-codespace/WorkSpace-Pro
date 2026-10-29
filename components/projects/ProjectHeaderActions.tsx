"use client"

import { useCallback } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LinkSimple, ShareNetwork, DotsThreeVertical } from "@phosphor-icons/react/dist/ssr"

type ProjectHeaderActionsProps = {
  projectId: string
}

export function ProjectHeaderActions({ projectId }: ProjectHeaderActionsProps) {
  const copyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      toast.success("Link copied")
    } catch {
      toast.error("Failed to copy link")
    }
  }, [])

  const share = useCallback(() => {
    toast.message("Share", { description: "Mock action" })
  }, [])

  return (
    <div className="flex items-center gap-2">
      <Button variant="ghost" size="icon-sm" aria-label="Copy link" onClick={copyLink}>
        <LinkSimple className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon-sm" aria-label="Share" onClick={share}>
        <ShareNetwork className="h-4 w-4" />
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon-sm" aria-label="More actions">
            <DotsThreeVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-44">
          <DropdownMenuItem onSelect={() => toast.message("Edit", { description: `Project ${projectId}` })}>
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => toast.message("Duplicate", { description: `Project ${projectId}` })}>
            Duplicate
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={() => toast.message("Archive", { description: `Project ${projectId}` })}>
            Archive
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
