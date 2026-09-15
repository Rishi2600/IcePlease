import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/brand";
import { listActiveProducts } from "@/lib/server/catalogue";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = [
    { path: "", priority: 1 },
    { path: "/shop", priority: 0.9 },
    { path: "/how-it-works", priority: 0.7 },
    { path: "/b2b", priority: 0.8 },
    { path: "/about", priority: 0.5 },
    { path: "/contact", priority: 0.5 },
  ].map((route) => ({
    url: `${SITE_URL}${route.path}`,
    lastModified: new Date(),
    priority: route.priority,
  }));

  // Product pages come from the catalogue, so a new flavor is indexable
  // without anyone remembering to edit this file.
  const products = await listActiveProducts();

  return [
    ...staticRoutes,
    ...products.map((product) => ({
      url: `${SITE_URL}/shop/${product.slug}`,
      lastModified: new Date(),
      priority: 0.8,
    })),
  ];
}
