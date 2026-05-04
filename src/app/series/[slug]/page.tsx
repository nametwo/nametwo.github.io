import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getAllDevlogs, getSidebarData } from '@/lib/posts';
import { getSeriesName } from '@/lib/series';
import { SITE } from '@/lib/site';
import PostList from '@/components/PostList';

export function generateStaticParams() {
  return getSidebarData().series.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const posts = getAllDevlogs().filter((d) => d.series === slug);
  if (posts.length === 0) return {};

  const name = getSeriesName(slug);
  const url = `${SITE.url}/series/${slug}`;
  const title = `${name} 시리즈`;
  const description = `"${name}" 시리즈 ${posts.length}편`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { type: 'website', url, title, description },
    twitter: { card: 'summary_large_image', title, description },
  };
}

export default async function SeriesPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  // 시리즈는 시간 정방향(1편 → 2편)이 자연스러우므로 오래된 순으로 정렬.
  const posts = getAllDevlogs()
    .filter((d) => d.series === slug)
    .sort((a, b) => a.date.localeCompare(b.date));
  if (posts.length === 0) notFound();

  return <PostList category="시리즈" name={getSeriesName(slug)} posts={posts} />;
}
