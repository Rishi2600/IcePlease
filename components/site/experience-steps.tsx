import { EXPERIENCE_STEPS } from "@/lib/brand";
import { IceCube, Plume } from "@/components/product/product-visual";
import { cn } from "@/lib/utils";

/** One cube across four frames: above the water, in it, melting, nearly gone. */
const FRAMES = [
  { position: "translateY(-13.5%) scale(0.6)", plume: 0, warmth: 0 },
  { position: "translateY(14.7%) scale(0.6)", plume: 0.55, warmth: 0 },
  { position: "translateY(14.7%) scale(0.5)", plume: 1, warmth: 0.22 },
  { position: "translateY(14.7%) scale(0.3)", plume: 1, warmth: 0.62 },
];

/**
 * Choose → Drop → Melt → Enjoy.
 *
 * Flavored ice is not a category people already understand, so this sequence
 * appears wherever the product needs explaining rather than describing.
 */
export function ExperienceSteps({ className }: { className?: string }) {
  return (
    <ol
      className={cn(
        "grid overflow-hidden rounded-card border border-line bg-panel sm:grid-cols-2 lg:grid-cols-4",
        className,
      )}
    >
      {EXPERIENCE_STEPS.map((item, index) => {
        const frame = FRAMES[index];
        return (
          <li
            key={item.step}
            className="border-line not-first:border-t sm:even:border-l sm:nth-2:border-t-0 lg:not-first:border-l lg:not-first:border-t-0"
          >
            <div aria-hidden className="relative aspect-4/3 overflow-hidden bg-page">
              <div className="water absolute inset-x-0 bottom-0 top-[44%]" />
              <div
                className="absolute inset-x-0 bottom-0 top-[44%] bg-[radial-gradient(85%_100%_at_50%_100%,var(--color-accent),transparent)] mix-blend-screen"
                style={{ opacity: frame.warmth }}
              />
              {/* The origin is the waterline of the shared canvas. */}
              <div
                className="absolute inset-0 origin-[50%_29.3%]"
                style={{ transform: frame.position }}
              >
                {frame.plume > 0 ? (
                  <div
                    className="absolute inset-0 mix-blend-screen"
                    style={{ opacity: frame.plume }}
                  >
                    <Plume accentColor="var(--color-accent)" />
                  </div>
                ) : null}
                <IceCube accentColor="var(--color-accent)" />
              </div>
            </div>
            <div className="p-6">
              <h3 className="flex items-baseline gap-3 text-2xl font-normal">
                <span aria-hidden className="text-sm tabular-nums text-fg-muted">
                  {index + 1}
                </span>
                {item.step}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-fg-muted">
                {item.detail}
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
