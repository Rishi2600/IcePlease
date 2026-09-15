import type { Metadata } from "next";
import Link from "next/link";
import { Section, SectionHeading, Eyebrow } from "@/components/site/section";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "About",
  description:
    "IcePlease makes flavored ice — cubes that add something to a drink instead of watering it down.",
};

export default function AboutPage() {
  return (
    <>
      <section className="border-b border-line">
        <div className="container-page py-16 sm:py-20">
          <div className="max-w-3xl">
            <Eyebrow>About</Eyebrow>
            <h1 className="mt-4 text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
              We started with a small complaint about ice.
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-ink-soft">
              Every cold drink has the same flaw. The thing keeping it cold is
              also the thing ruining it. Ice does one job and then quietly
              undoes the drink you paid for.
            </p>
          </div>
        </div>
      </section>

      <Section>
        <div className="container-page">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
            <SectionHeading
              eyebrow="The idea"
              title="Make the ice part of the drink."
            />
            <div className="space-y-5 text-base leading-relaxed text-ink-soft">
              <p>
                If a cube is going to spend twenty minutes in a glass melting,
                it may as well contribute something on the way. That is the
                entire product: flavored ice that releases flavor as it goes.
              </p>
              <p>
                It matters that it still looks like ice. A cube that reads as a
                brightly coloured frozen sweet belongs to a different category
                and sets a different expectation. Ours is meant to look like
                what it is — ice, with something in it.
              </p>
              <p>
                It also has to be genuinely effortless. The moment a product
                needs stirring, measuring or a second step, it stops being used
                at home and stops being viable behind a busy counter. One cube,
                one glass, done.
              </p>
            </div>
          </div>
        </div>
      </Section>

      <Section className="bg-ink text-white">
        <div className="container-page">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ice">
              Where we are
            </p>
            <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">
              Early, and saying so.
            </h2>
            <div className="mt-6 space-y-4 text-lg leading-relaxed text-ice-light/80">
              <p>
                IcePlease is at the beginning. We are working out which flavors
                earn a place in someone&apos;s freezer, what a pack should
                contain, and which businesses this is genuinely useful for.
              </p>
              <p>
                That means you will not find awards, review counts or partner
                logos on this site. We have not earned them yet, and putting
                them here before we have would tell you nothing true.
              </p>
            </div>
          </div>
        </div>
      </Section>

      <Section>
        <div className="container-page">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
            <SectionHeading
              eyebrow="What we will and will not say"
              title="Product claims, honestly."
            />
            <div className="space-y-5 text-base leading-relaxed text-ink-soft">
              <p>
                Flavored ice sits in food, and food claims matter. We publish
                ingredients, shelf life, storage guidance and certification only
                once they are finalized and verified — not as a best guess that
                sounds reassuring.
              </p>
              <p>
                If something is not stated on a product page, it is because we
                are not yet in a position to state it. Ask us and we will tell
                you where it stands.
              </p>
              <div className="pt-2">
                <Button asChild variant="outline">
                  <Link href="/contact">Ask us something</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Section>

      <Section className="pt-0">
        <div className="container-page">
          <div className="rounded-card border border-line bg-surface px-8 py-12 text-center sm:px-12">
            <h2 className="mx-auto max-w-xl text-3xl font-semibold sm:text-4xl">
              Try it, or tell us what would make you try it.
            </h2>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link href="/shop">Shop the range</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/b2b">For businesses</Link>
              </Button>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
