import type { Metadata } from "next";
import Link from "next/link";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { CONTACT, whatsappLink, hasAnyContactChannel } from "@/lib/brand";
import { ContactForm } from "@/components/forms/contact-form";
import { Button } from "@/components/ui/button";
import { PageTitle } from "@/components/site/page-title";

export const metadata: Metadata = {
  title: "Talk to us",
  description:
    "Get in touch with IcePlease about orders, flavors or supplying your business.",
};

export default function ContactPage() {
  const whatsapp = whatsappLink("Hi IcePlease, I have a question.");

  return (
    <>
      <PageTitle title="Talk to us">
        <p>An order, a flavor, or a menu you are planning. We would love to hear about it.</p>
      </PageTitle>
      <div className="container-page grid gap-10 py-12 sm:py-16 lg:grid-cols-[1fr_1.5fr] lg:gap-16">
        <div className="space-y-8">
          {hasAnyContactChannel ? (
            <div>
              <h2 className="text-3xl font-extrabold">Reach us directly</h2>
              <ul className="mt-4 space-y-4">
                {CONTACT.email ? (
                  <li>
                    <a
                      href={`mailto:${CONTACT.email}`}
                      className="flex items-start gap-3 text-sm text-fg-soft hover:text-link"
                    >
                      <Mail className="mt-0.5 size-4 shrink-0" aria-hidden />
                      <span>
                        <span className="block font-medium text-fg">Email</span>
                        {CONTACT.email}
                      </span>
                    </a>
                  </li>
                ) : null}
                {CONTACT.phone ? (
                  <li>
                    <a
                      href={`tel:${CONTACT.phone.replace(/\s/g, "")}`}
                      className="flex items-start gap-3 text-sm text-fg-soft hover:text-link"
                    >
                      <Phone className="mt-0.5 size-4 shrink-0" aria-hidden />
                      <span>
                        <span className="block font-medium text-fg">Phone</span>
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
                      className="flex items-start gap-3 text-sm text-fg-soft hover:text-link"
                    >
                      <MessageCircle className="mt-0.5 size-4 shrink-0" aria-hidden />
                      <span>
                        <span className="block font-medium text-fg">WhatsApp</span>
                        Message us
                      </span>
                    </a>
                  </li>
                ) : null}
                {CONTACT.serviceArea ? (
                  <li className="flex items-start gap-3 text-sm text-fg-soft">
                    <MapPin className="mt-0.5 size-4 shrink-0" aria-hidden />
                    <span>
                      <span className="block font-medium text-fg">
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
            <div className="rounded-card border border-line bg-panel p-6">
              <h2 className="text-3xl font-extrabold">Direct channels</h2>
              <p className="mt-2 text-sm leading-relaxed text-fg-muted">
                We have not published a phone number or email address yet. The
                form here is the reliable way to reach us — it goes straight to
                the people running IcePlease.
              </p>
            </div>
          )}

          <div className="rounded-card border border-line bg-panel p-6">
            <h2 className="text-3xl font-extrabold">Serving guests?</h2>
            <p className="mt-2 text-sm leading-relaxed text-fg-muted">
              Hospitality has its own form, which asks what we need to shape a
              supply around your menu.
            </p>
            <Button asChild variant="outline" className="mt-4">
              <Link href="/b2b#enquiry">Begin an enquiry</Link>
            </Button>
          </div>
        </div>

        <div className="rounded-card border border-line bg-panel p-6 sm:p-8">
          <h2 className="text-3xl font-extrabold">Send a message</h2>
          <div className="mt-6">
            <ContactForm />
          </div>
        </div>
      </div>
    </>
  );
}
