"use client"

import { useRef } from "react"
import { UploadSimple } from "@phosphor-icons/react/dist/ssr"

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"

type UploadAudioModalProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    onFileSelect: (fileName: string) => void
}

export function UploadAudioModal({
    open,
    onOpenChange,
    onFileSelect,
}: UploadAudioModalProps) {
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        const files = e.dataTransfer.files
        if (files.length > 0) {
            onFileSelect(files[0].name)
            onOpenChange(false)
        }
    }

    const handleClick = () => {
        fileInputRef.current?.click()
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (files && files.length > 0) {
            onFileSelect(files[0].name)
            onOpenChange(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] z-[60] p-6 gap-0 rounded-3xl border border-border shadow-2xl">
                <DialogHeader>
                    <VisuallyHidden>
                        <DialogTitle>Upload Audio File</DialogTitle>
                    </VisuallyHidden>
                    <div className="flex items-center gap-2 text-base font-medium">
                        <UploadSimple className="h-4 w-4" />
                        Upload New Audio File
                    </div>
                </DialogHeader>

                <div
                    className="mt-4 flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border p-12 cursor-pointer hover:border-primary/50 transition-colors"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleDrop}
                    onClick={handleClick}
                >
                    <UploadSimple className="h-10 w-10 text-muted-foreground/50 mb-4" />
                    <p className="text-sm font-medium text-foreground">
                        Drop your audio or video file here or click to browse
                    </p>
                    <p className="mt-2 text-xs text-muted-foreground">
                        Supports MP3, WAV, M4A, FLAC, AAC, MP4, MOV, AVI, MKV and more
                    </p>
                </div>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="audio/*,video/*"
                    onChange={handleFileChange}
                    className="hidden"
                />
            </DialogContent>
        </Dialog>
    )
}
