import type { KeyFeatures } from "@/lib/data/project-details"

type KeyFeaturesColumnsProps = {
  features: KeyFeatures
}

export function KeyFeaturesColumns({ features }: KeyFeaturesColumnsProps) {
  return (
    <section>
      <h2 className="text-base font-semibold text-foreground">Key features</h2>
      <div className="mt-4 grid grid-cols-1 gap-10 md:grid-cols-3">
        <div>
          <div className="text-sm font-semibold text-foreground">P0:</div>
          <ul className="mt-3 space-y-1.5 text-sm text-muted-foreground list-disc pl-5">
            {features.p0.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>

        <div>
          <div className="text-sm font-semibold text-foreground">P1:</div>
          <ul className="mt-3 space-y-1.5 text-sm text-muted-foreground list-disc pl-5">
            {features.p1.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>

        <div>
          <div className="text-sm font-semibold text-foreground">P2:</div>
          <ul className="mt-3 space-y-1.5 text-sm text-muted-foreground list-disc pl-5">
            {features.p2.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
