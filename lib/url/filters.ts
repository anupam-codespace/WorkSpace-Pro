import type { FilterChip } from "@/lib/view-options"

function normalizeKey(key: string): string {
    const s = key.trim().toLowerCase()
    if (s.startsWith("status")) return "status"
    if (s.startsWith("priority")) return "priority"
    if (s.startsWith("tag")) return "tags"
    if (s.startsWith("member") || s === "pic") return "members"
    return s
}

export function chipsToParams(chips: FilterChip[]): URLSearchParams {
    const params = new URLSearchParams()
    const buckets: Record<string, string[]> = {}

    for (const chip of chips) {
        const key = normalizeKey(chip.key)
        buckets[key] = buckets[key] || []
        buckets[key].push(chip.value)
    }

    for (const [key, values] of Object.entries(buckets)) {
        if (values.length) {
            params.set(key, values.join(","))
        }
    }

    return params
}

export function paramsToChips(params: URLSearchParams): FilterChip[] {
    const chips: FilterChip[] = []

    const add = (key: string, values?: string | null) => {
        if (!values) return

        values.split(",").forEach((value) => {
            if (!value) return
            chips.push({ key, value })
        })
    }

    add("Status", params.get("status"))
    add("Priority", params.get("priority"))
    add("Tag", params.get("tags"))
    add("Member", params.get("members"))

    return chips
}
