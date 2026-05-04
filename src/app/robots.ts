import type { MetadataRoute } from 'next';
import { SITE } from '@/lib/site';

// output: "export" 환경에서 정적 파일로 떨어지도록 명시.
export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: `${SITE.url}/sitemap.xml`,
  };
}
