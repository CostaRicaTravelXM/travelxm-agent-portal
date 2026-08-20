"use client"

import { useState } from "react";
import {
  Activity,
  Briefcase,
  CheckCircle2,
  RefreshCw,
  Users,
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
import { useToast } from "@/hooks/use-toast";
import { CRM_STATUS } from "@/lib/data";
import { formatUtc } from "@/lib/format";

const STATUS_COLORS: Record<string, string> = {
  synced: "bg-emerald-50 text-emerald-700 border-emerald-200",
  failed: "bg-red-50 text-red-700 border-red-200",
  pending: "bg-amber-50 text-amber-700 border-amber-200",
};

const ENTITY_ICONS: Record<string, React.ReactNode> = {
  customer: <Users className="h-3 w-3" />,
  booking: <Briefcase className="h-3 w-3" />,
};

/** Column tracks for the desktop sync table; header and rows share them. */
const TABLE_GRID =
  "grid-cols-[minmax(0,0.9fr)_minmax(0,0.6fr)_minmax(0,1fr)_auto_auto]";
const TABLE_HEAD = "text-xs font-semibold text-[#6B6B6B] uppercase tracking-wider";

function SyncBadge({ state }: { state: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border font-medium capitalize ${
        STATUS_COLORS[state] ?? "bg-slate-50 text-slate-700 border-slate-200"
      }`}
    >
      {state === "synced" ? (
        <CheckCircle2 className="h-3 w-3" />
      ) : state === "failed" ? (
        <XCircle className="h-3 w-3" />
      ) : null}
      {state}
    </span>
  );
}

function CrmId({ id }: { id: string | null | undefined }) {
  if (!id) return <span className="text-[#6B6B6B]">—</span>;
  return (
    <span className="font-mono text-xs bg-[#F4EFE6] text-[#1A1A1A] px-2 py-0.5 rounded truncate max-w-full inline-block align-bottom">
      {id}
    </span>
  );
}

export default function CrmPage() {
  const { toast } = useToast();
  const status = CRM_STATUS;
  const [syncBanner, setSyncBanner] = useState(false);

  const handleBulkSync = () => {
    setSyncBanner(true);
    toast({
      title: "Sync complete",
      description: `${status.totalSynced} of ${status.records.length} records synced to Zoho CRM`,
    });
  };

  const customerRecords = status.records.filter((r) => r.entityType === "customer");
  const bookingRecords = status.records.filter((r) => r.entityType === "booking");

  const statCards = [
    { label: "Total Synced", value: status.totalSynced, color: "#10B981", icon: CheckCircle2 },
    { label: "Sync Failures", value: status.totalFailed, color: "#EF4444", icon: XCircle },
    { label: "Contacts in CRM", value: customerRecords.length, color: "#0A4D5C", icon: Users },
    { label: "Deals in CRM", value: bookingRecords.length, color: "#D4A24C", icon: Briefcase },
  ];

  return (
    <div className="space-y-6 pb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="font-serif text-3xl text-[#0A4D5C] font-light">Zoho CRM</h1>
            <Badge className="bg-[#E87A5D]/10 text-[#E87A5D] border-[#E87A5D]/20 text-xs">
              Live Sync
            </Badge>
          </div>
          <p className="text-[#6B6B6B] mt-1 text-sm max-w-prose">
            Bidirectional integration — customers, bookings, and activity logs synced to Zoho CRM in
            real time.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <Button
            variant="outline"
            size="sm"
            className="rounded-xl border-[#E8E2D5] gap-2 text-[#6B6B6B] hover:text-[#1A1A1A]"
            onClick={() => toast({ title: "Refreshed", description: "Sync records are up to date" })}
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
          <Button
            size="sm"
            onClick={handleBulkSync}
            className="bg-[#E87A5D] hover:bg-[#E87A5D]/90 text-white rounded-xl gap-2"
          >
            <Zap className="h-4 w-4" />
            Bulk Sync Customers
          </Button>
        </div>
      </div>

      {/* Stat tiles — same pattern as Bookings and Commissions */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {statCards.map(({ label, value, color, icon: Icon }) => (
          <Card key={label} className="border border-[#E8E2D5] bg-white rounded-2xl shadow-sm">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-2.5 rounded-xl shrink-0" style={{ backgroundColor: color + "15" }}>
                <Icon className="h-5 w-5" style={{ color }} />
              </div>
              <div className="min-w-0">
                <p className="text-2xl font-bold text-[#1A1A1A] tabular">{value}</p>
                <p className="text-xs text-[#6B6B6B]">{label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Sync Result Banner */}
      {syncBanner && (
        <Card className="border border-emerald-200 bg-emerald-50 rounded-2xl shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-emerald-800 text-sm">Bulk sync completed</p>
                <p className="text-sm text-emerald-700">
                  {status.totalSynced} synced · {status.totalFailed} failed out of{" "}
                  {status.records.length} records
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Integration Overview */}
      <Card className="border border-[#E8E2D5] bg-white rounded-2xl shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="font-serif font-medium text-[#1A1A1A] text-lg">
            Integration Flows
          </CardTitle>
          <CardDescription className="text-[#6B6B6B] text-sm">
            What gets synced to Zoho CRM automatically
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                icon: <Users className="h-5 w-5 text-[#0A4D5C]" />,
                title: "Customer → Contact",
                desc: "New and updated portal customers sync to Zoho Contacts with full profile data.",
                trigger: "On create / update",
              },
              {
                icon: <Briefcase className="h-5 w-5 text-[#0A4D5C]" />,
                title: "Booking → Deal",
                desc: "Every new booking creates or updates a Zoho Deal with stage mapped to booking status.",
                trigger: "On create",
              },
              {
                icon: <Activity className="h-5 w-5 text-[#0A4D5C]" />,
                title: "Activity Notes",
                desc: "Login events, support tickets, and booking actions logged as CRM Notes on the contact.",
                trigger: "On action",
              },
            ].map((flow) => (
              <div
                key={flow.title}
                className="rounded-xl border border-[#E8E2D5] bg-[#FAFAF7] p-4 flex flex-col gap-2"
              >
                <div className="flex items-center gap-2">
                  {flow.icon}
                  <span className="font-medium text-sm text-[#1A1A1A]">{flow.title}</span>
                </div>
                <p className="text-xs text-[#6B6B6B] leading-relaxed flex-1">{flow.desc}</p>
                <Badge
                  variant="outline"
                  className="text-xs self-start border-[#E8E2D5] text-[#6B6B6B]"
                >
                  {flow.trigger}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Sync Records */}
      <Card className="border border-[#E8E2D5] bg-white rounded-2xl shadow-sm overflow-hidden">
        <CardHeader className="pb-3">
          <CardTitle className="font-serif font-medium text-[#1A1A1A] text-lg">
            Sync Records
          </CardTitle>
          <CardDescription className="text-[#6B6B6B] text-sm">
            All portal entities and their Zoho CRM mapping status
          </CardDescription>
        </CardHeader>

        {/* Desktop table — header and rows share tracks via subgrid */}
        <div className={`hidden lg:grid ${TABLE_GRID} px-6 pb-2`}>
          <div className="col-span-full grid grid-cols-subgrid gap-4 py-3 border-b border-[#E8E2D5]">
            <p className={TABLE_HEAD}>Type</p>
            <p className={TABLE_HEAD}>Portal ID</p>
            <p className={TABLE_HEAD}>CRM ID</p>
            <p className={TABLE_HEAD}>Status</p>
            <p className={TABLE_HEAD}>Last Synced</p>
          </div>
          {status.records.map((record) => (
            <div
              key={`${record.entityType}-${record.portalId}`}
              className="col-span-full grid grid-cols-subgrid gap-4 items-center py-3 border-b border-[#F4EFE6] last:border-0"
            >
              <div className="flex items-center gap-1.5 min-w-0 text-sm text-[#1A1A1A]">
                {ENTITY_ICONS[record.entityType] ?? <Activity className="h-3 w-3" />}
                <span className="capitalize font-medium truncate">{record.entityType}</span>
              </div>
              <span className="text-sm text-[#6B6B6B] tabular">#{record.portalId}</span>
              <span className="min-w-0">
                <CrmId id={record.crmId} />
              </span>
              <SyncBadge state={record.syncStatus} />
              <span className="text-xs text-[#6B6B6B] whitespace-nowrap tabular">
                {formatUtc(record.lastSyncedAt, "MMM d, yyyy, h:mm a")}
              </span>
            </div>
          ))}
        </div>

        {/* Stacked cards below lg — the table would otherwise scroll sideways */}
        <div className="lg:hidden divide-y divide-[#F4EFE6] border-t border-[#E8E2D5]">
          {status.records.map((record) => (
            <div key={`${record.entityType}-${record.portalId}`} className="p-4 space-y-2">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-1.5 min-w-0 text-sm text-[#1A1A1A]">
                  {ENTITY_ICONS[record.entityType] ?? <Activity className="h-3 w-3" />}
                  <span className="capitalize font-medium">{record.entityType}</span>
                  <span className="text-[#6B6B6B] tabular">#{record.portalId}</span>
                </div>
                <SyncBadge state={record.syncStatus} />
              </div>
              <div className="flex items-center justify-between gap-3 text-xs text-[#6B6B6B]">
                <span className="min-w-0 truncate">
                  <CrmId id={record.crmId} />
                </span>
                <span className="whitespace-nowrap tabular shrink-0">
                  {formatUtc(record.lastSyncedAt, "MMM d, h:mm a")}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
