"use client"

import * as React from "react"
import { KeyRound, MessageCircle } from "lucide-react"
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
  botName?: string
  chatbotId?: string
}

export function DeploymentOptions({ deploymentTab, onDeploymentTabChange, codeSnippets, botName, chatbotId }: DeploymentOptionsProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Replace placeholder pipeline_name with actual bot name
  const dynamicSnippets = React.useMemo(() => {
    const safeBotName = botName?.trim() || "your-bot-name"
    const formattedBotId = safeBotName.toLowerCase().replace(/\s+/g, "-")

    return Object.fromEntries(
      Object.entries(codeSnippets).map(([key, snippet]) => [
        key,
        {
          ...snippet,
          code: snippet.code.replace(/support-pro-bot/g, formattedBotId)
        }
      ])
    ) as typeof codeSnippets
  }, [codeSnippets, botName])

  const snippetEntries = React.useMemo(() => Object.entries(dynamicSnippets), [dynamicSnippets])
  const availableTabs = React.useMemo(() => snippetEntries.map(([key]) => key), [snippetEntries])
  const activeTab = availableTabs.includes(deploymentTab) ? deploymentTab : availableTabs[0] ?? ""

  const handleNavigateToApiTab = React.useCallback(() => {
    const params = new URLSearchParams(searchParams?.toString() ?? "")
    params.set("tab", "api-keys")
    const query = params.toString()
    router.push(query ? `${pathname}?${query}` : `${pathname}?tab=api-keys`)
  }, [router, pathname, searchParams])

  const handleNavigateToPlayground = React.useCallback(() => {
    if (chatbotId) {
      router.push(`/dashboard?tab=playground&chatbotId=${chatbotId}`)
    } else {
      router.push("/dashboard?tab=playground")
    }
  }, [router, chatbotId])

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
              <div className="relative rounded-lg border border-border overflow-hidden">
                <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-muted/50">
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    {snippet.language}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 text-xs"
                    onClick={() => navigator.clipboard.writeText(snippet.code)}
                  >
                    Copy
                  </Button>
                </div>
                <div className="bg-slate-950 dark:bg-slate-900">
                  <SyntaxHighlighter
                    language={snippet.language}
                    style={syntaxTheme}
                    showLineNumbers={true}
                    lineNumberStyle={{
                      minWidth: "2.5em",
                      paddingRight: "1em",
                      color: "#64748b",
                      marginRight: "1em",
                      userSelect: "none"
                    }}
                    customStyle={{
                      background: "transparent",
                      padding: "1rem 0.5rem",
                      margin: 0,
                      fontSize: "0.8rem",
                      lineHeight: "1.7",
                      overflow: "visible",
                      whiteSpace: "pre-wrap",
                      wordBreak: "break-word"
                    }}
                    wrapLines={true}
                    wrapLongLines={true}
                  >
                    {snippet.code}
                  </SyntaxHighlighter>
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
        <div className="flex flex-wrap gap-3">
          <Button variant="default" className="gap-2" onClick={handleNavigateToPlayground}>
            <MessageCircle className="h-4 w-4" /> Try in Playground
          </Button>
          <Button variant="outline" className="gap-2" onClick={handleNavigateToApiTab}>
            <KeyRound className="h-4 w-4" /> Create API key
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
