export default function ShopLoading() {
  return (
    <div className="container-page py-12 sm:py-16" role="status" aria-label="Loading the shop…">
      <div className="h-20 w-48 animate-pulse rounded-lg bg-raised" />
      <div className="mt-4 h-5 w-full max-w-xl animate-pulse rounded bg-raised" />
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {[0, 1, 2, 3, 4, 5].map((card) => (
          <div
            key={card}
            className="animate-pulse"
          >
            <div className="aspect-4/5 w-full rounded-card bg-panel" />
            <div className="space-y-2 pt-5">
              <div className="h-4 w-2/3 rounded bg-raised" />
              <div className="h-3 w-1/2 rounded bg-raised" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
