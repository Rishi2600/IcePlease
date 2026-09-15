export default function ShopLoading() {
  return (
    <div className="container-page py-12 sm:py-16" role="status" aria-label="Loading the shop">
      <div className="h-12 w-40 animate-pulse rounded-lg bg-surface-sunken" />
      <div className="mt-4 h-5 w-full max-w-xl animate-pulse rounded bg-surface-sunken" />
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {[0, 1, 2, 3, 4, 5].map((card) => (
          <div
            key={card}
            className="animate-pulse rounded-card border border-line bg-surface p-3"
          >
            <div className="aspect-square w-full rounded-card bg-surface-sunken" />
            <div className="space-y-2 p-2 pt-5">
              <div className="h-4 w-2/3 rounded bg-surface-sunken" />
              <div className="h-3 w-1/2 rounded bg-surface-sunken" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
