"use client"

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Clock, Grid3x3, List, MapPin, Search, Sparkles, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PACKAGES } from "@/lib/data";

const CATEGORIES = [
  "All",
  "Beach & Relaxation",
  "Adventure",
  "Cultural",
  "Wildlife",
  "Honeymoon",
  "Family",
  "Luxury",
];

export default function PackagesPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [view, setView] = useState<"grid" | "list">("grid");

  const filtered = PACKAGES.filter((p) => {
    const matchesCategory = category === "All" || p.category === category;
    const matchesSearch =
      !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.destination.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div>
            <h1 className="font-serif text-3xl text-[#0A4D5C] font-light">
              Packages &amp; Inventory
            </h1>
            <p className="text-[#6B6B6B] mt-1 text-sm">{filtered.length} packages available</p>
          </div>
          <div className="flex items-center gap-2">
            {(["grid", "list"] as const).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                aria-label={`${v} view`}
                className={`p-2.5 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg border transition-colors ${
                  view === v
                    ? "bg-[#0A4D5C] text-white border-[#0A4D5C]"
                    : "bg-white border-[#E8E2D5] text-[#6B6B6B] hover:text-[#1A1A1A]"
                }`}
              >
                {v === "grid" ? <Grid3x3 className="h-4 w-4" /> : <List className="h-4 w-4" />}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Search + category filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative max-w-sm w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6B6B6B]" />
          <Input
            placeholder="Search destinations…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-10 bg-white border-[#E8E2D5] rounded-xl focus:border-[#D4A24C] focus:ring-[#D4A24C]/20"
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 min-h-[40px] rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                category === cat
                  ? "bg-[#0A4D5C] text-white shadow-sm"
                  : "bg-white border border-[#E8E2D5] text-[#6B6B6B] hover:border-[#0A4D5C] hover:text-[#0A4D5C]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-[#6B6B6B]">
          <MapPin className="h-12 w-12 opacity-20 mb-4" />
          <h3 className="font-serif text-xl text-[#1A1A1A] mb-2">No packages found</h3>
          <p className="text-sm mb-4">Try adjusting your search or filters</p>
          <Button
            variant="outline"
            className="rounded-xl"
            onClick={() => {
              setSearch("");
              setCategory("All");
            }}
          >
            Clear filters
          </Button>
        </div>
      ) : view === "grid" ? (
        <motion.div
          className="grid gap-4 md:gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
        >
          {filtered.map((pkg) => (
            <motion.div
              key={pkg.id}
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.25 }}
            >
              <Link href={`/packages/${pkg.id}`}>
                <Card className="border border-[#E8E2D5] shadow-sm bg-white rounded-2xl overflow-hidden cursor-pointer group h-full">
                  <div className="relative h-48 overflow-hidden bg-[#F4EFE6]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={pkg.imageUrl}
                      alt={pkg.destination}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    {pkg.isFeatured && (
                      <span className="absolute top-3 left-3 flex items-center gap-1 bg-[#D4A24C] text-white text-xs font-semibold px-2.5 py-1 rounded-lg">
                        <Sparkles className="h-3 w-3" /> Featured
                      </span>
                    )}
                    <span className="absolute top-3 right-3 bg-[#E87A5D] text-white text-xs font-bold px-2.5 py-1 rounded-lg">
                      {pkg.commissionRate}% comm
                    </span>
                    <div className="absolute bottom-3 left-3 flex items-center gap-1 text-white text-xs font-medium">
                      <MapPin className="h-3 w-3" /> {pkg.destination}
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-[#1A1A1A] text-sm leading-snug mb-1 group-hover:text-[#0A4D5C] transition-colors line-clamp-2">
                      {pkg.name}
                    </h3>
                    <p className="text-xs text-[#6B6B6B] line-clamp-2 mb-3 leading-relaxed">
                      {pkg.description}
                    </p>
                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-[10px] text-[#6B6B6B] uppercase tracking-wide">from</p>
                        <p className="font-bold text-[#0A4D5C] text-base">
                          ${pkg.pricePerPerson.toLocaleString("en-US")}
                          <span className="text-xs font-normal text-[#6B6B6B]">/pp</span>
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-1 text-right">
                        <div className="flex items-center gap-1 text-[#6B6B6B]">
                          <Clock className="h-3 w-3" />
                          <span className="text-xs">{pkg.duration}d</span>
                        </div>
                        <div className="flex items-center gap-0.5">
                          <Star className="h-3 w-3 fill-[#D4A24C] text-[#D4A24C]" />
                          <span className="text-xs font-medium">{pkg.rating.toFixed(1)}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <div className="space-y-3">
          {filtered.map((pkg, i) => (
            <motion.div
              key={pkg.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              <Link href={`/packages/${pkg.id}`}>
                <Card className="border border-[#E8E2D5] shadow-sm bg-white rounded-2xl overflow-hidden cursor-pointer hover:border-[#D4A24C] transition-colors group">
                  <CardContent className="p-0 flex items-center">
                    <div className="w-24 sm:w-28 h-20 shrink-0 overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={pkg.imageUrl}
                        alt={pkg.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="flex-1 px-4 sm:px-5 py-3 min-w-0 flex items-center justify-between gap-4">
                      <div className="min-w-0">
                        <h3 className="font-semibold text-[#1A1A1A] text-sm truncate">{pkg.name}</h3>
                        <div className="flex items-center gap-2 mt-0.5 text-xs text-[#6B6B6B]">
                          <span className="flex items-center gap-0.5">
                            <MapPin className="h-3 w-3" />
                            {pkg.destination}
                          </span>
                          <span>·</span>
                          <span className="flex items-center gap-0.5">
                            <Clock className="h-3 w-3" />
                            {pkg.duration} days
                          </span>
                        </div>
                      </div>
                      <div className="shrink-0 text-right">
                        <p className="font-bold text-[#0A4D5C] text-sm">
                          ${pkg.pricePerPerson.toLocaleString("en-US")}
                          <span className="text-xs font-normal text-[#6B6B6B]">/pp</span>
                        </p>
                        <span className="text-xs font-semibold text-[#E87A5D]">
                          {pkg.commissionRate}% commission
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
