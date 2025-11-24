"use client";

import * as React from "react";
import type { TooltipProps } from "recharts";
import {
  Line,
  LineChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Loader2 } from "lucide-react";

import { usageService, type UsageSummaryResponse } from "@/lib/api/usage.service";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

type TrendPoint = {
  date: string;
  requests: number;
  tokens: number;
};

const formatStorageValue = (value: number) => {
  if (value <= 0) return "0";
  if (value < 1) return value.toFixed(2);
  if (value < 10) return value.toFixed(1);
  return value.toFixed(0);
};

const formatHistoryDate = (value: string) => {
  try {
    return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(new Date(value));
  } catch {
    return value;
  }
};

const CustomTooltip = ({ active, payload, label }: TooltipProps<string, string>) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-md border bg-popover px-3 py-2 text-xs shadow-sm">
        <p className="font-semibold text-foreground">{label}</p>
        <p className="text-muted-foreground">Requests: {payload[0].value}</p>
      </div>
    );
  }
  return null;
};

export function UsageAnalyticsTab() {
  const [summary, setSummary] = React.useState<UsageSummaryResponse | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const fetchUsage = React.useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await usageService.getSummary();
      setSummary(response);
    } catch (error) {
      console.error('Failed to fetch usage:', error);
      setError('Unable to load usage data. Please try refreshing the page.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load - only run once on mount
  React.useEffect(() => {
    fetchUsage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty deps - run only on mount

  // Listen for subscription changes
  React.useEffect(() => {
    const handleSubscriptionChange = () => {
      console.log('🔄 Usage Analytics: Subscription changed, reloading...');
      fetchUsage();
    };

    window.addEventListener('subscription:changed', handleSubscriptionChange);

    return () => {
      window.removeEventListener('subscription:changed', handleSubscriptionChange);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty deps - listener doesn't need to change

  if (loading) {
    return (
      <div className="flex h-[50vh] w-full items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !summary) {
    return (
      <div className="rounded-xl border border-dashed p-12 text-center">
        <p className="text-sm text-muted-foreground mb-4">
          {error || 'Unable to load usage metrics right now.'}
        </p>
        <button
          onClick={() => fetchUsage()}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  const { plan, usage, trend } = summary;
  const trendData = (trend ?? []) as TrendPoint[];
  const remainingRequests = Math.max(usage.requestLimit - usage.requestsUsed, 0);
  const requestProgress = Math.min((usage.requestsUsed / usage.requestLimit) * 100, 100);

  const todayString = new Date().toDateString();
  const meaningfulHistory = trendData.filter((entry) => {
    const entryDate = new Date(entry.date).toDateString();
    return entry.requests > 0 || entryDate === todayString;
  });

  const displayHistory = meaningfulHistory.slice(-7);

  return (
    <div className="space-y-6 p-1">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Usage & Analytics</h2>
          <p className="text-muted-foreground">Monitor how your workspace consumes the RAG pipeline allowance.</p>
        </div>
        <div className="text-sm text-muted-foreground">Last refreshed {new Date().toLocaleDateString()}</div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-primary/30 bg-primary/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Requests used</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-2xl font-bold">{usage.requestsUsed.toLocaleString()}</div>
            <Progress value={requestProgress} />
            <p className="text-xs text-muted-foreground">{remainingRequests.toLocaleString()} requests remaining</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Pipelines</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{usage.pipelinesUsed}/{usage.pipelineLimit}</div>
            <p className="text-xs text-muted-foreground">RAG pipelines created</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Storage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatStorageValue(usage.storageUsedMb)} MB</div>
            <p className="text-xs text-muted-foreground">of {usage.storageLimitMb} MB per pipeline</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Plan</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-xl font-semibold">{plan.name}</div>
            <Badge className={cn("w-fit", plan.isFree ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700")}>
              {plan.isFree ? "Free" : "Paid"}
            </Badge>
            <p className="text-xs text-muted-foreground">Providers: {plan.providers.join(", ")}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daily request volume</CardTitle>
          <CardDescription>Rolling 14-day window of requests.</CardDescription>
        </CardHeader>
        <CardContent className="h-[320px]">
          {trendData.length === 0 ? (
            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
              No request data yet.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="date" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                <RechartsTooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="requests" stroke="var(--primary)" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Usage history</CardTitle>
          <CardDescription>Exact request counts captured for each day.</CardDescription>
        </CardHeader>
        <CardContent>
          {displayHistory.length === 0 ? (
            <p className="text-sm text-muted-foreground">No request history captured yet.</p>
          ) : (
            <div className="space-y-3">
              {displayHistory
                .slice()
                .reverse()
                .map((entry) => (
                  <div
                    key={entry.date}
                    className="flex items-center justify-between rounded-lg border bg-card/50 px-4 py-3"
                  >
                    <div>
                      <p className="text-sm font-semibold text-foreground">{formatHistoryDate(entry.date)}</p>
                      <p className="text-xs text-muted-foreground">{new Date(entry.date).toLocaleDateString()}</p>
                    </div>
                    <Badge variant="secondary" className="text-sm font-normal">
                      {entry.requests.toLocaleString()} requests
                    </Badge>
                  </div>
                ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
