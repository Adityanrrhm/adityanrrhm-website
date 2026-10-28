import {
  SiPython,
  SiPostgresql,
  SiDocker,
  SiLinux,
  SiLaravel,
  SiSpringboot,
  SiSpring,
  SiGit,
  SiGithub,
  SiInstagram,
} from "react-icons/si";
import { FaLinkedin } from "react-icons/fa";
import { Mail } from "lucide-react";
import { PowerBI } from "@/components/icons/PowerBI";

const iconMap: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
  // ─── Tech Stack (Only Mentioned Skills) ───
  SiPython,
  SiPostgresql,
  SiLaravel,
  SiSpringboot,
  SiSpring,
  SiGit,
  SiDocker,
  SiLinux,
  PowerBI,
  SiPowerbi: PowerBI,

  // ─── Social Links ───
  SiGithub,
  SiInstagram,
  FaLinkedin,
  Mail,
};

export function getIcon(name: string) {
  return iconMap[name] || null;
}
