import Image from "next/image";

/** A small product tile: the photo if there is one, otherwise its initial. */
export function ProductThumb({
  name,
  imageUrl,
  sizes,
}: {
  name: string;
  imageUrl?: string | null;
  sizes: string;
}) {
  return (
    <div className="relative grid aspect-square w-full place-items-center overflow-hidden rounded-xl bg-forest font-paint text-2xl text-lime">
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt={`${name} flavored ice`}
          fill
          sizes={sizes}
          className="object-cover"
        />
      ) : (
        <span aria-hidden>{name.charAt(0)}</span>
      )}
    </div>
  );
}
