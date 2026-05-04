import type { MetadataRoute } from 'next';
import { SITE } from '@/lib/site';
import { getAllPosts, getSidebarData } from '@/lib/posts';

// output: "export" 환경에서 정적 sitemap.xml로 떨어지도록 명시.
export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts();
  const { fields, venues, series, tags } = getSidebarData();

  const staticUrls: MetadataRoute.Sitemap = [
    { url: SITE.url, lastModified: new Date(), priority: 1.0 },
    { url: `${SITE.url}/papers`, lastModified: new Date(), priority: 0.7 },
    { url: `${SITE.url}/devlogs`, lastModified: new Date(), priority: 0.7 },
    { url: `${SITE.url}/about`, lastModified: new Date(), priority: 0.5 },
    { url: `${SITE.url}/privacy`, lastModified: new Date(), priority: 0.3 },
    { url: `${SITE.url}/terms`, lastModified: new Date(), priority: 0.3 },
  ];

  const postUrls = posts.map((p) => ({
    url: `${SITE.url}/posts/${p.slug}`,
    lastModified: new Date(p.date),
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
  const seriesUrls = series.map((s) => ({
    url: `${SITE.url}/series/${s.slug}`,
    lastModified: new Date(),
    priority: 0.6,
  }));
  const tagUrls = tags.map((t) => ({
    url: `${SITE.url}/tags/${t.slug}`,
    lastModified: new Date(),
    priority: 0.5,
  }));

  return [
    ...staticUrls,
    ...postUrls,
    ...fieldUrls,
    ...venueUrls,
    ...seriesUrls,
    ...tagUrls,
  ];
}
