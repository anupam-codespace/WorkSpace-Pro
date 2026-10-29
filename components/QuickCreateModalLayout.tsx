"use client"

import React from "react"
import { motion } from "motion/react"

import { cn } from "@/lib/utils"

interface QuickCreateModalLayoutProps {
    open: boolean
    onClose: () => void
    isDescriptionExpanded?: boolean
    onSubmitShortcut?: () => void
    className?: string
    contentClassName?: string
    children: React.ReactNode
}

export function QuickCreateModalLayout({
    open,
    onClose,
    isDescriptionExpanded,
    onSubmitShortcut,
    className,
    contentClassName,
    children,
}: QuickCreateModalLayoutProps) {
    if (!open) return null

    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (!onSubmitShortcut) return

        if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
            event.preventDefault()
            onSubmitShortcut()
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{
                    opacity: 1,
                    scale: 1,
                    height: isDescriptionExpanded ? "85vh" : "auto",
                }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className={cn(
                    "flex w-full max-w-[720px] rounded-3xl bg-background shadow-2xl border border-border",
                    className,
                )}
                onKeyDown={handleKeyDown}
            >
                <div className={cn("flex flex-1 flex-col p-4 gap-3.5", contentClassName)}>{children}</div>
            </motion.div>
        </div>
    )
}
