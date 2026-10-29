import type { ProjectScope } from "@/lib/data/project-details"

type ScopeColumnsProps = {
  scope: ProjectScope
}

export function ScopeColumns({ scope }: ScopeColumnsProps) {
  return (
    <section>
      <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
        <div>
          <h2 className="text-base font-bold text-foreground">In scope</h2>
          <ul className="mt-3 space-y-1.5 text-sm text-muted-foreground list-disc pl-5">
            {scope.inScope.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-base font-semibold text-foreground">Out of scope:</h2>
          <ul className="mt-3 space-y-1.5 text-sm text-muted-foreground list-disc pl-5">
            {scope.outOfScope.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
