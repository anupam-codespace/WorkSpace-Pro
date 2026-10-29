"use client"

import { useEffect, useMemo, useState } from "react"
import { formatDistanceToNow } from "date-fns"
import { Bell, ChatCircleDots, CheckCircle, EnvelopeSimple } from "@phosphor-icons/react/dist/ssr"

import { SidebarTrigger } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { InboxFilterPopover } from "./InboxFilterPopover"

type InboxItemType = "comment" | "task" | "client" | "project" | "system"

type InboxItem = {
    id: string
    title: string
    preview: string
    createdAt: Date
    type: InboxItemType
    unread: boolean
    client?: string
    project?: string
}

const MOCK_INBOX_ITEMS: InboxItem[] = [
    {
        id: "1",
        title: "New comment on Homepage redesign",
        preview:
            "Sarah left a new comment on the hero section copy.\n\nSummary\n- The value proposition feels a bit dense on first read.\n- The free trial is not visible enough above the fold.\n- The primary CTA copy sounds generic compared to competitors.\n\nSuggested next steps\n- Try a shorter, more direct headline focused on the outcome.\n- Move the free trial mention into the subheading.\n- Test a more action-oriented CTA label in the next experiment.",
        createdAt: new Date(Date.now() - 1000 * 60 * 10),
        type: "comment",
        unread: true,
        client: "Acme Corp",
        project: "Website redesign",
    },
    {
        id: "2",
        title: "You were assigned a new task",
        preview:
            "You have been assigned a new task to design the end-to-end onboarding flow.\n\nScope\n- Welcome screen with a friendly intro and brand context.\n- Progress indicator across the first three key steps.\n- Educational tooltips for advanced features (analytics, integrations).\n\nExpectations\n- First clickable prototype ready for internal review by Wednesday.\n- Include at least two alternative flows for the progress indicator.",
        createdAt: new Date(Date.now() - 1000 * 60 * 45),
        type: "task",
        unread: true,
        client: "Fintech Co",
        project: "Mobile app",
    },
    {
        id: "3",
        title: "Client status updated to Active",
        preview:
            "Acme Corp moved from Prospect to Active after signing the initial three-month engagement.\n\nWhat this means\n- All planned workstreams for growth, retention, and internal tooling are now in scope.\n- Budgets and timelines should be updated to reflect the new contract.\n- Reporting for this client should move from \"pipeline\" to \"active accounts\".",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3),
        type: "client",
        unread: false,
        client: "Acme Corp",
    },
    {
        id: "4",
        title: "Project milestone completed",
        preview:
            "Phase 1 for the AI Learning Platform has been marked as completed.\n\nIncluded in this phase\n- Delivery of the core learning paths for the first cohort.\n- Initial analytics dashboards for engagement and completion rates.\n- Baseline experiment tracking for content performance.\n\nNext focus\n- Personalization of learning paths based on behavior.\n- Additional experiments on notification timing and content.",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6),
        type: "project",
        unread: false,
        project: "AI Learning Platform",
    },
    {
        id: "5",
        title: "Weekly summary is ready",
        preview:
            "Your weekly workspace summary is ready.\n\nProjects\n- 3 projects moved forward to a new stage.\n- 1 project is currently blocked and needs review.\n\nTasks\n- 18 tasks were completed.\n- 6 tasks are overdue and should be re-prioritized.\n\nSuggested focus for next week\n- Unblock the Healthcare booking app project.\n- Reduce the number of overdue tasks in the Mobile app roadmap.",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
        type: "system",
        unread: true,
    },
    {
        id: "6",
        title: "New project added for Acme Corp",
        preview:
            "A new project called \"Growth experimentation\" has been created for Acme Corp.\n\nInitial roadmap\n- Onboarding experiments to improve activation.\n- Pricing tests across the self-serve flow.\n- Retention-focused cohorts to validate over the next quarter.\n\nOwner\n- Primary owner: Growth team.\n- Support: Product analytics and Design.",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 30),
        type: "project",
        unread: true,
        client: "Acme Corp",
        project: "Growth experimentation",
    },
    {
        id: "7",
        title: "Deadline approaching for Mobile app",
        preview:
            "The design hand-off for sprint 3 of the Mobile app project is due tomorrow.\n\nBefore hand-off\n- Link all key flows inside the main Figma file.\n- Ensure annotations for edge cases are complete.\n- Double-check component usage against the latest design system.\n\nFor the engineering team\n- Attach a short checklist in the hand-off comment.\n- Highlight any known trade-offs or open questions.",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 40),
        type: "task",
        unread: false,
        client: "Fintech Co",
        project: "Mobile app",
    },
    {
        id: "8",
        title: "New stakeholder added to Healthcare App",
        preview:
            "Dr. Lee has been added as a collaborator on the Healthcare booking app project.\n\nRole\n- Medical advisor for the appointment booking flow.\n- Reviewer for patient intake forms and consent screens.\n\nSuggested preparation\n- Prepare a short walkthrough of the current flow.\n- Collect any open questions from the team ahead of the next review.",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 60),
        type: "client",
        unread: false,
        client: "Healthcare Inc",
        project: "Healthcare booking app",
    },
]

type InboxFilters = {
    types: InboxItemType[]
    clients: string[]
}

function getTypeIcon(type: InboxItemType) {
    if (type === "comment") return ChatCircleDots
    if (type === "task") return CheckCircle
    if (type === "client") return EnvelopeSimple
    if (type === "project") return Bell
    return Bell
}

function getTypeLabel(type: InboxItemType): string {
    if (type === "comment") return "Comment"
    if (type === "task") return "Task"
    if (type === "client") return "Client"
    if (type === "project") return "Project"
    return "Update"
}

export function InboxPage() {
    const [tab, setTab] = useState<"all" | "unread" | "mentions">("all")
    const [selectedId, setSelectedId] = useState<string | null>(MOCK_INBOX_ITEMS[0]?.id ?? null)
    const [filters, setFilters] = useState<InboxFilters>({ types: [], clients: [] })
    const [inboxItems, setInboxItems] = useState<InboxItem[]>(MOCK_INBOX_ITEMS)

    const availableClients = useMemo(
        () =>
            Array.from(new Set(inboxItems.map((item) => item.client).filter((value): value is string => !!value))),
        [inboxItems],
    )

    const items = useMemo(() => {
        let list = [...inboxItems]

        if (tab === "unread") {
            list = list.filter((item) => item.unread)
        }

        if (filters.types.length) {
            list = list.filter((item) => filters.types.includes(item.type))
        }

        if (filters.clients.length) {
            list = list.filter((item) => item.client && filters.clients.includes(item.client))
        }
        return list
    }, [tab, filters, inboxItems])

    useEffect(() => {
        if (!items.length) {
            setSelectedId(null)
            return
        }

        if (!selectedId || !items.some((item) => item.id === selectedId)) {
            setSelectedId(items[0].id)
        }
    }, [items, selectedId])

    const selected = useMemo(() => {
        if (!selectedId) return null
        return inboxItems.find((item) => item.id === selectedId) ?? null
    }, [selectedId, inboxItems])

    const markItemAsRead = (id: string) => {
        setInboxItems((prev) => prev.map((item) => (item.id === id ? { ...item, unread: false } : item)))
    }

    const markAllAsRead = () => {
        setInboxItems((prev) => prev.map((item) => (item.unread ? { ...item, unread: false } : item)))
    }

    return (
        <div className="flex flex-1 flex-col min-h-0 bg-background mx-2 my-2 border border-border rounded-lg min-w-0">
            <header className="flex flex-col border-b border-border/40">
                <div className="flex items-center justify-between px-4 py-3 border-b border-border/70">
                    <div className="flex items-center gap-3">
                        <SidebarTrigger className="h-8 w-8 rounded-lg hover:bg-accent text-muted-foreground" />
                        <p className="text-base font-medium text-foreground">Inbox</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button size="sm" variant="ghost" onClick={markAllAsRead}>
                            Mark all as read
                        </Button>
                    </div>
                </div>

                <div className="flex flex-col gap-2 px-4 pb-3 pt-3 md:flex-row md:items-center md:justify-between">
                    <div className="flex w-full md:w-auto md:justify-start">
                        <InboxFilterPopover
                            filters={filters}
                            availableClients={availableClients}
                            onChange={setFilters}
                        />
                    </div>

                    <Tabs value={tab} onValueChange={(value) => setTab(value as typeof tab)} className="w-full md:w-auto">
                        <TabsList className="inline-flex w-full justify-between rounded-full border border-border/50 bg-muted px-1 py-0.5 text-xs md:w-auto md:justify-start h-8">
                            <TabsTrigger
                                value="all"
                                className="h-7 rounded-full px-3 text-xs data-[state=active]:bg-background data-[state=active]:text-foreground"
                            >
                                All
                            </TabsTrigger>
                            <TabsTrigger
                                value="unread"
                                className="h-7 rounded-full px-3 text-xs data-[state=active]:bg-background data-[state=active]:text-foreground"
                            >
                                Unread
                            </TabsTrigger>
                        </TabsList>
                    </Tabs>
                </div>
            </header>

            <div className="flex-1 min-h-0 flex flex-col md:flex-row">
                <div className="border-b border-border/40 md:border-b-0 md:border-r md:w-[320px] lg:w-[360px] flex flex-col min-h-0">
                    <div className="flex-1 min-h-0 overflow-y-auto px-2 py-2 space-y-1">
                        {items.map((item) => {
                            const Icon = getTypeIcon(item.type)
                            const isSelected = item.id === selectedId

                            return (
                                <button
                                    key={item.id}
                                    type="button"
                                    onClick={() => {
                                        setSelectedId(item.id)
                                        if (item.unread) {
                                            markItemAsRead(item.id)
                                        }
                                    }}
                                    className={cn(
                                        "flex w-full items-start gap-3 rounded-lg px-3 py-2 text-left transition-colors",
                                        isSelected ? "bg-muted" : "hover:bg-muted/70",
                                    )}
                                >
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-muted-foreground">
                                        <Icon className="h-4 w-4" />
                                    </div>
                                    <div className="flex flex-1 flex-col gap-1 min-w-0">
                                        <div className="flex items-start justify-between gap-2">
                                            <p className="text-xs font-medium text-foreground truncate">
                                                {item.title}
                                            </p>
                                            <span className="shrink-0 text-[10px] text-muted-foreground">
                                                {formatDistanceToNow(item.createdAt, { addSuffix: true })}
                                            </span>
                                        </div>
                                        <p className="text-[11px] text-muted-foreground line-clamp-2">
                                            {item.preview}
                                        </p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <Badge variant="outline" className="h-5 rounded-full px-2 text-[10px] font-medium">
                                                {getTypeLabel(item.type)}
                                            </Badge>
                                            {item.client && (
                                                <span className="text-[10px] text-muted-foreground truncate">
                                                    {item.client}
                                                </span>
                                            )}
                                            {item.project && (
                                                <span className="text-[10px] text-muted-foreground truncate">
                                                    {item.project}
                                                </span>
                                            )}
                                            {item.unread && (
                                                <span className="ml-auto h-2 w-2 rounded-full bg-emerald-500" />
                                            )}
                                        </div>
                                    </div>
                                </button>
                            )
                        })}
                    </div>
                </div>

                <div className="flex-1 min-h-0 flex flex-col">
                    {selected ? (
                        <div className="flex-1 min-h-0 flex flex-col px-4 py-4 gap-4">
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex items-start gap-3">
                                    <Avatar className="h-9 w-9">
                                        <AvatarFallback className="text-xs font-semibold">
                                            {selected.client?.[0] ?? selected.project?.[0] ?? "N"}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex flex-col gap-1 min-w-0">
                                        <p className="text-sm font-medium text-foreground">
                                            {selected.title}
                                        </p>
                                        <div className="flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
                                            {selected.client && <span>{selected.client}</span>}
                                            {selected.project && (
                                                <span className="flex items-center gap-1">
                                                    <span className="h-1 w-1 rounded-full bg-muted-foreground" />
                                                    <span>{selected.project}</span>
                                                </span>
                                            )}
                                            <span className="flex items-center gap-1">
                                                <span className="h-1 w-1 rounded-full bg-muted-foreground" />
                                                <span>{formatDistanceToNow(selected.createdAt, { addSuffix: true })}</span>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Badge variant={selected.unread ? "default" : "outline"} className="h-6 rounded-full px-2 text-[10px]">
                                        {selected.unread ? "Unread" : "Read"}
                                    </Badge>
                                </div>
                            </div>

                            <div className="flex-1 min-h-0 rounded-xl border border-border bg-card/80 px-4 py-3">
                                <div className="text-sm leading-relaxed text-foreground">
                                    {selected.preview.split("\n").map((line, index, allLines) => {
                                        const trimmed = line.trim()

                                        if (!trimmed) {
                                            return <div key={index} className="h-2" />
                                        }

                                        const next = (allLines[index + 1] ?? "").trim()
                                        const isBullet = trimmed.startsWith("-")
                                        const isHeading = !isBullet && next.startsWith("-")

                                        if (isHeading) {
                                            return (
                                                <p key={index} className="mt-2 text-xs font-semibold text-foreground">
                                                    {trimmed}
                                                </p>
                                            )
                                        }

                                        if (isBullet) {
                                            const content = trimmed.replace(/^[-]+\s*/, "")
                                            return (
                                                <p key={index} className="pl-4 text-[13px]">
                                                    <span className="mr-1">•</span>
                                                    {content}
                                                </p>
                                            )
                                        }

                                        return (
                                            <p key={index} className="text-[13px]">
                                                {trimmed}
                                            </p>
                                        )
                                    })}
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-2">
                                <div className="flex items-center gap-2">
                                    <Button size="sm" variant="outline">
                                        Open related work
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => {
                                            if (selected.unread) {
                                                markItemAsRead(selected.id)
                                            }
                                        }}
                                    >
                                        Mark as read
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1 min-h-0 flex items-center justify-center text-xs text-muted-foreground">
                            Select an item from the list to see details.
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
