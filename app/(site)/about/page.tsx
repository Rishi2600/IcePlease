import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PageTitle } from "@/components/site/page-title";

export const metadata: Metadata = {
  title: "Our story",
  description:
    "IcePlease began with a small complaint about ice, and a belief that it should add to a drink instead of taking from it.",
};

const QUESTIONS = [
  {
    q: "What do I pour it into?",
    a: "Anything cold and clear enough to notice: water, soda, iced tea, lemonade, cold coffee, a cocktail. Choose the flavor to suit the drink.",
  },
  {
    q: "Do I need to do anything first?",
    a: "No. Take it from the freezer and place it in the glass. There is nothing to mix or measure.",
  },
  {
    q: "How many cubes per glass?",
    a: "Start with the number of cubes you would normally use, then adjust. More cubes means the flavor arrives sooner.",
  },
  {
    q: "What is in it?",
    a: "Each product page describes that flavor. We publish product details only once they are finalized, so you will not find a spec here that we have not confirmed.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageTitle title="Our story">
        <p>
          It began with a small complaint about ice. Every great drink has the
          same flaw: the thing keeping it cold is the thing slowly undoing it.
        </p>
      </PageTitle>

      <section className="bg-forest py-16 text-white sm:py-24">
        <div className="container-page grid gap-10 lg:grid-cols-2 lg:gap-20">
          <h2 className="text-[clamp(3.25rem,8vw,7rem)] font-black leading-[0.98] text-lime">
            Make the ice part of the drink.
          </h2>
          <div className="space-y-5 text-lg leading-relaxed">
            <p>
              If a cube is going to spend twenty minutes melting in your glass,
              it should give something back. That is the whole idea: flavored
              ice that unfolds as it goes.
            </p>
            <p>
              It still looks like ice, because it should. Ours is meant to be
              exactly what it is: ice, with something in it.
            </p>
            <p>
              And it has to feel effortless. One cube, one glass, and the moment
              takes care of itself.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-sky py-16 text-ink sm:py-24">
        <div className="container-page">
          <h2 className="text-[clamp(3.25rem,8vw,7rem)] font-black leading-[0.98] text-white">
            What people ask.
          </h2>
          <dl className="mt-10 grid gap-x-12 gap-y-8 md:grid-cols-2">
            {QUESTIONS.map((item) => (
              <div key={item.q}>
                <dt className="font-display text-3xl font-extrabold">{item.q}</dt>
                <dd className="mt-2 text-lg font-medium leading-relaxed">
                  {item.a}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="py-16 sm:py-24">
        <div className="container-page grid gap-10 lg:grid-cols-2 lg:gap-20">
          <h2 className="text-[clamp(3.25rem,8vw,7rem)] font-black leading-[0.98] text-forest">
            Our word, kept.
          </h2>
          <div className="space-y-5 text-lg font-medium leading-relaxed">
            <p>
              Flavored ice is food, and food claims matter. We publish
              ingredients, shelf life, storage guidance and certification only
              once they are finalized and verified.
            </p>
            <p>
              If something is not stated on a product page, ask us and we will
              tell you where it stands.
            </p>
            <Button asChild variant="outline">
              <Link href="/contact">Ask us something</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
