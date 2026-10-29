import { DotsThree } from "@phosphor-icons/react/dist/ssr"

import type { ProjectFile } from "@/lib/data/project-details"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { FileTypeIcon } from "@/components/projects/FileTypeIcon"

type RecentFileCardProps = {
    file: ProjectFile
    onEdit?: (fileId: string) => void
    onDelete?: (fileId: string) => void
}

export function RecentFileCard({ file, onEdit, onDelete }: RecentFileCardProps) {
    const sizeLabel = file.isLinkAsset || file.sizeMB === 0 ? "Link" : `${file.sizeMB.toFixed(1)} MB`

    return (
        <div className="flex items-center justify-between rounded-2xl border border-border bg-card px-4 py-3">
            <div className="flex items-start gap-2 min-w-0">
                <FileTypeIcon type={file.type} wrapperSize={44} iconSize={40} background={false} />
                <div className="min-w-0">
                    <div className="truncate text-sm font-medium text-foreground">{file.name}</div>
                    <div className="text-sm text-muted-foreground">{sizeLabel}</div>
                </div>
            </div>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        size="icon-sm"
                        className="h-7 w-7 text-muted-foreground hover:text-foreground"
                        aria-label={`Open actions for ${file.name}`}
                    >
                        <DotsThree className="h-4 w-4" weight="bold" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit?.(file.id)}>Edit</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onDelete?.(file.id)}>Delete</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}
