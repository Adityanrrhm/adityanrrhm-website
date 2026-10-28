"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { fetchAPI, wrapData } from "@/lib/api";

interface Profile {
  name: string;
  bio: string;
  photoUrl: string | null;
  email: string;
  location: string;
  focus: string;
  study: string;
}

export default function About({ isPreview = false }: { isPreview?: boolean }) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAPI<{ data: Profile }>("profile")
      .then((res) => {
        const unwrapped = wrapData(res) as unknown as { data?: Profile } | Profile;
        const profileData = (unwrapped as { data?: Profile })?.data
          ? (unwrapped as { data?: Profile }).data!
          : (unwrapped as Profile);
        setProfile(profileData);
      })
      .catch((err) => console.error("Failed to fetch profile:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section
      id="about"
      className="section-padding py-16 sm:py-20 border-t-3 border-stroke scroll-mt-24"
    >
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        className="mb-12"
      >
        <span className="badge-neo mb-3">
          {isPreview ? "(III) ABOUT ME" : "BIOGRAPHY"}
        </span>
        <h2 className="font-heading font-black text-3xl sm:text-4xl md:text-5xl uppercase tracking-tight text-stroke">
          About Me<span className="text-accent">.</span>
        </h2>
        {!isPreview && (
          <p className="text-muted text-base sm:text-lg font-medium mt-2 max-w-2xl">
            My background, technology interests, and approach to solving data engineering and web challenges.
          </p>
        )}
      </motion.div>

      <div className="grid md:grid-cols-12 gap-8 md:gap-12 items-center">
        {/* Photo Box */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="md:col-span-5 flex justify-center"
        >
          <div className="w-[240px] sm:w-[280px] md:w-[320px] aspect-[4/5] border-3 border-stroke bg-neutral-soft shadow-neo-xl relative overflow-hidden flex items-end group">
            {loading ? (
              <div className="absolute inset-0 bg-neutral-soft animate-pulse" />
            ) : profile?.photoUrl ? (
              <Image
                src={profile.photoUrl}
                alt={profile.name || "Aditya Nur Rohim"}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-neutral-soft">
                <span className="font-heading font-black text-6xl text-stroke opacity-20 mb-2">
                  ANR
                </span>
                <p className="text-xs font-bold text-muted uppercase">Profile Photo</p>
              </div>
            )}

            <div className="absolute bottom-3 left-3 right-3 bg-surface border-2 border-stroke p-3 shadow-neo-sm z-10">
              <p className="font-heading font-black text-xs uppercase tracking-wider text-stroke truncate">
                {loading ? (
                  <span className="block h-3.5 w-28 bg-neutral-soft animate-pulse" />
                ) : (
                  profile?.name || "Aditya Nur Rohim"
                )}
              </p>
              <p className="text-[10px] text-muted font-bold uppercase truncate mt-0.5">
                {loading ? (
                  <span className="block h-3 w-36 bg-neutral-soft animate-pulse" />
                ) : (
                  <>{profile?.study || "Computer Science"} &bull; {profile?.location || "Indonesia"}</>
                )}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Bio & Info Grid */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="md:col-span-7 space-y-6"
        >
          <div className="border-3 border-stroke bg-surface p-6 sm:p-8 shadow-neo-lg">
            <h3 className="font-heading font-black text-xl uppercase tracking-tight text-stroke mb-4">
              Hello World!
            </h3>
            {loading ? (
              <div className="space-y-2">
                <div className="h-5 border-2 border-stroke bg-neutral-soft animate-pulse w-full" />
                <div className="h-5 border-2 border-stroke bg-neutral-soft animate-pulse w-5/6" />
                <div className="h-5 border-2 border-stroke bg-neutral-soft animate-pulse w-4/6" />
              </div>
            ) : (
              <p className="text-base sm:text-lg text-muted font-medium leading-relaxed">
                {profile?.bio ||
                  "I'm a Computer Science student from Indonesia with a deep focus on Backend Engineering and Data Analytics."}
              </p>
            )}
          </div>

          {/* Info cards in 2x2 grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: "Location", value: loading ? undefined : (profile?.location || "Indonesia") },
              { label: "Focus", value: loading ? undefined : (profile?.focus || "Backend & Data Analytics") },
              { label: "Education", value: loading ? undefined : (profile?.study || "Computer Science") },
              { label: "Email", value: loading ? undefined : (profile?.email || "business@adplay.id") },
            ].map((item) => (
              <div
                key={item.label}
                className="border-2 border-stroke bg-surface shadow-neo-sm p-4 hover:shadow-neo hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all"
              >
                <p className="font-heading font-bold text-[10px] uppercase tracking-wider text-muted">
                  {item.label}
                </p>
                {item.value ? (
                  <p className="font-heading font-bold text-sm sm:text-base text-stroke mt-1 truncate">
                    {item.value}
                  </p>
                ) : (
                  <div className="h-4 border-2 border-stroke bg-neutral-soft animate-pulse mt-1 w-3/4" />
                )}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
