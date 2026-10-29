"use client"

import { useMemo, useState } from "react"
import { Funnel, Tag, User } from "@phosphor-icons/react/dist/ssr"

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

type InboxItemType = "comment" | "task" | "client" | "project" | "system"

type InboxFilters = {
    types: InboxItemType[]
    clients: string[]
}

interface InboxFilterPopoverProps {
    filters: InboxFilters
    availableClients: string[]
    onChange: (next: InboxFilters) => void
}

const TYPE_OPTIONS: { value: InboxItemType; label: string }[] = [
    { value: "comment", label: "Comments" },
    { value: "task", label: "Tasks" },
    { value: "client", label: "Clients" },
    { value: "project", label: "Projects" },
    { value: "system", label: "System" },
]

export function InboxFilterPopover({ filters, availableClients, onChange }: InboxFilterPopoverProps) {
    const [open, setOpen] = useState(false)
    const [active, setActive] = useState<"types" | "clients">("types")
    const [query, setQuery] = useState("")
    const [draft, setDraft] = useState<InboxFilters>(() => filters)

    const filteredCategories = useMemo(() => {
        const q = query.trim().toLowerCase()
        const categories = [
            { id: "types" as const, label: "Type", icon: Tag },
            { id: "clients" as const, label: "Clients", icon: User },
        ]
        if (!q) return categories
        return categories.filter((cat) => cat.label.toLowerCase().includes(q))
    }, [query])

    const hasActiveFilters = filters.types.length > 0 || filters.clients.length > 0

    const toggleType = (type: InboxItemType) => {
        setDraft((prev) => {
            const exists = prev.types.includes(type)
            const types = exists ? prev.types.filter((t) => t !== type) : [...prev.types, type]
            return { ...prev, types }
        })
    }

    const toggleClient = (client: string) => {
        setDraft((prev) => {
            const exists = prev.clients.includes(client)
            const clients = exists ? prev.clients.filter((c) => c !== client) : [...prev.clients, client]
            return { ...prev, clients }
        })
    }

    const handleClear = () => {
        const cleared: InboxFilters = { types: [], clients: [] }
        setDraft(cleared)
        onChange(cleared)
    }

    const handleApply = () => {
        onChange(draft)
        setOpen(false)
    }

    return (
        <Popover
            open={open}
            onOpenChange={(nextOpen) => {
                setOpen(nextOpen)
                if (nextOpen) {
                    setDraft(filters)
                }
            }}
        >
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    className="h-8 gap-2 rounded-lg border-border/60 px-3 bg-transparent"
                >
                    <Funnel className="h-4 w-4" />
                    <span>Filter</span>
                    {hasActiveFilters && (
                        <span className="ml-1 rounded-full bg-primary/10 px-1.5 text-[10px] font-medium text-primary">
                            {filters.types.length + filters.clients.length}
                        </span>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-[560px] p-0 rounded-xl" sideOffset={8}>
                <div className="grid grid-cols-[220px_minmax(0,1fr)]">
                    <div className="border-r border-border/40 p-3">
                        <div className="px-1 pb-2">
                            <Input
                                placeholder="Search..."
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                className="h-8 text-xs"
                            />
                        </div>
                        <div className="space-y-1">
                            {filteredCategories.map((cat) => (
                                <button
                                    key={cat.id}
                                    type="button"
                                    onClick={() => setActive(cat.id)}
                                    className={cn(
                                        "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs hover:bg-accent",
                                        active === cat.id && "bg-accent",
                                    )}
                                >
                                    <cat.icon className="h-4 w-4" />
                                    <span className="flex-1 text-left">{cat.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="p-3">
                        {active === "types" && (
                            <div className="space-y-2">
                                <p className="mb-1 text-[11px] font-medium text-muted-foreground">Type</p>
                                <div className="grid grid-cols-2 gap-2">
                                    {TYPE_OPTIONS.map((option) => (
                                        <label
                                            key={option.value}
                                            className="flex items-center gap-2 rounded-lg border p-2 text-[11px] hover:bg-accent cursor-pointer"
                                        >
                                            <Checkbox
                                                checked={draft.types.includes(option.value)}
                                                onCheckedChange={() => toggleType(option.value)}
                                                className="h-3.5 w-3.5"
                                            />
                                            <span className="flex-1">{option.label}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        )}

                        {active === "clients" && availableClients.length > 0 && (
                            <div className="space-y-2">
                                <p className="mb-1 text-[11px] font-medium text-muted-foreground">Clients</p>
                                <div className="max-h-40 space-y-1 overflow-y-auto pr-1">
                                    {availableClients.map((client) => (
                                        <label
                                            key={client}
                                            className="flex items-center gap-2 rounded-lg border p-2 text-[11px] hover:bg-accent cursor-pointer"
                                        >
                                            <Checkbox
                                                checked={draft.clients.includes(client)}
                                                onCheckedChange={() => toggleClient(client)}
                                                className="h-3.5 w-3.5"
                                            />
                                            <span className="flex-1 truncate">{client}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="mt-3 flex items-center justify-between border-t border-border/40 pt-3">
                            <button
                                type="button"
                                onClick={handleClear}
                                className="text-xs font-medium text-primary hover:underline"
                            >
                                Clear
                            </button>
                            <Button size="sm" className="h-8 rounded-lg text-xs" onClick={handleApply}>
                                Apply
                            </Button>
                        </div>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    )
}
