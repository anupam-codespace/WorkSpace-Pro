"use client"

interface TimelineHeaderProps {
  dates: Date[]
}

export function TimelineHeader({ dates }: TimelineHeaderProps) {
  const formatDate = (date: Date) => {
    const dayName = date.toLocaleString("default", { weekday: "short" })
    const dayNum = date.getDate()
    return { dayName, dayNum }
  }

  return (
    <div className="flex border-b bg-muted/30 border-border sticky top-0 z-20">
      {/* Sticky Name Column Header */}
      <div className="w-[280px] lg:w-[320px] shrink-0 px-4 py-2 bg-muted/30 sticky left-0 z-10 border-r border-border/40">
        <span className="text-xs font-medium text-muted-foreground">Name</span>
      </div>

      {/* Scrollable Timeline Date Headers */}
      <div className="flex flex-1 min-w-[600px] relative">
        <div className="flex flex-1">
          {dates.map((date, index) => {
            const { dayName, dayNum } = formatDate(date)
            return (
              <div key={index} className="flex flex-1 flex-col items-center justify-center py-2">
                <span className="text-xs text-muted-foreground">
                  {dayName} {dayNum}
                </span>
              </div>
            )
          })}
        </div>
        <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-muted/30 to-transparent pointer-events-none" />
      </div>
    </div>
  )
}
