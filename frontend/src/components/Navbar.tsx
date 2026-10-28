"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Download, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { fetchAPI, wrapData } from "@/lib/api";

interface Profile {
  name: string;
  cvUrl: string | null;
}

export default function Navbar() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    fetchAPI<{ data: Profile }>("profile")
      .then((res) => setProfile(wrapData(res)))
      .catch(() => {});
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full bg-surface border-b-3 border-stroke">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 flex items-center justify-between h-18 sm:h-20">
        {/* Brand Logo & Name */}
        <Link href="/" className="flex items-center gap-3 group select-none">
          <div className="w-9 h-9 border-2 border-stroke bg-surface flex items-center justify-center p-1 shadow-neo-sm group-hover:-translate-x-0.5 group-hover:-translate-y-0.5 group-hover:shadow-neo transition-all relative">
            <Image 
              src="/assets/logo_web_Adityanrrhm.png" 
              alt="Logo" 
              width={28}
              height={28}
              className="h-full w-auto object-contain" 
            />
          </div>
          <span className="font-heading font-black text-lg sm:text-xl md:text-2xl tracking-tighter uppercase text-stroke">
            {profile?.name ? profile.name : "PORTFOLIO"}
            <span className="text-accent">.</span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8 font-heading font-bold uppercase text-xs lg:text-sm tracking-wider text-stroke">
          <Link href="/project" className="hover:text-accent hover:underline decoration-2 transition-colors py-1">
            Projects
          </Link>
          <Link href="/certificate" className="hover:text-accent hover:underline decoration-2 transition-colors py-1">
            Certificates
          </Link>
          <Link href="/experience" className="hover:text-accent hover:underline decoration-2 transition-colors py-1">
            Experience
          </Link>
          <Link href="/about" className="hover:text-accent hover:underline decoration-2 transition-colors py-1">
            About
          </Link>
        </nav>

        {/* Desktop Download CV Button */}
        <div className="hidden md:flex items-center">
          {profile?.cvUrl ? (
            <a
              href={profile.cvUrl}
              download
              className="btn-neo-primary text-xs py-2.5 px-5 flex items-center gap-2"
            >
              <Download className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Download CV</span>
            </a>
          ) : (
            <div className="btn-neo-primary text-xs py-2.5 px-5 flex items-center gap-2 opacity-40 cursor-not-allowed pointer-events-none">
              <Download className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Download CV</span>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="flex md:hidden p-2 border-2 border-stroke bg-surface shadow-neo-sm active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer text-stroke"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6 stroke-[2.5]" /> : <Menu className="w-6 h-6 stroke-[2.5]" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="border-t-3 border-stroke bg-surface px-6 py-6 flex flex-col gap-4 md:hidden shadow-neo-xl overflow-hidden"
          >
            <Link
              href="/project"
              onClick={() => setIsMobileMenuOpen(false)}
              className="font-heading font-bold uppercase text-sm tracking-wider text-stroke py-2 border-b-2 border-neutral-soft hover:text-accent transition-colors"
            >
              Projects
            </Link>
            <Link
              href="/certificate"
              onClick={() => setIsMobileMenuOpen(false)}
              className="font-heading font-bold uppercase text-sm tracking-wider text-stroke py-2 border-b-2 border-neutral-soft hover:text-accent transition-colors"
            >
              Certificates
            </Link>
            <Link
              href="/experience"
              onClick={() => setIsMobileMenuOpen(false)}
              className="font-heading font-bold uppercase text-sm tracking-wider text-stroke py-2 border-b-2 border-neutral-soft hover:text-accent transition-colors"
            >
              Experience
            </Link>
            <Link
              href="/about"
              onClick={() => setIsMobileMenuOpen(false)}
              className="font-heading font-bold uppercase text-sm tracking-wider text-stroke py-2 border-b-2 border-neutral-soft hover:text-accent transition-colors"
            >
              About
            </Link>
            {profile?.cvUrl ? (
              <a
                href={profile.cvUrl}
                download
                onClick={() => setIsMobileMenuOpen(false)}
                className="btn-neo-primary w-full text-center text-xs py-3 mt-2 flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4 stroke-[2.5]" />
                <span>Download CV</span>
              </a>
            ) : (
              <div className="btn-neo-primary w-full text-center text-xs py-3 mt-2 flex items-center justify-center gap-2 opacity-40 cursor-not-allowed pointer-events-none">
                <Download className="w-4 h-4 stroke-[2.5]" />
                <span>Download CV</span>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
