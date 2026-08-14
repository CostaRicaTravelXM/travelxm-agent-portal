"use client"

import { motion } from "framer-motion";
import { AlertCircle, ExternalLink, Image as ImageIcon, Layers, Link2, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { IMAGE_SLOTS, type ImageSlot } from "@/lib/portal-images";

export default function CanvaPage() {
  const { toast } = useToast();

  const slotsBySection = IMAGE_SLOTS.reduce<Record<string, ImageSlot[]>>((acc, slot) => {
    (acc[slot.section] ??= []).push(slot);
    return acc;
  }, {});

  const handleConnect = () => {
    toast({
      title: "Canva connection unavailable",
      description: "The Canva integration activates once the API backend is deployed.",
    });
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="font-serif text-3xl text-[#0A4D5C] font-light">Canva Integration</h1>
            </div>
            <p className="text-[#6B6B6B] text-sm">
              Replace portal images with designs from your Canva library.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Connection Card */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
        <Card className="border border-[#E8E2D5] shadow-sm bg-white rounded-2xl overflow-hidden">
          <div className="h-1.5 bg-gradient-to-r from-[#00C4CC] via-[#7C5CFC] to-[#D4A24C]" />
          <CardContent className="p-6">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-[#00C4CC]/20 to-[#7C5CFC]/20 flex items-center justify-center shrink-0">
                  <Palette className="h-7 w-7 text-[#7C5CFC]" />
                </div>
                <div>
                  <p className="font-semibold text-[#1A1A1A]">Connect your Canva account</p>
                  <p className="text-sm text-[#6B6B6B]">
                    Authorize TravelXM to access your Canva designs library.
                  </p>
                </div>
              </div>
              <Button
                size="sm"
                onClick={handleConnect}
                className="bg-[#7C5CFC] hover:bg-[#7C5CFC]/90 text-white rounded-xl gap-2"
              >
                <Link2 className="h-4 w-4" />
                Connect Canva
              </Button>
            </div>

            <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl flex gap-2.5">
              <AlertCircle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
              <p className="text-xs text-amber-800">
                <strong>Before connecting:</strong> Add your portal URL +{" "}
                <code className="bg-amber-100 px-1 rounded">/api/canva/callback</code> as an allowed
                redirect URI in your{" "}
                <a
                  href="https://www.canva.com/developers/apps"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline inline-flex items-center gap-0.5"
                >
                  Canva Developer Portal <ExternalLink className="h-3 w-3" />
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Image Slots */}
      {Object.entries(slotsBySection).map(([section, slots], si) => (
        <motion.div
          key={section}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 + si * 0.05 }}
        >
          <div className="flex items-center gap-2 mb-3">
            <Layers className="h-4 w-4 text-[#0A4D5C]" />
            <h2 className="font-semibold text-[#1A1A1A] text-sm">{section} Images</h2>
            <span className="text-xs text-[#6B6B6B]">({slots.length} slots)</span>
          </div>
          <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
            {slots.map((slot) => (
              <Card
                key={slot.key}
                className="border border-[#E8E2D5] shadow-sm bg-white rounded-2xl overflow-hidden group"
              >
                <div className="relative h-32 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={slot.defaultUrl}
                    alt={slot.label}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <CardContent className="p-4">
                  <p className="font-medium text-sm text-[#1A1A1A] mb-0.5 truncate">{slot.label}</p>
                  <p className="text-xs text-[#6B6B6B] mb-3">Default (Unsplash)</p>
                  <Button
                    size="sm"
                    disabled
                    className="w-full bg-[#0A4D5C] hover:bg-[#0A4D5C]/90 text-white rounded-xl text-xs h-9 gap-1.5"
                  >
                    <ImageIcon className="h-3.5 w-3.5" />
                    Pick from Canva
                  </Button>
                  <p className="text-xs text-[#6B6B6B] mt-2 text-center">
                    Connect Canva to replace this image
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
