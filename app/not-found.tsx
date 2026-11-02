import Link from "next/link";
import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col">
      <Navbar />
      <main className="container-page flex flex-1 flex-col items-center justify-center py-24 text-center">
        <p className="font-paint text-8xl text-forest">404</p>
        <h1 className="mt-4 text-5xl font-black sm:text-6xl">
          This page has slipped away.
        </h1>
        <p className="mt-4 max-w-md font-medium">
          The page you were after does not exist, or it has moved. The collection
          is right where you left it.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button asChild size="lg">
            <Link href="/shop">Explore the collection</Link>
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
