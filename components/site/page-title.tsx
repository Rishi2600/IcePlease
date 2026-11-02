import { cn } from "@/lib/utils";

/** The orange wall and painted sign that open every page. */
export function PageTitle({
  title,
  children,
  className,
}: {
  title: string;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <header className={cn("bg-orange text-ink", className)}>
      <div className="container-page pb-12 pt-4 sm:pb-16 sm:pt-8">
        <div className="board inline-block max-w-full px-8 py-6 sm:px-14 sm:py-9">
          <h1 className="font-paint text-5xl font-normal leading-[1.04] sm:text-7xl lg:text-8xl">
            {title}
          </h1>
        </div>
        {children ? <div className="mt-7 max-w-2xl text-lg font-medium">{children}</div> : null}
      </div>
    </header>
  );
}
