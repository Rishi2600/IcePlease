import type { Metadata } from "next";
import { InquiryForm } from "@/components/forms/inquiry-form";
import { PageTitle } from "@/components/site/page-title";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "For hospitality",
  description:
    "Flavored ice for cafés, restaurants, bars, cloud kitchens, caterers and events. A signature serve with nothing new for your team to learn.",
};

const SEGMENTS = [
  {
    tone: "tone-ink",
    title: "Cafés and coffee bars",
    body: "An iced latte that holds its character to the last sip, and a fruit cube that turns soda into a signature.",
  },
  {
    tone: "tone-pink",
    title: "Bars and restaurants",
    body: "A cocktail that evolves between the first sip and the last, without another bottle behind the bar.",
  },
  {
    tone: "tone-forest",
    title: "Cloud kitchens",
    body: "Beverages travel badly. Flavored ice arrives frozen, holds the drink cold and adds to it on the way.",
  },
  {
    tone: "tone-sky",
    title: "Caterers and events",
    body: "A self-serve drinks table that feels considered, with no bartender needed and nothing to mix on site.",
  },
];

const REASONS = [
  {
    title: "Effortless at service",
    body: "Your team does what they already do and places a cube in the glass. Nothing new to train, nothing new to prep during a rush.",
  },
  {
    title: "Supply around your week",
    body: "Tell us your weekly volume and we will plan around it.",
  },
  {
    title: "Priced for your quantities",
    body: "Bulk pricing is quoted against what you actually pour, so you get a real number rather than a table that does not fit.",
  },
];

export default function B2BPage() {
  return (
    <>
      <PageTitle title="For hospitality">
        <p>
          Give every glass a moment of theatre, without adding a step at the
          moment of service.
        </p>
        <Button asChild size="lg" className="mt-6">
          <a href="#enquiry">Begin an enquiry</a>
        </Button>
      </PageTitle>

      <section id="events" aria-label="Who it is for" className="grid md:grid-cols-2 lg:grid-cols-4">
        {SEGMENTS.map((segment) => (
          <div key={segment.title} className={`${segment.tone} px-6 py-10 lg:min-h-96`}>
            <h2 className="text-5xl font-black">{segment.title}</h2>
            <p className="mt-5 text-lg font-semibold leading-snug">{segment.body}</p>
          </div>
        ))}
      </section>

      <section className="bg-forest py-16 text-white sm:py-24">
        <div className="container-page">
          <h2 className="max-w-[10em] text-[clamp(3.25rem,8vw,7rem)] font-black leading-[0.98] text-lime">
            The serve your guests will remember.
          </h2>
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {REASONS.map((reason) => (
              <div key={reason.title}>
                <h3 className="text-3xl font-extrabold text-lime">{reason.title}</h3>
                <p className="mt-2 text-lg leading-relaxed">{reason.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="enquiry" className="scroll-mt-20 py-16 sm:py-24">
        <div className="container-page grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
          <div>
            <h2 className="text-[clamp(3.25rem,7vw,6rem)] font-black leading-[0.98] text-forest">
              Tell us what you pour.
            </h2>
            <p className="mt-5 text-lg font-medium leading-relaxed">
              Share your rough volumes and we will come back with pricing and a
              delivery pattern that fits. You can try it before committing to
              anything recurring.
            </p>
          </div>
          <div className="rounded-card bg-panel p-6 sm:p-8">
            <h3 className="text-3xl font-extrabold">Your enquiry</h3>
            <p className="mt-1.5 text-sm text-fg-muted">
              Nothing is committed by sending this.
            </p>
            <div className="mt-6">
              <InquiryForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
