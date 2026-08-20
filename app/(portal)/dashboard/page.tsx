"use client"

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { formatUtc } from "@/lib/format";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Award,
  CalendarCheck,
  ChevronRight,
  Clock,
  DollarSign,
  MapPin,
  Plane,
  Plus,
  Star,
  TrendingDown,
  TrendingUp,
  Users,
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
import {
  ACTIVITY,
  BOOKINGS,
  BOOKING_FUNNEL,
  DASHBOARD_SUMMARY,
  FEATURED_PACKAGES,
  REVENUE_BY_MONTH,
  SPARKLINES,
} from "@/lib/data";
import { getImageUrl, PHOTOS } from "@/lib/portal-images";

const TIME_RANGES = ["7D", "30D", "90D", "1Y"];

const STATUS_STYLES: Record<string, string> = {
  confirmed: "bg-emerald-50 text-emerald-700 border-emerald-200",
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  active: "bg-blue-50 text-blue-700 border-blue-200",
  completed: "bg-purple-50 text-purple-700 border-purple-200",
  cancelled: "bg-red-50 text-red-700 border-red-200",
  traveling: "bg-sky-50 text-sky-700 border-sky-200",
};

function SparkBar({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data);
  return (
    <div className="flex items-end gap-0.5 h-8">
      {data.slice(-8).map((v, i) => (
        <div
          key={i}
          className="flex-1 rounded-sm transition-all"
          style={{
            height: `${(v / max) * 100}%`,
            backgroundColor: color,
            opacity: i === data.length - 1 ? 1 : 0.4 + (i / data.length) * 0.5,
          }}
        />
      ))}
    </div>
  );
}

function MetricCard({
  title,
  value,
  delta,
  deltaLabel,
  sparkKey,
  color,
  icon: Icon,
}: {
  title: string;
  value: string;
  delta?: number;
  deltaLabel?: string;
  sparkKey: keyof typeof SPARKLINES;
  color: string;
  icon: React.ElementType;
}) {
  const positive = (delta ?? 0) >= 0;
  return (
    <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
      <Card className="border border-[#E8E2D5] shadow-sm bg-white rounded-2xl overflow-hidden">
        <CardContent className="p-4 md:p-5">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-xs font-medium text-[#6B6B6B] uppercase tracking-wider mb-1">
                {title}
              </p>
              <p className="text-xl md:text-2xl font-bold text-[#1A1A1A] tracking-tight tabular">{value}</p>
            </div>
            <div className="p-2.5 rounded-xl" style={{ backgroundColor: color + "15" }}>
              <Icon className="h-5 w-5" style={{ color }} />
            </div>
          </div>
          <SparkBar data={SPARKLINES[sparkKey]} color={color} />
          {delta !== undefined && (
            <div className="flex items-center gap-1.5 mt-3">
              {positive ? (
                <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
              ) : (
                <TrendingDown className="h-3.5 w-3.5 text-red-500" />
              )}
              <span
                className={`text-xs font-medium ${positive ? "text-emerald-600" : "text-red-600"}`}
              >
                {positive ? "+" : ""}
                {delta}%
              </span>
              <span className="text-xs text-[#6B6B6B]">{deltaLabel}</span>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function DashboardPage() {
  const [timeRange, setTimeRange] = useState("1Y");
  const summary = DASHBOARD_SUMMARY;
  const recentBookings = BOOKINGS.slice(0, 5);

  return (
    <div className="space-y-6 pb-8">
      {/* Hero greeting */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl h-44"
      >
        <Image
          src={getImageUrl("dashboard-hero", PHOTOS.rainforestValley.src)}
          alt={PHOTOS.rainforestValley.alt}
          fill
          sizes="(max-width: 767px) 100vw, (max-width: 1279px) calc(100vw - 240px), 1216px"
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A4D5C]/90 via-[#0A4D5C]/60 to-transparent" />
        <div className="relative z-10 flex flex-col justify-between h-full p-5 md:p-8">
          <div>
            <p className="text-[#D4A24C] text-xs font-medium tracking-widest uppercase mb-1">
              Good morning
            </p>
            <h1 className="font-serif text-2xl md:text-3xl text-white font-light">
              Welcome back, Agent
            </h1>
          </div>
          <div className="flex items-end justify-between">
            <div>
              <p className="text-white/70 text-sm mb-0.5">Your earnings this month</p>
              <p className="text-white text-2xl font-bold font-serif tabular">
                ${summary.totalCommissions.toLocaleString("en-US")}
              </p>
            </div>
            <Link href="/bookings/new">
              <Button
                size="sm"
                className="bg-[#E87A5D] hover:bg-[#E87A5D]/90 text-white rounded-xl gap-2"
              >
                <Plus className="h-4 w-4" /> New Booking
              </Button>
            </Link>
          </div>
        </div>
      </motion.div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <MetricCard
          title="Total Revenue"
          value={`$${summary.totalRevenue.toLocaleString("en-US")}`}
          delta={18.2}
          deltaLabel="vs last month"
          sparkKey="revenue"
          color="#0A4D5C"
          icon={DollarSign}
        />
        <MetricCard
          title="Active Bookings"
          value={String(summary.activeBookings)}
          delta={7.4}
          deltaLabel="vs last month"
          sparkKey="bookings"
          color="#E87A5D"
          icon={CalendarCheck}
        />
        <MetricCard
          title="Commission Earned"
          value={`$${summary.totalCommissions.toLocaleString("en-US")}`}
          delta={24.1}
          deltaLabel="vs last month"
          sparkKey="commissions"
          color="#D4A24C"
          icon={TrendingUp}
        />
        <MetricCard
          title="Total Customers"
          value={String(summary.totalCustomers)}
          delta={5.3}
          deltaLabel="new this month"
          sparkKey="customers"
          color="#7C5CFC"
          icon={Users}
        />
      </div>

      {/* Revenue Chart + Agent Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <Card className="lg:col-span-2 border border-[#E8E2D5] shadow-sm bg-white rounded-2xl">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <CardTitle className="text-[#1A1A1A] font-serif font-medium text-lg">
                  Revenue Overview
                </CardTitle>
                <CardDescription className="text-[#6B6B6B] text-sm">
                  Monthly booking revenue trend
                </CardDescription>
              </div>
              <div className="flex gap-1 bg-[#F4EFE6] p-1 rounded-lg" role="group" aria-label="Time range">
                {TIME_RANGES.map((r) => (
                  <button
                    key={r}
                    onClick={() => setTimeRange(r)}
                    aria-pressed={timeRange === r}
                    className={`px-3 min-h-[44px] md:min-h-[28px] min-w-[44px] md:min-w-0 text-xs font-medium rounded-md transition-all ${
                      timeRange === r
                        ? "bg-white text-[#0A4D5C] shadow-sm"
                        : "text-[#6B6B6B] hover:text-[#1A1A1A]"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={REVENUE_BY_MONTH} margin={{ top: 5, right: 5, bottom: 0, left: 0 }}>
                <defs>
                  <linearGradient id="revGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0A4D5C" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#0A4D5C" stopOpacity={0} />
                  </linearGradient>
                </defs>
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
                  tickFormatter={(v) => `$${v / 1000}k`}
                  width={45}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: 12,
                    border: "1px solid #E8E2D5",
                    boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
                    backgroundColor: "white",
                  }}
                  formatter={(v) => [`$${Number(v).toLocaleString("en-US")}`, "Revenue"]}
                  labelStyle={{ color: "#1A1A1A", fontWeight: 600 }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#0A4D5C"
                  strokeWidth={2.5}
                  fill="url(#revGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Agent Tier / Booking Funnel */}
        <div className="space-y-4">
          <Card className="border border-[#E8E2D5] shadow-sm bg-gradient-to-br from-[#0A4D5C] to-[#0a3d4d] text-white rounded-2xl">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-white/60 text-xs uppercase tracking-wider mb-1">Agent Tier</p>
                  <p className="font-serif text-2xl font-light">{summary.agentTier}</p>
                </div>
                <div className="bg-[#D4A24C]/20 p-2.5 rounded-xl border border-[#D4A24C]/30">
                  <Award className="h-5 w-5 text-[#D4A24C]" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-white/70">
                  <span>Progress to Platinum</span>
                  <span className="text-[#D4A24C] font-medium">64%</span>
                </div>
                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-[#D4A24C] rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: "64%" }}
                    transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
                  />
                </div>
              </div>
              <p className="text-white/50 text-xs mt-3 leading-relaxed">
                $3,600 more to unlock Platinum Tier benefits.
              </p>
            </CardContent>
          </Card>

          <Card className="border border-[#E8E2D5] shadow-sm bg-white rounded-2xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-[#1A1A1A]">Booking Funnel</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2.5">
              {BOOKING_FUNNEL.map((item) => (
                <div key={item.label} className="flex items-center gap-3">
                  <span className="text-xs text-[#6B6B6B] w-16 shrink-0">{item.label}</span>
                  <div className="flex-1 bg-[#F4EFE6] rounded-full h-2 overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ backgroundColor: item.color }}
                      initial={{ width: 0 }}
                      animate={{ width: `${item.pct}%` }}
                      transition={{ duration: 1, delay: 0.3 }}
                    />
                  </div>
                  <span className="text-xs font-semibold text-[#1A1A1A] w-8 text-right shrink-0">
                    {item.value}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Featured Packages carousel */}
      <Card className="border border-[#E8E2D5] shadow-sm bg-white rounded-2xl overflow-hidden">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-[#1A1A1A] font-serif font-medium text-lg">
              Featured Packages
            </CardTitle>
            <Link href="/packages">
              <Button
                variant="ghost"
                size="sm"
                className="text-[#E87A5D] hover:text-[#E87A5D] hover:bg-[#E87A5D]/5 gap-1 text-sm"
              >
                View all <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide">
            {FEATURED_PACKAGES.map((pkg, i) => (
              <motion.div
                key={pkg.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -4 }}
                className="shrink-0 w-52 rounded-xl overflow-hidden border border-[#E8E2D5] bg-white shadow-sm cursor-pointer group"
              >
                <Link href={`/packages/${pkg.id}`}>
                  <div className="relative h-32 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={getImageUrl(`dashboard-pkg-${i + 1}`, pkg.imageUrl)}
                      alt={pkg.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute bottom-2 right-2">
                      <span className="bg-[#D4A24C] text-white text-xs font-semibold px-2 py-0.5 rounded-lg">
                        {pkg.commissionRate}%
                      </span>
                    </div>
                  </div>
                  <div className="p-3">
                    <p className="font-medium text-sm text-[#1A1A1A] leading-snug mb-1">{pkg.name}</p>
                    <div className="flex items-center gap-1 text-[#6B6B6B] text-xs mb-2">
                      <MapPin className="h-3 w-3" /> {pkg.destination}
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-bold text-[#0A4D5C] tabular">
                        ${pkg.pricePerPerson.toLocaleString("en-US")}
                      </p>
                      <div className="flex items-center gap-0.5">
                        <Star className="h-3 w-3 fill-[#D4A24C] text-[#D4A24C]" />
                        <span className="text-xs text-[#6B6B6B]">{pkg.rating}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent bookings + Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        <Card className="lg:col-span-3 border border-[#E8E2D5] shadow-sm bg-white rounded-2xl">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-[#1A1A1A] font-serif font-medium text-lg">
                Recent Bookings
              </CardTitle>
              <Link href="/bookings">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-[#E87A5D] hover:text-[#E87A5D] hover:bg-[#E87A5D]/5 gap-1 text-sm"
                >
                  View all <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-1 -mx-3">
              {recentBookings.map((b) => (
                <div
                  key={b.id}
                  className="flex items-center justify-between px-3 py-3 rounded-xl hover:bg-[#FAFAF7] transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-8 w-8 rounded-xl bg-[#0A4D5C]/10 flex items-center justify-center shrink-0">
                      <Plane className="h-3.5 w-3.5 text-[#0A4D5C]" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-[#1A1A1A] truncate">{b.customerName}</p>
                      <p className="text-xs text-[#6B6B6B] truncate">{b.destination}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0 ml-2">
                    <Badge
                      variant="outline"
                      className={`text-xs border hidden sm:inline-flex ${STATUS_STYLES[b.status] ?? "bg-gray-50 text-gray-700"}`}
                    >
                      {b.status}
                    </Badge>
                    <span className="text-sm font-semibold text-[#1A1A1A] tabular">
                      ${b.totalAmount.toLocaleString("en-US")}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="lg:col-span-2 border border-[#E8E2D5] shadow-sm bg-white rounded-2xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-[#1A1A1A] font-serif font-medium text-lg">
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {ACTIVITY.slice(0, 6).map((item) => (
                <div key={item.id} className="flex items-start gap-3">
                  <div className="h-7 w-7 rounded-full bg-[#E87A5D]/10 flex items-center justify-center shrink-0 mt-0.5">
                    <Clock className="h-3 w-3 text-[#E87A5D]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-[#1A1A1A] leading-snug">{item.description}</p>
                    <p className="text-xs text-[#6B6B6B] mt-0.5">
                      {item.customerName} · {formatUtc(item.createdAt, "MMM d, h:mm a")}
                    </p>
                  </div>
                  {item.amount && (
                    <span className="text-xs font-semibold text-emerald-600 shrink-0 mt-0.5 tabular">
                      +${item.amount.toLocaleString("en-US")}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
