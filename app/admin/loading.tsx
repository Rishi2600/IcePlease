export default function AdminLoading() {
  return (
    <div role="status" aria-label="Loading">
      <div className="h-9 w-48 animate-pulse rounded-lg bg-surface-sunken" />
      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[0, 1, 2, 3].map((card) => (
          <div
            key={card}
            className="h-28 animate-pulse rounded-card bg-surface-sunken"
          />
        ))}
      </div>
      <div className="mt-6 h-64 animate-pulse rounded-card bg-surface-sunken" />
    </div>
  );
}
