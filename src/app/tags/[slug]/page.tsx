import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getAllReviews, getSidebarData, toSlug } from '@/lib/reviews';
import { SITE } from '@/lib/site';
import ReviewList from '@/components/ReviewList';

export function generateStaticParams() {
  return getSidebarData().tags.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const reviews = getAllReviews().filter((r) =>
    r.tags.some((t) => toSlug(t) === slug),
  );
  if (reviews.length === 0) return {};

  const name =
    reviews[0].tags.find((t) => toSlug(t) === slug) ?? slug;
  const url = `${SITE.url}/tags/${slug}`;
  const title = `#${name} 태그 리뷰`;
  const description = `#${name} 태그가 달린 논문 리뷰 ${reviews.length}편`;

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
  const reviews = getAllReviews().filter((r) =>
    r.tags.some((t) => toSlug(t) === slug),
  );
  if (reviews.length === 0) notFound();

  const name =
    reviews[0].tags.find((t) => toSlug(t) === slug) ?? slug;

  return <ReviewList category="태그" name={`#${name}`} reviews={reviews} />;
}
