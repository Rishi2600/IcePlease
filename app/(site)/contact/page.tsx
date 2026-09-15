import type { Metadata } from "next";
import Link from "next/link";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { CONTACT, whatsappLink, hasAnyContactChannel } from "@/lib/brand";
import { ContactForm } from "@/components/forms/contact-form";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with IcePlease about orders, flavors or supplying your business.",
};

export default function ContactPage() {
  const whatsapp = whatsappLink("Hi IcePlease, I have a question.");

  return (
    <div className="container-page py-12 sm:py-16">
      <header className="max-w-2xl">
        <h1 className="text-4xl font-semibold sm:text-5xl">Contact</h1>
        <p className="mt-4 text-lg leading-relaxed text-ink-muted">
          Questions about an order, a flavor, or supplying your business — this
          reaches us either way.
        </p>
      </header>

      <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_1.5fr] lg:gap-16">
        <div className="space-y-8">
          {hasAnyContactChannel ? (
            <div>
              <h2 className="text-lg font-semibold">Reach us directly</h2>
              <ul className="mt-4 space-y-4">
                {CONTACT.email ? (
                  <li>
                    <a
                      href={`mailto:${CONTACT.email}`}
                      className="flex items-start gap-3 text-sm text-ink-soft hover:text-ice-deep"
                    >
                      <Mail className="mt-0.5 size-4 shrink-0" aria-hidden />
                      <span>
                        <span className="block font-medium text-ink">Email</span>
                        {CONTACT.email}
                      </span>
                    </a>
                  </li>
                ) : null}
                {CONTACT.phone ? (
                  <li>
                    <a
                      href={`tel:${CONTACT.phone.replace(/\s/g, "")}`}
                      className="flex items-start gap-3 text-sm text-ink-soft hover:text-ice-deep"
                    >
                      <Phone className="mt-0.5 size-4 shrink-0" aria-hidden />
                      <span>
                        <span className="block font-medium text-ink">Phone</span>
                        {CONTACT.phone}
                      </span>
                    </a>
                  </li>
                ) : null}
                {whatsapp ? (
                  <li>
                    <a
                      href={whatsapp}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="flex items-start gap-3 text-sm text-ink-soft hover:text-ice-deep"
                    >
                      <MessageCircle className="mt-0.5 size-4 shrink-0" aria-hidden />
                      <span>
                        <span className="block font-medium text-ink">WhatsApp</span>
                        Message us
                      </span>
                    </a>
                  </li>
                ) : null}
                {CONTACT.serviceArea ? (
                  <li className="flex items-start gap-3 text-sm text-ink-soft">
                    <MapPin className="mt-0.5 size-4 shrink-0" aria-hidden />
                    <span>
                      <span className="block font-medium text-ink">
                        Delivering in
                      </span>
                      {CONTACT.serviceArea}
                    </span>
                  </li>
                ) : null}
              </ul>
            </div>
          ) : (
            /* No channel is configured yet. Rather than printing a fake phone
               number, the form is offered as the one that genuinely works. */
            <div className="rounded-card border border-line bg-surface p-6">
              <h2 className="text-lg font-semibold">Direct channels</h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                We have not published a phone number or email address yet. The
                form here is the reliable way to reach us — it goes straight to
                the people running IcePlease.
              </p>
            </div>
          )}

          <div className="rounded-card border border-line bg-surface p-6">
            <h2 className="text-lg font-semibold">Supplying your business?</h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-muted">
              Bulk and recurring supply has its own form, which asks the things
              we would need to quote properly.
            </p>
            <Button asChild variant="outline" className="mt-4">
              <Link href="/b2b#enquiry">Bulk enquiry</Link>
            </Button>
          </div>
        </div>

        <div className="rounded-card border border-line bg-surface p-6 sm:p-8">
          <h2 className="text-xl font-semibold">Send a message</h2>
          <div className="mt-6">
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  );
}
