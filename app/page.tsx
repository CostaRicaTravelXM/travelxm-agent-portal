"use client"

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Eye, EyeOff } from "lucide-react";
import {
  FacebookIcon,
  InstagramIcon,
  LinkedinIcon,
  TwitterIcon,
  YoutubeIcon,
} from "@/components/icons/social";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/layout/logo";
import { getImageUrl, PHOTOS } from "@/lib/portal-images";

const CAROUSEL_SLIDES = [
  { photo: PHOTOS.arenalVolcano, location: "Arenal Volcano", tagline: "Where will you send them next?" },
  { photo: PHOTOS.laFortunaWaterfall, location: "La Fortuna", tagline: "Curated journeys. Earned rewards." },
  { photo: PHOTOS.pacificSunsetBeach, location: "Pacific Coast", tagline: "Premium travel, premium commissions." },
  { photo: PHOTOS.playaSamara, location: "Playa Sámara", tagline: "Every booking tells a story." },
  { photo: PHOTOS.scarletMacaws, location: "Corcovado National Park", tagline: "Unlock the world for your clients." },
];

const SOCIAL_LOGINS = [
  {
    name: "Google",
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
      </svg>
    ),
  },
  {
    name: "Facebook",
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="#1877F2">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    ),
  },
  {
    name: "Apple",
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
        <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"/>
      </svg>
    ),
  },
  {
    name: "Microsoft",
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4">
        <path fill="#F25022" d="M1 1h10v10H1z"/>
        <path fill="#00A4EF" d="M13 1h10v10H13z"/>
        <path fill="#7FBA00" d="M1 13h10v10H1z"/>
        <path fill="#FFB900" d="M13 13h10v10H13z"/>
      </svg>
    ),
  },
];

export default function LoginPage() {
  const [tab, setTab] = useState<"login" | "signup">("login");
  const [slideIndex, setSlideIndex] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setSlideIndex((i) => (i + 1) % CAROUSEL_SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const slide = CAROUSEL_SLIDES[slideIndex];

  return (
    <div className="min-h-screen w-full flex">
      {/* Left: Image Carousel */}
      <div className="hidden lg:flex lg:w-[60%] relative overflow-hidden flex-col">
        <AnimatePresence mode="wait">
          <motion.div
            key={slideIndex}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2 }}
          >
            <Image
              src={getImageUrl(`login-slide-${slideIndex + 1}`, slide.photo.src)}
              alt={slide.photo.alt}
              fill
              // The panel is 60vw and never exceeds a 2560px display.
              sizes="(max-width: 1023px) 0px, 60vw"
              priority={slideIndex === 0}
              className="object-cover animate-ken-burns"
            />
          </motion.div>
        </AnimatePresence>

        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/10 z-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent z-10" />

        {/* TravelXM Logo top-left */}
        <div className="relative z-20 p-10">
          <Logo className="text-white" />
        </div>

        {/* Center tagline */}
        <div className="relative z-20 flex-1 flex items-center px-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={slideIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <p className="text-[#D4A24C] text-sm font-medium tracking-widest uppercase mb-4">
                {slide.location}
              </p>
              <h2 className="text-white font-serif text-4xl xl:text-5xl font-light leading-tight max-w-md">
                {slide.tagline}
              </h2>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom: indicators + social icons */}
        <div className="relative z-20 px-10 pb-10 flex items-center justify-between">
          <div className="flex gap-2">
            {CAROUSEL_SLIDES.map((s, i) => (
              <button
                key={s.location}
                onClick={() => setSlideIndex(i)}
                aria-label={`Show slide ${i + 1}`}
                className={`h-0.5 rounded-full transition-all duration-300 ${
                  i === slideIndex ? "w-8 bg-[#D4A24C]" : "w-3 bg-white/40"
                }`}
              />
            ))}
          </div>
          <div className="flex items-center gap-4">
            {[InstagramIcon, FacebookIcon, LinkedinIcon, TwitterIcon, YoutubeIcon].map((Icon, i) => (
              <a key={i} href="#" className="text-white/60 hover:text-white transition-colors">
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Right: Form panel */}
      <div className="w-full lg:w-[40%] flex flex-col bg-[#FAFAF7] overflow-y-auto">
        {/* Mobile header — the carousel is desktop-only, so the phone gets a
         * band of the same photography rather than a bare logo bar. */}
        <div className="lg:hidden">
          <div className="p-6 pb-4 pt-safe">
            <Logo className="text-[#0A4D5C]" />
          </div>
          <div className="relative h-36 sm:h-44 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={slideIndex}
                className="absolute inset-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.2 }}
              >
                <Image
                  src={slide.photo.src}
                  alt={slide.photo.alt}
                  fill
                  sizes="(min-width: 1024px) 0px, 100vw"
                  priority
                  className="object-cover"
                />
              </motion.div>
            </AnimatePresence>
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A4D5C]/85 via-[#0A4D5C]/20 to-transparent" />
            <p className="absolute bottom-3 left-6 right-6 text-[#D4A24C] text-xs font-medium tracking-widest uppercase truncate">
              {slide.location}
            </p>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center p-6 sm:p-8 xl:p-12">
          <div className="w-full max-w-sm">
            {/* Heading */}
            <div className="mb-8">
              <h1 className="font-serif text-3xl text-[#0A4D5C] font-light leading-tight mb-2">
                {tab === "login" ? "Welcome back" : "Join TravelXM"}
              </h1>
              <p className="text-[#6B6B6B] text-sm leading-relaxed">
                {tab === "login"
                  ? "Sign in to your agent workspace to manage bookings and earn commissions."
                  : "Create your agent account and start earning today."}
              </p>
            </div>

            {/* Tab Toggle */}
            <div className="flex bg-[#F4EFE6] rounded-xl p-1 mb-8 relative">
              <motion.div
                className="absolute inset-y-1 rounded-lg bg-white shadow-sm"
                animate={{ left: tab === "login" ? "4px" : "50%", width: "calc(50% - 4px)" }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
              <button
                className={`flex-1 inline-flex items-center justify-center text-sm font-medium min-h-[44px] rounded-lg relative z-10 transition-colors ${
                  tab === "login" ? "text-[#0A4D5C]" : "text-[#6B6B6B]"
                }`}
                onClick={() => setTab("login")}
              >
                Sign In
              </button>
              <button
                className={`flex-1 inline-flex items-center justify-center text-sm font-medium min-h-[44px] rounded-lg relative z-10 transition-colors ${
                  tab === "signup" ? "text-[#0A4D5C]" : "text-[#6B6B6B]"
                }`}
                onClick={() => setTab("signup")}
              >
                Sign Up
              </button>
            </div>

            {/* Social login buttons */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              {SOCIAL_LOGINS.map((provider) => (
                <button
                  key={provider.name}
                  className="flex items-center justify-center gap-2.5 px-4 py-2.5 min-h-[44px] bg-white border border-[#E8E2D5] rounded-xl text-sm font-medium text-[#1A1A1A] hover:border-[#D4A24C] hover:bg-[#D4A24C]/5 transition-all duration-200 shadow-sm"
                >
                  {provider.icon}
                  {provider.name}
                </button>
              ))}
            </div>

            {/* Divider */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex-1 h-px bg-[#E8E2D5]" />
              <span className="text-xs text-[#6B6B6B] font-medium">or continue with email</span>
              <div className="flex-1 h-px bg-[#E8E2D5]" />
            </div>

            {/* Form */}
            <AnimatePresence mode="wait">
              <motion.form
                key={tab}
                initial={{ opacity: 0, x: tab === "login" ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                onSubmit={(e) => e.preventDefault()}
                className="space-y-4"
              >
                {tab === "signup" && (
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-medium text-[#1A1A1A]">First Name</Label>
                      <Input
                        placeholder="Jane"
                        className="h-11 bg-white border-[#E8E2D5] focus:border-[#D4A24C] focus:ring-[#D4A24C]/20 rounded-xl"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-medium text-[#1A1A1A]">Last Name</Label>
                      <Input
                        placeholder="Smith"
                        className="h-11 bg-white border-[#E8E2D5] focus:border-[#D4A24C] focus:ring-[#D4A24C]/20 rounded-xl"
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-[#1A1A1A]">Agent Email</Label>
                  <Input
                    type="email"
                    placeholder="agent@travelco.com"
                    className="h-11 bg-white border-[#E8E2D5] focus:border-[#D4A24C] focus:ring-[#D4A24C]/20 rounded-xl"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-medium text-[#1A1A1A]">Password</Label>
                    {tab === "login" && (
                      <Link
                        href="#"
                        className="inline-flex items-center min-h-[44px] sm:min-h-0 px-1 -mr-1 text-xs text-[#E87A5D] hover:text-[#E87A5D]/80 transition-colors"
                      >
                        Forgot password?
                      </Link>
                    )}
                  </div>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="h-11 bg-white border-[#E8E2D5] focus:border-[#D4A24C] focus:ring-[#D4A24C]/20 rounded-xl pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      className="absolute right-1 top-1/2 -translate-y-1/2 grid place-content-center h-11 w-11 rounded-lg text-[#6B6B6B] hover:text-[#1A1A1A] transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {tab === "signup" && (
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-[#1A1A1A]">Confirm Password</Label>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      className="h-11 bg-white border-[#E8E2D5] focus:border-[#D4A24C] focus:ring-[#D4A24C]/20 rounded-xl"
                    />
                  </div>
                )}

                {tab === "login" && (
                  <div className="flex items-center gap-2.5">
                    <Checkbox
                      id="remember"
                      checked={rememberMe}
                      onCheckedChange={(v) => setRememberMe(!!v)}
                      className="border-[#E8E2D5] data-[state=checked]:bg-[#0A4D5C] data-[state=checked]:border-[#0A4D5C]"
                    />
                    <label
                      htmlFor="remember"
                      className="text-sm text-[#6B6B6B] cursor-pointer select-none"
                    >
                      Remember me for 30 days
                    </label>
                  </div>
                )}

                <Link href="/dashboard" className="block">
                  <Button className="w-full h-12 bg-[#E87A5D] hover:bg-[#E87A5D]/90 text-white font-medium rounded-xl shadow-md hover:shadow-lg transition-all duration-200 mt-2 flex items-center justify-center gap-2 group">
                    {tab === "login" ? "Sign In to Workspace" : "Create Agent Account"}
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                  </Button>
                </Link>
              </motion.form>
            </AnimatePresence>

            {/* Footer */}
            <p className="text-center text-xs text-[#6B6B6B] mt-8">
              By continuing, you agree to TravelXM&apos;s{" "}
              <a href="#" className="text-[#0A4D5C] underline-offset-2 hover:underline inline-block py-2">Terms of Service</a>{" "}
              and{" "}
              <a href="#" className="text-[#0A4D5C] underline-offset-2 hover:underline inline-block py-2">Privacy Policy</a>
            </p>
          </div>
        </div>

        {/* Footer social */}
        <div className="p-6 border-t border-[#E8E2D5] flex items-center justify-between pb-safe">
          <span className="text-xs text-[#6B6B6B]">© 2024 TravelXM. All rights reserved.</span>
          <div className="flex items-center gap-3">
            {[InstagramIcon, FacebookIcon, LinkedinIcon, TwitterIcon].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="grid place-content-center h-11 w-11 -m-2.5 rounded-lg text-[#6B6B6B] hover:text-[#0A4D5C] transition-colors"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
