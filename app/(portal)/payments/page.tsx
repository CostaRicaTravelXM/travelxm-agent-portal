"use client"

import { useState } from "react";
import {
  ArrowUpRight,
  CheckCircle2,
  Clock,
  Copy,
  DollarSign,
  ExternalLink,
  Link2,
  RefreshCw,
  TrendingUp,
  XCircle,
  Zap,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { PAYMENTS_DASHBOARD } from "@/lib/data";
import { formatUtc } from "@/lib/format";

const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  succeeded: { label: "Paid", className: "bg-green-100 text-green-800 border-green-200" },
  requires_payment_method: { label: "Failed", className: "bg-red-100 text-red-800 border-red-200" },
  canceled: { label: "Cancelled", className: "bg-gray-100 text-gray-800 border-gray-200" },
  processing: { label: "Processing", className: "bg-blue-100 text-blue-800 border-blue-200" },
  requires_action: { label: "Pending", className: "bg-yellow-100 text-yellow-800 border-yellow-200" },
  requires_confirmation: { label: "Pending", className: "bg-yellow-100 text-yellow-800 border-yellow-200" },
};

function fmtCents(cents: number, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
    maximumFractionDigits: 2,
  }).format(cents / 100);
}

function StatCard({
  title,
  value,
  sub,
  icon: Icon,
  accent,
}: {
  title: string;
  value: string;
  sub?: string;
  icon: React.ElementType;
  accent?: string;
}) {
  return (
    <Card className="border border-border/50 shadow-sm">
      <CardContent className="p-4 md:p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground mb-1">{title}</p>
            <p className="text-xl md:text-2xl font-bold tracking-tight">{value}</p>
            {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
          </div>
          <div className={`p-2.5 rounded-xl ${accent ?? "bg-primary/10"}`}>
            <Icon className={`h-5 w-5 ${accent ? "text-white" : "text-primary"}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function PaymentsPage() {
  const { toast } = useToast();
  const dashboard = PAYMENTS_DASHBOARD;
  const currency = dashboard.currency;

  const [bookingId, setBookingId] = useState("");
  const [linkCurrency, setLinkCurrency] = useState("usd");
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);

  const handleGenerate = () => {
    const id = parseInt(bookingId, 10);
    if (!id || id <= 0) {
      toast({ title: "Enter a valid booking ID", variant: "destructive" });
      return;
    }
    // Static demo: produce a placeholder checkout URL locally
    setGeneratedLink(
      `https://checkout.stripe.com/c/pay/demo_${linkCurrency}_booking_${id}`
    );
    toast({
      title: "Payment link generated",
      description: "Share it with your customer to collect payment.",
    });
  };

  const copyLink = async () => {
    if (!generatedLink) return;
    await navigator.clipboard.writeText(generatedLink);
    toast({ title: "Copied to clipboard" });
  };

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Payments</h1>
          <p className="text-muted-foreground mt-1">
            Stripe-powered payment links, balances, and transaction history
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="gap-2"
          onClick={() => toast({ title: "Refreshed", description: "Balances are up to date" })}
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </div>

      {/* Balance Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <StatCard
          title="Available Balance"
          value={fmtCents(dashboard.availableBalance, currency)}
          sub="Ready to pay out"
          icon={DollarSign}
          accent="bg-[#137547]"
        />
        <StatCard
          title="Total Collected"
          value={fmtCents(dashboard.totalCollected, currency)}
          sub="All time"
          icon={TrendingUp}
        />
        <StatCard
          title="Successful"
          value={String(dashboard.successfulPayments)}
          sub="Payments"
          icon={CheckCircle2}
        />
        <StatCard
          title="Failed"
          value={String(dashboard.failedPayments)}
          sub="Payments"
          icon={XCircle}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Payment Link Generator */}
        <Card className="lg:col-span-2 border border-border/50 shadow-sm">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-[#EFB224]/10">
                <Link2 className="h-5 w-5 text-[#EFB224]" />
              </div>
              <div>
                <CardTitle className="text-base">Payment Link Generator</CardTitle>
                <CardDescription>Send a Stripe checkout link to a customer</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="bookingId">Booking ID</Label>
              <Input
                id="bookingId"
                type="number"
                placeholder="e.g. 1041"
                value={bookingId}
                onChange={(e) => setBookingId(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Currency</Label>
              <Select value={linkCurrency} onValueChange={setLinkCurrency}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="usd">USD – US Dollar</SelectItem>
                  <SelectItem value="inr">INR – Indian Rupee</SelectItem>
                  <SelectItem value="eur">EUR – Euro</SelectItem>
                  <SelectItem value="gbp">GBP – British Pound</SelectItem>
                  <SelectItem value="aed">AED – UAE Dirham</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button
              className="w-full h-11 bg-[#137547] hover:bg-[#137547]/90 text-white"
              onClick={handleGenerate}
            >
              <Zap className="h-4 w-4 mr-2" /> Generate Payment Link
            </Button>

            {generatedLink && (
              <div className="mt-4 p-4 rounded-xl bg-green-50 border border-green-200 space-y-3">
                <p className="text-sm font-medium text-green-800 flex items-center gap-1">
                  <CheckCircle2 className="h-4 w-4" /> Link ready
                </p>
                <p className="text-xs text-green-700 break-all font-mono bg-white/80 p-2 rounded border border-green-100">
                  {generatedLink}
                </p>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1 gap-1 text-xs" onClick={copyLink}>
                    <Copy className="h-3 w-3" /> Copy
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 gap-1 text-xs"
                    onClick={() =>
                      toast({
                        title: "Demo link",
                        description: "Checkout opens once Stripe is connected.",
                      })
                    }
                  >
                    <ExternalLink className="h-3 w-3" /> Open
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card className="lg:col-span-3 border border-border/50 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Recent Transactions</CardTitle>
            <CardDescription>Latest payment intents from Stripe</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {dashboard.recentTransactions.map((tx) => {
                const cfg = STATUS_CONFIG[tx.status] ?? {
                  label: tx.status,
                  className: "bg-gray-100 text-gray-700",
                };
                return (
                  <div
                    key={tx.id}
                    className="flex items-center justify-between p-3 rounded-lg border border-border/50 hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="p-1.5 rounded-lg bg-muted shrink-0">
                        <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground" />
                      </div>
                      <div className="min-w-0">
                        {/* Addresses have no spaces to wrap on — break them
                         * over two lines rather than clipping the domain. */}
                        <p className="text-sm font-medium break-all line-clamp-2 md:line-clamp-1">
                          {tx.customerEmail || tx.description || tx.id}
                        </p>
                        <p className="text-xs text-muted-foreground tabular">
                          {formatUtc(tx.createdAt, "MMM d, h:mm a")}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0 ml-3">
                      <Badge
                        variant="outline"
                        className={`text-xs hidden sm:inline-flex ${cfg.className}`}
                      >
                        {cfg.label}
                      </Badge>
                      <span className="text-sm font-semibold tabular-nums">
                        {fmtCents(tx.amount, tx.currency)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending balance banner */}
      {dashboard.pendingBalance > 0 && (
        <Card className="border border-[#EFB224]/30 bg-[#EFB224]/5 shadow-sm">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-2.5 rounded-xl bg-[#EFB224]/20">
              <Clock className="h-5 w-5 text-[#EFB224]" />
            </div>
            <div>
              <p className="text-sm font-semibold">
                {fmtCents(dashboard.pendingBalance, currency)} pending
              </p>
              <p className="text-xs text-muted-foreground">
                Funds in transit — typically available within 2 business days
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
