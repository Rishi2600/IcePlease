"use client";

// A client boundary on purpose: as a server component every SVG here ships
// twice, as HTML and again in the RSC payload. This way only the props do.
import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * The product image slot.
 *
 * Real photography does not exist yet, so a product without `imageUrl` renders
 * a generated scene: a cube floating in a dark drink, with flavor melting out
 * of it. It is obviously a graphic, not a photograph pretending to be one. A
 * sold-out product shows the outline of the cube that is missing.
 *
 * When `imageUrl` is set the photograph takes over at the same aspect ratio,
 * so dropping real assets in requires no layout change.
 */
export function ProductVisual({
  name,
  imageUrl,
  accentColor,
  stock,
  className,
  priority = false,
  sizes = "(min-width: 1024px) 24rem, (min-width: 640px) 50vw, 100vw",
}: {
  name: string;
  imageUrl?: string | null;
  accentColor: string;
  stock?: number;
  className?: string;
  priority?: boolean;
  sizes?: string;
}) {
  return (
    <div
      className={cn(
        "relative aspect-4/5 w-full max-w-full overflow-hidden rounded-card border border-line bg-panel transition-colors [content-visibility:auto] group-focus-within:border-line-strong group-hover:border-line-strong",
        className,
      )}
    >
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt={`${name} flavored ice`}
          fill
          sizes={sizes}
          className="object-cover"
          priority={priority}
        />
      ) : (stock ?? 1) > 0 ? (
        <>
          <Water />
          <div className="absolute inset-0 origin-top mix-blend-screen transition-transform duration-700 ease-out group-focus-within:scale-y-110 group-hover:scale-y-110">
            <Plume accentColor={accentColor} />
          </div>
          <div className="absolute inset-0 transition-transform duration-500 ease-out group-focus-within:-translate-y-1.5 group-hover:-translate-y-1.5">
            <IceCube accentColor={accentColor} />
          </div>
        </>
      ) : (
        <EmptyCube />
      )}
    </div>
  );
}

/** For small slots: the cube alone, since a plume is unreadable and costly here. */
export function ProductThumb({
  name,
  imageUrl,
  accentColor,
  sizes,
}: {
  name: string;
  imageUrl?: string | null;
  accentColor: string;
  sizes: string;
}) {
  return (
    <div className="relative aspect-square w-full overflow-hidden rounded-lg border border-line bg-panel">
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt={`${name} flavored ice`}
          fill
          sizes={sizes}
          className="object-cover"
        />
      ) : (
        // The canvas is tall with the cube near the top, so centre and enlarge it.
        <div className="absolute inset-0 translate-y-[19%] scale-[1.8]">
          <IceCube accentColor={accentColor} />
        </div>
      )}
    </div>
  );
}

/* The scene shares one 4:5 canvas, anchored to the top so the waterline and
   cube stay put when a tile crops to a different shape. */
const CANVAS = {
  viewBox: "0 0 400 500",
  preserveAspectRatio: "xMidYMin slice",
  className: "absolute inset-0 size-full overflow-visible",
  "aria-hidden": true,
  focusable: false,
} as const;

const CUBE_OUTLINE =
  "M190 28q10-6 20 0l66 38q8 5 8 14v77q0 9-8 14l-66 38q-10 6-20 0l-66-38q-8-5-8-14V80q0-9 8-14Z";
const CUBE_EDGES = "M116 70 200 118l84-48M200 118v97";

function Water() {
  const id = React.useId();
  return (
    <svg {...CANVAS}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="var(--color-electric)" stopOpacity="0.2" />
          <stop offset="1" stopColor="var(--color-electric)" stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <rect y="88" width="400" height="412" fill={`url(#${id})`} />
      <path d="M0 88h400" stroke="var(--color-link)" strokeOpacity="0.6" />
    </svg>
  );
}

function EmptyCube() {
  return (
    <svg {...CANVAS}>
      <path d="M0 88h400" stroke="var(--color-line-strong)" />
      <path
        d={`${CUBE_OUTLINE}${CUBE_EDGES}`}
        fill="none"
        stroke="var(--color-fg-muted)"
        strokeDasharray="7 9"
      />
    </svg>
  );
}

/** Decorative: the product name alongside always carries the meaning. */
export function IceCube({ accentColor }: { accentColor: string }) {
  const id = React.useId();
  const url = (part: string) => `url(#${id}-${part})`;

  return (
    <svg {...CANVAS}>
      <defs>
        <clipPath id={`${id}-shape`}>
          <path d={CUBE_OUTLINE} />
        </clipPath>
        <linearGradient id={`${id}-top`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.95" />
          <stop offset="1" stopColor={accentColor} stopOpacity="0.55" />
        </linearGradient>
        <linearGradient id={`${id}-left`} x1="0" y1="0" x2="0.6" y2="1">
          <stop offset="0" stopColor="#dfe9ff" stopOpacity="0.4" />
          <stop offset="1" stopColor={accentColor} stopOpacity="0.22" />
        </linearGradient>
        <linearGradient id={`${id}-right`} x1="1" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#dfe9ff" stopOpacity="0.14" />
          <stop offset="1" stopColor={accentColor} stopOpacity="0.4" />
        </linearGradient>
        <radialGradient id={`${id}-core`}>
          <stop offset="0" stopColor={accentColor} />
          <stop offset="0.6" stopColor={accentColor} stopOpacity="0.62" />
          <stop offset="1" stopColor={accentColor} stopOpacity="0" />
        </radialGradient>
      </defs>

      <g clipPath={url("shape")}>
        <path d={CUBE_OUTLINE} fill="var(--color-page)" fillOpacity="0.35" />
        <path d="M116 70 200 118v97l-84-48Z" fill={url("left")} />
        <path d="M284 70 200 118v97l84-48Z" fill={url("right")} />
        {/* The flavor, still trapped in the ice. */}
        <ellipse cx="200" cy="142" rx="76" ry="68" fill={url("core")} />
        <path d="M200 22 284 70 200 118 116 70Z" fill={url("top")} />
        {/* Fractures: what makes it read as ice rather than a block of colour. */}
        <path
          d="M150 112l14 20 22 6M164 132l-6 26M246 124l-14 22-20 8M232 146l6 20"
          fill="none"
          stroke="var(--color-fg)"
          strokeOpacity="0.42"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        {/* Below the waterline. */}
        <path d="M116 88h168v85l-84 48-84-48Z" fill="var(--color-electric)" fillOpacity="0.12" />
        <path d={CUBE_EDGES} fill="none" stroke="var(--color-fg)" strokeOpacity="0.12" strokeWidth="5" />
        <path d={CUBE_EDGES} fill="none" stroke="var(--color-fg)" strokeOpacity="0.55" />
      </g>

      <path d={CUBE_OUTLINE} fill="none" stroke="var(--color-fg)" strokeOpacity="0.8" strokeWidth="1.25" />
      {/* Glints along the lit edges, and the waterline crossing the cube. */}
      <path
        d="M126 84v50M136 62l46-26"
        fill="none"
        stroke="#ffffff"
        strokeOpacity="0.75"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path d="M112 88q88 15 176 0" fill="none" stroke="var(--color-fg)" strokeOpacity="0.65" />
      <circle cx="232" cy="190" r="2.5" fill="#ffffff" fillOpacity="0.7" />
      <circle cx="170" cy="196" r="1.75" fill="#ffffff" fillOpacity="0.7" />
    </svg>
  );
}

/** Noise seeds picked by eye: with these the stem stays attached to the cube. */
const CURLS = [23, 1, 15, 31, 13, 9, 19, 33];

/** The same colour always curls the same way, and flavors differ. */
function curlFor(color: string) {
  const sum = [...color].reduce((total, char) => total + char.charCodeAt(0), 0);
  return CURLS[sum % CURLS.length];
}

const FILTER_REGION = {
  filterUnits: "userSpaceOnUse",
  x: 0,
  y: 120,
  width: 400,
  height: 380,
  colorInterpolationFilters: "sRGB",
} as const;

/**
 * Flavor leaving the cube: a mottled body of smoke with fine threads through
 * it, both pushed around by the same noise so they curl like ink in water.
 * Animate a wrapper, never this SVG: the filters are costly to repaint and
 * cheap to composite. Screen it onto the water, or orange over blue goes brown.
 */
export function Plume({ accentColor }: { accentColor: string }) {
  const id = React.useId();
  const seed = curlFor(accentColor);
  const curl = (
    <>
      <feTurbulence
        type="fractalNoise"
        baseFrequency="0.007 0.011"
        numOctaves="2"
        seed={seed}
      />
      <feDisplacementMap
        in="SourceGraphic"
        scale="120"
        xChannelSelector="R"
        yChannelSelector="G"
        result="curled"
      />
    </>
  );

  return (
    <svg {...CANVAS}>
      <defs>
        <linearGradient
          id={`${id}-fade`}
          gradientUnits="userSpaceOnUse"
          x1="0"
          y1="190"
          x2="0"
          y2="478"
        >
          {/* Starts inside the cube, so it must fade in or its top edge shows. */}
          <stop offset="0" stopColor={accentColor} stopOpacity="0" />
          <stop offset="0.1" stopColor={accentColor} />
          <stop offset="0.45" stopColor={accentColor} stopOpacity="0.62" />
          <stop offset="1" stopColor={accentColor} stopOpacity="0" />
        </linearGradient>
        <filter id={`${id}-smoke`} {...FILTER_REGION}>
          {curl}
          <feGaussianBlur in="curled" stdDeviation="6" result="soft" />
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.014 0.02"
            numOctaves="2"
            seed={seed + 1}
          />
          <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 2.2 0 0 0 -0.5" />
          <feComposite in="soft" operator="in" />
        </filter>
        <filter id={`${id}-thread`} {...FILTER_REGION}>
          {curl}
          <feGaussianBlur in="curled" stdDeviation="1" />
        </filter>
      </defs>

      <path
        filter={`url(#${id}-smoke)`}
        d="M186 196c4 54-14 104-36 150-28 56-54 104-80 164h260c-24-60-54-108-80-164-22-46-40-96-36-150Z"
        fill={`url(#${id}-fade)`}
      />
      <g
        filter={`url(#${id}-thread)`}
        fill="none"
        stroke={`url(#${id}-fade)`}
        strokeLinecap="round"
      >
        <path d="M190 200c-14 80 24 140-14 220s-26 60-16 80" strokeWidth="3" />
        <path d="M212 200c20 70-12 130 28 200s22 70 10 100" strokeWidth="2" />
        <path d="M200 200c0 80-12 140 6 220" strokeWidth="5" />
      </g>
    </svg>
  );
}
