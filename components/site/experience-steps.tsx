import { EXPERIENCE_STEPS } from "@/lib/brand";
import { cn } from "@/lib/utils";

/**
 * Choose → Drop → Melt → Enjoy.
 *
 * Flavored ice is not a category people already understand, so this sequence
 * appears wherever the product needs explaining rather than describing.
 */
export function ExperienceSteps({ className }: { className?: string }) {
  return (
    <ol className={cn("grid gap-4 sm:grid-cols-2 lg:grid-cols-4", className)}>
      {EXPERIENCE_STEPS.map((item, index) => (
        <li
          key={item.step}
          className="relative rounded-card border border-line bg-surface p-6"
        >
          <span
            aria-hidden
            className="font-display text-4xl font-semibold text-ice-light"
          >
            {String(index + 1).padStart(2, "0")}
          </span>
          <h3 className="mt-2 text-lg font-semibold">{item.step}</h3>
          <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">
            {item.detail}
          </p>
        </li>
      ))}
    </ol>
  );
}
