/**
 * Hero illustration: a glass with flavored cubes settling into it.
 *
 * Decorative and generated rather than photographic — the product has no
 * photography yet, and an invented stock photo would misrepresent it.
 */
export function HeroGlass() {
  return (
    <div className="relative mx-auto aspect-4/5 w-full max-w-md">
      <div
        aria-hidden
        className="absolute inset-0 rounded-[3rem] bg-linear-to-b from-ice-light/70 to-transparent"
      />
      <svg
        viewBox="0 0 320 400"
        className="absolute inset-0 size-full"
        role="img"
        aria-label="A tall glass of clear drink with three flavored ice cubes in it"
      >
        <defs>
          <linearGradient id="liquid" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#bfe9f6" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#8fd8ee" stopOpacity="0.95" />
          </linearGradient>
          <linearGradient id="glass-edge" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
            <stop offset="45%" stopColor="#ffffff" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.8" />
          </linearGradient>
        </defs>

        {/* Glass body */}
        <path
          d="M96 70h128l-14 268a24 24 0 0 1-24 22h-52a24 24 0 0 1-24-22Z"
          fill="url(#liquid)"
        />
        <path
          d="M96 70h128l-14 268a24 24 0 0 1-24 22h-52a24 24 0 0 1-24-22Z"
          fill="url(#glass-edge)"
        />
        <path
          d="M96 70h128l-14 268a24 24 0 0 1-24 22h-52a24 24 0 0 1-24-22Z"
          fill="none"
          stroke="#ffffff"
          strokeWidth="3"
          strokeOpacity="0.9"
        />
        <ellipse cx="160" cy="70" rx="64" ry="13" fill="#ffffff" fillOpacity="0.55" />

        {/* Cubes, each a different flavor accent. */}
        <g className="animate-drift" style={{ transformOrigin: "150px 150px" }}>
          <rect x="118" y="112" width="58" height="58" rx="14" fill="#8ddc7a" fillOpacity="0.75" />
          <path d="M126 132c10-10 26-10 38-2-12-4-26-4-38 2Z" fill="#ffffff" fillOpacity="0.7" />
        </g>
        <g
          className="animate-drift"
          style={{ transformOrigin: "180px 210px", animationDelay: "-3s" }}
        >
          <rect x="152" y="182" width="54" height="54" rx="13" fill="#f6b93b" fillOpacity="0.72" />
          <path d="M160 200c9-9 24-9 35-2-11-4-24-4-35 2Z" fill="#ffffff" fillOpacity="0.7" />
        </g>
        <g
          className="animate-drift"
          style={{ transformOrigin: "140px 270px", animationDelay: "-6s" }}
        >
          <rect x="112" y="244" width="50" height="50" rx="12" fill="#6fe0be" fillOpacity="0.75" />
          <path d="M120 260c8-8 22-8 32-2-10-3-22-3-32 2Z" fill="#ffffff" fillOpacity="0.7" />
        </g>

        {/* Rising bubbles */}
        <circle cx="196" cy="300" r="4" fill="#ffffff" fillOpacity="0.6" />
        <circle cx="206" cy="264" r="3" fill="#ffffff" fillOpacity="0.5" />
        <circle cx="188" cy="230" r="2.5" fill="#ffffff" fillOpacity="0.45" />
        <circle cx="112" cy="316" r="3" fill="#ffffff" fillOpacity="0.5" />
      </svg>
    </div>
  );
}
