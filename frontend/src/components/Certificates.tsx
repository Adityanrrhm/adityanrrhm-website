"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ZoomIn, X, ArrowUpRight } from "lucide-react";
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

const PREVIEW_COUNT = 6;

function CardStack({
  certificates,
  onCardClick,
  deckAngle = 0,
}: {
  certificates: Certificate[];
  onCardClick?: (cert: Certificate) => void;
  deckAngle?: number;
}) {
  const [items, setItems] = useState(certificates);
  const [swipingId, setSwipingId] = useState<number | null>(null);
  const [swipeDir, setSwipeDir] = useState(0);
  const [swipeVelocity, setSwipeVelocity] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const didDrag = useRef(false);

  const handleDragEnd = useCallback(
    (certId: number, _: MouseEvent | TouchEvent | PointerEvent, info: { offset: { x: number }; velocity: { x: number } }) => {
      if (Math.abs(info.offset.x) <= 70 && Math.abs(info.velocity.x) <= 300) return;

      didDrag.current = true;
      const dir = info.offset.x > 0 || info.velocity.x > 0 ? 1 : -1;
      setSwipingId(certId);
      setSwipeDir(dir);
      setSwipeVelocity(info.velocity.x);

      setTimeout(() => {
        setItems((prev) => {
          const idx = prev.findIndex((c) => c.id === certId);
          if (idx === -1) return prev;
          const next = [...prev];
          next.push(next.splice(idx, 1)[0]);
          return next;
        });
        setSwipingId(null);
        setSwipeDir(0);
        setSwipeVelocity(0);
      }, 350);
    },
    [],
  );

  const handleCardClick = useCallback(
    (certId: number) => {
      if (swipingId) return;
      const cert = items.find((c) => c.id === certId);
      if (cert) onCardClick?.(cert);
    },
    [items, swipingId, onCardClick],
  );

  return (
    <motion.div
      animate={{ rotate: isHovered ? 0 : deckAngle }}
      transition={{ duration: 0.2 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="relative w-full"
      style={{ height: 460 }}
    >
      {items.map((cert, i) => {
        const isTop = i === 0;
        const isSwiping = swipingId === cert.id;
        const clampedIdx = Math.min(i, 5);
        const targetY = clampedIdx * 8;
        const targetScale = 1 - clampedIdx * 0.03;
        const zIndex = items.length - i;

        return (
          <motion.div
            key={cert.id}
            layout
            initial={false}
            animate={{
              y: isSwiping ? clampedIdx * 8 : targetY,
              scale: isSwiping ? targetScale : targetScale,
              x: isSwiping ? swipeDir * 350 : 0,
              opacity: isSwiping ? 0 : i < 6 ? 1 : 0,
            }}
            transition={{
              type: "spring",
              stiffness: isSwiping ? 220 : 350,
              damping: isSwiping ? 18 : 32,
              mass: isSwiping ? 1.2 : 0.9,
              velocity: isSwiping ? swipeVelocity : undefined,
            }}
            drag={isTop && !swipingId ? "x" : false}
            dragElastic={0.12}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onDragEnd={(_, info: any) => handleDragEnd(cert.id, _, info)}
            whileDrag={{
              scale: 1.02,
              rotate: 3,
              cursor: "grabbing",
            }}
            whileHover={
              isTop && !swipingId
                ? {
                    y: -4,
                    transition: { duration: 0.1 },
                  }
                : undefined
            }
            onMouseDown={() => { didDrag.current = false; }}
            onClick={() => {
              if (didDrag.current) { didDrag.current = false; return; }
              if (isTop && !swipingId) handleCardClick(cert.id);
            }}
            className="absolute inset-x-0 border-3 border-stroke bg-surface shadow-neo-lg overflow-hidden cursor-grab select-none will-change-transform"
            style={{
              zIndex,
              touchAction: isTop && !swipingId ? "none" : "pan-y",
              pointerEvents: isSwiping ? "none" : "auto",
            }}
          >
            <div className="h-[310px] bg-neutral-soft border-b-3 border-stroke flex items-center justify-center p-4 overflow-hidden relative">
              {cert.imageUrl ? (
                <Img
                  src={cert.imageUrl}
                  alt={cert.title}
                  containerClassName="w-full h-full"
                  imgClassName="w-full h-full object-contain"
                />
              ) : (
                <div className="w-full h-full bg-surface border-2 border-stroke flex flex-col items-center justify-center p-4">
                  <p className="font-heading font-black text-xs uppercase text-stroke text-center line-clamp-2">
                    {cert.title}
                  </p>
                  <p className="text-[10px] text-muted font-bold uppercase mt-1">
                    {cert.org}
                  </p>
                </div>
              )}
              <div className="absolute top-2 left-2">
                <span className="badge-neo text-[9px] py-0.5 px-1.5">
                  {cert.category}
                </span>
              </div>
            </div>

            <div className="p-3.5 bg-surface">
              <h3 className="font-heading font-black text-xs uppercase tracking-tight text-stroke leading-snug line-clamp-1">
                {cert.title}
              </h3>
              <p className="text-[11px] font-bold text-muted uppercase mt-0.5 truncate">{cert.org}</p>
              <p className="text-[10px] text-muted font-medium mt-0.5">{formatDate(cert.issuedDate)}</p>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}

export default function Certificates({ isPreview = false }: { isPreview?: boolean }) {
  const [modalCert, setModalCert] = useState<Certificate | null>(null);
  const [zoomed, setZoomed] = useState(false);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAPI<{ data: Certificate[] }>("certificates")
      .then((res) => {
        setCertificates(wrapData(res));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const displayCerts = isPreview
    ? certificates.slice(0, PREVIEW_COUNT)
    : certificates;

  const MID = Math.ceil(displayCerts.length / 2);

  if (loading) {
    return (
      <section className="section-padding py-16 border-t-3 border-stroke">
        <div className="animate-pulse">
          {/* Header skeleton */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
            <div className="space-y-3">
              <div className="h-6 w-32 border-2 border-stroke bg-neutral-soft" />
              <div className="h-10 w-48 border-3 border-stroke bg-neutral-soft" />
            </div>
          </div>
          {/* Hint text skeleton */}
          <div className="h-4 w-64 border-2 border-stroke bg-neutral-soft mx-auto mb-10" />
          {/* Card stacks skeleton */}
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 max-w-3xl mx-auto">
            {[0, 1].map((i) => (
              <div key={i} className="w-full max-w-[270px] mx-auto" style={{ height: 460 }}>
                {/* Stacked card skeleton effect */}
                <div className="relative" style={{ height: 460 }}>
                  {[2, 1, 0].map((offset) => (
                    <div
                      key={offset}
                      className="absolute inset-x-0 border-3 border-stroke bg-neutral-soft shadow-neo-lg overflow-hidden"
                      style={{
                        top: offset * 8,
                        transform: `scale(${1 - offset * 0.03})`,
                        transformOrigin: "top center",
                        zIndex: 3 - offset,
                      }}
                    >
                      {/* Card image area */}
                      <div className="h-[310px] bg-neutral-soft border-b-3 border-stroke" />
                      {/* Card info area */}
                      <div className="p-3.5 space-y-1.5">
                        <div className="h-3 w-3/4 bg-neutral-soft border border-stroke" />
                        <div className="h-2.5 w-1/2 bg-neutral-soft border border-stroke" />
                        <div className="h-2 w-1/3 bg-neutral-soft border border-stroke" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section-padding py-16 sm:py-20 border-t-3 border-stroke overflow-hidden">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <span className="badge-neo mb-3">
            (II) CERTIFICATIONS
          </span>
          <h2 className="font-heading font-black text-3xl sm:text-4xl md:text-5xl uppercase tracking-tight text-stroke">
            Certificates<span className="text-accent">.</span>
          </h2>
        </motion.div>
        {isPreview && (
          <Link
            href="/certificate"
            className="mt-6 md:mt-0 btn-neo-secondary text-xs py-2.5 px-5 flex items-center gap-1.5"
          >
            <span>All Certificates</span>
            <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
          </Link>
        )}
      </div>

      <p className="text-xs sm:text-sm font-heading font-bold uppercase tracking-wider text-muted mb-10 text-center">
        ← Swipe cards to browse certificates →
      </p>

      <div className="grid md:grid-cols-2 gap-8 md:gap-12 max-w-3xl mx-auto">
        <div className="w-full max-w-[270px] mx-auto">
          <CardStack
            key={`left-${displayCerts.slice(0, MID).map((c) => c.id).join("-")}`}
            certificates={displayCerts.slice(0, MID)}
            deckAngle={-2.5}
            onCardClick={setModalCert}
          />
        </div>
        <div className="w-full max-w-[270px] mx-auto">
          <CardStack
            key={`right-${displayCerts.slice(MID).map((c) => c.id).join("-")}`}
            certificates={displayCerts.slice(MID)}
            deckAngle={2.5}
            onCardClick={setModalCert}
          />
        </div>
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {modalCert && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => {
              setModalCert(null);
              setZoomed(false);
            }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 md:p-8"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-surface border-3 border-stroke shadow-neo-xl relative flex flex-col w-full max-w-lg max-h-[90vh] overflow-hidden"
            >
              {/* Close Button */}
              <button
                onClick={() => {
                  setModalCert(null);
                  setZoomed(false);
                }}
                className="absolute top-3 right-3 z-30 p-2 border-2 border-stroke bg-surface shadow-neo-sm hover:shadow-neo active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer text-stroke"
                aria-label="Close modal"
              >
                <X className="w-4 h-4 stroke-[2.5]" />
              </button>

              <div className="w-full h-[320px] sm:h-[400px] bg-neutral-soft border-b-3 border-stroke flex items-center justify-center p-6 relative overflow-hidden">
                {modalCert.imageUrl ? (
                  <Img
                    src={modalCert.imageUrl}
                    alt={modalCert.title}
                    containerClassName="w-full h-full"
                    imgClassName={`w-full h-full object-contain transition-transform duration-200 ${
                      zoomed ? "scale-125" : "scale-100"
                    }`}
                  />
                ) : (
                  <div className="w-full h-full border-2 border-stroke bg-surface flex flex-col items-center justify-center p-8 text-center">
                    <p className="font-heading font-black text-base uppercase text-stroke mb-2">{modalCert.title}</p>
                    <p className="text-xs font-bold text-muted uppercase">{modalCert.org}</p>
                    <p className="text-[11px] text-muted mt-1">{formatDate(modalCert.issuedDate)}</p>
                  </div>
                )}
              </div>

              <div className="p-5 flex items-center justify-between gap-4 bg-surface">
                <div className="flex-1 min-w-0">
                  <h3 className="font-heading font-black text-sm uppercase text-stroke truncate">
                    {modalCert.title}
                  </h3>
                  <p className="text-xs text-muted font-bold uppercase mt-0.5">
                    {modalCert.org} &bull; {formatDate(modalCert.issuedDate)}
                  </p>
                </div>
                <button
                  onClick={() => setZoomed(!zoomed)}
                  className="btn-neo-secondary text-xs py-1.5 px-3 flex items-center gap-1.5"
                >
                  <ZoomIn className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>{zoomed ? "Reset" : "Zoom"}</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
