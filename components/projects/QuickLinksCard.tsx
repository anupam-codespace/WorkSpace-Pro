"use client"

import { Paperclip, UploadSimple } from "@phosphor-icons/react/dist/ssr"
import { toast } from "sonner"

import type { QuickLink } from "@/lib/data/project-details"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { FileLinkRow } from "@/components/projects/FileLinkRow"

type QuickLinksCardProps = {
  links: QuickLink[]
}

export function QuickLinksCard({ links }: QuickLinksCardProps) {
  const isEmpty = links.length === 0

  return (
    <div>
      <div className="pb-6">
        <CardTitle className="text-base">Quick links</CardTitle>
      </div>
      <div>
        {isEmpty ? (
          <div className="rounded-lg border border-dashed border-border/70 p-4 text-sm">
            <div className="flex items-start gap-3">
              <div className="mt-0.5">
                <Paperclip className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <div className="font-medium text-foreground">No files</div>
                <div className="mt-1 text-muted-foreground">Upload or attach files for this project.</div>
                <Button
                  variant="secondary"
                  size="sm"
                  className="mt-3"
                  onClick={() => toast.message("Upload file", { description: "Mock action" })}
                >
                  <UploadSimple className="h-4 w-4" />
                  Upload file
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {links.map((f, idx) => (
              <div key={f.id}>
                <FileLinkRow file={f} />
                {idx < links.length - 1 ? <Separator className="mt-3" /> : null}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
