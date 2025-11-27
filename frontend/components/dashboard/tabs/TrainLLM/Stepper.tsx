import * as React from "react"
import {
  CheckIcon,
  Bot,
  Upload,
  Zap,
  MessageSquare,
  FlaskConical,
  Rocket,
  type LucideIcon
} from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { STEPS } from "./constants"

const STEP_ICONS: LucideIcon[] = [Bot, Upload, Zap, MessageSquare, FlaskConical, Rocket]

type StepperProps = {
  activeStep: number
  onStepChange: (index: number) => void
  maxUnlockedStep?: number
}

export function Stepper({ activeStep, onStepChange, maxUnlockedStep = activeStep }: StepperProps) {
  const progressPercentage = (activeStep / (STEPS.length - 1)) * 100

  return (
    <Card className="relative overflow-hidden border border-border bg-card text-card-foreground shadow-lg">
      <CardHeader className="relative space-y-6 pb-8">
        {/* Header section */}
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-1">
            <CardTitle className="text-2xl font-bold tracking-tight text-foreground">
              RAG Pipeline Builder
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Configure your AI assistant in 6 simple steps
            </CardDescription>
          </div>
          <Badge variant="secondary" className="px-3 py-1">
            Step {activeStep + 1} of {STEPS.length}
          </Badge>
        </div>

        {/* Steps container */}
        <div className="relative grid grid-cols-6 gap-2">
          {STEPS.map((step, index) => {
            const Icon = STEP_ICONS[index]
            const status = index === activeStep ? "active" : index < activeStep ? "completed" : "pending"
            const isLocked = index > maxUnlockedStep
            const isFirst = index === 0
            const isLast = index === STEPS.length - 1

            return (
              <button
                key={step.title}
                type="button"
                className={cn(
                  "group relative flex flex-col items-center gap-3 p-3 rounded-xl transition-all duration-300",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                  !isLocked && "cursor-pointer",
                  isLocked && "cursor-not-allowed"
                )}
                disabled={isLocked}
                aria-disabled={isLocked}
                onClick={() => {
                  if (!isLocked) {
                    onStepChange(index)
                  }
                }}
              >
                {/* Connector lines */}
                {!isFirst && (
                  <div className="absolute top-9 right-1/2 w-1/2 h-0.5 -translate-y-1/2">
                    <div className="absolute inset-0 bg-border" />
                    <div
                      className={cn(
                        "absolute inset-0 bg-primary transition-all duration-300",
                        index <= activeStep ? "w-full" : "w-0"
                      )}
                    />
                  </div>
                )}
                {!isLast && (
                  <div className="absolute top-9 left-1/2 w-1/2 h-0.5 -translate-y-1/2">
                    <div className="absolute inset-0 bg-border" />
                    <div
                      className={cn(
                        "absolute inset-0 bg-primary transition-all duration-300",
                        index < activeStep ? "w-full" : "w-0"
                      )}
                    />
                  </div>
                )}

                {/* Step indicator circle */}
                <div
                  className={cn(
                    "relative z-10 flex h-12 w-12 items-center justify-center rounded-full border-2 transition-all duration-300",
                    status === "active" && [
                      "border-primary bg-primary text-primary-foreground shadow-lg",
                      "ring-4 ring-primary/20"
                    ],
                    status === "completed" && [
                      "border-green-500 bg-green-500 text-white shadow-md"
                    ],
                    status === "pending" && !isLocked && [
                      "border-muted-foreground/30 bg-card text-foreground/70 group-hover:border-primary/50 group-hover:text-foreground"
                    ],
                    status === "pending" && isLocked && [
                      "border-muted bg-muted text-muted-foreground"
                    ]
                  )}
                >
                  {status === "completed" ? (
                    <CheckIcon className="h-5 w-5 text-white" />
                  ) : (
                    <Icon
                      className={cn(
                        "h-5 w-5 transition-colors duration-300",
                        status === "active" && "text-primary-foreground",
                        status === "pending" && "text-foreground/70 group-hover:text-foreground"
                      )}
                    />
                  )}

                  {/* Active step pulse animation */}
                  {status === "active" && (
                    <span className="absolute inset-0 rounded-full animate-ping bg-primary/30" />
                  )}
                </div>

                {/* Step content card */}
                <div
                  className={cn(
                    "w-full rounded-lg px-2 py-2 text-center",
                    status === "active" && "bg-primary/10 border border-primary/30",
                    status === "completed" && "bg-green-500/10 border border-green-500/20",
                    status === "pending" && !isLocked && "bg-secondary/50 border border-transparent",
                    status === "pending" && isLocked && "bg-secondary/20 border border-transparent"
                  )}
                >
                  <span
                    className={cn(
                      "block text-xs font-bold tracking-wide",
                      status === "active" && "text-primary",
                      status === "completed" && "text-green-600",
                      status === "pending" && "text-foreground/70"
                    )}
                  >
                    {step.title}
                  </span>
                  <span
                    className={cn(
                      "block text-[10px] mt-0.5 font-medium",
                      status === "active" && "text-primary/80",
                      status === "completed" && "text-green-600/80",
                      status === "pending" && "text-muted-foreground"
                    )}
                  >
                    {step.subtitle}
                  </span>
                </div>
              </button>
            )
          })}
        </div>

        {/* Progress bar at bottom */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Pipeline Progress</span>
            <span className="font-mono">{Math.round(progressPercentage)}%</span>
          </div>
          <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="absolute inset-y-0 left-0 bg-primary rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercentage}%` }}
            />
            {/* Shimmer effect */}
            <div
              className="absolute inset-y-0 w-20 bg-gradient-to-r from-transparent via-foreground/10 to-transparent animate-shimmer"
            />
          </div>
        </div>
      </CardHeader>
    </Card>
  )
}
