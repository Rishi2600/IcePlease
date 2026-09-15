/**
 * Brand-level content that recurs across the site.
 *
 * This file holds presentation constants only — never product facts. Flavors,
 * pack sizes, prices and availability come from the database (see ADR-006).
 *
 * Contact channels are read from the environment. Anything left blank is
 * hidden by the UI rather than rendered as a placeholder that looks like a
 * working contact channel.
 */

export const BRAND = {
  name: "IcePlease",
  tagline: "Your drink. Better ice.",
  description:
    "Flavored ice cubes you drop straight into your drink. As they melt, the flavor arrives.",
} as const;

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export type NavLink = { href: string; label: string };

export const PRIMARY_NAV: readonly NavLink[] = [
  { href: "/shop", label: "Shop" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/b2b", label: "For Business" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export const FOOTER_NAV: readonly { title: string; links: NavLink[] }[] = [
  {
    title: "Shop",
    links: [
      { href: "/shop", label: "All products" },
      { href: "/how-it-works", label: "How it works" },
      { href: "/cart", label: "Your cart" },
    ],
  },
  {
    title: "Business",
    links: [
      { href: "/b2b", label: "Cafés & restaurants" },
      { href: "/b2b#enquiry", label: "Bulk enquiry" },
      { href: "/b2b#events", label: "Events & catering" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About IcePlease" },
      { href: "/contact", label: "Contact" },
      { href: "/login", label: "Account" },
    ],
  },
];

/** The four-step product idea, used wherever the experience is explained. */
export const EXPERIENCE_STEPS = [
  {
    step: "Choose",
    detail: "Pick a flavor that suits what you are pouring.",
  },
  {
    step: "Drop",
    detail: "Drop the cubes straight into the glass. No prep, no mixing.",
  },
  {
    step: "Melt",
    detail: "As the ice melts it releases flavor into the drink.",
  },
  {
    step: "Enjoy",
    detail: "The drink keeps changing as you sip. Cold the whole way down.",
  },
] as const;

function env(value: string | undefined): string | null {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

/**
 * Real contact channels, or null. Never invent one of these — an email address
 * nobody reads is worse than no email address at all.
 */
export const CONTACT = {
  email: env(process.env.NEXT_PUBLIC_CONTACT_EMAIL),
  phone: env(process.env.NEXT_PUBLIC_CONTACT_PHONE),
  whatsapp: env(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER),
  instagram: env(process.env.NEXT_PUBLIC_INSTAGRAM_URL),
  serviceArea: env(process.env.NEXT_PUBLIC_SERVICE_AREA),
} as const;

export function whatsappLink(message?: string): string | null {
  if (!CONTACT.whatsapp) return null;
  const digits = CONTACT.whatsapp.replace(/\D/g, "");
  if (!digits) return null;
  const query = message ? `?text=${encodeURIComponent(message)}` : "";
  return `https://wa.me/${digits}${query}`;
}

export const hasAnyContactChannel =
  Boolean(CONTACT.email) || Boolean(CONTACT.phone) || Boolean(CONTACT.whatsapp);
