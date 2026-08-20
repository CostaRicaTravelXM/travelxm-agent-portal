import Image from "next/image";
import Link from "next/link";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getImageUrl, PHOTOS } from "@/lib/portal-images";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#FAFAF7] p-4">
      <Card className="w-full max-w-md border-[#E8E2D5] rounded-2xl overflow-hidden shadow-sm">
        <div className="relative h-40">
          <Image
            src={getImageUrl("not-found", PHOTOS.toucan.src)}
            alt={PHOTOS.toucan.alt}
            fill
            sizes="(max-width: 447px) 100vw, 448px"
            // The bird sits high in the frame; a centred crop cuts its beak.
            className="object-cover object-[50%_28%]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A4D5C]/80 to-transparent" />
        </div>
        <div className="p-6">
          <div className="flex mb-4 gap-2 items-center">
            <AlertCircle className="h-8 w-8 text-[#E87A5D] shrink-0" />
            <h1 className="text-2xl font-serif text-[#0A4D5C]">404 — Page Not Found</h1>
          </div>
          <p className="mt-2 text-sm text-[#6B6B6B]">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
          <Link href="/dashboard" className="inline-block mt-6">
            <Button className="rounded-xl bg-[#E87A5D] hover:bg-[#E87A5D]/90 text-white">
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
