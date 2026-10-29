"use client"

import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import {
  Funnel,
  Spinner,
  Tag,
  User,
  ChartBar,
} from "@phosphor-icons/react/dist/ssr"

export type FilterChip = { key: string; value: string }

type FilterTemp = {
  status: Set<string>
  priority: Set<string>
  tags: Set<string>
  members: Set<string>
}

interface FilterCounts {
  status?: Record<string, number>
  priority?: Record<string, number>
  tags?: Record<string, number>
  members?: Record<string, number>
}

interface FilterPopoverProps {
  initialChips?: FilterChip[]
  onApply: (chips: FilterChip[]) => void
  onClear: () => void
  counts?: FilterCounts
}

export function FilterPopover({ initialChips, onApply, onClear, counts }: FilterPopoverProps) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [active, setActive] = useState<
    "status" | "priority" | "tags" | "members"
  >("status")

  const [temp, setTemp] = useState<FilterTemp>(() => ({
    status: new Set<string>(),
    priority: new Set<string>(),
    tags: new Set<string>(),
    members: new Set<string>(),
  }))

  const [tagSearch, setTagSearch] = useState("")

  // Preselect from chips when opening
  useEffect(() => {
    if (!open) return
    const next: FilterTemp = {
      status: new Set<string>(),
      priority: new Set<string>(),
      tags: new Set<string>(),
      members: new Set<string>(),
    }
    for (const c of initialChips || []) {
      const k = c.key.toLowerCase()
      if (k === "status") next.status.add(c.value.toLowerCase())
      if (k === "priority") next.priority.add(c.value.toLowerCase())
      if (k === "member" || k === "pic" || k === "members") next.members.add(c.value)
      if (k === "tag" || k === "tags") next.tags.add(c.value.toLowerCase())
    }
    setTemp(next)
  }, [open, initialChips])

  const categories = [
    { id: "status", label: "Status", icon: Spinner },
    { id: "priority", label: "Priority", icon: ChartBar },
    { id: "tags", label: "Tags", icon: Tag },
    { id: "members", label: "Members", icon: User },
  ] as const

  const statusOptions = [
    { id: "backlog", label: "Backlog", color: "var(--chart-2)" },
    { id: "planned", label: "Planned", color: "var(--chart-2)" },
    { id: "active", label: "Active", color: "var(--chart-3)" },
    { id: "cancelled", label: "Cancelled", color: "var(--chart-5)" },
    { id: "completed", label: "Completed", color: "var(--chart-3)" },
  ]

  const priorityOptions = [
    { id: "urgent", label: "Urgent" },
    { id: "high", label: "High" },
    { id: "medium", label: "Medium" },
    { id: "low", label: "Low" },
  ]

  const memberOptions = [
    { id: "no-member", label: "No member", avatar: undefined },
    { id: "current", label: "Current member", avatar: undefined, hint: "1 projects" },
    { id: "anupam", label: "anupam", avatar: "/avatar-profile.jpg", hint: "3 projects" },
  ]

  const tagOptions = [
    { id: "frontend", label: "frontend" },
    { id: "backend", label: "backend" },
    { id: "bug", label: "bug" },
    { id: "feature", label: "feature" },
    { id: "urgent", label: "urgent" },
  ]

  const filteredCategories = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return categories
    return categories.filter((c) => c.label.toLowerCase().includes(q))
  }, [categories, query])

  const toggleSet = (set: Set<string>, v: string) => {
    const n = new Set(set)
    if (n.has(v)) n.delete(v)
    else n.add(v)
    return n
  }

  const handleApply = () => {
    const chips: FilterChip[] = []
    temp.status.forEach((v) => chips.push({ key: "Status", value: capitalize(v) }))
    temp.priority.forEach((v) => chips.push({ key: "Priority", value: capitalize(v) }))
    temp.members.forEach((v) => chips.push({ key: "Member", value: v }))
    temp.tags.forEach((v) => chips.push({ key: "Tag", value: v }))
    onApply(chips)
    setOpen(false)
  }

  const handleClear = () => {
    setTemp({
      status: new Set<string>(),
      priority: new Set<string>(),
      tags: new Set<string>(),
      members: new Set<string>(),
    })
    onClear()
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 gap-2 rounded-lg border-border/60 px-3 bg-transparent">
          <Funnel className="h-4 w-4" />
          Filter
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-[720px] p-0 rounded-xl">
        <div className="grid grid-cols-[260px_minmax(0,1fr)]">
          <div className="p-3 border-r border-border/40">
            <div className="px-1 pb-2">
              <Input placeholder="Search..." value={query} onChange={(e) => setQuery(e.target.value)} className="h-8" />
            </div>
            <div className="space-y-1">
              {filteredCategories.map((cat) => (
                <button
                  key={cat.id}
                  className={cn(
                    "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-accent",
                    active === cat.id && "bg-accent"
                  )}
                  onClick={() => setActive(cat.id)}
                >
                  <cat.icon className="h-4 w-4" />
                  <span className="flex-1 text-left">{cat.label}</span>
                  {counts && counts[cat.id as keyof FilterCounts] && (
                    <span className="text-xs text-muted-foreground">
                      {/* Sum of counts for that category if provided */}
                      {Object.values(counts[cat.id as keyof FilterCounts] as Record<string, number>).reduce(
                        (a, b) => a + (typeof b === "number" ? b : 0),
                        0,
                      )}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="p-3">
            {active === "priority" && (
              <div className="grid grid-cols-2 gap-2">
                {priorityOptions.map((opt) => (
                  <label key={opt.id} className="flex items-center gap-2 rounded-lg border p-2 hover:bg-accent cursor-pointer">
                    <Checkbox
                      checked={temp.priority.has(opt.id)}
                      onCheckedChange={() => setTemp((t) => ({ ...t, priority: toggleSet(t.priority, opt.id) }))}
                    />
                    <span className="text-sm flex-1">{opt.label}</span>
                    {counts?.priority?.[opt.id] != null && (
                      <span className="text-xs text-muted-foreground">{counts.priority[opt.id]}</span>
                    )}
                  </label>
                ))}
              </div>
            )}

            {active === "status" && (
              <div className="grid grid-cols-2 gap-2">
                {statusOptions.map((opt) => (
                  <label key={opt.id} className="flex items-center gap-2 rounded-lg border p-2 hover:bg-accent cursor-pointer">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: opt.color }} />
                    <Checkbox
                      checked={temp.status.has(opt.id)}
                      onCheckedChange={() => setTemp((t) => ({ ...t, status: toggleSet(t.status, opt.id) }))}
                    />
                    <span className="text-sm flex-1">{opt.label}</span>
                    {counts?.status?.[opt.id] != null && (
                      <span className="text-xs text-muted-foreground">{counts.status[opt.id]}</span>
                    )}
                  </label>
                ))}
              </div>
            )}

            {active === "members" && (
              <div className="space-y-2">
                {memberOptions.map((m) => (
                  <label key={m.id} className="flex items-center gap-2 rounded-lg border p-2 hover:bg-accent cursor-pointer">
                    <Checkbox
                      checked={temp.members.has(m.label)}
                      onCheckedChange={() => setTemp((t) => ({ ...t, members: toggleSet(t.members, m.label) }))}
                    />
                    <span className="text-sm flex-1">{m.label}</span>
                    {counts?.members?.[m.id] != null ? (
                      <span className="text-xs text-muted-foreground">{counts.members[m.id]}</span>
                    ) : (
                      m.hint && <span className="text-xs text-muted-foreground">{m.hint}</span>
                    )}
                  </label>
                ))}
              </div>
            )}

            {active === "tags" && (
              <div>
                <div className="pb-2">
                  <Input
                    placeholder="Search tags..."
                    value={tagSearch}
                    onChange={(e) => setTagSearch(e.target.value)}
                    className="h-8"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {tagOptions
                    .filter((t) => t.label.toLowerCase().includes(tagSearch.toLowerCase()))
                    .map((t) => (
                      <label key={t.id} className="flex items-center gap-2 rounded-lg border p-2 hover:bg-accent cursor-pointer">
                        <Checkbox
                          checked={temp.tags.has(t.id)}
                          onCheckedChange={() => setTemp((s) => ({ ...s, tags: toggleSet(s.tags, t.id) }))}
                        />
                        <span className="text-sm flex-1">{t.label}</span>
                        {counts?.tags?.[t.id] != null && (
                          <span className="text-xs text-muted-foreground">{counts.tags[t.id]}</span>
                        )}
                      </label>
                    ))}
                </div>
              </div>
            )}

            <div className="mt-3 flex items-center justify-between border-t border-border/40 pt-3">
              <button onClick={handleClear} className="text-sm text-primary hover:underline">
                Clear
              </button>
              <Button size="sm" className="h-8 rounded-lg" onClick={handleApply}>
                Apply
              </Button>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

function capitalize(s: string) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : s
}
