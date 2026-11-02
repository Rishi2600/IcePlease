export default function ShopLoading() {
  return (
    <div role="status" aria-label="Loading the collection">
      <div className="h-72 animate-pulse bg-orange" />
      <div className="h-96 animate-pulse bg-raised" />
    </div>
  );
}
