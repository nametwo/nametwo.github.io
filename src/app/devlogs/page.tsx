import SiteShell from '@/components/SiteShell';
import PostCard from '@/components/PostCard';
import { getAllDevlogs } from '@/lib/posts';
import { SITE } from '@/lib/site';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '개발 로그',
  description: `${SITE.name}의 개발 로그 모음`,
  alternates: { canonical: `${SITE.url}/devlogs` },
};

export default function DevlogsIndex() {
  const devlogs = getAllDevlogs();

  return (
    <SiteShell>
      <header className="mb-8">
        <h1 className="text-3xl font-bold">개발 로그</h1>
        <p className="mt-2 text-sm text-zinc-500">
          사이트 제작기 등 {devlogs.length}편
        </p>
      </header>

      <ul className="space-y-6">
        {devlogs.map((d) => (
          <PostCard key={d.slug} post={d} />
        ))}
      </ul>
    </SiteShell>
  );
}
