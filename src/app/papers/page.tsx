import SiteShell from '@/components/SiteShell';
import PostCard from '@/components/PostCard';
import { getAllPapers } from '@/lib/posts';
import { SITE } from '@/lib/site';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '논문 리뷰',
  description: `${SITE.name}의 논문 리뷰 모음`,
  alternates: { canonical: `${SITE.url}/papers` },
};

export default function PapersIndex() {
  const papers = getAllPapers();

  return (
    <SiteShell>
      <header className="mb-8">
        <h1 className="text-3xl font-bold">논문 리뷰</h1>
        <p className="mt-2 text-sm text-zinc-500">
          AI/ML 논문 {papers.length}편
        </p>
      </header>

      <ul className="space-y-6">
        {papers.map((p) => (
          <PostCard key={p.slug} post={p} />
        ))}
      </ul>
    </SiteShell>
  );
}
