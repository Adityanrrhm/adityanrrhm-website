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

  useEffect(() => {
    fetchAPI<{ data: Profile }>("profile")
      .then((res) => {
        const unwrapped = wrapData(res) as unknown as { data?: Profile } | Profile;
        const profileData = (unwrapped as { data?: Profile })?.data
          ? (unwrapped as { data?: Profile }).data!
          : (unwrapped as Profile);
        setProfile(profileData);
      })
      .catch((err) => console.error("Gagal fetch profile:", err));
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
            Latar belakang, minat teknologi, dan pendekatan saya dalam memecahkan masalah rekayasa data dan web.
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
            {profile?.photoUrl ? (
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
                <p className="text-xs font-bold text-muted uppercase">Foto Profil</p>
              </div>
            )}

            <div className="absolute bottom-3 left-3 right-3 bg-surface border-2 border-stroke p-3 shadow-neo-sm z-10">
              <p className="font-heading font-black text-xs uppercase tracking-wider text-stroke truncate">
                {profile?.name || "Aditya Nur Rohim"}
              </p>
              <p className="text-[10px] text-muted font-bold uppercase truncate">
                {profile?.study || "Computer Science"} &bull; {profile?.location || "Indonesia"}
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
            <p className="text-base sm:text-lg text-muted font-medium leading-relaxed">
              {profile?.bio ||
                "I'm a Computer Science student from Indonesia with a deep interest in Data Analytics and Web Development."}
            </p>
          </div>

          {/* Info cards in 2x2 grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: "Lokasi", value: profile?.location || "Indonesia" },
              { label: "Fokus Keahlian", value: profile?.focus || "Data & Cloud" },
              { label: "Pendidikan", value: profile?.study || "Computer Science" },
              { label: "Email Kontak", value: profile?.email || "business@adplay.id" },
            ].map((item) => (
              <div
                key={item.label}
                className="border-2 border-stroke bg-surface shadow-neo-sm p-4 hover:shadow-neo hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all"
              >
                <p className="font-heading font-bold text-[10px] uppercase tracking-wider text-muted">
                  {item.label}
                </p>
                <p className="font-heading font-bold text-sm sm:text-base text-stroke mt-1 truncate">
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
