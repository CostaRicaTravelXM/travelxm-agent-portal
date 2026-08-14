"use client"

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ChevronRight, Mail, MapPin, Phone, Plus, Search, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { CUSTOMERS } from "@/lib/data";
import type { Customer } from "@/lib/types";

const createSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Valid email required"),
  phone: z.string().optional(),
  country: z.string().optional(),
  notes: z.string().optional(),
});
type CreateForm = z.infer<typeof createSchema>;

const AVATAR_COLORS = ["#0A4D5C", "#E87A5D", "#D4A24C", "#7C5CFC", "#10B981", "#F59E0B"];

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>(CUSTOMERS);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm<CreateForm>({
    resolver: zodResolver(createSchema),
    defaultValues: { firstName: "", lastName: "", email: "", phone: "", country: "", notes: "" },
  });

  const filtered = customers.filter((c) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      c.firstName.toLowerCase().includes(q) ||
      c.lastName.toLowerCase().includes(q) ||
      `${c.firstName} ${c.lastName}`.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q)
    );
  });

  const onSubmit = (data: CreateForm) => {
    const nextId = Math.max(...customers.map((c) => c.id)) + 1;
    setCustomers((prev) => [
      {
        id: nextId,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        country: data.country,
        notes: data.notes,
        totalBookings: 0,
        totalSpent: 0,
        createdAt: new Date().toISOString(),
      },
      ...prev,
    ]);
    setOpen(false);
    form.reset();
    toast({
      title: "Customer added",
      description: `${data.firstName} ${data.lastName} has been added to your CRM`,
    });
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div>
            <h1 className="font-serif text-3xl text-[#0A4D5C] font-light">Leads &amp; CRM</h1>
            <p className="text-[#6B6B6B] mt-1 text-sm">
              {filtered.length} client{filtered.length !== 1 ? "s" : ""} in your network
            </p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-[#E87A5D] hover:bg-[#E87A5D]/90 text-white rounded-xl gap-2">
                <Plus className="h-4 w-4" /> Add Client
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md max-sm:h-full max-sm:max-h-full max-sm:rounded-none sm:rounded-2xl border-[#E8E2D5] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="font-serif text-xl text-[#0A4D5C] font-light">
                  New Client
                </DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-2">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs text-[#1A1A1A] font-medium">
                            First Name *
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Jane"
                              className="h-11 rounded-xl border-[#E8E2D5] focus:border-[#D4A24C] focus:ring-[#D4A24C]/20"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs text-[#1A1A1A] font-medium">
                            Last Name *
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Smith"
                              className="h-11 rounded-xl border-[#E8E2D5] focus:border-[#D4A24C] focus:ring-[#D4A24C]/20"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs text-[#1A1A1A] font-medium">Email *</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="email"
                              placeholder="jane@example.com"
                              className="h-11 rounded-xl border-[#E8E2D5] focus:border-[#D4A24C] focus:ring-[#D4A24C]/20"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs text-[#1A1A1A] font-medium">Phone</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="+1 555 0100"
                              className="h-11 rounded-xl border-[#E8E2D5] focus:border-[#D4A24C] focus:ring-[#D4A24C]/20"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="country"
                      render={({ field }) => (
                        <FormItem className="col-span-2">
                          <FormLabel className="text-xs text-[#1A1A1A] font-medium">Country</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="United Kingdom"
                              className="h-11 rounded-xl border-[#E8E2D5] focus:border-[#D4A24C] focus:ring-[#D4A24C]/20"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="notes"
                      render={({ field }) => (
                        <FormItem className="col-span-2">
                          <FormLabel className="text-xs text-[#1A1A1A] font-medium">Notes</FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              rows={3}
                              placeholder="Travel preferences, special requirements…"
                              className="rounded-xl border-[#E8E2D5] focus:border-[#D4A24C] focus:ring-[#D4A24C]/20 resize-none"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex gap-3 pt-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setOpen(false)}
                      className="flex-1 rounded-xl border-[#E8E2D5] h-11"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1 bg-[#E87A5D] hover:bg-[#E87A5D]/90 text-white rounded-xl h-11"
                    >
                      Add Client
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </motion.div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6B6B6B]" />
        <Input
          placeholder="Search by name or email…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 h-10 bg-white border-[#E8E2D5] rounded-xl focus:border-[#D4A24C] focus:ring-[#D4A24C]/20"
        />
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-[#6B6B6B]">
          <Users className="h-12 w-12 opacity-20 mb-4" />
          <h3 className="font-serif text-xl text-[#1A1A1A] mb-2">No clients found</h3>
          <p className="text-sm mb-4">
            {search ? "Try a different search term" : "Add your first client to start building your network"}
          </p>
          {!search && (
            <Button
              size="sm"
              className="bg-[#E87A5D] hover:bg-[#E87A5D]/90 text-white rounded-xl gap-2"
              onClick={() => setOpen(true)}
            >
              <Plus className="h-4 w-4" /> Add First Client
            </Button>
          )}
        </div>
      ) : (
        <motion.div
          className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
        >
          {filtered.map((customer, i) => {
            const fullName = `${customer.firstName} ${customer.lastName}`;
            const initials =
              `${customer.firstName[0] ?? ""}${customer.lastName[0] ?? ""}`.toUpperCase() || "?";
            const avatarColor = AVATAR_COLORS[i % AVATAR_COLORS.length];
            return (
              <motion.div
                key={customer.id}
                variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }}
                whileHover={{ y: -3 }}
                transition={{ duration: 0.25 }}
              >
                <Link href={`/customers/${customer.id}`}>
                  <Card className="border border-[#E8E2D5] bg-white shadow-sm rounded-2xl overflow-hidden cursor-pointer group hover:border-[#D4A24C] transition-colors">
                    {/* Card header band */}
                    <div className="h-16 relative" style={{ backgroundColor: avatarColor + "18" }}>
                      <div className="absolute -bottom-6 left-5">
                        <div
                          className="h-12 w-12 rounded-2xl flex items-center justify-center text-white font-bold text-sm shadow-md border-2 border-white"
                          style={{ backgroundColor: avatarColor }}
                        >
                          {initials}
                        </div>
                      </div>
                    </div>
                    <CardContent className="pt-9 pb-4 px-5">
                      <div className="flex items-start justify-between mb-3">
                        <div className="min-w-0">
                          <h3 className="font-semibold text-[#1A1A1A] text-sm group-hover:text-[#0A4D5C] transition-colors truncate">
                            {fullName}
                          </h3>
                          <p className="text-xs text-[#6B6B6B]">
                            {customer.totalBookings} booking{customer.totalBookings !== 1 ? "s" : ""}
                          </p>
                        </div>
                        <ChevronRight className="h-4 w-4 text-[#6B6B6B] group-hover:text-[#0A4D5C] transition-colors shrink-0 mt-0.5" />
                      </div>
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 text-xs text-[#6B6B6B]">
                          <Mail className="h-3 w-3 shrink-0" />
                          <span className="truncate">{customer.email}</span>
                        </div>
                        {customer.phone && (
                          <div className="flex items-center gap-2 text-xs text-[#6B6B6B]">
                            <Phone className="h-3 w-3 shrink-0" />
                            <span className="truncate">{customer.phone}</span>
                          </div>
                        )}
                        {customer.country && (
                          <div className="flex items-center gap-2 text-xs text-[#6B6B6B]">
                            <MapPin className="h-3 w-3 shrink-0" />
                            <span className="truncate">{customer.country}</span>
                          </div>
                        )}
                      </div>
                      {customer.totalSpent > 0 && (
                        <div className="mt-3 pt-3 border-t border-[#F4EFE6] flex items-center justify-between">
                          <span className="text-xs text-[#6B6B6B]">Total spend</span>
                          <span className="text-sm font-bold text-[#0A4D5C]">
                            ${customer.totalSpent.toLocaleString("en-US")}
                          </span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </div>
  );
}
