"use client"

import { motion } from "framer-motion";
import { formatUtc } from "@/lib/format";
import {
  Award,
  Calendar,
  Clock,
  DollarSign,
  Download,
  TrendingUp,
  Wallet,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { COMMISSION_ANALYTICS, COMMISSIONS } from "@/lib/data";
import type { AgentTier } from "@/lib/types";

const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  pending: { label: "Pending", className: "bg-amber-50 text-amber-700 border-amber-200" },
  earned: { label: "Earned", className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  paid: { label: "Paid", className: "bg-blue-50 text-blue-700 border-blue-200" },
};

const TIER_CONFIG: Record<
  AgentTier,
  { color: string; nextTier: string | null; nextThreshold: number | null; baseThreshold: number; rate: string }
> = {
  Bronze: { color: "#CD7F32", nextTier: "Silver", nextThreshold: 10000, baseThreshold: 0, rate: "8%" },
  Silver: { color: "#A8A9AD", nextTier: "Gold", nextThreshold: 50000, baseThreshold: 10000, rate: "10%" },
  Gold: { color: "#D4A24C", nextTier: "Platinum", nextThreshold: 150000, baseThreshold: 50000, rate: "12%" },
  Platinum: { color: "#E5E4E2", nextTier: null, nextThreshold: null, baseThreshold: 150000, rate: "15%" },
};

export default function CommissionsPage() {
  const { toast } = useToast();
  const analytics = COMMISSION_ANALYTICS;

  const tier = analytics.agentTier;
  const tierCfg = TIER_CONFIG[tier];
  const totalEarned = analytics.totalEarned;
  const progress = tierCfg.nextThreshold
    ? Math.min(
        100,
        ((totalEarned - tierCfg.baseThreshold) / (tierCfg.nextThreshold - tierCfg.baseThreshold)) * 100
      )
    : 100;

  const chartData = analytics.monthlyBreakdown;

  const summaryCards = [
    { label: "Total Earned", value: `$${analytics.totalEarned.toLocaleString("en-US")}`, color: "#0A4D5C", icon: DollarSign, sub: "All time" },
    { label: "Pending Payout", value: `$${analytics.pendingAmount.toLocaleString("en-US")}`, color: "#F59E0B", icon: Clock, sub: "Awaiting processing" },
    { label: "This Month", value: `$${analytics.thisMonth.toLocaleString("en-US")}`, color: "#E87A5D", icon: TrendingUp, sub: "Current month" },
    { label: "Next Payout", value: formatUtc(analytics.nextPayoutDate, "MMM d"), color: "#10B981", icon: Calendar, sub: "Scheduled date" },
  ];

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div>
            <h1 className="font-serif text-3xl text-[#0A4D5C] font-light">Commissions</h1>
            <p className="text-[#6B6B6B] mt-1 text-sm">
              Your earnings, tier progress, and payout history
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="rounded-xl border-[#E8E2D5] gap-2 text-[#6B6B6B]"
            onClick={() => toast({ title: "Statement requested", description: "Your PDF statement will download shortly" })}
          >
            <Download className="h-4 w-4" /> Download Statement
          </Button>
        </div>
      </motion.div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {summaryCards.map(({ label, value, color, icon: Icon, sub }) => (
          <motion.div key={label} whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
            <Card className="border border-[#E8E2D5] bg-white rounded-2xl shadow-sm">
              <CardContent className="p-4 md:p-5">
                <div className="flex items-start justify-between mb-3">
                  <p className="text-xs font-medium text-[#6B6B6B] uppercase tracking-wider">{label}</p>
                  <div className="p-2 rounded-xl" style={{ backgroundColor: color + "15" }}>
                    <Icon className="h-4 w-4" style={{ color }} />
                  </div>
                </div>
                <p className="text-xl md:text-2xl font-bold text-[#1A1A1A]">{value}</p>
                <p className="text-xs text-[#6B6B6B] mt-1">{sub}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Chart + Tier card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <Card className="lg:col-span-2 border border-[#E8E2D5] bg-white rounded-2xl shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="font-serif font-medium text-[#1A1A1A] text-lg">
              Monthly Earnings
            </CardTitle>
            <CardDescription className="text-[#6B6B6B] text-sm">
              Commission earned per month
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={chartData} margin={{ top: 5, right: 5, bottom: 0, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F4EFE6" />
                <XAxis
                  dataKey="month"
                  tick={{ fill: "#6B6B6B", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "#6B6B6B", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `$${v}`}
                  width={50}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: 12,
                    border: "1px solid #E8E2D5",
                    boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
                    backgroundColor: "white",
                  }}
                  formatter={(v) => [`$${Number(v).toLocaleString("en-US")}`, "Earned"]}
                  labelStyle={{ color: "#1A1A1A", fontWeight: 600 }}
                  cursor={{ fill: "#F4EFE6" }}
                />
                <Bar dataKey="amount" radius={[6, 6, 0, 0]}>
                  {chartData.map((entry, i) => (
                    <Cell
                      key={entry.month}
                      fill={i === chartData.length - 1 ? "#E87A5D" : "#0A4D5C"}
                      fillOpacity={i === chartData.length - 1 ? 1 : 0.7}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Tier card */}
        <Card className="border border-[#E8E2D5] bg-gradient-to-br from-[#0A4D5C] to-[#083d49] text-white rounded-2xl shadow-sm">
          <CardContent className="p-6 flex flex-col h-full">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-white/60 text-xs uppercase tracking-wider mb-1">Current Tier</p>
                <p className="font-serif text-3xl font-light" style={{ color: tierCfg.color }}>
                  {tier}
                </p>
              </div>
              <div className="bg-white/10 p-3 rounded-xl border border-white/20">
                <Award className="h-6 w-6" style={{ color: tierCfg.color }} />
              </div>
            </div>

            {tierCfg.nextTier && tierCfg.nextThreshold && (
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-xs">
                  <span className="text-white/70">Progress to {tierCfg.nextTier}</span>
                  <span className="font-semibold" style={{ color: tierCfg.color }}>
                    {Math.round(progress)}%
                  </span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: tierCfg.color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 1.5, delay: 0.4, ease: "easeOut" }}
                  />
                </div>
                <p className="text-white/60 text-xs">
                  ${(tierCfg.nextThreshold - totalEarned).toLocaleString("en-US")} more to unlock{" "}
                  {tierCfg.nextTier}
                </p>
              </div>
            )}

            <div className="mt-auto pt-4 border-t border-white/10 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-white/60">Lifetime earnings</span>
                <span className="font-semibold">${totalEarned.toLocaleString("en-US")}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/60">Commission rate</span>
                <span className="font-semibold" style={{ color: tierCfg.color }}>
                  {tierCfg.rate}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payout History */}
      <Card className="border border-[#E8E2D5] bg-white rounded-2xl shadow-sm overflow-hidden">
        <CardHeader className="pb-0">
          <CardTitle className="font-serif font-medium text-[#1A1A1A] text-lg">
            Payout History
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 mt-4">
          {COMMISSIONS.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-[#6B6B6B]">
              <Wallet className="h-10 w-10 opacity-20 mb-3" />
              <p className="font-serif text-lg text-[#1A1A1A]">No commissions yet</p>
              <p className="text-sm mt-1">Complete your first booking to start earning</p>
            </div>
          ) : (
            <>
              {/* Desktop table */}
              <div className="hidden md:block">
                <div className="grid grid-cols-[auto_1fr_auto_auto_auto] gap-4 px-6 py-3 border-b border-[#E8E2D5] bg-[#FAFAF7]">
                  {["#", "Booking", "Commission", "Status", "Date"].map((h) => (
                    <p key={h} className="text-xs font-semibold text-[#6B6B6B] uppercase tracking-wider">
                      {h}
                    </p>
                  ))}
                </div>
                <div className="divide-y divide-[#F4EFE6]">
                  {COMMISSIONS.map((c, i) => {
                    const sc = STATUS_CONFIG[c.status] ?? STATUS_CONFIG.pending;
                    return (
                      <motion.div
                        key={c.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.04 }}
                        className="grid grid-cols-[auto_1fr_auto_auto_auto] gap-4 items-center px-6 py-4 hover:bg-[#FAFAF7] transition-colors"
                      >
                        <p className="text-xs text-[#6B6B6B] font-mono">#{c.id}</p>
                        <p className="text-sm font-medium text-[#1A1A1A] truncate">
                          Booking #{c.bookingId}
                        </p>
                        <p className="text-sm font-bold text-[#0A4D5C]">
                          ${c.amount.toLocaleString("en-US")}
                        </p>
                        <Badge variant="outline" className={`text-xs border ${sc.className}`}>
                          {sc.label}
                        </Badge>
                        <p className="text-xs text-[#6B6B6B] whitespace-nowrap">
                          {formatUtc(c.earnedAt, "MMM d, yyyy")}
                        </p>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Mobile list */}
              <div className="md:hidden divide-y divide-[#F4EFE6]">
                {COMMISSIONS.map((c) => {
                  const sc = STATUS_CONFIG[c.status] ?? STATUS_CONFIG.pending;
                  return (
                    <div key={c.id} className="p-4 flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-[#1A1A1A]">Booking #{c.bookingId}</p>
                        <p className="text-xs text-[#6B6B6B] mt-0.5">
                          #{c.id} · {formatUtc(c.earnedAt, "MMM d, yyyy")}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-1 shrink-0">
                        <p className="text-sm font-bold text-[#0A4D5C]">
                          ${c.amount.toLocaleString("en-US")}
                        </p>
                        <Badge variant="outline" className={`text-xs border ${sc.className}`}>
                          {sc.label}
                        </Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
