"use client";

import { useState, useEffect, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink, GitBranch, ArrowUpRight } from "lucide-react";
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
  isPrivate: boolean;
}

const ALL_LABEL = "All";

function ProjectCard({
  project,
  onSelect,
}: {
  project: Project;
  onSelect: (project: Project) => void;
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.2 }}
      onClick={() => onSelect(project)}
      className="card-neo flex flex-col cursor-pointer select-none group"
    >
      {/* Image Preview Box */}
      <div className="w-full h-48 bg-neutral-soft border-2 border-stroke mb-4 relative overflow-hidden flex items-center justify-center">
        {project.imageUrl ? (
          <Img
            src={project.imageUrl}
            alt={project.title}
            containerClassName="w-full h-full"
            imgClassName="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full font-heading font-black text-4xl text-stroke opacity-20">
            {project.title.charAt(0)}
          </div>
        )}
        <div className="absolute top-2 left-2">
          <span className="badge-neo text-[10px] py-0.5 px-2">
            {project.label || project.category}
          </span>
        </div>
      </div>

      {/* Card Info */}
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

        {/* Action Button */}
        <div className="btn-neo-secondary text-xs py-2 px-3 text-center w-full flex items-center justify-center gap-1.5 mt-auto">
          <span>Detail Proyek</span>
          <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
        </div>
      </div>
    </motion.div>
  );
}

const ProjectCardMemo = memo(ProjectCard);

function ProjectModal({
  project,
  onClose,
}: {
  project: Project;
  onClose: () => void;
}) {
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
        initial={{ scale: 0.95, opacity: 0, y: 15 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 15 }}
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
        <div className="md:w-[55%] border-b-3 md:border-b-0 md:border-r-3 border-stroke bg-neutral-soft flex items-center justify-center min-h-[260px] md:min-h-[420px] relative overflow-hidden">
          {project.imageUrl ? (
            <Img
              src={project.imageUrl}
              alt={project.title}
              containerClassName="w-full h-full"
              imgClassName="w-full h-full object-contain p-4"
            />
          ) : (
            <div className="flex flex-col items-center justify-center p-8 text-center">
              <span className="font-heading font-black text-6xl text-stroke opacity-20 mb-3">
                {project.title.charAt(0)}
              </span>
              <p className="font-heading font-black text-lg uppercase text-stroke">
                {project.title}
              </p>
              <p className="text-xs font-bold text-muted uppercase mt-1">
                {project.category}
              </p>
            </div>
          )}
        </div>

        {/* Modal Right Info */}
        <div className="md:w-[45%] p-6 md:p-8 flex flex-col justify-between overflow-y-auto bg-surface">
          <div>
            <div className="mb-2">
              <span className="badge-neo text-xs">
                {project.label || project.category}
              </span>
            </div>
            <h2 className="font-heading font-black text-2xl md:text-3xl uppercase tracking-tight text-stroke mb-4">
              {project.title}
            </h2>

            <p className="text-muted text-sm sm:text-base leading-relaxed mb-6 font-medium">
              {project.description}
            </p>

            <div className="mb-8">
              <p className="font-heading font-bold text-xs uppercase tracking-wider text-stroke mb-2">
                Tech Stack:
              </p>
              <div className="flex flex-wrap gap-1.5">
                {project.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="badge-neo text-xs py-1 px-2.5"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Action Links */}
          <div className="flex flex-wrap gap-3 pt-4 border-t-2 border-neutral-soft">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-neo-primary text-xs py-2.5 px-4 flex items-center gap-2"
              >
                <ExternalLink className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Live Demo</span>
              </a>
            )}
            {project.githubUrl && (
              <a
                href={project.isPrivate ? undefined : project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`btn-neo-secondary text-xs py-2.5 px-4 flex items-center gap-2 ${
                  project.isPrivate ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <GitBranch className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>{project.isPrivate ? "Private Repo" : "Source Code"}</span>
              </a>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function ProjectsPage() {
  const [activeLabel, setActiveLabel] = useState<string>(ALL_LABEL);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAPI<{ data: Project[] }>("projects")
      .then((res) => {
        setProjects(wrapData(res));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const labels = [ALL_LABEL, ...new Set(projects.map((p) => p.label).filter(Boolean))];

  const filtered =
    activeLabel === ALL_LABEL
      ? projects
      : projects.filter((p) => p.label === activeLabel);

  if (loading) {
    return (
      <section className="section-padding py-16">
        <div className="animate-pulse space-y-6">
          <div className="h-6 w-32 border-2 border-stroke bg-neutral-soft" />
          <div className="h-12 w-64 border-3 border-stroke bg-neutral-soft" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-96 border-3 border-stroke bg-neutral-soft shadow-neo-lg" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section-padding py-12 sm:py-16">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        className="mb-8"
      >
        <span className="badge-neo mb-3">PORTFOLIO ARCHIVE</span>
        <h1 className="font-heading font-black text-4xl sm:text-5xl md:text-6xl uppercase tracking-tight text-stroke">
          All Projects<span className="text-accent">.</span>
        </h1>
        <p className="text-muted text-base sm:text-lg font-medium mt-2 max-w-2xl">
          Koleksi proyek terpilih yang mencakup web applications, machine learning, data engineering, dan cloud architecture.
        </p>
      </motion.div>

      {/* Filter Badges */}
      <div className="flex flex-wrap gap-2.5 mb-10 mt-6">
        {labels.map((label) => {
          const count =
            label === ALL_LABEL
              ? projects.length
              : projects.filter((p) => p.label === label).length;
          const isActive = activeLabel === label;
          return (
            <button
              key={label}
              onClick={() => setActiveLabel(label)}
              className={`badge-neo cursor-pointer transition-all active:translate-x-0.5 active:translate-y-0.5 active:shadow-none ${
                isActive ? "badge-neo-active shadow-neo" : "bg-surface hover:bg-neutral-soft"
              }`}
            >
              <span>{label}</span>
              <span className="ml-1.5 opacity-75">({count})</span>
            </button>
          );
        })}
      </div>

      {/* Projects Grid */}
      <AnimatePresence mode="popLayout">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((project) => (
            <ProjectCardMemo
              key={project.id}
              project={project}
              onSelect={setSelectedProject}
            />
          ))}
        </div>
      </AnimatePresence>

      {filtered.length === 0 && (
        <div className="p-12 border-3 border-stroke bg-surface shadow-neo text-center max-w-md mx-auto my-12">
          <p className="font-heading font-bold uppercase text-muted">
            Tidak ada proyek dalam kategori ini.
          </p>
        </div>
      )}

      {/* Project Detail Modal */}
      <AnimatePresence>
        {selectedProject && (
          <ProjectModal
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
