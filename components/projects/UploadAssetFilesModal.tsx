"use client"

import { useRef } from "react"
import { UploadSimple } from "@phosphor-icons/react/dist/ssr"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"

type UploadAssetFilesModalProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    onFilesSelect: (files: File[]) => void
}

export function UploadAssetFilesModal({ open, onOpenChange, onFilesSelect }: UploadAssetFilesModalProps) {
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        const files = Array.from(e.dataTransfer.files || [])
        if (files.length > 0) {
            onFilesSelect(files)
            onOpenChange(false)
        }
    }

    const handleClick = () => {
        fileInputRef.current?.click()
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files ? Array.from(e.target.files) : []
        if (files.length > 0) {
            onFilesSelect(files)
            onOpenChange(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] z-[60] p-6 gap-0 rounded-3xl border border-border shadow-2xl">
                <DialogHeader>
                    <VisuallyHidden>
                        <DialogTitle>Upload Files</DialogTitle>
                    </VisuallyHidden>
                    <div className="flex items-center gap-2 text-base font-medium">
                        <UploadSimple className="h-4 w-4" />
                        Upload Files
                    </div>
                </DialogHeader>

                <div
                    className="mt-4 flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border p-12 cursor-pointer hover:border-primary/50 transition-colors"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleDrop}
                    onClick={handleClick}
                >
                    <UploadSimple className="h-10 w-10 text-muted-foreground/50 mb-4" />
                    <p className="text-sm font-medium text-foreground">Drop your files here or click to browse</p>
                    <p className="mt-2 text-xs text-muted-foreground">Supports PDF, ZIP, FIG, DOC and more</p>
                </div>
                <input ref={fileInputRef} type="file" multiple onChange={handleFileChange} className="hidden" />
            </DialogContent>
        </Dialog>
    )
}
