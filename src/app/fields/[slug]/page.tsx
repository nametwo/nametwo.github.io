import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getAllPapers, getSidebarData, toSlug } from '@/lib/posts';
import { SITE } from '@/lib/site';
import PostList from '@/components/PostList';

export function generateStaticParams() {
  return getSidebarData().fields.map((f) => ({ slug: f.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const posts = getAllPapers().filter((p) => toSlug(p.field) === slug);
  if (posts.length === 0) return {};

  const name = posts[0].field;
  const url = `${SITE.url}/fields/${slug}`;
  const title = `${name} 분야 리뷰`;
  const description = `${name} 분야의 논문 리뷰 ${posts.length}편`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { type: 'website', url, title, description },
    twitter: { card: 'summary_large_image', title, description },
  };
}

export default async function FieldPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const posts = getAllPapers().filter((p) => toSlug(p.field) === slug);
  if (posts.length === 0) notFound();

  const name = posts[0].field;

  return <PostList category="분야" name={name} posts={posts} />;
}
