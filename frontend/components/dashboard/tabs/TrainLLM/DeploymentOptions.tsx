"use client"

import * as React from "react"
import { KeyRound } from "lucide-react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { coy as syntaxTheme } from "react-syntax-highlighter/dist/esm/styles/prism"

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"

import { CODE_SNIPPETS } from "./constants"

type DeploymentOptionsProps = {
  deploymentTab: string
  onDeploymentTabChange: (tab: string) => void
  codeSnippets: typeof CODE_SNIPPETS
}

export function DeploymentOptions({ deploymentTab, onDeploymentTabChange, codeSnippets }: DeploymentOptionsProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const snippetEntries = React.useMemo(() => Object.entries(codeSnippets), [codeSnippets])
  const availableTabs = React.useMemo(() => snippetEntries.map(([key]) => key), [snippetEntries])
  const activeTab = availableTabs.includes(deploymentTab) ? deploymentTab : availableTabs[0] ?? ""

  const handleNavigateToApiTab = React.useCallback(() => {
    const params = new URLSearchParams(searchParams?.toString() ?? "")
    params.set("tab", "api-keys")
    const query = params.toString()
    router.push(query ? `${pathname}?${query}` : `${pathname}?tab=api-keys`)
  }, [router, pathname, searchParams])

  return (
    <Card className="border-dashed">
      <CardHeader>
        <CardTitle className="text-base">Deployment Options</CardTitle>
        <CardDescription>Use your API key to query the chatbot via HTTP or the Python SDK.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs value={activeTab} onValueChange={onDeploymentTabChange}>
          <TabsList>
            {snippetEntries.map(([key]) => (
              <TabsTrigger key={key} value={key}>
                {key === "curl" ? "cURL" : key.charAt(0).toUpperCase() + key.slice(1)}
              </TabsTrigger>
            ))}
          </TabsList>
          {snippetEntries.map(([key, snippet]) => (
            <TabsContent key={key} value={key}>
              <div className="relative rounded-md border bg-slate-950/90">
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-2 text-white/80"
                  onClick={() => navigator.clipboard.writeText(snippet.code)}
                >
                  Copy
                </Button>
                <SyntaxHighlighter
                  language={snippet.language}
                  style={syntaxTheme}
                  customStyle={{ background: "transparent", padding: "1rem", margin: 0, fontSize: "0.85rem" }}
                >
                  {snippet.code}
                </SyntaxHighlighter>
              </div>
            </TabsContent>
          ))}
        </Tabs>
        <div>
          <Button className="gap-2" onClick={handleNavigateToApiTab}>
            <KeyRound className="h-4 w-4" /> Create API key
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
