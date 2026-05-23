"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuth } from "@/client/context/AuthContext";
import { FREE_BOOKMARK_LIMIT } from "@/lib/subscription";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BadgeCheck,
  CalendarDays,
  CreditCard,
  FileText,
  ShieldCheck,
  Crown,
  Loader2,
  ExternalLink,
  Info,
  Zap,
  RefreshCw,
  Download,
} from "lucide-react";

const formatDate = (value) => {
  if (!value) {
    return "Not available";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "Not available";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
};

const BillingDashboard = () => {
  const router = useRouter();
  const { user, token, authFetch, hasProAccess, planKey } = useAuth();
  const [isOpeningPortal, setIsOpeningPortal] = useState(false);
  const canOpenPortal = Boolean(user?.dodoCustomerId || user?.dodoSubscriptionId);
  const renewalDate = hasProAccess && user?.subscriptionEnds ? formatDate(user.subscriptionEnds) : "No active renewal";
  const planLabel = hasProAccess ? (planKey || "pro").toUpperCase() : "FREE";
  const primaryActionLabel = canOpenPortal
    ? isOpeningPortal
      ? "Opening Portal..."
      : "Open Billing Portal"
    : isOpeningPortal
      ? "Starting Checkout..."
      : "Upgrade to Pro";

  const summaryCards = useMemo(
    () => [
      {
        label: "Plan",
        value: planLabel,
        icon: Crown,
        color: "text-[#ff6900]",
        borderColor: "border-[#ff6900]/20",
        bgColor: "bg-[#ff6900]/5",
      },
      {
        label: "Status",
        value: hasProAccess ? "Active" : "Free",
        icon: BadgeCheck,
        color: hasProAccess ? "text-emerald-500" : "text-muted-foreground",
        borderColor: hasProAccess ? "border-emerald-500/20" : "border-muted-foreground/20",
        bgColor: hasProAccess ? "bg-emerald-500/5" : "bg-muted/50",
      },
      {
        label: "Renewal",
        value: renewalDate,
        icon: CalendarDays,
        color: "text-blue-500",
        borderColor: "border-blue-500/20",
        bgColor: "bg-blue-500/5",
      },
    ],
    [hasProAccess, planLabel, renewalDate]
  );

  const portalActions = [
    {
      icon: CreditCard,
      title: "Payment methods",
      description: "Update cards and review saved payment methods.",
    },
    {
      icon: FileText,
      title: "Billing history",
      description: "View invoices, receipts, and payment records.",
    },
    {
      icon: BadgeCheck,
      title: "Plan changes",
      description: "Upgrade or downgrade your current plan.",
    },
    {
      icon: ShieldCheck,
      title: "Secure access",
      description: "Time-bound sessions tied to your account.",
    },
  ];

  const planFeatures = hasProAccess
    ? [
        {
          name: "Everything in Free",
          description: "All free features included with your Pro plan.",
          icon: BadgeCheck,
          color: "text-emerald-500",
          borderColor: "border-emerald-500/20",
          bgColor: "bg-emerald-500/5",
        },
        {
          name: "Unlimited Bookmarks",
          description: "Save as many bookmarks as you need, no limits.",
          icon: Crown,
          color: "text-[#ff6900]",
          borderColor: "border-[#ff6900]/20",
          bgColor: "bg-[#ff6900]/5",
        },
        {
          name: "Unlimited Collections",
          description: "Organize bookmarks into unlimited collections.",
          icon: FileText,
          color: "text-blue-500",
          borderColor: "border-blue-500/20",
          bgColor: "bg-blue-500/5",
        },
        {
          name: "Bookmark & Collection Shareability",
          description: "Share bookmarks and collections with anyone.",
          icon: ExternalLink,
          color: "text-amber-500",
          borderColor: "border-amber-500/20",
          bgColor: "bg-amber-500/5",
        },
        {
          name: "Multi Import & Export Options",
          description: "Import and export in multiple formats.",
          icon: CreditCard,
          color: "text-teal-500",
          borderColor: "border-teal-500/20",
          bgColor: "bg-teal-500/5",
        },
      ]
    : [
        {
          name: `Up to ${FREE_BOOKMARK_LIMIT} Bookmarks`,
          description: `Save and organize up to ${FREE_BOOKMARK_LIMIT} bookmarks.`,
          icon: BadgeCheck,
          color: "text-[#ff6900]",
          borderColor: "border-[#ff6900]/20",
          bgColor: "bg-[#ff6900]/5",
        },
        {
          name: "Up to 2 Collections",
          description: "Organize bookmarks into up to 2 collections.",
          icon: FileText,
          color: "text-blue-500",
          borderColor: "border-blue-500/20",
          bgColor: "bg-blue-500/5",
        },
        {
          name: "Cross-Browser Sync",
          description: "Access your bookmarks across all devices.",
          icon: RefreshCw,
          color: "text-emerald-500",
          borderColor: "border-emerald-500/20",
          bgColor: "bg-emerald-500/5",
        },
        {
          name: "Single Import Option (No Export)",
          description: "Import your existing bookmarks easily.",
          icon: Download,
          color: "text-amber-500",
          borderColor: "border-amber-500/20",
          bgColor: "bg-amber-500/5",
        },
      ];

  const handleUpgrade = async () => {
    if (!token) {
      router.push("/login");
      return;
    }

    setIsOpeningPortal(true);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          returnUrl: `/dashboard/${user.id}/billing?billing=success`,
        }),
      });

      const data = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(data?.message || data?.error || "Failed to create checkout session.");
      }

      if (!data?.url) {
        throw new Error("Checkout session URL was not returned.");
      }

      localStorage.setItem(
        "markify_pending_subscription",
        JSON.stringify({
          startedAt: Date.now(),
          source: "billing-page",
        })
      );

      window.location.href = data.url;
    } catch (error) {
      console.error(error);
      toast.error(error?.message || "Unable to start checkout.");
    } finally {
      setIsOpeningPortal(false);
    }
  };

  const handleOpenPortal = async () => {
    if (!token) {
      router.push("/login");
      return;
    }

    setIsOpeningPortal(true);
    try {
      const response = await authFetch("/api/billing/portal", {
        method: "POST",
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.message || "Unable to open billing portal.");
      }

      if (!data?.url) {
        throw new Error("Billing portal link was not returned.");
      }

      window.location.href = data.url;
    } catch (error) {
      console.error(error);
      toast.error(error?.message || "Unable to open billing portal.");
    } finally {
      setIsOpeningPortal(false);
    }
  };

  return (
    <main className="max-w-full min-w-0 overflow-x-hidden px-6 py-4">
      {/* Page header */}
      <div className="mb-4">
        <h1 className="text-2xl font-bold tracking-tight">Billing</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Manage your plan, payment methods, and invoices.
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
        {summaryCards.map((item) => {
          const Icon = item.icon;
          return (
            <Card key={item.label} className="bg-background border dark:border-white/10 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col gap-0.5">
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">{item.label}</p>
                    <p className="text-xl font-bold leading-none tracking-tight">{item.value}</p>
                  </div>
                  <div className={`w-10 h-10 rounded-lg border ${item.borderColor} ${item.bgColor} flex items-center justify-center shrink-0`}>
                    <Icon className={`h-4 w-4 ${item.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Main content grid */}
      <div className="grid gap-3 xl:grid-cols-2">
        {/* Current plan details */}
        <Card className="bg-background border dark:border-white/10 shadow-sm flex flex-col py-0!">
          <CardHeader className="pb-2 pt-4 px-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <CardTitle className="text-lg">Current plan</CardTitle>
                <CardDescription className="text-xs mt-0.5">
                  {hasProAccess
                    ? "You have full access to all Pro features."
                    : "Upgrade to unlock the full Markify experience."}
                </CardDescription>
              </div>
              <Badge
                variant={hasProAccess ? "default" : "outline"}
                className={
                  hasProAccess
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                    : ""
                }
              >
                {hasProAccess ? "Active" : "Free"}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="flex-1 flex flex-col gap-2 px-4 pb-4">
            {/* Account details */}
            <div className="rounded-lg border dark:border-white/10 p-3">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">
                Account details
              </p>
              <div className="divide-y dark:divide-white/5">
                <div className="flex items-center justify-between py-2 first:pt-0">
                  <span className="text-sm text-muted-foreground">Name</span>
                  <span className="text-sm font-medium">{user?.name || "—"}</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-muted-foreground">Email</span>
                  <span className="text-sm font-medium truncate max-w-[60%] text-right">{user?.email || "—"}</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-muted-foreground">Plan</span>
                  <div className="flex items-center gap-1.5">
                    <Badge variant="outline" className="text-xs px-2 py-0">
                      {planLabel}
                    </Badge>
                    {hasProAccess && (
                      <span className="text-xs text-emerald-500">● Active</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-between py-2 last:pb-0">
                  <span className="text-sm text-muted-foreground">{hasProAccess ? "Renews on" : "Billing"}</span>
                  <span className="text-sm font-medium">{hasProAccess ? renewalDate : "No active plan"}</span>
                </div>
              </div>
            </div>

            {/* Plan features as detailed rows */}
            <div className="rounded-lg border dark:border-white/10 p-3 flex-1">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">
                What&apos;s included
              </p>
              <div className="space-y-3">
                {planFeatures.map((feature) => (
                  <div key={feature.name} className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg border ${feature.borderColor} ${feature.bgColor} flex items-center justify-center shrink-0`}>
                      <feature.icon className={`h-4 w-4 ${feature.color}`} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium leading-tight">{feature.name}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Contextual banner */}
            {hasProAccess ? (
              <div className="flex items-center gap-3 rounded-lg border dark:border-white/10 bg-muted/30 p-3">
                <Info className="h-4 w-4 text-muted-foreground shrink-0" />
                <p className="text-xs text-muted-foreground">
                  Next billing: <span className="font-medium text-foreground">{renewalDate}</span>. Manage or cancel anytime via the portal.
                </p>
              </div>
            ) : (
              <div className="flex items-center gap-3 rounded-lg border border-[#ff6900]/20 bg-[#ff6900]/5 p-3">
                <Zap className="h-4 w-4 text-[#ff6900] shrink-0" />
                <p className="text-xs text-muted-foreground">
                  <span className="font-medium text-foreground">Upgrade to Pro</span> for unlimited bookmarks, sharing, exports, and more.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Manage subscription */}
        <Card className="bg-background border dark:border-white/10 shadow-sm flex flex-col py-0!">
          <CardHeader className="pb-2 pt-4 px-4">
            <CardTitle className="text-lg">Manage subscription</CardTitle>
            <CardDescription className="text-xs mt-0.5">
              Open Dodo&apos;s customer portal to update payment or review invoices.
            </CardDescription>
          </CardHeader>

          <CardContent className="flex-1 flex flex-col gap-2 px-4 pb-4">
            <Button
              onClick={canOpenPortal ? handleOpenPortal : handleUpgrade}
              disabled={isOpeningPortal}
              className="w-full bg-[#ff6900] hover:bg-[#e55f00] text-white"
              size="lg"
            >
              {isOpeningPortal && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {primaryActionLabel}
              {!isOpeningPortal && <ExternalLink className="h-4 w-4 ml-2" />}
            </Button>

            <div className="rounded-lg border dark:border-white/10 bg-muted/30 p-3">
              <div className="flex items-center gap-2 text-sm font-medium">
                <BadgeCheck className="h-4 w-4 text-emerald-500" />
                Automatic sync
              </div>
              <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                Subscription state is synced automatically after portal changes.
              </p>
            </div>

            {/* Portal actions */}
            <div className="flex-1">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide px-2 mb-1">
                Portal actions
              </p>
              {portalActions.map((item) => (
                <div
                  key={item.title}
                  className="flex items-center gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-muted/50 group cursor-default"
                >
                  <div className="w-8 h-8 rounded-lg border dark:border-white/10 bg-background flex items-center justify-center shrink-0 group-hover:border-[#ff6900]/20 group-hover:bg-[#ff6900]/5 transition-colors">
                    <item.icon className="h-4 w-4 text-muted-foreground group-hover:text-[#ff6900] transition-colors" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium leading-none">{item.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 truncate">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Help footer */}
            <div className="rounded-lg border dark:border-white/10 bg-muted/30 p-3 mt-auto">
              <p className="text-xs text-muted-foreground leading-relaxed">
                Need help? Contact <span className="font-medium text-foreground">support@markify.tech</span> for billing questions.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default BillingDashboard;
