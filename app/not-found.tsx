import Link from "next/link";
import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col">
      <Navbar />
      <main className="container-page flex flex-1 flex-col items-center justify-center py-24 text-center">
        <p className="font-display text-7xl font-semibold text-ice-light">404</p>
        <h1 className="mt-4 text-3xl font-semibold sm:text-4xl">
          This page has melted.
        </h1>
        <p className="mt-4 max-w-md text-ink-muted">
          The page you were after does not exist, or it moved. The shop is still
          where you left it.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button asChild size="lg">
            <Link href="/shop">Browse flavors</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/">Back to the homepage</Link>
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
}
