import type { SVGProps } from "react";

/**
 * Icon set — Lucide geometry (MIT), 24px grid, 1.75px stroke, `currentColor`.
 * Inlined rather than imported from a package so a page ships only the glyphs
 * it actually renders and there is no icon-font or runtime lookup cost.
 */

const paths = {
  "arrow-right": "M5 12h14M13 6l6 6-6 6",
  // Door with an outgoing arrow — used by the header account menu.
  "log-out": "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9",
  "arrow-left": "M19 12H5M11 18l-6-6 6-6",
  "arrow-up-right": "M7 17 17 7M8 7h9v9",
  "chevron-down": "m6 9 6 6 6-6",
  "chevron-right": "m9 6 6 6-6 6",
  "chevron-left": "m15 6-6 6 6 6",
  "map-pin": "M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z M15 10a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z",
  "trending-up": "m22 7-8.5 8.5-5-5L2 17M16 7h6v6",
  calendar:
    "M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z",
  tag: "M12.6 2.6a2 2 0 0 0-1.4-.6H4a2 2 0 0 0-2 2v7.2a2 2 0 0 0 .6 1.4l8.2 8.2a2 2 0 0 0 2.8 0l7.2-7.2a2 2 0 0 0 0-2.8ZM7 7h.01",
  users:
    "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M13 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0ZM22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8",
  check: "m20 6-11 11-5-5",
  "check-circle": "M22 11.1V12a10 10 0 1 1-5.9-9.1M22 4 12 14l-3-3",
  x: "M18 6 6 18M6 6l12 12",
  menu: "M4 6h16M4 12h16M4 18h16",
  globe: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20ZM2 12h20M12 2a15 15 0 0 1 0 20 15 15 0 0 1 0-20",
  phone:
    "M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2 4.2 2 2 0 0 1 4 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.1a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2Z",
  mail: "M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2ZM22 7l-10 6L2 7",
  clock: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20ZM12 6v6l4 2",
  download: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3",
  link: "M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7",
  "external-link": "M15 3h6v6M10 14 21 3M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6",
  search: "M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM21 21l-4.3-4.3",
  filter: "M22 3H2l8 9.5V19l4 2v-8.5L22 3Z",
  shield: "M20 13c0 5-3.5 7.5-8 9-4.5-1.5-8-4-8-9V6l8-3 8 3v7Z",
  sprout:
    "M7 20h10M12 20V9M12 9C12 5 9 3 5 3c0 4 3 6 7 6ZM12 12c0-3 2.5-5 6-5 0 3-2.5 5-6 5Z",
  truck:
    "M14 17V5a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h1M14 8h4l4 4v4a1 1 0 0 1-1 1h-1M7.5 19.5a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM17.5 19.5a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z",
  "graduation-cap": "m22 9-10-5L2 9l10 5 10-5ZM6 11.5V17c0 1.7 2.7 3 6 3s6-1.3 6-3v-5.5",
  store:
    "M3 9h18M3 9V6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v3M3 9l1 11a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1l1-11M9 21v-6h6v6",
  banknote: "M2 6h20v12H2zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM6 9h.01M18 15h.01",
  "alert-triangle": "M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0ZM12 9v4M12 17h.01",
  info: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20ZM12 16v-4M12 8h.01",
  quote:
    "M9 11H5a1 1 0 0 1-1-1V7a3 3 0 0 1 3-3M9 11c0 4-1.5 6-4 7M20 11h-4a1 1 0 0 1-1-1V7a3 3 0 0 1 3-3M20 11c0 4-1.5 6-4 7",
  target: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20ZM12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12ZM12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z",
  layers: "m12 2 9 5-9 5-9-5 9-5ZM3 12l9 5 9-5M3 17l9 5 9-5",
  "bar-chart": "M3 21h18M7 21V10M12 21V3M17 21v-7",
  leaf: "M11 20A7 7 0 0 1 4 13c0-6 8-10 16-10 0 8-4 15-9 17ZM4 21c3-4 6-6 9-7",
  handshake: "m11 17 2 2a1 1 0 0 0 1.4 0l3.6-3.6M6 12l-3-3 5-5 3 3M18 12l3-3-5-5-3 3M8 14l3 3M5 12l4 4a1 1 0 0 0 1.4 0l1.6-1.6",
  wallet: "M19 7V5a2 2 0 0 0-2-2H5a2 2 0 0 0 0 4h14a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5M17 13h.01",
  "file-text": "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8ZM14 2v6h6M9 13h6M9 17h6",
  "message-circle": "M21 11.5a8.4 8.4 0 0 1-9 8.4 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.2A8.4 8.4 0 0 1 12 3a8.4 8.4 0 0 1 9 8.5Z",
  "cloud-sun": "M12 2v2M4.9 4.9l1.4 1.4M2 12h2M19.1 4.9l-1.4 1.4M16 13a4 4 0 1 0-7.6-1.7M7 20h11a3 3 0 0 0 0-6h-.7A5 5 0 0 0 7 15.1 2.5 2.5 0 0 0 7 20Z",
  facebook: "M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3Z",
  linkedin:
    "M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6ZM6 9H2v12h4ZM4 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z",
  whatsapp:
    "M21 11.5a8.4 8.4 0 0 1-12.8 7.2L3 21l2.3-5.1A8.4 8.4 0 1 1 21 11.5ZM9 8.5c0 3 2.5 5.5 5.5 5.5.6 0 1-.4 1-1v-.9l-1.9-.6-.7.9a4.7 4.7 0 0 1-2.2-2.2l.9-.7L11 7.5H10c-.6 0-1 .4-1 1Z",
  plus: "M12 5v14M5 12h14",
  minus: "M5 12h14",
  play: "m5 3 16 9-16 9V3Z",
  star: "m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8-6.2-3.3-6.2 3.3L7 14.2l-5-4.9 6.9-1Z",
  building: "M3 21h18M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16M9 7h.01M15 7h.01M9 11h.01M15 11h.01M9 15h.01M15 15h.01",
  refresh: "M21 12a9 9 0 1 1-3-6.7M21 3v6h-6",
  // The international symbol of access, used on partner records where the
  // producer is a person with a disability. Lucide "accessibility".
  accessibility:
    "M12 4a1 1 0 1 0 0-2 1 1 0 0 0 0 2ZM4.5 8.5l6 1.5v4l3 5M19.5 8.5l-6 1.5M10.5 14l-2 5",
} as const;

export type IconName = keyof typeof paths;

export type IconProps = SVGProps<SVGSVGElement> & {
  name: IconName;
  size?: number;
};

export function Icon({ name, size = 20, ...rest }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      <path d={paths[name]} />
    </svg>
  );
}
