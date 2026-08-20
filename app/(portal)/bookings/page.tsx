"use client"

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { formatUtc } from "@/lib/format";
import {
  CalendarCheck,
  CheckCircle2,
  Clock,
  Download,
  MoreHorizontal,
  Pencil,
  Plane,
  Plus,
  Search,
  Trash2,
  TrendingUp,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { BOOKINGS } from "@/lib/data";
import type { Booking, BookingStatus } from "@/lib/types";

const STATUS_CONFIG: Record<
  string,
  { label: string; className: string; icon: React.ElementType }
> = {
  confirmed: { label: "Confirmed", className: "bg-emerald-50 text-emerald-700 border-emerald-200", icon: CheckCircle2 },
  pending: { label: "Pending", className: "bg-amber-50 text-amber-700 border-amber-200", icon: Clock },
  active: { label: "Active", className: "bg-blue-50 text-blue-700 border-blue-200", icon: Plane },
  completed: { label: "Completed", className: "bg-purple-50 text-purple-700 border-purple-200", icon: CheckCircle2 },
  cancelled: { label: "Cancelled", className: "bg-red-50 text-red-700 border-red-200", icon: XCircle },
  traveling: { label: "Traveling", className: "bg-sky-50 text-sky-700 border-sky-200", icon: Plane },
};

const STATUS_OPTIONS = ["all", "confirmed", "pending", "active", "completed", "cancelled"];

/** Column tracks for the desktop table. Declared once; the header row and every
 *  data row inherit them via `grid-cols-subgrid`. */
const TABLE_GRID =
  "grid-cols-[minmax(0,1.6fr)_minmax(0,1.1fr)_auto_auto_auto_auto]";
const TABLE_HEAD = "text-xs font-semibold text-[#6B6B6B] uppercase tracking-wider";

function StatusSelect({
  booking,
  config,
  onChange,
}: {
  booking: Booking;
  config: (typeof STATUS_CONFIG)[string];
  onChange: (id: number, status: BookingStatus) => void;
}) {
  const StatusIcon = config.icon;
  return (
    <Select
      value={booking.status}
      onValueChange={(val) => onChange(booking.id, val as BookingStatus)}
    >
      <SelectTrigger
        aria-label={`Change status for booking #${booking.id}`}
        className="min-h-[44px] lg:min-h-0 lg:h-auto text-xs rounded-lg w-auto border-transparent bg-transparent p-0 shadow-none"
      >
        <SelectValue>
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-medium ${config.className}`}
          >
            <StatusIcon className="h-3 w-3" /> {config.label}
          </span>
        </SelectValue>
      </SelectTrigger>
      <SelectContent className="rounded-xl">
        {Object.entries(STATUS_CONFIG).map(([val, cfg]) => (
          <SelectItem key={val} value={val} className="text-sm">
            {cfg.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function RowActions({
  bookingId,
  onDelete,
}: {
  bookingId: number;
  onDelete: (id: number) => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label={`Actions for booking #${bookingId}`}
          className="rounded-lg hover:bg-[#F4EFE6] shrink-0"
        >
          <MoreHorizontal className="h-4 w-4 text-[#6B6B6B]" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="rounded-xl border-[#E8E2D5]">
        <DropdownMenuItem className="gap-2 text-sm cursor-pointer">
          <Pencil className="h-3.5 w-3.5" /> Edit booking
        </DropdownMenuItem>
        <DropdownMenuItem
          className="gap-2 text-sm text-red-600 focus:text-red-600 cursor-pointer"
          onClick={() => onDelete(bookingId)}
        >
          <Trash2 className="h-3.5 w-3.5" /> Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>(BOOKINGS);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const { toast } = useToast();

  const filtered = bookings.filter((b) => {
    const matchesStatus = statusFilter === "all" || b.status === statusFilter;
    const matchesSearch =
      !search ||
      b.customerName.toLowerCase().includes(search.toLowerCase()) ||
      b.destination.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleStatusChange = (id: number, status: BookingStatus) => {
    setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status } : b)));
    toast({ title: "Booking updated", description: `Status changed to ${status}` });
  };

  const handleDelete = (id: number) => {
    setBookings((prev) => prev.filter((b) => b.id !== id));
    toast({ title: "Booking deleted" });
  };

  const statCards = [
    { label: "Total Bookings", value: bookings.length, color: "#0A4D5C", icon: CalendarCheck },
    { label: "Confirmed", value: bookings.filter((b) => b.status === "confirmed").length, color: "#10B981", icon: CheckCircle2 },
    { label: "Pending", value: bookings.filter((b) => b.status === "pending").length, color: "#F59E0B", icon: Clock },
    { label: "Completed", value: bookings.filter((b) => b.status === "completed").length, color: "#8B5CF6", icon: TrendingUp },
  ];

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div>
            <h1 className="font-serif text-3xl text-[#0A4D5C] font-light">Bookings</h1>
            <p className="text-[#6B6B6B] mt-1 text-sm">
              {filtered.length} booking{filtered.length !== 1 ? "s" : ""}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              className="rounded-xl border-[#E8E2D5] gap-2 text-[#6B6B6B] hover:text-[#1A1A1A]"
              onClick={() => toast({ title: "Export started", description: "Your CSV will download shortly" })}
            >
              <Download className="h-4 w-4" /> Export CSV
            </Button>
            <Link href="/bookings/new">
              <Button size="sm" className="bg-[#E87A5D] hover:bg-[#E87A5D]/90 text-white rounded-xl gap-2">
                <Plus className="h-4 w-4" /> New Booking
              </Button>
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Stat tiles */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {statCards.map(({ label, value, color, icon: Icon }) => (
          <motion.div key={label} whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
            <Card className="border border-[#E8E2D5] bg-white rounded-2xl shadow-sm">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="p-2.5 rounded-xl shrink-0" style={{ backgroundColor: color + "15" }}>
                  <Icon className="h-5 w-5" style={{ color }} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-[#1A1A1A]">{value}</p>
                  <p className="text-xs text-[#6B6B6B]">{label}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row sm:items-start gap-3">
        <div className="relative max-w-sm w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6B6B6B]" />
          <Input
            placeholder="Search customer, destination…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-11 md:h-10 bg-white border-[#E8E2D5] rounded-xl focus:border-[#D4A24C] focus:ring-[#D4A24C]/20"
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide edge-fade -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap sm:overflow-visible">
          {STATUS_OPTIONS.map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              aria-pressed={statusFilter === s}
              className={`px-4 py-2 min-h-[44px] sm:min-h-[40px] rounded-xl text-sm font-medium whitespace-nowrap capitalize transition-all ${
                statusFilter === s
                  ? "bg-[#0A4D5C] text-white shadow-sm"
                  : "bg-white border border-[#E8E2D5] text-[#6B6B6B] hover:border-[#0A4D5C] hover:text-[#0A4D5C]"
              }`}
            >
              {s === "all" ? "All Status" : s}
            </button>
          ))}
        </div>
      </div>

      {/* Table card */}
      <Card className="border border-[#E8E2D5] shadow-sm bg-white rounded-2xl overflow-hidden">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-[#6B6B6B]">
            <CalendarCheck className="h-12 w-12 opacity-20 mb-4" />
            <h3 className="font-serif text-xl text-[#1A1A1A] mb-2">No bookings found</h3>
            <p className="text-sm mb-4">Create your first booking to get started</p>
            <Link href="/bookings/new">
              <Button size="sm" className="bg-[#E87A5D] hover:bg-[#E87A5D]/90 text-white rounded-xl gap-2">
                <Plus className="h-4 w-4" /> New Booking
              </Button>
            </Link>
          </div>
        ) : (
          <>
            {/* Desktop table. One grid owns the column tracks; the header row
             * and every data row are subgrids of it, so the columns line up by
             * construction instead of each grid sizing `auto` to its own
             * contents. Below lg the same records render as stacked cards. */}
            <div className={`hidden lg:grid ${TABLE_GRID}`}>
              <div className="col-span-full grid grid-cols-subgrid gap-4 px-6 py-3 border-b border-[#E8E2D5] bg-[#FAFAF7]">
                <p className={TABLE_HEAD}>Customer</p>
                <p className={TABLE_HEAD}>Destination</p>
                <p className={TABLE_HEAD}>Dates</p>
                <p className={`${TABLE_HEAD} text-right`}>Amount</p>
                <p className={TABLE_HEAD}>Status</p>
                <p className="sr-only">Actions</p>
              </div>

              {filtered.map((b, i) => {
                const sc = STATUS_CONFIG[b.status] ?? STATUS_CONFIG.pending;
                return (
                  <motion.div
                    key={b.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                    className="col-span-full grid grid-cols-subgrid gap-4 items-center px-6 py-4 border-t border-[#F4EFE6] hover:bg-[#FAFAF7] transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="h-9 w-9 rounded-full bg-[#0A4D5C]/10 flex items-center justify-center shrink-0">
                        <span className="text-[#0A4D5C] text-xs font-bold">
                          {b.customerName.slice(0, 2).toUpperCase()}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-[#1A1A1A] truncate">{b.customerName}</p>
                        <p className="text-xs text-[#6B6B6B] tabular">#{b.id}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 min-w-0">
                      <Plane className="h-3.5 w-3.5 text-[#6B6B6B] shrink-0" />
                      <span className="text-sm text-[#1A1A1A] truncate">{b.destination}</span>
                    </div>

                    <div className="text-xs text-[#6B6B6B] whitespace-nowrap tabular">
                      {formatUtc(b.startDate, "MMM d")} – {formatUtc(b.endDate, "MMM d, yyyy")}
                    </div>

                    <p className="text-sm font-semibold text-[#1A1A1A] whitespace-nowrap tabular text-right">
                      ${b.totalAmount.toLocaleString("en-US")}
                    </p>

                    <StatusSelect booking={b} config={sc} onChange={handleStatusChange} />
                    <RowActions bookingId={b.id} onDelete={handleDelete} />
                  </motion.div>
                );
              })}
            </div>

            {/* Stacked cards below lg */}
            <div className="lg:hidden divide-y divide-[#F4EFE6]">
              {filtered.map((b, i) => {
                const sc = STATUS_CONFIG[b.status] ?? STATUS_CONFIG.pending;
                return (
                  <motion.div
                    key={b.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                    className="p-4 space-y-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="h-10 w-10 rounded-full bg-[#0A4D5C]/10 flex items-center justify-center shrink-0">
                          <span className="text-[#0A4D5C] text-xs font-bold">
                            {b.customerName.slice(0, 2).toUpperCase()}
                          </span>
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-[#1A1A1A] truncate">
                            {b.customerName}
                          </p>
                          <p className="text-xs text-[#6B6B6B] truncate flex items-center gap-1">
                            <Plane className="h-3 w-3 shrink-0" /> {b.destination}
                          </p>
                        </div>
                      </div>
                      <RowActions bookingId={b.id} onDelete={handleDelete} />
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <div className="text-xs text-[#6B6B6B] tabular">
                        {formatUtc(b.startDate, "MMM d")} – {formatUtc(b.endDate, "MMM d, yyyy")}
                      </div>
                      <p className="text-sm font-bold text-[#1A1A1A] tabular">
                        ${b.totalAmount.toLocaleString("en-US")}
                      </p>
                    </div>
                    <div>
                      <StatusSelect booking={b} config={sc} onChange={handleStatusChange} />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </>
        )}
      </Card>
    </div>
  );
}
