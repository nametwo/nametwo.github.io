import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getAllPosts, getSidebarData, toSlug } from '@/lib/posts';
import { SITE } from '@/lib/site';
import PostList from '@/components/PostList';

export function generateStaticParams() {
  return getSidebarData().tags.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const posts = getAllPosts().filter((p) =>
    p.tags.some((t) => toSlug(t) === slug),
  );
  if (posts.length === 0) return {};

  const name = posts[0].tags.find((t) => toSlug(t) === slug) ?? slug;
  const url = `${SITE.url}/tags/${slug}`;
  const title = `#${name} 태그`;
  const description = `#${name} 태그가 달린 글 ${posts.length}편`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { type: 'website', url, title, description },
    twitter: { card: 'summary_large_image', title, description },
  };
}

export default async function TagPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const posts = getAllPosts().filter((p) =>
    p.tags.some((t) => toSlug(t) === slug),
  );
  if (posts.length === 0) notFound();

  const name = posts[0].tags.find((t) => toSlug(t) === slug) ?? slug;

  return <PostList category="태그" name={`#${name}`} posts={posts} />;
}
