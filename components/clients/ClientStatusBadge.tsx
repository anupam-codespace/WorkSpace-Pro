import { Badge } from "@/components/ui/badge"
import type { ClientStatus } from "@/lib/data/clients"

function statusLabel(status: ClientStatus): string {
    if (status === "prospect") return "Prospect"
    if (status === "active") return "Active"
    if (status === "on_hold") return "On hold"
    if (status === "completed") return "Completed"
    return "Archived"
}

export function ClientStatusBadge({ status }: { status: ClientStatus }) {
    const label = statusLabel(status)

    let badgeClasses = "bg-muted text-muted-foreground border-transparent dark:bg-muted/30 dark:text-muted-foreground"
    let dotClasses = "bg-zinc-900 dark:bg-zinc-300"

    if (status === "active") {
        badgeClasses = "bg-teal-50 text-teal-700 border-transparent dark:bg-teal-500/15 dark:text-teal-100"
        dotClasses = "bg-teal-600 dark:bg-teal-300"
    } else if (status === "on_hold") {
        badgeClasses = "bg-amber-50 text-amber-700 border-transparent dark:bg-amber-500/15 dark:text-amber-100"
        dotClasses = "bg-amber-600 dark:bg-amber-300"
    } else if (status === "completed") {
        badgeClasses = "bg-blue-50 text-blue-700 border-transparent dark:bg-blue-500/15 dark:text-blue-100"
        dotClasses = "bg-blue-600 dark:bg-blue-300"
    } else if (status === "archived") {
        badgeClasses = "bg-slate-100 text-slate-600 border-transparent dark:bg-slate-600/30 dark:text-slate-200"
        dotClasses = "bg-slate-500 dark:bg-slate-300"
    }

    return (
        <Badge
            variant="outline"
            className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium capitalize ${badgeClasses}`}
        >
            <span className={`h-1.5 w-1.5 rounded-full ${dotClasses}`} />
            {label}
        </Badge>
    )
}
