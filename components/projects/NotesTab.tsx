"use client"

import { useState } from "react"
import { Plus } from "@phosphor-icons/react/dist/ssr"
import { toast } from "sonner"

import type { ProjectNote, User } from "@/lib/data/project-details"
import { Button } from "@/components/ui/button"
import { NoteCard } from "@/components/projects/NoteCard"
import { NotesTable } from "@/components/projects/NotesTable"
import { CreateNoteModal } from "@/components/projects/CreateNoteModal"
import { UploadAudioModal } from "@/components/projects/UploadAudioModal"
import { NotePreviewModal } from "@/components/projects/NotePreviewModal"

type NotesTabProps = {
    notes: ProjectNote[]
    currentUser?: User
}

const defaultUser: User = {
    id: "anupam",
    name: "Anupam",
    avatarUrl: "/avatar-profile.jpg",
}

export function NotesTab({ notes, currentUser = defaultUser }: NotesTabProps) {
    const recentNotes = notes.slice(0, 8)

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
    const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false)
    const [selectedNote, setSelectedNote] = useState<ProjectNote | null>(null)

    const handleAddNote = () => {
        setIsCreateModalOpen(true)
    }

    const handleCreateNote = (title: string, content: string) => {
        console.log("Creating note:", { title, content })
        toast.success("Note created")
    }

    const handleUploadAudio = () => {
        setIsUploadModalOpen(true)
    }

    const handleFileSelect = (fileName: string) => {
        console.log("File selected:", fileName)

        // Close both modals
        setIsUploadModalOpen(false)
        setIsCreateModalOpen(false)

        // Simulate processing the uploaded file into a note
        toast(`Processing "${fileName}" into a note...`)

        setTimeout(() => {
            toast.success(`Note created from "${fileName}"`)
        }, 5000)
    }

    const handleNoteClick = (note: ProjectNote) => {
        setSelectedNote(note)
        setIsPreviewModalOpen(true)
    }

    const handleEditNote = (noteId: string) => {
        console.log("Edit note:", noteId)
    }

    const handleDeleteNote = (noteId: string) => {
        console.log("Delete note:", noteId)
    }

    return (
        <div className="space-y-8">
            <section>
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-sm font-semibold text-accent-foreground">
                        Recent notes
                    </h2>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleAddNote}
                    >
                        <Plus className="h-4 w-4" />
                        Add notes
                    </Button>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {recentNotes.map((note) => (
                        <NoteCard
                            key={note.id}
                            note={note}
                            onEdit={handleEditNote}
                            onDelete={handleDeleteNote}
                            onClick={() => handleNoteClick(note)}
                        />
                    ))}
                </div>
            </section>

            <section>
                <h2 className="mb-4 text-sm font-semibold text-accent-foreground">
                    All notes
                </h2>
                <NotesTable
                    notes={notes}
                    onAddNote={handleAddNote}
                    onEditNote={handleEditNote}
                    onDeleteNote={handleDeleteNote}
                    onNoteClick={handleNoteClick}
                />
            </section>

            <CreateNoteModal
                open={isCreateModalOpen}
                onOpenChange={setIsCreateModalOpen}
                currentUser={currentUser}
                onCreateNote={handleCreateNote}
                onUploadAudio={handleUploadAudio}
            />

            <UploadAudioModal
                open={isUploadModalOpen}
                onOpenChange={setIsUploadModalOpen}
                onFileSelect={handleFileSelect}
            />

            <NotePreviewModal
                open={isPreviewModalOpen}
                onOpenChange={setIsPreviewModalOpen}
                note={selectedNote}
            />
        </div>
    )
}
