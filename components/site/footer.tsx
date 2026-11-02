import Link from "next/link";
import { Mail, Phone, MessageCircle } from "lucide-react";
import { BRAND, CONTACT, FOOTER_NAV, whatsappLink } from "@/lib/brand";
import { Logo } from "@/components/site/logo";

/** lucide dropped brand marks, so this one is drawn here. */
function InstagramGlyph() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function Footer() {
  const whatsapp = whatsappLink();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-ink text-white">
      <div className="container-page py-14">
        <div className="grid gap-10 md:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div>
            <Logo className="text-lime" />
            <p className="mt-4 max-w-xs text-sm leading-relaxed">
              {BRAND.description}
            </p>

            {/* Only channels that actually exist are rendered. */}
            <ul className="mt-5 space-y-2 text-sm">
              {CONTACT.email ? (
                <li>
                  <a
                    href={`mailto:${CONTACT.email}`}
                    className="inline-flex items-center gap-2 underline-offset-4 hover:underline"
                  >
                    <Mail className="size-4" aria-hidden />
                    {CONTACT.email}
                  </a>
                </li>
              ) : null}
              {CONTACT.phone ? (
                <li>
                  <a
                    href={`tel:${CONTACT.phone.replace(/\s/g, "")}`}
                    className="inline-flex items-center gap-2 underline-offset-4 hover:underline"
                  >
                    <Phone className="size-4" aria-hidden />
                    {CONTACT.phone}
                  </a>
                </li>
              ) : null}
              {whatsapp ? (
                <li>
                  <a
                    href={whatsapp}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="inline-flex items-center gap-2 underline-offset-4 hover:underline"
                  >
                    <MessageCircle className="size-4" aria-hidden />
                    WhatsApp
                  </a>
                </li>
              ) : null}
              {CONTACT.instagram ? (
                <li>
                  <a
                    href={CONTACT.instagram}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="inline-flex items-center gap-2 underline-offset-4 hover:underline"
                  >
                    <InstagramGlyph />
                    Instagram
                  </a>
                </li>
              ) : null}
            </ul>
          </div>

          {FOOTER_NAV.map((group) => (
            <nav key={group.title} aria-label={group.title}>
              <h2 className="font-display text-2xl font-extrabold text-lime">
                {group.title}
              </h2>
              <ul className="mt-4 space-y-2.5">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm underline-offset-4 hover:underline"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-white/25 pt-6 text-xs sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} <span translate="no">{BRAND.name}</span>.
            {CONTACT.serviceArea ? ` Delivering in ${CONTACT.serviceArea}.` : ""}
          </p>
          <p>{BRAND.tagline}</p>
        </div>
      </div>
    </footer>
  );
}
