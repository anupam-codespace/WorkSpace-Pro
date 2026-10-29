import type { ProjectDetails } from "@/lib/data/project-details"

type OutcomesListProps = {
  outcomes: ProjectDetails["outcomes"]
}

export function OutcomesList({ outcomes }: OutcomesListProps) {
  return (
    <section>
      <h2 className="text-base font-semibold text-foreground">Expected Outcomes</h2>
      <ul className="mt-3 space-y-1.5 text-sm text-muted-foreground list-disc pl-5">
        {outcomes.map((item, idx) => (
          <li key={idx}>{item}</li>
        ))}
      </ul>
    </section>
  )
}
