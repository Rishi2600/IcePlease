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
    <footer className="mt-24 border-t border-line bg-surface">
      <div className="container-page py-14">
        <div className="grid gap-10 md:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div>
            <Logo />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-muted">
              {BRAND.description}
            </p>

            {/* Only channels that actually exist are rendered. */}
            <ul className="mt-5 space-y-2 text-sm">
              {CONTACT.email ? (
                <li>
                  <a
                    href={`mailto:${CONTACT.email}`}
                    className="inline-flex items-center gap-2 text-ink-soft hover:text-ice-deep"
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
                    className="inline-flex items-center gap-2 text-ink-soft hover:text-ice-deep"
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
                    className="inline-flex items-center gap-2 text-ink-soft hover:text-ice-deep"
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
                    className="inline-flex items-center gap-2 text-ink-soft hover:text-ice-deep"
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
              <h2 className="text-sm font-semibold text-ink">{group.title}</h2>
              <ul className="mt-4 space-y-2.5">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-ink-muted transition-colors hover:text-ice-deep"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-line pt-6 text-xs text-ink-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {BRAND.name}.
            {CONTACT.serviceArea ? ` Delivering in ${CONTACT.serviceArea}.` : ""}
          </p>
          <p>{BRAND.tagline}</p>
        </div>
      </div>
    </footer>
  );
}
