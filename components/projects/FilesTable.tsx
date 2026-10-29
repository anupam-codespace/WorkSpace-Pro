"use client"

import { useState } from "react"
import { DotsThree, MagnifyingGlass, Plus } from "@phosphor-icons/react/dist/ssr"
import { format } from "date-fns"
import Image from "next/image"

import type { ProjectFile } from "@/lib/data/project-details"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getFileIcon } from "@/components/projects/FileLinkRow"

type FilesTableProps = {
    files: ProjectFile[]
    onAddFile?: () => void
}

export function FilesTable({ files, onAddFile }: FilesTableProps) {
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedFiles, setSelectedFiles] = useState<string[]>([])

    const filteredFiles = files.filter((file) =>
        file.name.toLowerCase().includes(searchQuery.toLowerCase()),
    )

    const toggleSelectAll = () => {
        if (selectedFiles.length === filteredFiles.length) {
            setSelectedFiles([])
        } else {
            setSelectedFiles(filteredFiles.map((file) => file.id))
        }
    }

    const toggleSelectFile = (fileId: string) => {
        setSelectedFiles((prev) =>
            prev.includes(fileId) ? prev.filter((id) => id !== fileId) : [...prev, fileId],
        )
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between gap-3">
                <div className="relative flex-1 max-w-sm">
                    <MagnifyingGlass className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search files"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9"
                    />
                </div>
                <Button variant="ghost" size="sm" onClick={onAddFile}>
                    <Plus className="h-4 w-4" />
                    Add File
                </Button>
            </div>

            <div className="rounded-lg border border-border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-12">
                                <Checkbox
                                    checked={
                                        filteredFiles.length > 0 &&
                                        selectedFiles.length === filteredFiles.length &&
                                        filteredFiles.length > 0
                                    }
                                    onCheckedChange={toggleSelectAll}
                                />
                            </TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Added by</TableHead>
                            <TableHead>Added date</TableHead>
                            <TableHead className="w-12" />
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredFiles.map((file) => {
                            const icon = getFileIcon(file.type)
                            const sizeLabel = file.isLinkAsset || file.sizeMB === 0 ? "Link" : `${file.sizeMB.toFixed(1)} MB`

                            return (
                                <TableRow key={file.id} className="cursor-pointer">
                                    <TableCell
                                        onClick={(e) => {
                                            e.stopPropagation()
                                        }}
                                    >
                                        <Checkbox
                                            checked={selectedFiles.includes(file.id)}
                                            onCheckedChange={() => toggleSelectFile(file.id)}
                                        />
                                    </TableCell>
                                    <TableCell className="font-medium">
                                        <div className="flex items-center gap-2 min-w-0">
                                            <div className="flex h-9 w-9 items-center justify-center rounded-lg">
                                                <Image
                                                    src={icon.src}
                                                    alt={icon.alt}
                                                    width={28}
                                                    height={28}
                                                    className="rounded"
                                                />
                                            </div>
                                            <div className="min-w-0">
                                                <div className="truncate text-sm font-medium text-foreground">{file.name}</div>
                                                <div className="text-sm text-muted-foreground">{sizeLabel}</div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">{file.addedBy.name}</TableCell>
                                    <TableCell className="text-muted-foreground">
                                        {format(file.addedDate, "d MMM")}
                                    </TableCell>
                                    <TableCell
                                        onClick={(e) => {
                                            e.stopPropagation()
                                        }}
                                    >
                                        <Button
                                            variant="ghost"
                                            size="icon-sm"
                                            className="h-8 w-8 text-muted-foreground hover:text-foreground"
                                        >
                                            <DotsThree className="h-4 w-4" weight="bold" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
