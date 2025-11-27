import * as React from "react"
import { InfoIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import {
  Card,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

type MetricCardProps = {
  title: string
  value: number | null
  justification?: string
}

export function MetricCard({ title, value, justification }: MetricCardProps) {
  const hasValue = typeof value === "number"
  const normalized = hasValue ? Math.min(Math.max(value, 0), 100) : 0
  const displayValue = hasValue ? `${value.toFixed(1)}%` : "—"

  // Distinct colors for each metric - works in light and dark mode
  const colorMap: Record<string, { bg: string; border: string; text: string; progress: string; progressBg: string }> = {
    "Accuracy": { 
      bg: "bg-sky-50 dark:bg-sky-950/40", 
      border: "border-sky-200 dark:border-sky-800", 
      text: "text-sky-600 dark:text-sky-400", 
      progress: "bg-sky-500 dark:bg-sky-400",
      progressBg: "bg-sky-100 dark:bg-sky-900/50"
    },
    "Evaluation Score": { 
      bg: "bg-violet-50 dark:bg-violet-950/40", 
      border: "border-violet-200 dark:border-violet-800", 
      text: "text-violet-600 dark:text-violet-400", 
      progress: "bg-violet-500 dark:bg-violet-400",
      progressBg: "bg-violet-100 dark:bg-violet-900/50"
    },
    "Semantic Accuracy": { 
      bg: "bg-teal-50 dark:bg-teal-950/40", 
      border: "border-teal-200 dark:border-teal-800", 
      text: "text-teal-600 dark:text-teal-400", 
      progress: "bg-teal-500 dark:bg-teal-400",
      progressBg: "bg-teal-100 dark:bg-teal-900/50"
    },
    "Faithfulness": { 
      bg: "bg-orange-50 dark:bg-orange-950/40", 
      border: "border-orange-200 dark:border-orange-800", 
      text: "text-orange-600 dark:text-orange-400", 
      progress: "bg-orange-500 dark:bg-orange-400",
      progressBg: "bg-orange-100 dark:bg-orange-900/50"
    },
    "Answer Relevancy": { 
      bg: "bg-pink-50 dark:bg-pink-950/40", 
      border: "border-pink-200 dark:border-pink-800", 
      text: "text-pink-600 dark:text-pink-400", 
      progress: "bg-pink-500 dark:bg-pink-400",
      progressBg: "bg-pink-100 dark:bg-pink-900/50"
    },
    "Content Precision": { 
      bg: "bg-emerald-50 dark:bg-emerald-950/40", 
      border: "border-emerald-200 dark:border-emerald-800", 
      text: "text-emerald-600 dark:text-emerald-400", 
      progress: "bg-emerald-500 dark:bg-emerald-400",
      progressBg: "bg-emerald-100 dark:bg-emerald-900/50"
    },
    "Context Recall": { 
      bg: "bg-fuchsia-50 dark:bg-fuchsia-950/40", 
      border: "border-fuchsia-200 dark:border-fuchsia-800", 
      text: "text-fuchsia-600 dark:text-fuchsia-400", 
      progress: "bg-fuchsia-500 dark:bg-fuchsia-400",
      progressBg: "bg-fuchsia-100 dark:bg-fuchsia-900/50"
    },
  }

  const colors = colorMap[title] || { 
    bg: "bg-slate-50 dark:bg-slate-900/40", 
    border: "border-slate-200 dark:border-slate-700", 
    text: "text-slate-600 dark:text-slate-400", 
    progress: "bg-slate-500 dark:bg-slate-400",
    progressBg: "bg-slate-100 dark:bg-slate-800/50"
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Card className={cn("border transition-all duration-300 hover:shadow-md cursor-default", colors.bg, colors.border)}>
          <CardContent className="p-4 space-y-2">
            <div className="flex items-center justify-between gap-1">
              <CardTitle className="text-xs font-semibold text-muted-foreground leading-tight">{title}</CardTitle>
              {justification && (
                <InfoIcon className="h-3 w-3 text-muted-foreground/50 shrink-0" />
              )}
            </div>
            <CardDescription className={cn("text-2xl font-bold", colors.text)}>{displayValue}</CardDescription>
            <div className={cn("relative h-1.5 w-full overflow-hidden rounded-full", colors.progressBg)}>
              <div
                className={cn("h-full rounded-full transition-all duration-500", colors.progress)}
                style={{ width: `${normalized}%` }}
              />
            </div>
          </CardContent>
        </Card>
      </TooltipTrigger>
      {justification && (
        <TooltipContent side="bottom" className="max-w-xs text-xs leading-relaxed">
          <p className="font-medium mb-1">{title}</p>
          {justification}
        </TooltipContent>
      )}
    </Tooltip>
  )
}
