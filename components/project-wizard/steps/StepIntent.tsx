import { Rocket, Flask, Briefcase, Check } from "@phosphor-icons/react/dist/ssr";
import { cn } from "@/lib/utils";
import { ProjectIntent } from "../types";

interface StepIntentProps {
  selected?: ProjectIntent;
  onSelect: (intent: ProjectIntent) => void;
}

export function StepIntent({ selected, onSelect }: StepIntentProps) {
  const options: { id: ProjectIntent; title: string; desc: string; icon: React.ReactNode }[] = [
    {
      id: 'delivery',
      title: 'Delivery',
      desc: 'Shipping a feature, product, or marketing campaign.',
      icon: <Rocket className="h-6 w-6" />,
    },
    {
      id: 'experiment',
      title: 'Experiment',
      desc: 'Testing a hypothesis, research, or prototyping.',
      icon: <Flask className="h-6 w-6" />,
    },
    {
      id: 'internal',
      title: 'Internal',
      desc: 'Operational work, team processes, or documentation.',
      icon: <Briefcase className="h-6 w-6" />,
    },
  ];

  return (
    <div className="flex flex-col space-y-4 p-4 rounded-xl bg-muted">
      <p className="text-xs text-muted-foreground">
        This helps us set up the right structure for you.
      </p>

      <div className="flex flex-col gap-2 rounded-xl bg-muted/40">
        {options.map((option) => {
          const isActive = selected === option.id;

          return (
            <button
              type="button"
              key={option.id}
              onClick={() => onSelect(option.id)}
              className={cn(
                "flex w-full cursor-pointer items-center justify-between gap-4 rounded-xl px-4 py-4 text-left transition-all",
                isActive
                  ? "bg-background"
                  : "bg-background hover:shadow-lg/5"
              )}
            >
              <div className="flex flex-1 items-center gap-4">
                <div
                  className={cn(
                    "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border bg-background text-muted-foreground",
                    isActive && "border-border bg-background text-muted-foreground"
                  )}
                >
                  {option.icon}
                </div>
                <div className="flex flex-col">
                  <h3 className="text-sm font-semibold text-foreground">{option.title}</h3>
                  <p className="text-xs text-muted-foreground sm:text-sm">{option.desc}</p>
                </div>
              </div>

              <div
                className={cn(
                  "ml-2 flex h-4 w-4 items-center justify-center rounded-full border border-input bg-background",
                  isActive && "border-teal-600 bg-teal-600 text-primary-foreground"
                )}
              >
                {isActive && <Check className="h-3 w-3" />}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
