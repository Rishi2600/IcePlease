import type { NextConfig } from "next";

/**
 * Hosting dashboards — Vercel's included — let you save an environment
 * variable with an empty value, and an empty value is not the same thing as an
 * unset one. Libraries that fall back with `??` only catch null and undefined,
 * so an empty string travels straight through.
 *
 * next-auth's `parseUrl` does exactly that with NEXTAUTH_URL and ends at
 * `new URL("")`, which fails the build with a bare `TypeError: Invalid URL`
 * pointing at `/_not-found` — nowhere near the actual cause.
 *
 * Treating "set but empty" as "not set" removes the whole class of bug. This
 * runs before the build workers are forked, so they inherit the cleaned
 * environment.
 */
const OPTIONAL_VARS = [
  "NEXTAUTH_URL",
  "NEXT_PUBLIC_SITE_URL",
  "DELIVERY_FEE_MINOR",
  "FREE_DELIVERY_THRESHOLD_MINOR",
  "MAX_QUANTITY_PER_ITEM",
  "NEXT_PUBLIC_CONTACT_EMAIL",
  "NEXT_PUBLIC_CONTACT_PHONE",
  "NEXT_PUBLIC_WHATSAPP_NUMBER",
  "NEXT_PUBLIC_INSTAGRAM_URL",
  "NEXT_PUBLIC_SERVICE_AREA",
];

for (const key of OPTIONAL_VARS) {
  if (process.env[key]?.trim() === "") delete process.env[key];
}

/**
 * Configuration the application cannot run without. Checked here so a
 * misconfigured deployment fails during the build with a sentence that names
 * the variable, rather than at the first request with a stack trace.
 */
const REQUIRED_IN_PRODUCTION = ["DATABASE_URL", "NEXTAUTH_SECRET"];

if (process.env.NODE_ENV === "production" && !process.env.NEXT_PUBLIC_SKIP_ENV_CHECK) {
  const missing = REQUIRED_IN_PRODUCTION.filter(
    (key) => !process.env[key]?.trim(),
  );
  if (missing.length > 0) {
    throw new Error(
      `Missing required environment ${
        missing.length === 1 ? "variable" : "variables"
      }: ${missing.join(", ")}. ` +
        "Set them in your hosting provider's environment settings — note that " +
        "a variable saved with an empty value counts as missing. See .env.example.",
    );
  }
}

const nextConfig: NextConfig = {
  images: {
    // Product photography is configured per-product via Product.imageUrl, so
    // the hosts it may come from are a deployment decision rather than a code
    // one. Add the CDN you actually use before setting remote image URLs.
    remotePatterns: [],
  },
};

export default nextConfig;
