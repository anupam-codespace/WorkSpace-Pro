import Image from "next/image"

import type { QuickLink } from "@/lib/data/project-details"
import { getFileIcon } from "@/components/projects/FileLinkRow"

type FileTypeIconProps = {
    type: QuickLink["type"]
    wrapperSize?: number
    iconSize?: number
    className?: string
    background?: boolean
}

export function FileTypeIcon({
    type,
    wrapperSize = 44,
    iconSize = 40,
    className = "",
    background = false,
}: FileTypeIconProps) {
    const { src, alt } = getFileIcon(type)

    return (
        <div
            className={`flex items-center justify-center rounded-xl ${background ? "bg-muted/40" : ""} ${className}`}
            style={{ width: wrapperSize, height: wrapperSize }}
        >
            <span className="relative" style={{ width: iconSize, height: iconSize }}>
                <Image src={src} alt={alt} fill className="object-contain" />
            </span>
        </div>
    )
}
