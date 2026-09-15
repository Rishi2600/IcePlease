/**
 * Customer-facing order references.
 *
 * Sequential ids would leak order volume to anyone who buys twice, so the
 * reference is random. The alphabet omits characters that are easily confused
 * when a reference is read out over the phone (0/O, 1/I/L, U/V).
 */
const ALPHABET = "23456789ACDEFGHJKMNPQRSTWXYZ";

export function generateOrderNumber(): string {
  let code = "";
  for (let i = 0; i < 6; i += 1) {
    code += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
  }
  return `IP-${code}`;
}
