import * as React from "react";

type SVGProps = React.SVGProps<SVGSVGElement>;

/** Compact mosque emblem used in the logo lockups. */
export function MosqueEmblem({ className, ...props }: SVGProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <defs>
        <linearGradient id="dome" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="var(--brand-gold-soft)" />
          <stop offset="1" stopColor="var(--brand-gold)" />
        </linearGradient>
      </defs>
      {/* crescent finial */}
      <circle cx="24" cy="5.5" r="1.6" fill="var(--brand-gold)" />
      {/* central dome */}
      <path
        d="M16 24c0-6 3.6-10 8-10s8 4 8 10v1H16z"
        fill="url(#dome)"
      />
      <rect x="15" y="24" width="18" height="15" rx="1" fill="url(#dome)" />
      {/* arched door */}
      <path
        d="M24 30c-2 0-3.4 1.5-3.4 3.6V39h6.8v-5.4C27.4 31.5 26 30 24 30z"
        fill="var(--brand-dark)"
      />
      {/* minarets */}
      <rect x="8" y="20" width="3.2" height="19" rx="1.4" fill="url(#dome)" />
      <rect x="36.8" y="20" width="3.2" height="19" rx="1.4" fill="url(#dome)" />
      <circle cx="9.6" cy="18.5" r="1.4" fill="var(--brand-gold)" />
      <circle cx="38.4" cy="18.5" r="1.4" fill="var(--brand-gold)" />
      {/* base */}
      <rect x="6" y="39" width="36" height="3" rx="1.2" fill="var(--brand-gold)" />
    </svg>
  );
}

/** Wide mosque skyline silhouette for hero / motto backgrounds. */
export function MosqueSilhouette({ className, ...props }: SVGProps) {
  return (
    <svg
      viewBox="0 0 320 120"
      fill="currentColor"
      preserveAspectRatio="xMidYMax meet"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <rect x="0" y="104" width="320" height="16" />
      {/* minaret left */}
      <rect x="40" y="40" width="10" height="64" rx="3" />
      <circle cx="45" cy="36" r="5" />
      {/* main dome */}
      <path d="M120 104V70c0-22 18-40 40-40s40 18 40 40v34z" />
      <rect x="120" y="70" width="80" height="34" />
      <circle cx="160" cy="22" r="4" />
      <rect x="158" y="14" width="4" height="10" />
      {/* small domes */}
      <path d="M96 104V84c0-10 7-18 16-18s16 8 16 18v20z" />
      <path d="M192 104V84c0-10 7-18 16-18s16 8 16 18v20z" />
      {/* minaret right */}
      <rect x="270" y="40" width="10" height="64" rx="3" />
      <circle cx="275" cy="36" r="5" />
    </svg>
  );
}

/** Hanging lantern (fanoos) used to flank the hero banner. */
export function Lantern({ className, ...props }: SVGProps) {
  return (
    <svg
      viewBox="0 0 40 96"
      fill="none"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <line x1="20" y1="0" x2="20" y2="18" stroke="var(--brand-gold)" strokeWidth="1.5" />
      <path d="M14 18h12l-2 6H16z" fill="var(--brand-gold)" />
      <path
        d="M11 30c0-3 4-6 9-6s9 3 9 6v30c0 5-4 9-9 9s-9-4-9-9z"
        fill="var(--brand-gold)"
        fillOpacity="0.22"
        stroke="var(--brand-gold)"
        strokeWidth="1.5"
      />
      <ellipse cx="20" cy="46" rx="5" ry="8" fill="var(--brand-gold-soft)" fillOpacity="0.85" />
      <path d="M14 70h12l-2 8H16z" fill="var(--brand-gold)" />
      <circle cx="20" cy="82" r="3" fill="var(--brand-gold)" />
    </svg>
  );
}

/** Decorative pointed Islamic arch outline for the footer. */
export function IslamicArch({ className, ...props }: SVGProps) {
  return (
    <svg
      viewBox="0 0 120 80"
      fill="none"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <path
        d="M10 78V40C10 22 33 8 60 8s50 14 50 32v38"
        stroke="var(--brand-gold)"
        strokeOpacity="0.5"
        strokeWidth="1.5"
      />
      <path
        d="M24 78V42c0-14 16-25 36-25s36 11 36 25v36"
        stroke="var(--brand-gold)"
        strokeOpacity="0.35"
        strokeWidth="1.5"
      />
      <circle cx="60" cy="6" r="2.5" fill="var(--brand-gold)" fillOpacity="0.6" />
    </svg>
  );
}
