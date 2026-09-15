import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/brand";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Nothing here is secret — these are simply not useful in an index, and
      // /admin and /account are protected server-side regardless.
      disallow: ["/admin", "/account", "/cart", "/checkout", "/order/", "/api/"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
