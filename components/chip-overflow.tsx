"use client"

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { FilterChip } from "@/components/filter-chip"
import { cn } from "@/lib/utils"

export type Chip = { key: string; value: string }

interface ChipOverflowProps {
  chips: Chip[]
  onRemove: (key: string, value: string) => void
  maxVisible?: number
  className?: string
}

export function ChipOverflow({ chips, onRemove, maxVisible = 4, className }: ChipOverflowProps) {
  const visible = chips.slice(0, Math.max(0, maxVisible))
  const hidden = chips.slice(Math.max(0, maxVisible))

  if (chips.length === 0) return null

  return (
    <div className={cn("flex items-center gap-2 overflow-hidden", className)}>
      {visible.map((chip) => (
        <FilterChip
          key={`${chip.key}-${chip.value}`}
          label={`${chip.key}: ${chip.value}`}
          onRemove={() => onRemove(chip.key, chip.value)}
        />
      ))}

      {hidden.length > 0 && (
        <Popover>
          <PopoverTrigger asChild>
            <button className="flex h-8 items-center rounded-full border border-border/60 bg-background px-3 text-sm text-muted-foreground hover:bg-accent">
              +{hidden.length} more
            </button>
          </PopoverTrigger>
          <PopoverContent align="start" className="w-64 p-2 rounded-xl">
            <div className="flex max-h-64 flex-col gap-2 overflow-auto pr-1">
              {hidden.map((chip) => (
                <div key={`${chip.key}-${chip.value}`} className="shrink-0">
                  <FilterChip
                    label={`${chip.key}: ${chip.value}`}
                    onRemove={() => onRemove(chip.key, chip.value)}
                  />
                </div>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      )}
    </div>
  )
}
