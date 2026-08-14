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
  synced: "bg-green-100 text-green-800 border-green-200",
  failed: "bg-red-100 text-red-800 border-red-200",
  pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
};

const ENTITY_ICONS: Record<string, React.ReactNode> = {
  customer: <Users className="h-3 w-3" />,
  booking: <Briefcase className="h-3 w-3" />,
};

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

  return (
    <div className="space-y-6 md:space-y-8 pb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-serif text-secondary tracking-tight">Zoho CRM</h1>
            <Badge className="bg-primary/10 text-primary border-primary/20 text-xs">Live Sync</Badge>
          </div>
          <p className="text-muted-foreground">
            Bidirectional integration — customers, bookings, and activity logs synced to Zoho CRM in
            real time.
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="gap-2"
            onClick={() => toast({ title: "Refreshed", description: "Sync records are up to date" })}
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
          <Button onClick={handleBulkSync} className="gap-2">
            <Zap className="h-4 w-4" />
            Bulk Sync Customers
          </Button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Synced</p>
                <p className="text-3xl font-bold text-green-600 mt-1">{status.totalSynced}</p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-green-500 opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Sync Failures</p>
                <p className="text-3xl font-bold text-red-500 mt-1">{status.totalFailed}</p>
              </div>
              <XCircle className="h-8 w-8 text-red-400 opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Contacts in CRM</p>
                <p className="text-3xl font-bold text-secondary mt-1">{customerRecords.length}</p>
              </div>
              <Users className="h-8 w-8 text-secondary opacity-60" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Deals in CRM</p>
                <p className="text-3xl font-bold text-secondary mt-1">{bookingRecords.length}</p>
              </div>
              <Briefcase className="h-8 w-8 text-secondary opacity-60" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sync Result Banner */}
      {syncBanner && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0" />
              <div className="flex-1">
                <p className="font-medium text-green-800">Bulk sync completed</p>
                <p className="text-sm text-green-700">
                  {status.totalSynced} synced · {status.totalFailed} failed out of{" "}
                  {status.records.length} records
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Integration Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-serif">Integration Flows</CardTitle>
          <CardDescription>What gets synced to Zoho CRM automatically</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                icon: <Users className="h-5 w-5 text-primary" />,
                title: "Customer → Contact",
                desc: "New and updated portal customers sync to Zoho Contacts with full profile data.",
                trigger: "On create / update",
              },
              {
                icon: <Briefcase className="h-5 w-5 text-primary" />,
                title: "Booking → Deal",
                desc: "Every new booking creates or updates a Zoho Deal with stage mapped to booking status.",
                trigger: "On create",
              },
              {
                icon: <Activity className="h-5 w-5 text-primary" />,
                title: "Activity Notes",
                desc: "Login events, support tickets, and booking actions logged as CRM Notes on the contact.",
                trigger: "On action",
              },
            ].map((flow) => (
              <div key={flow.title} className="rounded-lg border p-4 space-y-2">
                <div className="flex items-center gap-2">
                  {flow.icon}
                  <span className="font-medium text-sm">{flow.title}</span>
                </div>
                <p className="text-xs text-muted-foreground">{flow.desc}</p>
                <Badge variant="outline" className="text-xs">
                  {flow.trigger}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Sync Records Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-serif">Sync Records</CardTitle>
          <CardDescription>All portal entities and their Zoho CRM mapping status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-muted-foreground text-xs uppercase tracking-wide">
                  <th className="text-left pb-3 pr-4">Type</th>
                  <th className="text-left pb-3 pr-4">Portal ID</th>
                  <th className="text-left pb-3 pr-4">CRM ID</th>
                  <th className="text-left pb-3 pr-4">Status</th>
                  <th className="text-left pb-3">Last Synced</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {status.records.map((record) => (
                  <tr key={`${record.entityType}-${record.portalId}`}>
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-1.5">
                        {ENTITY_ICONS[record.entityType] ?? <Activity className="h-3 w-3" />}
                        <span className="capitalize font-medium">{record.entityType}</span>
                      </div>
                    </td>
                    <td className="py-3 pr-4 text-muted-foreground">#{record.portalId}</td>
                    <td className="py-3 pr-4">
                      {record.crmId ? (
                        <span className="font-mono text-xs bg-slate-100 px-2 py-0.5 rounded">
                          {record.crmId.slice(0, 12)}…
                        </span>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="py-3 pr-4">
                      <span
                        className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border font-medium ${STATUS_COLORS[record.syncStatus] ?? "bg-slate-100 text-slate-700"}`}
                      >
                        {record.syncStatus === "synced" ? (
                          <CheckCircle2 className="h-3 w-3" />
                        ) : record.syncStatus === "failed" ? (
                          <XCircle className="h-3 w-3" />
                        ) : null}
                        {record.syncStatus}
                      </span>
                    </td>
                    <td className="py-3 text-muted-foreground text-xs whitespace-nowrap">
                      {formatUtc(record.lastSyncedAt, "MMM d, yyyy, h:mm a")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
