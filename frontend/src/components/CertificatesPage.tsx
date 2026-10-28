"use client";

import { useState, useCallback, useEffect, memo } from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  animate,
  AnimatePresence,
} from "framer-motion";
import { ChevronLeft, ChevronRight, X, ZoomIn, ArrowUpRight } from "lucide-react";
import Img from "@/components/Img";
import { fetchAPI, wrapData } from "@/lib/api";
import { formatDate } from "@/lib/formatDate";

interface Certificate {
  id: number;
  title: string;
  org: string;
  category: string;
  issuedDate: string;
  description: string;
  imageUrl: string | null;
}

const CARD_W = 360;
const GAP = 28;
const STEP = CARD_W + GAP;

const CertificateCard = memo(function CertificateCard({
  cert,
  cardIndex,
  carouselX,
  onSelect,
}: {
  cert: Certificate;
  cardIndex: number;
  carouselX: ReturnType<typeof useMotionValue<number>>;
  onSelect: (cert: Certificate) => void;
}) {
  const dist = useTransform(() => {
    return Math.abs(carouselX.get() + cardIndex * STEP);
  });

  const cardScale = useTransform(dist, (d) => {
    if (d < 60) return 1;
    if (d < STEP) return 1 - (1 - 0.88) * ((d - 60) / (STEP - 60));
    return 0.88;
  });

  const cardOpacity = useTransform(dist, (d) => {
    if (d < 80) return 1;
    if (d < STEP * 1.2) return 0.75;
    return 0.15;
  });

  const cardZ = useTransform(dist, (d) => {
    if (d < 60) return 3;
    if (d < STEP) return 2;
    return 1;
  });

  return (
    <motion.div
      style={{
        scale: cardScale,
        opacity: cardOpacity,
        zIndex: cardZ,
      }}
      whileHover={{ y: -6, transition: { duration: 0.15 } }}
      onClick={() => onSelect(cert)}
      className="shrink-0 w-[320px] sm:w-[360px] h-[460px] sm:h-[480px] border-3 border-stroke bg-surface shadow-neo-lg p-5 flex flex-col cursor-pointer select-none will-change-transform group"
    >
      {/* Certificate Image Box */}
      <div className="flex-1 bg-neutral-soft border-2 border-stroke relative overflow-hidden flex items-center justify-center p-3 mb-4">
        {cert.imageUrl ? (
          <Img
            src={cert.imageUrl}
            alt={cert.title}
            containerClassName="w-full h-full"
            imgClassName="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="text-center p-4">
            <span className="font-heading font-black text-4xl text-stroke opacity-20 block mb-2">
              {cert.org.charAt(0)}
            </span>
            <p className="font-heading font-black text-xs uppercase text-stroke line-clamp-2">
              {cert.title}
            </p>
          </div>
        )}
        <div className="absolute top-2 left-2">
          <span className="badge-neo text-[10px] py-0.5 px-2">
            {cert.category}
          </span>
        </div>
      </div>

      {/* Info Block */}
      <div className="flex flex-col">
        <h3 className="font-heading font-black text-sm sm:text-base uppercase tracking-tight text-stroke line-clamp-1 mb-1">
          {cert.title}
        </h3>
        <p className="text-xs font-bold text-muted uppercase tracking-wider mb-1">
          {cert.org}
        </p>
        <p className="text-[11px] text-muted font-medium mb-3">
          {formatDate(cert.issuedDate)}
        </p>

        <div className="btn-neo-secondary text-xs py-1.5 px-3 text-center w-full flex items-center justify-center gap-1.5 mt-auto">
          <span>Certificate Details</span>
          <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
        </div>
      </div>
    </motion.div>
  );
});

function CertificateModal({
  cert,
  onClose,
}: {
  cert: Certificate;
  onClose: () => void;
}) {
  const [zoomed, setZoomed] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 md:p-8"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-surface border-3 border-stroke shadow-neo-xl w-full max-w-4xl max-h-[90vh] flex flex-col md:flex-row relative overflow-y-auto md:overflow-hidden"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-30 p-2 border-2 border-stroke bg-surface shadow-neo-sm hover:shadow-neo active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer text-stroke"
          aria-label="Close modal"
        >
          <X className="w-5 h-5 stroke-[2.5]" />
        </button>

        {/* Modal Left Preview */}
        <div className="md:w-[58%] border-b-3 md:border-b-0 md:border-r-3 border-stroke bg-neutral-soft flex items-center justify-center min-h-[260px] md:min-h-[420px] p-6 relative overflow-hidden">
          {cert.imageUrl ? (
            <Img
              src={cert.imageUrl}
              alt={cert.title}
              containerClassName="w-full h-full"
              imgClassName={`w-full h-full object-contain transition-transform duration-200 ${
                zoomed ? "scale-125" : "scale-100"
              }`}
            />
          ) : (
            <div className="text-center p-6">
              <span className="font-heading font-black text-6xl text-stroke opacity-20 block mb-3">
                {cert.org.charAt(0)}
              </span>
              <p className="font-heading font-black text-lg uppercase text-stroke">
                {cert.title}
              </p>
              <p className="text-xs font-bold text-muted uppercase mt-1">{cert.org}</p>
            </div>
          )}
        </div>

        {/* Modal Right Info */}
        <div className="md:w-[42%] p-6 md:p-8 flex flex-col justify-between overflow-y-auto bg-surface">
          <div>
            <div className="mb-2">
              <span className="badge-neo text-xs">{cert.category}</span>
            </div>
            <h2 className="font-heading font-black text-2xl md:text-3xl uppercase tracking-tight text-stroke mb-2">
              {cert.title}
            </h2>
            <p className="font-heading font-bold text-sm text-accent uppercase tracking-wider mb-6">
              {cert.org}
            </p>

            <div className="space-y-4 mb-6">
              <div className="p-3 border-2 border-stroke bg-neutral-soft">
                <p className="font-heading font-bold text-[10px] uppercase tracking-wider text-muted">
                  Issue Date:
                </p>
                <p className="font-heading font-bold text-xs uppercase text-stroke mt-0.5">
                  {formatDate(cert.issuedDate)}
                </p>
              </div>

              {cert.description && (
                <div>
                  <p className="font-heading font-bold text-xs uppercase tracking-wider text-stroke mb-1.5">
                    Description:
                  </p>
                  <p className="text-muted text-sm leading-relaxed font-medium">
                    {cert.description}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="pt-4 border-t-2 border-neutral-soft flex items-center justify-between">
            <button
              onClick={() => setZoomed(!zoomed)}
              className="btn-neo-secondary text-xs py-2 px-4 flex items-center gap-1.5"
            >
              <ZoomIn className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>{zoomed ? "Reset View" : "Zoom In"}</span>
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function CertificatesPage() {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);
  const [index, setIndex] = useState(0);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const carouselX = useMotionValue(0);

  useEffect(() => {
    fetchAPI<{ data: Certificate[] }>("certificates")
      .then((res) => {
        setCertificates(wrapData(res));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const categories = [
    "All",
    ...new Set(certificates.map((c) => c.category).filter(Boolean)),
  ] as string[];

  const filtered =
    activeCategory === "All"
      ? certificates
      : certificates.filter((c) => c.category === activeCategory);

  const maxIdx = Math.max(0, filtered.length - 1);

  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat);
    setIndex(0);
    carouselX.set(0);
  };

  const goTo = useCallback(
    (i: number) => {
      const idx = Math.max(0, Math.min(i, maxIdx));
      animate(carouselX, -idx * STEP, {
        type: "spring",
        stiffness: 300,
        damping: 28,
        mass: 0.8,
      });
      setIndex(idx);
    },
    [maxIdx, carouselX],
  );

  const handleDragEnd = useCallback(
    (_: MouseEvent | TouchEvent | PointerEvent, info: { offset: { x: number }; velocity: { x: number } }) => {
      const current = carouselX.get();
      const rawIdx = Math.round(-current / STEP);
      const clampedIdx = Math.max(0, Math.min(rawIdx, maxIdx));

      animate(carouselX, -clampedIdx * STEP, {
        type: "spring",
        velocity: info.velocity.x,
        stiffness: 320,
        damping: 26,
        mass: 0.9,
      });
      setIndex(clampedIdx);
    },
    [maxIdx, carouselX],
  );

  if (loading) {
    return (
      <section className="section-padding py-16">
        <div className="animate-pulse space-y-6">
          {/* Header skeleton */}
          <div className="h-6 w-40 border-2 border-stroke bg-neutral-soft" />
          <div className="h-14 w-80 border-3 border-stroke bg-neutral-soft" />
          <div className="h-5 w-96 border-2 border-stroke bg-neutral-soft" />
          {/* Filter badges skeleton */}
          <div className="flex gap-2.5 mt-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-7 w-20 border-2 border-stroke bg-neutral-soft" />
            ))}
          </div>
          {/* Cards skeleton */}
          <div className="flex gap-6 mt-6 overflow-hidden">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="shrink-0 w-[320px] sm:w-[360px] h-[460px] sm:h-[480px] border-3 border-stroke bg-surface shadow-neo-lg p-5 flex flex-col"
              >
                {/* Image area */}
                <div className="flex-1 bg-neutral-soft border-2 border-stroke mb-4" />
                {/* Info area */}
                <div className="space-y-2">
                  <div className="h-4 w-3/4 bg-neutral-soft border-2 border-stroke" />
                  <div className="h-3 w-1/2 bg-neutral-soft border-2 border-stroke" />
                  <div className="h-3 w-1/3 bg-neutral-soft border-2 border-stroke" />
                  <div className="h-8 w-full bg-neutral-soft border-2 border-stroke mt-2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section-padding py-12 sm:py-16 overflow-hidden">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        className="mb-8"
      >
        <span className="badge-neo mb-3">CREDENTIALS ARCHIVE</span>
        <h1 className="font-heading font-black text-4xl sm:text-5xl md:text-6xl uppercase tracking-tight text-stroke">
          All Certificates<span className="text-accent">.</span>
        </h1>
        <p className="text-muted text-base sm:text-lg font-medium mt-2 max-w-2xl">
          Documentation of professional skill certifications in data analytics, cloud, and system development.
        </p>
      </motion.div>

      {/* Categories */}
      <div className="flex flex-wrap gap-2.5 mb-10 mt-6">
        {categories.map((cat) => {
          const count =
            cat === "All"
              ? certificates.length
              : certificates.filter((c) => c.category === cat).length;
          const isActive = activeCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`badge-neo cursor-pointer transition-all active:translate-x-0.5 active:translate-y-0.5 active:shadow-none ${
                isActive ? "badge-neo-active shadow-neo" : "bg-surface hover:bg-neutral-soft"
              }`}
            >
              <span>{cat}</span>
              <span className="ml-1.5 opacity-75">({count})</span>
            </button>
          );
        })}
      </div>

      {/* Carousel */}
      <div className="relative select-none py-4">
        <motion.div
          className="flex items-center"
          drag="x"
          style={{
            x: carouselX,
            gap: GAP,
            paddingLeft: `calc(50% - ${CARD_W / 2}px)`,
            paddingRight: `calc(50% - ${CARD_W / 2}px)`,
          }}
          dragElastic={0.08}
          onDragEnd={handleDragEnd}
        >
          {filtered.map((cert, i) => (
            <CertificateCard
              key={cert.id}
              cert={cert}
              cardIndex={i}
              carouselX={carouselX}
              onSelect={setSelectedCert}
            />
          ))}
        </motion.div>
      </div>

      {/* Navigation Controls */}
      <div className="flex justify-center items-center gap-6 mt-8">
        <button
          onClick={() => goTo(index - 1)}
          disabled={index === 0}
          className="w-11 h-11 border-3 border-stroke bg-surface shadow-neo hover:shadow-neo-lg active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
          aria-label="Previous certificate"
        >
          <ChevronLeft className="w-5 h-5 text-stroke stroke-[2.5]" />
        </button>

        <div className="flex items-center gap-2">
          {filtered.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`border border-stroke transition-all duration-200 cursor-pointer ${
                i === index ? "bg-accent w-8 h-3 shadow-neo-sm" : "bg-neutral-soft w-3 h-3 hover:bg-surface"
              }`}
              aria-label={`Go to certificate ${i + 1}`}
            />
          ))}
        </div>

        <button
          onClick={() => goTo(index + 1)}
          disabled={index === maxIdx}
          className="w-11 h-11 border-3 border-stroke bg-surface shadow-neo hover:shadow-neo-lg active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
          aria-label="Next certificate"
        >
          <ChevronRight className="w-5 h-5 text-stroke stroke-[2.5]" />
        </button>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedCert && (
          <CertificateModal
            cert={selectedCert}
            onClose={() => setSelectedCert(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
