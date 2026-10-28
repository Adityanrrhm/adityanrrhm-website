"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-canvas">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="border-3 border-stroke bg-surface shadow-neo-xl p-8 sm:p-14 text-center max-w-lg w-full relative"
      >
        <span className="badge-neo badge-neo-active mb-4">
          ERROR 404
        </span>

        <h1 className="font-heading font-black text-6xl sm:text-8xl uppercase tracking-tighter text-stroke mb-2">
          404<span className="text-accent">.</span>
        </h1>

        <p className="font-heading font-black text-xl uppercase tracking-tight text-stroke mb-3">
          Page Not Found
        </p>

        <p className="text-muted text-sm sm:text-base font-medium mb-8 leading-relaxed">
          The page you&apos;re looking for may have been moved, deleted, or the link you entered is incorrect.
        </p>

        <Link
          href="/"
          className="btn-neo-primary w-full sm:w-auto text-xs py-3 px-6 flex items-center justify-center gap-2"
        >
          <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
          <span>Back to Home</span>
        </Link>
      </motion.div>
    </div>
  );
}
