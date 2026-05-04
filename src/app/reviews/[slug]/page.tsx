import type { Metadata } from 'next';
import { getAllReviewSlugs, getAllReviews, getReviewToc } from '@/lib/reviews';
import { SITE } from '@/lib/site';
import SiteShell from '@/components/SiteShell';
import Toc from '@/components/Toc';
import ReadingProgress from '@/components/ReadingProgress';
import Comments from '@/components/Comments';
import { notFound } from 'next/navigation';

export function generateStaticParams() {
  return getAllReviewSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const meta = getAllReviews().find((r) => r.slug === slug);
  if (!meta) return {};

  const url = `${SITE.url}/reviews/${slug}`;
  return {
    title: meta.title,
    description: meta.summary,
    alternates: { canonical: url },
    openGraph: {
      type: 'article',
      url,
      title: meta.title,
      description: meta.summary,
      publishedTime: meta.date,
      tags: meta.tags,
      authors: [SITE.author],
    },
    twitter: {
      card: 'summary_large_image',
      title: meta.title,
      description: meta.summary,
    },
  };
}

export default async function ReviewPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const meta = getAllReviews().find((r) => r.slug === slug);
  if (!meta) notFound();

  const toc = getReviewToc(slug);
  const { default: MDXContent } = await import(`@/../content/reviews/${slug}.mdx`);

  // schema.org BlogPosting 구조화 데이터. 검색엔진이 글의 메타정보를 정확히 인식.
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: meta.title,
    description: meta.summary,
    datePublished: meta.date,
    author: { '@type': 'Person', name: SITE.author },
    publisher: { '@type': 'Organization', name: SITE.name, url: SITE.url },
    keywords: meta.tags.join(', '),
    url: `${SITE.url}/reviews/${slug}`,
  };

  return (
    <SiteShell>
      <ReadingProgress />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* 본문(9칸) 안을 다시 본문 + TOC로 쪼갬: 본문 8 / TOC 4 (총 12) */}
      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-8">
          <header className="mb-12">
            <p className="text-sm font-semibold text-blue-600">
              {meta.field} · {meta.venue} {meta.year}
            </p>
            <h1
              data-pagefind-meta="title"
              className="mt-2 text-4xl font-bold leading-tight"
            >
              {meta.title}
            </h1>
            <p className="mt-3 text-sm text-zinc-500">
              {meta.date} · 태그: {meta.tags.join(', ')}
            </p>
          </header>

          <article
            data-pagefind-body
            className="prose prose-zinc dark:prose-invert max-w-none"
          >
            <MDXContent />
          </article>

          <Comments />
        </div>

        <aside className="col-span-12 lg:col-span-4 hidden lg:block">
          <Toc items={toc} />
        </aside>
      </div>
    </SiteShell>
  );
}
