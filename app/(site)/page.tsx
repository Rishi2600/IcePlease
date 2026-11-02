import Link from "next/link";
import { BRAND } from "@/lib/brand";
import { formatMinor } from "@/lib/money";
import { listActiveProducts } from "@/lib/server/catalogue";
import { Button } from "@/components/ui/button";
import { FlavorTray } from "@/components/product/flavor-tray";
import { trayOrder } from "@/components/product/tones";

/**
 * Rendered per request rather than prerendered at build.
 *
 * The tray carries live stock, so a cached homepage can advertise a flavor that
 * sold out minutes ago. Rendering on demand also keeps the build independent of
 * database availability.
 */
export const dynamic = "force-dynamic";

const VENUES = [
  "Cafés and coffee bars",
  "Restaurants",
  "Cocktail bars",
  "Cloud kitchens",
  "Caterers",
  "Event organisers",
];

const HEADING = "font-black leading-[0.98]";

export default async function HomePage() {
  const products = trayOrder(await listActiveProducts()).slice(0, 6);

  return (
    <>
      <section className="bg-orange text-ink">
        <div className="container-page pb-14 pt-4 sm:pb-20 lg:pt-8">
          <div className="board px-7 py-8 sm:px-12 sm:py-12 lg:px-16 lg:py-16">
            <h1 className="font-paint text-[clamp(2.9rem,10.6vw,9rem)] font-normal leading-[1.04]">
              <span className="block">Your drink.</span>
              <span className="block">Better ice.</span>
            </h1>
          </div>
          <div className="mt-10 flex flex-wrap items-center justify-between gap-6">
            <p className="max-w-xl text-xl font-medium leading-relaxed">
              {BRAND.description}
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href="/shop">Explore the collection</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/b2b">For hospitality</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-sky pb-10 pt-14 text-white sm:pt-20">
        <div className="container-page">
          <h2 className={`${HEADING} text-[clamp(3.25rem,8.6vw,7.5rem)]`}>
            A flavor for every pour.
          </h2>
        </div>
      </section>

      {products.length > 0 ? (
        <FlavorTray
          products={products}
          detail={(product) => (
            <>
              <span className="text-2xl font-extrabold">
                {formatMinor(product.priceMinor)}
              </span>
              <span className="mt-1 font-semibold leading-tight">
                {product.stock > 0 ? product.packSize : "Out of stock"}
              </span>
            </>
          )}
        />
      ) : (
        <section className="bg-ink py-16 text-white">
          <p className="container-page text-xl font-medium">
            The first flavors are on their way.
          </p>
        </section>
      )}

      <section className="bg-lime py-20 text-forest sm:py-28 lg:py-36">
        <div className="container-page">
          <p className={`${HEADING} max-w-[9.5em] font-display text-[clamp(3.75rem,11vw,10rem)]`}>
            Ordinary ice takes. Ours gives.
          </p>
          <p className="mt-7 max-w-xl text-xl font-medium leading-relaxed">
            Ordinary ice dilutes what you poured. IcePlease does the opposite: as
            it melts, your drink deepens, so the last sip is as considered as the
            first.
          </p>
        </div>
      </section>

      <section className="bloom py-16 text-ink sm:py-24 lg:py-28">
        <div className="container-page">
          <h2 className={`${HEADING} max-w-[9em] text-[clamp(3.5rem,10vw,9rem)] text-white`}>
            The serve your guests will remember.
          </h2>
          <div className="mt-10 grid gap-10 md:grid-cols-2">
            <div>
              <p className="max-w-xl text-xl font-medium leading-relaxed">
                Bring a moment of theatre to every glass, with nothing new for
                your team to learn. Tell us what you pour and how much you get
                through, and we will shape the details around your menu.
              </p>
              <Button asChild size="lg" variant="secondary" className="mt-6">
                <Link href="/b2b#enquiry">Begin an enquiry</Link>
              </Button>
            </div>
            <ul className="grid content-start gap-x-6 gap-y-2 sm:grid-cols-2">
              {VENUES.map((venue) => (
                <li key={venue} className="text-xl font-bold">
                  {venue}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* No testimonials, ratings or partner logos: there are no real ones yet,
          and inventing them would be lying to customers. */}
      <section className="bg-forest py-16 text-white sm:py-24 lg:py-28">
        <div className="container-page">
          <h2 className={`${HEADING} text-[clamp(3.5rem,10vw,9rem)] text-lime`}>
            Slow down. Savor it.
          </h2>
          <p className="mt-6 max-w-xl text-xl font-medium leading-relaxed">
            Some evenings deserve more than an ordinary glass. Start with a tray
            and make tonight one of them.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Button
              asChild
              size="lg"
              className="bg-lime text-forest hover:bg-white hover:text-forest"
            >
              <Link href="/shop">Explore the collection</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/contact">Talk to us</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
