"use client"

import { Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { CUSTOMERS, PACKAGES } from "@/lib/data";

const schema = z.object({
  customerId: z.string().min(1, "Select a customer"),
  packageId: z.string().min(1, "Select a package"),
  travelers: z.string().min(1, "Number of travelers required"),
  checkIn: z.string().min(1, "Check-in date required"),
  checkOut: z.string().min(1, "Check-out date required"),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

function NewBookingForm() {
  const searchParams = useSearchParams();
  const preselectedPackageId = searchParams.get("packageId") ?? "";
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      customerId: "",
      packageId: preselectedPackageId,
      travelers: "2",
      checkIn: "",
      checkOut: "",
      notes: "",
    },
  });

  const selectedPkgId = form.watch("packageId");
  const travelers = parseInt(form.watch("travelers") || "1", 10);
  const selectedPkg = PACKAGES.find((p) => String(p.id) === selectedPkgId);
  const estimatedTotal = selectedPkg ? selectedPkg.pricePerPerson * travelers : 0;
  const estimatedComm = selectedPkg ? estimatedTotal * (selectedPkg.commissionRate / 100) : 0;

  function onSubmit(values: FormData) {
    const customer = CUSTOMERS.find((c) => String(c.id) === values.customerId);
    toast({
      title: "Booking created",
      description: `${selectedPkg?.name ?? "Package"} reserved for ${customer ? `${customer.firstName} ${customer.lastName}` : "client"}.`,
    });
    router.push("/bookings");
  }

  return (
    <div className="space-y-6 pb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Link
        href="/bookings"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors min-h-[44px]"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Bookings
      </Link>

      <div>
        <h1 className="text-3xl font-serif text-secondary tracking-tight">New Booking</h1>
        <p className="text-muted-foreground">Create a new reservation for a client.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card className="border-none shadow-sm">
            <CardContent className="pt-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                  <FormField
                    control={form.control}
                    name="customerId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Client</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a client" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {CUSTOMERS.map((c) => (
                              <SelectItem key={c.id} value={String(c.id)}>
                                {c.firstName} {c.lastName} — {c.email}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="packageId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Package</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a package" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {PACKAGES.map((p) => (
                              <SelectItem key={p.id} value={String(p.id)}>
                                {p.name} — ${p.pricePerPerson.toLocaleString("en-US")}/person
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="travelers"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Travelers</FormLabel>
                          <FormControl>
                            <Input type="number" min="1" max="20" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="checkIn"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Check-in</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="checkOut"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Check-out</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Notes (optional)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Special requests, dietary requirements, travel preferences..."
                            rows={3}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full gap-2 h-12">
                    <Plus className="h-4 w-4" />
                    Create Booking
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        {/* Summary card */}
        <Card className="border-none shadow-sm h-fit">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Booking Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {selectedPkg ? (
              <>
                <div className="font-medium">{selectedPkg.name}</div>
                <div className="text-muted-foreground">{selectedPkg.destination}</div>
                <div className="border-t pt-3 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      ${selectedPkg.pricePerPerson.toLocaleString("en-US")} × {travelers} travelers
                    </span>
                  </div>
                  <div className="flex justify-between font-semibold text-base">
                    <span>Total</span>
                    <span className="text-primary">${estimatedTotal.toLocaleString("en-US")}</span>
                  </div>
                  <div className="flex justify-between text-accent font-medium">
                    <span>Your commission ({selectedPkg.commissionRate}%)</span>
                    <span>${estimatedComm.toFixed(2)}</span>
                  </div>
                </div>
              </>
            ) : (
              <p className="text-muted-foreground">Select a package to see pricing</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function NewBookingPage() {
  return (
    <Suspense>
      <NewBookingForm />
    </Suspense>
  );
}
