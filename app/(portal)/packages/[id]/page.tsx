"use client"

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Check, Clock, DollarSign, Star, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getPackageById } from "@/lib/data";

export default function PackageDetailPage() {
  const params = useParams<{ id: string }>();
  const pkg = getPackageById(parseInt(params.id, 10));

  if (!pkg) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground">Package not found.</p>
        <Link href="/packages">
          <Button variant="outline" className="mt-4">
            Back to Packages
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Link
        href="/packages"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors min-h-[44px]"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Packages
      </Link>

      {/* Hero */}
      <div className="relative h-56 md:h-72 rounded-2xl overflow-hidden shadow-md">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={pkg.imageUrl} alt={pkg.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute bottom-4 md:bottom-6 left-4 md:left-6 text-white space-y-2">
          <div className="flex gap-2">
            <Badge className="bg-primary text-white">{pkg.category}</Badge>
            {pkg.isFeatured && <Badge className="bg-accent text-white">Featured</Badge>}
          </div>
          <h1 className="text-2xl md:text-3xl font-serif">{pkg.name}</h1>
          <p className="text-white/80">{pkg.destination}</p>
        </div>
        <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-sm rounded-full px-3 py-1 text-white text-sm flex items-center gap-1">
          <Star className="h-3.5 w-3.5 fill-primary text-primary" />
          {pkg.rating} · {pkg.reviewCount} reviews
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Left: Details */}
        <div className="md:col-span-2 space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-secondary mb-3">About This Package</h2>
            <p className="text-muted-foreground leading-relaxed">{pkg.description}</p>
          </div>

          {pkg.highlights.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-secondary mb-3">Highlights</h2>
              <ul className="grid sm:grid-cols-2 gap-2">
                {pkg.highlights.map((hl) => (
                  <li key={hl} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <Check className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                    {hl}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Right: Booking card */}
        <Card className="border-none shadow-md h-fit md:sticky md:top-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Book This Package</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Price per person</span>
                <span className="font-bold text-lg text-primary">
                  ${pkg.pricePerPerson.toLocaleString("en-US")}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Duration</span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  {pkg.duration} days
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Your commission</span>
                <span className="flex items-center gap-1 text-accent font-semibold">
                  <DollarSign className="h-3.5 w-3.5" />
                  {pkg.commissionRate}%
                </span>
              </div>
              <div className="border-t pt-3 flex justify-between text-sm">
                <span className="text-muted-foreground">Estimated comm. (1 traveler)</span>
                <span className="font-medium">
                  ${((pkg.pricePerPerson * pkg.commissionRate) / 100).toFixed(2)}
                </span>
              </div>
            </div>

            <Link href={`/bookings/new?packageId=${pkg.id}`} className="block">
              <Button className="w-full gap-2 h-12">
                <Users className="h-4 w-4" /> Book for Client
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
