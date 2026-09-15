import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Snowflake, GlassWater, Droplets } from "lucide-react";
import { EXPERIENCE_STEPS } from "@/lib/brand";
import { Button } from "@/components/ui/button";
import { Section, SectionHeading, Eyebrow } from "@/components/site/section";
import { HeroGlass } from "@/components/site/hero-glass";

export const metadata: Metadata = {
  title: "How it works",
  description:
    "Flavored ice explained: choose a flavor, drop it in your drink, let it melt, enjoy. No mixing, no prep.",
};

export default function HowItWorksPage() {
  return (
    <>
      <section className="border-b border-line">
        <div className="container-page grid items-center gap-12 py-14 lg:grid-cols-2 lg:py-20">
          <div>
            <Eyebrow>How it works</Eyebrow>
            <h1 className="mt-4 text-4xl font-semibold leading-tight sm:text-5xl">
              It is ice. That is the whole trick.
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-ink-soft">
              There is nothing to mix, nothing to measure and nothing to learn.
              You put a cube in a glass the way you already do, and the drink
              gets better instead of weaker.
            </p>
          </div>
          <HeroGlass />
        </div>
      </section>

      <Section>
        <div className="container-page">
          <SectionHeading
            title="Four steps."
            description="Three of them happen without you."
          />
          <ol className="mt-12 space-y-px overflow-hidden rounded-card border border-line bg-line">
            {EXPERIENCE_STEPS.map((step, index) => (
              <li
                key={step.step}
                className="grid gap-4 bg-surface p-6 sm:grid-cols-[6rem_1fr] sm:gap-8 sm:p-8"
              >
                <span
                  aria-hidden
                  className="font-display text-5xl font-semibold text-ice-light"
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <h2 className="text-2xl font-semibold">{step.step}</h2>
                  <p className="mt-2 max-w-xl leading-relaxed text-ink-muted">
                    {step.detail}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </Section>

      <Section className="bg-surface">
        <div className="container-page">
          <SectionHeading
            eyebrow="The difference"
            title="Ordinary ice versus flavored ice."
          />

          <div className="mt-10 grid gap-5 lg:grid-cols-2">
            <div className="rounded-card border border-line bg-frost p-8">
              <Droplets className="size-5 text-ink-muted" aria-hidden />
              <h3 className="mt-4 text-xl font-semibold">Ordinary ice</h3>
              <ul className="mt-4 space-y-3 text-sm leading-relaxed text-ink-muted">
                <li>Cools the drink, then dilutes it.</li>
                <li>The last mouthful is the weakest one.</li>
                <li>Adds nothing to how the glass looks.</li>
              </ul>
            </div>

            <div className="rounded-card border border-ice-deep/25 bg-ice-light/40 p-8">
              <Snowflake className="size-5 text-ice-deep" aria-hidden />
              <h3 className="mt-4 text-xl font-semibold">IcePlease</h3>
              <ul className="mt-4 space-y-3 text-sm leading-relaxed text-ink-soft">
                <li>Cools the drink and adds flavor as it goes.</li>
                <li>The drink changes between the first sip and the last.</li>
                <li>Colour moves through the glass while it melts.</li>
              </ul>
            </div>
          </div>
        </div>
      </Section>

      <Section>
        <div className="container-page">
          <SectionHeading
            eyebrow="Practical questions"
            title="What people actually ask."
          />
          <dl className="mt-10 divide-y divide-line border-y border-line">
            {[
              {
                q: "What do I put it in?",
                a: "Anything cold and clear enough to notice: water, soda, iced tea, lemonade, cold coffee, a cocktail. Pick the flavor to match the drink rather than the other way round.",
              },
              {
                q: "Do I need to do anything first?",
                a: "No. Take it from the freezer and drop it in the glass. There is no mixing or measuring step.",
              },
              {
                q: "How many cubes per glass?",
                a: "Start with the same number of cubes you would normally use, then adjust. More cubes means the flavor arrives faster.",
              },
              {
                q: "What is in it?",
                a: "Each product page lists what that flavor is. We publish product details only once they are finalized, so you will not find a spec here that we have not confirmed.",
              },
            ].map((item) => (
              <div key={item.q} className="py-6">
                <dt className="text-lg font-semibold">{item.q}</dt>
                <dd className="mt-2 max-w-2xl leading-relaxed text-ink-muted">
                  {item.a}
                </dd>
              </div>
            ))}
          </dl>

          <div className="mt-12 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/shop">
                <GlassWater aria-hidden />
                See the flavors
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/contact">
                Ask us something
                <ArrowRight aria-hidden />
              </Link>
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
}
