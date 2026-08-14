import Link from "next/link";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#FAFAF7]">
      <Card className="w-full max-w-md mx-4 border-[#E8E2D5] rounded-2xl">
        <CardContent className="pt-6">
          <div className="flex mb-4 gap-2 items-center">
            <AlertCircle className="h-8 w-8 text-[#E87A5D]" />
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
        </CardContent>
      </Card>
    </div>
  );
}
