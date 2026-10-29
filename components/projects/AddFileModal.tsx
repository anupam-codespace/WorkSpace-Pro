"use client"

import { useEffect, useMemo, useState } from "react"
import { Paperclip, UploadSimple, X } from "@phosphor-icons/react/dist/ssr"

import type { ProjectFile, QuickLink, User } from "@/lib/data/project-details"
import { Button } from "@/components/ui/button"
import { QuickCreateModalLayout } from "@/components/QuickCreateModalLayout"
import { ProjectDescriptionEditor } from "@/components/project-wizard/ProjectDescriptionEditor"
import { UploadAssetFilesModal } from "@/components/projects/UploadAssetFilesModal"

type AddFileModalProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    currentUser: User
    onCreate: (files: ProjectFile[]) => void
}

function toQuickLinkType(ext: string): QuickLink["type"] {
    const e = ext.toLowerCase()
    if (e === "pdf") return "pdf"
    if (e === "zip") return "zip"
    if (e === "fig" || e === "figma") return "fig"
    if (e === "doc" || e === "docx") return "doc"
    return "file"
}

export function AddFileModal({ open, onOpenChange, currentUser, onCreate }: AddFileModalProps) {
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState<string | undefined>(undefined)
    const [link, setLink] = useState("")
    const [pendingFiles, setPendingFiles] = useState<File[]>([])
    const [isExpanded, setIsExpanded] = useState(false)
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)

    useEffect(() => {
        if (!open) return

        setTitle("")
        setDescription(undefined)
        setLink("")
        setPendingFiles([])
        setIsUploadModalOpen(false)
        setIsExpanded(false)
    }, [open])

    const attachmentSummaries = useMemo(
        () =>
            pendingFiles.map((f) => ({
                name: f.name,
                sizeMB: +(f.size / (1024 * 1024)).toFixed(1),
            })),
        [pendingFiles],
    )

    const handleClose = () => {
        onOpenChange(false)
    }

    const buildQuickLinkFromFile = (file: File, idPrefix: string): QuickLink => {
        const name = file.name
        const ext = name.includes(".") ? name.split(".").pop() || "" : ""
        return {
            id: idPrefix,
            name,
            type: toQuickLinkType(ext),
            sizeMB: +(file.size / (1024 * 1024)).toFixed(1),
            url: "#",
        }
    }

    const canSubmit = Boolean(link.trim() || pendingFiles.length > 0)

    const handleCreateAsset = () => {
        if (!canSubmit) return

        const now = Date.now()
        const trimmedLink = link.trim()
        const hasLink = Boolean(trimmedLink)
        let mainQuickLink: QuickLink | undefined
        const attachments: QuickLink[] = []

        if (hasLink) {
            const type = detectTypeFromUrl(trimmedLink)
            mainQuickLink = {
                id: `asset-link-${now}`,
                name: title || trimmedLink,
                type,
                sizeMB: 0,
                url: trimmedLink,
            }

            pendingFiles.forEach((file, idx) => {
                attachments.push(buildQuickLinkFromFile(file, `asset-link-attachment-${now}-${idx}`))
            })
        } else {
            if (!pendingFiles.length) return

            pendingFiles.forEach((file, idx) => {
                const quickLink = buildQuickLinkFromFile(file, `asset-file-${now}-${idx}`)
                if (!mainQuickLink) {
                    mainQuickLink = {
                        ...quickLink,
                        name: title || quickLink.name,
                    }
                } else {
                    attachments.push(quickLink)
                }
            })
        }

        if (!mainQuickLink) return

        const projectFile: ProjectFile = {
            ...mainQuickLink,
            addedBy: currentUser,
            addedDate: new Date(),
            description,
            isLinkAsset: hasLink,
            attachments: attachments.length ? attachments : undefined,
        }

        onCreate([projectFile])
        onOpenChange(false)
    }

    const handleFilesSelected = (files: File[]) => {
        if (!files.length) return
        setPendingFiles((prev) => [...prev, ...files])
    }

    return (
        <>
            <QuickCreateModalLayout
                open={open}
                onClose={handleClose}
                isDescriptionExpanded={isExpanded}
                onSubmitShortcut={handleCreateAsset}
            >
                <div className="flex items-center justify-between gap-2 w-full shrink-0 mt-1">
                    <div className="flex flex-col gap-2 flex-1">
                        <div className="flex gap-1 h-10 items-center w-full">
                            <input
                                id="asset-title"
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Asset title"
                                className="w-full font-normal leading-7 text-foreground placeholder:text-muted-foreground text-xl outline-none bg-transparent border-none p-0"
                                autoComplete="off"
                            />
                        </div>

                    </div>
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        className="h-8 w-8 rounded-full opacity-70 hover:opacity-100"
                        onClick={handleClose}
                    >
                        <X className="h-4 w-4 text-muted-foreground" />
                    </Button>
                </div>

                <ProjectDescriptionEditor
                    value={description}
                    onChange={setDescription}
                    onExpandChange={setIsExpanded}
                    placeholder="Describe this asset..."
                    showTemplates={false}
                />

                <div className="flex items-center gap-2 mt-2">
                    <input
                        id="asset-link"
                        type="url"
                        value={link}
                        onChange={(e) => setLink(e.target.value)}
                        placeholder="Paste a link (Figma, Drive, or any URL)"
                        className="w-full text-md leading-6 text-foreground placeholder:text-muted-foreground outline-none bg-transparent border-none p-0"
                        autoComplete="off"
                    />
                </div>

                <div className="mt-3 w-full">
                    {attachmentSummaries.length > 0 ? (
                        <div className="space-y-2">
                            {attachmentSummaries.map((s) => (
                                <div
                                    key={s.name}
                                    className="flex items-center justify-between rounded-lg border px-3 py-2 text-sm"
                                >
                                    <div className="flex items-center gap-2 min-w-0">
                                        <Paperclip className="h-4 w-4 text-muted-foreground" />
                                        <div className="truncate">{s.name}</div>
                                    </div>
                                    <div className="text-muted-foreground text-xs">{s.sizeMB.toFixed(1)} MB</div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-xs text-muted-foreground">No files attached yet.</p>
                    )}
                </div>

                <div className="flex items-center justify-between mt-auto w-full pt-4 shrink-0">
                    <div className="flex items-center gap-2">
                        <Button type="button" variant="ghost" size="icon-sm" className="text-muted-foreground">
                            <Paperclip className="h-4 w-4" />
                        </Button>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            type="button"
                            variant="secondary"
                            size="sm"
                            onClick={() => setIsUploadModalOpen(true)}
                        >
                            <UploadSimple className="h-4 w-4" />
                            Upload files
                        </Button>
                        <Button size="sm" onClick={handleCreateAsset} disabled={!canSubmit}>
                            Create asset
                        </Button>
                    </div>
                </div>
            </QuickCreateModalLayout>

            <UploadAssetFilesModal
                open={isUploadModalOpen}
                onOpenChange={setIsUploadModalOpen}
                onFilesSelect={handleFilesSelected}
            />
        </>
    )
}

function detectTypeFromUrl(url: string): QuickLink["type"] {
    try {
        const parsed = new URL(url)
        const host = parsed.hostname.toLowerCase()
        const pathname = parsed.pathname.toLowerCase()

        if (host.includes("figma.com") || pathname.endsWith(".fig")) return "fig"
        if (pathname.endsWith(".pdf")) return "pdf"
        if (pathname.endsWith(".zip")) return "zip"
        if (pathname.endsWith(".doc") || pathname.endsWith(".docx")) return "doc"

        const parts = pathname.split(".")
        const ext = parts.length > 1 ? parts.pop() || "" : ""
        return toQuickLinkType(ext)
    } catch {
        return "file"
    }
}
