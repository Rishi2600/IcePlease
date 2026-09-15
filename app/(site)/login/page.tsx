import { Suspense } from "react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/server/session";
import { LoginForm } from "@/components/forms/login-form";
import { Logo } from "@/components/site/logo";

export const metadata: Metadata = {
  title: "Sign in",
  robots: { index: false },
};

export default async function LoginPage() {
  if (await getSessionUser()) redirect("/account");

  return (
    <div className="container-page flex min-h-[70vh] items-center justify-center py-12">
      <div className="w-full max-w-sm">
        <div className="flex justify-center">
          <Logo />
        </div>
        <h1 className="mt-8 text-center text-3xl font-semibold">Sign in</h1>
        <p className="mt-2 text-center text-sm text-ink-muted">
          Track your orders and check out faster.
        </p>

        <div className="mt-8 rounded-card border border-line bg-surface p-6">
          <Suspense fallback={<div className="h-72" />}>
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
