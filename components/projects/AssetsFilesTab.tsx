"use client"

import { useEffect, useMemo, useState } from "react"

import type { ProjectFile, User } from "@/lib/data/project-details"
import { RecentFileCard } from "@/components/projects/RecentFileCard"
import { FilesTable } from "@/components/projects/FilesTable"
import { AddFileModal } from "@/components/projects/AddFileModal"

type AssetsFilesTabProps = {
    files: ProjectFile[]
    currentUser?: User
}

const defaultUser: User = {
    id: "anupam",
    name: "Anupam",
    avatarUrl: "/avatar-profile.jpg",
}

export function AssetsFilesTab({ files, currentUser = defaultUser }: AssetsFilesTabProps) {
    const [items, setItems] = useState<ProjectFile[]>(files)
    const [isAddOpen, setIsAddOpen] = useState(false)

    useEffect(() => {
        setItems(files)
    }, [files])

    const recentFiles = useMemo(() => items.slice(0, 6), [items])

    const handleAddFile = () => {
        setIsAddOpen(true)
    }

    const handleCreateFiles = (newFiles: ProjectFile[]) => {
        setItems((prev) => [...newFiles, ...prev])
        setIsAddOpen(false)
    }

    const handleEditFile = (fileId: string) => {
        console.log("Edit file:", fileId)
    }

    const handleDeleteFile = (fileId: string) => {
        console.log("Delete file:", fileId)
    }

    return (
        <div className="space-y-8">
            <section>
                <h2 className="mb-4 text-sm font-semibold text-accent-foreground">Recent Files</h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {recentFiles.map((file) => (
                        <RecentFileCard
                            key={file.id}
                            file={file}
                            onEdit={handleEditFile}
                            onDelete={handleDeleteFile}
                        />
                    ))}
                </div>
            </section>

            <section>
                <h2 className="mb-4 text-sm font-semibold text-accent-foreground">All files</h2>
                <FilesTable files={items} onAddFile={handleAddFile} />
            </section>

            <AddFileModal
                open={isAddOpen}
                onOpenChange={setIsAddOpen}
                currentUser={currentUser}
                onCreate={handleCreateFiles}
            />
        </div>
    )
}
