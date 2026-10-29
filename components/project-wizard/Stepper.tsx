import { Check } from "@phosphor-icons/react/dist/ssr";
import { cn } from "@/lib/utils";

interface StepperProps {
  currentStep: number;
  steps: string[];
  onStepClick: (step: number) => void;
  maxStepReached: number;
}

export function Stepper({ currentStep, steps, onStepClick, maxStepReached }: StepperProps) {
  return (
    <div className="flex flex-col space-y-3">
      {steps.map((label, index) => {
        const isCompleted = index < currentStep;
        const isCurrent = index === currentStep;
        const isClickable = index <= maxStepReached;

        return (
          <button
            key={index}
            onClick={() => isClickable && onStepClick(index)}
            disabled={!isClickable}
            className={cn(
              "group flex w-full items-center rounded-xl px-3 py-2 text-left transition-colors",
              isClickable ? "cursor-pointer hover:bg-muted/60" : "cursor-default opacity-50",
              isCurrent && "bg-muted"
            )}
          >
            <div
              className={cn(
                "mr-3 flex size-5.5 items-center justify-center rounded-full border text-xs font-semibold transition-all",
                isCompleted
                  ? "border-teal-50 bg-teal-50 text-teal-700"
                  : isCurrent
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-background text-muted-foreground"
              )}
            >
              {isCompleted ? <Check className="h-4 w-4" /> : index + 1}
            </div>
            <div className="flex flex-col">
              <span
                className={cn(
                  "text-sm font-medium transition-colors",
                  isCurrent ? "text-foreground" : "text-muted-foreground",
                  isCompleted && "text-foreground"
                )}
              >
                {label}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
