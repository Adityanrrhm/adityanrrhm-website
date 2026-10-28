"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { fetchAPI, wrapData } from "@/lib/api";
import { getIcon } from "@/lib/icons";

interface Skill {
  id: number;
  name: string;
  iconName: string;
  colorHex: string;
  category: string;
}

const DEFAULT_SKILLS: Skill[] = [
  { id: 1, name: "Python", iconName: "SiPython", colorHex: "#3776AB", category: "Data Analytics" },
  { id: 2, name: "Spring Framework", iconName: "SiSpringboot", colorHex: "#6DB33F", category: "Backend" },
  { id: 3, name: "Laravel", iconName: "SiLaravel", colorHex: "#FF2D20", category: "Backend" },
  { id: 4, name: "PostgreSQL", iconName: "SiPostgresql", colorHex: "#4169E1", category: "Database" },
  { id: 5, name: "Git", iconName: "SiGit", colorHex: "#F05032", category: "DevOps" },
  { id: 6, name: "Docker", iconName: "SiDocker", colorHex: "#2496ED", category: "DevOps" },
  { id: 7, name: "Linux", iconName: "SiLinux", colorHex: "#FCC624", category: "DevOps" },
  { id: 8, name: "Power BI", iconName: "PowerBI", colorHex: "#F2C811", category: "Data Analytics" },
];

export default function Skills() {
  const [skills, setSkills] = useState<Skill[]>(DEFAULT_SKILLS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAPI<{ data: Skill[] }>("skills")
      .then((res) => {
        const rawData = wrapData(res);
        if (Array.isArray(rawData) && rawData.length > 0) {
          // Guarantee all 8 target skills are present; overlay DB customizations if any
          const merged = DEFAULT_SKILLS.map((def) => {
            const found = rawData.find(
              (r: Skill) =>
                r.name.trim().toLowerCase() === def.name.toLowerCase() ||
                (def.name === "Spring Framework" && r.name.toLowerCase().includes("spring"))
            );
            return found ? { ...def, ...found } : def;
          });
          setSkills(merged);
        } else {
          setSkills(DEFAULT_SKILLS);
        }
        setLoading(false);
      })
      .catch(() => {
        setSkills(DEFAULT_SKILLS);
        setLoading(false);
      });
  }, []);

  const activeSkills = skills.length > 0 ? skills : DEFAULT_SKILLS;
  const MARQUEE_ITEMS = loading
    ? []
    : [...activeSkills, ...activeSkills, ...activeSkills, ...activeSkills];

  return (
    <section className="flex flex-col items-center py-12 md:py-16 overflow-hidden bg-canvas relative">
      {/* Neo Marquee Divider */}
      <div className="w-full border-y-3 border-stroke bg-surface py-5 relative shadow-neo overflow-hidden mb-16">
        {loading ? (
          <div className="animate-pulse flex gap-4 w-full px-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="h-10 w-32 border-2 border-stroke bg-neutral-soft shrink-0"
              />
            ))}
          </div>
        ) : (
          <motion.div
            animate={{ x: ["0%", "-50%"] }}
            transition={{ ease: "linear", duration: 30, repeat: Infinity }}
            className="flex gap-4 md:gap-6 items-center w-max"
          >
            {MARQUEE_ITEMS.map((skill, index) => {
              const Icon = getIcon(skill.iconName);
              return (
                <div
                  key={index}
                  className="flex items-center gap-2.5 px-4 py-2 border-2 border-stroke bg-surface shadow-neo-sm hover:shadow-neo hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all text-xs sm:text-sm font-heading font-bold uppercase tracking-wider text-stroke shrink-0 select-none"
                >
                  {Icon && (
                    <Icon
                      className="w-4 h-4 shrink-0"
                      style={
                        skill.colorHex ? { color: skill.colorHex } : undefined
                      }
                    />
                  )}
                  <span>{skill.name}</span>
                </div>
              );
            })}
          </motion.div>
        )}
      </div>

      {/* Statement Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="max-w-5xl w-full px-4 sm:px-6 md:px-12"
      >
        <div className="border-3 border-stroke bg-surface p-8 md:p-12 shadow-neo-lg text-center">
          <div className="inline-block mb-3">
            <span className="badge-neo">Expertise & Focus</span>
          </div>
          <h2 className="font-heading font-black text-3xl sm:text-4xl md:text-5xl uppercase tracking-tight leading-tight mb-6 text-stroke">
            Turning <span className="bg-stroke text-white px-2.5 py-0.5">Data</span> into{" "}
            <span className="bg-accent text-white px-2.5 py-0.5">Decisions</span>.
          </h2>

          <p className="text-base sm:text-lg text-muted leading-relaxed max-w-2xl mx-auto font-medium">
            Focused on Backend Development and Data Analytics, building practical,
            secure, and scalable solutions to support data-driven decision making using
            modern technologies.
          </p>
        </div>
      </motion.div>
    </section>
  );
}
