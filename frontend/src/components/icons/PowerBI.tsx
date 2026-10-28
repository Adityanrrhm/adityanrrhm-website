"use client";

import { SVGProps } from "react";

export const PowerBI = ({ className = "", style, ...props }: SVGProps<SVGSVGElement> & { style?: React.CSSProperties }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={style}
    {...props}
  >
    <rect x="2" y="13" width="4.5" height="9" rx="1" fill="#F2C811" />
    <rect x="8" y="8" width="4.5" height="14" rx="1" fill="#F2C811" />
    <rect x="14" y="3" width="4.5" height="19" rx="1" fill="#F2C811" />
    <rect x="20" y="9" width="2" height="13" rx="0.5" fill="#E0B108" opacity="0.6" />
  </svg>
);
