"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { X, ArrowUpRight, ZoomIn } from "lucide-react";
import { fetchAPI, wrapData } from "@/lib/api";
import { formatPeriod } from "@/lib/formatDate";

interface Experience {
  id: number;
  role: string;
  company: string;
  type: string;
  periodStart: string;
  periodEnd: string | null;
  points: string[];
  imageUrls: string[];
  companyLogoUrl: string | null;
}

export default function Experience({
  isPreview = false,
}: {
  isPreview?: boolean;
}) {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalImage, setModalImage] = useState<string | null>(null);

  useEffect(() => {
    fetchAPI<{ data: Experience[] }>("experiences")
      .then((res) => {
        setExperiences(wrapData(res));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!modalImage) return;
    document.body.style.overflow = "hidden";
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setModalImage(null);
    };
    window.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKey);
    };
  }, [modalImage]);

  const displayExperiences = isPreview ? experiences.slice(0, 2) : experiences;

  return (
    <section className="section-padding py-16 sm:py-20 border-t-3 border-stroke">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <span className="badge-neo mb-3">
            {isPreview ? "(IV) CAREER PATH" : "CAREER ARCHIVE"}
          </span>
          <h2 className="font-heading font-black text-3xl sm:text-4xl md:text-5xl uppercase tracking-tight text-stroke">
            Experience<span className="text-accent">.</span>
          </h2>
          {!isPreview && (
            <p className="text-muted text-base sm:text-lg font-medium mt-2 max-w-2xl">
              A record of my work experience, professional contributions, and skills developed over time.
            </p>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="mt-6 md:mt-0"
        >
          {isPreview && (
            <Link
              href="/experience"
              className="btn-neo-secondary text-xs py-2.5 px-5 flex items-center gap-1.5"
            >
              <span>All Experience</span>
              <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
            </Link>
          )}
        </motion.div>
      </div>

      {loading ? (
        <div className="space-y-8 max-w-4xl mx-auto">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="border-3 border-stroke bg-surface shadow-neo-lg p-6 sm:p-8 animate-pulse"
            >
              {/* Header skeleton */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b-2 border-neutral-soft mb-6">
                <div className="space-y-2">
                  <div className="h-6 w-48 border-2 border-stroke bg-neutral-soft" />
                  <div className="h-4 w-32 border-2 border-stroke bg-neutral-soft" />
                </div>
                <div className="h-6 w-28 border-2 border-stroke bg-neutral-soft shrink-0" />
              </div>
              {/* Points skeleton */}
              <div className="space-y-3 mb-6">
                {[1, 2, 3].map((j) => (
                  <div key={j} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-neutral-soft border border-stroke mt-2 shrink-0" />
                    <div className="h-4 bg-neutral-soft border-2 border-stroke w-full" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : displayExperiences.length === 0 ? (
        <div className="p-12 border-3 border-stroke bg-surface shadow-neo text-center max-w-md mx-auto my-12">
          <p className="font-heading font-bold uppercase text-muted">
            No experience data available.
          </p>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto space-y-8">
          {displayExperiences.map((exp, index) => (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="border-3 border-stroke bg-surface shadow-neo-lg p-6 sm:p-8 relative"
            >
              {/* Header row inside card */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b-2 border-neutral-soft mb-6">
                <div>
                  <h3 className="font-heading font-black text-xl sm:text-2xl uppercase tracking-tight text-stroke">
                    {exp.role}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    {exp.companyLogoUrl && (
                      <div className="w-6 h-6 relative border border-stroke bg-white shrink-0 p-0.5">
                        <Image
                          src={exp.companyLogoUrl}
                          alt={exp.company}
                          fill
                          className="object-contain"
                        />
                      </div>
                    )}
                    <span className="font-heading font-bold text-sm text-accent uppercase tracking-wider">
                      {exp.company}
                    </span>
                    <span className="text-muted text-xs">&bull;</span>
                    <span className="text-xs font-bold text-muted uppercase">
                      {exp.type}
                    </span>
                  </div>
                </div>

                <div className="sm:text-right shrink-0">
                  <span className="badge-neo text-[11px] py-1 px-2.5">
                    {formatPeriod(exp.periodStart)} —{" "}
                    {exp.periodEnd ? formatPeriod(exp.periodEnd) : "PRESENT"}
                  </span>
                </div>
              </div>

              {/* Responsibilities list */}
              {exp.points.length > 0 && (
                <ul className="space-y-3 mb-6">
                  {exp.points.map((point, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm sm:text-base text-muted font-medium">
                      <span className="w-2 h-2 bg-accent border border-stroke mt-2 shrink-0 block" />
                      <span className="leading-relaxed">{point}</span>
                    </li>
                  ))}
                </ul>
              )}

              {/* Documentation photo thumbnails */}
              {exp.imageUrls.length > 0 && (
                <div className="pt-4 border-t-2 border-neutral-soft">
                  <p className="font-heading font-bold text-xs uppercase tracking-wider text-muted mb-3">
                    Documentation & Work Evidence:
                  </p>
                  <div className="flex gap-4 flex-wrap">
                    {exp.imageUrls.map((url, i) => (
                      <div
                        key={i}
                        onClick={() => setModalImage(url)}
                        className="relative w-36 sm:w-44 aspect-[4/3] border-2 border-stroke bg-neutral-soft shadow-neo-sm hover:shadow-neo hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all cursor-pointer overflow-hidden group select-none"
                      >
                        <Image
                          src={url}
                          alt={`${exp.company} documentation ${i + 1}`}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <span className="badge-neo text-[10px] py-0.5 px-1.5 flex items-center gap-1">
                            <ZoomIn className="w-3 h-3" />
                            <span>View</span>
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}

      {/* Image Preview Modal */}
      <AnimatePresence>
        {modalImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setModalImage(null)}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 md:p-8"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="border-3 border-stroke bg-surface shadow-neo-xl w-full max-w-4xl max-h-[90vh] p-4 sm:p-6 relative overflow-hidden flex flex-col"
            >
              <button
                onClick={() => setModalImage(null)}
                className="absolute top-4 right-4 z-30 p-2 border-2 border-stroke bg-surface shadow-neo-sm hover:shadow-neo active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer text-stroke"
                aria-label="Close modal"
              >
                <X className="w-5 h-5 stroke-[2.5]" />
              </button>

              <div className="relative w-full h-[60vh] sm:h-[75vh] border-2 border-stroke bg-neutral-soft mt-8 overflow-hidden">
                <Image
                  src={modalImage}
                  alt="Documentation"
                  fill
                  className="object-contain p-2"
                  sizes="(max-width: 1024px) 100vw, 896px"
                  priority
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
