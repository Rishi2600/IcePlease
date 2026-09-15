/*
  Placeholder brand shell.

  Deliberately claims nothing that is not finalized about the physical product:
  no flavors, pack sizes, prices or availability. Those arrive with the real
  catalogue in Phase 2.
*/
export default function Home() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-3xl flex-col items-center justify-center px-6 py-16 text-center">
      <p className="text-sm font-medium tracking-[0.2em] text-muted-foreground uppercase">
        IcePlease
      </p>

      <h1 className="mt-6 text-4xl font-semibold tracking-tight text-balance sm:text-6xl">
        Your drink. <span className="text-primary">Better ice.</span>
      </h1>

      <p className="mt-5 max-w-lg text-base text-pretty text-muted-foreground sm:text-lg">
        Flavored ice that turns every sip into something better.
      </p>

      <div
        aria-hidden
        className="mt-12 h-px w-24 bg-gradient-to-r from-transparent via-primary to-transparent"
      />

      <p className="mt-12 text-sm text-muted-foreground">
        Site coming together now.
      </p>
    </main>
  );
}
