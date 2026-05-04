import type { MetadataRoute } from 'next';
import { SITE } from '@/lib/site';
import { getAllReviews, getSidebarData } from '@/lib/reviews';

// output: "export" 환경에서 정적 sitemap.xml로 떨어지도록 명시.
export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const reviews = getAllReviews();
  const { fields, venues, tags } = getSidebarData();

  const staticUrls: MetadataRoute.Sitemap = [
    { url: SITE.url, lastModified: new Date(), priority: 1.0 },
    { url: `${SITE.url}/about`, lastModified: new Date(), priority: 0.5 },
    { url: `${SITE.url}/privacy`, lastModified: new Date(), priority: 0.3 },
    { url: `${SITE.url}/terms`, lastModified: new Date(), priority: 0.3 },
  ];

  const reviewUrls = reviews.map((r) => ({
    url: `${SITE.url}/reviews/${r.slug}`,
    lastModified: new Date(r.date),
    priority: 0.8,
  }));

  const fieldUrls = fields.map((f) => ({
    url: `${SITE.url}/fields/${f.slug}`,
    lastModified: new Date(),
    priority: 0.6,
  }));
  const venueUrls = venues.map((v) => ({
    url: `${SITE.url}/venues/${v.slug}`,
    lastModified: new Date(),
    priority: 0.6,
  }));
  const tagUrls = tags.map((t) => ({
    url: `${SITE.url}/tags/${t.slug}`,
    lastModified: new Date(),
    priority: 0.5,
  }));

  return [...staticUrls, ...reviewUrls, ...fieldUrls, ...venueUrls, ...tagUrls];
}
