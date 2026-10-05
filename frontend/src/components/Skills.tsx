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

export default function Skills() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAPI<{ data: Skill[] }>("skills")
      .then((res) => {
        setSkills(wrapData(res));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const MARQUEE_ITEMS = loading
    ? []
    : [...skills, ...skills, ...skills, ...skills];

  return (
    <section className="flex flex-col items-center pt-8 pb-32 overflow-hidden bg-background relative">
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[800px] h-[150px] bg-gradient-to-r from-blue-100 via-purple-50 to-teal-50 blur-3xl opacity-60 pointer-events-none"></div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative flex overflow-hidden whitespace-nowrap w-full py-12 mb-20"
      >
        <div className="absolute left-0 top-0 bottom-0 w-24 md:w-48 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none"></div>
        <div className="absolute right-0 top-0 bottom-0 w-24 md:w-48 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none"></div>

        {loading ? (
          <div className="animate-pulse flex gap-4 w-full px-12">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="h-12 w-28 rounded-full bg-gray-100 shrink-0"
              />
            ))}
          </div>
        ) : (
          <motion.div
            animate={{ x: ["0%", "-50%"] }}
            transition={{ ease: "linear", duration: 35, repeat: Infinity }}
            className="flex gap-4 md:gap-8 items-center w-max"
          >
            {MARQUEE_ITEMS.map((skill, index) => {
              const Icon = getIcon(skill.iconName);
              return (
                <span
                  key={index}
                  className="flex items-center gap-3 px-6 py-3 md:px-8 md:py-4 rounded-full text-sm md:text-lg font-medium text-gray-800 flex-shrink-0 
                             bg-white/40 backdrop-blur-xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:bg-white/60 hover:scale-105 transition-all cursor-pointer"
                >
                  {Icon && (
                    <Icon
                      className="w-5 h-5 md:w-6 md:h-6"
                      style={
                        skill.colorHex ? { color: skill.colorHex } : undefined
                      }
                    />
                  )}
                  {skill.name}
                </span>
              );
            })}
          </motion.div>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl w-full px-6 md:px-12 text-center relative z-20"
      >
        <h2 className="font-heading text-4xl md:text-6xl lg:text-[5rem] font-bold tracking-tighter leading-[1.1] mb-8">
          Turning <span className="text-gray-400">data</span> into{" "}
          <span className="text-gray-400">decisions</span>.
        </h2>

        <p className="text-lg md:text-2xl text-gray-600 leading-relaxed max-w-3xl mx-auto font-medium">
          Focused on Data Analytics and Web Development, building practical
          projects that support data-driven decision-making through modern
          technologies.
        </p>
      </motion.div>
    </section>
  );
}
