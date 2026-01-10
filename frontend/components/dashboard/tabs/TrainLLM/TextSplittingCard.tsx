import * as React from "react"
import { Loader2, BrainCircuit, Sparkles, InfoIcon } from "lucide-react"

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

import { PreviewDatasetResult } from "./types"

type TextSplittingCardProps = {
  chunkSize: number
  chunkOverlap: number
  setChunkSize: (value: number) => void
  setChunkOverlap: (value: number) => void
  showPreview: boolean
  onPreview: () => void
  isProcessing: boolean
  previewResults: PreviewDatasetResult[]
  previewError: string | null
  disablePreview: boolean
}

export function TextSplittingCard({
  chunkSize,
  chunkOverlap,
  setChunkSize,
  setChunkOverlap,
  showPreview,
  onPreview,
  isProcessing,
  previewResults,
  previewError,
  disablePreview,
}: TextSplittingCardProps) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="space-mono-regular">Configure Text Splitting</CardTitle>
        <CardDescription className="fira-mono-regular">Control how documents are chunked during ingestion.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1">
            <Label htmlFor="chunk-size" className="space-mono-regular">
              Chunk Size
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="ml-2 h-6 w-6 text-muted-foreground">
                    <InfoIcon className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="fira-mono-regular">Number of characters per chunk before splitting.</TooltipContent>
              </Tooltip>
            </Label>
            <Input
              id="chunk-size"
              type="number"
              min={200}
              max={4000}
              value={chunkSize}
              onChange={(event) => setChunkSize(Number(event.target.value))}
              className="fira-mono-regular"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="chunk-overlap" className="space-mono-regular">
              Chunk Overlap
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="ml-2 h-6 w-6 text-muted-foreground">
                    <InfoIcon className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="fira-mono-regular">Amount of overlap to retain context between chunks.</TooltipContent>
              </Tooltip>
            </Label>
            <Input
              id="chunk-overlap"
              type="number"
              min={0}
              max={chunkSize - 1}
              value={chunkOverlap}
              onChange={(event) => setChunkOverlap(Number(event.target.value))}
              className="fira-mono-regular"
            />
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button onClick={onPreview} className="gap-2 space-mono-regular" disabled={disablePreview || isProcessing}>
            {isProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : <BrainCircuit className="h-4 w-4" />}
            {isProcessing ? "Processing..." : "Preview chunks"}
          </Button>
          <Button variant="outline" className="gap-2 space-mono-regular">
            <Sparkles className="h-4 w-4" />
            Save draft
          </Button>
        </div>
        {showPreview && (
          <Alert>
            <AlertTitle className="space-mono-regular">Chunk preview</AlertTitle>
            <AlertDescription className="space-y-2 fira-mono-regular">
              {isProcessing ? (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Generating preview...
                </div>
              ) : (
                <div className="space-y-3">
                  {previewError && <p className="text-sm text-destructive">{previewError}</p>}
                  {previewResults.length > 0 ? (
                    <div className="space-y-4">
                      {previewResults.map((result) => {
                        if (result.status === "error") {
                          return (
                            <div
                              key={result.id}
                              className="rounded-md border border-rose-300/40 bg-rose-50/80 p-4 text-xs text-rose-700"
                            >
                              <div className="flex items-center justify-between gap-2 text-rose-600">
                                <span className="font-semibold space-mono-regular">{result.label}</span>
                                <Badge variant="outline" className="border-rose-300 text-rose-600 fira-mono-regular">
                                  Failed
                                </Badge>
                              </div>
                              <p className="mt-2 fira-mono-regular">{result.error ?? "Unable to process dataset."}</p>
                            </div>
                          )
                        }

                        const topChunks = result.data?.chunks.slice(0, 3) ?? []
                        const remaining = Math.max((result.data?.total_chunks ?? 0) - topChunks.length, 0)

                        return (
                          <div
                            key={result.id}
                            className="rounded-md border border-muted-foreground/20 bg-muted/40 p-4 text-xs leading-relaxed"
                          >
                            <div className="flex flex-wrap items-center justify-between gap-2 text-muted-foreground">
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="fira-mono-regular">{result.source.toUpperCase()}</Badge>
                                <span className="font-semibold text-foreground space-mono-regular">{result.label}</span>
                              </div>
                              <span className="fira-mono-regular">
                                Total chunks: {result.data?.total_chunks ?? 0} • Size {result.data?.chunk_size ?? chunkSize} • Overlap {result.data?.chunk_overlap ?? chunkOverlap}
                              </span>
                            </div>
                            <Accordion type="single" collapsible className="mt-3 space-y-2">
                              {topChunks.map((chunk) => (
                                <AccordionItem key={`${result.id}-${chunk.order}`} value={`${result.id}-${chunk.order}`}>
                                  <AccordionTrigger className="text-sm space-mono-regular">Chunk {chunk.order + 1}</AccordionTrigger>
                                  <AccordionContent>
                                    <p className="text-xs text-muted-foreground fira-mono-regular">{chunk.text}</p>
                                  </AccordionContent>
                                </AccordionItem>
                              ))}
                            </Accordion>
                            {remaining > 0 && (
                              <p className="mt-2 text-xs text-muted-foreground">
                                Showing first 3 chunks. {remaining} additional chunk{remaining > 1 ? "s" : ""} generated.
                              </p>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  ) : !previewError ? (
                    <p className="text-sm text-muted-foreground">
                      Upload a dataset and click preview to generate chunk samples.
                    </p>
                  ) : null}
                </div>
              )}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  )
}
