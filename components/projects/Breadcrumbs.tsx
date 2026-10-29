import Link from "next/link"
import { CaretRight } from "@phosphor-icons/react/dist/ssr"

export type BreadcrumbItem = {
  label: string
  href?: string
}

type BreadcrumbsProps = {
  items: BreadcrumbItem[]
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-muted-foreground">
      {items.map((item, idx) => {
        const isLast = idx === items.length - 1
        const content = item.href && !isLast ? (
          <Link href={item.href} className="hover:text-foreground transition-colors">
            {item.label}
          </Link>
        ) : (
          <span className={isLast ? "text-foreground" : ""}>{item.label}</span>
        )

        return (
          <div key={`${item.label}-${idx}`} className="flex items-center gap-2">
            {idx > 0 ? <CaretRight className="h-4 w-4 text-muted-foreground" /> : null}
            {content}
          </div>
        )
      })}
    </nav>
  )
}
