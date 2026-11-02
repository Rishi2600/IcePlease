import Link from "next/link";
import { ArrowRight, Snowflake } from "lucide-react";
import { BRAND } from "@/lib/brand";
import { listFeaturedProducts } from "@/lib/server/catalogue";
import { Button } from "@/components/ui/button";
import { Section, SectionHeading, Eyebrow } from "@/components/site/section";
import { ExperienceSteps } from "@/components/site/experience-steps";
import { HeroGlass } from "@/components/site/hero-glass";
import { ProductCard } from "@/components/product/product-card";
import { EmptyState } from "@/components/ui/empty-state";

/**
 * Rendered per request rather than prerendered at build.
 *
 * The featured flavors carry live stock badges, so a cached homepage can
 * advertise a tray that sold out minutes ago. Rendering on demand also means
 * the build never opens a database connection, which keeps deployments and
 * preview builds independent of database availability.
 */
export const dynamic = "force-dynamic";

const REASONS = [
  {
    title: "Nothing to prepare",
    body: "Take it out of the freezer, drop it in, done. There is no mixing step to get wrong or to slow down a busy counter.",
  },
  {
    title: "The drink keeps changing",
    body: "Flavor arrives gradually as the cube melts, so the last mouthful is not the same as the first.",
  },
  {
    title: "Made for a glass people can see into",
    body: "Colour moves through the drink as it melts. It looks like something, which matters at a table and on a phone.",
  },
];

const VENUES = [
  "Cafés and coffee bars",
  "Restaurants",
  "Cocktail bars",
  "Cloud kitchens",
  "Caterers",
  "Event organisers",
];

const FACTS = [
  { label: "Prep time", value: "None" },
  { label: "Steps", value: "One" },
  { label: "Works in", value: "Any glass" },
];

export default async function HomePage() {
  const featured = await listFeaturedProducts(3);

  return (
    <>
      {/* ---------------------------------------------------------------- Hero */}
      <section className="hero relative overflow-x-clip">
        <div className="container-page relative pb-12 pt-6 md:pb-28 md:pt-8">
          {/* The waterline sits exactly between the two lines of the headline. */}
          <div
            aria-hidden
            className="water pointer-events-none absolute left-1/2 top-[calc(var(--waterline)+1.5rem)] h-[60rem] w-screen -translate-x-1/2 md:top-[calc(var(--waterline)+2rem)]"
          />

          <div className="relative">
            <div className="flex h-8 items-center md:h-12">
              <Eyebrow>Flavored ice</Eyebrow>
            </div>
            <h1 className="mt-5 text-(length:--display) font-light leading-none tracking-[-0.035em] md:mt-8">
              <span className="block">Your drink.</span>
              <span className="block">Better ice.</span>
            </h1>
            <p className="mt-7 text-lg leading-relaxed text-fg-soft md:mt-9 md:max-w-[26rem] lg:max-w-lg">
              {BRAND.description} No syrups, no stirring, no extra step at the
              counter. You drop it in and the drink does the rest.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link href="/shop">
                  <span>
                    Shop <span translate="no">{BRAND.name}</span>
                  </span>
                  <ArrowRight aria-hidden />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/b2b">For businesses</Link>
              </Button>
            </div>

          </div>

          <HeroGlass className="mx-auto mt-10 max-w-sm md:absolute md:-right-[6%] md:top-[calc(var(--waterline)+2rem)] md:mt-0 md:w-[64%] md:max-w-none md:-translate-y-[17.6%]" />

          <dl className="relative grid max-w-md grid-cols-3 gap-6 md:mt-10 md:max-w-[22rem] lg:max-w-md">
            {FACTS.map((fact) => (
              <div key={fact.label}>
                <dt className="text-xs text-fg-muted">{fact.label}</dt>
                <dd className="mt-1 font-display text-xl">{fact.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ------------------------------------------------- Product experience */}
      <Section>
        <div className="container-page">
          <SectionHeading
            eyebrow="How it works"
            title="Four steps, and three of them happen on their own."
            description="Flavored ice is a new habit, so it is worth being literal about it."
          />
          <ExperienceSteps className="mt-12" />
          <div className="mt-6">
            <Button asChild variant="link" size="sm" className="px-0">
              <Link href="/how-it-works">
                See it in more detail
                <ArrowRight aria-hidden />
              </Link>
            </Button>
          </div>
        </div>
      </Section>

      {/* ----------------------------------------------------------- Flavors */}
      <Section className="pt-0 sm:pt-0 lg:pt-0">
        <div className="container-page">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading
              eyebrow="The range"
              title="Pick the flavor that suits the pour."
              description="Every cube is built around one drink it makes better."
            />
            <Button asChild variant="outline">
              <Link href="/shop">All products</Link>
            </Button>
          </div>

          {featured.length > 0 ? (
            <div className="mt-12 grid gap-x-6 gap-y-12 sm:grid-cols-2 md:grid-cols-3">
              {featured.map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  priority={index === 0}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              className="mt-10"
              icon={Snowflake}
              title="No flavors published yet"
              description="Products appear here as soon as they are added to the catalogue."
              action={
                <Button asChild variant="outline">
                  <Link href="/shop">Go to the shop</Link>
                </Button>
              }
            />
          )}
        </div>
      </Section>

      {/* ------------------------------------------------------ Why IcePlease */}
      <Section className="border-y border-line bg-panel">
        <div className="container-page grid gap-12 lg:grid-cols-2 lg:gap-20">
          <SectionHeading
            eyebrow="Why bother"
            title="Ordinary ice has one job and it does it badly."
            description="It cools your drink and then quietly waters it down. Flavored ice spends the same time in the glass doing something useful."
          />

          <dl className="divide-y divide-line border-y border-line">
            {REASONS.map((reason) => (
              <div key={reason.title} className="py-6">
                <dt className="font-display text-xl">{reason.title}</dt>
                <dd className="mt-2 text-sm leading-relaxed text-fg-muted sm:text-base">
                  {reason.body}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </Section>

      {/* ---------------------------------------------------------------- B2B */}
      <Section>
        <div className="container-page grid gap-12 lg:grid-cols-2 lg:items-end lg:gap-20">
          <div>
            <Eyebrow>For cafés, bars and caterers</Eyebrow>
            <h2 className="mt-4 text-4xl font-light leading-[1.08] sm:text-5xl">
              A different drink without a different workflow.
            </h2>
            <p className="mt-5 text-base leading-relaxed text-fg-muted sm:text-lg">
              Flavored ice changes what comes out of your bar without adding a
              step at the moment of service. Tell us what you pour and how much
              you get through, and we will come back with specifics.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild variant="secondary">
                <Link href="/b2b#enquiry">
                  Start a bulk enquiry
                  <ArrowRight aria-hidden />
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/b2b">How B2B works</Link>
              </Button>
            </div>
          </div>

          <ul className="grid grid-cols-1 border-t border-line sm:grid-cols-2 sm:gap-x-8">
            {VENUES.map((venue) => (
              <li
                key={venue}
                className="border-b border-line py-4 font-display text-xl text-fg-soft"
              >
                {venue}
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* ------------------------------------------------------------ Honest CTA */}
      <Section className="last-sip -mb-24 pb-40 pt-16 sm:pb-48 sm:pt-20 lg:pb-56 lg:pt-24">
        <div className="container-page text-center">
          <Eyebrow>Early days</Eyebrow>
          <h2 className="mx-auto mt-4 max-w-3xl text-4xl font-light leading-[1.08] sm:text-6xl">
            IcePlease is just getting started.
          </h2>
          {/* No testimonials, ratings or partner logos: there are no real ones
              yet, and inventing them would be lying to customers. */}
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-fg-soft sm:text-lg">
            We would rather show you the product than a wall of reviews we have
            not earned. Order a tray, or tell us what you would want in one.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/shop">Shop the range</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/contact">Tell us what you think</Link>
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
}
