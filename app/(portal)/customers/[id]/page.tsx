"use client"

import Link from "next/link";
import { useParams } from "next/navigation";
import { formatUtc } from "@/lib/format";
import { ArrowLeft, CalendarDays, Mail, MapPin, Phone, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getBookingsForCustomer, getCustomerById } from "@/lib/data";

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  active: "bg-green-100 text-green-800",
  completed: "bg-purple-100 text-purple-800",
  cancelled: "bg-red-100 text-red-800",
  traveling: "bg-sky-100 text-sky-800",
};

export default function CustomerDetailPage() {
  const params = useParams<{ id: string }>();
  const id = parseInt(params.id, 10);
  const customer = getCustomerById(id);
  const bookings = getBookingsForCustomer(id);

  if (!customer) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground">Customer not found.</p>
        <Link href="/customers">
          <Button variant="outline" className="mt-4">
            Back to Customers
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Link
        href="/customers"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors min-h-[44px]"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Customers
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xl font-bold">
            {customer.firstName[0]}
            {customer.lastName[0]}
          </div>
          <div>
            <h1 className="text-2xl font-serif text-secondary">
              {customer.firstName} {customer.lastName}
            </h1>
            {customer.country && (
              <p className="text-muted-foreground flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" />
                {customer.country}
              </p>
            )}
          </div>
        </div>
        <Link href="/bookings/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" /> New Booking
          </Button>
        </Link>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Contact info */}
        <Card className="border-none shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Contact Info</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Mail className="h-4 w-4" />
              {customer.email}
            </div>
            {customer.phone && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone className="h-4 w-4" />
                {customer.phone}
              </div>
            )}
            {customer.notes && (
              <div className="pt-2 border-t text-muted-foreground">
                <p className="text-xs font-medium uppercase text-foreground mb-1">Notes</p>
                {customer.notes}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Stats */}
        <Card className="border-none shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Booking Stats</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Total Bookings</span>
              <span className="font-bold text-2xl text-primary">{customer.totalBookings}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Total Spent</span>
              <span className="font-bold text-xl text-secondary">
                ${customer.totalSpent.toLocaleString("en-US")}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Member since */}
        <Card className="border-none shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Account</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <p>Member since</p>
            <p className="font-medium text-foreground mt-1">
              {formatUtc(customer.createdAt, "MMMM d, yyyy")}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Booking history */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-secondary">Booking History</h2>
        {bookings.length > 0 ? (
          <>
            {/* Desktop table */}
            <Card className="border-none shadow-sm overflow-hidden hidden md:block">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/30 text-muted-foreground">
                      <th className="px-4 py-3 text-left font-medium">Package</th>
                      <th className="px-4 py-3 text-left font-medium">Dates</th>
                      <th className="px-4 py-3 text-left font-medium">Travelers</th>
                      <th className="px-4 py-3 text-left font-medium">Total</th>
                      <th className="px-4 py-3 text-left font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((b) => (
                      <tr key={b.id} className="border-b hover:bg-muted/20 transition-colors">
                        <td className="px-4 py-3">
                          <div className="font-medium">{b.packageName}</div>
                          <div className="text-xs text-muted-foreground">{b.destination}</div>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {b.startDate} – {b.endDate}
                        </td>
                        <td className="px-4 py-3">{b.travelers}</td>
                        <td className="px-4 py-3 font-semibold">
                          ${b.totalAmount.toLocaleString("en-US")}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[b.status] ?? "bg-gray-100 text-gray-800"}`}
                          >
                            {b.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>

            {/* Mobile stacked cards */}
            <div className="md:hidden space-y-3">
              {bookings.map((b) => (
                <Card key={b.id} className="border-none shadow-sm">
                  <CardContent className="p-4 space-y-2">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-medium text-sm truncate">{b.packageName}</p>
                        <p className="text-xs text-muted-foreground">{b.destination}</p>
                      </div>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium shrink-0 ${STATUS_COLORS[b.status] ?? "bg-gray-100 text-gray-800"}`}
                      >
                        {b.status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>
                        {b.startDate} – {b.endDate}
                      </span>
                      <span>{b.travelers} travelers</span>
                    </div>
                    <p className="text-sm font-semibold">${b.totalAmount.toLocaleString("en-US")}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-10 text-muted-foreground border rounded-xl">
            <CalendarDays className="h-8 w-8 mx-auto mb-2 opacity-40" />
            <p className="text-sm">No bookings yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
