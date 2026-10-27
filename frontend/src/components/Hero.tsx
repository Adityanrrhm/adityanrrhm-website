"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { fetchAPI, wrapData } from "@/lib/api";

interface Profile {
  name: string;
  title: string;
  bio: string;
  photoUrl: string | null;
  cvUrl?: string | null;
}

export default function Hero() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAPI<{ data: Profile }>("profile")
      .then((res) => setProfile(wrapData(res)))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const nameParts = (profile?.name || "Aditya Nur Rohim").split(" ");
  const firstName = nameParts[0];
  const restName = nameParts.slice(1).join(" ");

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 py-8 sm:py-12 md:py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="border-3 border-stroke bg-surface p-6 sm:p-10 md:p-14 shadow-neo-xl relative"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Text & CTA */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            {/* Status Badge */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="badge-neo badge-neo-active inline-flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Available for Hire</span>
              </span>
              {profile?.title && (
                <span className="badge-neo hidden sm:inline-flex">
                  {profile.title}
                </span>
              )}
            </div>

            <p className="font-handwritten text-2xl sm:text-3xl text-muted rotate-[-2deg] mb-1">
              hi, i&apos;m
            </p>

            {/* Headline */}
            <h1 className="font-heading font-black text-4xl sm:text-5xl md:text-6xl lg:text-7xl uppercase leading-[1.08] tracking-tight mb-6 text-stroke">
              {firstName}{" "}
              <span className="bg-accent text-white px-2.5 py-0.5 inline-block -rotate-1 shadow-neo-sm">
                {restName || "DEVELOPER"}
              </span>
            </h1>

            {/* Bio */}
            <p className="text-muted text-base sm:text-lg md:text-xl font-medium leading-relaxed max-w-2xl mb-8">
              {profile?.bio ||
                "Membangun aplikasi web berperforma tinggi dan analitik data dengan tampilan yang berani, bersih, dan fungsional."}
            </p>

            {/* Buttons */}
            <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto">
              <a href="#portfolio" className="btn-neo-primary w-full sm:w-auto gap-2">
                <span>Lihat Karya</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </a>
              <Link href="/about" className="btn-neo-secondary w-full sm:w-auto">
                Tentang Saya
              </Link>
            </div>
          </div>

          {/* Right Column: Hero Photo Box */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="relative group">
              <div className="w-[240px] sm:w-[280px] md:w-[320px] aspect-[4/5] border-3 border-stroke bg-neutral-soft shadow-neo-xl relative overflow-hidden flex items-end">
                {loading ? (
                  <div className="absolute inset-0 bg-neutral-soft animate-pulse flex items-center justify-center">
                    <div className="w-12 h-12 border-3 border-stroke border-t-accent animate-spin" />
                  </div>
                ) : profile?.photoUrl ? (
                  <Image
                    src={profile.photoUrl}
                    alt={profile.name || "Aditya Nur Rohim"}
                    fill
                    priority
                    className="object-cover object-bottom transition-all duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-neutral-soft">
                    <span className="font-heading font-black text-6xl text-stroke opacity-15">
                      ANR
                    </span>
                  </div>
                )}

                {/* Neo Card Label on bottom */}
                <div className="absolute bottom-3 left-3 right-3 bg-surface border-2 border-stroke p-3 shadow-neo-sm z-10">
                  <p className="font-heading font-black text-xs uppercase tracking-wider text-stroke truncate">
                    {profile?.name || "Aditya Nur Rohim"}
                  </p>
                  <p className="text-[11px] text-muted font-bold uppercase truncate">
                    {profile?.title || "Data Analytics & Web Developer"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
