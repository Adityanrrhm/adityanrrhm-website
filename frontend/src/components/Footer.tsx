"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Mail } from "lucide-react";
import { fetchAPI, wrapData } from "@/lib/api";
import { getIcon } from "@/lib/icons";

interface Profile {
  name: string;
  bio: string;
}

interface SocialLink {
  id: number;
  platform: string;
  url: string;
  iconName: string;
}

const columns = [
  {
    title: "Navigation",
    links: [
      { label: "Home", href: "/" },
      { label: "Projects", href: "/project" },
      { label: "Certificates", href: "/certificate" },
      { label: "Experience", href: "/experience" },
      { label: "About", href: "/about" },
    ],
  },
];

const bottomLinks = [
  { label: "Privacy Policy", href: "#" },
  { label: "Terms of Service", href: "#" },
];

export default function Footer() {
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

  return (
    <footer className="w-full border-t-3 border-stroke bg-surface py-12 sm:py-16 px-4 sm:px-6 md:px-12 mt-auto">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row justify-between items-start gap-10 lg:gap-16">
          {/* Brand Info */}
          <div className="w-full lg:w-[45%]">
            <div className="flex items-center gap-3 select-none mb-4">
              <div className="w-10 h-10 border-2 border-stroke bg-surface flex items-center justify-center p-1.5 shadow-neo-sm relative">
                <Image
                  src="/assets/logo_web_Adityanrrhm.png"
                  alt="Logo Badge"
                  width={32}
                  height={32}
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="font-heading font-black text-xl sm:text-2xl uppercase tracking-tighter text-stroke">
                {profile?.name ? profile.name : "PORTFOLIO"}
                <span className="text-accent">.</span>
              </span>
            </div>

            <p className="text-muted text-sm sm:text-base font-medium leading-relaxed max-w-sm">
              {profile?.bio ||
                "Building high-performance backend systems and scalable data infrastructure ready to grow."}
            </p>
          </div>

          {/* Links & Socials */}
          <div className="w-full lg:w-[55%] flex flex-col sm:flex-row justify-start lg:justify-end gap-10 sm:gap-16">
            {columns.map((col) => (
              <div key={col.title}>
                <h4 className="font-heading font-black text-xs uppercase tracking-wider text-stroke mb-4">
                  {col.title}
                </h4>
                <ul className="space-y-2.5">
                  {col.links.map((link) => {
                    const isExternal =
                      link.href.startsWith("http") ||
                      link.href.startsWith("mailto");
                    const Tag = isExternal ? "a" : Link;
                    const extraProps = isExternal
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {};
                    return (
                      <li key={link.label}>
                        <Tag
                          href={link.href}
                          {...extraProps}
                          className="font-heading font-bold text-xs uppercase tracking-wider text-muted hover:text-accent hover:underline decoration-2 transition-colors inline-block"
                        >
                          {link.label}
                        </Tag>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}

            <div>
              <h4 className="font-heading font-black text-xs uppercase tracking-wider text-stroke mb-4">
                Connect
              </h4>
              <div className="flex flex-wrap gap-2 max-w-xs">
                {socialLinks.map((link) => {
                  const isExternal =
                    link.url.startsWith("http") ||
                    link.url.startsWith("mailto");
                  const Tag = isExternal ? "a" : Link;
                  const extraProps = isExternal
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {};
                  const Icon =
                    link.iconName === "Mail" ? Mail : getIcon(link.iconName);
                  return (
                    <Tag
                      key={link.id}
                      href={link.url}
                      {...extraProps}
                      className="badge-neo bg-surface hover:bg-neutral-soft hover:shadow-neo hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all text-[11px] py-1 px-2.5 flex items-center gap-1.5"
                    >
                      {Icon && <Icon className="w-3.5 h-3.5 shrink-0 stroke-[2.5]" />}
                      <span>{link.platform}</span>
                    </Tag>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="w-full border-t-2 border-neutral-soft mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="font-heading font-bold text-xs uppercase tracking-wider text-muted">
            &copy; {new Date().getFullYear()} {profile?.name || "Aditya Nur Rohim"}. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            {bottomLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="font-heading font-bold text-xs uppercase tracking-wider text-muted hover:text-stroke hover:underline decoration-1 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
