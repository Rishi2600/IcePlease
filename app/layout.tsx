import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { Providers } from "./provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "IcePlease — Flavored ice for better drinks",
    template: "%s | IcePlease",
  },
  description:
    "IcePlease makes flavored ice you drop straight into a drink. As it melts, it adds flavor.",
  openGraph: {
    type: "website",
    siteName: "IcePlease",
    url: siteUrl,
    title: "IcePlease — Flavored ice for better drinks",
    description:
      "IcePlease makes flavored ice you drop straight into a drink. As it melts, it adds flavor.",
  },
  twitter: {
    card: "summary_large_image",
    title: "IcePlease — Flavored ice for better drinks",
    description:
      "IcePlease makes flavored ice you drop straight into a drink. As it melts, it adds flavor.",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7fbfe" },
    { media: "(prefers-color-scheme: dark)", color: "#0b1b2b" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} font-sans`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
