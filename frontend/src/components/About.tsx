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
        const unwrapped = wrapData(res) as any;
        const profileData = unwrapped?.data ? unwrapped.data : unwrapped;
        setProfile(profileData);
      })
      .catch((err) => console.error("Gagal fetch profile:", err));
  }, []);

  return (
    <section
      id="about"
      className="section-padding py-20 border-t border-gray-100 scroll-mt-24"
    >
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        className="mb-12"
      >
        {isPreview && (
          <p className="text-sm text-gray-500 mb-2 uppercase tracking-widest">
            (III) ABOUT ME
          </p>
        )}
        <h2 className="font-heading text-4xl md:text-5xl font-bold">
          About me.
        </h2>
        {!isPreview && (
          <p className="text-gray-400 mt-2">
            Learn more about my background and expertise.
          </p>
        )}
      </motion.div>

      <div className="grid md:grid-cols-12 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="md:col-span-5 flex justify-center"
        >
          <div className="w-[260px] md:w-[320px]">
            <div className="aspect-[4/5] rounded-3xl bg-white border-[6px] border-white shadow-[0_20px_40px_-15px_rgba(0,0,0,0.15)] overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100" />
              {profile?.photoUrl ? (
                <Image
                  src={profile.photoUrl}
                  alt={profile.name || "Aditya Nur Rohim"}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.876 0-5.59-.205-8.107-.582Z"
                      />
                    </svg>
                  </div>
                  <p className="text-xs text-gray-400">Add your photo</p>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="md:col-span-7 space-y-5"
        >
          <p className="text-lg text-gray-600 leading-relaxed">
            {profile?.bio ||
              "I'm a Computer Science student from Indonesia with a deep interest in Data Analytics and Web Development."}
          </p>

          <div className="w-12 h-px bg-gray-200 my-6" />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {[
              { label: "Location", value: profile?.location || "Indonesia" },
              { label: "Focus", value: profile?.focus || "Data & Cloud" },
              { label: "Study", value: profile?.study || "Computer Science" },
              { label: "Email", value: profile?.email || "business@adplay.id" },
            ].map((item) => (
              <div key={item.label}>
                <p className="text-xs text-gray-400 uppercase tracking-wider">
                  {item.label}
                </p>
                <p className="text-sm text-gray-800 font-medium mt-0.5">
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
