import type { MetadataRoute } from "next";
import { profile } from "@/lib/profile";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? profile.identity.links.website;
  return [
    {
      url: base,
      lastModified: new Date(profile.meta.lastUpdated),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
