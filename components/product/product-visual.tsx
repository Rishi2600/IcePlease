import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * The product image slot.
 *
 * Real photography does not exist yet. Rather than borrowing stock imagery
 * that misrepresents the product, an untinted-photo product renders a
 * generated ice treatment: a translucent cube tinted with the product's accent
 * colour. It is obviously a graphic, not a photograph pretending to be one.
 *
 * When `imageUrl` is set the photograph takes over at the same aspect ratio,
 * so dropping real assets in requires no layout change.
 */
export function ProductVisual({
  name,
  imageUrl,
  accentColor,
  className,
  priority = false,
  sizes = "(min-width: 1024px) 24rem, (min-width: 640px) 50vw, 100vw",
}: {
  name: string;
  imageUrl?: string | null;
  accentColor: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
}) {
  return (
    <div
      className={cn(
        "relative aspect-square w-full max-w-full overflow-hidden rounded-card bg-surface-sunken",
        className,
      )}
      style={{
        backgroundImage: `radial-gradient(120% 90% at 30% 15%, ${accentColor}38, transparent 60%)`,
      }}
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
      ) : (
        <IceCube accentColor={accentColor} />
      )}
    </div>
  );
}

/** Decorative: the product name alongside always carries the meaning. */
function IceCube({ accentColor }: { accentColor: string }) {
  return (
    <svg
      viewBox="0 0 200 200"
      className="absolute inset-0 size-full"
      aria-hidden
      focusable="false"
    >
      <defs>
        <linearGradient id="cube-body" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={accentColor} stopOpacity="0.85" />
          <stop offset="55%" stopColor={accentColor} stopOpacity="0.45" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.7" />
        </linearGradient>
        <linearGradient id="cube-face" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.75" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.05" />
        </linearGradient>
      </defs>

      <rect
        x="42"
        y="42"
        width="116"
        height="116"
        rx="26"
        fill="url(#cube-body)"
      />
      <rect
        x="42"
        y="42"
        width="116"
        height="116"
        rx="26"
        fill="none"
        stroke="#ffffff"
        strokeOpacity="0.75"
        strokeWidth="1.5"
      />
      {/* Top facet: the highlight that makes it read as ice rather than a tile. */}
      <path
        d="M56 74c8-19 22-30 44-30s36 11 44 30c-14-8-28-12-44-12s-30 4-44 12Z"
        fill="url(#cube-face)"
      />
      {/* Internal fractures. */}
      <path
        d="M74 96c12 6 18 16 16 30"
        stroke="#ffffff"
        strokeOpacity="0.6"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M122 88c-9 10-11 22-6 34"
        stroke="#ffffff"
        strokeOpacity="0.45"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="112" cy="122" r="5" fill="#ffffff" fillOpacity="0.5" />
      <circle cx="82" cy="70" r="3" fill="#ffffff" fillOpacity="0.65" />
    </svg>
  );
}
