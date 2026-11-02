import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/server/session";
import { Button } from "@/components/ui/button";
import { PageTitle } from "@/components/site/page-title";
import { CheckoutForm } from "@/components/checkout/checkout-form";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Complete your IcePlease order.",
  robots: { index: false },
};

export default async function CheckoutPage() {
  // Signing in is not required to order. If someone is signed in, their saved
  // details prefill the form rather than being retyped.
  const user = await getSessionUser();
  const account = user
    ? await prisma.user.findUnique({
        where: { id: user.id },
        select: {
          name: true,
          email: true,
          phone: true,
          addressLine1: true,
          addressLine2: true,
          city: true,
          postalCode: true,
        },
      })
    : null;

  return (
    <>
      <PageTitle title="Checkout">
        <Button asChild variant="ghost" size="sm" className="-ml-3">
          <Link href="/cart">
            <ArrowLeft aria-hidden />
            Back to cart
          </Link>
        </Button>
        {!user ? (
          <p className="mt-2">
            Ordering as a guest.{" "}
            <Link
              href="/login?callbackUrl=%2Fcheckout"
              className="font-bold underline underline-offset-2"
            >
              Sign in
            </Link>{" "}
            to keep this order in your history.
          </p>
        ) : null}
      </PageTitle>

      <div className="container-page py-10 sm:py-14">
        <CheckoutForm
          prefill={{
            customerName: account?.name ?? "",
            customerEmail: account?.email ?? "",
            customerPhone: account?.phone ?? "",
            addressLine1: account?.addressLine1 ?? "",
            addressLine2: account?.addressLine2 ?? "",
            city: account?.city ?? "",
            postalCode: account?.postalCode ?? "",
          }}
        />
      </div>
    </>
  );
}
