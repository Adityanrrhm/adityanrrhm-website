"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Copy, Check, ExternalLink } from "lucide-react";
import { fetchAPI, wrapData } from "@/lib/api";

interface Profile {
  email: string;
}

interface SocialLink {
  platform: string;
  url: string;
}

export default function CTA() {
  const [copied, setCopied] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);

  useEffect(() => {
    fetchAPI<{ data: Profile }>("profile")
      .then((res) => setProfile(wrapData(res)))
      .catch(() => {});
    fetchAPI<{ data: SocialLink[] }>("social-links")
      .then((res) => setSocialLinks(wrapData(res)))
      .catch(() => {});
  }, []);

  const email = profile?.email || "adityanurrohim19@gmail.com";
  const linkedIn = socialLinks.find((l) => l.platform === "LinkedIn")?.url || "https://linkedin.com/in/adityanurrohim";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = email;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <section
      id="contact"
      className="section-padding py-16 sm:py-24"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="border-3 border-stroke bg-surface p-8 sm:p-12 md:p-16 shadow-neo-xl text-center max-w-4xl mx-auto relative"
      >
        <span className="badge-neo badge-neo-active mb-4">
          GET IN TOUCH
        </span>

        <h2 className="font-heading font-black text-3xl sm:text-5xl md:text-6xl uppercase tracking-tight text-stroke mb-4 leading-tight">
          Let&apos;s <span className="bg-accent text-white px-3 py-0.5 inline-block -rotate-1 shadow-neo-sm">Build Something</span> Bold & Meaningful
        </h2>

        <p className="text-muted text-base sm:text-lg max-w-xl mx-auto mb-8 font-medium leading-relaxed">
          Tertarik untuk berkolaborasi, mendiskusikan rekayasa data, arsitektur cloud, atau pengembangan produk web? Mari terhubung.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={handleCopy}
            className="btn-neo-primary w-full sm:w-auto text-xs py-3 px-6 flex items-center justify-center gap-2.5"
          >
            {copied ? <Check className="w-4 h-4 stroke-[2.5]" /> : <Copy className="w-4 h-4 stroke-[2.5]" />}
            <span>{copied ? "Email Tersalin!" : email}</span>
          </button>

          <a
            href={linkedIn}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-neo-secondary w-full sm:w-auto text-xs py-3 px-6 flex items-center justify-center gap-2.5"
          >
            <ExternalLink className="w-4 h-4 stroke-[2.5]" />
            <span>Lihat Profil LinkedIn</span>
          </a>
        </div>
      </motion.div>
    </section>
  );
}
