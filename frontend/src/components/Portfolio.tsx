"use client";

import { useState, useCallback, useEffect, memo } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ArrowUpRight } from "lucide-react";
import Img from "@/components/Img";
import { fetchAPI, wrapData } from "@/lib/api";

interface Project {
  id: number;
  title: string;
  category: string;
  label: string;
  description: string;
  techStack: string[];
  imageUrl: string | null;
  liveUrl: string | null;
  githubUrl: string | null;
}

const GAP = 28;

function ProjectCard({
  project,
  cardIndex,
  carouselX,
  onTap,
  cardWidth,
  step,
}: {
  project: Project;
  cardIndex: number;
  carouselX: ReturnType<typeof useMotionValue<number>>;
  onTap: () => void;
  cardWidth: number;
  step: number;
}) {
  const dist = useTransform(carouselX, (x) => {
    return Math.abs(x + cardIndex * step);
  });

  const cardScale = useTransform(dist, (d) => {
    if (d < 60) return 1;
    if (d < step) return 1 - (1 - 0.88) * ((d - 60) / (step - 60));
    return 0.88;
  });

  const cardOpacity = useTransform(dist, (d) => {
    if (d < 80) return 1;
    if (d < step * 1.2) return 0.75;
    return 0.1;
  });

  const cardZ = useTransform(dist, (d) => {
    if (d < 60) return 3;
    if (d < step) return 2;
    return 1;
  });

  return (
    <motion.div
      className="shrink-0 border-3 border-stroke bg-surface shadow-neo-lg p-5 flex flex-col cursor-pointer will-change-transform select-none group"
      style={{
        width: cardWidth,
        scale: cardScale,
        opacity: cardOpacity,
        zIndex: cardZ,
      }}
      whileHover={{ y: -6, transition: { duration: 0.15 } }}
      onTap={onTap}
    >
      {/* Image Preview Box */}
      <div className="w-full aspect-[16/10] bg-neutral-soft border-2 border-stroke mb-4 relative overflow-hidden flex items-center justify-center">
        {project.imageUrl ? (
          <Img
            src={project.imageUrl}
            alt={project.title}
            containerClassName="w-full h-full"
            imgClassName="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full font-heading font-black text-3xl text-stroke opacity-20">
            {project.title.charAt(0)}
          </div>
        )}
        <div className="absolute top-2 left-2">
          <span className="badge-neo text-[10px] py-1 px-2">
            {project.label || project.category}
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="flex flex-col flex-grow">
        <span className="text-[11px] font-heading font-bold uppercase tracking-wider text-muted mb-1">
          {project.category}
        </span>
        <h3 className="font-heading font-black text-xl uppercase tracking-tight text-stroke mb-2 line-clamp-1">
          {project.title}
        </h3>
        <p className="text-muted text-xs sm:text-sm line-clamp-2 mb-4 flex-grow">
          {project.description}
        </p>

        {/* Tech Stack Badges */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {project.techStack.slice(0, 3).map((tech) => (
            <span
              key={tech}
              className="text-[10px] font-heading font-bold uppercase px-2 py-0.5 border border-stroke bg-neutral-soft text-stroke"
            >
              {tech}
            </span>
          ))}
          {project.techStack.length > 3 && (
            <span className="text-[10px] font-heading font-bold uppercase px-2 py-0.5 border border-stroke bg-surface text-muted">
              +{project.techStack.length - 3}
            </span>
          )}
        </div>

        {/* Action Link */}
        <Link
          href="/project"
          className="btn-neo-secondary text-xs py-2 px-3 text-center w-full flex items-center justify-center gap-1.5"
        >
          <span>Detail Proyek</span>
          <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
        </Link>
      </div>
    </motion.div>
  );
}

const ProjectCardMemo = memo(ProjectCard);

export default function Portfolio({ isPreview = false }: { isPreview?: boolean }) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [index, setIndex] = useState(0);
  const carouselX = useMotionValue(0);

  const [cardWidth, setCardWidth] = useState(360);
  const step = cardWidth + GAP;

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 480) {
        setCardWidth(290);
      } else if (window.innerWidth < 768) {
        setCardWidth(320);
      } else {
        setCardWidth(360);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    fetchAPI<{ data: Project[] }>("projects")
      .then((res) => {
        setProjects(wrapData(res));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const items = isPreview ? projects.slice(0, 5) : projects;
  const maxIdx = Math.max(0, items.length - 1);

  const goTo = useCallback(
    (i: number) => {
      const idx = Math.max(0, Math.min(i, maxIdx));
      animate(carouselX, -idx * step, {
        type: "spring",
        stiffness: 300,
        damping: 28,
        mass: 0.8,
      });
      setIndex(idx);
    },
    [maxIdx, carouselX, step],
  );

  const handleDragEnd = useCallback(
    (_: MouseEvent | TouchEvent | PointerEvent, info: { offset: { x: number }; velocity: { x: number } }) => {
      const current = carouselX.get();
      const rawIdx = Math.round(-current / step);
      const clampedIdx = Math.max(0, Math.min(rawIdx, maxIdx));

      animate(carouselX, -clampedIdx * step, {
        type: "spring",
        velocity: info.velocity.x,
        stiffness: 320,
        damping: 26,
        mass: 0.9,
      });

      setIndex(clampedIdx);
    },
    [maxIdx, carouselX, step],
  );

  useEffect(() => {
    carouselX.set(-index * step);
  }, [cardWidth, index, step, carouselX]);

  return (
    <section id="portfolio" className="py-16 md:py-24 overflow-hidden">
      <div className="px-4 sm:px-6 md:px-12 max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between mb-12">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <span className="badge-neo mb-3">
            (I) RECENT PROJECTS
          </span>
          <h2 className="font-heading font-black text-3xl sm:text-4xl md:text-5xl uppercase tracking-tight text-stroke">
            Selected Works<span className="text-accent">.</span>
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="mt-6 md:mt-0"
        >
          {isPreview && (
            <Link
              href="/project"
              className="btn-neo-secondary text-xs py-2.5 px-5 flex items-center gap-1.5"
            >
              <span>Semua Proyek</span>
              <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
            </Link>
          )}
        </motion.div>
      </div>

      {loading ? (
        <div className="flex justify-center px-4">
          <div className="animate-pulse flex gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="shrink-0 w-[320px] sm:w-[360px] h-[440px] border-3 border-stroke bg-neutral-soft shadow-neo-lg"
              />
            ))}
          </div>
        </div>
      ) : items.length === 0 ? (
        <div className="max-w-md mx-auto text-center p-8 border-3 border-stroke bg-surface shadow-neo">
          <p className="font-heading font-bold uppercase text-muted">Belum ada proyek.</p>
        </div>
      ) : (
        <>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="overflow-hidden w-full py-6"
          >
            <motion.div
              className="flex items-center"
              drag="x"
              style={{
                x: carouselX,
                gap: GAP,
                paddingLeft: `calc(50% - ${cardWidth / 2}px)`,
                paddingRight: `calc(50% - ${cardWidth / 2}px)`,
              }}
              dragElastic={0.08}
              onDragEnd={handleDragEnd}
            >
              {items.map((project, i) => (
                <ProjectCardMemo
                  key={project.id}
                  project={project}
                  cardIndex={i}
                  carouselX={carouselX}
                  onTap={() => goTo(i)}
                  cardWidth={cardWidth}
                  step={step}
                />
              ))}
            </motion.div>
          </motion.div>

          {/* Navigation Controls */}
          <div className="flex justify-center items-center gap-6 mt-8">
            <button
              onClick={() => goTo(index - 1)}
              disabled={index === 0}
              className="w-11 h-11 border-3 border-stroke bg-surface shadow-neo hover:shadow-neo-lg active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              aria-label="Previous project"
            >
              <ChevronLeft className="w-5 h-5 text-stroke stroke-[2.5]" />
            </button>

            <div className="flex items-center gap-2">
              {items.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  className={`border border-stroke transition-all duration-200 cursor-pointer ${
                    i === index ? "bg-accent w-8 h-3 shadow-neo-sm" : "bg-neutral-soft w-3 h-3 hover:bg-surface"
                  }`}
                  aria-label={`Go to project ${i + 1}`}
                />
              ))}
            </div>

            <button
              onClick={() => goTo(index + 1)}
              disabled={index === maxIdx}
              className="w-11 h-11 border-3 border-stroke bg-surface shadow-neo hover:shadow-neo-lg active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              aria-label="Next project"
            >
              <ChevronRight className="w-5 h-5 text-stroke stroke-[2.5]" />
            </button>
          </div>
        </>
      )}
    </section>
  );
}
