import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getAllReviews, getSidebarData, toSlug } from '@/lib/reviews';
import { SITE } from '@/lib/site';
import ReviewList from '@/components/ReviewList';

export function generateStaticParams() {
  return getSidebarData().fields.map((f) => ({ slug: f.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const reviews = getAllReviews().filter((r) => toSlug(r.field) === slug);
  if (reviews.length === 0) return {};

  const name = reviews[0].field;
  const url = `${SITE.url}/fields/${slug}`;
  const title = `${name} 분야 리뷰`;
  const description = `${name} 분야의 논문 리뷰 ${reviews.length}편`;

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
  const reviews = getAllReviews().filter((r) => toSlug(r.field) === slug);
  if (reviews.length === 0) notFound();

  const name = reviews[0].field;

  return <ReviewList category="분야" name={name} reviews={reviews} />;
}
