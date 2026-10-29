"use client"

import { X } from "@phosphor-icons/react/dist/ssr"

interface FilterChipProps {
  label: string
  onRemove: () => void
}

export function FilterChip({ label, onRemove }: FilterChipProps) {
  return (
    <div className="flex h-8 items-center gap-1.5 rounded-md border border-border/60 bg-muted px-3 text-sm min-w-0 max-w-[200px]">
      <span className="truncate">{label}</span>
      <button onClick={onRemove} className="ml-0.5 rounded-md p-0.5 hover:bg-accent flex-shrink-0">
        <X className="h-3.5 w-3.5" weight="bold" />
      </button>
    </div>
  )
}
