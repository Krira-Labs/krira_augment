"use client"

import * as React from "react"
import { useSearchParams } from "next/navigation"
import { BellIcon, Loader2, LogOut, Settings, User, CreditCard, Sparkles, ChevronRight } from "lucide-react"

import { AppSidebar } from "./appSidebar"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

import { useAuth } from "@/contexts/AuthContext"
import { authService, ProfileResponse } from "@/lib/api/auth.service"
import { useToast } from "@/components/ui/use-toast"

import { TrainLLMTab } from "./tabs/train-llm"
import { PlaygroundTab } from "./tabs/playground"
import { UsageAnalyticsTab } from "./tabs/usage-analytics"
import { PreviousPipelinesTab } from "./tabs/previous-chatbots"
import { ApiKeysTab } from "./tabs/api-keys"
import { PricingTab } from "./tabs/pricing"
import { AccountProfileTab } from "./tabs/account-profile"
import { AccountBillingTab } from "./tabs/account-billing"
import { AccountSettingsTab } from "./tabs/account-settings"

type DashboardTab = {
  value: string
  label: string
  description: string
  component: React.ReactNode
  hidden?: boolean
}

const DASHBOARD_TABS: DashboardTab[] = [
  {
    value: "usage-analytics",
    label: "Usage & Analytics",
    description: "Monitor performance metrics and usage trends",
    component: <UsageAnalyticsTab />,
  },
  {
    value: "train-llm",
    label: "RAG Pipeline",
    description: "Create Complete RAG pipelines with ease",
    component: <TrainLLMTab />,
  },
  {
    value: "playground",
    label: "Playground",
    description: "Chat and interact with your deployed chatbots",
    component: <PlaygroundTab />,
  },
  {
    value: "previous-chatbots",
    label: "Deployments",
    description: "Review and manage your existing RAG pipelines",
    component: <PreviousPipelinesTab />,
  },
  {
    value: "api-keys",
    label: "API Keys",
    description: "Manage credentials and permissions",
    component: <ApiKeysTab />,
  },
  {
    value: "pricing",
    label: "Pricing",
    description: "Compare plans and upgrade your account",
    component: <PricingTab />,
  },
  {
    value: "account-profile",
    label: "Profile",
    description: "Manage your personal information and security details",
    component: <AccountProfileTab />,
    hidden: true,
  },
  {
    value: "account-billing",
    label: "Billing",
    description: "Review usage, invoices, and manage your subscription",
    component: <AccountBillingTab />,
    hidden: true,
  },
  {
    value: "account-settings",
    label: "Settings",
    description: "Update notifications and workspace preferences",
    component: <AccountSettingsTab />,
    hidden: true,
  },
]

type UserProfile = NonNullable<ProfileResponse["user"]>

function formatPlanLabel(plan?: string) {
  if (!plan) return "Unknown"
  return plan
    .split("_")
    .map((part) => (part ? part.charAt(0).toUpperCase() + part.slice(1) : part))
    .join(" ")
}

function getInitials(name: string) {
  if (!name) return "--"
  const parts = name.trim().split(/\s+/)
  const [first = "", second = ""] = parts
  const initials = `${first.charAt(0)}${second.charAt(0)}`.toUpperCase()
  return initials || name.charAt(0).toUpperCase()
}

function formatRole(role?: string) {
  if (!role) return "User"
  return role.charAt(0).toUpperCase() + role.slice(1)
}

export default function DashboardLayout() {
  const { user, logout, refreshUser, isLoading: isAuthLoading } = useAuth()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = React.useState<string>("usage-analytics")
  const [isLoggingOut, setIsLoggingOut] = React.useState(false)
  const openProfileTab = React.useCallback(() => setActiveTab("account-profile"), [setActiveTab])
  const openBillingTab = React.useCallback(() => setActiveTab("account-billing"), [setActiveTab])
  const openSettingsTab = React.useCallback(() => setActiveTab("account-settings"), [setActiveTab])

  const searchParams = useSearchParams()

  // Handle URL tab parameter for navigation
  React.useEffect(() => {
    const tabParam = searchParams.get('tab')
    if (tabParam) {
      const validTab = DASHBOARD_TABS.find(tab => tab.value === tabParam)
      if (validTab) {
        setActiveTab(tabParam)
      }
    }
  }, [searchParams])

  // Listen for subscription changes to trigger immediate UI refresh
  React.useEffect(() => {
    const handleSubscriptionChange = async () => {
      console.log('🔄 Subscription changed, refreshing user context...')
      try {
        await refreshUser()
      } catch (error) {
        console.error('Failed to refresh user after subscription change:', error)
      }
    }

    // Listen for custom subscription change events
    window.addEventListener('subscription:changed', handleSubscriptionChange)

    return () => {
      window.removeEventListener('subscription:changed', handleSubscriptionChange)
    }
  }, [refreshUser])

  const handleLogout = React.useCallback(async () => {
    setIsLoggingOut(true)
    try {
      await logout()
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : undefined
      toast({
        title: "Logout failed",
        description: message ?? "Please try again."
      })
    } finally {
      setIsLoggingOut(false)
    }
  }, [logout, toast])

  const displayName = user?.name ?? "User"
  const displayEmail = user?.email ?? ""
  const displayRole = formatRole(user?.role)
  const planLabel = formatPlanLabel(user?.plan)
  const initials = React.useMemo(() => getInitials(displayName), [displayName])

  const activeConfig = React.useMemo(
    () => DASHBOARD_TABS.find((tab) => tab.value === activeTab) ?? DASHBOARD_TABS[0],
    [activeTab]
  )

  return (
    <SidebarProvider>
      <AppSidebar
        activeItem={activeTab}
        onSelect={setActiveTab}
        displayName={displayName}
        displayEmail={displayEmail}
        displayRole={displayRole}
        planLabel={planLabel}
        isLoadingPlan={isAuthLoading}
        initials={initials}
        onLogout={handleLogout}
        isLoggingOut={isLoggingOut}
      />
      <SidebarInset className="bg-background/50">
        <div className="flex min-h-svh flex-col">
          <DashboardHeader
            activeLabel={activeConfig.label}
            activeDescription={activeConfig.description}
            displayName={displayName}
            displayEmail={displayEmail}
            displayRole={displayRole}
            planLabel={planLabel}
            isLoadingPlan={isAuthLoading}
            initials={initials}
            onLogout={handleLogout}
            isLoggingOut={isLoggingOut}
            onOpenProfile={openProfileTab}
            onOpenBilling={openBillingTab}
            onOpenSettings={openSettingsTab}
          />
          <div className="flex-1 space-y-6 p-6 pt-4">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              {/* <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 gap-2">
                {DASHBOARD_TABS.map((tab) => (
                  <TabsTrigger 
                    key={tab.value} 
                    value={tab.value}
                    className="flex flex-col items-start h-auto py-3 px-4"
                  >
                    <span className="font-medium text-sm">{tab.label}</span>
                    <span className="text-xs text-muted-foreground text-left mt-1">
                      {tab.description}
                    </span>
                  </TabsTrigger>
                ))}
              </TabsList> */}

              {DASHBOARD_TABS.map((tab) => (
                <TabsContent key={tab.value} value={tab.value} className="space-y-6">
                  {tab.component}
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

type DashboardHeaderProps = {
  activeLabel: string
  activeDescription: string
  displayName: string
  displayEmail: string
  displayRole: string
  planLabel: string
  isLoadingPlan: boolean
  initials: string
  onLogout: () => void
  isLoggingOut: boolean
  onOpenProfile: () => void
  onOpenBilling: () => void
  onOpenSettings: () => void
}

function DashboardHeader({
  activeLabel,
  activeDescription,
  displayName,
  displayEmail,
  displayRole,
  planLabel,
  isLoadingPlan,
  initials,
  onLogout,
  isLoggingOut,
  onOpenProfile,
  onOpenBilling,
  onOpenSettings,
}: DashboardHeaderProps) {
  return (
    <header className="sticky top-0 z-20 border-b border-border/50 bg-gradient-to-r from-background via-background to-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/80">
      <div className="flex items-center justify-between gap-4 px-6 py-3">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="hidden md:inline-flex h-8 w-8 rounded-lg hover:bg-muted hover:text-foreground transition-colors [&_svg]:text-muted-foreground [&_svg]:hover:text-foreground" />
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 text-sm">
              <span className="font-semibold text-foreground space-mono-regular">{activeLabel}</span>
            </div>
            <ChevronRight className="hidden md:block h-4 w-4 text-muted-foreground/50" />
            <p className="hidden md:block text-sm text-muted-foreground max-w-md truncate fira-mono-regular">
              {activeDescription}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge
            className={cn(
              "hidden sm:inline-flex gap-1.5 px-3 py-1 rounded-full transition-colors",
              "bg-primary/10 text-primary border-primary/20 hover:bg-primary/15"
            )}
            variant="outline"
          >
            {isLoadingPlan ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-3 w-3 animate-spin" />
                <span className="text-xs">Loading...</span>
              </span>
            ) : (
              <>
                <Sparkles className="h-3 w-3" />
                <span className="text-xs font-semibold fira-mono-regular">{planLabel}</span>
              </>
            )}
          </Badge>
          <Button
            variant="ghost"
            size="icon"
            className="relative h-9 w-9 rounded-full hover:bg-muted hover:text-foreground transition-colors text-muted-foreground"
          >
            <BellIcon className="h-4 w-4" />
            <span className="bg-primary absolute right-1.5 top-1.5 flex h-2 w-2 rounded-full ring-2 ring-background" />
          </Button>
          <Separator orientation="vertical" className="h-6 bg-border/50" />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex h-9 items-center gap-2.5 rounded-full px-2 pr-3 transition-all hover:bg-muted hover:text-foreground data-[state=open]:bg-muted data-[state=open]:ring-1 data-[state=open]:ring-border"
              >
                <Avatar className="h-7 w-7 ring-2 ring-primary/20">
                  <AvatarImage src="/images/avatar.png" alt={`${displayName} avatar`} />
                  <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground text-xs font-semibold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden sm:flex flex-col items-start">
                  <span className="text-sm font-medium leading-tight text-foreground space-mono-regular">{displayName}</span>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64 p-2 rounded-xl" sideOffset={8}>
              <div className="flex items-center gap-3 px-2 py-3 rounded-lg bg-muted/50 mb-2">
                <Avatar className="h-10 w-10 ring-2 ring-primary/20">
                  <AvatarImage src="/images/avatar.png" alt={`${displayName} avatar`} />
                  <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground font-semibold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-semibold truncate space-mono-regular">{displayName}</span>
                  {(displayEmail || displayRole) && (
                    <span className="text-xs text-muted-foreground truncate fira-mono-regular">{displayEmail || displayRole}</span>
                  )}
                </div>
              </div>
              <DropdownMenuItem onSelect={onOpenProfile} className="gap-2 py-2.5 rounded-lg cursor-pointer space-mono-regular">
                <User className="h-4 w-4 text-muted-foreground" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={onOpenBilling} className="gap-2 py-2.5 rounded-lg cursor-pointer space-mono-regular">
                <CreditCard className="h-4 w-4 text-muted-foreground" />
                <span>Billing</span>
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={onOpenSettings} className="gap-2 py-2.5 rounded-lg cursor-pointer space-mono-regular">
                <Settings className="h-4 w-4 text-muted-foreground" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="my-2" />
              <DropdownMenuItem
                className="gap-2 py-2.5 rounded-lg cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10"
                onSelect={(event) => {
                  event.preventDefault()
                  if (!isLoggingOut) {
                    onLogout()
                  }
                }}
                disabled={isLoggingOut}
              >
                {isLoggingOut ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <LogOut className="h-4 w-4" />
                )}
                <span className="space-mono-regular">{isLoggingOut ? "Signing out..." : "Sign out"}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}