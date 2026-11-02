const TONES = [
  "tone-ink",
  "tone-lime",
  "tone-orange",
  "tone-forest",
  "tone-pink",
  "tone-sky",
] as const;

/** Available flavors first, so sold-out columns gather at the end of the tray. */
export function trayOrder<T extends { stock: number }>(products: T[]): T[] {
  return [...products].sort(
    (a, b) => Number(a.stock <= 0) - Number(b.stock <= 0),
  );
}

/** Colours come from position, so a new flavor can never go off-palette. */
export function toneFor(index: number, stock: number): string {
  return stock <= 0 ? "tone-sold" : TONES[index % TONES.length];
}
