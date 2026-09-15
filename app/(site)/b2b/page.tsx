import type { Metadata } from "next";
import { Clock, PartyPopper, Repeat, Sparkles, Store, Wallet } from "lucide-react";
import { Section, SectionHeading, Eyebrow } from "@/components/site/section";
import { InquiryForm } from "@/components/forms/inquiry-form";

export const metadata: Metadata = {
  title: "For business",
  description:
    "Flavored ice for cafés, restaurants, bars, cloud kitchens, caterers and events. Bulk and recurring supply, enquiry-first.",
};

const SEGMENTS = [
  {
    icon: Store,
    title: "Cafés and coffee bars",
    body: "A coffee cube means an iced latte that does not get weaker as it sits. A fruit cube turns soda and iced tea into something you can put a price on.",
  },
  {
    icon: Sparkles,
    title: "Bars and restaurants",
    body: "A cocktail that changes between the first and last sip, without another bottle behind the bar or another step in the spec.",
  },
  {
    icon: Clock,
    title: "Cloud kitchens",
    body: "Beverages travel badly. Flavored ice arrives frozen, holds the drink cold and adds something on the way rather than diluting it.",
  },
  {
    icon: PartyPopper,
    title: "Caterers and events",
    body: "A self-serve drinks table that looks considered, with no bartender needed and nothing to mix on site.",
  },
];

const REASONS = [
  {
    icon: Clock,
    title: "No extra step at service",
    body: "Your team does what they already do and drops in a cube. Nothing new to train, nothing new to prep during a rush.",
  },
  {
    icon: Repeat,
    title: "Recurring supply",
    body: "Tell us your weekly volume and we plan around it. Standing orders are the norm rather than a special arrangement.",
  },
  {
    icon: Wallet,
    title: "Priced for volume",
    body: "Bulk pricing is quoted against your actual quantities. We would rather give you a real number than publish a table that does not fit you.",
  },
];

export default function B2BPage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-line">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 -top-32 h-96 bg-[radial-gradient(50%_60%_at_60%_40%,rgba(143,216,238,0.4),transparent_70%)]"
        />
        <div className="container-page relative py-16 sm:py-20">
          <div className="max-w-3xl">
            <Eyebrow>IcePlease for business</Eyebrow>
            <h1 className="mt-4 text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
              A different drink without a different workflow.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-soft">
              Flavored ice changes what comes out of your bar without adding a
              step at the moment of service. It arrives frozen, it goes in the
              glass, and the drink does the rest.
            </p>
            <div className="mt-8">
              <a
                href="#enquiry"
                className="inline-flex h-13 items-center rounded-full bg-ice-deep px-7 text-base font-medium text-white transition-colors hover:bg-ice-deeper"
              >
                Start a bulk enquiry
              </a>
            </div>
          </div>
        </div>
      </section>

      <Section id="segments">
        <div className="container-page">
          <SectionHeading
            eyebrow="Who it is for"
            title="Built for places that serve a lot of cold drinks."
          />
          <div className="mt-10 grid gap-5 sm:grid-cols-2">
            {SEGMENTS.map((segment) => (
              <div
                key={segment.title}
                className="rounded-card border border-line bg-surface p-6"
              >
                <segment.icon className="size-5 text-ice-deep" aria-hidden />
                <h3 className="mt-4 text-lg font-semibold">{segment.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                  {segment.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section className="bg-surface" id="events">
        <div className="container-page">
          <SectionHeading
            eyebrow="Why it works commercially"
            title="The economics of one more step are worse than they look."
            description="Anything that adds seconds at the counter costs you during the rush. Flavored ice adds none."
          />
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {REASONS.map((reason) => (
              <div
                key={reason.title}
                className="rounded-card border border-line bg-frost p-6"
              >
                <reason.icon className="size-5 text-ice-deep" aria-hidden />
                <h3 className="mt-4 text-lg font-semibold">{reason.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                  {reason.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section id="enquiry" className="scroll-mt-20">
        <div className="container-page">
          <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
            <div className="lg:sticky lg:top-24 lg:self-start">
              <SectionHeading
                eyebrow="Enquiry"
                title="Tell us what you pour."
                description="We quote against real quantities rather than publishing a price list that fits nobody. Send this and we will come back with specifics."
              />
              <ol className="mt-8 space-y-4 text-sm">
                {[
                  "You send the form with rough volumes.",
                  "We come back with pricing and a delivery pattern that fits.",
                  "You trial it before committing to anything recurring.",
                ].map((step, index) => (
                  <li key={step} className="flex gap-3">
                    <span
                      aria-hidden
                      className="grid size-6 shrink-0 place-items-center rounded-full bg-ice-light text-xs font-semibold text-ice-deeper"
                    >
                      {index + 1}
                    </span>
                    <span className="text-ink-soft">{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="rounded-card border border-line bg-surface p-6 sm:p-8">
              <h2 className="text-xl font-semibold">Bulk enquiry</h2>
              <p className="mt-1.5 text-sm text-ink-muted">
                Nothing is committed by sending this.
              </p>
              <div className="mt-6">
                <InquiryForm />
              </div>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
