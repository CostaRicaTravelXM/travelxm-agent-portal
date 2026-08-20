"use client"

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { formatUtc } from "@/lib/format";
import {
  Book,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  ExternalLink,
  LifeBuoy,
  MessageCircle,
  MessageSquare,
  Phone,
  Plus,
  Search,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { SUPPORT_TICKETS } from "@/lib/data";
import type { SupportTicket } from "@/lib/types";

const PRIORITIES = ["low", "medium", "high", "urgent"] as const;
const CATEGORIES = ["booking", "payment", "package", "technical", "account", "other"] as const;

const createSchema = z.object({
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  message: z.string().min(10, "Please describe your issue in more detail"),
  priority: z.enum(PRIORITIES),
  category: z.enum(CATEGORIES),
});
type CreateForm = z.infer<typeof createSchema>;

const PRIORITY_CONFIG: Record<string, { label: string; className: string }> = {
  low: { label: "Low", className: "bg-slate-50 text-slate-600 border-slate-200" },
  medium: { label: "Medium", className: "bg-blue-50 text-blue-700 border-blue-200" },
  high: { label: "High", className: "bg-amber-50 text-amber-700 border-amber-200" },
  urgent: { label: "Urgent", className: "bg-red-50 text-red-700 border-red-200" },
};

const STATUS_CONFIG: Record<string, { label: string; className: string; icon: React.ElementType }> = {
  open: { label: "Open", className: "bg-blue-50 text-blue-700 border-blue-200", icon: MessageCircle },
  in_progress: { label: "In Progress", className: "bg-amber-50 text-amber-700 border-amber-200", icon: Clock },
  resolved: { label: "Resolved", className: "bg-emerald-50 text-emerald-700 border-emerald-200", icon: CheckCircle2 },
  closed: { label: "Closed", className: "bg-slate-50 text-slate-600 border-slate-200", icon: CheckCircle2 },
};

const FAQ = [
  {
    q: "How do I generate a payment link for a booking?",
    a: "Go to the Payments page, enter your booking ID and select the currency, then click 'Generate Link'. The Stripe Checkout link will be copied to your clipboard to share with your client.",
  },
  {
    q: "When are commissions paid out?",
    a: "Commissions are processed weekly every Friday. You'll receive a notification when a payout is initiated. Funds typically arrive within 2–3 business days depending on your bank.",
  },
  {
    q: "How does Zoho CRM sync work?",
    a: "All leads, contacts, and bookings sync bi-directionally with Zoho CRM. Changes made in the portal push to Zoho immediately; Zoho changes are pulled every 15 minutes.",
  },
  {
    q: "Can I add multiple travellers to one booking?",
    a: "Yes. When creating a booking, you can specify the number of guests. Each guest can be linked to an existing customer record for passport and preference tracking.",
  },
  {
    q: "What's the difference between agent tiers?",
    a: "Bronze (0–$10k earned): 8% base commission. Silver ($10k–$50k): 10%. Gold ($50k–$150k): 12%. Platinum ($150k+): 15%, priority support, and exclusive package access.",
  },
];

export default function SupportPage() {
  const [tickets, setTickets] = useState<SupportTicket[]>(SUPPORT_TICKETS);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<number | null>(null);
  const { toast } = useToast();

  const form = useForm<CreateForm>({
    resolver: zodResolver(createSchema),
    defaultValues: { subject: "", message: "", priority: "medium", category: "booking" },
  });

  const onSubmit = (data: CreateForm) => {
    const nextId = Math.max(...tickets.map((t) => t.id)) + 1;
    setTickets((prev) => [
      { id: nextId, ...data, status: "open", createdAt: new Date().toISOString() },
      ...prev,
    ]);
    setOpen(false);
    form.reset();
    toast({ title: "Ticket submitted", description: "We'll get back to you within 24 hours" });
  };

  const handleClose = (id: number) => {
    setTickets((prev) => prev.map((t) => (t.id === id ? { ...t, status: "closed" } : t)));
    toast({ title: "Ticket closed" });
  };

  const filteredTickets = tickets.filter(
    (t) => !search || t.subject.toLowerCase().includes(search.toLowerCase())
  );

  const filteredFaq = FAQ.filter(
    (f) =>
      !search ||
      f.q.toLowerCase().includes(search.toLowerCase()) ||
      f.a.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div>
            <h1 className="font-serif text-3xl text-[#0A4D5C] font-light">Help &amp; Support</h1>
            <p className="text-[#6B6B6B] mt-1 text-sm">Get help, browse FAQs, or contact the team</p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-[#E87A5D] hover:bg-[#E87A5D]/90 text-white rounded-xl gap-2">
                <Plus className="h-4 w-4" /> New Ticket
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md max-sm:h-full max-sm:max-h-full max-sm:rounded-none sm:rounded-2xl border-[#E8E2D5] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="font-serif text-xl text-[#0A4D5C] font-light">
                  Submit a Support Ticket
                </DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-2">
                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-medium text-[#1A1A1A]">Subject *</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Brief description of your issue"
                            className="h-11 rounded-xl border-[#E8E2D5] focus:border-[#D4A24C] focus:ring-[#D4A24C]/20"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-medium text-[#1A1A1A]">Category</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="h-11 rounded-xl border-[#E8E2D5]">
                                <SelectValue placeholder="Select" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="rounded-xl">
                              {CATEGORIES.map((c) => (
                                <SelectItem key={c} value={c} className="capitalize">
                                  {c}
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
                      name="priority"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-medium text-[#1A1A1A]">Priority</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="h-11 rounded-xl border-[#E8E2D5]">
                                <SelectValue placeholder="Select" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="rounded-xl">
                              {PRIORITIES.map((p) => (
                                <SelectItem key={p} value={p} className="capitalize">
                                  {p}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-medium text-[#1A1A1A]">Message *</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            rows={4}
                            placeholder="Describe your issue in detail…"
                            className="rounded-xl border-[#E8E2D5] focus:border-[#D4A24C] focus:ring-[#D4A24C]/20 resize-none"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
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
                      Submit Ticket
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </motion.div>

      {/* Quick contact cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { icon: MessageSquare, title: "WhatsApp Support", sub: "Typically replies in 1 hour", href: "https://wa.me/911234567890", color: "#25D366" },
          { icon: Phone, title: "Phone Support", sub: "Mon–Fri, 9AM–7PM IST", href: "tel:+911234567890", color: "#0A4D5C" },
          { icon: Book, title: "Help Centre", sub: "Guides, tutorials & FAQs", href: "#faq", color: "#D4A24C" },
        ].map(({ icon: Icon, title, sub, href, color }) => (
          <motion.a key={title} href={href} whileHover={{ y: -3 }} transition={{ duration: 0.2 }} className="block">
            <Card className="border border-[#E8E2D5] bg-white rounded-2xl shadow-sm hover:border-[#D4A24C] transition-colors group cursor-pointer">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="p-3 rounded-xl shrink-0" style={{ backgroundColor: color + "15" }}>
                  <Icon className="h-5 w-5" style={{ color }} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-sm text-[#1A1A1A] group-hover:text-[#0A4D5C] transition-colors">
                    {title}
                  </p>
                  <p className="text-xs text-[#6B6B6B] mt-0.5">{sub}</p>
                </div>
                <ExternalLink className="h-4 w-4 text-[#6B6B6B] shrink-0 group-hover:text-[#0A4D5C] transition-colors" />
              </CardContent>
            </Card>
          </motion.a>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6B6B6B]" />
        <Input
          placeholder="Search tickets or FAQs…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 h-11 md:h-10 bg-white border-[#E8E2D5] rounded-xl focus:border-[#D4A24C] focus:ring-[#D4A24C]/20"
        />
      </div>

      {/* Tickets + FAQ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* My Tickets */}
        <Card className="border border-[#E8E2D5] bg-white rounded-2xl shadow-sm overflow-hidden">
          <CardHeader className="px-5 pt-5 pb-3">
            <CardTitle className="font-serif font-medium text-[#1A1A1A] text-lg">My Tickets</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {filteredTickets.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-[#6B6B6B] px-5">
                <LifeBuoy className="h-10 w-10 opacity-20 mb-3" />
                <p className="font-serif text-base text-[#1A1A1A]">No tickets yet</p>
                <p className="text-sm mt-1 text-center">
                  Submit a ticket and our team will help you quickly
                </p>
              </div>
            ) : (
              <div className="divide-y divide-[#F4EFE6]">
                {filteredTickets.map((ticket, i) => {
                  const sc = STATUS_CONFIG[ticket.status] ?? STATUS_CONFIG.open;
                  const pc = PRIORITY_CONFIG[ticket.priority] ?? PRIORITY_CONFIG.medium;
                  const StatusIcon = sc.icon;
                  return (
                    <motion.div
                      key={ticket.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.05 }}
                      className="p-5 hover:bg-[#FAFAF7] transition-colors"
                    >
                      <div className="flex items-start justify-between gap-3 mb-2 flex-wrap">
                        <div className="flex-1 min-w-[12rem]">
                          {/* The subject is the row's whole point — it wraps
                           * rather than truncating into an unreadable stub. */}
                          <p className="text-sm font-semibold text-[#1A1A1A] leading-snug text-pretty">
                            {ticket.subject}
                          </p>
                          <p className="text-xs text-[#6B6B6B] mt-0.5 tabular">
                            #{ticket.id} · {formatUtc(ticket.createdAt, "MMM d, yyyy")}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <Badge variant="outline" className={`text-xs border ${pc.className}`}>
                            {pc.label}
                          </Badge>
                          <Badge
                            variant="outline"
                            className={`text-xs border flex items-center gap-1 ${sc.className}`}
                          >
                            <StatusIcon className="h-3 w-3" /> {sc.label}
                          </Badge>
                        </div>
                      </div>
                      {ticket.message && (
                        <p className="text-xs text-[#6B6B6B] line-clamp-2 leading-relaxed mb-2">
                          {ticket.message}
                        </p>
                      )}
                      {ticket.status !== "closed" && ticket.status !== "resolved" && (
                        <button
                          onClick={() => handleClose(ticket.id)}
                          className="inline-flex items-center gap-1.5 -ml-2 px-2 min-h-[44px] md:min-h-[32px] rounded-lg text-xs font-medium text-[#6B6B6B] hover:text-[#E87A5D] hover:bg-[#E87A5D]/5 transition-colors"
                        >
                          <CheckCircle2 className="h-3.5 w-3.5" /> Mark as resolved
                        </button>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* FAQ */}
        <div id="faq">
          <Card className="border border-[#E8E2D5] bg-white rounded-2xl shadow-sm overflow-hidden">
            <CardHeader className="px-5 pt-5 pb-3">
              <CardTitle className="font-serif font-medium text-[#1A1A1A] text-lg">
                Frequently Asked Questions
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-[#F4EFE6]">
                {filteredFaq.map((faq, i) => (
                  <div key={faq.q}>
                    <button
                      onClick={() => setExpanded(expanded === i ? null : i)}
                      className="w-full text-left px-5 py-4 flex items-start justify-between gap-3 hover:bg-[#FAFAF7] transition-colors min-h-[44px]"
                    >
                      <p className="text-sm font-medium text-[#1A1A1A] leading-snug">{faq.q}</p>
                      {expanded === i ? (
                        <ChevronUp className="h-4 w-4 text-[#6B6B6B] shrink-0 mt-0.5" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-[#6B6B6B] shrink-0 mt-0.5" />
                      )}
                    </button>
                    <AnimatePresence>
                      {expanded === i && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25 }}
                          className="overflow-hidden"
                        >
                          <p className="px-5 pb-4 text-sm text-[#6B6B6B] leading-relaxed">{faq.a}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
                {filteredFaq.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-10 text-[#6B6B6B]">
                    <Book className="h-8 w-8 opacity-20 mb-3" />
                    <p className="text-sm">No FAQs match your search</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
