import Link from "next/link";
import { ArrowRight, Snowflake, Sparkles, Store, Timer } from "lucide-react";
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

export default async function HomePage() {
  const featured = await listFeaturedProducts(3);

  return (
    <>
      {/* ---------------------------------------------------------------- Hero */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 -top-40 h-[32rem] bg-[radial-gradient(60%_60%_at_70%_30%,rgba(143,216,238,0.45),transparent_70%)]"
        />
        <div className="container-page relative grid items-center gap-12 py-14 lg:grid-cols-2 lg:gap-16 lg:py-24">
          <div className="animate-rise">
            <Eyebrow>Flavored ice</Eyebrow>
            <h1 className="mt-4 text-4xl font-semibold leading-[1.05] sm:text-5xl lg:text-6xl">
              Your drink.
              <br />
              Better ice.
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-ink-soft">
              {BRAND.description} No syrups, no stirring, no extra step at the
              counter — you drop it in and the drink does the rest.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link href="/shop">
                  Shop IcePlease
                  <ArrowRight aria-hidden />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/b2b">For businesses</Link>
              </Button>
            </div>

            <dl className="mt-10 grid max-w-md grid-cols-3 gap-6 border-t border-line pt-6">
              <div>
                <dt className="text-xs uppercase tracking-wider text-ink-muted">
                  Prep time
                </dt>
                <dd className="mt-1 font-display text-xl font-semibold">None</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wider text-ink-muted">
                  Steps
                </dt>
                <dd className="mt-1 font-display text-xl font-semibold">One</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wider text-ink-muted">
                  Works in
                </dt>
                <dd className="mt-1 font-display text-xl font-semibold">
                  Any glass
                </dd>
              </div>
            </dl>
          </div>

          <div className="animate-rise" style={{ animationDelay: "120ms" }}>
            <HeroGlass />
          </div>
        </div>
      </section>

      {/* ------------------------------------------------- Product experience */}
      <Section className="bg-surface">
        <div className="container-page">
          <SectionHeading
            eyebrow="How it works"
            title="Four steps, and three of them happen on their own."
            description="Flavored ice is a new habit, so it is worth being literal about it."
          />
          <ExperienceSteps className="mt-10" />
          <div className="mt-8">
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
      <Section>
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
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
      <Section className="bg-ink text-white">
        <div className="container-page">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ice">
              Why bother
            </p>
            <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">
              Ordinary ice has one job and it does it badly.
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-ice-light/80">
              It cools your drink and then quietly waters it down. Flavored ice
              spends the same time in the glass doing something useful.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: Timer,
                title: "Nothing to prepare",
                body: "Take it out of the freezer, drop it in, done. There is no mixing step to get wrong or to slow down a busy counter.",
              },
              {
                icon: Sparkles,
                title: "The drink keeps changing",
                body: "Flavor arrives gradually as the cube melts, so the last mouthful is not the same as the first.",
              },
              {
                icon: Store,
                title: "Made for a glass people can see into",
                body: "Colour moves through the drink as it melts. It looks like something, which matters at a table and on a phone.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-card border border-white/10 bg-white/5 p-6"
              >
                <item.icon className="size-5 text-ice" aria-hidden />
                <h3 className="mt-4 text-lg font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ice-light/75">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ---------------------------------------------------------------- B2B */}
      <Section>
        <div className="container-page">
          <div className="overflow-hidden rounded-card border border-line bg-surface">
            <div className="grid gap-8 p-8 sm:p-12 lg:grid-cols-2 lg:items-center">
              <div>
                <Eyebrow>For cafés, bars and caterers</Eyebrow>
                <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">
                  A different drink without a different workflow.
                </h2>
                <p className="mt-4 text-base leading-relaxed text-ink-muted">
                  Flavored ice changes what comes out of your bar without adding
                  a step at the moment of service. Tell us what you pour and how
                  much you get through, and we will come back with specifics.
                </p>
                <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                  <Button asChild>
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

              <ul className="grid gap-3 sm:grid-cols-2">
                {[
                  "Cafés and coffee bars",
                  "Restaurants",
                  "Cocktail bars",
                  "Cloud kitchens",
                  "Caterers",
                  "Event organisers",
                ].map((item) => (
                  <li
                    key={item}
                    className="rounded-xl bg-surface-sunken px-4 py-3 text-sm font-medium text-ink-soft"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </Section>

      {/* ------------------------------------------------------------ Honest CTA */}
      <Section className="pt-0">
        <div className="container-page">
          <div className="rounded-card border border-line bg-surface-sunken px-8 py-12 text-center sm:px-12">
            <Eyebrow>Early days</Eyebrow>
            <h2 className="mx-auto mt-3 max-w-xl text-3xl font-semibold sm:text-4xl">
              IcePlease is just getting started.
            </h2>
            {/* No testimonials, ratings or partner logos: there are no real ones
                yet, and inventing them would be lying to customers. */}
            <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-ink-muted">
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
        </div>
      </Section>
    </>
  );
}
