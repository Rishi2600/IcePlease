import { IceCube, Plume } from "@/components/product/product-visual";
import { cn } from "@/lib/utils";

/**
 * The cube at the surface, with flavor falling out of it. Each layer animates
 * on its own wrapper and only once, then the scene holds still.
 */
export function HeroGlass({ className }: { className?: string }) {
  return (
    <div
      role="img"
      aria-label="An ice cube floating at the surface of a dark drink, with orange flavor melting down from it"
      className={cn("pointer-events-none relative aspect-4/5 w-full", className)}
    >
      <div className="hero-glow absolute inset-0 animate-bloom" />
      <div className="absolute inset-0 origin-top animate-melt mix-blend-screen">
        <Plume accentColor="var(--color-accent)" />
      </div>
      <div className="absolute inset-0 animate-settle">
        <IceCube accentColor="var(--color-accent)" />
      </div>
    </div>
  );
}
