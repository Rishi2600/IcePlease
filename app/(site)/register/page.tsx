import { Suspense } from "react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/server/session";
import { RegisterForm } from "@/components/forms/register-form";
import { Logo } from "@/components/site/logo";

export const metadata: Metadata = {
  title: "Create an account",
  robots: { index: false },
};

export default async function RegisterPage() {
  if (await getSessionUser()) redirect("/account");

  return (
    <div className="container-page flex min-h-[70vh] items-center justify-center py-12">
      <div className="w-full max-w-sm">
        <div className="flex justify-center">
          <Logo />
        </div>
        <h1 className="mt-8 text-center text-3xl font-semibold">
          Create an account
        </h1>
        <p className="mt-2 text-center text-sm text-ink-muted">
          You can also order as a guest — an account just keeps your history.
        </p>

        <div className="mt-8 rounded-card border border-line bg-surface p-6">
          <Suspense fallback={<div className="h-96" />}>
            <RegisterForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
